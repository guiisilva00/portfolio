// ============================================================
// js/supabase.js — Supabase client + Auth helpers
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ⚠️  REPLACE THESE WITH YOUR SUPABASE PROJECT VALUES
// Dashboard → Settings → API
export const SUPABASE_URL = window.SUPABASE_URL || 'https://kpakjmjwbnsgsjjcxwqp.supabase.co';
export const SUPABASE_ANON = window.SUPABASE_ANON || 'sb_publishable_UlwsCqWrSdv6WvlbG-4Tiw_shr0AiRW';

export const sb = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: true, autoRefreshToken: true }
});

// ---- AUTH ----
export const Auth = {
  async signUp(email, password, fullName) {
    const { data, error } = await sb.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signInGoogle() {
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/pages/dashboard.html' }
    });
    if (error) throw error;
  },

  async signOut() {
    await sb.auth.signOut();
    window.location.href = '/index.html';
  },

  async getUser() {
    const { data: { user } } = await sb.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await sb.auth.getSession();
    return session;
  },

  onAuthChange(cb) {
    return sb.auth.onAuthStateChange((event, session) => cb(event, session));
  }
};

// ---- PROFILES ----
export const Profiles = {
  async get(id) {
    const { data, error } = await sb.from('profiles').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await sb.from('profiles').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async uploadAvatar(userId, file) {
    const ext  = file.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;
    const { error: upErr } = await sb.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) throw upErr;
    const { data } = sb.storage.from('avatars').getPublicUrl(path);
    await Profiles.update(userId, { avatar_url: data.publicUrl });
    return data.publicUrl;
  }
};

