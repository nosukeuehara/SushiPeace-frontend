import {useState} from "react";

type Props = {
  template: {prices: Record<string, number>};
  onEdit: (color: string, price: number) => void;
  onRemove: (color: string) => void;
  onAdd: (price: number) => void;
  onBulkClick: () => void;
};

export const PlateTemplateEditor = ({
  template,
  onEdit,
  onRemove,
  onAdd,
  onBulkClick,
}: Props) => {
  const [newPrice, setNewPrice] = useState(0);

  return (
    <div className="p-4 mb-6 bg-gray-100 rounded">
      <h3 className="mb-2 font-bold">皿の設定</h3>
      <button className="mb-4 text-sm text-teal-700 underline" onClick={onBulkClick}>
        📝 一括登録
      </button>

      <ul className="mb-4 list-none p-0">
        {Object.entries(template.prices).map(([color, price]) => (
          <li
            key={`plate-${color}`}
            className="grid items-center grid-cols-[1fr_auto] py-1"
          >
            <span>{color}</span>
            <span>{price} 円</span>
            <div className="flex gap-2">
              <button onClick={() => onEdit(color, price)}>編集</button>
              <button onClick={() => onRemove(color)}>削除</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          placeholder="金額"
          type="number"
          className="flex-1 p-2 border rounded"
          value={newPrice}
          onChange={(e) => setNewPrice(Number(e.target.value))}
        />
        <button
          className="px-3 py-1 text-white bg-teal-600 rounded"
          onClick={() => {
            if (newPrice > 0) {
              onAdd(newPrice);
              setNewPrice(0);
            }
          }}
        >
          追加
        </button>
      </div>
    </div>
  );
};
