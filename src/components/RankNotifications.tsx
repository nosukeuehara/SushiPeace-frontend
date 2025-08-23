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
    <div className="absolute right-2 top-4 z-50 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={` p-2 font-bold rounded shadow-md border-l-4 ${
            n.type === "group"
              ? "bg-yellow-100 border-yellow-600 text-yellow-800"
              : "bg-green-100 border-green-600 text-green-800"
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
