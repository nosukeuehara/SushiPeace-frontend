import type { PlateTemplate } from "@/types";
import { PlateDataEditor } from "./PlateDataEditor";

export const PlateEditContainer = ({
  template,
  handleEdit,
  handleUpdateTemplate,
  setShowBulkModal,
  showTemplateEditor,
}: {
  template: PlateTemplate;
  handleEdit: (color: string, price: number) => void;
  handleUpdateTemplate: (updatedPrices: Record<string, number>) => void;
  setShowBulkModal: React.Dispatch<React.SetStateAction<boolean>>;
  showTemplateEditor: boolean;
}) => {
  const handleRemove = (color: string) => {
    const updated = { ...template.prices };
    delete updated[color];
    handleUpdateTemplate(updated);
  };

  const handleAdd = (price: number) => {
    const color = `${price}円皿`;
    const updated = { ...template.prices, [color]: price };
    handleUpdateTemplate(updated);
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
