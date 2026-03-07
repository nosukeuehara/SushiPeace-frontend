import { useState, useEffect } from "react";

export const Footer = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);
  return (
    <footer className="flex justify-center max-w-xl mx-auto py-4 flex-col items-center bg-rose-300">
      <div className="mb-2 mt-2">
        <a
          href="https://forms.gle/pm4nnWRqcaiEgMCb6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-50 ml-2 text-sm "
        >
          改善フォーム
          <img className="inline w-4 h-4 ml-1" src="./externalLink.svg" alt="External Link" />
        </a>
      </div>
      <span className="text-sm text-neutral-50">© {year} SushiPals</span>
    </footer>
  );
};
