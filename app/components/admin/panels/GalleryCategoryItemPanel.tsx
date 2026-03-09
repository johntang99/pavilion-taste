import { toSlug } from '@/components/admin/utils/editorHelpers';

interface GalleryCategoryItemPanelProps {
  category: any;
  index: number;
  updateFormValue: (path: string[], value: any) => void;
}

export function GalleryCategoryItemPanel({
  category,
  index,
  updateFormValue,
}: GalleryCategoryItemPanelProps) {
  const isObject = category && typeof category === 'object';
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        {isObject ? category?.name || `Category ${index + 1}` : category || `Category ${index + 1}`}
      </div>
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Category Name"
        value={isObject ? category?.name || '' : String(category || '')}
        onChange={(event) =>
          updateFormValue(
            ['categories', String(index)],
            isObject
              ? { ...category, name: event.target.value, id: toSlug(event.target.value || category?.id || '') }
              : toSlug(event.target.value)
          )
        }
      />
      {isObject && (
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Category ID (slug)"
          value={category?.id || ''}
          onChange={(event) =>
            updateFormValue(['categories', String(index), 'id'], toSlug(event.target.value))
          }
        />
      )}
    </div>
  );
}
