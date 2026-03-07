import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { getSupabaseServerClient } from '@/lib/supabase/server';

type Action =
  | 'createCategory'
  | 'updateCategory'
  | 'deleteCategory'
  | 'deleteMenuType'
  | 'createItem'
  | 'updateItem'
  | 'deleteItem';

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeMenuType(value: unknown): string {
  const raw = String(value || '').trim();
  return raw || 'dinner';
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: 'Supabase is not configured' }, { status: 500 });
  }

  const [categoriesRes, itemsRes] = await Promise.all([
    supabase
      .from('menu_categories')
      .select('*')
      .eq('site_id', siteId)
      .order('menu_type', { ascending: true })
      .order('sort_order', { ascending: true }),
    supabase
      .from('menu_items')
      .select('*')
      .eq('site_id', siteId)
      .order('menu_category_id', { ascending: true })
      .order('sort_order', { ascending: true }),
  ]);

  if (categoriesRes.error) {
    return NextResponse.json({ message: categoriesRes.error.message }, { status: 500 });
  }
  if (itemsRes.error) {
    return NextResponse.json({ message: itemsRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    categories: categoriesRes.data || [],
    items: itemsRes.data || [],
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  const siteId = String(payload.siteId || '').trim();
  const action = payload.action as Action | undefined;

  if (!siteId || !action) {
    return NextResponse.json({ message: 'siteId and action are required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: 'Supabase is not configured' }, { status: 500 });
  }

  if (action === 'createCategory') {
    const name = String(payload.name || '').trim();
    const nameZh = String(payload.nameZh || '').trim() || name;
    const slug = toSlug(String(payload.slug || name));
    const menuType = normalizeMenuType(payload.menuType);
    const sortOrder = Number(payload.sortOrder ?? 0) || 0;
    const isActive = payload.isActive !== false;
    const description = String(payload.description || '').trim() || null;
    const descriptionZh = String(payload.descriptionZh || '').trim() || null;

    if (!name || !slug) {
      return NextResponse.json({ message: 'name and slug are required' }, { status: 400 });
    }

    const { error } = await supabase.from('menu_categories').insert({
      site_id: siteId,
      name,
      name_zh: nameZh,
      slug,
      menu_type: menuType,
      description,
      description_zh: descriptionZh,
      sort_order: sortOrder,
      is_active: isActive,
    });
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (action === 'updateCategory') {
    const categoryId = String(payload.categoryId || '').trim();
    if (!categoryId) {
      return NextResponse.json({ message: 'categoryId is required' }, { status: 400 });
    }
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (payload.name !== undefined) updates.name = String(payload.name || '').trim();
    if (payload.nameZh !== undefined) updates.name_zh = String(payload.nameZh || '').trim();
    if (payload.slug !== undefined) updates.slug = toSlug(String(payload.slug || ''));
    if (payload.menuType !== undefined) updates.menu_type = normalizeMenuType(payload.menuType);
    if (payload.description !== undefined) {
      const value = String(payload.description || '').trim();
      updates.description = value || null;
    }
    if (payload.descriptionZh !== undefined) {
      const value = String(payload.descriptionZh || '').trim();
      updates.description_zh = value || null;
    }
    if (payload.sortOrder !== undefined) updates.sort_order = Number(payload.sortOrder ?? 0) || 0;
    if (payload.isActive !== undefined) updates.is_active = Boolean(payload.isActive);

    const { error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('site_id', siteId)
      .eq('id', categoryId);
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (action === 'deleteCategory') {
    const categoryId = String(payload.categoryId || '').trim();
    if (!categoryId) {
      return NextResponse.json({ message: 'categoryId is required' }, { status: 400 });
    }
    const { count, error: countError } = await supabase
      .from('menu_items')
      .select('id', { count: 'exact', head: true })
      .eq('site_id', siteId)
      .eq('menu_category_id', categoryId);
    if (countError) return NextResponse.json({ message: countError.message }, { status: 400 });
    if ((count || 0) > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with existing items. Remove items first.' },
        { status: 400 }
      );
    }
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('site_id', siteId)
      .eq('id', categoryId);
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (action === 'deleteMenuType') {
    const menuType = normalizeMenuType(payload.menuType);
    if (!menuType) {
      return NextResponse.json({ message: 'menuType is required' }, { status: 400 });
    }

    const { data: categoryRows, error: categoriesError } = await supabase
      .from('menu_categories')
      .select('id')
      .eq('site_id', siteId)
      .eq('menu_type', menuType);
    if (categoriesError) {
      return NextResponse.json({ message: categoriesError.message }, { status: 400 });
    }

    const categoryIds = (categoryRows || []).map((row) => row.id).filter(Boolean);
    if (categoryIds.length > 0) {
      const { error: itemsDeleteError } = await supabase
        .from('menu_items')
        .delete()
        .eq('site_id', siteId)
        .in('menu_category_id', categoryIds);
      if (itemsDeleteError) {
        return NextResponse.json({ message: itemsDeleteError.message }, { status: 400 });
      }
    }

    const { error: categoriesDeleteError } = await supabase
      .from('menu_categories')
      .delete()
      .eq('site_id', siteId)
      .eq('menu_type', menuType);
    if (categoriesDeleteError) {
      return NextResponse.json({ message: categoriesDeleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  }

  if (action === 'createItem') {
    const categoryId = String(payload.categoryId || '').trim();
    const name = String(payload.name || '').trim();
    const nameZh = String(payload.nameZh || '').trim() || name;
    const slug = toSlug(String(payload.slug || name));
    if (!categoryId || !name || !slug) {
      return NextResponse.json(
        { message: 'categoryId, name, and slug are required' },
        { status: 400 }
      );
    }
    const { error } = await supabase.from('menu_items').insert({
      site_id: siteId,
      menu_category_id: categoryId,
      name,
      name_zh: nameZh,
      slug,
      description: String(payload.description || '').trim() || null,
      description_zh: String(payload.descriptionZh || '').trim() || null,
      price: payload.price === '' || payload.price == null ? null : Number(payload.price),
      image: String(payload.image || '').trim() || null,
      is_available: payload.isAvailable !== false,
      sort_order: Number(payload.sortOrder ?? 0) || 0,
      is_chef_signature: Boolean(payload.isChefSignature),
    });
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (action === 'updateItem') {
    const itemId = String(payload.itemId || '').trim();
    if (!itemId) {
      return NextResponse.json({ message: 'itemId is required' }, { status: 400 });
    }
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (payload.categoryId !== undefined) updates.menu_category_id = String(payload.categoryId || '').trim() || null;
    if (payload.name !== undefined) updates.name = String(payload.name || '').trim();
    if (payload.nameZh !== undefined) updates.name_zh = String(payload.nameZh || '').trim();
    if (payload.slug !== undefined) updates.slug = toSlug(String(payload.slug || ''));
    if (payload.description !== undefined) {
      const value = String(payload.description || '').trim();
      updates.description = value || null;
    }
    if (payload.descriptionZh !== undefined) {
      const value = String(payload.descriptionZh || '').trim();
      updates.description_zh = value || null;
    }
    if (payload.price !== undefined) {
      updates.price = payload.price === '' || payload.price == null ? null : Number(payload.price);
    }
    if (payload.image !== undefined) {
      const value = String(payload.image || '').trim();
      updates.image = value || null;
    }
    if (payload.isAvailable !== undefined) updates.is_available = Boolean(payload.isAvailable);
    if (payload.sortOrder !== undefined) updates.sort_order = Number(payload.sortOrder ?? 0) || 0;
    if (payload.isChefSignature !== undefined) {
      updates.is_chef_signature = Boolean(payload.isChefSignature);
    }

    const { error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('site_id', siteId)
      .eq('id', itemId);
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (action === 'deleteItem') {
    const itemId = String(payload.itemId || '').trim();
    if (!itemId) {
      return NextResponse.json({ message: 'itemId is required' }, { status: 400 });
    }
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('site_id', siteId)
      .eq('id', itemId);
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
}
