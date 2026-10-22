// The club mark, redrawn in code from the logo's structure:
// a hub, five nodes on spokes, and signal arcs. It uses currentColor so the
// header, footer and favicon can share one drawing in the site's own colours.
export default function IotMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d="M28.4 30.5L22.7 16.2M24.4 34.7L12.3 30.5M25.1 40.8L14.8 47.5M37.9 38.3L48.6 40.2M34.8 42.9L41.5 53.2" />
      <circle cx="31" cy="37" r="7" fill="currentColor" stroke="none" />
      <circle cx="21" cy="12" r="4.5" />
      <circle cx="8" cy="29" r="4.5" />
      <circle cx="11" cy="50" r="4.5" />
      <circle cx="53" cy="41" r="4.5" />
      <circle cx="44" cy="57" r="4.5" />
      <path d="M42.3 17.2A11 11 0 0 1 50.5 24.6M43.5 11.4A17 17 0 0 1 56.2 22.7M44.8 5.5A23 23 0 0 1 61.9 20.9" />
    </svg>
  );
}
