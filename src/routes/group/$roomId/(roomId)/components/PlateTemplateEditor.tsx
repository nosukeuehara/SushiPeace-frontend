import {useState} from "react";

type Props = {
  template: {prices: Record<string, number>};
  onEdit: (color: string, price: number) => void;
  onRemove: (color: string) => void;
  onAdd: (color: string, price: number) => void;
  onBulkClick: () => void;
};

export const PlateTemplateEditor = ({
  template,
  onEdit,
  onRemove,
  onAdd,
  onBulkClick,
}: Props) => {
  const [newPlate, setNewPlate] = useState("");
  const [newPrice, setNewPrice] = useState(0);

  return (
    <div className="group-room__template-editor">
      <h3>皿の設定</h3>
      <button onClick={onBulkClick}>📝 一括登録</button>

      <ul>
        {Object.entries(template.prices).map(([color, price]) => (
          <li key={`plate-${color}`}>
            <span>{color}</span>
            <span>{price} 円</span>
            <button onClick={() => onEdit(color, price)}>編集</button>
            <button onClick={() => onRemove(color)}>削除</button>
          </li>
        ))}
      </ul>

      <input
        placeholder="新しい皿"
        value={newPlate}
        onChange={(e) => setNewPlate(e.target.value)}
      />
      <input
        placeholder="金額"
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(Number(e.target.value))}
      />
      <button
        onClick={() => {
          if (newPlate.trim() && newPrice > 0) {
            onAdd(newPlate.trim(), newPrice);
            setNewPlate("");
            setNewPrice(0);
          }
        }}
      >
        追加
      </button>
    </div>
  );
};
