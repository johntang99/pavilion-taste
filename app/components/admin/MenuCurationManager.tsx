'use client';

import { useEffect, useMemo, useState } from 'react';
import type { WeekdayKey } from '@/lib/chinese-restaurant-types';
import { ImagePickerModal } from '@/components/admin/ImagePickerModal';

interface MenuItemOption {
  id: string;
  name: string;
  nameZh: string;
  menuType: string;
  categoryName?: string | null;
  isChefSignature: boolean;
  image?: string | null;
}

const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const DEFAULT_WEEKDAYS: WeekdayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function getTodayWeekday(): WeekdayKey {
  const value = new Date().getDay();
  if (value === 1) return 'monday';
  if (value === 2) return 'tuesday';
  if (value === 3) return 'wednesday';
  if (value === 4) return 'thursday';
  if (value === 5) return 'friday';
  if (value === 6) return 'saturday';
  return 'sunday';
}

export function MenuCurationManager({
  siteId,
  mode = 'all',
}: {
  siteId: string;
  mode?: 'all' | 'daily' | 'signature';
}) {
  const [items, setItems] = useState<MenuItemOption[]>([]);
  const [weekdays, setWeekdays] = useState<WeekdayKey[]>(DEFAULT_WEEKDAYS);
  const [dailyAssignments, setDailyAssignments] = useState<Record<WeekdayKey, string>>({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pendingDaily, setPendingDaily] = useState<WeekdayKey | null>(null);
  const [pendingSignatureId, setPendingSignatureId] = useState<string | null>(null);
  const [pendingImageId, setPendingImageId] = useState<string | null>(null);
  const [imageDrafts, setImageDrafts] = useState<Record<string, string>>({});
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageTargetId, setImageTargetId] = useState<string | null>(null);
  const [sessionRole, setSessionRole] = useState<string | null>(null);

  const loadData = async () => {
    if (!siteId) return;
    setLoading(true);
    setStatus(null);
    try {
      const [itemsRes, specialsRes, sessionRes] = await Promise.all([
        fetch(`/api/admin/menu/items?siteId=${encodeURIComponent(siteId)}`),
        fetch(`/api/admin/menu/daily-specials?siteId=${encodeURIComponent(siteId)}`),
        fetch('/api/admin/auth/session'),
      ]);

      const itemsPayload = await itemsRes.json();
      if (!itemsRes.ok) throw new Error(itemsPayload.message || 'Failed to load menu items');

      const specialsPayload = await specialsRes.json();
      if (!specialsRes.ok) {
        throw new Error(specialsPayload.message || 'Failed to load daily specials');
      }

      const nextItems = (itemsPayload.items || []) as MenuItemOption[];
      setItems(nextItems);
      setImageDrafts(
        Object.fromEntries(nextItems.map((item) => [item.id, String(item.image || '')]))
      );

      const weekList = (specialsPayload.weekdays || DEFAULT_WEEKDAYS) as WeekdayKey[];
      setWeekdays(weekList);

      const nextAssignments: Record<WeekdayKey, string> = {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: '',
      };

      (specialsPayload.assignments || []).forEach((row: any) => {
        if (row?.weekday && row?.menuItemId) {
          nextAssignments[row.weekday as WeekdayKey] = row.menuItemId as string;
        }
      });
      setDailyAssignments(nextAssignments);

      if (sessionRes.ok) {
        const sessionPayload = await sessionRes.json();
        setSessionRole(sessionPayload?.user?.role || null);
      } else {
        setSessionRole(null);
      }
    } catch (error: any) {
      setStatus(error?.message || 'Failed to load menu curation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [siteId]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const haystack = `${item.name} ${item.nameZh} ${item.categoryName || ''} ${item.menuType}`;
      return haystack.toLowerCase().includes(q);
    });
  }, [items, search]);

  const signatureCount = useMemo(() => {
    return items.filter((item) => item.isChefSignature).length;
  }, [items]);

  const canEdit = sessionRole ? ['super_admin', 'site_admin', 'editor'].includes(sessionRole) : true;
  const todayWeekday = getTodayWeekday();

  const updateDailySpecial = async (weekday: WeekdayKey, menuItemId: string) => {
    if (!canEdit) return;
    setPendingDaily(weekday);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/menu/daily-specials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          weekday,
          menuItemId: menuItemId || null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Failed to save daily special');

      const nextAssignments: Record<WeekdayKey, string> = {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: '',
      };
      (payload.assignments || []).forEach((row: any) => {
        if (row?.weekday && row?.menuItemId) {
          nextAssignments[row.weekday as WeekdayKey] = row.menuItemId as string;
        }
      });
      setDailyAssignments(nextAssignments);
      setStatus(`${WEEKDAY_LABELS[weekday]} daily special updated.`);
    } catch (error: any) {
      setStatus(error?.message || 'Failed to save daily special');
    } finally {
      setPendingDaily(null);
    }
  };

  const toggleSignature = async (itemId: string, nextChecked: boolean) => {
    if (!canEdit) return;
    setPendingSignatureId(itemId);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/menu/signatures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          itemId,
          isChefSignature: nextChecked,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Failed to update signature');

      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, isChefSignature: nextChecked } : item
        )
      );
      setStatus("Chef's Signature updated.");
    } catch (error: any) {
      setStatus(error?.message || 'Failed to update signature');
    } finally {
      setPendingSignatureId(null);
    }
  };

  const saveDishImage = async (itemId: string, image: string) => {
    if (!canEdit) return;
    setPendingImageId(itemId);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/menu/signatures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          itemId,
          image: image.trim() || null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Failed to update dish image');
      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, image: image.trim() || null } : item
        )
      );
      setImageDrafts((current) => ({ ...current, [itemId]: image.trim() }));
      setStatus('Dish photo updated.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to update dish image');
    } finally {
      setPendingImageId(null);
    }
  };

  return (
    <div className="mb-8 space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === 'daily'
            ? "Today's Special"
            : mode === 'signature'
              ? "Chef's Signature"
              : 'Homepage Menu Curation'}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {mode === 'daily'
            ? 'Assign one dish for each weekday. Homepage switches automatically.'
            : mode === 'signature'
              ? "Toggle signature dishes from regular Dim Sum + Dinner menus."
              : 'Daily specials auto-switch by weekday. Chef signatures appear on homepage.'}
        </p>
      </div>

      {status && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {status}
        </div>
      )}

      {(mode === 'all' || mode === 'daily') && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Today&apos;s Special by Weekday</h3>
          <span className="text-xs text-gray-500">
            Source: Dim Sum + Dinner menu items
          </span>
        </div>
        {loading ? (
          <div className="text-sm text-gray-500">Loading daily specials...</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {weekdays.map((weekday) => (
              <div
                key={weekday}
                className={`rounded-lg border p-3 ${
                  weekday === todayWeekday ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {WEEKDAY_LABELS[weekday]}
                  </span>
                  {weekday === todayWeekday && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                      Today
                    </span>
                  )}
                </div>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm disabled:opacity-60"
                  value={dailyAssignments[weekday] || ''}
                  disabled={!canEdit || pendingDaily === weekday}
                  onChange={(event) => updateDailySpecial(weekday, event.target.value)}
                >
                  <option value="">No dish assigned</option>
                  {items.map((item) => (
                    <option key={`${weekday}-${item.id}`} value={item.id}>
                      {item.nameZh} / {item.name} ({item.menuType})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {(mode === 'all' || mode === 'signature') && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Chef&apos;s Signature Toggle</h3>
            <p className="text-xs text-gray-500">
              {signatureCount} item(s) currently marked as signature.
            </p>
          </div>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-72"
            placeholder="Search dish or category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-sm text-gray-500">Loading menu items...</div>
        ) : (
          <div className="max-h-[420px] overflow-auto rounded-lg border border-gray-100">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-3 py-2 font-semibold text-gray-700">Dish</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Photo</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Category</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Menu Type</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Signature</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <div className="font-medium text-gray-900">{item.nameZh}</div>
                      <div className="text-xs text-gray-500">{item.name}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-14 overflow-hidden rounded border border-gray-200 bg-gray-50">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            className="w-44 rounded border border-gray-300 px-2 py-1 text-xs"
                            placeholder="Image URL"
                            value={imageDrafts[item.id] ?? ''}
                            onChange={(event) =>
                              setImageDrafts((current) => ({
                                ...current,
                                [item.id]: event.target.value,
                              }))
                            }
                          />
                          <button
                            type="button"
                            disabled={!canEdit || pendingImageId === item.id}
                            onClick={() => saveDishImage(item.id, imageDrafts[item.id] || '')}
                            className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            disabled={!canEdit || pendingImageId === item.id}
                            onClick={() => {
                              setImageTargetId(item.id);
                              setShowImagePicker(true);
                            }}
                            className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                          >
                            Choose
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{item.categoryName || '-'}</td>
                    <td className="px-3 py-2 text-gray-600">{item.menuType}</td>
                    <td className="px-3 py-2">
                      <label className="inline-flex items-center gap-2 text-gray-700">
                        <input
                          type="checkbox"
                          checked={item.isChefSignature}
                          disabled={!canEdit || pendingSignatureId === item.id}
                          onChange={(event) => toggleSignature(item.id, event.target.checked)}
                        />
                        <span className="text-xs">Enable</span>
                      </label>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-500">
                      No menu items matched your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      )}
      <ImagePickerModal
        open={showImagePicker}
        siteId={siteId}
        onClose={() => {
          setShowImagePicker(false);
          setImageTargetId(null);
        }}
        onSelect={(url) => {
          if (!imageTargetId) return;
          void saveDishImage(imageTargetId, url);
          setShowImagePicker(false);
          setImageTargetId(null);
        }}
      />
    </div>
  );
}
