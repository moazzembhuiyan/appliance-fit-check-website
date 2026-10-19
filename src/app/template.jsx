/** Subtle route-entry transition (pure CSS; disabled for reduced motion in globals.css). */
export default function Template({ children }) {
  return <div className="route-in">{children}</div>;
}
