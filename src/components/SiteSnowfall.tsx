"use client";

// One real canvas-based snowfall (drift, wind, gentle 3D tumble) covering
// the whole viewport, replacing the half-dozen hand-rolled CSS "snow dot"
// arrays that used to be duplicated across individual sections. Fixed to
// the viewport rather than the page, so it reads as falling in front of
// the site rather than being tied to any one section's scroll position.
import Snowfall from "react-snowfall";

export default function SiteSnowfall() {
  return (
    <Snowfall
      snowflakeCount={70}
      color="#eaf6ff"
      radius={[1, 3.2]}
      speed={[0.4, 1.4]}
      wind={[-0.3, 0.6]}
      opacity={[0.35, 0.85]}
      enable3DRotation
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 40,
        pointerEvents: "none",
      }}
    />
  );
}
