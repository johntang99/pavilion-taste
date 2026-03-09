import { MenuHubPanel } from '@/components/admin/panels/MenuHubPanel';
import { MenuLayoutPanel } from '@/components/admin/panels/MenuLayoutPanel';
import { MenuTypePanel } from '@/components/admin/panels/MenuTypePanel';

interface MenuModulePanelsProps {
  formData: Record<string, any> | null;
  isMenuHubPageFile: boolean;
  isPagesLayoutFile: boolean;
  isMenuTypeFile: boolean;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function MenuModulePanels({
  formData,
  isMenuHubPageFile,
  isPagesLayoutFile,
  isMenuTypeFile,
  updateFormValue,
  openImagePicker,
}: MenuModulePanelsProps) {
  if (!formData) return null;

  return (
    <>
      {isMenuHubPageFile && (
        <MenuHubPanel
          formData={formData}
          updateFormValue={updateFormValue}
          openImagePicker={openImagePicker}
        />
      )}

      {isPagesLayoutFile && (
        <MenuLayoutPanel
          formData={formData}
          updateFormValue={updateFormValue}
        />
      )}

      {isMenuTypeFile && (
        <MenuTypePanel
          formData={formData}
          updateFormValue={updateFormValue}
          openImagePicker={openImagePicker}
        />
      )}
    </>
  );
}
