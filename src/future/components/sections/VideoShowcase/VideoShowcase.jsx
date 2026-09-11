import { useState } from 'react'
import { Container } from '@/future/components/ui/Container'
import { SectionHeading } from '@/future/components/common/SectionHeading'
import { Modal } from '@/future/components/ui/Modal'
import { videos } from '@/future/data/videos'
import './VideoShowcase.css'

function VideoCard({ video, onPlay }) {
  return (
    <article className="video-card">
      <button type="button" className="video-card__trigger" onClick={() => onPlay(video)}>
        <div className="media-placeholder">{video.title}</div>
        <span className="video-card__play">Play</span>
      </button>
      <p className="eyebrow">{video.category}</p>
      <h3>{video.title}</h3>
    </article>
  )
}

export function VideoShowcase() {
  const featured = videos.find((item) => item.featured) ?? videos[0]
  const rest = videos.filter((item) => item.id !== featured?.id)
  const [active, setActive] = useState(null)

  return (
    <section className="video-showcase">
      <Container>
        <div className="video-hero">
          <SectionHeading
            eyebrow="Video"
            title="A cinematic archive."
            description="Featured films, interviews, and event coverage. Full player behavior will come in a later pass."
          />
        </div>
        {featured ? (
          <div className="featured-video">
            <VideoCard video={featured} onPlay={setActive} />
          </div>
        ) : null}
        <div className="video-grid">
          {rest.map((video) => (
            <VideoCard key={video.id} video={video} onPlay={setActive} />
          ))}
        </div>
      </Container>
      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.title}>
        {active ? (
          <div className="video-player-shell">
            <div className="media-placeholder">Video player placeholder</div>
            <h2>{active.title}</h2>
            <p>{active.category}</p>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}
