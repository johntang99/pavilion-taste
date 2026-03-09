import { toSlug } from '@/components/admin/utils/editorHelpers';

interface BlogPostItemPanelProps {
  post: any;
  index: number;
  categoryOptions: Array<{ id: string; name: string }>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function BlogPostItemPanel({
  post,
  index,
  categoryOptions,
  updateFormValue,
  openImagePicker,
}: BlogPostItemPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        {post?.title || `Post ${index + 1}`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Slug"
          value={post?.slug || ''}
          onChange={(event) =>
            updateFormValue(['posts', String(index), 'slug'], toSlug(event.target.value))
          }
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Author"
          value={post?.author || ''}
          onChange={(event) => updateFormValue(['posts', String(index), 'author'], event.target.value)}
        />
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Publish Date (YYYY-MM-DD)"
          value={post?.publishDate || ''}
          onChange={(event) =>
            updateFormValue(['posts', String(index), 'publishDate'], event.target.value)
          }
        />
      </div>
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Title"
        value={post?.title || ''}
        onChange={(event) => updateFormValue(['posts', String(index), 'title'], event.target.value)}
      />
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Excerpt"
        value={post?.excerpt || ''}
        onChange={(event) => updateFormValue(['posts', String(index), 'excerpt'], event.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 mb-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Image URL"
          value={post?.image || ''}
          onChange={(event) => updateFormValue(['posts', String(index), 'image'], event.target.value)}
        />
        <button
          type="button"
          onClick={() => openImagePicker(['posts', String(index), 'image'])}
          className="px-3 rounded-md border border-gray-200 text-xs"
        >
          Choose
        </button>
      </div>
      <select
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white mb-2"
        value={post?.category || ''}
        onChange={(event) => updateFormValue(['posts', String(index), 'category'], event.target.value)}
      >
        <option value="">{categoryOptions.length > 0 ? 'Select category' : 'No categories yet'}</option>
        {categoryOptions.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.name}
          </option>
        ))}
      </select>
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Tags (comma separated)"
        value={Array.isArray(post?.tags) ? post.tags.join(', ') : ''}
        onChange={(event) =>
          updateFormValue(
            ['posts', String(index), 'tags'],
            event.target.value
              .split(',')
              .map((entry) => entry.trim())
              .filter(Boolean)
          )
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          className="rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
          placeholder="Read Time"
          value={post?.readTime || ''}
          onChange={(event) => updateFormValue(['posts', String(index), 'readTime'], event.target.value)}
        />
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={Boolean(post?.featured)}
            onChange={(event) =>
              updateFormValue(['posts', String(index), 'featured'], event.target.checked)
            }
            className="rounded border-gray-300"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm rounded-md border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={post?.published !== false}
            onChange={(event) =>
              updateFormValue(['posts', String(index), 'published'], event.target.checked)
            }
            className="rounded border-gray-300"
          />
          Published
        </label>
      </div>
    </div>
  );
}
