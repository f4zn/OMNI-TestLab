const paths = {
  arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
  bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V5a3 3 0 0 1 6 0v3" /></>,
  heart: <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-9.4a5.5 5.5 0 0 0 0-7.8Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  check: <path d="m4 12 5 5L20 6" />,
  filter: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2" /><circle cx="15" cy="17" r="2" /></>,
  truck: <><path d="M2 5h12v13H2zM14 10h4l4 5v3h-8" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  box: <><path d="m12 2 10 5v10l-10 5-10-5V7l10-5ZM2 7l10 5 10-5M12 12v10M7 4.5l10 5" /></>,
  return: <><path d="M4 11a8 8 0 1 1 1 7M4 4v7h7" /></>,
  shield: <><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z" /><path d="m8 12 3 3 5-6" /></>,
  lamp: <><path d="M7 3h10l4 11H3L7 3ZM12 14v7M7 21h10" /></>,
  chair: <><path d="M6 12V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v7M4 10v7h16v-7M6 17v5M18 17v5M4 13h16" /></>,
  headphones: <><path d="M4 15v-4a8 8 0 0 1 16 0v4" /><rect x="2" y="12" width="5" height="9" rx="2" /><rect x="17" y="12" width="5" height="9" rx="2" /></>,
  cup: <><path d="M4 4h12v10a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V4ZM16 6h2a3 3 0 0 1 0 6h-2M3 22h16" /></>,
  star: <path d="m12 2 3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5 1.2-7-5-5 7-1L12 2Z" />,
  lock: <><rect x="5" y="10" width="14" height="12" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3" /></>,
};
export default function Icon({ name, size = 20, className = '', ...props }) {
  const aliases = { 'arrow-right': 'arrow', 'arrow-left': 'arrow', package: 'box', 'check-circle': 'check' };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={name === 'arrow-left' ? { transform: 'rotate(180deg)' } : undefined} {...props}>{paths[aliases[name] || name] || paths.box}</svg>;
}
