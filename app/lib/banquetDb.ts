// ============================================================
// BAAM System F — Chinese Restaurant Premium
// Banquet Packages DB access layer
// ============================================================

import type { BanquetPackage } from '@/lib/chinese-restaurant-types';
import { getSupabaseServerClient } from '@/lib/supabase/server';

function rowToBanquetPackage(row: any): BanquetPackage {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    nameZh: row.name_zh,
    slug: row.slug,
    tier: row.tier,
    description: row.description,
    descriptionZh: row.description_zh,
    pricePerHead: row.price_per_head,
    minGuests: row.min_guests,
    maxGuests: row.max_guests,
    includes: Array.isArray(row.includes) ? row.includes : [],
    includesZh: Array.isArray(row.includes_zh) ? row.includes_zh : [],
    highlight: row.highlight,
    roomImage: row.room_image,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

/**
 * Get all active banquet packages for a site
 */
export async function getBanquetPackagesBySiteId(siteId: string): Promise<BanquetPackage[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('banquet_packages')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(rowToBanquetPackage);
  } catch (error) {
    console.error('[banquetDb] getBanquetPackagesBySiteId error:', error);
    return [];
  }
}

/**
 * Get banquet package by slug
 */
export async function getBanquetPackageBySlug(
  siteId: string,
  slug: string
): Promise<BanquetPackage | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('banquet_packages')
      .select('*')
      .eq('site_id', siteId)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToBanquetPackage(data) : null;
  } catch (error) {
    console.error('[banquetDb] getBanquetPackageBySlug error:', error);
    return null;
  }
}

/**
 * Upsert a banquet package (admin use)
 */
export async function upsertBanquetPackage(
  siteId: string,
  pkg: Partial<BanquetPackage>
): Promise<BanquetPackage | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;
    const payload = {
      site_id: siteId,
      name: pkg.name,
      name_zh: pkg.nameZh,
      slug: pkg.slug,
      tier: pkg.tier,
      description: pkg.description,
      description_zh: pkg.descriptionZh,
      price_per_head: pkg.pricePerHead,
      min_guests: pkg.minGuests,
      max_guests: pkg.maxGuests,
      includes: pkg.includes || [],
      includes_zh: pkg.includesZh || [],
      highlight: pkg.highlight,
      room_image: pkg.roomImage,
      is_active: pkg.isActive ?? true,
      sort_order: pkg.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('banquet_packages')
      .upsert(payload, { onConflict: 'site_id,slug' })
      .select()
      .single();

    if (error) throw error;
    return data ? rowToBanquetPackage(data) : null;
  } catch (error) {
    console.error('[banquetDb] upsertBanquetPackage error:', error);
    return null;
  }
}

/**
 * Delete a banquet package (admin use)
 */
export async function deleteBanquetPackage(siteId: string, packageId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return false;
    const { error } = await supabase
      .from('banquet_packages')
      .delete()
      .eq('id', packageId)
      .eq('site_id', siteId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[banquetDb] deleteBanquetPackage error:', error);
    return false;
  }
}
