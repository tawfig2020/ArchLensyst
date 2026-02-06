/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-PAYMENT-GATEWAY-SECURE
 */

import React, { useEffect, useRef, useState } from 'react';
import { PlanConfig } from '../types';
import { ShieldIcon } from './Icons';

interface Props {
  plan: PlanConfig;
  onSuccess: (details: any) => void;
  onError: (err: any) => void;
}

declare global {
  interface Window {
    paypal: any;
  }
}

interface PaymentError {
  type: 'network' | 'validation' | 'declined' | 'timeout' | 'unknown';
  message: string;
  userMessage: string;
  retryable: boolean;
}

const PayPalPayment: React.FC<Props> = ({ plan, onSuccess, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const paypalRef = useRef<HTMLDivElement>(null);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    if (!clientId) {
      console.warn('[PAYMENT_SECURITY] PayPal client ID not configured. Payment gateway restricted.');
      setIsConfigured(false);
      setError({
        type: 'validation',
        message: 'PayPal client ID not configured',
        userMessage: 'Payment system is not configured. Please contact support.',
        retryable: false
      });
      return;
    }

    setIsConfigured(true);

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons`;
    script.async = true;
    script.id = 'paypal-sdk';

    script.onload = () => {
      setIsLoaded(true);
      setError(null);
    };

    script.onerror = () => {
      setError({
        type: 'network',
        message: 'Failed to load PayPal SDK',
        userMessage: 'Unable to connect to payment service. Please check your internet connection and try again.',
        retryable: true
      });
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('paypal-sdk');
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, [retryCount]);

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setError(null);
      setIsLoaded(false);
    }
  };

  const categorizeError = (err: any): PaymentError => {
    const errorMessage = err?.message || err?.toString() || 'Unknown error';

    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return {
        type: 'network',
        message: errorMessage,
        userMessage: 'Network connection issue. Please check your internet and try again.',
        retryable: true
      };
    }

    if (errorMessage.includes('declined') || errorMessage.includes('insufficient')) {
      return {
        type: 'declined',
        message: errorMessage,
        userMessage: 'Payment was declined. Please check your payment method or try a different one.',
        retryable: false
      };
    }

    if (errorMessage.includes('timeout')) {
      return {
        type: 'timeout',
        message: errorMessage,
        userMessage: 'Payment processing timed out. Please try again.',
        retryable: true
      };
    }

    return {
      type: 'unknown',
      message: errorMessage,
      userMessage: 'An unexpected error occurred. Please try again or contact support.',
      retryable: true
    };
  };

  useEffect(() => {
    if (isLoaded && window.paypal && paypalRef.current && isConfigured) {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'pill',
          label: 'checkout',
          height: 48
        },
        createOrder: (data: any, actions: any) => {
          try {
            setIsProcessing(true);
            setError(null);

            return actions.order.create({
              purchase_units: [{
                description: `ArchLens ${plan.type} Subscription`,
                amount: {
                  currency_code: 'USD',
                  value: plan.price.toString()
                }
              }]
            });
          } catch (err) {
            const paymentError = categorizeError(err);
            setError(paymentError);
            setIsProcessing(false);
            onError(err);
            throw err;
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setIsProcessing(true);
            const order = await actions.order.capture();
            setIsProcessing(false);
            setError(null);
            onSuccess(order);
          } catch (err) {
            const paymentError = categorizeError(err);
            setError(paymentError);
            setIsProcessing(false);
            onError(err);
          }
        },
        onCancel: () => {
          setIsProcessing(false);
          setError({
            type: 'validation',
            message: 'Payment cancelled by user',
            userMessage: 'Payment was cancelled. You can try again when ready.',
            retryable: true
          });
        },
        onError: (err: any) => {
          const paymentError = categorizeError(err);
          setError(paymentError);
          setIsProcessing(false);
          onError(err);
        }
      }).render(paypalRef.current);
    }
  }, [isLoaded, plan, onSuccess, onError, isConfigured]);

  return (
    <div className="w-full space-y-4">
      {/* Error Display */}
      {error && (
        <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${
          error.type === 'declined' || error.type === 'validation' 
            ? 'bg-[#f851490a] border-[#f8514933]' 
            : 'bg-[#d291120a] border-[#d2911233]'
        }`}>
          <div className={`text-[11px] font-black uppercase tracking-widest mb-3 ${
            error.type === 'declined' || error.type === 'validation' ? 'text-[#f85149]' : 'text-[#d29112]'
          }`}>
            {error.type === 'network' && '🌐 Connection Error'}
            {error.type === 'declined' && '❌ Payment Declined'}
            {error.type === 'timeout' && '⏱️ Timeout Error'}
            {error.type === 'validation' && '⚠️ Configuration Error'}
            {error.type === 'unknown' && '⚠️ Payment Error'}
          </div>
          <p className="text-[10px] text-[#e6edf3] text-center max-w-md mb-4">
            {error.userMessage}
          </p>
          {error.retryable && retryCount < MAX_RETRIES && (
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-[#2f81f7] hover:bg-[#1f6feb] text-white text-[10px] font-bold rounded-lg transition-colors"
            >
              Retry ({MAX_RETRIES - retryCount} attempts remaining)
            </button>
          )}
          {!error.retryable && (
            <p className="text-[9px] text-[#8b949e] mt-2">
              Please contact support if this issue persists.
            </p>
          )}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-6 bg-[#2f81f70a] border border-[#2f81f733] rounded-2xl">
          <div className="w-10 h-10 border-3 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin mb-3" />
          <div className="text-[10px] font-black text-[#2f81f7] uppercase tracking-widest">
            Processing Payment...
          </div>
          <p className="text-[9px] text-[#8b949e] mt-2">
            Please do not close this window
          </p>
        </div>
      )}

      {/* Payment Gateway */}
      {!isConfigured ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[#f851490a] border border-[#f8514933] rounded-2xl">
          <div className="text-[10px] font-black text-[#f85149] uppercase tracking-widest mb-4">⚠️ Payment Gateway Not Configured</div>
          <p className="text-[9px] text-[#8b949e] text-center max-w-md">
            PayPal client credentials are missing. Configure PAYPAL_CLIENT_ID environment variable to enable secure transactions.
          </p>
        </div>
      ) : (
        <>
          <div ref={paypalRef} className="paypal-button-container min-h-[150px]" />
          {!isLoaded && !error && (
            <div className="flex flex-col items-center justify-center p-8 bg-[#161b22] border border-white/5 rounded-2xl animate-pulse">
              <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest mb-4">Initializing Secure Gateway...</div>
              <div className="w-8 h-8 border-2 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin" />
              {retryCount > 0 && (
                <p className="text-[9px] text-[#8b949e] mt-3">
                  Retry attempt {retryCount}/{MAX_RETRIES}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-[9px] font-black text-[#3fb950] uppercase opacity-60">
        <ShieldIcon /> Transaction Encrypted via PayPal Vault
      </div>

      {/* Help Text */}
      <div className="text-center text-[8px] text-[#8b949e] space-y-1">
        <p>Secure payment processing powered by PayPal</p>
        <p>Your payment information is never stored on our servers</p>
      </div>
    </div>
  );
};

export default PayPalPayment;