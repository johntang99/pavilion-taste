// ============================================================
// BAAM System F — Chinese Restaurant Premium
// Festivals DB access layer
// ============================================================

import type { Festival, PrixFixeTier } from '@/lib/chinese-restaurant-types';
import { getSupabaseServerClient } from '@/lib/supabase/server';

function rowToFestival(row: any): Festival {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    nameZh: row.name_zh,
    slug: row.slug,
    activeDateStart: row.active_date_start,
    activeDateEnd: row.active_date_end,
    year: row.year,
    heroImage: row.hero_image,
    tagline: row.tagline,
    taglineZh: row.tagline_zh,
    description: row.description,
    descriptionZh: row.description_zh,
    urgencyMessage: row.urgency_message,
    urgencyCount: row.urgency_count,
    isActive: row.is_active,
    isLocked: row.is_locked,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToPrixFixeTier(row: any): PrixFixeTier {
  return {
    id: row.id,
    festivalId: row.festival_id,
    tier: row.tier,
    tierName: row.tier_name,
    tierNameZh: row.tier_name_zh,
    pricePerPerson: row.price_per_person,
    minGuests: row.min_guests,
    courses: Array.isArray(row.courses) ? row.courses : [],
    sortOrder: row.sort_order,
  };
}

/**
 * Get all festivals for a site
 */
export async function getFestivalsBySiteId(siteId: string): Promise<Festival[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('festivals')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_active', true)
      .order('active_date_start', { ascending: true });

    if (error) throw error;
    return (data || []).map(rowToFestival);
  } catch (error) {
    console.error('[festivalsDb] getFestivalsBySiteId error:', error);
    return [];
  }
}

/**
 * Get the currently active festival (date range overlaps today)
 */
export async function getActiveFestival(siteId: string): Promise<Festival | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('festivals')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_active', true)
      .lte('active_date_start', today)
      .gte('active_date_end', today)
      .order('active_date_start', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToFestival(data) : null;
  } catch (error) {
    console.error('[festivalsDb] getActiveFestival error:', error);
    return null;
  }
}

/**
 * Get the next upcoming festival (starts after today)
 */
export async function getNextFestival(siteId: string): Promise<Festival | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('festivals')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_active', true)
      .gt('active_date_start', today)
      .order('active_date_start', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToFestival(data) : null;
  } catch (error) {
    console.error('[festivalsDb] getNextFestival error:', error);
    return null;
  }
}

/**
 * Get festival by slug (for dynamic festival pages)
 */
export async function getFestivalBySlug(siteId: string, slug: string): Promise<Festival | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;
    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from('festivals')
      .select('*')
      .eq('site_id', siteId)
      .eq('slug', slug)
      .eq('is_active', true)
      .gte('year', currentYear)
      .order('year', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToFestival(data) : null;
  } catch (error) {
    console.error('[festivalsDb] getFestivalBySlug error:', error);
    return null;
  }
}

/**
 * Get prix-fixe tiers for a festival
 */
export async function getFestivalPrixFixeTiers(festivalId: string): Promise<PrixFixeTier[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('festival_menu_items')
      .select('*')
      .eq('festival_id', festivalId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(rowToPrixFixeTier);
  } catch (error) {
    console.error('[festivalsDb] getFestivalPrixFixeTiers error:', error);
    return [];
  }
}

/**
 * Get festival with prix-fixe tiers
 */
export async function getFestivalWithMenu(
  siteId: string,
  slug: string
): Promise<Festival | null> {
  const festival = await getFestivalBySlug(siteId, slug);
  if (!festival) return null;

  const tiers = await getFestivalPrixFixeTiers(festival.id);
  return { ...festival, prixFixeTiers: tiers };
}

/**
 * Upsert a festival (admin use)
 */
export async function upsertFestival(
  siteId: string,
  festival: Partial<Festival>
): Promise<Festival | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;
    const payload = {
      site_id: siteId,
      name: festival.name,
      name_zh: festival.nameZh,
      slug: festival.slug,
      active_date_start: festival.activeDateStart,
      active_date_end: festival.activeDateEnd,
      year: festival.year,
      hero_image: festival.heroImage,
      tagline: festival.tagline,
      tagline_zh: festival.taglineZh,
      description: festival.description,
      description_zh: festival.descriptionZh,
      urgency_message: festival.urgencyMessage,
      urgency_count: festival.urgencyCount,
      is_active: festival.isActive ?? true,
      is_locked: festival.isLocked ?? false,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('festivals')
      .upsert(payload, { onConflict: 'site_id,slug,year' })
      .select()
      .single();

    if (error) throw error;
    return data ? rowToFestival(data) : null;
  } catch (error) {
    console.error('[festivalsDb] upsertFestival error:', error);
    return null;
  }
}

/**
 * Delete a festival (admin use — Pipeline B only, not locked festivals)
 */
export async function deleteFestival(siteId: string, festivalId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return false;
    const { error } = await supabase
      .from('festivals')
      .delete()
      .eq('id', festivalId)
      .eq('site_id', siteId)
      .eq('is_locked', false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[festivalsDb] deleteFestival error:', error);
    return false;
  }
}
