export function Icon({ name, size = 18 }: { name: "search"|"user"|"heart"|"arrow"|"truck"|"shield"|"check"|"finance"|"edit"|"trash"|"logout"|"calendar"|"gauge"|"fuel"|"tag"; size?: number }) {
  const p = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:2, strokeLinecap:"round" as const, strokeLinejoin:"round" as const, "aria-hidden":true };
  const map = {
    search:<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    user:<><path d="M19 21a7 7 0 0 0-14 0"/><circle cx="12" cy="7" r="4"/></>,
    heart:<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/>,
    arrow:<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    truck:<><path d="M10 17h4V5H2v12h3"/><path d="M14 9h4l4 4v4h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></>,
    shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    check:<path d="m20 6-11 11-5-5"/>,
    finance:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h2"/></>,
    edit:<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
    trash:<><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></>,
    logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
    gauge:<><path d="M4.93 19a10 10 0 1 1 14.14 0"/><path d="M12 12l4-4"/><path d="M12 12a2 2 0 1 0 0 .01"/></>,
    fuel:<><path d="M4 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18"/><path d="M3 22h12M4 9h10"/><path d="M14 6h2l3 3v8a2 2 0 0 0 4 0v-5l-3-3"/></>,
    tag:<><path d="M20.59 13.41 11 3.83V3H4v7h.83l9.58 9.59a2 2 0 0 0 2.82 0l3.36-3.36a2 2 0 0 0 0-2.82Z"/><circle cx="7.5" cy="6.5" r="1"/></>
  };
  return <svg {...p}>{map[name]}</svg>;
}
