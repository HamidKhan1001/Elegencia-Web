"use client";

import { useState } from "react";

interface VideoEmbedProps {
  youtubeId: string;
  title: string;
}

// Click-to-load facade: only a static thumbnail (a few KB) loads up front.
// YouTube's real iframe — which pulls in its own heavy player script — is
// created only once someone actually clicks play, so embedding a video
// here costs nothing on page load.
export default function VideoEmbed({ youtubeId, title }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#0a1628",
        boxShadow: "0 20px 60px rgba(10,22,40,0.25)",
        cursor: playing ? "default" : "pointer",
      }}
      onClick={() => setPlaying(true)}
      role={playing ? undefined : "button"}
      aria-label={playing ? undefined : `Play video: ${title}`}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(10,22,40,0.18)",
              transition: "background 0.25s ease",
            }}
          >
            <div style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "rgba(255,255,255,0.94)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(10,22,40,0.35)",
            }}>
              <div style={{
                width: 0, height: 0,
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderLeft: "20px solid #0a1628",
                marginLeft: "5px",
              }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
