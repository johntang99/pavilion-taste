import { SeoPanel } from '@/components/admin/panels/SeoPanel';
import { HeaderPanel } from '@/components/admin/panels/HeaderPanel';
import { ThemePanel } from '@/components/admin/panels/ThemePanel';
import { SectionVariantsPanel } from '@/components/admin/panels/SectionVariantsPanel';
import { HomeSectionPhotosPanel } from '@/components/admin/panels/HomeSectionPhotosPanel';
import { HeroPanel } from '@/components/admin/panels/HeroPanel';
import { ProfilePanel } from '@/components/admin/panels/ProfilePanel';
import { IntroductionPanel } from '@/components/admin/panels/IntroductionPanel';
import { GalleryPhotosPanel } from '@/components/admin/panels/GalleryPhotosPanel';
import { CtaPanel } from '@/components/admin/panels/CtaPanel';
import { PostsPanel } from '@/components/admin/panels/PostsPanel';
import { EventsPanel } from '@/components/admin/panels/EventsPanel';
import { EventCategoryItemPanel } from '@/components/admin/panels/EventCategoryItemPanel';
import { EventItemPanel } from '@/components/admin/panels/EventItemPanel';
import { GalleryDataPanel } from '@/components/admin/panels/GalleryDataPanel';
import { GalleryCategoryItemPanel } from '@/components/admin/panels/GalleryCategoryItemPanel';
import { GalleryItemPanel } from '@/components/admin/panels/GalleryItemPanel';
import { BlogDataPanel } from '@/components/admin/panels/BlogDataPanel';
import { BlogCategoryItemPanel } from '@/components/admin/panels/BlogCategoryItemPanel';
import { BlogPostItemPanel } from '@/components/admin/panels/BlogPostItemPanel';
import { PressDataPanel } from '@/components/admin/panels/PressDataPanel';
import { PressItemPanel } from '@/components/admin/panels/PressItemPanel';
import { TeamDataPanel } from '@/components/admin/panels/TeamDataPanel';
import { TeamMemberItemPanel } from '@/components/admin/panels/TeamMemberItemPanel';
import { MenuModulePanels } from '@/components/admin/sections/MenuModulePanels';

interface ContentEditorFormPanelsProps {
  formData: Record<string, any> | null;
  isSeoFile: boolean;
  seoPopulating: boolean;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
  populateSeoFromHeroes: () => Promise<void>;
  addSeoPage: () => void;
  removeSeoPage: (slug: string) => void;
  isHeaderFile: boolean;
  addHeaderMenuItem: () => void;
  removeHeaderMenuItem: (index: number) => void;
  addHeaderLanguage: () => void;
  removeHeaderLanguage: (index: number) => void;
  isThemeFile: boolean;
  getPathValue: (path: string[]) => any;
  showSharedPanels: boolean;
  variantSections: Array<[string, any]>;
  isHomePageFile: boolean;
  homePhotoFields: Array<{ path: string[]; label: string }>;
  isMenuHubPageFile: boolean;
  isPagesLayoutFile: boolean;
  isMenuTypeFile: boolean;
  galleryCategories: any[];
  addGalleryImage: () => void;
  removeGalleryImage: (index: number) => void;
  isEventsModuleMode: boolean;
  isEventsDataSettingsSelected: boolean;
  isEventCategorySelected: boolean;
  selectedEventCategory: any;
  activeEventCategoryIndex: number;
  isEventItemSelected: boolean;
  selectedEventItem: any;
  activeEventIndex: number;
  eventCategoryOptions: Array<{ id: string; name: string }>;
  isGalleryModuleMode: boolean;
  isGalleryDataSettingsSelected: boolean;
  isGalleryCategorySelected: boolean;
  selectedGalleryCategory: any;
  activeGalleryCategoryIndex: number;
  isGalleryItemSelected: boolean;
  selectedGalleryItem: any;
  activeGalleryItemIndex: number;
  galleryModuleCategoryOptions: Array<{ id: string; name: string }>;
  isBlogModuleMode: boolean;
  isBlogDataSettingsSelected: boolean;
  isBlogCategorySelected: boolean;
  selectedBlogCategory: any;
  activeBlogCategoryIndex: number;
  isBlogPostSelected: boolean;
  selectedBlogPost: any;
  activeBlogPostIndex: number;
  blogCategoryOptions: Array<{ id: string; name: string }>;
  isPressModuleMode: boolean;
  isPressDataSettingsSelected: boolean;
  isPressCategorySelected: boolean;
  selectedPressCategory: any;
  activePressCategoryIndex: number;
  isPressItemSelected: boolean;
  selectedPressItem: any;
  activePressItemIndex: number;
  pressCategoryOptions: Array<{ id: string; name: string }>;
  isTeamModuleMode: boolean;
  isTeamDataSettingsSelected: boolean;
  isTeamCategorySelected: boolean;
  selectedTeamCategory: any;
  activeTeamCategoryIndex: number;
  isTeamMemberSelected: boolean;
  selectedTeamMember: any;
  activeTeamMemberIndex: number;
  teamCategoryOptions: Array<{ id: string; name: string }>;
  isBlogPostFile: boolean | undefined;
  blogServiceOptions: Array<{ id: string; title: string }>;
  blogConditionOptions: Array<{ id: string; title: string }>;
  markdownPreview: Record<string, boolean>;
  toggleMarkdownPreview: (key: string) => void;
  toggleSelection: (path: string[], value: string) => void;
}

