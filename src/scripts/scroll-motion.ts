import { createNetworkStage } from './network-scroll';
import { createReasoningStage } from './how-build-scroll';

const preference = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value: number, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smoothstep = (value: number) => value * value * (3 - 2 * value);

type MotionGroup = {
  element: HTMLElement;
  offset: number;
  opacity: number;
  scale: number;
  x: number;
  scalesOnEntry: boolean;
  xDistance: number;
  lag: number;
};

type RailMarker = {
  link: HTMLAnchorElement;
  element: HTMLElement;
  top: number;
};

const groups: MotionGroup[] = [...document.querySelectorAll<HTMLElement>('[data-scroll-reveal]')].map((element) => ({
  element,
  offset: 0,
  opacity: 1,
  scale: 1,
  x: 0,
  scalesOnEntry: element.hasAttribute('data-motion-scale'),
  xDistance: Number(element.dataset.motionX ?? 0),
  lag: Number(element.dataset.motionLag ?? 0),
}));
const network = createNetworkStage();
const reasoning = createReasoningStage();
const hero = document.querySelector<HTMLElement>('[data-hero]');
const railMarkers: RailMarker[] = [...document.querySelectorAll<HTMLAnchorElement>('[data-section-rail-link]')].flatMap((link) => {
  const id = link.dataset.sectionRailTarget;
  const element = id ? document.getElementById(id) : null;
  return element ? [{ link, element, top: 0 }] : [];
});
let lightRanges: Array<{ top: number; bottom: number }> = [];
let heroHeight = 1;
let viewport = innerHeight;
let lastScroll = scrollY;
let frame = 0;
let needsMeasurement = true;
let introTimer = 0;
let activeRailMarker = 0;

function schedule(measure = false) {
  needsMeasurement ||= measure;
  if (!frame) frame = requestAnimationFrame(render);
}

function revealTarget(group: MotionGroup, bounds: DOMRect) {
  const mobile = innerWidth <= 760;
  const entryDistance = mobile ? 28 : 44;
  const exitDistance = mobile ? 21 : 30;
  const untransformedTop = bounds.top - group.offset;
  const untransformedBottom = bounds.bottom - group.offset;
  const lag = group.lag * viewport;

  // The movement spans the lower 36% and upper 33% of the viewport so it
  // remains clearly visible during an ordinary, slow scroll.
  const entry = clamp((viewport * .98 - (untransformedTop + lag)) / (viewport * .36));
  const exit = clamp((viewport * .28 - untransformedBottom) / (viewport * .33));
  const easedEntry = smoothstep(entry);
  const easedExit = smoothstep(exit);
  const offset = lerp(entryDistance, 0, easedEntry) + lerp(0, -exitDistance, easedExit);
  const opacity = Math.min(lerp(.08, 1, easedEntry), lerp(1, .28, easedExit));
  const scale = group.scalesOnEntry ? lerp(.987, 1, easedEntry) : 1;
  const xDistance = mobile ? group.xDistance * .6 : group.xDistance;
  const x = lerp(xDistance, 0, easedEntry);
  const position = entry < 1 ? 'below' : exit > 0 ? 'above' : 'active';
  return { offset, opacity, scale, x, position };
}

function measureRail(scrollY: number) {
  for (const marker of railMarkers) marker.top = marker.element.getBoundingClientRect().top + scrollY;
  lightRanges = [network?.element, reasoning?.element].flatMap((element) => {
    if (!element) return [];
    const bounds = element.getBoundingClientRect();
    return [{ top: bounds.top + scrollY, bottom: bounds.bottom + scrollY }];
  });
}

function updateRail(scrollY: number, lightSurface: number) {
  if (railMarkers.length) {
    const cursor = scrollY + viewport * .38;
    let next = 0;
    for (let index = 0; index < railMarkers.length; index++) {
      if (railMarkers[index].top <= cursor) next = index;
      else break;
    }
    if (next !== activeRailMarker || !railMarkers[next].link.hasAttribute('aria-current')) {
      activeRailMarker = next;
      for (let index = 0; index < railMarkers.length; index++) {
        if (index === next) railMarkers[index].link.setAttribute('aria-current', 'location');
        else railMarkers[index].link.removeAttribute('aria-current');
      }
    }
  }

  const lightCursor = scrollY + viewport * .5;
  const onStaticLightSurface = lightRanges.some((range) => lightCursor >= range.top && lightCursor < range.bottom);
  document.documentElement.toggleAttribute('data-light-surface', lightSurface > .5 || (preference.matches && onStaticLightSurface));
}

