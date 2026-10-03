export function AmbientBackground() {
  // Latitude ellipses — horizontal rings that curve around the sphere.
  // y-position walks from top to bottom of the sphere.
  // rx/ry scale based on distance from equator (smaller near poles).
  const latitudes = [
    { y: 210, rx: 130, ry: 32 },
    { y: 265, rx: 220, ry: 55 },
    { y: 335, rx: 290, ry: 72 },
    { y: 400, rx: 335, ry: 84 },
    { y: 450, rx: 350, ry: 88 }, // equator
    { y: 500, rx: 335, ry: 84 },
    { y: 565, rx: 290, ry: 72 },
    { y: 635, rx: 220, ry: 55 },
    { y: 690, rx: 130, ry: 32 },
  ];

  // Longitude ellipses — vertical rings around the sphere.
  // rx varies from 0 (side view) to 350 (front view).
  const longitudes = [
    { rx: 60 },
    { rx: 130 },
    { rx: 195 },
    { rx: 250 },
    { rx: 300 },
    { rx: 340 },
    { rx: 350 },
    { rx: 340 },
    { rx: 300 },
    { rx: 250 },
    { rx: 195 },
    { rx: 130 },
    { rx: 60 },
  ];

  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Primary sphere — large, palette-gradient stroke */}
      <svg
        className="wireframe"
        viewBox="0 0 900 900"
        fill="none"
        strokeWidth="1"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="wireframeGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3D52A0" />
            <stop offset="28%" stopColor="#7091E6" />
            <stop offset="52%" stopColor="#8697C4" />
            <stop offset="78%" stopColor="#ADBBDA" />
            <stop offset="100%" stopColor="#EDE8F5" />
          </linearGradient>

          <radialGradient id="sphereFill" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#7091E6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#3D52A0" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        {/* Faint interior fill for volume */}
        <circle cx="450" cy="450" r="350" fill="url(#sphereFill)" />

        <g stroke="url(#wireframeGrad)">
          {/* Latitudes */}
          {latitudes.map((l, i) => (
            <ellipse
              key={`lat-${i}`}
              cx="450"
              cy={l.y}
              rx={l.rx}
              ry={l.ry}
              opacity={0.85}
            />
          ))}

          {/* Longitudes */}
          {longitudes.map((l, i) => (
            <ellipse
              key={`lon-${i}`}
              cx="450"
              cy="450"
              rx={l.rx}
              ry="350"
              opacity={0.85}
            />
          ))}

          {/* Outer boundary — reinforces the sphere silhouette */}
          <circle cx="450" cy="450" r="350" opacity="0.95" />
        </g>

        {/* Node dots at intersections for that "mesh" feel */}
        <g fill="#7091E6" opacity="0.6">
          {[
            [450, 100],
            [450, 800],
            [100, 450],
            [800, 450],
            [215, 215],
            [685, 215],
            [215, 685],
            [685, 685],
          ].map(([cx, cy], i) => (
            <circle key={`dot-${i}`} cx={cx} cy={cy} r="2.5" />
          ))}
        </g>
      </svg>

      {/* Secondary sphere — smaller, reverse rotation, lighter */}
      <svg
        className="wireframe-secondary"
        viewBox="0 0 700 700"
        fill="none"
        strokeWidth="0.8"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="wireframeGrad2"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ADBBDA" />
            <stop offset="50%" stopColor="#8697C4" />
            <stop offset="100%" stopColor="#7091E6" />
          </linearGradient>
        </defs>

        <g stroke="url(#wireframeGrad2)">
          {[180, 230, 275, 310, 330, 310, 275, 230, 180].map((rx, i) => (
            <ellipse
              key={`slat-${i}`}
              cx="350"
              cy={150 + i * 50}
              rx={rx}
              ry={rx * 0.25}
              opacity={0.75}
            />
          ))}
          {[60, 130, 200, 260, 310, 330, 310, 260, 200, 130, 60].map(
            (rx, i) => (
              <ellipse
                key={`slon-${i}`}
                cx="350"
                cy="350"
                rx={rx}
                ry="330"
                opacity={0.75}
              />
            )
          )}
          <circle cx="350" cy="350" r="330" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}