import { toSlug } from '@/components/admin/utils/editorHelpers';

interface GalleryItemPanelProps {
  item: any;
  index: number;
  categoryOptions: Array<{ id: string; name: string }>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function GalleryItemPanel({
  item,
  index,
  categoryOptions,
  updateFormValue,
  openImagePicker,
}: GalleryItemPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        {item?.caption || item?.alt || `Photo ${index + 1}`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="ID (slug)"
          value={item?.id || ''}
          onChange={(event) =>
            updateFormValue(['items', String(index), 'id'], toSlug(event.target.value))
          }
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Display Order"
          type="number"
          value={item?.displayOrder ?? ''}
          onChange={(event) =>
            updateFormValue(
              ['items', String(index), 'displayOrder'],
              event.target.value === '' ? null : Number(event.target.value)
            )
          }
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 mb-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Image URL"
          value={item?.url || ''}
          onChange={(event) => updateFormValue(['items', String(index), 'url'], event.target.value)}
        />
        <button
          type="button"
          onClick={() => openImagePicker(['items', String(index), 'url'])}
          className="px-3 rounded-md border border-gray-200 text-xs"
        >
          Choose
        </button>
      </div>
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Alt text"
        value={item?.alt || ''}
        onChange={(event) => updateFormValue(['items', String(index), 'alt'], event.target.value)}
      />
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Caption"
        value={item?.caption || ''}
        onChange={(event) =>
          updateFormValue(['items', String(index), 'caption'], event.target.value)
        }
      />
      <select
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white mb-2"
        value={item?.category || ''}
        onChange={(event) =>
          updateFormValue(['items', String(index), 'category'], event.target.value)
        }
      >
        <option value="">{categoryOptions.length > 0 ? 'Select category' : 'No categories yet'}</option>
        {categoryOptions.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
        <input
          type="checkbox"
          checked={Boolean(item?.featured)}
          onChange={(event) =>
            updateFormValue(['items', String(index), 'featured'], event.target.checked)
          }
          className="rounded border-gray-300"
        />
        Featured
      </label>
    </div>
  );
}
