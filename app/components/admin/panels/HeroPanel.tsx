interface HeroPanelProps {
  hero: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const POSITION_PRESETS = [
  { key: 'top-left', label: 'Top Left', x: 20, y: 28, short: 'TL' },
  { key: 'top-center', label: 'Top Center', x: 50, y: 28, short: 'TC' },
  { key: 'top-right', label: 'Top Right', x: 80, y: 28, short: 'TR' },
  { key: 'middle-left', label: 'Middle Left', x: 20, y: 50, short: 'ML' },
  { key: 'center', label: 'Center', x: 50, y: 50, short: 'C' },
  { key: 'middle-right', label: 'Middle Right', x: 80, y: 50, short: 'MR' },
  { key: 'bottom-left', label: 'Bottom Left', x: 20, y: 72, short: 'BL' },
  { key: 'lower-center', label: 'Lower Center', x: 50, y: 72, short: 'LC' },
  { key: 'bottom-right', label: 'Bottom Right', x: 80, y: 72, short: 'BR' },
] as const;

export function HeroPanel({ hero, updateFormValue, openImagePicker }: HeroPanelProps) {
  const clampPercent = (value: unknown, fallback: number) => {
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(90, Math.max(10, parsed));
  };
  const heroGallery = Array.isArray(hero.gallery) ? hero.gallery : [];
  const setHeroGallery = (nextGallery: string[]) => {
    updateFormValue(['hero', 'gallery'], nextGallery);
  };
  const heroImage = String(hero.image || '');
  const heroBackgroundImage = String(hero.backgroundImage || '');
  const desktopPositionX = clampPercent(hero.contentPositionDesktopX ?? hero.contentPositionX, 50);
  const desktopPositionY = clampPercent(hero.contentPositionDesktopY ?? hero.contentPositionY, 56);
  const mobilePositionX = clampPercent(
    hero.contentPositionMobileX ?? hero.contentPositionDesktopX ?? hero.contentPositionX,
    50
  );
  const mobilePositionY = clampPercent(
    hero.contentPositionMobileY ?? hero.contentPositionDesktopY ?? hero.contentPositionY,
    60
  );
  const applyPreset = (target: 'desktop' | 'mobile', x: number, y: number) => {
    if (target === 'desktop') {
      updateFormValue(['hero', 'contentPositionDesktopX'], x);
      updateFormValue(['hero', 'contentPositionDesktopY'], y);
      return;
    }
    updateFormValue(['hero', 'contentPositionMobileX'], x);
    updateFormValue(['hero', 'contentPositionMobileY'], y);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Hero</div>
      {'title' in hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Title</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.title || ''}
            onChange={(event) => updateFormValue(['hero', 'title'], event.target.value)}
          />
        </div>
      )}
      {'subtitle' in hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Subtitle</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.subtitle || ''}
            onChange={(event) => updateFormValue(['hero', 'subtitle'], event.target.value)}
          />
        </div>
      )}
      {('businessName' in hero || 'clinicName' in hero) && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Business Name</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.businessName || hero.clinicName || ''}
            onChange={(event) =>
              updateFormValue(
                ['hero', 'businessName' in hero ? 'businessName' : 'clinicName'],
                event.target.value
              )
            }
          />
        </div>
      )}
      {'tagline' in hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Tagline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.tagline || ''}
            onChange={(event) => updateFormValue(['hero', 'tagline'], event.target.value)}
          />
        </div>
      )}
      {'description' in hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={hero.description || ''}
            onChange={(event) => updateFormValue(['hero', 'description'], event.target.value)}
          />
        </div>
      )}
      {'backgroundImage' in hero && (
        <div>
          <label className="block text-xs text-gray-500">Background Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={hero.backgroundImage || ''}
              onChange={(event) => updateFormValue(['hero', 'backgroundImage'], event.target.value)}
            />
            {heroBackgroundImage ? (
              <div className="h-10 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                <img
                  src={heroBackgroundImage}
                  alt="Hero background preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => openImagePicker(['hero', 'backgroundImage'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}
      {'image' in hero && (
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={hero.image || ''}
              onChange={(event) => updateFormValue(['hero', 'image'], event.target.value)}
            />
            {heroImage ? (
              <div className="h-10 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                <img src={heroImage} alt="Hero image preview" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => openImagePicker(['hero', 'image'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}
      {('image' in hero || 'variant' in hero) && (
        <div className="mt-4">
          <div className="mb-3 rounded-md border border-gray-200 p-3">
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              Hero Text Position
            </div>
            <div className="text-[11px] text-gray-500 mb-2">
              Separate controls for desktop and mobile.
            </div>
            <div className="grid gap-3 md:grid-cols-2 mb-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Desktop Presets
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {POSITION_PRESETS.map((preset) => (
                    <button
                      key={`desktop-${preset.key}`}
                      type="button"
                      title={preset.label}
                      onClick={() => applyPreset('desktop', preset.x, preset.y)}
                      className="h-7 rounded border border-gray-200 text-[10px] text-gray-600 hover:bg-gray-50"
                    >
                      {preset.short}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Mobile Presets
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {POSITION_PRESETS.map((preset) => (
                    <button
                      key={`mobile-${preset.key}`}
                      type="button"
                      title={preset.label}
                      onClick={() => applyPreset('mobile', preset.x, preset.y)}
                      className="h-7 rounded border border-gray-200 text-[10px] text-gray-600 hover:bg-gray-50"
                    >
                      {preset.short}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Desktop
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs text-gray-500">Horizontal</label>
                  <span className="text-[11px] text-gray-500">{desktopPositionX}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={1}
                  value={desktopPositionX}
                  onChange={(event) =>
                    updateFormValue(['hero', 'contentPositionDesktopX'], Number(event.target.value))
                  }
                  className="mt-1 w-full"
                />
                <div className="mt-2 flex items-center justify-between">
                  <label className="block text-xs text-gray-500">Vertical</label>
                  <span className="text-[11px] text-gray-500">{desktopPositionY}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={1}
                  value={desktopPositionY}
                  onChange={(event) =>
                    updateFormValue(['hero', 'contentPositionDesktopY'], Number(event.target.value))
                  }
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Mobile
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs text-gray-500">Horizontal</label>
                  <span className="text-[11px] text-gray-500">{mobilePositionX}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={1}
                  value={mobilePositionX}
                  onChange={(event) =>
                    updateFormValue(['hero', 'contentPositionMobileX'], Number(event.target.value))
                  }
                  className="mt-1 w-full"
                />
                <div className="mt-2 flex items-center justify-between">
                  <label className="block text-xs text-gray-500">Vertical</label>
                  <span className="text-[11px] text-gray-500">{mobilePositionY}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={1}
                  value={mobilePositionY}
                  onChange={(event) =>
                    updateFormValue(['hero', 'contentPositionMobileY'], Number(event.target.value))
                  }
                  className="mt-1 w-full"
                />
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  updateFormValue(['hero', 'contentPositionDesktopX'], 50);
                  updateFormValue(['hero', 'contentPositionDesktopY'], 56);
                  updateFormValue(['hero', 'contentPositionMobileX'], 50);
                  updateFormValue(['hero', 'contentPositionMobileY'], 60);
                }}
                className="px-2 py-1 rounded-md border border-gray-200 text-xs"
              >
                Reset Position
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs text-gray-500">Gallery Background Images</label>
            <button
              type="button"
              onClick={() => setHeroGallery([...(heroGallery as string[]), ''])}
              className="px-2 py-1 rounded-md border border-gray-200 text-xs"
            >
              Add Photo
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mb-2">
            Used by Home hero when variant is <code>gallery-background</code>.
          </p>
          {heroGallery.length === 0 ? (
            <div className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-md p-3">
              No gallery images yet. Click Add Photo.
            </div>
          ) : (
            <div className="space-y-2">
              {heroGallery.map((url: string, index: number) => (
                <div key={`hero-gallery-${index}`} className="flex gap-2 items-center">
                  <input
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    value={url || ''}
                    onChange={(event) => {
                      const next = [...heroGallery];
                      next[index] = event.target.value;
                      setHeroGallery(next);
                    }}
                    placeholder="https://..."
                  />
                  {url ? (
                    <div className="h-10 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      <img
                        src={String(url)}
                        alt={`Hero gallery image ${index + 1} preview`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openImagePicker(['hero', 'gallery', String(index)])}
                    className="px-3 rounded-md border border-gray-200 text-xs"
                  >
                    Choose
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroGallery(heroGallery.filter((_: string, i: number) => i !== index))}
                    className="px-3 rounded-md border border-red-200 text-red-600 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