// ---- ITEMS ----
export const Items = {
  async list({ category, search, city, minPrice, maxPrice, page = 0, limit = 12 } = {}) {
    let q = sb.from('items_with_owner').select('*').eq('is_active', true);
    if (category && category !== 'all') q = q.eq('category_slug', category);
    if (city)     q = q.ilike('city', `%${city}%`);
    if (minPrice) q = q.gte('daily_price', minPrice);
    if (maxPrice) q = q.lte('daily_price', maxPrice);
    if (search)   q = q.textSearch('title', search, { config: 'portuguese' });
    q = q.order('created_at', { ascending: false }).range(page * limit, (page + 1) * limit - 1);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await sb.from('items_with_owner').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async create(item) {
    const user = await Auth.getUser();
    const { data, error } = await sb.from('items').insert({ ...item, owner_id: user.id }).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await sb.from('items').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await sb.from('items').update({ is_active: false }).eq('id', id);
    if (error) throw error;
  },

  async uploadPhotos(itemId, files) {
    const urls = [];
    for (const file of files) {
      const ext  = file.name.split('.').pop();
      const path = `${itemId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await sb.storage.from('item-photos').upload(path, file, {
        cacheControl: '3600', upsert: false
      });
      if (error) throw error;
      const { data } = sb.storage.from('item-photos').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  },

  async getBlockedDates(itemId) {
    const { data, error } = await sb.from('item_availability').select('blocked_date').eq('item_id', itemId);
    if (error) throw error;
    return data.map(d => d.blocked_date);
  },

  async myItems(ownerId) {
    const { data, error } = await sb.from('items').select('*, categories(name,icon)').eq('owner_id', ownerId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getReviews(itemId) {
    const { data, error } = await sb
      .from('reviews')
      .select('*, reviewer:profiles!reviewer_id(full_name,avatar_url)')
      .eq('item_id', itemId)
      .eq('review_type', 'item')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

// ---- BOOKINGS ----
export const Bookings = {
  async create({ itemId, startDate, endDate, totalDays, dailyPrice, securityDeposit = 0, renterNotes = '' }) {
    const user  = await Auth.getUser();
    const item  = await Items.get(itemId);
    const subtotal    = totalDays * dailyPrice;
    const platformFee = parseFloat((subtotal * 0.02).toFixed(2)); // 2% from renter
    const total       = subtotal + platformFee + securityDeposit;

    const { data, error } = await sb.from('bookings').insert({
      item_id:          itemId,
      renter_id:        user.id,
      owner_id:         item.owner_id,
      start_date:       startDate,
      end_date:         endDate,
      total_days:       totalDays,
      daily_price:      dailyPrice,
      subtotal,
      platform_fee:     platformFee,
      security_deposit: securityDeposit,
      total_amount:     total,
      renter_notes:     renterNotes,
      qr_pickup:        crypto.randomUUID(),
      qr_return:        crypto.randomUUID()
    }).select().single();
    if (error) throw error;

    // Notify owner
    await Notifications.send(item.owner_id, 'booking_request', {
      title: 'Nova solicitação de reserva!',
      body:  `${user.email} quer alugar "${item.title}" de ${startDate} a ${endDate}`,
      data:  { booking_id: data.id }
    });
    return data;
  },

  async accept(bookingId, ownerNotes = '') {
    const { data, error } = await sb.from('bookings')
      .update({ status: 'accepted', owner_notes: ownerNotes })
      .eq('id', bookingId).select().single();
    if (error) throw error;
    await Notifications.send(data.renter_id, 'booking_accepted', {
      title: 'Reserva confirmada! 🎉',
      body:  'Sua reserva foi aceita. Confira os detalhes e o QR Code de retirada.',
      data:  { booking_id: bookingId }
    });
    return data;
  },

  async decline(bookingId, reason = '') {
    const { data, error } = await sb.from('bookings')
      .update({ status: 'declined', owner_notes: reason })
      .eq('id', bookingId).select().single();
    if (error) throw error;
    await Notifications.send(data.renter_id, 'booking_declined', {
      title: 'Reserva não confirmada',
      body:  reason || 'O proprietário não pôde aceitar sua solicitação desta vez.',
      data:  { booking_id: bookingId }
    });
    return data;
  },

  async confirmPickup(bookingId, qrToken) {
    const { data: booking } = await sb.from('bookings').select('*').eq('id', bookingId).single();
    if (booking.qr_pickup !== qrToken) throw new Error('QR Code inválido');
    const { data, error } = await sb.from('bookings')
      .update({ status: 'active', pickup_confirmed_at: new Date().toISOString() })
      .eq('id', bookingId).select().single();
    if (error) throw error;
    return data;
  },

  async confirmReturn(bookingId, qrToken) {
    const { data: booking } = await sb.from('bookings').select('*').eq('id', bookingId).single();
    if (booking.qr_return !== qrToken) throw new Error('QR Code inválido');
    const { data, error } = await sb.from('bookings')
      .update({ status: 'completed', return_confirmed_at: new Date().toISOString() })
      .eq('id', bookingId).select().single();
    if (error) throw error;
    // Update owner earnings
    const ownerEarnings = parseFloat((booking.subtotal * 0.90).toFixed(2));
    await sb.from('profiles').update({
      total_earned: sb.rpc('increment_earned', { user_id: booking.owner_id, amount: ownerEarnings })
    });
    await Notifications.send(booking.renter_id, 'return_confirmed', {
      title: 'Devolução confirmada',
      body:  'Por favor, deixe uma avaliação sobre sua experiência.',
      data:  { booking_id: bookingId }
    });
    return data;
  },

  async cancel(bookingId) {
    const user = await Auth.getUser();
    const { data, error } = await sb.from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .in('status', ['pending', 'accepted'])
      .select().single();
    if (error) throw error;
    return data;
  },

  async myBookingsAsRenter(userId) {
    const { data, error } = await sb.from('bookings_full').select('*').eq('renter_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async myBookingsAsOwner(userId) {
    const { data, error } = await sb.from('bookings_full').select('*').eq('owner_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await sb.from('bookings_full').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }
};

// ---- MESSAGES ----
export const Messages = {
  async list(bookingId) {
    const { data, error } = await sb.from('messages')
      .select('*, sender:profiles!sender_id(full_name, avatar_url)')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async send(bookingId, content) {
    const user = await Auth.getUser();
    const { data, error } = await sb.from('messages').insert({
      booking_id: bookingId,
      sender_id:  user.id,
      content
    }).select('*, sender:profiles!sender_id(full_name, avatar_url)').single();
    if (error) throw error;
    return data;
  },

  async markRead(bookingId, userId) {
    await sb.from('messages')
      .update({ is_read: true })
      .eq('booking_id', bookingId)
      .neq('sender_id', userId);
  },

  subscribeToChat(bookingId, callback) {
    return sb.channel(`chat:${bookingId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `booking_id=eq.${bookingId}`
      }, payload => callback(payload.new))
      .subscribe();
  }
};

// ---- REVIEWS ----
export const Reviews = {
  async create({ bookingId, revieweeId, itemId, rating, comment, reviewType }) {
    const user = await Auth.getUser();
    const { data, error } = await sb.from('reviews').insert({
      booking_id:  bookingId,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      item_id:     itemId || null,
      rating, comment,
      review_type: reviewType
    }).select().single();
    if (error) throw error;
    return data;
  },

  async forItem(itemId) {
    const { data, error } = await sb.from('reviews')
      .select('*, reviewer:profiles!reviewer_id(full_name,avatar_url)')
      .eq('item_id', itemId).eq('review_type', 'item')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async forUser(userId) {
    const { data, error } = await sb.from('reviews')
      .select('*, reviewer:profiles!reviewer_id(full_name,avatar_url)')
      .eq('reviewee_id', userId).eq('review_type', 'user')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

// ---- NOTIFICATIONS ----
export const Notifications = {
  async send(userId, type, { title, body, data = {} }) {
    await sb.from('notifications').insert({ user_id: userId, type, title, body, data });
  },

  async list(userId, limit = 20) {
    const { data, error } = await sb.from('notifications')
      .select('*').eq('user_id', userId)
      .order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data;
  },

  async markAllRead(userId) {
    await sb.from('notifications').update({ is_read: true }).eq('user_id', userId);
  },

  subscribe(userId, callback) {
    return sb.channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, payload => callback(payload.new))
      .subscribe();
  }
};

// ---- DISPUTES ----
export const Disputes = {
  async create({ bookingId, againstId, description, evidenceUrls = [] }) {
    const user = await Auth.getUser();
    const { data, error } = await sb.from('disputes').insert({
      booking_id:    bookingId,
      filed_by:      user.id,
      against:       againstId,
      description,
      evidence_urls: evidenceUrls
    }).select().single();
    if (error) throw error;
    await sb.from('bookings').update({ status: 'disputed' }).eq('id', bookingId);
    return data;
  },

  async uploadEvidence(files) {
    const urls = [];
    for (const file of files) {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await sb.storage.from('dispute-evidence').upload(path, file);
      if (error) throw error;
      const { data } = sb.storage.from('dispute-evidence').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }
};

// ---- FAVORITES ----
export const Favorites = {
  async toggle(itemId) {
    const user = await Auth.getUser();
    const { data } = await sb.from('favorites').select('*').eq('user_id', user.id).eq('item_id', itemId).single();
    if (data) {
      await sb.from('favorites').delete().eq('user_id', user.id).eq('item_id', itemId);
      return false;
    } else {
      await sb.from('favorites').insert({ user_id: user.id, item_id: itemId });
      return true;
    }
  },

  async list(userId) {
    const { data, error } = await sb.from('favorites')
      .select('item_id, items_with_owner(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map(f => f.items_with_owner);
  },

  async isFavorited(itemId, userId) {
    const { data } = await sb.from('favorites').select('item_id').eq('user_id', userId).eq('item_id', itemId).single();
    return !!data;
  }
};
