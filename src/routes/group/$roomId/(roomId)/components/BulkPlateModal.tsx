type BulkEntry = {color: string; price: number};

type Props = {
  entries: BulkEntry[];
  onChange: (entries: BulkEntry[]) => void;
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
    <div className="modal">
      <div className="modal-content">
        <h3>皿の一括登録</h3>
        <p>皿の名前と金額を入力してください。</p>

        {entries.map((entry, index) => (
          <div key={index} className="modal-row">
            <input
              type="text"
              placeholder="皿の名前"
              value={entry.color}
              onChange={(e) => {
                const updated = [...entries];
                updated[index].color = e.target.value;
                onChange(updated);
              }}
            />
            <input
              type="number"
              placeholder="金額"
              value={entry.price}
              onChange={(e) => {
                const updated = [...entries];
                updated[index].price = Number(e.target.value);
                onChange(updated);
              }}
            />
          </div>
        ))}

        <div className="modal-buttons">
          <button onClick={onAddRow}>＋行を追加</button>
          <button onClick={onSave}>保存</button>
          <button onClick={onCancel}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};
