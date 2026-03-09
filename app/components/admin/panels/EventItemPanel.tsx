import { toSlug } from '@/components/admin/utils/editorHelpers';

interface EventItemPanelProps {
  item: any;
  index: number;
  eventCategoryOptions: Array<{ id: string; name: string }>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function EventItemPanel({
  item,
  index,
  eventCategoryOptions,
  updateFormValue,
  openImagePicker,
}: EventItemPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        {item?.title || `Event ${index + 1}`}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="ID (slug)"
          value={item?.id || ''}
          onChange={(event) =>
            updateFormValue(['events', String(index), 'id'], toSlug(event.target.value))
          }
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Capacity"
          type="number"
          value={item?.capacity ?? ''}
          onChange={(event) =>
            updateFormValue(
              ['events', String(index), 'capacity'],
              event.target.value === '' ? null : Number(event.target.value)
            )
          }
        />
      </div>

      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Title"
        value={item?.title || ''}
        onChange={(event) =>
          updateFormValue(['events', String(index), 'title'], event.target.value)
        }
      />

      <select
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white mb-2"
        value={item?.category || item?.eventType || ''}
        onChange={(event) => {
          const selected = event.target.value;
          // Keep frontend badge compatibility while using a single editor control.
          updateFormValue(['events', String(index), 'category'], selected);
          updateFormValue(['events', String(index), 'eventType'], selected);
        }}
      >
        <option value="">{eventCategoryOptions.length > 0 ? 'Select category' : 'No categories yet'}</option>
        {eventCategoryOptions.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Short Description"
        value={item?.shortDescription || ''}
        onChange={(event) =>
          updateFormValue(['events', String(index), 'shortDescription'], event.target.value)
        }
      />
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Description"
        value={item?.description || ''}
        onChange={(event) =>
          updateFormValue(['events', String(index), 'description'], event.target.value)
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Start Datetime (ISO)"
          value={item?.startDatetime || ''}
          onChange={(event) =>
            updateFormValue(['events', String(index), 'startDatetime'], event.target.value)
          }
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="End Datetime (ISO)"
          value={item?.endDatetime || ''}
          onChange={(event) =>
            updateFormValue(['events', String(index), 'endDatetime'], event.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 mb-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Image"
          value={item?.image || ''}
          onChange={(event) =>
            updateFormValue(['events', String(index), 'image'], event.target.value)
          }
        />
        <button
          type="button"
          onClick={() => openImagePicker(['events', String(index), 'image'])}
          className="px-3 rounded-md border border-gray-200 text-xs"
        >
          Choose
        </button>
      </div>

      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Tags (comma separated)"
        value={Array.isArray(item?.tags) ? item.tags.join(', ') : ''}
        onChange={(event) =>
          updateFormValue(
            ['events', String(index), 'tags'],
            event.target.value
              .split(',')
              .map((entry) => entry.trim())
              .filter(Boolean)
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Price Per Person"
          type="number"
          value={item?.pricePerPerson ?? ''}
          onChange={(event) =>
            updateFormValue(
              ['events', String(index), 'pricePerPerson'],
              event.target.value === '' ? null : Number(event.target.value)
            )
          }
        />
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={Boolean(item?.reservationRequired)}
            onChange={(event) =>
              updateFormValue(
                ['events', String(index), 'reservationRequired'],
                event.target.checked
              )
            }
            className="rounded border-gray-300"
          />
          Reservation required
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={Boolean(item?.featured)}
            onChange={(event) =>
              updateFormValue(['events', String(index), 'featured'], event.target.checked)
            }
            className="rounded border-gray-300"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={item?.published !== false}
            onChange={(event) =>
              updateFormValue(['events', String(index), 'published'], event.target.checked)
            }
            className="rounded border-gray-300"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={Boolean(item?.cancelled)}
            onChange={(event) =>
              updateFormValue(['events', String(index), 'cancelled'], event.target.checked)
            }
            className="rounded border-gray-300"
          />
          Cancelled
        </label>
      </div>
    </div>
  );
}
