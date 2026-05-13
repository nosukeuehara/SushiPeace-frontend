import { copyTextToClipboard } from "@/util/utils";

interface Props {
  shareText: string | undefined;
}

const CopyTextToClipboadBtn = ({ shareText }: Props) => {
  const handleCopyShareText = async () => {
    if (!shareText) return;

    await copyTextToClipboard(shareText);
    alert("共有テキストをコピーしました！");
  };
  return (
    <button
      className="block w-full px-4 py-2 font-bold text-neutral-50  shadow bg-teal-500"
      onClick={handleCopyShareText}
    >
      📋 コピーして共有
    </button>
  );
};

export default CopyTextToClipboadBtn;
