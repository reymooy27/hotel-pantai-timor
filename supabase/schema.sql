-- Hotel Pantai Timor - Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ROOMS
-- ============================================
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('standard', 'deluxe', 'suite')),
  description TEXT,
  price_weekday INTEGER NOT NULL, -- in IDR (e.g. 300000)
  price_weekend INTEGER NOT NULL,
  price_high_season INTEGER,
  max_guests INTEGER NOT NULL DEFAULT 2,
  bed_type TEXT, -- 'single', 'double', 'queen', 'king'
  size_sqm INTEGER,
  amenities JSONB DEFAULT '[]', -- ["AC", "WiFi", "TV", "Mini Bar"]
  images JSONB DEFAULT '[]', -- array of image URLs
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT NOT NULL,
  guest_id_number TEXT, -- KTP/passport
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  payment_method TEXT, -- 'cash', 'transfer', 'ewallet'
  notes TEXT,
  admin_notes TEXT,
  source TEXT DEFAULT 'website', -- 'website', 'walkin', 'phone', 'ota'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  guest_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROOM AVAILABILITY (for blocking dates)
-- ============================================
CREATE TABLE room_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id),
  blocked_from DATE NOT NULL,
  blocked_to DATE NOT NULL,
  reason TEXT, -- 'maintenance', 'renovation', 'private'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT block_dates CHECK (blocked_to >= blocked_from)
);

-- ============================================
-- SEASONAL PRICING
-- ============================================
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- 'Natal & Tahun Baru', 'Lebaran'
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.50, -- 1.5x = 50% markup
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_room ON bookings(room_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_room_blocks_dates ON room_blocks(blocked_from, blocked_to);
CREATE INDEX idx_rooms_slug ON rooms(slug);
CREATE INDEX idx_rooms_type ON rooms(type);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Public can read active rooms
CREATE POLICY "Public can view active rooms" ON rooms
  FOR SELECT USING (is_active = true);

-- Public can read approved reviews
CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Public can insert bookings (website bookings)
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Public can read own bookings (by phone)
CREATE POLICY "Public can view own bookings" ON bookings
  FOR SELECT USING (true); -- We'll filter by phone in app layer

-- Admin policies (using auth.uid() for admin users)
-- For now, we'll use service_role key for admin operations
CREATE POLICY "Admin full access on rooms" ON rooms
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access on bookings" ON bookings
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access on reviews" ON reviews
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access on room_blocks" ON room_blocks
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin full access on pricing_rules" ON pricing_rules
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- SEED DATA: Hotel Pantai Timor rooms
-- ============================================
INSERT INTO rooms (name, slug, type, description, price_weekday, price_weekend, price_high_season, max_guests, bed_type, size_sqm, amenities, images) VALUES
(
  'Standard Room',
  'standard',
  'standard',
  'Kamar nyaman dengan AC, TV LED 32", dan kamar mandi pribadi dengan air panas. Cocok untuk perjalanan bisnis atau solo traveler.',
  300000,
  350000,
  400000,
  2,
  'double',
  22,
  '["AC", "TV LED 32\"", "WiFi", "Kamar Mandi Dalam", "Air Panas", "Handuk & Sabun"]',
  '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=85"]'
),
(
  'Deluxe Room',
  'deluxe',
  'deluxe',
  'Ruang lebih luas dengan area duduk, pemandangan kota Kupang, dan sofa. Ideal untuk pasangan atau tamu yang butuh ruang ekstra.',
  450000,
  500000,
  600000,
  2,
  'queen',
  30,
  '["AC", "TV LED 43\"", "WiFi", "Kamar Mandi Dalam", "Air Panas", "Sofa", "Meja Kerja", "Handuk & Sabun", "Air Mineral"]',
  '["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=85"]'
),
(
  'Suite Room',
  'suite',
  'suite',
  'Suite premium dengan ruang tamu terpisah, minibar, dan balkon pemandangan laut. Pengalaman menginap terbaik di Kupang.',
  650000,
  750000,
  900000,
  3,
  'king',
  45,
  '["AC", "TV LED 55\"", "WiFi", "Kamar Mandi Dalam", "Air Panas", "Bathtub", "Ruang Tamu", "Balkon", "Minibar", "Brankas", "Meja Kerja", "Handuk & Sabun", "Air Mineral", "Kopi & Teh"]',
  '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=85"]'
);

-- Seed reviews
INSERT INTO reviews (guest_name, rating, comment, is_approved) VALUES
('Rina', 5, 'Kamar bersih, AC dingin, dan lokasinya sangat strategis. Staf ramah dan membantu. Pasti akan kembali lagi!', true),
('Budi', 4, 'Pengalaman menginap yang nyaman untuk perjalanan bisnis. WiFi cepat dan meeting room-nya bagus.', true),
('Sari', 4, 'Harga terjangkau dengan kualitas yang oke. Dekat dengan pantai dan tempat makan. Recommended!', true);

-- Seed pricing rule
INSERT INTO pricing_rules (name, date_from, date_to, multiplier) VALUES
('Natal & Tahun Baru 2026', '2025-12-20', '2026-01-05', 1.50);
