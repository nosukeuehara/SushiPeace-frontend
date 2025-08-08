import type {MemberPlates, PlateTemplate} from "../types/plate";
import {generateShareText} from "../util/shareText";

type Props = {
  groupName: string;
  members: MemberPlates[];
  prices: PlateTemplate["prices"];
  roomUrl: string;
};

export const ShareButton = ({groupName, members, prices, roomUrl}: Props) => {
  const handleShare = () => {
    const text = generateShareText(groupName, members, prices, roomUrl);

    if (navigator.share) {
      navigator
        .share({
          title: `${groupName}の会計`,
          text,
          url: `${roomUrl}/result`,
        })
        .catch((err) => console.error("共有に失敗しました", err));
    } else {
      navigator.clipboard.writeText(text);
      alert("テキストをコピーしました！");
    }
  };

  return (
    <button
      className="block mx-auto bg-orange-600 rounded px-3 py-1"
      onClick={handleShare}
    >
      <span className="font-semibold text-neutral-100">会計を共有する</span>
    </button>
  );
};
