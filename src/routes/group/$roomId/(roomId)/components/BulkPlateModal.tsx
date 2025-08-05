type Props = {
  entries: number[];
  onChange: (entries: number[]) => void;
  onAddRow: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export const BulkPlateModal = ({
  entries,
  onChange,
  onAddRow,
  onSave,
  onCancel,
}: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-11/12 max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-2 text-lg font-bold">皿の一括登録</h3>
        <p className="mb-4 text-sm text-gray-600">
          皿の金額を入力してください。名前は自動で設定されます。
        </p>

        {entries.map((price, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 mb-3 sm:flex-row"
          >
            <input
              type="number"
              placeholder="金額"
              className="flex-1 p-2 border rounded"
              value={price}
              onChange={(e) => {
                const updated = [...entries];
                updated[index] = Number(e.target.value);
                onChange(updated);
              }}
            />
          </div>
        ))}

        <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:justify-end">
          <button onClick={onAddRow} className="px-3 py-1 bg-gray-200 rounded">
            ＋行を追加
          </button>
          <button onClick={onSave} className="px-3 py-1 text-white bg-teal-600 rounded">
            保存
          </button>
          <button onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};
