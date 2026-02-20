export function SelectUser({
  members,
  onSelectUser,
}: {
  members: { userId: string; name: string; counts: Record<string, number> }[];
  onSelectUser: (selectedUserId: string) => void;
}) {
  return (
    <div className="mx-auto text-center max-w-xl min-h-screen px-5 py-16 bg-white">
      <h2 className="mb-16 text-xl text-gray-600 font-bold">あなたは誰ですか？</h2>
      <ul className="flex flex-col gap-7">
        {members.map((m) => (
          <li key={m.userId}>
            <button onClick={() => onSelectUser(m.userId)}>
              <span className="text-gray-600">{m.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
