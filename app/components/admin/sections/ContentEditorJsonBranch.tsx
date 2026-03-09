import { ItemJsonEditor } from '@/components/admin/panels/ItemJsonEditor';

interface ContentEditorJsonBranchProps {
  isServiceCategorySelected: boolean;
  selectedServiceCategory: any;
  isServicesItemSelected: boolean;
  selectedService: any;
  serviceItemJsonError: string | null;
  serviceItemJsonDraft: string;
  setServiceItemJsonDraft: (value: string) => void;
  setServiceItemJsonError: (value: string | null) => void;
  activeServiceCategoryIndex: number;
  activeServiceIndex: number;

  isConditionCategorySelected: boolean;
  selectedConditionCategory: any;
  isConditionItemSelected: boolean;
  selectedConditionItem: any;
  conditionsItemJsonError: string | null;
  conditionsItemJsonDraft: string;
  setConditionsItemJsonDraft: (value: string) => void;
  setConditionsItemJsonError: (value: string | null) => void;
  activeConditionCategoryIndex: number;
  activeConditionIndex: number;

  isEventCategorySelected: boolean;
  selectedEventCategory: any;
  isEventItemSelected: boolean;
  selectedEventItem: any;
  eventItemJsonError: string | null;
  eventItemJsonDraft: string;
  setEventItemJsonDraft: (value: string) => void;
  setEventItemJsonError: (value: string | null) => void;
  activeEventCategoryIndex: number;
  activeEventIndex: number;

  isCaseStudyCategorySelected: boolean;
  selectedCaseStudyCategory: any;
  isCaseStudyItemSelected: boolean;
  selectedCaseStudyItem: any;
  caseStudiesItemJsonError: string | null;
  caseStudiesItemJsonDraft: string;
  setCaseStudiesItemJsonDraft: (value: string) => void;
  setCaseStudiesItemJsonError: (value: string | null) => void;
  activeCaseStudyCategoryIndex: number;
  activeCaseStudyIndex: number;

  updateFormValue: (path: string[], value: any) => void;
  setStatus: (value: string) => void;

  content: string;
  setContent: (value: string) => void;
  setFormData: (value: Record<string, any> | null) => void;
}

