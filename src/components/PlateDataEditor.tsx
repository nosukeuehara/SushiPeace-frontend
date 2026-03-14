import { useState } from "react";
import { BulkPlateModalToggleButton } from "./BulkPlateModalToggleButton";

type Props = {
  template: { prices: Record<string, number> };
  onEdit: (label: string, price: number) => void;
  onRemove: (label: string) => void;
  onAdd: (price: number) => void;
  onBulkClick: () => void;
};

export const PlateDataEditor = ({ template, onEdit, onRemove, onAdd, onBulkClick }: Props) => {
  const [newPrice, setNewPrice] = useState("");

  const confirmAndRemovePlate = (label: string) => {
    if (window.confirm(`本当に${label}を削除しますか？`)) {
      onRemove(label);
    }
  };

  return (
    <div className="p-4 bg-neutral-50">
      <div className="flex justify-between mb-2">
        <span className="font-bold text-xl text-gray-600">皿データ</span>
        <BulkPlateModalToggleButton onBulkClick={onBulkClick} />
      </div>

      <ul className="mb-4 list-none p-0">
        {Object.keys(template.prices).length === 0 ? (
          <p className="text-gray-600 mb-4">お皿の金額を設定しましょう。</p>
        ) : (
          <ul className="mb-4 list-none p-0">
            {Object.entries(template.prices)
              .sort((a, b) => b[1] - a[1])
              .map(([label, price]) => (
                <li
                  key={`plate-${label}`}
                  className="grid items-baseline grid-cols-[1fr_auto] py-1"
                >
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-gray-600 w-[68px] text-right">
                      {price}円
                    </span>
                    <span className="text-xl pl-2 text-gray-600">皿</span>
                  </div>

                  <div className="flex gap-5">
                    <button onClick={() => onEdit(label, price)}>
                      <span className="text-gray-600">編集</span>
                    </button>
                    <button onClick={() => confirmAndRemovePlate(label)}>
                      <span className="text-red-700">削除</span>
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </ul>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          placeholder="金額"
          type="text"
          className="flex-1 p-2 border border-gray-300 focus:outline-none focus:ring-0"
          value={newPrice}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/[^0-9]/g, "");
            setNewPrice(onlyNums);
          }}
        />
        <button
          className="px-3 py-1 text-neutral-50 bg-teal-600 shadow"
          onClick={() => {
            if (Number(newPrice) > 0) {
              onAdd(Number(newPrice));
              setNewPrice("");
            }
          }}
        >
          追加
        </button>
      </div>
    </div>
  );
};
