import type { PlateTemplate } from "@/types";
import { PlateDataEditor } from "./PlateDataEditor";

export const PlateEditContainer = ({
  template,
  setEditingPlate,
  handleUpdateTemplate,
  setShowBulkModal,
  showTemplateEditor,
}: {
  template: PlateTemplate | null;
  setEditingPlate: React.Dispatch<
    React.SetStateAction<{ originalColor: string; price: string } | null>
  >;
  handleUpdateTemplate: (updatedPrices: Record<string, number>) => void;
  setShowBulkModal: React.Dispatch<React.SetStateAction<boolean>>;
  showTemplateEditor: boolean;
}) => {
  let content: React.ReactNode = null;

  const handleEdit = (color: string, price: number) => {
    setEditingPlate({ originalColor: color, price: String(price) });
  };

  if (!template) {
    content = (
      <div className="p-4 bg-neutral-50 text-gray-600">皿データを取得できませんでした。</div>
    );
  } else if (showTemplateEditor) {
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
    content = (
      <PlateDataEditor
        template={template}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onAdd={handleAdd}
        onBulkClick={() => setShowBulkModal(true)}
      />
    );
  }
  return <>{content}</>;
};
