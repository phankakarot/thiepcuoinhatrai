'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { wedding } from '../src/data/wedding';
import './wedding.css';

type ModalName = 'rsvp' | 'wishes' | 'gift' | null;

function subscribeToSearch(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('hashchange', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('hashchange', callback);
  };
}

function getSearchSnapshot() {
  return window.location.search;
}

function Photo({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className={`photo-shell ${className} ${failed ? 'is-missing' : 'is-loaded'}`}>
    <span className="photo-placeholder" role="img" aria-label={alt}><small>ẢNH PLACEHOLDER</small>{alt}</span>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} onLoad={() => setFailed(false)} onError={() => setFailed(true)} />
  </div>;
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = ref.current; if (!el) return; const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && el.classList.add('is-visible'), { threshold: .12 }); observer.observe(el); return () => observer.disconnect(); }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function MusicControl() {
  const audioRef = useRef<HTMLAudioElement>(null); const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let active = true;
    const removeUnlockListeners = () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('keydown', unlock, true);
    };
    const start = async () => {
      try {
        await audio.play();
        if (active) setPlaying(true);
        removeUnlockListeners();
      } catch {
        // Trình duyệt sẽ cho phép phát ở tương tác đầu tiên của khách.
      }
    };
    const unlock = () => { void start(); };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('touchstart', unlock, true);
    window.addEventListener('keydown', unlock, true);
    void start();
    return () => { active = false; removeUnlockListeners(); audio.pause(); };
  }, []);
  const toggle = async () => { const audio = audioRef.current; if (!audio) return; if (!audio.paused) { audio.pause(); return; } try { await audio.play(); } catch { setPlaying(false); } };
  return <><audio ref={audioRef} src={wedding.music} autoPlay loop playsInline preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} /><button className={`music-control ${playing ? 'playing' : ''}`} onClick={toggle} aria-label={playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}><span className="music-disc">♪</span><span>{playing ? 'Đang phát' : 'Nhạc'}</span></button></>;
}

function HeroSection() {
  return <section className="hero" aria-labelledby="hero-title"><div className="hero-photos"><Photo src={wedding.images.hero} alt="Ảnh cưới mở đầu của Kim Phụng và Đình Chiến" eager /><Photo src={wedding.images.opening} alt="Ảnh cưới mở đầu thứ hai của Kim Phụng và Đình Chiến" eager /></div><div className="hero-shade" /><MusicControl /><div className="hero-copy"><p className="eyebrow">Save the date</p><h1 id="hero-title"><span>{wedding.couple.bride}</span><i>&amp;</i><span>{wedding.couple.groom}</span></h1><p className="hero-date">{wedding.displayDate}</p><blockquote>{wedding.quote}</blockquote><span className="scroll-cue">Cuộn để khám phá <b>↓</b></span></div></section>;
}

function CoupleSection() {
  return <section className="section couple-section"><Reveal><p className="script-kicker">Our story</p><h3>Một hành trình mới của chúng mình<br />bắt đầu từ <em className="script-kicker">hôm nay</em></h3></Reveal><Reveal className="couple-portrait"><Photo src={wedding.images.couple[0]} alt="Kim Phụng và Đình Chiến" /><div className="portrait-names"><span>{wedding.couple.bride}</span><i>&amp;</i><span>{wedding.couple.groom}</span></div></Reveal></section>;
}

function FamilySection() {
  return <section className="section family-section"><Reveal><p className="eyebrow dark">Cùng sự hiện diện của hai gia đình</p></Reveal><div className="family-grid">{[wedding.families.groom, wedding.families.bride].map(family => <Reveal className="family-card" key={family.label}><span className="family-label">{family.label}</span><p className="ong">Ông: <strong>{family.father}</strong></p><p className="ong">Bà: <strong>{family.mother}</strong></p><address>{family.address}</address></Reveal>)}</div></section>;
}

function InvitationSection({ invitation }: { invitation: string }) {
  return <section className="invitation-section"><Photo src={wedding.images.couple[1]} alt="Khoảnh khắc cưới của cô dâu chú rể" /><div className="invitation-card"><span className="flourish">❦</span><p className="script-kicker">Thiệp Mời</p><h2>{`Trân trọng kính mời`}</h2><p className="guest-name">{'Quý Khách'}</p><p>{invitation}</p><p className="small-caps">lễ tân hôn</p><strong className="invitation-couple">{wedding.couple.bride} &amp; {wedding.couple.groom}</strong></div></section>;
}

