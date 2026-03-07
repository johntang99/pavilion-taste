import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import {
  getDailySpecialAssignments,
  getMenuCurationItems,
  setDailySpecialAssignment,
  WEEKDAY_KEYS,
} from '@/lib/menuDb';
import type { WeekdayKey } from '@/lib/chinese-restaurant-types';

function isWeekdayKey(value: string): value is WeekdayKey {
  return WEEKDAY_KEYS.includes(value as WeekdayKey);
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

  const assignments = await getDailySpecialAssignments(siteId);
  return NextResponse.json({ assignments, weekdays: WEEKDAY_KEYS });
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
  const weekday = payload.weekday as string | undefined;
  const menuItemIdRaw = payload.menuItemId as string | null | undefined;
  const menuItemId = menuItemIdRaw && menuItemIdRaw.trim() ? menuItemIdRaw.trim() : null;

  if (!siteId || !weekday) {
    return NextResponse.json({ message: 'siteId and weekday are required' }, { status: 400 });
  }
  if (!isWeekdayKey(weekday)) {
    return NextResponse.json({ message: 'Invalid weekday' }, { status: 400 });
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (menuItemId) {
    const items = await getMenuCurationItems(siteId);
    if (!items.some((item) => item.id === menuItemId)) {
      return NextResponse.json(
        { message: 'Daily special must be a dim-sum or dinner menu item' },
        { status: 400 }
      );
    }
  }

  const ok = await setDailySpecialAssignment(siteId, weekday, menuItemId);
  if (!ok) {
    return NextResponse.json({ message: 'Failed to save assignment' }, { status: 500 });
  }

  const assignments = await getDailySpecialAssignments(siteId);
  return NextResponse.json({ assignments, weekdays: WEEKDAY_KEYS });
}
