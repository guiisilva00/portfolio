-- ============================================================
-- RENTEASE — SUPABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for fuzzy search

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL DEFAULT '',
  username      TEXT UNIQUE,
  avatar_url    TEXT,
  bio           TEXT,
  location      TEXT,
  city          TEXT,
  state         TEXT,
  lat           FLOAT,
  lng           FLOAT,
  phone         TEXT,
  id_verified   BOOLEAN DEFAULT FALSE,
  is_top_host   BOOLEAN DEFAULT FALSE,
  rating_avg    NUMERIC(3,2) DEFAULT 0,
  rating_count  INTEGER DEFAULT 0,
  total_earned  NUMERIC(10,2) DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id    SERIAL PRIMARY KEY,
  slug  TEXT UNIQUE NOT NULL,
  name  TEXT NOT NULL,
  icon  TEXT NOT NULL
);

INSERT INTO public.categories (slug, name, icon) VALUES
  ('tech',    'Tecnologia',   '📷'),
  ('tools',   'Ferramentas',  '🔧'),
  ('outdoor', 'Aventura',     '⛺'),
  ('sports',  'Esporte',      '🚴'),
  ('events',  'Eventos',      '🎉'),
  ('home',    'Casa & Jardim','🏡');

  -- 1. Ativar o Row Level Security (RLS) para a tabela categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. Criar uma política que permite que QUALQUER pessoa (anon ou authenticated) leia as categorias
CREATE POLICY "Allow public read access to categories" 
ON public.categories 
FOR SELECT 
USING (true);

-- ============================================================
-- 3. ITEMS
-- ============================================================
CREATE TABLE public.items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id     INTEGER REFERENCES public.categories(id),
  title           TEXT NOT NULL,
  description     TEXT,
  daily_price     NUMERIC(10,2) NOT NULL,
  security_deposit NUMERIC(10,2) DEFAULT 0,
  location        TEXT,
  city            TEXT,
  state           TEXT,
  lat             FLOAT,
  lng             FLOAT,
  is_active       BOOLEAN DEFAULT TRUE,
  is_high_value   BOOLEAN DEFAULT FALSE,
  photos          TEXT[] DEFAULT '{}',
  tags            TEXT[] DEFAULT '{}',
  rating_avg      NUMERIC(3,2) DEFAULT 0,
  rating_count    INTEGER DEFAULT 0,
  total_rentals   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX items_search_idx ON public.items USING gin(
  to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(description,''))
);
CREATE INDEX items_owner_idx ON public.items(owner_id);
CREATE INDEX items_category_idx ON public.items(category_id);
CREATE INDEX items_active_idx ON public.items(is_active);

-- ============================================================
-- 4. ITEM AVAILABILITY (blocked dates by owner)
-- ============================================================
CREATE TABLE public.item_availability (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id     UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  reason      TEXT DEFAULT 'booked',
  UNIQUE(item_id, blocked_date)
);

-- ============================================================
-- 5. BOOKINGS
-- ============================================================
CREATE TYPE booking_status AS ENUM (
  'pending', 'accepted', 'declined', 'active',
  'completed', 'cancelled', 'disputed'
);

CREATE TABLE public.bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id         UUID NOT NULL REFERENCES public.items(id),
  renter_id       UUID NOT NULL REFERENCES public.profiles(id),
  owner_id        UUID NOT NULL REFERENCES public.profiles(id),
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  total_days      INTEGER NOT NULL,
  daily_price     NUMERIC(10,2) NOT NULL,
  subtotal        NUMERIC(10,2) NOT NULL,
  platform_fee    NUMERIC(10,2) NOT NULL,  -- 12% total
  security_deposit NUMERIC(10,2) DEFAULT 0,
  total_amount    NUMERIC(10,2) NOT NULL,
  status          booking_status DEFAULT 'pending',
  qr_pickup       TEXT,         -- unique token for pickup QR
  qr_return       TEXT,         -- unique token for return QR
  pickup_confirmed_at  TIMESTAMPTZ,
  return_confirmed_at  TIMESTAMPTZ,
  owner_notes     TEXT,
  renter_notes    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX bookings_item_idx    ON public.bookings(item_id);
CREATE INDEX bookings_renter_idx  ON public.bookings(renter_id);
CREATE INDEX bookings_owner_idx   ON public.bookings(owner_id);
CREATE INDEX bookings_status_idx  ON public.bookings(status);

-- ============================================================
-- 6. MESSAGES (chat)
-- ============================================================
CREATE TABLE public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES public.profiles(id),
  content     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX messages_booking_idx ON public.messages(booking_id);
CREATE INDEX messages_sender_idx  ON public.messages(sender_id);

-- ============================================================
-- 7. REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id    UUID NOT NULL REFERENCES public.bookings(id),
  reviewer_id   UUID NOT NULL REFERENCES public.profiles(id),
  reviewee_id   UUID NOT NULL REFERENCES public.profiles(id),
  item_id       UUID REFERENCES public.items(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  review_type   TEXT NOT NULL CHECK (review_type IN ('item','user')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_id, review_type)
);

-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,  -- booking_request, booking_accepted, message, review, dispute
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB DEFAULT '{}',
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX notifications_user_idx ON public.notifications(user_id, is_read);

-- ============================================================
-- 9. DISPUTES
-- ============================================================
CREATE TYPE dispute_status AS ENUM ('open','under_review','resolved','closed');

