const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

/** Scroll-linked reasoning board. Measurements happen only during shared controller measurement passes. */
export function createReasoningStage() {
  const section = document.querySelector<HTMLElement>('[data-reasoning]');
  if (!section) return null;
  const sticky = section.querySelector<HTMLElement>('.reasoning-sticky')!;
  const steps = [...section.querySelectorAll<HTMLElement>('.reasoning-step')];
  const paths = [...section.querySelectorAll<SVGPathElement>('.reasoning-connections path')];
  const counter = section.querySelector<HTMLElement>('[data-reasoning-counter]');
  let start = 0;
  let release = 0;
  let distance = 1;
  let staged = false;
  let previous = -1;
  let activeStep = 0;

  function measure(scrollY: number, reduced: boolean) {
    section!.removeAttribute('data-reasoning-motion');
    section!.removeAttribute('data-reasoning-enhanced');
    if (!reduced) section!.dataset.reasoningEnhanced = '';
    staged = !reduced && innerWidth > 900 && innerHeight >= 700;
    if (staged) section!.dataset.reasoningMotion = '';
    start = section!.getBoundingClientRect().top + scrollY;
    distance = Math.max(1, section!.offsetHeight - (staged ? sticky.offsetHeight : innerHeight));
    release = start + distance;
    previous = -1;
    update(scrollY, innerHeight, reduced);
  }

  function update(scrollY: number, viewport: number, reduced = false) {
    const progress = staged ? clamp((scrollY - start) / distance) : 1;
    const entry = reduced ? 1 : clamp((scrollY - (start - viewport * .35)) / (viewport * .45));
    const exit = reduced ? 0 : clamp((scrollY - release) / (viewport * .65));
    const sceneOpacity = Math.min(clamp(entry * 1.15), 1 - exit);
    const sceneY = (1 - entry) * 24 - exit * 26;
    section!.style.setProperty('--how-scene-opacity', sceneOpacity.toFixed(4));
    section!.style.setProperty('--how-scene-y', `${sceneY.toFixed(2)}px`);
    if (progress !== previous) {
      previous = progress;
      section!.style.setProperty('--how-progress', progress.toFixed(4));
      let nextActive = 0;
      for (let index = 0; index < steps.length; index++) {
        const begin = .035 + index * .105;
        const node = staged ? smoothstep(clamp((progress - begin) / .04)) : 1;
        const copy = staged ? smoothstep(clamp((progress - begin - .025) / .045)) : 1;
        const age = staged ? smoothstep(clamp((progress - begin - .105) / .48)) : 0;
        const presence = 1 - age * .16;
        const isActive = staged && progress >= begin && progress < begin + .105 ? 1 : 0;
        if (copy > .5) nextActive = index + 1;
        steps[index].style.setProperty('--reasoning-node', node.toFixed(4));
        steps[index].style.setProperty('--reasoning-copy', copy.toFixed(4));
        steps[index].style.setProperty('--reasoning-node-opacity', (node * presence).toFixed(4));
        steps[index].style.setProperty('--reasoning-copy-opacity', (copy * presence).toFixed(4));
        steps[index].style.setProperty('--reasoning-drift', `${(-age * 6).toFixed(2)}px`);
        steps[index].style.setProperty('--reasoning-active', isActive.toFixed(0));
        if (paths[index]) {
          const line = staged ? smoothstep(clamp((progress - begin - .065) / .04)) : 1;
          paths[index].style.setProperty('--reasoning-connection', line.toFixed(4));
          paths[index].style.setProperty('--reasoning-connection-active', isActive.toFixed(0));
        }
      }
      if (nextActive !== activeStep) {
        activeStep = nextActive;
        if (counter) counter.textContent = `${String(Math.max(1, activeStep)).padStart(2, '0')} / 08`;
      }
    }

    if (reduced) return 0;
    return Math.min(entry, 1 - exit);
  }

  return { measure, update, element: section };
}
