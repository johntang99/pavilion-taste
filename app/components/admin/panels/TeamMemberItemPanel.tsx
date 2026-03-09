import { toSlug } from '@/components/admin/utils/editorHelpers';

interface TeamMemberItemPanelProps {
  member: any;
  index: number;
  categoryOptions: Array<{ id: string; name: string }>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function TeamMemberItemPanel({
  member,
  index,
  categoryOptions,
  updateFormValue,
  openImagePicker,
}: TeamMemberItemPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        {member?.name || `Member ${index + 1}`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="ID (slug)"
          value={member?.id || ''}
          onChange={(event) =>
            updateFormValue(['members', String(index), 'id'], toSlug(event.target.value))
          }
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Name"
          value={member?.name || ''}
          onChange={(event) => updateFormValue(['members', String(index), 'name'], event.target.value)}
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Role"
          value={member?.role || ''}
          onChange={(event) => updateFormValue(['members', String(index), 'role'], event.target.value)}
        />
      </div>
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Short Bio"
        value={member?.shortBio || ''}
        onChange={(event) => updateFormValue(['members', String(index), 'shortBio'], event.target.value)}
      />
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Bio"
        value={member?.bio || ''}
        onChange={(event) => updateFormValue(['members', String(index), 'bio'], event.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 mb-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Photo URL"
          value={member?.photo || ''}
          onChange={(event) => updateFormValue(['members', String(index), 'photo'], event.target.value)}
        />
        <button
          type="button"
          onClick={() => openImagePicker(['members', String(index), 'photo'])}
          className="px-3 rounded-md border border-gray-200 text-xs"
        >
          Choose
        </button>
      </div>
      <select
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white mb-2"
        value={member?.department || ''}
        onChange={(event) => updateFormValue(['members', String(index), 'department'], event.target.value)}
      >
        <option value="">{categoryOptions.length > 0 ? 'Select department' : 'No departments yet'}</option>
        {categoryOptions.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.name}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Display Order"
          type="number"
          value={member?.displayOrder ?? ''}
          onChange={(event) =>
            updateFormValue(
              ['members', String(index), 'displayOrder'],
              event.target.value === '' ? null : Number(event.target.value)
            )
          }
        />
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={Boolean(member?.featured)}
            onChange={(event) => updateFormValue(['members', String(index), 'featured'], event.target.checked)}
            className="rounded border-gray-300"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={member?.active !== false}
            onChange={(event) => updateFormValue(['members', String(index), 'active'], event.target.checked)}
            className="rounded border-gray-300"
          />
          Active
        </label>
      </div>
    </div>
  );
}
