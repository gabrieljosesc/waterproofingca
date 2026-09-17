type VideoEmbedProps = {
  /** YouTube video ID (the part after `v=` in a watch URL). */
  youtubeId: string;
  title: string;
};

/** Responsive 16:9 YouTube embed. Renders nothing when there's no ID yet. */
export function VideoEmbed({ youtubeId, title }: VideoEmbedProps) {
  if (!youtubeId) return null;
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
