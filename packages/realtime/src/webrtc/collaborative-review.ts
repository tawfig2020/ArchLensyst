import type { CollaborativeSession } from '@archlens/types';

import { getSocket } from '../socket/client';

// ─── ICE Servers ────────────────────────────────────────────────────────────

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

// ─── WebRTC Peer Manager ────────────────────────────────────────────────────

export interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
}

export class CollaborativeReviewManager {
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private sessionId: string | null = null;

  private onRemoteStream?: (peerId: string, stream: MediaStream) => void;
  private onDataMessage?: (peerId: string, message: string) => void;
  private onPeerJoined?: (peerId: string) => void;
  private onPeerLeft?: (peerId: string) => void;

  constructor(options?: {
    onRemoteStream?: (peerId: string, stream: MediaStream) => void;
    onDataMessage?: (peerId: string, message: string) => void;
    onPeerJoined?: (peerId: string) => void;
    onPeerLeft?: (peerId: string) => void;
  }) {
    this.onRemoteStream = options?.onRemoteStream;
    this.onDataMessage = options?.onDataMessage;
    this.onPeerJoined = options?.onPeerJoined;
    this.onPeerLeft = options?.onPeerLeft;
  }

  async startSession(fileId: string): Promise<string> {
    const socket = getSocket();

    return new Promise<string>((resolve, reject) => {
      socket.emit('review:create', { fileId }, (response: { sessionId: string } | { error: string }) => {
        if ('error' in response) {
          reject(new Error(response.error));
          return;
        }
        this.sessionId = response.sessionId;
        this.setupSignaling();
        resolve(response.sessionId);
      });
    });
  }

  async joinSession(sessionId: string): Promise<void> {
    const socket = getSocket();
    this.sessionId = sessionId;

    socket.emit('review:join', { sessionId });
    this.setupSignaling();
  }

  private setupSignaling(): void {
    const socket = getSocket();

    socket.on('review:peer-joined', async (data: { peerId: string }) => {
      this.onPeerJoined?.(data.peerId);
      await this.createPeerConnection(data.peerId, true);
    });

    socket.on('review:peer-left', (data: { peerId: string }) => {
      this.onPeerLeft?.(data.peerId);
      this.removePeer(data.peerId);
    });

    socket.on('review:offer', async (data: { peerId: string; offer: RTCSessionDescriptionInit }) => {
      await this.handleOffer(data.peerId, data.offer);
    });

    socket.on('review:answer', async (data: { peerId: string; answer: RTCSessionDescriptionInit }) => {
      const peer = this.peers.get(data.peerId);
      if (peer) {
        await peer.connection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    socket.on('review:ice-candidate', async (data: { peerId: string; candidate: RTCIceCandidateInit }) => {
      const peer = this.peers.get(data.peerId);
      if (peer) {
        await peer.connection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
  }

  private async createPeerConnection(peerId: string, isInitiator: boolean): Promise<PeerConnection> {
    const connection = new RTCPeerConnection({
      iceServers: DEFAULT_ICE_SERVERS,
    });

    let dataChannel: RTCDataChannel | null = null;

    if (isInitiator) {
      dataChannel = connection.createDataChannel('archlens-review', {
        ordered: true,
      });
      this.setupDataChannel(peerId, dataChannel);
    }

    connection.ondatachannel = (event) => {
      dataChannel = event.channel;
      this.setupDataChannel(peerId, dataChannel);
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.dataChannel = dataChannel;
      }
    };

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        socket.emit('review:ice-candidate', {
          sessionId: this.sessionId,
          peerId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    connection.ontrack = (event) => {
      if (event.streams[0]) {
        this.onRemoteStream?.(peerId, event.streams[0]);
      }
    };

    // Add local stream tracks if available
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        connection.addTrack(track, this.localStream!);
      });
    }

    const peer: PeerConnection = { peerId, connection, dataChannel };
    this.peers.set(peerId, peer);

    if (isInitiator) {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      const socket = getSocket();
      socket.emit('review:offer', {
        sessionId: this.sessionId,
        peerId,
        offer,
      });
    }

    return peer;
  }

  private async handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    const peer = await this.createPeerConnection(peerId, false);
    await peer.connection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.connection.createAnswer();
    await peer.connection.setLocalDescription(answer);

    const socket = getSocket();
    socket.emit('review:answer', {
      sessionId: this.sessionId,
      peerId,
      answer,
    });
  }

  private setupDataChannel(peerId: string, channel: RTCDataChannel): void {
    channel.onmessage = (event) => {
      this.onDataMessage?.(peerId, event.data as string);
    };

    channel.onopen = () => {
      console.warn(`[ARCHLENS WebRTC] Data channel open with ${peerId}`);
    };

    channel.onclose = () => {
      console.warn(`[ARCHLENS WebRTC] Data channel closed with ${peerId}`);
    };
  }

  sendCodeChange(change: { filePath: string; position: number; text: string }): void {
    const message = JSON.stringify({ type: 'code-change', ...change });
    this.peers.forEach((peer) => {
      if (peer.dataChannel?.readyState === 'open') {
        peer.dataChannel.send(message);
      }
    });
  }

  sendCursorPosition(position: { line: number; column: number }): void {
    const message = JSON.stringify({ type: 'cursor', ...position });
    this.peers.forEach((peer) => {
      if (peer.dataChannel?.readyState === 'open') {
        peer.dataChannel.send(message);
      }
    });
  }

  sendComment(comment: { line: number; text: string; author: string }): void {
    const message = JSON.stringify({ type: 'comment', ...comment });
    this.peers.forEach((peer) => {
      if (peer.dataChannel?.readyState === 'open') {
        peer.dataChannel.send(message);
      }
    });
  }

  private removePeer(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.dataChannel?.close();
      peer.connection.close();
      this.peers.delete(peerId);
    }
  }

  async enableAudio(): Promise<void> {
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.peers.forEach((peer) => {
      this.localStream!.getTracks().forEach((track) => {
        peer.connection.addTrack(track, this.localStream!);
      });
    });
  }

  destroy(): void {
    this.peers.forEach((peer) => {
      peer.dataChannel?.close();
      peer.connection.close();
    });
    this.peers.clear();
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;

    const socket = getSocket();
    if (this.sessionId) {
      socket.emit('review:leave', { sessionId: this.sessionId });
    }
    this.sessionId = null;
  }
}
