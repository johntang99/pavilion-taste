import { toSlug } from '@/components/admin/utils/editorHelpers';

interface EventCategoryItemPanelProps {
  category: any;
  index: number;
  updateFormValue: (path: string[], value: any) => void;
}

export function EventCategoryItemPanel({
  category,
  index,
  updateFormValue,
}: EventCategoryItemPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        {category?.name || `Category ${index + 1}`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Category Name"
          value={category?.name || ''}
          onChange={(event) =>
            updateFormValue(['categories', String(index), 'name'], event.target.value)
          }
        />
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Category ID (slug)"
          value={category?.id || ''}
          onChange={(event) =>
            updateFormValue(['categories', String(index), 'id'], toSlug(event.target.value))
          }
        />
      </div>
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Description"
        value={category?.description || ''}
        onChange={(event) =>
          updateFormValue(['categories', String(index), 'description'], event.target.value)
        }
      />
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        type="number"
        placeholder="Order"
        value={category?.order ?? ''}
        onChange={(event) =>
          updateFormValue(
            ['categories', String(index), 'order'],
            event.target.value === '' ? '' : Number(event.target.value)
          )
        }
      />
    </div>
  );
}
