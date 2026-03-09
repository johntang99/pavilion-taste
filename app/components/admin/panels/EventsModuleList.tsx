interface ContentFileRef {
  id: string;
  path: string;
}

interface EventsModuleListProps {
  eventsPageFile: ContentFileRef | null;
  eventsDataFile: ContentFileRef | null;
  isEventsPageSettingsSelected: boolean;
  isEventsDataSettingsSelected: boolean;
  isEventsPageFileActive: boolean;
  isEventsDataFileActive: boolean;
  activeEventCategoryIndex: number;
  activeEventIndex: number;
  categories: any[];
  eventItems: any[];
  setActiveFile: (file: ContentFileRef | null) => void;
  setActiveEventCategoryIndex: (index: number) => void;
  setActiveEventIndex: (index: number) => void;
  addEventCategory: () => void;
  removeEventCategory: (index: number) => void;
  addEventItem: () => void;
  removeEventItem: (index: number) => void;
}

export function EventsModuleList({
  eventsPageFile,
  eventsDataFile,
  isEventsPageSettingsSelected,
  isEventsDataSettingsSelected,
  isEventsPageFileActive,
  isEventsDataFileActive,
  activeEventCategoryIndex,
  activeEventIndex,
  categories,
  eventItems,
  setActiveFile,
  setActiveEventCategoryIndex,
  setActiveEventIndex,
  addEventCategory,
  removeEventCategory,
  addEventItem,
  removeEventItem,
}: EventsModuleListProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (eventsPageFile) setActiveFile(eventsPageFile);
          setActiveEventCategoryIndex(-1);
          setActiveEventIndex(-1);
        }}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
          isEventsPageSettingsSelected
            ? 'bg-[var(--primary)] text-white'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <div className="font-medium">Page Settings</div>
        <div className="text-xs opacity-70">hero / cta</div>
      </button>
      {eventsDataFile && (
        <button
          type="button"
          onClick={() => {
            setActiveFile(eventsDataFile);
            setActiveEventCategoryIndex(-1);
            setActiveEventIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isEventsDataSettingsSelected
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">Events Data</div>
          <div className="text-xs opacity-70">categories / events</div>
        </button>
      )}

      <div className="pt-1 text-[11px] font-semibold text-gray-500 uppercase">Categories</div>
      <button
        type="button"
        onClick={addEventCategory}
        disabled={!isEventsDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Category
      </button>
      <button
        type="button"
        disabled={!isEventsDataFileActive || activeEventCategoryIndex < 0}
        onClick={() => {
          if (!isEventsDataFileActive || activeEventCategoryIndex < 0) return;
          removeEventCategory(activeEventCategoryIndex);
        }}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Category
      </button>
      {categories.map((category: any, index: number) => (
        <button
          key={`${category?.id || 'category'}-${index}`}
          type="button"
          onClick={() => {
            if (eventsDataFile) setActiveFile(eventsDataFile);
            setActiveEventCategoryIndex(index);
            setActiveEventIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isEventsDataFileActive && activeEventCategoryIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{category?.name || `Category ${index + 1}`}</div>
          <div className="text-xs opacity-70">{category?.id || `#${index + 1}`}</div>
        </button>
      ))}

      <div className="pt-2 text-[11px] font-semibold text-gray-500 uppercase">Events</div>
      <button
        type="button"
        onClick={addEventItem}
        disabled={!isEventsDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Event
      </button>
      <button
        type="button"
        disabled={!isEventsDataFileActive || activeEventIndex < 0}
        onClick={() => {
          if (activeEventIndex < 0) return;
          removeEventItem(activeEventIndex);
        }}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Event
      </button>
      {eventItems.map((item: any, index: number) => (
        <button
          key={`${item?.id || 'event'}-${index}`}
          type="button"
          onClick={() => {
            if (eventsDataFile) setActiveFile(eventsDataFile);
            setActiveEventIndex(index);
            setActiveEventCategoryIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isEventsDataFileActive && activeEventIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{item?.title || `Event ${index + 1}`}</div>
          <div className="text-xs opacity-70">{item?.id || `#${index + 1}`}</div>
        </button>
      ))}

      {eventItems.length === 0 && categories.length === 0 && !isEventsPageFileActive && (
        <div className="text-sm text-gray-500">
          Open Events Data to add categories and events.
        </div>
      )}
    </>
  );
}
