import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { EstadoFitLogo } from './EstadoFitLogo';
import { X, Copy, Check, Share2, Download, UtensilsCrossed, Sparkles, Printer } from 'lucide-react';
import { useToast } from './Toast';

interface LocalQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalQrModal: React.FC<LocalQrModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://estadofit.pe';

  // Generate crisp local QR code using QRCode library
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(currentUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#2c4723', // Brand dark olive green
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR:', err);
      });
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('¡Enlace de la carta copiado al portapapeles!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Estado Fit - Carta y Menú Digital',
          text: 'Descubre nuestra carta de repostería saludable y haz tu pedido directo por WhatsApp.',
          url: currentUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Download high-resolution branded table tent card (perfect for print)
  const handleDownloadBrandedCard = async () => {
    try {
      setIsDownloading(true);

      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 1050;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Background
      ctx.fillStyle = '#faf8f2';
      ctx.fillRect(0, 0, width, height);

      // Top Header decorative band
      ctx.fillStyle = '#5b874b';
      ctx.fillRect(0, 0, width, 18);

      // Outer Border
      ctx.strokeStyle = '#d7e4d2';
      ctx.lineWidth = 12;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Inner subtle border
      ctx.strokeStyle = '#5b874b';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // Brand Title "ESTADO FIT"
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1c2817';
      ctx.font = '900 48px "Outfit", "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ESTADO FIT', width / 2, 120);

      // Slogan / Tagline
      ctx.fillStyle = '#5b874b';
      ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('REPOSTERÍA SALUDABLE & PLATOS FIT', width / 2, 160);

      // Subtitle Instructions
      ctx.fillStyle = '#44403c';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('¡Escanea para ver la Carta y Pedir!', width / 2, 215);

      ctx.fillStyle = '#78716c';
      ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Apunta la cámara de tu celular a este código', width / 2, 245);

      // Draw QR Box Container
      const qrBoxSize = 520;
      const qrBoxX = (width - qrBoxSize) / 2;
      const qrBoxY = 280;

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 10;

      // Rounded rectangle for QR frame
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Inner green accent line for QR container
      ctx.strokeStyle = '#e2ebd9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28);
      ctx.stroke();

      // Generate large QR for canvas
      const highResQrUrl = await QRCode.toDataURL(currentUrl, {
        width: 460,
        margin: 1,
        color: {
          dark: '#2c4723',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });

      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.src = highResQrUrl;

      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => {
          ctx.drawImage(qrImg, qrBoxX + 30, qrBoxY + 30, 460, 460);
          resolve();
        };
        qrImg.onerror = reject;
      });

      // Bottom features pill
      const pillY = 855;
      ctx.fillStyle = '#eef5e9';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 240, pillY, 480, 52, 26);
      ctx.fill();

      ctx.fillStyle = '#3c6431';
      ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('🍽️ Mesa  ·  🛵 Delivery  ·  💬 Pedidos WhatsApp', width / 2, pillY + 33);

      // Bottom note
      ctx.fillStyle = '#78716c';
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('WhatsApp de Atención Directa: +51 970 380 415', width / 2, 955);

      ctx.fillStyle = '#a8a29e';
      ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Endulza tus días sin culpa · 100% Avena, cacao puro y sin azúcar refinada', width / 2, 988);

      // Trigger automatic file download
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = 'Estado-Fit-QR-Carta-Imprimir.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('¡Plantilla QR descargada en alta resolución para imprimir!', 'success');
    } catch (error) {
      console.error('Error downloading QR card:', error);
      showToast('No se pudo generar la descarga del QR', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  // Download raw QR code PNG
  const handleDownloadRawQr = () => {
    if (!qrDataUrl) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = qrDataUrl;
    downloadLink.download = 'Estado-Fit-Codigo-QR.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showToast('¡Código QR descargado (PNG)!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 text-center border border-stone-200 dark:border-stone-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Stamp */}
        <div className="flex flex-col items-center">
          <EstadoFitLogo size={48} />
          <h3 className="mt-2 text-lg font-extrabold text-stone-900 dark:text-stone-100 font-display">
            Código QR de Carta Digital
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mt-0.5">
            Escanea desde tu mesa o mostrador para abrir el menú y hacer pedidos al instante.
          </p>
        </div>

        {/* QR Code Presentation Box */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-b from-[#f1f6ec] to-[#e4eedb] dark:from-stone-800 dark:to-stone-850 border-2 border-[#5b874b]/30 shadow-inner flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl shadow-md border border-stone-100 flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Código QR de la Carta Estado Fit"
                className="w-44 h-44 object-contain rounded-lg"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center bg-stone-50 text-stone-400 text-xs font-semibold">
                Cargando código QR...
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#4a703d] dark:text-[#88be73]">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Mesa · Mostrador · Delivery</span>
          </div>
        </div>

        {/* Download Buttons Section */}
        <div className="space-y-2 mb-3">
          {/* Main Primary Download: Ready to Print Table Card */}
          <button
            onClick={handleDownloadBrandedCard}
            disabled={isDownloading}
            className="w-full py-3 px-4 rounded-2xl bg-[#5b874b] hover:bg-[#4a703d] active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#5b874b]/25 transition-all cursor-pointer disabled:opacity-60"
          >
            <Printer className="w-4 h-4" />
            <span>
              {isDownloading ? 'Generando descarga...' : 'Descargar Tarjeta para Imprimir (Mesa)'}
            </span>
          </button>

          {/* Secondary Download: Raw QR PNG */}
          <button
            onClick={handleDownloadRawQr}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#5b874b]" />
            <span>Descargar Solo Código QR (PNG)</span>
          </button>
        </div>

        {/* Secondary Sharing Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/80 dark:border-stone-800">
          <button
            onClick={handleCopyLink}
            className="py-2 px-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Enlace</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="py-2 px-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir</span>
          </button>
        </div>

        <p className="mt-3 text-[10px] text-stone-400">
          Descarga la tarjeta para imprimir en acrílicos de mesa o colocar en tu mostrador de atención.
        </p>
      </div>
    </div>
  );
};
