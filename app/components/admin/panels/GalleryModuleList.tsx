interface ContentFileRef {
  id: string;
  path: string;
}

interface GalleryModuleListProps {
  galleryPageFile: ContentFileRef | null;
  galleryDataFile: ContentFileRef | null;
  isGalleryPageSettingsSelected: boolean;
  isGalleryDataSettingsSelected: boolean;
  isGalleryDataFileActive: boolean;
  activeGalleryCategoryIndex: number;
  activeGalleryItemIndex: number;
  categories: any[];
  items: any[];
  setActiveFile: (file: ContentFileRef | null) => void;
  setActiveGalleryCategoryIndex: (index: number) => void;
  setActiveGalleryItemIndex: (index: number) => void;
  addGalleryCategory: () => void;
  removeGalleryCategory: (index: number) => void;
  addGalleryDataItem: () => void;
  removeGalleryDataItem: (index: number) => void;
}

function toDisplayText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function getCategoryName(category: any, index: number): string {
  const name =
    toDisplayText(category?.name) ||
    toDisplayText(category?.label) ||
    toDisplayText(category?.title);
  return name || `Category ${index + 1}`;
}

function getCategoryId(category: any, index: number): string {
  const id =
    toDisplayText(category?.id) ||
    toDisplayText(category?.slug) ||
    toDisplayText(category?.value);
  return id || `#${index + 1}`;
}

export function GalleryModuleList({
  galleryPageFile,
  galleryDataFile,
  isGalleryPageSettingsSelected,
  isGalleryDataSettingsSelected,
  isGalleryDataFileActive,
  activeGalleryCategoryIndex,
  activeGalleryItemIndex,
  categories,
  items,
  setActiveFile,
  setActiveGalleryCategoryIndex,
  setActiveGalleryItemIndex,
  addGalleryCategory,
  removeGalleryCategory,
  addGalleryDataItem,
  removeGalleryDataItem,
}: GalleryModuleListProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (galleryPageFile) setActiveFile(galleryPageFile);
          setActiveGalleryCategoryIndex(-1);
          setActiveGalleryItemIndex(-1);
        }}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
          isGalleryPageSettingsSelected
            ? 'bg-[var(--primary)] text-white'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <div className="font-medium">Page Settings</div>
        <div className="text-xs opacity-70">hero / cta</div>
      </button>
      {galleryDataFile && (
        <button
          type="button"
          onClick={() => {
            setActiveFile(galleryDataFile);
            setActiveGalleryCategoryIndex(-1);
            setActiveGalleryItemIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isGalleryDataSettingsSelected
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">Gallery Data</div>
          <div className="text-xs opacity-70">categories / photos</div>
        </button>
      )}

      <div className="pt-1 text-[11px] font-semibold text-gray-500 uppercase">Categories</div>
      <button
        type="button"
        onClick={addGalleryCategory}
        disabled={!isGalleryDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Category
      </button>
      <button
        type="button"
        disabled={!isGalleryDataFileActive || activeGalleryCategoryIndex < 0}
        onClick={() => removeGalleryCategory(activeGalleryCategoryIndex)}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Category
      </button>
      {categories.map((category: any, index: number) => (
        <button
          key={`${getCategoryId(category, index)}-${index}`}
          type="button"
          onClick={() => {
            if (galleryDataFile) setActiveFile(galleryDataFile);
            setActiveGalleryCategoryIndex(index);
            setActiveGalleryItemIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isGalleryDataFileActive && activeGalleryCategoryIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{getCategoryName(category, index)}</div>
          <div className="text-xs opacity-70">{getCategoryId(category, index)}</div>
        </button>
      ))}

      <div className="pt-2 text-[11px] font-semibold text-gray-500 uppercase">Photos</div>
      <button
        type="button"
        onClick={addGalleryDataItem}
        disabled={!isGalleryDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Photo
      </button>
      <button
        type="button"
        disabled={!isGalleryDataFileActive || activeGalleryItemIndex < 0}
        onClick={() => removeGalleryDataItem(activeGalleryItemIndex)}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Photo
      </button>
      {items.map((item: any, index: number) => (
        <button
          key={`${item?.id || 'item'}-${index}`}
          type="button"
          onClick={() => {
            if (galleryDataFile) setActiveFile(galleryDataFile);
            setActiveGalleryItemIndex(index);
            setActiveGalleryCategoryIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isGalleryDataFileActive && activeGalleryItemIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{item?.caption || item?.alt || `Photo ${index + 1}`}</div>
          <div className="text-xs opacity-70">{item?.id || `#${index + 1}`}</div>
        </button>
      ))}
    </>
  );
}
