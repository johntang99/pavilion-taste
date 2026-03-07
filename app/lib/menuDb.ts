// ============================================================
// BAAM System F — Chinese Restaurant Premium
// Menu DB access layer — menu_categories + menu_items
// ============================================================

import type {
  ChineseMenuItem,
  MenuCategory,
  MenuDailySpecial,
  WeekdayKey,
} from '@/lib/chinese-restaurant-types';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const EXCLUDED_MENU_SLUGS = new Set(['buddha-jumps-over-wall']);
export const WEEKDAY_KEYS: WeekdayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const WEEKDAY_INDEX: Record<WeekdayKey, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
};

function isExcludedMenuItem(row: any): boolean {
  if (!row) return false;
  const slug = String(row.slug || '').toLowerCase().trim();
  if (slug && EXCLUDED_MENU_SLUGS.has(slug)) return true;

  const name = String(row.name || '').toLowerCase();
  const nameZh = String(row.name_zh || '').toLowerCase();
  return name.includes('buddha jumps over the wall') || nameZh.includes('佛跳墙');
}

function rowToCategory(row: any): MenuCategory {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    nameZh: row.name_zh || row.name,
    slug: row.slug,
    description: row.description,
    descriptionZh: row.description_zh,
    menuType: row.menu_type || 'dinner',
    hoursOpen: row.hours_open,
    hoursClose: row.hours_close,
    isActive: row.is_active !== false,
    sortOrder: row.sort_order || 0,
  };
}

function rowToMenuItem(row: any): ChineseMenuItem {
  return {
    id: row.id,
    siteId: row.site_id,
    menuCategoryId: row.menu_category_id,
    slug: row.slug,
    name: row.name,
    nameZh: row.name_zh || row.name,
    description: row.description,
    descriptionZh: row.description_zh,
    shortDescription: row.short_description,
    shortDescriptionZh: row.short_description_zh,
    price: row.price,
    priceNote: row.price_note,
    image: row.image,
    originRegion: row.origin_region,
    isDimSum: row.is_dim_sum || false,
    dimSumCategory: row.dim_sum_category,
    isChefSignature: row.is_chef_signature || false,
    chefNote: row.chef_note,
    chefNoteZh: row.chef_note_zh,
    pairingNote: row.pairing_note,
    isHalal: row.is_halal || false,
    isKosher: row.is_kosher || false,
    isVegetarian: row.is_vegetarian || false,
    isVegan: row.is_vegan || false,
    isGlutenFree: row.is_gluten_free || false,
    spiceLevel: row.spice_level,
    isPopular: row.is_popular || false,
    isAvailable: row.is_available !== false,
    isFeatured: row.is_featured || false,
    sortOrder: row.sort_order || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToDailySpecial(row: any): MenuDailySpecial {
  return {
    id: row.id,
    siteId: row.site_id,
    weekday: row.weekday,
    menuItemId: row.menu_item_id,
    item: row.menu_item ? rowToMenuItem(row.menu_item) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface MenuCurationItem extends ChineseMenuItem {
  menuType: string;
  categoryName?: string | null;
  categoryNameZh?: string | null;
}

function rowToCurationItem(row: any): MenuCurationItem {
  return {
    ...rowToMenuItem(row),
    menuType: row.menu_categories?.menu_type || 'dinner',
    categoryName: row.menu_categories?.name || null,
    categoryNameZh: row.menu_categories?.name_zh || null,
  };
}

function getWeekdayKeyForDate(date: Date): WeekdayKey {
  const value = date.getDay();
  if (value === 1) return 'monday';
  if (value === 2) return 'tuesday';
  if (value === 3) return 'wednesday';
  if (value === 4) return 'thursday';
  if (value === 5) return 'friday';
  if (value === 6) return 'saturday';
  return 'sunday';
}

/** Get all active categories for a site, optionally filtered by menu type */
export async function getMenuCategoriesBySiteId(
  siteId: string,
  menuType?: string
): Promise<MenuCategory[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];
    let query = supabase
      .from('menu_categories')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (menuType) query = query.eq('menu_type', menuType);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(rowToCategory);
  } catch (error) {
    console.error('[menuDb] getMenuCategoriesBySiteId error:', error);
    return [];
  }
}

/** Get all menu items for a site, optionally filtered */
export async function getMenuItemsBySiteId(
  siteId: string,
  filters?: {
    isDimSum?: boolean;
    isChefSignature?: boolean;
    dimSumCategory?: string;
    categoryId?: string;
    featured?: boolean;
  }
): Promise<ChineseMenuItem[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_available', true)
      .order('sort_order', { ascending: true });

    if (filters?.isDimSum !== undefined) query = query.eq('is_dim_sum', filters.isDimSum);
    if (filters?.isChefSignature !== undefined) query = query.eq('is_chef_signature', filters.isChefSignature);
    if (filters?.dimSumCategory) query = query.eq('dim_sum_category', filters.dimSumCategory);
    if (filters?.categoryId) query = query.eq('menu_category_id', filters.categoryId);
    if (filters?.featured) query = query.eq('is_featured', true);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).filter((row) => !isExcludedMenuItem(row)).map(rowToMenuItem);
  } catch (error) {
    console.error('[menuDb] getMenuItemsBySiteId error:', error);
    return [];
  }
}

