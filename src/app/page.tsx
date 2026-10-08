import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import BookingForm from '@/components/BookingForm';
import StudioSection from '@/components/StudioSection';
import ArtistsSection from '@/components/ArtistsSection';
import VisitSection from '@/components/VisitSection';
export default function Home() {
  return <><Header /><main><Hero />
    <StudioSection />
    <ArtistsSection />
    <section id="work" className="selected-work section-wrap"><div className="section-heading"><p className="section-label">On the skin</p><span className="mono">A small tattoo atlas / 01—06</span></div><div className="work-intro"><h2>Drawn for<br />a body.</h2><p>Every piece begins with a person, then finds the line only their body can hold. No flash sheets. No second copies.</p></div><Gallery /><p className="gallery-end mono">Open a tattoo note for its artist, placement, and the thinking behind it.</p></section>
    <section className="appointment" id="appointment"><Image className="appointment-backdrop" src="/images/process-desk-light.webp" alt="" fill sizes="100vw" /><div className="appointment-wash" aria-hidden="true" /><div className="section-wrap appointment-wrap"><div className="section-heading"><p className="section-label">How it happens</p><span className="mono">A clear process. Room to think.</span></div><div className="appointment-layout"><h2>We start<br />with a talk.</h2><div className="steps"><article><span className="step-number">I</span><div><h3>Tell us the idea</h3><p>Bring a reference, a rough sketch, a place, a person, or just a few words. We can work with a beginning.</p></div></article><article><span className="step-number">II</span><div><h3>Draw it together</h3><p>Your artist designs for your body, not a blank page. We make changes with you until the piece feels right.</p></div></article><article><span className="step-number">III</span><div><h3>Make a day of it</h3><p>We set aside time for one client at a time. You leave with clear aftercare and a way to reach us while it heals.</p></div></article></div></div><div className="appointment-bottom"><span>No borrowed designs. No need to decide today.</span><a className="button button-dark" href="#book">Tell us your idea</a></div></div></section>
    <VisitSection />
    <section id="book" className="booking section-wrap"><div className="booking-intro"><p className="section-label">Start here</p><h2>What have<br />you been<br />thinking about?</h2><p>A few lines is plenty. We’ll take it from there.</p></div><BookingForm /></section>
  </main><footer className="footer section-wrap"><div className="footer-top"><a className="wordmark" href="#top">NOCTURNE<span>TATTOO HOUSE</span></a><p>Bring the idea.<br />We’ll make room for it.</p><a className="text-link" href="#top">Back to the top</a></div><div className="footer-bottom mono"><span>© 2026 Nocturne Tattoo House</span><span>Private work. By appointment.</span><span>For the long run.</span></div></footer></>;
}
