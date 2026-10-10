import React, { useState } from 'react';
import { CartItem, District, Order } from '../types';
import { PAYMENT_CONFIG, DISTRICTS } from '../data/districts';
import { X, Copy, Check, Send, Smartphone, Landmark, Banknote, ShieldCheck, MapPin, Bike, UtensilsCrossed } from 'lucide-react';
import { useToast } from './Toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  selectedDistrict: District;
  tip: number;
  couponCode: string;
  appliedDiscount: number;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  selectedDistrict: initialDistrict,
  tip,
  couponCode,
  appliedDiscount,
  onOrderCompleted,
}) => {
  const { showToast } = useToast();

  const [orderType, setOrderType] = useState<'delivery' | 'local'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState<District>(initialDistrict);
  const [tableNumber, setTableNumber] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'bcp' | 'efectivo'>('yape');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
    return sum + unitPrice * item.quantity;
  }, 0);

  const deliveryCost = orderType === 'delivery' ? district.cost : 0;
  const currentTip = orderType === 'delivery' ? tip : 0;
  const total = Math.max(0, subtotal + deliveryCost + currentTip - appliedDiscount);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`¡${label} copiado al portapapeles!`, 'success');
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleConfirmOrder = () => {
    if (!customerName.trim()) {
      showToast('Por favor escribe tu nombre completo', 'error');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      showToast('Por favor escribe tu número de teléfono / WhatsApp', 'error');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      showToast('Por favor ingresa tu dirección para la entrega', 'error');
      return;
    }

    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `EF-${orderNumber}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      id: orderId,
      date: formattedDate,
      items: cart.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price + (i.selectedVariant?.priceDelta || 0),
        variantName: i.selectedVariant?.name,
      })),
      subtotal,
      deliveryCost,
      tip: currentTip,
      discount: appliedDiscount,
      total,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: orderType === 'delivery' ? address.trim() : 'Consumo en Local Estado Fit',
      district: orderType === 'delivery' ? district.name : 'Local / Mesa',
      reference: reference.trim() || undefined,
      paymentMethod,
      status: 'enviado',
      orderType,
      tableNumber: tableNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    // Format clear, professional WhatsApp message
    const itemsListText = cart
      .map((item, idx) => {
        const unit = item.product.price + (item.selectedVariant?.priceDelta || 0);
        const variantStr = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
        const noteStr = item.notes ? `\n   ↳ Nota: ${item.notes}` : '';
        return `${idx + 1}. *${item.product.name}*${variantStr} x${item.quantity} = S/ ${(unit * item.quantity).toFixed(2)}${noteStr}`;
      })
      .join('\n');

    const paymentText =
      paymentMethod === 'yape'
        ? '📱 *Yape* (Adjunto comprobante)'
        : paymentMethod === 'bcp'
        ? '🏦 *Transferencia BCP* (Adjunto constancia)'
        : '💵 *Efectivo / POS*';

    const deliveryHeader =
      orderType === 'delivery'
        ? `🛵 *PEDIDO PARA DELIVERY*
*Cliente:* ${customerName.trim()}
*Teléfono:* ${customerPhone.trim()}
*Distrito:* ${district.name}
*Dirección:* ${address.trim()}
${reference.trim() ? `*Referencia:* ${reference.trim()}\n` : ''}`
        : `🍽️ *PEDIDO EN LOCAL / CARTA DIGITAL*
*Cliente:* ${customerName.trim()}
*Teléfono:* ${customerPhone.trim()}
*Ubicación:* ${tableNumber.trim() ? `Mesa #${tableNumber.trim()}` : 'Para llevar en mostrador'}\n`;

    const whatsappMessage = `*¡HOLA ESTADO FIT! DESEO REALIZAR UN PEDIDO 🍃*
----------------------------------------
*ORDEN:* #${orderId}
*FECHA:* ${formattedDate}

📋 *PRODUCTOS SELECCIONADOS:*
${itemsListText}

----------------------------------------
*SUBTOTAL:* S/ ${subtotal.toFixed(2)}
${orderType === 'delivery' ? `*ENVÍO (${district.name}):* ${deliveryCost === 0 ? 'GRATIS' : `S/ ${deliveryCost.toFixed(2)}`}\n` : '*ENVÍO:* S/ 0.00 (En Local)\n'}${currentTip > 0 ? `*PROPINA REPARTIDOR:* S/ ${currentTip.toFixed(2)}\n` : ''}${appliedDiscount > 0 ? `*DESCUENTO (${couponCode}):* -S/ ${appliedDiscount.toFixed(2)}\n` : ''}💰 *TOTAL A PAGAR: S/ ${total.toFixed(2)}*

----------------------------------------
${deliveryHeader}${notes.trim() ? `*Indicaciones:* ${notes.trim()}\n` : ''}💳 *MÉTODO DE PAGO:*
${paymentText}

Quedo a la espera de su confirmación. ¡Muchas gracias!`.trim();

    // Persist order in local state and history
    onOrderCompleted(newOrder);

    // Open WhatsApp directly
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${PAYMENT_CONFIG.whatsappRaw}?text=${encodedMessage}`;
    window.location.href = whatsappUrl;

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl h-[94vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display">
              Confirmar Pedido
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Datos de entrega y método de pago
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* Order Type Selector: Delivery vs En Local */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
            <button
              onClick={() => setOrderType('delivery')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                orderType === 'delivery'
                  ? 'bg-white dark:bg-stone-700 text-[#5b874b] dark:text-[#88be73] shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>🛵 Delivery</span>
            </button>

            <button
              onClick={() => setOrderType('local')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                orderType === 'local'
                  ? 'bg-white dark:bg-stone-700 text-[#5b874b] dark:text-[#88be73] shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>🍽️ En Local / Mesa</span>
            </button>
          </div>

          {/* Section 1: Customer Details */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#5b874b]" />
              1. {orderType === 'delivery' ? 'Datos de Entrega' : 'Datos para tu Pedido en Local'}
            </span>

            <div>
              <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Tu Nombre y Apellido *
              </label>
              <input
                type="text"
                placeholder="Ej. Valeria Mendoza"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Teléfono / WhatsApp *
              </label>
              <input
                type="tel"
                placeholder="Ej. 987 654 321"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
                required
              />
            </div>

            {orderType === 'delivery' ? (
              <>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Dirección exacta *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Av. Larco 743, Dpto 402"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Distrito de Lima
                  </label>
                  <select
                    value={district.id}
                    onChange={(e) => {
                      const found = DISTRICTS.find((d) => d.id === e.target.value);
                      if (found) setDistrict(found);
                    }}
                    className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b] cursor-pointer"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.cost === 0 ? 'Gratis' : `S/ ${d.cost.toFixed(2)}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Referencia (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Frente al parque, tocar timbre 402"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Número de Mesa o Indicación
                </label>
                <input
                  type="text"
                  placeholder="Ej. Mesa 4, Barra 2, o Para Llevar en Mostrador"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Notas adicionales (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Sin cubiertos, enviar servilletas extra..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
              />
            </div>
          </div>

          {/* Section 2: Payment Methods with Interactive Tabs */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#5b874b]" />
              2. Método de Pago
            </span>

            {/* Interactive Payment Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 dark:bg-stone-800 rounded-xl">
              <button
                onClick={() => setPaymentMethod('yape')}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'yape'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-white/40'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Yape</span>
              </button>

              <button
                onClick={() => setPaymentMethod('bcp')}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'bcp'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-white/40'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>BCP</span>
              </button>

              <button
                onClick={() => setPaymentMethod('efectivo')}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'efectivo'
                    ? 'bg-[#5b874b] text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-white/40'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Efectivo</span>
              </button>
            </div>

            {/* YAPE CONTENT */}
            {paymentMethod === 'yape' && (
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-black text-xs">
                      Y
                    </div>
                    <div>
                      <span className="text-xs font-bold text-purple-900 dark:text-purple-200 block">
                        Yape a Estado Fit
                      </span>
                      <span className="text-[10px] text-purple-700 dark:text-purple-400">
                        {PAYMENT_CONFIG.yape.holder}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-purple-900 dark:text-purple-200 tabular-nums">
                    S/ {total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-purple-100 dark:border-stone-700">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      Número de Yape
                    </span>
                    <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100 tracking-wider">
                      {PAYMENT_CONFIG.yape.number}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(PAYMENT_CONFIG.yape.rawNumber, 'Número de Yape')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedField === 'Número de Yape' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
                  Realiza el pago y al abrirse WhatsApp adjunta la captura del comprobante.
                </p>
              </div>
            )}

            {/* BCP CONTENT */}
            {paymentMethod === 'bcp' && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-800 text-white flex items-center justify-center font-black text-xs">
                      BCP
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block">
                        Banco de Crédito del Perú
                      </span>
                      <span className="text-[10px] text-blue-700 dark:text-blue-400">
                        {PAYMENT_CONFIG.bcp.holder}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-blue-900 dark:text-blue-200 tabular-nums">
                    S/ {total.toFixed(2)}
                  </span>
                </div>

                {/* Account Number */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-800 border border-blue-100 dark:border-stone-700">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-stone-500 uppercase tracking-wider font-semibold">
                      Cuenta BCP
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                      {PAYMENT_CONFIG.bcp.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(PAYMENT_CONFIG.bcp.rawAccount, 'Cuenta BCP')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    {copiedField === 'Cuenta BCP' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar</span>
                  </button>
                </div>

                {/* CCI */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-800 border border-blue-100 dark:border-stone-700">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-stone-500 uppercase tracking-wider font-semibold">
                      CCI Interbancario
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                      {PAYMENT_CONFIG.bcp.cci}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(PAYMENT_CONFIG.bcp.cci, 'Código CCI')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    {copiedField === 'Código CCI' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
              </div>
            )}

            {/* CASH CONTENT */}
            {paymentMethod === 'efectivo' && (
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
                Pagarás en efectivo o con tarjeta POS al momento de recibir tu pedido.
              </div>
            )}
          </div>

          {/* Recap Summary */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-stone-850 border border-emerald-200/80 dark:border-stone-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Total del pedido:
              </span>
              <span className="text-[11px] text-stone-500">
                {cart.length} productos {orderType === 'delivery' ? `· Envío S/ ${deliveryCost.toFixed(2)}` : '· Consumo en local'}
              </span>
            </div>
            <span className="text-xl font-black text-[#5b874b] dark:text-[#78aa65] tabular-nums">
              S/ {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Button: Confirm and open WhatsApp */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
          <button
            onClick={handleConfirmOrder}
            className="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5 fill-white stroke-none" />
            <span>Pedir por WhatsApp · S/ {total.toFixed(2)}</span>
          </button>
          <span className="block text-[11px] text-stone-400 text-center mt-2">
            Se abrirá directamente el chat oficial con el mensaje listo para enviar
          </span>
        </div>
      </div>
    </div>
  );
};
