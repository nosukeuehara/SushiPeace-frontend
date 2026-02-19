type Notification = {
  id: number;
  message: string;
};

export function RankNotifications({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="fixed right-2 top-4 z-50 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={` p-2 font-bold rounded shadow-md border-l-4 bg-yellow-100 border-yellow-600 text-yellow-800`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
