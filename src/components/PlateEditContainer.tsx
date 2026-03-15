import type { PlateTemplate } from "@/types";
import { PlateDataEditor } from "./PlateDataEditor";

export const PlateEditContainer = ({
  template,
  handleEdit,
  handleAddPlate,
  handleRemovePlate,
  setShowBulkModal,
  showTemplateEditor,
}: {
  template: PlateTemplate;
  handleEdit: (label: string, price: number) => void;
  handleAddPlate: (price: number) => void;
  handleRemovePlate: (label: string) => void;
  setShowBulkModal: React.Dispatch<React.SetStateAction<boolean>>;
  showTemplateEditor: boolean;
}) => {
  const handleAdd = (price: number) => {
    handleAddPlate(price);
  };

  if (!showTemplateEditor) {
    return null;
  }

  return (
    <PlateDataEditor
      template={template}
      onEdit={handleEdit}
      onRemove={handleRemovePlate}
      onAdd={handleAdd}
      onBulkClick={() => setShowBulkModal(true)}
    />
  );
};
