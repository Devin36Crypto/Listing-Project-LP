export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src="/icon.png"
      alt="Listening Project Logo"
      className={`${className} rounded-lg shadow-lg`}
    />
  );
}
