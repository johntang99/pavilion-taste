interface EventsPanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
}

export function EventsPanel({ formData, updateFormValue }: EventsPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Events Settings</div>
      <input
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-2"
        placeholder="Section Title"
        value={formData?.title || ''}
        onChange={(event) => updateFormValue(['title'], event.target.value)}
      />
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        placeholder="Section Subtitle"
        value={formData?.subtitle || ''}
        onChange={(event) => updateFormValue(['subtitle'], event.target.value)}
      />
    </div>
  );
}
