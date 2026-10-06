const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** One measured diagram, one scroll position. No timers or independent scroll listener. */
export function createNetworkStage() {
  const section = document.querySelector<HTMLElement>('[data-network]');
  if (!section) return null;
  const sticky = section.querySelector<HTMLElement>('.network-sticky')!;
  const composition = section.querySelector<HTMLElement>('.network-composition')!;
  const graph = section.querySelector<HTMLElement>('.network-graph')!;
  const svg = graph.querySelector<SVGSVGElement>('svg')!;
  const nodes = [...graph.querySelectorAll<HTMLElement>('[data-node]')];
  const paths = [...svg.querySelectorAll<SVGPathElement>('path')];
  let start = 0;
  let distance = 1;
  let enabled = false;
  let previous = -1;
  let release = 0;

  function measure(scrollY: number, reduced: boolean) {
    section!.removeAttribute('data-network-motion');
    const mobile = matchMedia('(max-width: 900px)').matches;
    section!.dataset.networkLayout = mobile ? 'mobile' : 'desktop';
    // All reads precede SVG writes; nodes are untransformed during measurement.
    const bounds = graph.getBoundingClientRect();
    const boxes = new Map(nodes.map((node) => [node.dataset.node!, node.getBoundingClientRect()]));
    const labels = new Map(nodes.map((node) => [node.dataset.node!, node.querySelector('a, .node-name')!.getBoundingClientRect()]));
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    for (const path of paths) {
      const from = boxes.get(path.dataset.from!)!;
      const to = boxes.get(path.dataset.to!)!;
      if (mobile) {
        const x1 = from.left - bounds.left + 5;
        const y1 = from.bottom - bounds.top;
        const x2 = to.left - bounds.left - 4;
        const y2 = to.top - bounds.top + 25;
        path.setAttribute('d', `M${x1} ${y1} V${y2} H${x2}`);
      } else if (path.dataset.to === 'over') {
        // Shared work connects through the gap between its two builders.
        // Personal and Murat-led branches descend separately on either side.
        const label = labels.get(path.dataset.from!)!;
        const x1 = (path.dataset.from === 'mehmet' ? label.right + 12 : label.left - 12) - bounds.left;
        const y1 = label.top - bounds.top + label.height / 2;
        const x2 = to.left - bounds.left + to.width / 2;
        const y2 = to.top - bounds.top - 7;
        path.setAttribute('d', `M${x1} ${y1} H${x2} V${y2}`);
      } else {
        const x1 = from.left - bounds.left + from.width / 2;
        const x2 = to.left - bounds.left + to.width / 2;
        const y1 = from.bottom - bounds.top + 5;
        const y2 = to.top - bounds.top - 7;
        const middle = y1 + (y2 - y1) / 2;
        path.setAttribute('d', `M${x1} ${y1} V${middle} H${x2} V${y2}`);
      }
    }
    // Short landscape screens/large text get a complete, normally scrolling tree.
    const padding = parseFloat(getComputedStyle(sticky).paddingTop) + parseFloat(getComputedStyle(sticky).paddingBottom);
    // Measure the actual 100svh stage, which can differ from innerHeight on mobile.
    if (!reduced) section!.dataset.networkMotion = '';
    enabled = !reduced && composition.offsetHeight + padding <= sticky.clientHeight;
    if (!enabled) section!.removeAttribute('data-network-motion');
    start = section!.getBoundingClientRect().top + scrollY;
    distance = Math.max(1, section!.offsetHeight - sticky.offsetHeight);
    release = start + distance;
    previous = -1;
    update(scrollY, innerHeight, reduced);
  }

  function update(scrollY: number, viewport: number, reduced = false) {
    const progress = enabled ? clamp((scrollY - start) / distance) : 1;
    if (progress !== previous) {
      previous = progress;
      section!.style.setProperty('--network-progress', progress.toFixed(4));
      const revealed: number[] = [];
      for (let stage = 1; stage <= 4; stage++) {
        const begin = .12 + (stage - 1) * .2;
        const line = clamp((progress - begin) / .16);
        const node = clamp((progress - begin - .085) / .075);
        if (node > .5) revealed.push(stage);
        section!.style.setProperty(`--line-${stage}`, line.toFixed(4));
        section!.style.setProperty(`--node-${stage}`, node.toFixed(4));
      }
      const interactive = revealed.join(' ');
      if (section!.dataset.revealed !== interactive) section!.dataset.revealed = interactive;
    }

    // The wash starts before the light stage arrives and remains after it
    // releases, avoiding a section-edge wipe in either scroll direction.
    const entry = reduced ? 0 : clamp((scrollY - (start - viewport * .8)) / (viewport * .7));
    const exit = reduced ? 1 : clamp((scrollY - release) / (viewport * .65));
    const surface = reduced ? 0 : Math.min(entry, 1 - exit);
    const sceneY = (1 - entry) * 34 - exit * 28;
    section!.style.setProperty('--network-scene-opacity', surface.toFixed(4));
    section!.style.setProperty('--network-scene-y', `${sceneY.toFixed(2)}px`);
    return surface;
  }
  return { measure, update, element: section };
}
