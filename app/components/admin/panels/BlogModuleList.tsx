interface ContentFileRef {
  id: string;
  path: string;
}

interface BlogModuleListProps {
  blogPageFile: ContentFileRef | null;
  blogDataFile: ContentFileRef | null;
  isBlogPageSettingsSelected: boolean;
  isBlogDataSettingsSelected: boolean;
  isBlogDataFileActive: boolean;
  activeBlogCategoryIndex: number;
  activeBlogPostIndex: number;
  categories: any[];
  posts: any[];
  setActiveFile: (file: ContentFileRef | null) => void;
  setActiveBlogCategoryIndex: (index: number) => void;
  setActiveBlogPostIndex: (index: number) => void;
  addBlogCategory: () => void;
  removeBlogCategory: (index: number) => void;
  addBlogPost: () => void;
  removeBlogPost: (index: number) => void;
}

export function BlogModuleList({
  blogPageFile,
  blogDataFile,
  isBlogPageSettingsSelected,
  isBlogDataSettingsSelected,
  isBlogDataFileActive,
  activeBlogCategoryIndex,
  activeBlogPostIndex,
  categories,
  posts,
  setActiveFile,
  setActiveBlogCategoryIndex,
  setActiveBlogPostIndex,
  addBlogCategory,
  removeBlogCategory,
  addBlogPost,
  removeBlogPost,
}: BlogModuleListProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (blogPageFile) setActiveFile(blogPageFile);
          setActiveBlogCategoryIndex(-1);
          setActiveBlogPostIndex(-1);
        }}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
          isBlogPageSettingsSelected
            ? 'bg-[var(--primary)] text-white'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <div className="font-medium">Page Settings</div>
        <div className="text-xs opacity-70">hero / newsletter</div>
      </button>
      {blogDataFile && (
        <button
          type="button"
          onClick={() => {
            setActiveFile(blogDataFile);
            setActiveBlogCategoryIndex(-1);
            setActiveBlogPostIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isBlogDataSettingsSelected
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">Blog Data</div>
          <div className="text-xs opacity-70">categories / posts</div>
        </button>
      )}

      <div className="pt-1 text-[11px] font-semibold text-gray-500 uppercase">Categories</div>
      <button
        type="button"
        onClick={addBlogCategory}
        disabled={!isBlogDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Category
      </button>
      <button
        type="button"
        disabled={!isBlogDataFileActive || activeBlogCategoryIndex < 0}
        onClick={() => removeBlogCategory(activeBlogCategoryIndex)}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Category
      </button>
      {categories.map((category: any, index: number) => (
        <button
          key={`${category?.id || category}-${index}`}
          type="button"
          onClick={() => {
            if (blogDataFile) setActiveFile(blogDataFile);
            setActiveBlogCategoryIndex(index);
            setActiveBlogPostIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isBlogDataFileActive && activeBlogCategoryIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{category?.name || category || `Category ${index + 1}`}</div>
          <div className="text-xs opacity-70">{category?.id || category || `#${index + 1}`}</div>
        </button>
      ))}

      <div className="pt-2 text-[11px] font-semibold text-gray-500 uppercase">Posts</div>
      <button
        type="button"
        onClick={addBlogPost}
        disabled={!isBlogDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Post
      </button>
      <button
        type="button"
        disabled={!isBlogDataFileActive || activeBlogPostIndex < 0}
        onClick={() => removeBlogPost(activeBlogPostIndex)}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Post
      </button>
      {posts.map((post: any, index: number) => (
        <button
          key={`${post?.slug || 'post'}-${index}`}
          type="button"
          onClick={() => {
            if (blogDataFile) setActiveFile(blogDataFile);
            setActiveBlogPostIndex(index);
            setActiveBlogCategoryIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isBlogDataFileActive && activeBlogPostIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{post?.title || `Post ${index + 1}`}</div>
          <div className="text-xs opacity-70">{post?.slug || `#${index + 1}`}</div>
        </button>
      ))}
    </>
  );
}
