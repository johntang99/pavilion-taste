import { EventsModuleList } from '@/components/admin/panels/EventsModuleList';
import { GalleryModuleList } from '@/components/admin/panels/GalleryModuleList';
import { BlogModuleList } from '@/components/admin/panels/BlogModuleList';
import { PressModuleList } from '@/components/admin/panels/PressModuleList';
import { TeamModuleList } from '@/components/admin/panels/TeamModuleList';

interface ContentEditorLeftPaneProps {
  filesTitle: string;
  loading: boolean;
  files: any[];
  activeFile: any;
  fileFilter: string;
  locale: string;
  setActiveFile: (file: any) => void;
  isEventsModuleMode: boolean;
  eventsPageFile: any;
  eventsDataFile: any;
  isEventsPageSettingsSelected: boolean;
  isEventsDataSettingsSelected: boolean;
  isEventsPageFileActive: boolean;
  isEventsDataFileActive: boolean;
  activeEventCategoryIndex: number;
  activeEventIndex: number;
  eventCategories: any[];
  eventItems: any[];
  setActiveEventCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveEventIndex: React.Dispatch<React.SetStateAction<number>>;
  addEventCategory: () => void;
  removeEventCategory: (index: number) => void;
  addEventItem: () => void;
  removeEventItem: (index: number) => void;
  isGalleryModuleMode: boolean;
  galleryPageFile: any;
  galleryDataFile: any;
  isGalleryPageSettingsSelected: boolean;
  isGalleryDataSettingsSelected: boolean;
  isGalleryDataFileActive: boolean;
  activeGalleryCategoryIndex: number;
  activeGalleryItemIndex: number;
  galleryModuleCategories: any[];
  galleryModuleItems: any[];
  setActiveGalleryCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveGalleryItemIndex: React.Dispatch<React.SetStateAction<number>>;
  addGalleryCategory: () => void;
  removeGalleryCategory: (index: number) => void;
  addGalleryDataItem: () => void;
  removeGalleryDataItem: (index: number) => void;
  isBlogModuleMode: boolean;
  blogPageFile: any;
  blogDataFile: any;
  isBlogPageSettingsSelected: boolean;
  isBlogDataSettingsSelected: boolean;
  isBlogDataFileActive: boolean;
  activeBlogCategoryIndex: number;
  activeBlogPostIndex: number;
  blogCategories: any[];
  blogPosts: any[];
  setActiveBlogCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveBlogPostIndex: React.Dispatch<React.SetStateAction<number>>;
  addBlogCategory: () => void;
  removeBlogCategory: (index: number) => void;
  addBlogPost: () => void;
  removeBlogPost: (index: number) => void;
  isPressModuleMode: boolean;
  pressPageFile: any;
  pressDataFile: any;
  isPressPageSettingsSelected: boolean;
  isPressDataSettingsSelected: boolean;
  isPressDataFileActive: boolean;
  activePressCategoryIndex: number;
  activePressItemIndex: number;
  pressCategories: any[];
  pressItems: any[];
  setActivePressCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setActivePressItemIndex: React.Dispatch<React.SetStateAction<number>>;
  addPressCategory: () => void;
  removePressCategory: (index: number) => void;
  addPressItem: () => void;
  removePressItem: (index: number) => void;
  isTeamModuleMode: boolean;
  teamPageFile: any;
  teamDataFile: any;
  isTeamPageSettingsSelected: boolean;
  isTeamDataSettingsSelected: boolean;
  isTeamDataFileActive: boolean;
  activeTeamCategoryIndex: number;
  activeTeamMemberIndex: number;
  teamCategories: any[];
  teamMembers: any[];
  setActiveTeamCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveTeamMemberIndex: React.Dispatch<React.SetStateAction<number>>;
  addTeamCategory: () => void;
  removeTeamCategory: (index: number) => void;
  addTeamMember: () => void;
  removeTeamMember: (index: number) => void;
}

