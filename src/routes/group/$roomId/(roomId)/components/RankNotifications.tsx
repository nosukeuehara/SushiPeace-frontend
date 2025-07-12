type Notification = {
  id: number;
  type: "group" | "personal";
  message: string;
};

export function RankNotifications({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <div className="rank-banners">
      {notifications.map((n) => (
        <div key={n.id} className={`rank-banner rank-banner--${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