export function ContentEditorJsonBranch(props: ContentEditorJsonBranchProps) {
  if (
    (props.isServiceCategorySelected && props.selectedServiceCategory) ||
    (props.isServicesItemSelected && props.selectedService)
  ) {
    return (
      <ItemJsonEditor
        error={props.serviceItemJsonError}
        draft={props.serviceItemJsonDraft}
        onDraftChange={(next) => {
          props.setServiceItemJsonDraft(next);
          try {
            const parsed = JSON.parse(next);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              props.setServiceItemJsonError('JSON must be an object.');
              return;
            }
            props.setServiceItemJsonError(null);
          } catch {
            props.setServiceItemJsonError('Invalid JSON');
          }
        }}
        onApply={() => {
          try {
            const parsed = JSON.parse(props.serviceItemJsonDraft);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              props.setServiceItemJsonError('JSON must be an object.');
              return;
            }
            props.setServiceItemJsonError(null);
            if (props.isServiceCategorySelected) {
              props.updateFormValue(['categories', String(props.activeServiceCategoryIndex)], parsed);
              props.setStatus('Category JSON applied.');
            } else if (props.isServicesItemSelected) {
              props.updateFormValue(['servicesList', 'items', String(props.activeServiceIndex)], parsed);
              props.setStatus('Service JSON applied.');
            }
          } catch {
            props.setServiceItemJsonError('Invalid JSON');
          }
        }}
        placeholder={
          props.isServiceCategorySelected
            ? 'Edit selected category JSON.'
            : 'Edit selected service JSON.'
        }
      />
    );
  }

  if (
    (props.isConditionCategorySelected && props.selectedConditionCategory) ||
    (props.isConditionItemSelected && props.selectedConditionItem)
  ) {
    return (
      <ItemJsonEditor
        error={props.conditionsItemJsonError}
        draft={props.conditionsItemJsonDraft}
        onDraftChange={(next) => {
          props.setConditionsItemJsonDraft(next);
          try {
            const parsed = JSON.parse(next);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              props.setConditionsItemJsonError('Condition JSON must be an object.');
              return;
            }
            props.setConditionsItemJsonError(null);
          } catch {
            props.setConditionsItemJsonError('Invalid JSON');
          }
        }}
        onApply={() => {
          try {
            const parsed = JSON.parse(props.conditionsItemJsonDraft);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              props.setConditionsItemJsonError('Condition JSON must be an object.');
              return;
            }
            props.setConditionsItemJsonError(null);
            if (props.isConditionCategorySelected) {
              props.updateFormValue(['categories', String(props.activeConditionCategoryIndex)], parsed);
              props.setStatus('Category JSON applied.');
            } else if (props.isConditionItemSelected) {
              props.updateFormValue(['conditions', String(props.activeConditionIndex)], parsed);
              props.setStatus('Condition JSON applied.');
            }
          } catch {
            props.setConditionsItemJsonError('Invalid JSON');
          }
        }}
        placeholder={
          props.isConditionCategorySelected
            ? 'Edit selected category JSON.'
            : 'Edit selected condition JSON.'
        }
      />
    );
  }

  if (
    (props.isEventCategorySelected && props.selectedEventCategory) ||
    (props.isEventItemSelected && props.selectedEventItem)
  ) {
    return (
      <ItemJsonEditor
        error={props.eventItemJsonError}
        draft={props.eventItemJsonDraft}
        onDraftChange={(next) => {
          props.setEventItemJsonDraft(next);
          try {
            const parsed = JSON.parse(next);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              props.setEventItemJsonError('Event JSON must be an object.');
              return;
            }
            props.setEventItemJsonError(null);
          } catch {
            props.setEventItemJsonError('Invalid JSON');
          }
        }}
        onApply={() => {
          try {
            const parsed = JSON.parse(props.eventItemJsonDraft);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              props.setEventItemJsonError('Event JSON must be an object.');
              return;
            }
            props.setEventItemJsonError(null);
            if (props.isEventCategorySelected) {
              props.updateFormValue(['categories', String(props.activeEventCategoryIndex)], parsed);
              props.setStatus('Event category JSON applied.');
            } else if (props.isEventItemSelected) {
              props.updateFormValue(['events', String(props.activeEventIndex)], parsed);
              props.setStatus('Event JSON applied.');
            }
          } catch {
            props.setEventItemJsonError('Invalid JSON');
          }
        }}
        placeholder={
          props.isEventCategorySelected
            ? 'Edit selected event category JSON.'
            : 'Edit selected event JSON.'
        }
      />
    );
  }

  if (
    (props.isCaseStudyCategorySelected && props.selectedCaseStudyCategory) ||
    (props.isCaseStudyItemSelected && props.selectedCaseStudyItem)
  ) {
    return (
      <ItemJsonEditor
        error={props.caseStudiesItemJsonError}
        draft={props.caseStudiesItemJsonDraft}
        onDraftChange={(next) => {
          props.setCaseStudiesItemJsonDraft(next);
          try {
            const parsed = JSON.parse(next);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              props.setCaseStudiesItemJsonError('Case study JSON must be an object.');
              return;
            }
            props.setCaseStudiesItemJsonError(null);
          } catch {
            props.setCaseStudiesItemJsonError('Invalid JSON');
          }
        }}
        onApply={() => {
          try {
            const parsed = JSON.parse(props.caseStudiesItemJsonDraft);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              props.setCaseStudiesItemJsonError('Case study JSON must be an object.');
              return;
            }
            props.setCaseStudiesItemJsonError(null);
            if (props.isCaseStudyCategorySelected) {
              props.updateFormValue(['categories', String(props.activeCaseStudyCategoryIndex)], parsed);
              props.setStatus('Case study category JSON applied.');
            } else if (props.isCaseStudyItemSelected) {
              props.updateFormValue(['caseStudies', String(props.activeCaseStudyIndex)], parsed);
              props.setStatus('Case study JSON applied.');
            }
          } catch {
            props.setCaseStudiesItemJsonError('Invalid JSON');
          }
        }}
        placeholder={
          props.isCaseStudyCategorySelected
            ? 'Edit selected category JSON.'
            : 'Edit selected case study JSON.'
        }
      />
    );
  }

  return (
    <textarea
      className="w-full min-h-[520px] rounded-lg border border-gray-200 p-3 font-mono text-xs text-gray-800"
      value={props.content}
      onChange={(event) => {
        const next = event.target.value;
        props.setContent(next);
        try {
          props.setFormData(JSON.parse(next));
        } catch {
          props.setFormData(null);
        }
      }}
      placeholder="Select a file to begin editing."
    />
  );
}
