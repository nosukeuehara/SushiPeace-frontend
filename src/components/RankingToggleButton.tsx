import React from "react";

const ToggleRankingButton = ({
  showRanking,
  setShowRanking,
}: {
  showRanking: boolean;
  setShowRanking: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <button className="text-gray-600" onClick={() => setShowRanking((prev) => !prev)}>
      {showRanking ? "ランキングを隠す" : "ランキングを見る"}
    </button>
  );
};

export default ToggleRankingButton;
