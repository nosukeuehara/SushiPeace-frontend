type Props = {
  price: string;
  onChange: (newPrice: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const EditPlateModal = ({price, onChange, onSave, onCancel}: Props) => {
  const color = `${price}円皿`;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-11/12 max-w-md p-6 bg-neutral-100 rounded-lg shadow-lg">
        <h3 className="mb-4 text-lg font-bold">皿の情報を編集</h3>
        <p className="mb-3 text-sm">皿の名前: {color}</p>

        <label className="flex flex-col mb-3 text-sm">
          金額（円）:
          <input
            placeholder="金額を入力"
            type="text"
            className="w-full p-2 mt-1 border rounded"
            value={String(price)}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>

        <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:justify-end">
          <button
            onClick={onSave}
            className="px-3 py-1 text-neutral-100 bg-teal-600 rounded"
          >
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
