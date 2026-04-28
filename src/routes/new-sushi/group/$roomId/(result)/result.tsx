import { useParams } from "@tanstack/react-router";
import { useRoom } from "@/hooks/useRoom";
import { generateShareText } from "@/util/shareText";
import { AsyncState } from "@/components/states/AsyncState";
import { ResultPage } from "@/components/page/resultPage/ResultPage";

const noDataText = "データの取得に失敗しました";

export const Route = createFileRoute({
  component: SushiResultComponent,
});

function SushiResultComponent() {
  const { roomId } = useParams({ strict: false });
  const safeRoomId: string = roomId ?? "";
  const roomQuery = useRoom(safeRoomId);
  const template = roomQuery.data?.template;
  const shareUrl = `${window.location.origin}/new-sushi/group/${roomId}/result`;
  const shareText =
    roomQuery.data &&
    template &&
    generateShareText(roomQuery.data.groupName, roomQuery.data.members, shareUrl);

  return (
    <AsyncState
      query={roomQuery}
      noDataText={noDataText}
      render={(data) => {
        return <ResultPage data={data} safeRoomId={safeRoomId} shareText={shareText} />;
      }}
    />
  );
}
