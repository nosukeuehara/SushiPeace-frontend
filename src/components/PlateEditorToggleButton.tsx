type Props = {
  showTemplateEditor: boolean;
  setShowTemplateEditor: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PlateEditorToggleButton = ({ showTemplateEditor, setShowTemplateEditor }: Props) => {
  return (
    <button
      type="button"
      className="text-gray-600 text-sm my-2 m-auto block"
      onClick={() => setShowTemplateEditor((prev) => !prev)}
    >
      皿設定 {showTemplateEditor ? "とじる" : "ひらく"}
    </button>
  );
};
