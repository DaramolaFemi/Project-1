import Image from 'next/image';

export default function StudioSection() {
  return (
    <section id="studio" className="studio">
      <div className="section-wrap studio-wrap">
        <div className="section-heading">
          <p className="section-label">The house</p>
          <span className="mono">A good place to start.</span>
        </div>

        <div className="studio-statement">
          <h2>The needle<br />can wait<span className="period">.</span></h2>
          <div>
            <p className="lead">First, we want to hear what brought you here.</p>
            <p>Some people arrive with a drawing. Some bring an old photograph and a sentence they have been carrying for years. Both are a start.</p>
            <p>We talk through the idea, the placement, and what you want the piece to hold. No rush to book. No pressure to have it all figured out.</p>
          </div>
        </div>

        <div className="studio-images">
          <figure className="studio-photo studio-photo-primary">
            <Image src="/images/studio-cinematic.webp" alt="A sunlit tattoo chair in a working atelier, with sketches, ink, plants and an artist preparing the room" fill sizes="(max-width: 767px) 92vw, 66vw" />
            <figcaption className="photo-note">A look around the studio.</figcaption>
          </figure>
          <figure className="studio-photo studio-photo-detail">
            <Image src="/images/studio.webp" alt="Tattoo chairs and afternoon light inside the studio" fill sizes="(max-width: 767px) 42vw, 27vw" />
            <figcaption className="studio-image-index mono">01 / the room</figcaption>
          </figure>
        </div>

        <div className="studio-foot mono"><span>One client at a time</span><span>By appointment</span></div>
      </div>
    </section>
  );
}
