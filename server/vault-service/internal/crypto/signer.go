package crypto

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

type Ed25519Signer struct {
	privateKey ed25519.PrivateKey
	publicKey  ed25519.PublicKey
}

func NewEd25519Signer() (*Ed25519Signer, error) {
	pub, priv, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("failed to generate Ed25519 key pair: %w", err)
	}
	return &Ed25519Signer{privateKey: priv, publicKey: pub}, nil
}

func NewEd25519SignerFromSeed(seedHex string) (*Ed25519Signer, error) {
	seed, err := hex.DecodeString(seedHex)
	if err != nil {
		return nil, fmt.Errorf("invalid seed hex: %w", err)
	}
	if len(seed) != ed25519.SeedSize {
		return nil, fmt.Errorf("seed must be %d bytes, got %d", ed25519.SeedSize, len(seed))
	}
	priv := ed25519.NewKeyFromSeed(seed)
	pub := priv.Public().(ed25519.PublicKey)
	return &Ed25519Signer{privateKey: priv, publicKey: pub}, nil
}

func (s *Ed25519Signer) Sign(data []byte) []byte {
	return ed25519.Sign(s.privateKey, data)
}

func (s *Ed25519Signer) SignHex(data []byte) string {
	return hex.EncodeToString(s.Sign(data))
}

func (s *Ed25519Signer) Verify(data, signature []byte) bool {
	return ed25519.Verify(s.publicKey, data, signature)
}

func (s *Ed25519Signer) VerifyHex(data []byte, signatureHex string) bool {
	sig, err := hex.DecodeString(signatureHex)
	if err != nil {
		return false
	}
	return s.Verify(data, sig)
}

func (s *Ed25519Signer) PublicKeyHex() string {
	return hex.EncodeToString(s.publicKey)
}

func (s *Ed25519Signer) PublicKey() ed25519.PublicKey {
	return s.publicKey
}
