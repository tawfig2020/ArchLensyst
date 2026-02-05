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

const PayPalPayment: React.FC<Props> = ({ plan, onSuccess, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic Script Loader for PayPal SDK
    const clientId = 'sb'; // Default sandbox for demonstration
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons`;
    script.async = true;
    script.id = 'paypal-sdk';
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('paypal-sdk');
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && window.paypal && paypalRef.current) {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'pill',
          label: 'checkout',
          height: 48
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: `ArchLens ${plan.type} Subscription`,
              amount: {
                currency_code: 'USD',
                value: plan.price.toString()
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          onSuccess(order);
        },
        onError: (err: any) => {
          onError(err);
        }
      }).render(paypalRef.current);
    }
  }, [isLoaded, plan, onSuccess, onError]);

  return (
    <div className="w-full space-y-4">
      <div ref={paypalRef} className="paypal-button-container min-h-[150px]" />
      {!isLoaded && (
        <div className="flex flex-col items-center justify-center p-8 bg-[#161b22] border border-white/5 rounded-2xl animate-pulse">
          <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest mb-4">Initializing Secure Gateway...</div>
          <div className="w-8 h-8 border-2 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin" />
        </div>
      )}
      <div className="flex items-center justify-center gap-2 text-[9px] font-black text-[#3fb950] uppercase opacity-60">
        <ShieldIcon /> Transaction Encrypted via PayPal Vault
      </div>
    </div>
  );
};

export default PayPalPayment;