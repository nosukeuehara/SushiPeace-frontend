import {useNavigate} from "@tanstack/react-router";

type Props = {
  roomId: string;
};

export const ShareButton = ({roomId}: Props) => {
  const navigate = useNavigate();

  const handleShare = () => {
    navigate({
      to: "/sushi/group/$roomId/result",
      params: {roomId},
    });
  };

  return (
    <button
      className="block mx-auto bg-orange-600 rounded px-3 py-1"
      onClick={handleShare}
    >
      <span className="font-semibold text-neutral-100">結果を確認</span>
    </button>
  );
};
