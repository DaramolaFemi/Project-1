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
    <div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="First and last name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@example.com" /></label></div>
    <label>Artist preference<select name="artist" defaultValue="Help me choose"><option>Help me choose</option><option>Amara Vale</option><option>Eli Mercer</option><option>Santi Reyes</option></select></label>
    <label>A little about your idea<textarea name="idea" rows={3} required minLength={10} maxLength={3000} placeholder="The piece, the placement, what it means to you…" /></label>
    <div className="form-end"><p>This is a portfolio studio. Your details stay in this browser and are not submitted.</p><button className="button button-bone" type="submit">Prepare enquiry</button></div>
    {prepared && <div ref={result} tabIndex={-1} className="form-result" role="status"><h3>Your idea, ready to share.</h3><p>No enquiry has been sent. You can copy your details to keep for a future consultation.</p><button type="button" className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); setCopyFailed(false); } catch { setCopied(false); setCopyFailed(true); } }}>{copied ? 'Copied to clipboard' : 'Copy enquiry'}</button>{copyFailed && <p className="copy-feedback">Clipboard access is unavailable. Select and copy your enquiry below.</p>}<details open={copyFailed || undefined}><summary>View your enquiry</summary><pre>{summary}</pre></details></div>}
  </form>;
}
