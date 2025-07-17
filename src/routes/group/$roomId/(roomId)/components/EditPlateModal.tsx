type Props = {
  color: string;
  price: number;
  onChange: (newColor: string, newPrice: number) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const EditPlateModal = ({
  color,
  price,
  onChange,
  onSave,
  onCancel,
}: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-11/12 max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-lg font-bold">皿の情報を編集</h3>

        <label className="flex flex-col mb-3 text-sm">
          名前（皿の種類）:
          <input
            type="text"
            className="w-full p-2 mt-1 border rounded"
            value={color}
            onChange={(e) => onChange(e.target.value, price)}
          />
        </label>

        <label className="flex flex-col mb-3 text-sm">
          金額（円）:
          <input
            type="number"
            className="w-full p-2 mt-1 border rounded"
            value={price}
            onChange={(e) => onChange(color, Number(e.target.value))}
          />
        </label>

        <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:justify-end">
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
