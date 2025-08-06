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
    <div className="fixed top-4 left-1/2 z-50 w-[90%] max-w-xs -translate-x-1/2 space-y-2 md:right-2 md:left-auto md:translate-x-0">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-2 font-bold rounded shadow-md border-l-4 ${
            n.type === "group"
              ? "bg-yellow-100 border-yellow-600 text-yellow-800"
              : "bg-blue-100 border-blue-600 text-blue-800"
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
