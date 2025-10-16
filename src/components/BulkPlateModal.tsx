import {useEffect} from "react";

type Props = {
  entries: string[];
  onChange: (entries: string[]) => void;
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
  useEffect(() => {
    const id = "plate-price-0";
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) {
        el.focus();
        const v = el.value ?? "";
        el.setSelectionRange(v.length, v.length);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const focusRow = (index: number) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(
        `plate-price-${index}`
      ) as HTMLInputElement | null;
      if (el) {
        el.focus();
        const v = el.value ?? "";
        el.setSelectionRange(v.length, v.length);
      }
    });
  };

  const closeAndReset = () => {
    onChange([""]);
    onCancel();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-11/12 max-w-md p-6 bg-neutral-100 rounded-lg shadow-lg">
        <h3 className="mb-2 text-lg font-bold text-gray-600">皿の一括登録</h3>
        <p className="mb-4 text-sm text-gray-600">
          皿の金額を入力してください。
        </p>

        {entries.map((price, index) => (
          <div key={index} className="flex flex-col gap-2 mb-3 sm:flex-row">
            <input
              id={`plate-price-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              enterKeyHint="next"
              placeholder="金額"
              className="flex-1 p-2 border border-gray-300 focus:outline-none focus:ring-0"
              value={String(price)}
              onChange={(e) => {
                const updated = [...entries];
                updated[index] = e.target.value.replace(/[^0-9]/g, "");
                onChange(updated);
              }}
              onFocus={(e) => {
                const v = e.currentTarget.value ?? "";
                e.currentTarget.setSelectionRange(v.length, v.length);
              }}
            />
          </div>
        ))}

        <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              const nextIndex = entries.length;
              onAddRow();
              focusRow(nextIndex);
            }}
            className="px-3 py-1 bg-gray-200"
          >
            <span className="text-gray-600">＋行を追加</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSave();
              closeAndReset();
            }}
            className="px-3 py-1 text-neutral-50 bg-teal-600 shadow"
          >
            <span className="text-stone-100">保存</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const hasInput = entries.some((price) => price.trim() !== "");
              if (hasInput) {
                const ok = window.confirm(
                  "入力された内容はすべて破棄されます。本当にキャンセルしますか？"
                );
                if (!ok) return;
              }
              closeAndReset();
            }}
            className="px-3 py-1 bg-red-600"
          >
            <span className="text-stone-100">キャンセル</span>
          </button>
        </div>
      </div>
    </div>
  );
};
