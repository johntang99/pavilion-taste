type HeaderState = Record<string, any>;

const getCategoryName = (value: any, fallback: string) =>
  (typeof value === 'string' ? value : value?.name || value?.id) || fallback;

export function getContentEditorHeaderMeta(state: HeaderState) {
  const path = state.activeFilePath || '';

  const title = state.isServicesItemsMode
    ? state.isServicesLayoutFileActive
      ? 'Services Layout'
      : state.isServicesPageSettingsSelected
        ? 'Services Page Settings'
        : state.selectedService?.title || state.selectedService?.id || 'Select a service'
    : state.isConditionsItemsMode
      ? state.isConditionsLayoutFileActive
        ? 'Conditions Layout'
        : state.isConditionsPageSettingsSelected
          ? 'Conditions Page Settings'
          : state.isConditionCategorySelected
            ? state.selectedConditionCategory?.name || state.selectedConditionCategory?.id || 'Category'
            : state.isConditionItemSelected
              ? state.selectedConditionItem?.title || state.selectedConditionItem?.id || 'Condition'
              : 'Select an item'
      : state.isCaseStudiesItemsMode
        ? state.isCaseStudiesLayoutFileActive
          ? 'Case Studies Layout'
          : state.isCaseStudiesPageSettingsSelected
            ? 'Case Studies Page Settings'
            : state.isCaseStudyCategorySelected
              ? state.selectedCaseStudyCategory?.name || state.selectedCaseStudyCategory?.id || 'Category'
              : state.isCaseStudyItemSelected
                ? state.selectedCaseStudyItem?.condition || state.selectedCaseStudyItem?.id || 'Case Study'
                : 'Select an item'
        : state.isEventsModuleMode
          ? state.isEventsPageSettingsSelected
            ? 'Events Page Settings'
            : state.isEventCategorySelected
              ? state.selectedEventCategory?.name || state.selectedEventCategory?.id || 'Category'
              : state.isEventItemSelected
                ? state.selectedEventItem?.title || state.selectedEventItem?.id || 'Event'
                : state.isEventsDataSettingsSelected
                  ? 'Events Data'
                  : 'Select an item'
          : state.isGalleryModuleMode
            ? state.isGalleryPageSettingsSelected
              ? 'Gallery Page Settings'
              : state.isGalleryCategorySelected
                ? getCategoryName(state.selectedGalleryCategory, 'Category')
                : state.isGalleryItemSelected
                  ? state.selectedGalleryItem?.caption || state.selectedGalleryItem?.id || 'Photo'
                  : state.isGalleryDataSettingsSelected
                    ? 'Gallery Data'
                    : 'Select an item'
            : state.isBlogModuleMode
              ? state.isBlogPageSettingsSelected
                ? 'Blog Page Settings'
                : state.isBlogCategorySelected
                  ? getCategoryName(state.selectedBlogCategory, 'Category')
                  : state.isBlogPostSelected
                    ? state.selectedBlogPost?.title || state.selectedBlogPost?.slug || 'Post'
                    : state.isBlogDataSettingsSelected
                      ? 'Blog Data'
                      : 'Select an item'
              : state.isPressModuleMode
                ? state.isPressPageSettingsSelected
                  ? 'Press Page Settings'
                  : state.isPressCategorySelected
                    ? getCategoryName(state.selectedPressCategory, 'Category')
                    : state.isPressItemSelected
                      ? state.selectedPressItem?.headline || state.selectedPressItem?.id || 'Mention'
                      : state.isPressDataSettingsSelected
                        ? 'Press Data'
                        : 'Select an item'
                : state.isTeamModuleMode
                  ? state.isTeamPageSettingsSelected
                    ? 'Team Page Settings'
                    : state.isTeamCategorySelected
                      ? getCategoryName(state.selectedTeamCategory, 'Department')
                      : state.isTeamMemberSelected
                        ? state.selectedTeamMember?.name || state.selectedTeamMember?.id || 'Member'
                        : state.isTeamDataSettingsSelected
                          ? 'Team Data'
                          : 'Select an item'
                  : state.activeFileLabel || 'Select a file';

  const subtitle = state.isServicesItemsMode
    ? state.isServicesLayoutFileActive
      ? `${path} · layout`
      : state.isServiceDetailFileActive
        ? `${path}`
        : state.isServicesPageSettingsSelected
          ? `${path} · page settings`
          : state.isServiceCategorySelected
            ? `${path} · category ${state.activeServiceCategoryIndex + 1}`
            : `${path} · item ${state.activeServiceIndex + 1}`
    : state.isConditionsItemsMode
      ? state.isConditionsLayoutFileActive
        ? `${path} · layout`
        : state.isConditionsPageSettingsSelected
          ? `${path} · page settings`
          : state.isConditionCategorySelected
            ? `${path} · category ${state.activeConditionCategoryIndex + 1}`
            : state.isConditionItemSelected
              ? `${path} · condition ${state.activeConditionIndex + 1}`
              : state.activeFilePath
      : state.isCaseStudiesItemsMode
        ? state.isCaseStudiesLayoutFileActive
          ? `${path} · layout`
          : state.isCaseStudiesPageSettingsSelected
            ? `${path} · page settings`
            : state.isCaseStudyCategorySelected
              ? `${path} · category ${state.activeCaseStudyCategoryIndex + 1}`
              : state.isCaseStudyItemSelected
                ? `${path} · case ${state.activeCaseStudyIndex + 1}`
                : state.activeFilePath
        : state.isEventsModuleMode
          ? state.isEventsPageSettingsSelected
            ? `${path} · page settings`
            : state.isEventCategorySelected
              ? `${path} · category ${state.activeEventCategoryIndex + 1}`
              : state.isEventItemSelected
                ? `${path} · event ${state.activeEventIndex + 1}`
                : state.activeFilePath
          : state.isGalleryModuleMode
            ? state.isGalleryPageSettingsSelected
              ? `${path} · page settings`
              : state.isGalleryCategorySelected
                ? `${path} · category ${state.activeGalleryCategoryIndex + 1}`
                : state.isGalleryItemSelected
                  ? `${path} · photo ${state.activeGalleryItemIndex + 1}`
                  : state.activeFilePath
            : state.isBlogModuleMode
              ? state.isBlogPageSettingsSelected
                ? `${path} · page settings`
                : state.isBlogCategorySelected
                  ? `${path} · category ${state.activeBlogCategoryIndex + 1}`
                  : state.isBlogPostSelected
                    ? `${path} · post ${state.activeBlogPostIndex + 1}`
                    : state.activeFilePath
              : state.isPressModuleMode
                ? state.isPressPageSettingsSelected
                  ? `${path} · page settings`
                  : state.isPressCategorySelected
                    ? `${path} · category ${state.activePressCategoryIndex + 1}`
                    : state.isPressItemSelected
                      ? `${path} · mention ${state.activePressItemIndex + 1}`
                      : state.activeFilePath
                : state.isTeamModuleMode
                  ? state.isTeamPageSettingsSelected
                    ? `${path} · page settings`
                    : state.isTeamCategorySelected
                      ? `${path} · department ${state.activeTeamCategoryIndex + 1}`
                      : state.isTeamMemberSelected
                        ? `${path} · member ${state.activeTeamMemberIndex + 1}`
                        : state.activeFilePath
                  : state.activeFilePath;

  return { title, subtitle };
}
