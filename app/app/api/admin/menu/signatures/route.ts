import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import {
  getCurationChefSignatures,
  getMenuCurationItems,
  setChefSignatureFlag,
  setMenuItemImage,
} from '@/lib/menuDb';

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

  const signatures = await getCurationChefSignatures(siteId);
  return NextResponse.json({ signatures });
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  const siteId = payload.siteId as string | undefined;
  const itemId = payload.itemId as string | undefined;
  const isChefSignature = payload.isChefSignature as boolean | undefined;
  const image = payload.image as string | null | undefined;
  const hasSignatureUpdate = typeof isChefSignature === 'boolean';
  const hasImageUpdate = image !== undefined;
  if (!siteId || !itemId || (!hasSignatureUpdate && !hasImageUpdate)) {
    return NextResponse.json(
      { message: 'siteId, itemId, and isChefSignature or image are required' },
      { status: 400 }
    );
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const items = await getMenuCurationItems(siteId);
  if (!items.some((item) => item.id === itemId)) {
    return NextResponse.json(
      { message: 'Chef signature must be a dim-sum or dinner menu item' },
      { status: 400 }
    );
  }

  if (hasSignatureUpdate) {
    const ok = await setChefSignatureFlag(siteId, itemId, Boolean(isChefSignature));
    if (!ok) {
      return NextResponse.json({ message: 'Failed to update signature flag' }, { status: 500 });
    }
  }
  if (hasImageUpdate) {
    const ok = await setMenuItemImage(siteId, itemId, image ?? null);
    if (!ok) {
      return NextResponse.json({ message: 'Failed to update dish image' }, { status: 500 });
    }
  }

  const signatures = await getCurationChefSignatures(siteId);
  return NextResponse.json({ signatures });
}
