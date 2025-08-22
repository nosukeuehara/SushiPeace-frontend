import {useNavigate} from "@tanstack/react-router";

type Props = {
  roomId: string;
};

export const ShareButton = ({roomId}: Props) => {
  const navigate = useNavigate();

  const handleShare = () => {
    navigate({
      to: "/new-sushi/group/$roomId/result",
      params: {roomId},
    });
  };

  return (
    <button
      className="block mx-auto bg-rose-400 shadow px-3 py-1"
      onClick={handleShare}
    >
      <span className="font-semibold text-neutral-50">結果を確認</span>
    </button>
  );
};
