import { MessageCircle } from 'lucide-react';

import { HOTEL_INFO } from '@/lib/hotel-data';

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${HOTEL_INFO.whatsappNumber}?text=Halo%20Hotel%20Pantai%20Timor%2C%20saya%20ingin%20cek%20ketersediaan%20kamar.`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[#25d366] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_50px_rgba(37,211,102,0.35)] transition hover:scale-[1.02]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      WhatsApp
    </a>
  );
}
