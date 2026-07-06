import type { Booking, PricingRule, Review, Room, RoomBlock } from '@/lib/types';

const stamp = '2026-07-01T00:00:00.000Z';

export const HOTEL_INFO = {
  name: 'Hotel Pantai Timor',
  location: 'Kupang, Nusa Tenggara Timur',
  tagline: 'Stay close to Timor coast with warm Kupang hospitality.',
  rating: 4.0,
  reviewCount: 288,
  address: 'Jl. Timor Raya, Kelapa Lima, Kupang, NTT',
  phone: '+62 812-3456-7890',
  email: 'reservasi@hotelpantaitimor.com',
  whatsappNumber: '6281234567890',
  mapEmbed:
    'https://www.google.com/maps?q=Kupang%20Nusa%20Tenggara%20Timur&z=13&output=embed',
};

export const HOTEL_FEATURES = [
  {
    title: 'AC In Every Room',
    description: 'Cool rooms for humid Kupang afternoons and restful nights.',
  },
  {
    title: 'Fast WiFi',
    description: 'Stable connection for business trips, meetings, and streaming.',
  },
  {
    title: 'Meeting Room',
    description: 'Private meeting setup for small team gatherings and workshops.',
  },
  {
    title: 'Airport Transfer',
    description: 'Optional pickup and drop-off service from El Tari Airport.',
  },
];

export const LOCAL_ROOM_FALLBACK: Room[] = [
  {
    id: 'room-standard',
    name: 'Standard Room',
    slug: 'standard',
    type: 'standard',
    description:
      'Compact city-facing room with comfortable double bed, private bathroom, and practical work corner for business or short leisure stays.',
    price_weekday: 300000,
    price_weekend: 350000,
    price_high_season: 400000,
    max_guests: 2,
    bed_type: 'double',
    size_sqm: 22,
    amenities: [
      'AC',
      'WiFi',
      'TV LED 32"',
      'Kamar Mandi Dalam',
      'Air Panas',
      'Meja Kerja',
      'Handuk & Sabun',
    ],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    created_at: stamp,
    updated_at: stamp,
  },
  {
    id: 'room-deluxe',
    name: 'Deluxe Room',
    slug: 'deluxe',
    type: 'deluxe',
    description:
      'Spacious room with queen bed, lounge chair, brighter interiors, and extra room to unwind after exploring Kupang shoreline.',
    price_weekday: 450000,
    price_weekend: 500000,
    price_high_season: 600000,
    max_guests: 2,
    bed_type: 'queen',
    size_sqm: 30,
    amenities: [
      'AC',
      'WiFi',
      'TV LED 43"',
      'Sofa',
      'Meja Kerja',
      'Air Panas',
      'Air Mineral',
      'Kamar Mandi Dalam',
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    created_at: stamp,
    updated_at: stamp,
  },
  {
    id: 'room-suite',
    name: 'Suite Room',
    slug: 'suite',
    type: 'suite',
    description:
      'Premium suite with king bed, separate lounge, private balcony, and elevated comfort for family or executive stays.',
    price_weekday: 650000,
    price_weekend: 750000,
    price_high_season: 900000,
    max_guests: 3,
    bed_type: 'king',
    size_sqm: 45,
    amenities: [
      'AC',
      'WiFi',
      'TV LED 55"',
      'Bathtub',
      'Ruang Tamu',
      'Balkon',
      'Minibar',
      'Brankas',
      'Kopi & Teh',
      'Air Panas',
    ],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    created_at: stamp,
    updated_at: stamp,
  },
];

export const LOCAL_REVIEW_FALLBACK: Review[] = [
  {
    id: 'review-1',
    booking_id: null,
    guest_name: 'Rina',
    rating: 5,
    comment:
      'Kamar bersih, staf sigap, dan lokasi enak buat akses pusat kota Kupang.',
    is_approved: true,
    created_at: stamp,
  },
  {
    id: 'review-2',
    booking_id: null,
    guest_name: 'Budi',
    rating: 4,
    comment:
      'WiFi cepat dan meeting room sangat membantu untuk perjalanan bisnis.',
    is_approved: true,
    created_at: stamp,
  },
  {
    id: 'review-3',
    booking_id: null,
    guest_name: 'Sari',
    rating: 4,
    comment:
      'Harga masuk akal, dekat pantai, dan suasana hotel terasa hangat.',
    is_approved: true,
    created_at: stamp,
  },
  {
    id: 'review-4',
    booking_id: null,
    guest_name: 'Niko',
    rating: 4,
    comment:
      'Suite nyaman untuk keluarga kecil. Balkon sore hari jadi favorit.',
    is_approved: true,
    created_at: stamp,
  },
  {
    id: 'review-5',
    booking_id: null,
    guest_name: 'Mira',
    rating: 5,
    comment:
      'Transfer bandara lancar dan check-in cepat. Cocok untuk tamu luar kota.',
    is_approved: true,
    created_at: stamp,
  },
  {
    id: 'review-6',
    booking_id: null,
    guest_name: 'Hendra',
    rating: 3,
    comment:
      'Pengalaman baik overall, terutama kebersihan kamar dan keramahan staf.',
    is_approved: true,
    created_at: stamp,
  },
];

export const LOCAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'rule-festival-kupang',
    name: 'Festival Musim Liburan Kupang',
    date_from: '2026-08-15',
    date_to: '2026-08-23',
    multiplier: 1.2,
    is_active: true,
    created_at: stamp,
  },
  {
    id: 'rule-year-end',
    name: 'Natal & Tahun Baru 2026',
    date_from: '2026-12-20',
    date_to: '2027-01-05',
    multiplier: 1.5,
    is_active: true,
    created_at: stamp,
  },
];

export type AvailabilityBooking = Pick<
  Booking,
  'id' | 'room_id' | 'check_in' | 'check_out' | 'status'
>;

export const LOCAL_BOOKING_FALLBACK: AvailabilityBooking[] = [
  {
    id: 'booking-1',
    room_id: 'room-standard',
    check_in: '2026-07-10',
    check_out: '2026-07-13',
    status: 'confirmed',
  },
  {
    id: 'booking-2',
    room_id: 'room-standard',
    check_in: '2026-07-18',
    check_out: '2026-07-21',
    status: 'pending',
  },
  {
    id: 'booking-3',
    room_id: 'room-deluxe',
    check_in: '2026-07-08',
    check_out: '2026-07-11',
    status: 'confirmed',
  },
  {
    id: 'booking-4',
    room_id: 'room-deluxe',
    check_in: '2026-07-22',
    check_out: '2026-07-25',
    status: 'confirmed',
  },
  {
    id: 'booking-5',
    room_id: 'room-suite',
    check_in: '2026-07-14',
    check_out: '2026-07-17',
    status: 'confirmed',
  },
];

export const LOCAL_BLOCK_FALLBACK: RoomBlock[] = [
  {
    id: 'block-1',
    room_id: 'room-standard',
    blocked_from: '2026-07-26',
    blocked_to: '2026-07-27',
    reason: 'maintenance',
    created_at: stamp,
  },
  {
    id: 'block-2',
    room_id: 'room-suite',
    blocked_from: '2026-07-29',
    blocked_to: '2026-07-30',
    reason: 'private',
    created_at: stamp,
  },
];
