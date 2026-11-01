import Lenis from 'lenis';

// Plynulý scroll (Lenis) a posun na kotvy s ohledem na pevnou hlavičku
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const headerOffset = () => -(document.querySelector<HTMLElement>('[data-header]')?.offsetHeight ?? 72) - 12;

const lenis = reduced ? null : new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });

if (lenis) {
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

const scrollToHash = (hash: string) => {
  // „#top“ vede vždy úplně nahoru – hero je přišpendlený, takže skok na jeho pozici by nefungoval
  if (hash === '#top') {
    lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    return true;
  }
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return false;
  if (lenis) {
    lenis.scrollTo(target, { offset: headerOffset() });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + headerOffset() });
  }
  return true;
};

document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || link.hash.length < 2 || e.defaultPrevented) return;
  if (scrollToHash(link.hash)) {
    e.preventDefault();
    history.pushState(null, '', link.hash === '#top' ? location.pathname : link.hash);
  }
});
