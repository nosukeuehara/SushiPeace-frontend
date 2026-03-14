export const BulkPlateModalToggleButton = ({ onBulkClick }: { onBulkClick: () => void }) => {
  return (
    <button className="text-teal-600" onClick={onBulkClick}>
      一括登録
    </button>
  );
};
