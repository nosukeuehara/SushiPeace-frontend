import type { PlateTemplate } from "@/types";
import { PlateDataEditor } from "./PlateDataEditor";

export const PlateEditContainer = ({
  template,
  setEditingPlate,
  handleUpdateTemplate,
  setShowBulkModal,
  showTemplateEditor,
}: {
  template: PlateTemplate;
  setEditingPlate: React.Dispatch<
    React.SetStateAction<{ originalColor: string; price: string } | null>
  >;
  handleUpdateTemplate: (updatedPrices: Record<string, number>) => void;
  setShowBulkModal: React.Dispatch<React.SetStateAction<boolean>>;
  showTemplateEditor: boolean;
}) => {
  const handleEdit = (color: string, price: number) => {
    setEditingPlate({ originalColor: color, price: String(price) });
  };
  const handleRemove = (color: string) => {
    const updated = { ...template.prices };
    delete updated[color];
    handleUpdateTemplate(updated);
  };

  const handleAdd = (price: number) => {
    const color = `${price}円 皿`;
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
