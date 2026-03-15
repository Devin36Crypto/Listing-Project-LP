export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src="/prism-logo.png"
      alt="Listening Project Logo"
      className={`${className}`}
    />
  );
}
