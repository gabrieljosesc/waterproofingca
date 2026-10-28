"use client";

import Image from "next/image";
import { useState } from "react";

type VideoEmbedProps = {
  /** Direct MP4 URL (self-hosted). Takes priority over `youtubeId`. */
  src?: string;
  /** Poster image shown before playback (used with `src`). */
  poster?: string;
  /** YouTube video ID (the part after `v=` in a watch URL). */
  youtubeId?: string;
  title: string;
};

/**
 * Responsive 16:9 video — self-hosted MP4 or YouTube. Renders nothing if
 * neither is set.
 *
 * The self-hosted version shows only the poster until the visitor presses
 * play, so the page never downloads the video file on load (it's ~19 MB;
 * browsers would otherwise fetch several MB of it just to show a frame).
 */
export function VideoEmbed({ src, poster, youtubeId, title }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  if (src) {
    return (
      <div className="video-embed">
        {playing ? (
          <video
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            preload="auto"
            title={title}
            aria-label={title}
          />
        ) : (
          <button
            type="button"
            className="video-embed__play"
            onClick={() => setPlaying(true)}
            aria-label={`Watch the video: ${title}`}
          >
            {poster && (
              <Image
                src={poster}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 960px"
                style={{ objectFit: "cover" }}
              />
            )}
            <span className="video-embed__icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="video-embed__label">Watch the video</span>
          </button>
        )}
      </div>
    );
  }
  if (youtubeId) {
    return (
      <div className="video-embed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  return null;
}
