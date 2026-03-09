interface ContentFileRef {
  id: string;
  path: string;
}

interface PressModuleListProps {
  pressPageFile: ContentFileRef | null;
  pressDataFile: ContentFileRef | null;
  isPressPageSettingsSelected: boolean;
  isPressDataSettingsSelected: boolean;
  isPressDataFileActive: boolean;
  activePressCategoryIndex: number;
  activePressItemIndex: number;
  categories: any[];
  items: any[];
  setActiveFile: (file: ContentFileRef | null) => void;
  setActivePressCategoryIndex: (index: number) => void;
  setActivePressItemIndex: (index: number) => void;
  addPressCategory: () => void;
  removePressCategory: (index: number) => void;
  addPressItem: () => void;
  removePressItem: (index: number) => void;
}

export function PressModuleList({
  pressPageFile,
  pressDataFile,
  isPressPageSettingsSelected,
  isPressDataSettingsSelected,
  isPressDataFileActive,
  activePressCategoryIndex,
  activePressItemIndex,
  categories,
  items,
  setActiveFile,
  setActivePressCategoryIndex,
  setActivePressItemIndex,
  addPressCategory,
  removePressCategory,
  addPressItem,
  removePressItem,
}: PressModuleListProps) {
  return (
    <>
      {pressPageFile && (
        <button
          type="button"
          onClick={() => {
            setActiveFile(pressPageFile);
            setActivePressCategoryIndex(-1);
            setActivePressItemIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isPressPageSettingsSelected
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">Page Settings</div>
          <div className="text-xs opacity-70">hero</div>
        </button>
      )}
      {pressDataFile && (
        <button
          type="button"
          onClick={() => {
            setActiveFile(pressDataFile);
            setActivePressCategoryIndex(-1);
            setActivePressItemIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isPressDataSettingsSelected
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">Press Data</div>
          <div className="text-xs opacity-70">categories / mentions</div>
        </button>
      )}

      <div className="pt-1 text-[11px] font-semibold text-gray-500 uppercase">Categories</div>
      <button
        type="button"
        onClick={addPressCategory}
        disabled={!isPressDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Category
      </button>
      <button
        type="button"
        disabled={!isPressDataFileActive || activePressCategoryIndex < 0}
        onClick={() => removePressCategory(activePressCategoryIndex)}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Category
      </button>
      {categories.map((category: any, index: number) => (
        <button
          key={`${category?.id || category}-${index}`}
          type="button"
          onClick={() => {
            if (pressDataFile) setActiveFile(pressDataFile);
            setActivePressCategoryIndex(index);
            setActivePressItemIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isPressDataFileActive && activePressCategoryIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{category?.name || category || `Category ${index + 1}`}</div>
          <div className="text-xs opacity-70">{category?.id || category || `#${index + 1}`}</div>
        </button>
      ))}

      <div className="pt-2 text-[11px] font-semibold text-gray-500 uppercase">Mentions</div>
      <button
        type="button"
        onClick={addPressItem}
        disabled={!isPressDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Mention
      </button>
      <button
        type="button"
        disabled={!isPressDataFileActive || activePressItemIndex < 0}
        onClick={() => removePressItem(activePressItemIndex)}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Mention
      </button>
      {items.map((item: any, index: number) => (
        <button
          key={`${item?.id || 'mention'}-${index}`}
          type="button"
          onClick={() => {
            if (pressDataFile) setActiveFile(pressDataFile);
            setActivePressItemIndex(index);
            setActivePressCategoryIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isPressDataFileActive && activePressItemIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{item?.headline || `Mention ${index + 1}`}</div>
          <div className="text-xs opacity-70">{item?.id || `#${index + 1}`}</div>
        </button>
      ))}
    </>
  );
}
