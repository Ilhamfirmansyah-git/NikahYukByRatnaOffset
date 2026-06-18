'use client';

import { useState } from 'react';
import { AmplopDigital as AmplopData } from '@/types/invitation';

interface AmplopDigitalProps {
  amplop: AmplopData;
  primaryColor?: string;
  className?: string;
}

function CopyButton({ text, primaryColor }: { text: string; primaryColor: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };
  return (
    <button
      onClick={copy}
      className="text-xs px-3 py-1.5 rounded-md font-medium text-white transition-opacity hover:opacity-80"
      style={{ backgroundColor: primaryColor }}
    >
      {copied ? 'Tersalin!' : 'Salin'}
    </button>
  );
}

export default function AmplopDigitalComponent({ amplop, primaryColor = '#8B5E3C', className = '' }: AmplopDigitalProps) {
  if (!amplop.aktif) return null;

  return (
    <div className={className}>
      {amplop.rekening.length > 0 && (
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider opacity-60">Transfer Bank</h4>
          {amplop.rekening.map((rek, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white/60">
              <div>
                <p className="text-xs uppercase tracking-wider opacity-60 mb-0.5">{rek.bank}</p>
                <p className="font-mono font-bold text-lg">{rek.nomor}</p>
                <p className="text-sm opacity-70">{rek.atasNama}</p>
              </div>
              <CopyButton text={rek.nomor} primaryColor={primaryColor} />
            </div>
          ))}
        </div>
      )}

      {amplop.eWallet.length > 0 && (
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider opacity-60">E-Wallet</h4>
          {amplop.eWallet.map((ew, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white/60">
              <div>
                <p className="text-xs uppercase tracking-wider opacity-60 mb-0.5">{ew.jenis}</p>
                <p className="font-mono font-bold text-lg">{ew.nomor}</p>
                {ew.qrUrl && (
                  <img src={ew.qrUrl} alt="QR Code" className="w-20 h-20 mt-2 rounded" />
                )}
              </div>
              <CopyButton text={ew.nomor} primaryColor={primaryColor} />
            </div>
          ))}
        </div>
      )}

      {amplop.alamatKado && (
        <div className="p-4 rounded-xl border border-gray-200 bg-white/60">
          <h4 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-2">Alamat Pengiriman Kado</h4>
          <p className="text-sm leading-relaxed">{amplop.alamatKado}</p>
        </div>
      )}
    </div>
  );
}