CREATE TABLE public.disputes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id      UUID NOT NULL REFERENCES public.bookings(id),
  filed_by        UUID NOT NULL REFERENCES public.profiles(id),
  against         UUID NOT NULL REFERENCES public.profiles(id),
  description     TEXT NOT NULL,
  evidence_urls   TEXT[] DEFAULT '{}',
  status          dispute_status DEFAULT 'open',
  resolution      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ
);

-- ============================================================
-- 10. FAVORITES
-- ============================================================
CREATE TABLE public.favorites (
  user_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id   UUID REFERENCES public.items(id)    ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, item_id)
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update item rating when review is added
CREATE OR REPLACE FUNCTION public.update_item_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.items SET
    rating_avg   = (SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE item_id = NEW.item_id AND review_type='item'),
    rating_count = (SELECT COUNT(*) FROM public.reviews WHERE item_id = NEW.item_id AND review_type='item')
  WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_item_rating();

-- Update profile rating when reviewed as user
CREATE OR REPLACE FUNCTION public.update_profile_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.profiles SET
    rating_avg   = (SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE reviewee_id = NEW.reviewee_id AND review_type='user'),
    rating_count = (SELECT COUNT(*) FROM public.reviews WHERE reviewee_id = NEW.reviewee_id AND review_type='user')
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_rating();

-- Block dates when booking is accepted
CREATE OR REPLACE FUNCTION public.block_dates_on_accept()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE d DATE;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    d := NEW.start_date;
    WHILE d <= NEW.end_date LOOP
      INSERT INTO public.item_availability (item_id, blocked_date, reason)
      VALUES (NEW.item_id, d, 'booked')
      ON CONFLICT DO NOTHING;
      d := d + 1;
    END LOOP;
  END IF;
  IF NEW.status IN ('cancelled','declined') AND OLD.status IN ('accepted','active') THEN
    DELETE FROM public.item_availability
    WHERE item_id = NEW.item_id
      AND blocked_date BETWEEN NEW.start_date AND NEW.end_date
      AND reason = 'booked';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_status_change
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.block_dates_on_accept();

-- updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER set_items_updated_at    BEFORE UPDATE ON public.items    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites         ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Public profiles are viewable"    ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users update own profile"        ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ITEMS
CREATE POLICY "Active items are public"         ON public.items FOR SELECT USING (is_active = TRUE OR owner_id = auth.uid());
CREATE POLICY "Owners insert items"             ON public.items FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update their items"       ON public.items FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete their items"       ON public.items FOR DELETE USING (auth.uid() = owner_id);

-- AVAILABILITY
CREATE POLICY "Availability is public"          ON public.item_availability FOR SELECT USING (TRUE);
CREATE POLICY "Owners manage availability"      ON public.item_availability FOR ALL USING (
  EXISTS (SELECT 1 FROM public.items WHERE id = item_id AND owner_id = auth.uid())
);

-- BOOKINGS
CREATE POLICY "Booking parties can view"        ON public.bookings FOR SELECT USING (auth.uid() IN (renter_id, owner_id));
CREATE POLICY "Renters create bookings"         ON public.bookings FOR INSERT WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "Booking parties can update"      ON public.bookings FOR UPDATE USING (auth.uid() IN (renter_id, owner_id));

-- MESSAGES
CREATE POLICY "Chat parties can view messages"  ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND auth.uid() IN (renter_id, owner_id))
);
CREATE POLICY "Chat parties send messages"      ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND auth.uid() IN (renter_id, owner_id))
);
CREATE POLICY "Mark own messages read"          ON public.messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND auth.uid() IN (renter_id, owner_id))
);

-- REVIEWS
CREATE POLICY "Reviews are public"              ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users write own reviews"         ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- NOTIFICATIONS
CREATE POLICY "Own notifications only"          ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Mark own notifications read"     ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- DISPUTES
CREATE POLICY "Dispute parties can view"        ON public.disputes FOR SELECT USING (auth.uid() IN (filed_by, against));
CREATE POLICY "Users file disputes"             ON public.disputes FOR INSERT WITH CHECK (auth.uid() = filed_by);

-- FAVORITES
CREATE POLICY "Own favorites"                   ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS (run separately or via Supabase dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('item-photos', 'item-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('dispute-evidence', 'dispute-evidence', false);

-- Storage policies (via Supabase dashboard > Storage > Policies):
-- item-photos: authenticated users can upload to their own folder
-- avatars: authenticated users can upload/update their own avatar
-- dispute-evidence: only booking parties can upload/view

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

CREATE OR REPLACE VIEW public.items_with_owner AS
SELECT
  i.*,
  c.name AS category_name,
  c.icon AS category_icon,
  c.slug AS category_slug,
  p.full_name   AS owner_name,
  p.avatar_url  AS owner_avatar,
  p.rating_avg  AS owner_rating,
  p.id_verified AS owner_verified,
  p.is_top_host AS owner_top_host
FROM public.items i
JOIN public.profiles p ON p.id = i.owner_id
LEFT JOIN public.categories c ON c.id = i.category_id;

CREATE OR REPLACE VIEW public.bookings_full AS
SELECT
  b.*,
  i.title        AS item_title,
  i.photos       AS item_photos,
  i.daily_price  AS item_daily_price,
  rp.full_name   AS renter_name,
  rp.avatar_url  AS renter_avatar,
  op.full_name   AS owner_name,
  op.avatar_url  AS owner_avatar
FROM public.bookings b
JOIN public.items i    ON i.id = b.item_id
JOIN public.profiles rp ON rp.id = b.renter_id
JOIN public.profiles op ON op.id = b.owner_id;
