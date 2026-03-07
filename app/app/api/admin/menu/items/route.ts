import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { getMenuCurationItems } from '@/lib/menuDb';

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

  const items = await getMenuCurationItems(siteId);
  return NextResponse.json({ items });
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
  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const items = await getMenuCurationItems(siteId);
  return NextResponse.json({ items });
}