function EventDetails() {
  const d = wedding.event;
  return <section className="section event-section"><Reveal><p className="eyebrow dark">Save our date</p><h2>Ngày chung đôi</h2></Reveal><Reveal className="date-card"><div className="date-top"><span>{d.weekday}</span><strong>{d.day}</strong><span>Tháng {d.month}</span></div><div className="date-year">Năm {d.year}</div><p>{d.lunarDate}</p><div className="timeline">{d.schedule.map(item => <div key={item.label}><span>{item.time}</span><strong>{item.label}</strong></div>)}</div></Reveal></section>;
}

function LocationSection() {
  return <section className="location-section"><Photo src={wedding.images.location} alt="Không gian địa điểm tổ chức lễ cưới" /><div className="location-shade" /><Reveal className="location-copy"><p className="eyebrow">Địa chỉ dự tiệc</p><h2>{wedding.location.name}</h2><p>{wedding.location.address}</p><a className="outline-button" href={wedding.location.mapUrl} target="_blank" rel="noreferrer" aria-label="Mở chỉ đường trên Google Maps">Chỉ đường ↗</a></Reveal></section>;
}

function WeddingCalendar() {
  const { year, month, day } = wedding.event; const first = new Date(year, month - 1, 1).getDay(); const days = new Date(year, month, 0).getDate(); const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return <section className="section calendar-section"><Reveal><p className="script-kicker">December</p><h2>Tháng {month} · {year}</h2></Reveal><Reveal className="calendar"><div className="weekdays">{['CN','T2','T3','T4','T5','T6','T7'].map(x => <b key={x}>{x}</b>)}</div><div className="days">{cells.map((value, i) => <span key={`${value}-${i}`} className={value === day ? 'wedding-day' : ''}>{value}{value === day && <i>♥</i>}</span>)}</div></Reveal></section>;
}

function Countdown() {
  const target = useMemo(() => new Date(wedding.event.isoDate).getTime(), []); const [remaining, setRemaining] = useState(0);
  useEffect(() => { const update = () => setRemaining(Math.max(0, target - Date.now())); update(); const id = window.setInterval(update, 1000); return () => window.clearInterval(id); }, [target]);
  if (!remaining) return <section className="countdown-section"><Reveal><p className="script-kicker">Happily ever after</p><h2>Ngày hạnh phúc đã đến!</h2></Reveal></section>;
  const total = Math.floor(remaining / 1000); const values = [{label:'Ngày',value:Math.floor(total/86400)},{label:'Giờ',value:Math.floor(total/3600)%24},{label:'Phút',value:Math.floor(total/60)%60},{label:'Giây',value:total%60}];
  return <section className="countdown-section"><Reveal><p className="eyebrow">Chỉ còn</p><div className="countdown-grid">{values.map(x => <div key={x.label}><strong>{String(x.value).padStart(2,'0')}</strong><span>{x.label}</span></div>)}</div></Reveal></section>;
}

function AlbumGallery() {
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => { const handle = (event: KeyboardEvent) => { if (active === null) return; if (event.key === 'Escape') setActive(null); if (event.key === 'ArrowRight') setActive((active + 1) % wedding.images.album.length); if (event.key === 'ArrowLeft') setActive((active - 1 + wedding.images.album.length) % wedding.images.album.length); }; window.addEventListener('keydown', handle); return () => window.removeEventListener('keydown', handle); }, [active]);
  return <section className="section album-section"><Reveal><p className="eyebrow dark">The moments</p><h2>Album ảnh cưới</h2></Reveal><div className="album-grid">{wedding.images.album.map((src, i) => <button key={src} className={`album-item item-${i+1}`} onClick={() => setActive(i)} aria-label={`Mở ảnh album ${i+1}`}><Photo src={src} alt={`Ảnh cưới ${i+1}`} /></button>)}</div>{active !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh cưới" onClick={() => setActive(null)}><button className="lightbox-close" onClick={() => setActive(null)} aria-label="Đóng ảnh">×</button><button className="lightbox-prev" onClick={e => {e.stopPropagation();setActive((active-1+wedding.images.album.length)%wedding.images.album.length)}} aria-label="Ảnh trước">‹</button><div onClick={e=>e.stopPropagation()}><Photo src={wedding.images.album[active]} alt={`Ảnh cưới ${active+1}`} /></div><button className="lightbox-next" onClick={e => {e.stopPropagation();setActive((active+1)%wedding.images.album.length)}} aria-label="Ảnh tiếp theo">›</button></div>}</section>;
}