export function ContentEditorFormPanels(props: ContentEditorFormPanelsProps) {
  const { formData } = props;

  return (
    <div className="space-y-6 text-sm">
      {!formData && (
        <div className="text-sm text-gray-500">
          Invalid JSON. Switch to JSON tab to fix.
        </div>
      )}

      {props.isSeoFile && formData && (
        <SeoPanel
          formData={formData}
          seoPopulating={props.seoPopulating}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
          populateSeoFromHeroes={props.populateSeoFromHeroes}
          addSeoPage={props.addSeoPage}
          removeSeoPage={props.removeSeoPage}
        />
      )}

      {props.isHeaderFile && formData && (
        <HeaderPanel
          formData={formData}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
          addHeaderMenuItem={props.addHeaderMenuItem}
          removeHeaderMenuItem={props.removeHeaderMenuItem}
          addHeaderLanguage={props.addHeaderLanguage}
          removeHeaderLanguage={props.removeHeaderLanguage}
        />
      )}

      {props.isThemeFile && formData && (
        <ThemePanel
          formData={formData}
          getPathValue={props.getPathValue}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.showSharedPanels && formData && props.variantSections.length > 0 && (
        <SectionVariantsPanel
          variantSections={props.variantSections}
          getPathValue={props.getPathValue}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isHomePageFile && props.homePhotoFields.length > 0 && (
        <HomeSectionPhotosPanel
          homePhotoFields={props.homePhotoFields}
          getPathValue={props.getPathValue}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      <MenuModulePanels
        formData={formData}
        isMenuHubPageFile={Boolean(props.isMenuHubPageFile)}
        isPagesLayoutFile={Boolean(props.isPagesLayoutFile)}
        isMenuTypeFile={Boolean(props.isMenuTypeFile)}
        updateFormValue={props.updateFormValue}
        openImagePicker={props.openImagePicker}
      />

      {props.showSharedPanels && formData?.hero && (
        <HeroPanel
          hero={formData.hero}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {props.showSharedPanels && formData?.profile && (
        <ProfilePanel
          profile={formData.profile}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {props.showSharedPanels && formData?.introduction && (
        <IntroductionPanel
          introduction={formData.introduction}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.showSharedPanels && Array.isArray(formData?.images) && (
        <GalleryPhotosPanel
          images={formData.images}
          galleryCategories={props.galleryCategories}
          addGalleryImage={props.addGalleryImage}
          removeGalleryImage={props.removeGalleryImage}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {props.showSharedPanels && formData?.cta && (
        <CtaPanel
          cta={formData.cta}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {props.isEventsModuleMode && props.isEventsDataSettingsSelected && formData && (
        <EventsPanel
          formData={formData}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isEventsModuleMode && props.isEventCategorySelected && props.selectedEventCategory && (
        <EventCategoryItemPanel
          category={props.selectedEventCategory}
          index={props.activeEventCategoryIndex}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isEventsModuleMode && props.isEventItemSelected && props.selectedEventItem && (
        <EventItemPanel
          item={props.selectedEventItem}
          index={props.activeEventIndex}
          eventCategoryOptions={props.eventCategoryOptions}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {props.isGalleryModuleMode && props.isGalleryDataSettingsSelected && formData && (
        <GalleryDataPanel
          formData={formData}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isGalleryModuleMode && props.isGalleryCategorySelected && props.selectedGalleryCategory && (
        <GalleryCategoryItemPanel
          category={props.selectedGalleryCategory}
          index={props.activeGalleryCategoryIndex}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isGalleryModuleMode && props.isGalleryItemSelected && props.selectedGalleryItem && (
        <GalleryItemPanel
          item={props.selectedGalleryItem}
          index={props.activeGalleryItemIndex}
          categoryOptions={props.galleryModuleCategoryOptions}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {props.isBlogModuleMode && props.isBlogDataSettingsSelected && formData && (
        <BlogDataPanel
          formData={formData}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isBlogModuleMode && props.isBlogCategorySelected && props.selectedBlogCategory && (
        <BlogCategoryItemPanel
          category={props.selectedBlogCategory}
          index={props.activeBlogCategoryIndex}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isBlogModuleMode && props.isBlogPostSelected && props.selectedBlogPost && (
        <BlogPostItemPanel
          post={props.selectedBlogPost}
          index={props.activeBlogPostIndex}
          categoryOptions={props.blogCategoryOptions}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {props.isPressModuleMode && props.isPressDataSettingsSelected && formData && (
        <PressDataPanel
          formData={formData}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isPressModuleMode && props.isPressCategorySelected && props.selectedPressCategory && (
        <BlogCategoryItemPanel
          category={props.selectedPressCategory}
          index={props.activePressCategoryIndex}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isPressModuleMode && props.isPressItemSelected && props.selectedPressItem && (
        <PressItemPanel
          item={props.selectedPressItem}
          index={props.activePressItemIndex}
          categoryOptions={props.pressCategoryOptions}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isTeamModuleMode && props.isTeamDataSettingsSelected && formData && (
        <TeamDataPanel
          formData={formData}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isTeamModuleMode && props.isTeamCategorySelected && props.selectedTeamCategory && (
        <BlogCategoryItemPanel
          category={props.selectedTeamCategory}
          index={props.activeTeamCategoryIndex}
          updateFormValue={props.updateFormValue}
        />
      )}

      {props.isTeamModuleMode && props.isTeamMemberSelected && props.selectedTeamMember && (
        <TeamMemberItemPanel
          member={props.selectedTeamMember}
          index={props.activeTeamMemberIndex}
          categoryOptions={props.teamCategoryOptions}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {!props.isBlogModuleMode &&
        (formData?.featuredPost || Array.isArray(formData?.posts) || formData?.slug) && (
        <PostsPanel
          formData={formData}
          isBlogPostFile={Boolean(props.isBlogPostFile)}
          blogServiceOptions={props.blogServiceOptions}
          blogConditionOptions={props.blogConditionOptions}
          markdownPreview={props.markdownPreview}
          toggleMarkdownPreview={props.toggleMarkdownPreview}
          toggleSelection={props.toggleSelection}
          updateFormValue={props.updateFormValue}
          openImagePicker={props.openImagePicker}
        />
      )}

      {formData &&
        !props.isMenuHubPageFile &&
        !props.isPagesLayoutFile &&
        !props.isMenuTypeFile &&
        !props.isEventsModuleMode &&
        !props.isGalleryModuleMode &&
        !props.isBlogModuleMode &&
        !props.isPressModuleMode &&
        !props.isTeamModuleMode &&
        !formData.hero &&
        !formData.introduction &&
        !formData.cta && (
        <div className="text-sm text-gray-500">
          No schema panels available for this file yet. Use the JSON tab.
        </div>
      )}
    </div>
  );
}
