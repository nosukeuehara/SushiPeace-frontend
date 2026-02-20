import type { PlateTemplate } from "@/types";
import React from "react";
import { PlateTemplateEditor } from "./PlateTemplateEditor";

const PlateDataComponent = ({
  setIsTemplateEditorOpen,
  isTemplateEditorOpen,
  template,
  setEditingPlate,
  handleUpdateTemplate,
  setShowBulkModal,
}: {
  setIsTemplateEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTemplateEditorOpen: boolean;
  template: PlateTemplate | null;
  setEditingPlate: React.Dispatch<
    React.SetStateAction<{ originalColor: string; price: string } | null>
  >;
  handleUpdateTemplate: (updatedPrices: Record<string, number>) => void;
  setShowBulkModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="mb-4 text-center">
        <button
          className="text-gray-600 text-sm"
          onClick={() => setIsTemplateEditorOpen((prev) => !prev)}
        >
          <span className="text-gray-600 px-4 py-1">
            {isTemplateEditorOpen ? "皿設定 とじる" : "皿設定 ひらく"}
          </span>
        </button>
      </div>

      {template && isTemplateEditorOpen && (
        <div className="p-4 mb-6 bg-neutral-50">
          <PlateTemplateEditor
            template={template}
            onEdit={(color, price) =>
              setEditingPlate({ originalColor: color, price: String(price) })
            }
            onRemove={(color) => {
              const updated = { ...template.prices };
              delete updated[color];
              handleUpdateTemplate(updated);
            }}
            onAdd={(price) => {
              const color = `${price}円 皿`;
              const updated = { ...template.prices, [color]: price };
              handleUpdateTemplate(updated);
            }}
            onBulkClick={() => setShowBulkModal(true)}
          />
        </div>
      )}
    </>
  );
};

export default PlateDataComponent;