function render() {
  frame = 0;
  const y = scrollY;
  if (needsMeasurement) {
    needsMeasurement = false;
    viewport = innerHeight;
    heroHeight = hero?.offsetHeight ?? 1;
    network?.measure(y, preference.matches);
    reasoning?.measure(y, preference.matches);
    measureRail(y);
  }

  const targets = preference.matches ? [] : groups.map((group) => ({ group, target: revealTarget(group, group.element.getBoundingClientRect()) }));
  const networkSurface = network?.update(y, viewport, preference.matches) ?? 0;
  const reasoningSurface = reasoning?.update(y, viewport, preference.matches) ?? 0;
  const lightSurface = Math.max(networkSurface, reasoningSurface);
  document.documentElement.style.setProperty('--surface-light-progress', lightSurface.toFixed(4));
  updateRail(y, lightSurface);
  if (!preference.matches) {
    // Read all geometry before writing any visual state. One passive scroll
    // listener and one scheduled frame drive every composition on the page.
    for (const { group, target } of targets) {
      if (group.element.dataset.position !== target.position) group.element.dataset.position = target.position;
      if (Math.abs(target.offset - group.offset) > .04 || Math.abs(target.opacity - group.opacity) > .002 || Math.abs(target.scale - group.scale) > .0002 || Math.abs(target.x - group.x) > .04) {
        group.element.style.setProperty('--reveal-y', `${target.offset.toFixed(2)}px`);
        group.element.style.setProperty('--reveal-x', `${target.x.toFixed(2)}px`);
        group.element.style.setProperty('--reveal-opacity', target.opacity.toFixed(3));
        group.element.style.setProperty('--reveal-scale', target.scale.toFixed(4));
        group.offset = target.offset;
        group.opacity = target.opacity;
        group.scale = target.scale;
        group.x = target.x;
      }
    }

    if (hero && y <= heroHeight + viewport) {
      const progress = smoothstep(clamp(y / (heroHeight * .82)));
      hero.style.setProperty('--hero-y', `${lerp(0, -40, progress).toFixed(2)}px`);
      hero.style.setProperty('--hero-background-y', `${lerp(0, 18, progress).toFixed(2)}px`);
      hero.style.setProperty('--hero-opacity', lerp(1, .3, progress).toFixed(3));
    }
    if (Math.abs(y - lastScroll) > 1) document.documentElement.dataset.scrollDirection = y > lastScroll ? 'down' : 'up';
  }
  lastScroll = y;
}

function startHeroEntrance() {
  const root = document.documentElement;
  clearTimeout(introTimer);
  if (!hero || preference.matches || scrollY > 8) {
    root.classList.add('skip-intro', 'intro-ready', 'intro-complete');
    return;
  }
  root.classList.remove('skip-intro', 'intro-ready', 'intro-complete');
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('intro-ready')));
  introTimer = window.setTimeout(() => root.classList.add('intro-complete'), 1450);
}

function configure() {
  for (const group of groups) {
    group.element.removeAttribute('data-motion-ready');
    group.element.style.removeProperty('--reveal-y');
    group.element.style.removeProperty('--reveal-opacity');
    group.element.style.removeProperty('--reveal-scale');
    group.element.style.removeProperty('--reveal-x');
    group.offset = 0;
    group.opacity = 1;
    group.scale = 1;
    group.x = 0;
    if (!preference.matches) group.element.dataset.motionReady = '';
  }
  if (preference.matches) {
    hero?.style.removeProperty('--hero-y');
    hero?.style.removeProperty('--hero-background-y');
    hero?.style.removeProperty('--hero-opacity');
  }
  schedule(true);
}

addEventListener('scroll', () => schedule(), { passive: true });
addEventListener('resize', () => schedule(true), { passive: true });
addEventListener('pageshow', () => schedule(true));
preference.addEventListener('change', () => {
  configure();
  if (preference.matches) {
    clearTimeout(introTimer);
    document.documentElement.classList.add('skip-intro', 'intro-ready', 'intro-complete');
  }
});
const resize = new ResizeObserver(() => schedule(true));
for (const group of groups) resize.observe(group.element);
const composition = document.querySelector('.network-composition');
if (composition) resize.observe(composition);
document.fonts.ready.then(() => schedule(true));
configure();
startHeroEntrance();