export function ContentEditorLeftPane(props: ContentEditorLeftPaneProps) {
  const {
    filesTitle,
    loading,
    files,
    activeFile,
    fileFilter,
    locale,
    setActiveFile,
  } = props;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">{filesTitle}</div>
      {loading && files.length === 0 ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <div className="space-y-2">
          {props.isEventsModuleMode ? (
            <EventsModuleList
              eventsPageFile={props.eventsPageFile}
              eventsDataFile={props.eventsDataFile}
              isEventsPageSettingsSelected={props.isEventsPageSettingsSelected}
              isEventsDataSettingsSelected={props.isEventsDataSettingsSelected}
              isEventsPageFileActive={props.isEventsPageFileActive}
              isEventsDataFileActive={props.isEventsDataFileActive}
              activeEventCategoryIndex={props.activeEventCategoryIndex}
              activeEventIndex={props.activeEventIndex}
              categories={props.eventCategories}
              eventItems={props.eventItems}
              setActiveFile={setActiveFile}
              setActiveEventCategoryIndex={props.setActiveEventCategoryIndex}
              setActiveEventIndex={props.setActiveEventIndex}
              addEventCategory={props.addEventCategory}
              removeEventCategory={props.removeEventCategory}
              addEventItem={props.addEventItem}
              removeEventItem={props.removeEventItem}
            />
          ) : props.isGalleryModuleMode ? (
            <GalleryModuleList
              galleryPageFile={props.galleryPageFile}
              galleryDataFile={props.galleryDataFile}
              isGalleryPageSettingsSelected={props.isGalleryPageSettingsSelected}
              isGalleryDataSettingsSelected={props.isGalleryDataSettingsSelected}
              isGalleryDataFileActive={props.isGalleryDataFileActive}
              activeGalleryCategoryIndex={props.activeGalleryCategoryIndex}
              activeGalleryItemIndex={props.activeGalleryItemIndex}
              categories={props.galleryModuleCategories}
              items={props.galleryModuleItems}
              setActiveFile={setActiveFile}
              setActiveGalleryCategoryIndex={props.setActiveGalleryCategoryIndex}
              setActiveGalleryItemIndex={props.setActiveGalleryItemIndex}
              addGalleryCategory={props.addGalleryCategory}
              removeGalleryCategory={props.removeGalleryCategory}
              addGalleryDataItem={props.addGalleryDataItem}
              removeGalleryDataItem={props.removeGalleryDataItem}
            />
          ) : props.isBlogModuleMode ? (
            <BlogModuleList
              blogPageFile={props.blogPageFile}
              blogDataFile={props.blogDataFile}
              isBlogPageSettingsSelected={props.isBlogPageSettingsSelected}
              isBlogDataSettingsSelected={props.isBlogDataSettingsSelected}
              isBlogDataFileActive={props.isBlogDataFileActive}
              activeBlogCategoryIndex={props.activeBlogCategoryIndex}
              activeBlogPostIndex={props.activeBlogPostIndex}
              categories={props.blogCategories}
              posts={props.blogPosts}
              setActiveFile={setActiveFile}
              setActiveBlogCategoryIndex={props.setActiveBlogCategoryIndex}
              setActiveBlogPostIndex={props.setActiveBlogPostIndex}
              addBlogCategory={props.addBlogCategory}
              removeBlogCategory={props.removeBlogCategory}
              addBlogPost={props.addBlogPost}
              removeBlogPost={props.removeBlogPost}
            />
          ) : props.isPressModuleMode ? (
            <PressModuleList
              pressPageFile={props.pressPageFile}
              pressDataFile={props.pressDataFile}
              isPressPageSettingsSelected={props.isPressPageSettingsSelected}
              isPressDataSettingsSelected={props.isPressDataSettingsSelected}
              isPressDataFileActive={props.isPressDataFileActive}
              activePressCategoryIndex={props.activePressCategoryIndex}
              activePressItemIndex={props.activePressItemIndex}
              categories={props.pressCategories}
              items={props.pressItems}
              setActiveFile={setActiveFile}
              setActivePressCategoryIndex={props.setActivePressCategoryIndex}
              setActivePressItemIndex={props.setActivePressItemIndex}
              addPressCategory={props.addPressCategory}
              removePressCategory={props.removePressCategory}
              addPressItem={props.addPressItem}
              removePressItem={props.removePressItem}
            />
          ) : props.isTeamModuleMode ? (
            <TeamModuleList
              teamPageFile={props.teamPageFile}
              teamDataFile={props.teamDataFile}
              isTeamPageSettingsSelected={props.isTeamPageSettingsSelected}
              isTeamDataSettingsSelected={props.isTeamDataSettingsSelected}
              isTeamDataFileActive={props.isTeamDataFileActive}
              activeTeamCategoryIndex={props.activeTeamCategoryIndex}
              activeTeamMemberIndex={props.activeTeamMemberIndex}
              categories={props.teamCategories}
              members={props.teamMembers}
              setActiveFile={setActiveFile}
              setActiveTeamCategoryIndex={props.setActiveTeamCategoryIndex}
              setActiveTeamMemberIndex={props.setActiveTeamMemberIndex}
              addTeamCategory={props.addTeamCategory}
              removeTeamCategory={props.removeTeamCategory}
              addTeamMember={props.addTeamMember}
              removeTeamMember={props.removeTeamMember}
            />
          ) : (
            files.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => setActiveFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  activeFile?.id === file.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="font-medium">{file.label}</div>
                <div className="text-xs opacity-70">{file.path}</div>
                {fileFilter === 'blog' && file.publishDate && (
                  <div className="text-[11px] text-gray-500 mt-1">
                    {new Date(file.publishDate).toLocaleDateString(
                      locale === 'zh' ? 'zh-CN' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </div>
                )}
              </button>
            ))
          )}
          {files.length === 0 && (
            <div className="text-sm text-gray-500">
              {fileFilter === 'blog'
                ? 'No blog posts found for this locale.'
                : 'No content files found for this locale.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
