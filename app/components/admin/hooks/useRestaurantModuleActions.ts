import { useCallback } from 'react';

interface UseRestaurantModuleActionsParams {
  formData: Record<string, any> | null;
  setFormData: (value: Record<string, any>) => void;
  updateFormValue: (path: string[], value: any) => void;
  isEventsModuleMode: boolean;
  isEventsDataFileActive: boolean;
  setActiveEventCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveEventIndex: React.Dispatch<React.SetStateAction<number>>;
  eventCategoryOptions: Array<{ id: string; name: string }>;
  isGalleryModuleMode: boolean;
  isGalleryDataFileActive: boolean;
  setActiveGalleryCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveGalleryItemIndex: React.Dispatch<React.SetStateAction<number>>;
  galleryModuleCategoryOptions: Array<{ id: string; name: string }>;
  isBlogModuleMode: boolean;
  isBlogDataFileActive: boolean;
  setActiveBlogCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveBlogPostIndex: React.Dispatch<React.SetStateAction<number>>;
  blogCategoryOptions: Array<{ id: string; name: string }>;
}

export function useRestaurantModuleActions({
  formData,
  setFormData,
  updateFormValue,
  isEventsModuleMode,
  isEventsDataFileActive,
  setActiveEventCategoryIndex,
  setActiveEventIndex,
  eventCategoryOptions,
  isGalleryModuleMode,
  isGalleryDataFileActive,
  setActiveGalleryCategoryIndex,
  setActiveGalleryItemIndex,
  galleryModuleCategoryOptions,
  isBlogModuleMode,
  isBlogDataFileActive,
  setActiveBlogCategoryIndex,
  setActiveBlogPostIndex,
  blogCategoryOptions,
}: UseRestaurantModuleActionsParams) {
  const addEventCategory = useCallback(() => {
    if (!formData) return;
    const categories = Array.isArray(formData.categories) ? [...formData.categories] : [];
    categories.push({
      id: `category-${categories.length + 1}`,
      name: '',
      description: '',
      order: categories.length + 1,
    });
    updateFormValue(['categories'], categories);
    if (isEventsModuleMode && isEventsDataFileActive) {
      setActiveEventCategoryIndex(categories.length - 1);
      setActiveEventIndex(-1);
    }
  }, [
    formData,
    updateFormValue,
    isEventsModuleMode,
    isEventsDataFileActive,
    setActiveEventCategoryIndex,
    setActiveEventIndex,
  ]);

  const removeEventCategory = useCallback(
    (index: number) => {
      if (!formData || !Array.isArray(formData.categories)) return;
      const categories = [...formData.categories];
      const target = categories[index];
      categories.splice(index, 1);
      const next: Record<string, any> = { ...formData, categories };
      if (target?.id && Array.isArray(formData.events)) {
        const fallbackCategory = categories.find((entry: any) => entry?.id)?.id || '';
        next.events = formData.events.map((item: any) =>
          item?.category === target.id ? { ...item, category: fallbackCategory } : item
        );
      }
      setFormData(next);
      if (isEventsModuleMode && isEventsDataFileActive) {
        setActiveEventCategoryIndex((current) => {
          if (categories.length === 0) return -1;
          if (current > index) return current - 1;
          if (current >= categories.length) return categories.length - 1;
          return current;
        });
      }
    },
    [
      formData,
      setFormData,
      isEventsModuleMode,
      isEventsDataFileActive,
      setActiveEventCategoryIndex,
    ]
  );

  const addEventItem = useCallback(() => {
    if (!formData) return;
    const list = Array.isArray(formData.events) ? [...formData.events] : [];
    const firstCategory = eventCategoryOptions[0]?.id || '';
    list.push({
      id: `event-${list.length + 1}`,
      title: '',
      shortDescription: '',
      description: '',
      eventType: '',
      category: firstCategory,
      image: '',
      tags: [],
      startDatetime: '',
      endDatetime: '',
      pricePerPerson: null,
      reservationRequired: false,
      capacity: null,
      featured: false,
      published: true,
      cancelled: false,
    });
    updateFormValue(['events'], list);
    if (isEventsModuleMode && isEventsDataFileActive) {
      setActiveEventIndex(list.length - 1);
      setActiveEventCategoryIndex(-1);
    }
  }, [
    formData,
    eventCategoryOptions,
    updateFormValue,
    isEventsModuleMode,
    isEventsDataFileActive,
    setActiveEventIndex,
    setActiveEventCategoryIndex,
  ]);

  const removeEventItem = useCallback(
    (index: number) => {
      if (!formData || !Array.isArray(formData.events)) return;
      const list = [...formData.events];
      list.splice(index, 1);
      updateFormValue(['events'], list);
      if (isEventsModuleMode && isEventsDataFileActive) {
        setActiveEventIndex((current) => {
          if (list.length === 0) return -1;
          if (current > index) return current - 1;
          if (current >= list.length) return list.length - 1;
          return current;
        });
      }
    },
    [
      formData,
      updateFormValue,
      isEventsModuleMode,
      isEventsDataFileActive,
      setActiveEventIndex,
    ]
  );

  const addGalleryCategory = useCallback(() => {
    if (!formData) return;
    const categories = Array.isArray(formData.categories) ? [...formData.categories] : [];
    categories.push(`category-${categories.length + 1}`);
    updateFormValue(['categories'], categories);
    if (isGalleryModuleMode && isGalleryDataFileActive) {
      setActiveGalleryCategoryIndex(categories.length - 1);
      setActiveGalleryItemIndex(-1);
    }
  }, [
    formData,
    updateFormValue,
    isGalleryModuleMode,
    isGalleryDataFileActive,
    setActiveGalleryCategoryIndex,
    setActiveGalleryItemIndex,
  ]);

  const removeGalleryCategory = useCallback(
    (index: number) => {
      if (!formData || !Array.isArray(formData.categories)) return;
      const categories = [...formData.categories];
      const target = categories[index];
      categories.splice(index, 1);
      const targetId = typeof target === 'string' ? target : target?.id || '';
      const next: Record<string, any> = { ...formData, categories };
      if (targetId && Array.isArray(formData.items)) {
        const fallback = categories[0];
        const fallbackId = typeof fallback === 'string' ? fallback : fallback?.id || '';
        next.items = formData.items.map((item: any) =>
          item?.category === targetId ? { ...item, category: fallbackId } : item
        );
      }
      setFormData(next);
      if (isGalleryModuleMode && isGalleryDataFileActive) {
        setActiveGalleryCategoryIndex((current) => {
          if (categories.length === 0) return -1;
          if (current > index) return current - 1;
          if (current >= categories.length) return categories.length - 1;
          return current;
        });
      }
    },
    [
      formData,
      setFormData,
      isGalleryModuleMode,
      isGalleryDataFileActive,
      setActiveGalleryCategoryIndex,
    ]
  );

  const addGalleryDataItem = useCallback(() => {
    if (!formData) return;
    const list = Array.isArray(formData.items) ? [...formData.items] : [];
    const firstCategory = galleryModuleCategoryOptions[0]?.id || '';
    list.push({
      id: `g-${String(list.length + 1).padStart(3, '0')}`,
      url: '',
      alt: '',
      caption: '',
      category: firstCategory,
      featured: false,
      displayOrder: list.length + 1,
    });
    updateFormValue(['items'], list);
    if (isGalleryModuleMode && isGalleryDataFileActive) {
      setActiveGalleryItemIndex(list.length - 1);
      setActiveGalleryCategoryIndex(-1);
    }
  }, [
    formData,
    galleryModuleCategoryOptions,
    updateFormValue,
    isGalleryModuleMode,
    isGalleryDataFileActive,
    setActiveGalleryItemIndex,
    setActiveGalleryCategoryIndex,
  ]);

  const removeGalleryDataItem = useCallback(
    (index: number) => {
      if (!formData || !Array.isArray(formData.items)) return;
      const list = [...formData.items];
      list.splice(index, 1);
      updateFormValue(['items'], list);
      if (isGalleryModuleMode && isGalleryDataFileActive) {
        setActiveGalleryItemIndex((current) => {
          if (list.length === 0) return -1;
          if (current > index) return current - 1;
          if (current >= list.length) return list.length - 1;
          return current;
        });
      }
    },
    [
      formData,
      updateFormValue,
      isGalleryModuleMode,
      isGalleryDataFileActive,
      setActiveGalleryItemIndex,
    ]
  );

  const addBlogCategory = useCallback(() => {
    if (!formData) return;
    const categories = Array.isArray(formData.categories) ? [...formData.categories] : [];
    categories.push(`category-${categories.length + 1}`);
    updateFormValue(['categories'], categories);
    if (isBlogModuleMode && isBlogDataFileActive) {
      setActiveBlogCategoryIndex(categories.length - 1);
      setActiveBlogPostIndex(-1);
    }
  }, [
    formData,
    updateFormValue,
    isBlogModuleMode,
    isBlogDataFileActive,
    setActiveBlogCategoryIndex,
    setActiveBlogPostIndex,
  ]);

  const removeBlogCategory = useCallback(
    (index: number) => {
      if (!formData || !Array.isArray(formData.categories)) return;
      const categories = [...formData.categories];
      const target = categories[index];
      categories.splice(index, 1);
      const targetId = typeof target === 'string' ? target : target?.id || '';
      const next: Record<string, any> = { ...formData, categories };
      if (targetId && Array.isArray(formData.posts)) {
        const fallback = categories[0];
        const fallbackId = typeof fallback === 'string' ? fallback : fallback?.id || '';
        next.posts = formData.posts.map((post: any) =>
          post?.category === targetId ? { ...post, category: fallbackId } : post
        );
      }
      setFormData(next);
      if (isBlogModuleMode && isBlogDataFileActive) {
        setActiveBlogCategoryIndex((current) => {
          if (categories.length === 0) return -1;
          if (current > index) return current - 1;
          if (current >= categories.length) return categories.length - 1;
          return current;
        });
      }
    },
    [formData, setFormData, isBlogModuleMode, isBlogDataFileActive, setActiveBlogCategoryIndex]
  );

  const addBlogPost = useCallback(() => {
    if (!formData) return;
    const posts = Array.isArray(formData.posts) ? [...formData.posts] : [];
    const firstCategory = blogCategoryOptions[0]?.id || '';
    posts.push({
      slug: `post-${posts.length + 1}`,
      type: 'article',
      image: '',
      category: firstCategory,
      readTime: '3 min',
      title: '',
      excerpt: '',
      author: '',
      publishDate: new Date().toISOString().slice(0, 10),
      tags: [],
      featured: false,
      published: true,
    });
    updateFormValue(['posts'], posts);
    if (isBlogModuleMode && isBlogDataFileActive) {
      setActiveBlogPostIndex(posts.length - 1);
      setActiveBlogCategoryIndex(-1);
    }
  }, [
    formData,
    blogCategoryOptions,
    updateFormValue,
    isBlogModuleMode,
    isBlogDataFileActive,
    setActiveBlogPostIndex,
    setActiveBlogCategoryIndex,
  ]);

  const removeBlogPost = useCallback(
    (index: number) => {
      if (!formData || !Array.isArray(formData.posts)) return;
      const posts = [...formData.posts];
      posts.splice(index, 1);
      updateFormValue(['posts'], posts);
      if (isBlogModuleMode && isBlogDataFileActive) {
        setActiveBlogPostIndex((current) => {
          if (posts.length === 0) return -1;
          if (current > index) return current - 1;
          if (current >= posts.length) return posts.length - 1;
          return current;
        });
      }
    },
    [formData, updateFormValue, isBlogModuleMode, isBlogDataFileActive, setActiveBlogPostIndex]
  );

  return {
    addEventCategory,
    removeEventCategory,
    addEventItem,
    removeEventItem,
    addGalleryCategory,
    removeGalleryCategory,
    addGalleryDataItem,
    removeGalleryDataItem,
    addBlogCategory,
    removeBlogCategory,
    addBlogPost,
    removeBlogPost,
  };
}
