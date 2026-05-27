export type IcoName =
  | 'pumps' | 'cash' | 'store' | 'tank' | 'receive' | 'report' | 'settings'
  | 'bell' | 'moon' | 'sun' | 'search' | 'close' | 'play' | 'pause' | 'stop'
  | 'check' | 'keyboard' | 'nozzle' | 'barcode' | 'plus' | 'minus' | 'drop'
  | 'chev' | 'back' | 'info' | 'user' | 'lock' | 'card' | 'cash2' | 'fuel'
  | 'shield' | 'print' | 'report2';

interface IcoProps {
  name: IcoName | string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Ico({ name, className = 'i', style }: IcoProps) {
  const paths: Record<string, React.ReactNode> = {
    pumps:    <><path d="M3 3h7v18H3z"/><path d="M3 8h7"/><path d="M10 9l4-2v12l-4 2"/><path d="M14 11h3a3 3 0 013 3v3"/><path d="M17 7l-1-1h-2"/></>,
    cash:     <><rect x="2" y="6" width="20" height="13" rx="2"/><circle cx="12" cy="12.5" r="2.5"/><path d="M5 9h.01M19 16h.01"/></>,
    store:    <><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9v11h18V9"/><path d="M3 9h18"/><path d="M9 14h6"/></>,
    tank:     <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 14h16"/><path d="M8 17h.01M16 17h.01"/></>,
    receive:  <><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/></>,
    report:   <><path d="M5 3h11l3 3v15H5z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.13-1.3l2-1.5-2-3.4-2.3.9a7 7 0 00-2.2-1.3L14 3h-4l-.4 2.4a7 7 0 00-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 005 12a7 7 0 00.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 002.2 1.3L10 21h4l.4-2.4a7 7 0 002.2-1.3l2.3.9 2-3.4-2-1.5c.06-.42.1-.86.1-1.3z"/></>,
    bell:     <><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></>,
    moon:     <><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></>,
    sun:      <><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/></>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    close:    <><path d="M6 6l12 12M18 6L6 18"/></>,
    play:     <><path d="M7 5l13 7-13 7z"/></>,
    pause:    <><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></>,
    stop:     <><rect x="6" y="6" width="12" height="12" rx="1"/></>,
    check:    <><path d="M5 12l5 5L20 7"/></>,
    keyboard: <><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></>,
    nozzle:   <><path d="M5 21V8l5-3 5 3"/><path d="M5 14h10"/><path d="M15 11h3v6a3 3 0 01-3 3"/><path d="M18 8v3"/></>,
    barcode:  <><path d="M3 5v14M6 5v14M9 5v14M13 5v14M16 5v14M20 5v14"/></>,
    plus:     <><path d="M12 5v14M5 12h14"/></>,
    minus:    <><path d="M5 12h14"/></>,
    drop:     <><path d="M12 3s7 7 7 12a7 7 0 11-14 0c0-5 7-12 7-12z"/></>,
    chev:     <><path d="M9 6l6 6-6 6"/></>,
    back:     <><path d="M15 6l-6 6 6 6"/></>,
    info:     <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></>,
    user:     <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>,
    lock:     <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></>,
    card:     <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></>,
    cash2:    <><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></>,
    fuel:     <><path d="M5 21V5a2 2 0 012-2h7a2 2 0 012 2v16"/><path d="M5 14h11"/><path d="M16 9h2a2 2 0 012 2v6a2 2 0 002 2"/><path d="M19 5l-1-1"/></>,
    shield:   <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></>,
    print:    <><rect x="6" y="3" width="12" height="6"/><rect x="6" y="14" width="12" height="7"/><path d="M6 9H4a2 2 0 00-2 2v5a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v5a2 2 0 01-2 2h-2"/></>,
    report2:  <><path d="M5 3h11l3 3v15H5z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  };
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}
