import React from "react";

const RankingViewer = ({
  showRanking,
  setShowRanking,
  roomId,
  setUserId,
}: {
  showRanking: boolean;
  setShowRanking: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div className="grid gap-2 pb-2 grid-cols-2">
      <button className="text-gray-600" onClick={() => setShowRanking((prev) => !prev)}>
        {showRanking ? "ランキングを隠す" : "ランキングを見る"}
      </button>
      <button
        className="text-gray-600"
        onClick={() => {
          localStorage.removeItem(`sushi-user-id-${roomId}`);
          setUserId(null);
        }}
      >
        ユーザーを選び直す
      </button>
    </div>
  );
};

export default RankingViewer;
