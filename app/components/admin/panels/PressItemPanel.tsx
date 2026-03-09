import { toSlug } from '@/components/admin/utils/editorHelpers';

interface PressItemPanelProps {
  item: any;
  index: number;
  categoryOptions: Array<{ id: string; name: string }>;
  updateFormValue: (path: string[], value: any) => void;
}

export function PressItemPanel({
  item,
  index,
  categoryOptions,
  updateFormValue,
}: PressItemPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        {item?.headline || `Mention ${index + 1}`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="ID"
          value={item?.id || ''}
          onChange={(event) => updateFormValue(['items', String(index), 'id'], toSlug(event.target.value))}
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Publication"
          value={item?.publication || ''}
          onChange={(event) => updateFormValue(['items', String(index), 'publication'], event.target.value)}
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Date (YYYY-MM-DD)"
          value={item?.date || ''}
          onChange={(event) => updateFormValue(['items', String(index), 'date'], event.target.value)}
        />
      </div>
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Headline"
        value={item?.headline || ''}
        onChange={(event) => updateFormValue(['items', String(index), 'headline'], event.target.value)}
      />
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Excerpt"
        value={item?.excerpt || ''}
        onChange={(event) => updateFormValue(['items', String(index), 'excerpt'], event.target.value)}
      />
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Award text"
        value={item?.award || ''}
        onChange={(event) => updateFormValue(['items', String(index), 'award'], event.target.value)}
      />
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="URL"
        value={item?.url || ''}
        onChange={(event) => updateFormValue(['items', String(index), 'url'], event.target.value)}
      />
      <select
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white mb-2"
        value={item?.category || (item?.isAward ? 'awards' : 'press')}
        onChange={(event) => {
          const next = event.target.value;
          updateFormValue(['items', String(index), 'category'], next);
          updateFormValue(['items', String(index), 'isAward'], next === 'awards');
        }}
      >
        <option value="">{categoryOptions.length > 0 ? 'Select category' : 'No categories yet'}</option>
        {categoryOptions.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.name}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={Boolean(item?.featured)}
            onChange={(event) => updateFormValue(['items', String(index), 'featured'], event.target.checked)}
            className="rounded border-gray-300"
          />
          Featured
        </label>
      </div>
    </div>
  );
}
