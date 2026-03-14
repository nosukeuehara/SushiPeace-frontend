import type { PlateTemplate } from "@/types";
import { PlateDataEditor } from "./PlateDataEditor";
import { addPlate, removePlate } from "@/domain/plate/updateTemplate";

export const PlateEditContainer = ({
  template,
  handleEdit,
  handleUpdateTemplate,
  setShowBulkModal,
  showTemplateEditor,
}: {
  template: PlateTemplate;
  handleEdit: (label: string, price: number) => void;
  handleUpdateTemplate: (updatedPrices: Record<string, number>) => void;
  setShowBulkModal: React.Dispatch<React.SetStateAction<boolean>>;
  showTemplateEditor: boolean;
}) => {
  const handleRemove = (label: string) => {
    const newTemplate = removePlate(label, template);
    handleUpdateTemplate(newTemplate.prices);
  };

  const handleAdd = (price: number) => {
    const newTemplate = addPlate(price, template);
    handleUpdateTemplate(newTemplate.prices);
  };

  if (!showTemplateEditor) {
    return null;
  }

  return (
    <PlateDataEditor
      template={template}
      onEdit={handleEdit}
      onRemove={handleRemove}
      onAdd={handleAdd}
      onBulkClick={() => setShowBulkModal(true)}
    />
  );
};
