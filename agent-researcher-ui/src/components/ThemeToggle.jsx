export default function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-300 border
        ${dark
          ? "bg-accent border-accent"
          : "bg-gray-200 border-gray-300"
        }
      `}
    >
      <span
        className={`
          absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-xs
          ${dark
            ? "left-6 bg-white"
            : "left-0.5 bg-white"
          }
        `}
      >
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
