import { Button } from '@/components/ui';

interface ContentEditorHeaderActionsProps {
  hasActiveFile: boolean;
  canCreateOrDuplicate: boolean;
  showDelete: boolean;
  onPreview: () => void;
  onCreate: () => void;
  onDuplicate: () => void;
  onFormat: () => void;
  onDelete: () => void;
  onSaveDraft: () => void;
  onSavePublish: () => void;
}

export function ContentEditorHeaderActions({
  hasActiveFile,
  canCreateOrDuplicate,
  showDelete,
  onPreview,
  onCreate,
  onDuplicate,
  onFormat,
  onDelete,
  onSaveDraft,
  onSavePublish,
}: ContentEditorHeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPreview}
        className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
      >
        Preview
      </button>
      {canCreateOrDuplicate && (
        <button
          type="button"
          onClick={onCreate}
          className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
        >
          New Page
        </button>
      )}
      {canCreateOrDuplicate && (
        <button
          type="button"
          onClick={onDuplicate}
          disabled={!hasActiveFile}
          className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Duplicate
        </button>
      )}
      <button
        type="button"
        onClick={onFormat}
        disabled={!hasActiveFile}
        className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Format
      </button>
      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      )}
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={!hasActiveFile}
        className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Save Draft
      </button>
      <Button onClick={onSavePublish} disabled={!hasActiveFile}>
        Publish
      </Button>
    </div>
  );
}
