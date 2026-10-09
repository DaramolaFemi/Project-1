'use client';
import { useRef, useState } from 'react';
export default function BookingForm() {
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [summary, setSummary] = useState('');
  const result = useRef<HTMLDivElement>(null);
  return <form className="booking-form" onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(`Consultation enquiry\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nArtist: ${data.get('artist')}\n\n${data.get('idea')}`);
    setPrepared(true); setCopied(false); setCopyFailed(false);
    requestAnimationFrame(() => result.current?.focus());
  }}>
    <div className="booking-form-head"><span className="mono">Appointment request</span><p>A rough thought is enough. We will talk through the rest together.</p></div>
    <fieldset className="booking-fieldset"><legend>A little about you</legend><div className="form-row"><label><span className="form-label">Your name</span><input name="name" autoComplete="name" required maxLength={100} placeholder="First and last name" /></label><label><span className="form-label">Email address</span><input name="email" type="email" autoComplete="email" required maxLength={200} /></label></div></fieldset>
    <fieldset className="booking-fieldset booking-fieldset-idea"><legend>The piece</legend><label><span className="form-label">Artist preference</span><select name="artist" defaultValue="Help me choose"><option>Help me choose</option><option>Amara Vale</option><option>Eli Mercer</option><option>Santi Reyes</option></select></label><label><span className="form-label">What are you returning to?</span><textarea name="idea" rows={4} required minLength={10} maxLength={3000} placeholder="A reference, a memory, a place, a few words. It does not need to be finished." /></label></fieldset>
    <div className="form-end"><p>Start with what you have. A reference, a memory, or a few words is enough.</p><button className="form-submit" type="submit"><span>Start the conversation</span></button></div>
    {prepared && <div ref={result} tabIndex={-1} className="form-result" role="status"><span className="mono">Your consultation note</span><h3>Keep this thought close.</h3><p>Your note is ready to copy and bring to the conversation.</p><button type="button" className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); setCopyFailed(false); } catch { setCopied(false); setCopyFailed(true); } }}>{copied ? 'Copied' : 'Copy your note'}</button>{copyFailed && <p className="copy-feedback">Clipboard access is unavailable. Select and copy your note below.</p>}<details open={copyFailed || undefined}><summary>Read your note</summary><pre>{summary}</pre></details></div>}
  </form>;
}
