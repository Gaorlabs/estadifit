import React, { useState } from 'react';
import { CartItem, Order, OrderMode } from '../types';
import { PAYMENT_CONFIG } from '../data/districts';
import { ProductVisual } from './ProductVisual';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Copy,
  Check,
  Send,
  Smartphone,
  Landmark,
  MapPin,
  User,
  Phone,
  ShoppingBag,
  Bike,
} from 'lucide-react';
import { useToast } from './Toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onOrderCompleted: (order: Order) => void;
  orderMode: OrderMode;
  onToggleOrderMode?: (mode: OrderMode) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOrderCompleted,
  orderMode,
}) => {
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'bcp'>('yape');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => {
    const unitPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
    return sum + unitPrice * item.quantity;
  }, 0);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`${label} copiado al portapapeles`, 'success');
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleSendOrder = () => {
    // Validations: Name, Phone, and Delivery Address
    if (!customerName.trim()) {
      showToast('Por favor, ingresa tu nombre completo', 'error');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      showToast('Por favor, ingresa tu número de teléfono o celular válido', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Por favor, ingresa tu dirección de entrega', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('El carrito está vacío', 'error');
      return;
    }

    // Generate formatted WhatsApp message for Delivery
    const orderNumber = `EF-${Date.now().toString().slice(-4)}`;
    const paymentLabel = paymentMethod === 'yape' ? 'Yape' : 'BCP (Transferencia)';

    let message = `*¡HOLA ESTADO FIT! DESEO REALIZAR UN PEDIDO DELIVERY* 🛵🥑\n`;
    message += `*Pedido:* #${orderNumber}\n\n`;

    message += `*📋 DATOS DEL CLIENTE:*\n`;
    message += `• *Nombre:* ${customerName.trim()}\n`;
    message += `• *Teléfono:* ${customerPhone.trim()}\n`;
    message += `• *Dirección de Entrega:* ${address.trim()}\n\n`;

    message += `*🛒 PRODUCTOS PEDIDOS:*\n`;
    cart.forEach((item, idx) => {
      const unitPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
      const subtotal = unitPrice * item.quantity;
      const variantText = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
      message += `${idx + 1}. *${item.product.name}*${variantText} x${item.quantity} = S/ ${subtotal.toFixed(2)}\n`;
      if (item.notes) {
        message += `   ↳ _Nota:_ ${item.notes}\n`;
      }
    });

    message += `\n*💰 MONTO TOTAL: S/ ${total.toFixed(2)}*\n`;
    message += `*💳 MÉTODO DE PAGO:* ${paymentLabel}\n\n`;
    message += `Adjunto mi comprobante de pago o confirmación. ¡Muchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${PAYMENT_CONFIG.whatsappRaw}?text=${encodedMessage}`;

    const newOrder: Order = {
      id: orderNumber,
      date: new Date().toISOString(),
      items: cart.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price + (i.selectedVariant?.priceDelta || 0),
        variantName: i.selectedVariant?.name,
      })),
      subtotal: total,
      deliveryCost: 0,
      tip: 0,
      discount: 0,
      total,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      district: 'Lima',
      paymentMethod,
      status: 'enviado',
      orderType: 'delivery',
    };

    onOrderCompleted(newOrder);

    // Open WhatsApp
    window.location.href = whatsappUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Drawer Container */}
      <div className="relative z-10 w-full sm:max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-display">
                Tu Pedido Delivery
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {cart.length} {cart.length === 1 ? 'producto' : 'productos'} · Entrega a domicilio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                Tu carrito está vacío
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Agrega postres o comidas fit desde el catálogo para hacer tu pedido.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Resumen de Productos
              </div>
              {cart.map((item) => {
                const unitPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-200 dark:bg-stone-800">
                      <ProductVisual product={item.product} size="sm" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedVariant && (
                        <span className="text-[10px] text-[#5b874b] dark:text-[#78aa65] font-semibold block">
                          {item.selectedVariant.name}
                        </span>
                      )}
                      <div className="text-xs font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                        S/ {itemTotal.toFixed(2)}
                      </div>
                    </div>

                    {/* Stepper & Delete */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-white dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center font-bold text-xs text-stone-900 dark:text-stone-100 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-[#5b874b] text-white flex items-center justify-center hover:bg-[#4a703d] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-7 h-7 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center cursor-pointer transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {cart.length > 0 && (
            <>
              {/* Formulario Simplificado para Delivery */}
              <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Datos de Entrega para Delivery
                </div>

                {/* Nombre */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#5b874b]" />
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Sofía Ramírez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#5b874b]" />
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: 970 380 415"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5b874b]" />
                    Dirección de Entrega y Referencia *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Av. Benavides 1234 dpto 402, Miraflores (frente al parque)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b] resize-none"
                  />
                </div>
              </div>

              {/* Métodos de Pago para Copiar */}
              <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Métodos de Pago (Toca para copiar datos)
                </div>

                {/* Selector Yape / BCP */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'yape'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700 dark:text-purple-400">
                        <Smartphone className="w-4 h-4" />
                        <span>Yape</span>
                      </div>
                      {paymentMethod === 'yape' && <Check className="w-4 h-4 text-purple-600" />}
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      Transferencia directa al celular
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bcp')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'bcp'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700 dark:text-blue-400">
                        <Landmark className="w-4 h-4" />
                        <span>BCP</span>
                      </div>
                      {paymentMethod === 'bcp' && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      Cuenta en Soles / CCI
                    </p>
                  </button>
                </div>

                {/* Tarjeta de Datos de Pago con Botón de Copiar */}
                {paymentMethod === 'yape' ? (
                  <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 dark:text-purple-300">
                        Número de Yape:
                      </span>
                      <button
                        onClick={() => handleCopy(PAYMENT_CONFIG.yape.rawNumber, 'Número Yape')}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedField === 'Número Yape' ? (
                          <>
                            <Check className="w-3 h-3" /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copiar {PAYMENT_CONFIG.yape.number}
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] text-purple-800 dark:text-purple-300">
                      Titular: <strong>{PAYMENT_CONFIG.yape.holder}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 dark:text-blue-300">
                        Cuenta BCP Soles:
                      </span>
                      <button
                        onClick={() => handleCopy(PAYMENT_CONFIG.bcp.rawAccount, 'Cuenta BCP')}
                        className="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedField === 'Cuenta BCP' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {PAYMENT_CONFIG.bcp.accountNumber}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 dark:text-blue-300">CCI Interbancario:</span>
                      <button
                        onClick={() => handleCopy(PAYMENT_CONFIG.bcp.cci, 'CCI BCP')}
                        className="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedField === 'CCI BCP' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {PAYMENT_CONFIG.bcp.cci}
                      </button>
                    </div>
                    <div className="text-[11px] text-blue-800 dark:text-blue-300">
                      Titular: <strong>{PAYMENT_CONFIG.bcp.holder}</strong>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Total & Send WhatsApp Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Total a pagar:</span>
              <span className="text-xl font-black text-[#5b874b] dark:text-[#78aa65] tabular-nums font-sans">
                S/ {total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleSendOrder}
              className="w-full h-12 rounded-2xl bg-[#5b874b] hover:bg-[#4a703d] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5b874b]/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido por WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-stone-500 dark:text-stone-400">
              Se abrirá WhatsApp con el resumen de tu pedido delivery y datos de envío.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
