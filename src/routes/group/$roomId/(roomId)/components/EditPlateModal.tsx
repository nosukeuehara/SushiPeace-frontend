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
    <div className="modal">
      <div className="modal-content">
        <h3>皿の情報を編集</h3>

        <label>
          名前（皿の種類）:
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value, price)}
          />
        </label>

        <label>
          金額（円）:
          <input
            type="number"
            value={price}
            onChange={(e) => onChange(color, Number(e.target.value))}
          />
        </label>

        <div className="modal-buttons">
          <button onClick={onSave}>保存</button>
          <button onClick={onCancel}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};
