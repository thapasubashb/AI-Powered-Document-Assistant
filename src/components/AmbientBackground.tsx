export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      <svg
        className="wireframe"
        viewBox="0 0 900 900"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        aria-hidden="true"
      >
        {[30, 60, 100, 140, 180, 220, 260].map((rx, i) => (
          <ellipse
            key={`lon-${i}`}
            cx="450"
            cy="450"
            rx={rx * 1.5}
            ry="300"
            opacity={0.85 - Math.abs(i - 3) * 0.08}
          />
        ))}

        {[40, 80, 120, 160, 200, 240, 280].map((ry, i) => (
          <ellipse
            key={`lat-${i}`}
            cx="450"
            cy="450"
            rx="330"
            ry={ry * 1.1}
            opacity={0.85 - Math.abs(i - 3) * 0.08}
          />
        ))}

        <circle cx="450" cy="450" r="330" opacity="0.9" />

        <ellipse
          cx="450"
          cy="450"
          rx="360"
          ry="180"
          transform="rotate(-25 450 450)"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}