export interface Room {
  id: string;
  name: string;
  slug: string;
  type: 'standard' | 'deluxe' | 'suite';
  description: string | null;
  price_weekday: number;
  price_weekend: number;
  price_high_season: number | null;
  max_guests: number;
  bed_type: string | null;
  size_sqm: number | null;
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string;
  guest_id_number: string | null;
  check_in: string;
  check_out: string;
  num_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  payment_method: string | null;
  notes: string | null;
  admin_notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  // Joined
  room?: Room;
}

export interface Review {
  id: string;
  booking_id: string | null;
  guest_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface RoomBlock {
  id: string;
  room_id: string;
  blocked_from: string;
  blocked_to: string;
  reason: string | null;
  created_at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  date_from: string;
  date_to: string;
  multiplier: number;
  is_active: boolean;
  created_at: string;
}

export interface BookingFormData {
  room_id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone: string;
  guest_id_number?: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  notes?: string;
}