function ClosingSection() { return <section className="closing-section"><Photo src={wedding.images.closing} alt="Ảnh cưới kết thúc" /><div className="closing-shade"/><Reveal className="closing-copy"><h2>Trân trọng</h2><i>&amp;</i><h2>Biết ơn</h2></Reveal></section>; }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const before = document.activeElement as HTMLElement | null; const el = ref.current; el?.querySelector<HTMLElement>('button,input,textarea,select')?.focus(); const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key !== 'Tab' || !el) return; const list = [...el.querySelectorAll<HTMLElement>('button,input,textarea,select,a[href]')].filter(x => !x.hasAttribute('disabled')); if (!list.length) return; const first=list[0], last=list[list.length-1]; if (e.shiftKey && document.activeElement===first) {e.preventDefault();last.focus();} else if (!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();} }; document.addEventListener('keydown', handle); document.body.classList.add('modal-open'); return () => {document.removeEventListener('keydown', handle);document.body.classList.remove('modal-open');before?.focus();}; }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={e => e.target===e.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref}><button className="modal-close" onClick={onClose} aria-label="Đóng cửa sổ">×</button><p className="eyebrow dark">Wedding day</p><h2>{title}</h2>{children}</div></div>;
}

function GiftModal({ onClose }: { onClose: () => void }) { const [tab,setTab]=useState<'bride'|'groom'>('bride'); const [copied,setCopied]=useState(false); const account=wedding.gifts[tab]; const copy=async()=>{try{await navigator.clipboard.writeText(account.number);setCopied(true);window.setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}}; return <Modal title="Gửi quà mừng" onClose={onClose}><div className="gift-tabs"><button className={tab==='bride'?'active':''} onClick={()=>setTab('bride')}>Cô Tâm Chú Thắng</button><button className={tab==='groom'?'active':''} onClick={()=>setTab('groom')}>Cô Dâu Chú Rể</button></div><Photo src={account.qr} alt={`Mã QR placeholder ${tab==='bride'?'cô Tâm':'chú rể'}`} className="qr-image"/><dl><div><dt>Ngân hàng</dt><dd>{account.bank}</dd></div><div><dt>Chủ tài khoản</dt><dd>{account.owner}</dd></div><div><dt>Số tài khoản</dt><dd>{account.number}</dd></div></dl><button className="primary-button" onClick={copy}>{copied?'Đã sao chép':'Sao chép số tài khoản'}</button></Modal>; }

function BottomToolbar({ onOpen }: { onOpen: (name: Exclude<ModalName,null>) => void }) { const [open,setOpen]=useState(true); return <nav className={`bottom-toolbar ${open?'expanded':'collapsed'}`} aria-label="Công cụ thiệp cưới"><button className="toolbar-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Thu gọn thanh công cụ':'Mở thanh công cụ'}>{open?'×':'♡'}</button><div className="toolbar-actions"><button onClick={()=>onOpen('gift')}><span>♧</span>Quà mừng</button></div></nav>; }


export default function Home() {
  const invitation = wedding.invitation;
  const [modal,setModal]=useState<ModalName>(null);
  return <main className="page-shell" style={{'--accent':wedding.colors.accent,'--cream':wedding.colors.cream} as React.CSSProperties}><div className="invitation-frame"><HeroSection/><CoupleSection/><FamilySection/><InvitationSection invitation={invitation} /><EventDetails/><LocationSection/><WeddingCalendar/><Countdown/><AlbumGallery/><ClosingSection/><footer>Made with love · {wedding.displayDate}</footer></div><BottomToolbar onOpen={setModal}/>{modal==='gift'&&<GiftModal onClose={()=>setModal(null)}/>}</main>;
}