/** Get dim sum items grouped by category */
export async function getDimSumItemsGrouped(
  siteId: string
): Promise<Record<string, ChineseMenuItem[]>> {
  const items = await getMenuItemsBySiteId(siteId, { isDimSum: true });
  const grouped: Record<string, ChineseMenuItem[]> = {};
  for (const item of items) {
    const cat = item.dimSumCategory || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }
  return grouped;
}

/** Get chef signature items */
export async function getChefSignatures(siteId: string): Promise<ChineseMenuItem[]> {
  return getMenuItemsBySiteId(siteId, { isChefSignature: true });
}

/** Get chef signature items with optional cap (for homepage/admin). */
export async function getChefSignaturesLimited(
  siteId: string,
  limit: number
): Promise<ChineseMenuItem[]> {
  const items = await getChefSignatures(siteId);
  return items.slice(0, Math.max(0, limit));
}

/** Get chef signatures restricted to dim-sum + dinner curation pool. */
export async function getCurationChefSignatures(
  siteId: string
): Promise<MenuCurationItem[]> {
  const items = await getMenuCurationItems(siteId);
  return items.filter((item) => item.isChefSignature);
}

/** Get featured menu items (for home page Today's Specials) */
export async function getFeaturedMenuItems(siteId: string, limit = 3): Promise<ChineseMenuItem[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_available', true)
      .or('is_featured.eq.true,is_popular.eq.true,is_chef_signature.eq.true')
      .order('sort_order', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return (data || []).filter((row) => !isExcludedMenuItem(row)).map(rowToMenuItem);
  } catch (error) {
    console.error('[menuDb] getFeaturedMenuItems error:', error);
    return [];
  }
}

/** Get dim sum + dinner menu items for homepage curation controls. */
export async function getMenuCurationItems(siteId: string): Promise<MenuCurationItem[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('menu_items')
      .select(
        `
        *,
        menu_categories:menu_category_id (
          menu_type,
          name,
          name_zh
        )
      `
      )
      .eq('site_id', siteId)
      .eq('is_available', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return (data || [])
      .filter((row) => !isExcludedMenuItem(row))
      .map(rowToCurationItem)
      .filter((row) => row.menuType === 'dim-sum' || row.menuType === 'dinner')
      .sort((a, b) => {
        if (a.menuType !== b.menuType) return a.menuType.localeCompare(b.menuType);
        if ((a.categoryName || '') !== (b.categoryName || '')) {
          return (a.categoryName || '').localeCompare(b.categoryName || '');
        }
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.name.localeCompare(b.name);
      });
  } catch (error) {
    console.error('[menuDb] getMenuCurationItems error:', error);
    return [];
  }
}

/** Get all weekday assignments and joined menu item for a site. */
export async function getDailySpecialAssignments(
  siteId: string
): Promise<MenuDailySpecial[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('menu_daily_specials')
      .select(
        `
        *,
        menu_item:menu_item_id (*)
      `
      )
      .eq('site_id', siteId);

    if (error) throw error;

    return (data || [])
      .filter((row) => !isExcludedMenuItem(row.menu_item))
      .map(rowToDailySpecial)
      .sort((a, b) => WEEKDAY_INDEX[a.weekday] - WEEKDAY_INDEX[b.weekday]);
  } catch (error) {
    console.error('[menuDb] getDailySpecialAssignments error:', error);
    return [];
  }
}

/** Get today's assigned special from DB (auto changes by weekday). */
export async function getTodayDailySpecial(
  siteId: string,
  now: Date = new Date()
): Promise<MenuDailySpecial | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const weekday = getWeekdayKeyForDate(now);
    const { data, error } = await supabase
      .from('menu_daily_specials')
      .select(
        `
        *,
        menu_item:menu_item_id (*)
      `
      )
      .eq('site_id', siteId)
      .eq('weekday', weekday)
      .maybeSingle();

    if (error) throw error;
    if (!data || isExcludedMenuItem(data.menu_item)) return null;

    return rowToDailySpecial(data);
  } catch (error) {
    console.error('[menuDb] getTodayDailySpecial error:', error);
    return null;
  }
}

/** Set or clear weekday assignment for daily special. */
export async function setDailySpecialAssignment(
  siteId: string,
  weekday: WeekdayKey,
  menuItemId: string | null
): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return false;

    if (!menuItemId) {
      const { error } = await supabase
        .from('menu_daily_specials')
        .delete()
        .eq('site_id', siteId)
        .eq('weekday', weekday);
      if (error) throw error;
      return true;
    }

    const { error } = await supabase.from('menu_daily_specials').upsert(
      {
        site_id: siteId,
        weekday,
        menu_item_id: menuItemId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'site_id,weekday' }
    );
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[menuDb] setDailySpecialAssignment error:', error);
    return false;
  }
}

/** Toggle chef signature flag for one menu item. */
export async function setChefSignatureFlag(
  siteId: string,
  menuItemId: string,
  isChefSignature: boolean
): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('menu_items')
      .update({
        is_chef_signature: isChefSignature,
        updated_at: new Date().toISOString(),
      })
      .eq('site_id', siteId)
      .eq('id', menuItemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[menuDb] setChefSignatureFlag error:', error);
    return false;
  }
}

/** Update one menu item's image URL. */
export async function setMenuItemImage(
  siteId: string,
  menuItemId: string,
  image: string | null
): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('menu_items')
      .update({
        image: image && image.trim() ? image.trim() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('site_id', siteId)
      .eq('id', menuItemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[menuDb] setMenuItemImage error:', error);
    return false;
  }
}
