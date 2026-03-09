import type { Locale, SiteConfig } from '@/lib/types';

interface ContentEditorTopControlsProps {
  sites: SiteConfig[];
  siteId: string;
  locale: Locale;
  supportedLocales: string[];
  setSiteId: (siteId: string) => void;
  setLocale: (locale: Locale) => void;
  actionToolbar: React.ReactNode;
}

export function ContentEditorTopControls({
  sites,
  siteId,
  locale,
  supportedLocales,
  setSiteId,
  setLocale,
  actionToolbar,
}: ContentEditorTopControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <label className="block text-xs font-medium text-gray-500">Site</label>
        <select
          className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={siteId}
          onChange={(event) => {
            setSiteId(event.target.value);
          }}
        >
          {sites.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500">Locale</label>
        <select
          className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={locale}
          onChange={(event) => setLocale(event.target.value as Locale)}
        >
          {(supportedLocales || ['en']).map((item) => (
            <option key={item} value={item}>
              {item === 'en' ? 'English' : item === 'zh' ? 'Chinese' : item}
            </option>
          ))}
        </select>
      </div>
      {actionToolbar}
    </div>
  );
}
