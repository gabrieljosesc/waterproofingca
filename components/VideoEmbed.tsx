type VideoEmbedProps = {
  /** Direct MP4 URL (self-hosted). Takes priority over `youtubeId`. */
  src?: string;
  /** Poster image shown before playback (used with `src`). */
  poster?: string;
  /** YouTube video ID (the part after `v=` in a watch URL). */
  youtubeId?: string;
  title: string;
};

/** Responsive 16:9 video — self-hosted MP4 or YouTube. Renders nothing if neither is set. */
export function VideoEmbed({ src, poster, youtubeId, title }: VideoEmbedProps) {
  if (src) {
    return (
      <div className="video-embed">
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          title={title}
          aria-label={title}
        />
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
