import { District } from '../types';

export const DISTRICTS: District[] = [
  { id: 'miraflores', name: 'Miraflores', cost: 7.00, estimatedTime: '30 - 45 min' },
  { id: 'san-isidro', name: 'San Isidro', cost: 7.00, estimatedTime: '30 - 45 min' },
  { id: 'surco', name: 'Santiago de Surco', cost: 8.00, estimatedTime: '35 - 50 min' },
  { id: 'san-borja', name: 'San Borja', cost: 8.00, estimatedTime: '30 - 45 min' },
  { id: 'barranco', name: 'Barranco', cost: 7.00, estimatedTime: '25 - 40 min' },
  { id: 'surquillo', name: 'Surquillo', cost: 7.00, estimatedTime: '25 - 35 min' },
  { id: 'magdalena', name: 'Magdalena del Mar', cost: 8.00, estimatedTime: '35 - 50 min' },
  { id: 'jesus-maria', name: 'Jesús María', cost: 9.00, estimatedTime: '40 - 55 min' },
  { id: 'lince', name: 'Lince', cost: 8.00, estimatedTime: '35 - 50 min' },
  { id: 'pueblo-libre', name: 'Pueblo Libre', cost: 9.00, estimatedTime: '40 - 55 min' },
  { id: 'san-miguel', name: 'San Miguel', cost: 10.00, estimatedTime: '45 - 60 min' },
  { id: 'la-molina', name: 'La Molina', cost: 11.00, estimatedTime: '45 - 65 min' },
  { id: 'recojo-local', name: 'Recojo en Tienda (Gratis)', cost: 0.00, estimatedTime: 'Listo en 20 min' },
];

export const PAYMENT_CONFIG = {
  businessName: 'Estado Fit',
  phone: '+51 970 380 415',
  whatsappRaw: '51970380415',
  yape: {
    number: '970 380 415',
    rawNumber: '970380415',
    holder: 'Estado Fit Repostería Saludable',
    instructions: 'Transfiere el monto total a nuestro Yape. Al enviar tu pedido por WhatsApp, adjunta la captura de pantalla del comprobante.',
  },
  bcp: {
    accountNumber: '194-98765432-0-12',
    rawAccount: '19498765432012',
    cci: '002-194009876543201215',
    holder: 'Estado Fit S.A.C.',
    type: 'Cuenta Corriente Soles',
    instructions: 'Realiza tu transferencia o transferencia interbancaria (CCI). Envíanos la constancia por WhatsApp para despachar de inmediato.',
  },
};
