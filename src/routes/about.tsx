// "/about" にマッチするルートを定義
export const Route = createFileRoute({
  component: About,
});

function About() {
  return <div className="p-2">Hello from About!</div>;
}
