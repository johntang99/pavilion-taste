interface ContentEditorActionToolbarProps {
  siteId: string;
  locale: string;
  importing: boolean;
  exporting: boolean;
  loading: boolean;
  hasScopedActions: boolean;
  scopeLabel: string;
  scopedActionPaths: string[];
  handleImport: (mode?: 'missing' | 'overwrite', options?: { includePaths?: string[] }) => void;
  handleOverwriteImport: () => void;
  handleExport: (options?: { includePaths?: string[] }) => void;
  handleCheckUpdateFromDb: () => void;
}

export function ContentEditorActionToolbar({
  siteId,
  locale,
  importing,
  exporting,
  loading,
  hasScopedActions,
  scopeLabel,
  scopedActionPaths,
  handleImport,
  handleOverwriteImport,
  handleExport,
  handleCheckUpdateFromDb,
}: ContentEditorActionToolbarProps) {
  return (
    <div className="flex items-end gap-2 pt-4 sm:pt-0">
      <button
        type="button"
        onClick={() => {
          const confirmed = window.confirm(
            `Import locale JSON for ${siteId} (${locale})?\n\nThis applies to all files in the selected site + locale and may overwrite missing DB entries.`
          );
          if (!confirmed) return;
          handleImport('missing');
        }}
        disabled={importing || loading}
        className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        {importing ? 'Importing…' : 'Import Locale JSON'}
      </button>
      <button
        type="button"
        onClick={() => {
          const confirmed = window.confirm(
            `Run Check Update From DB for ${siteId} (${locale})?\n\nThis compares local JSON vs DB for the whole locale and shows a diff summary.`
          );
          if (!confirmed) return;
          handleCheckUpdateFromDb();
        }}
        disabled={importing || loading}
        className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        Check Update From DB
      </button>
      <button
        type="button"
        onClick={() => {
          const confirmed = window.confirm(
            `Overwrite import for ${siteId} (${locale})?\n\nThis is a locale-wide write action and can replace DB content with local JSON. Continue?`
          );
          if (!confirmed) return;
          handleOverwriteImport();
        }}
        disabled={importing || loading}
        className="px-3 py-2 rounded-md border border-amber-200 text-xs text-amber-700 hover:bg-amber-50 disabled:opacity-60"
      >
        {importing ? 'Importing…' : 'Overwrite Import'}
      </button>
      <button
        type="button"
        onClick={() => {
          const confirmed = window.confirm(
            `Export locale DB to JSON for ${siteId} (${locale})?\n\nThis applies to all files in the selected site + locale.`
          );
          if (!confirmed) return;
          handleExport();
        }}
        disabled={exporting || loading}
        className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        {exporting ? 'Exporting…' : 'Export Locale JSON'}
      </button>
      {hasScopedActions && (
        <>
          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(
                `Import section JSON for ${scopeLabel} (${siteId}, ${locale})?\n\nThis applies only to ${scopeLabel} files and imports missing DB entries.`
              );
              if (!confirmed) return;
              handleImport('missing', { includePaths: scopedActionPaths });
            }}
            disabled={importing || loading}
            className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {importing ? 'Importing…' : 'Import Section JSON'}
          </button>
          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(
                `Export section JSON for ${scopeLabel} (${siteId}, ${locale})?\n\nThis applies only to ${scopeLabel} files and writes local JSON from DB.`
              );
              if (!confirmed) return;
              handleExport({ includePaths: scopedActionPaths });
            }}
            disabled={exporting || loading}
            className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {exporting ? 'Exporting…' : 'Export Section JSON'}
          </button>
        </>
      )}
    </div>
  );
}
