export const site = {
  name: 'Mehmet Arslanca',
  role: 'Software Engineer',
  url: 'https://arslanca.dev',
  description: 'Mehmet Arslanca is a software engineer building thoughtful products across product architecture, backend, mobile, and systems.',
  socials: [
    { name: 'GitHub', href: 'https://github.com/mehmetarslanca' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/mehmet-arslanca-5618b32a6' },
    { name: 'Email', href: 'mailto:mehmetarslancamehmet@gmail.com' },
  ],
};

export const buildSequence = [
  { title: 'Problem', copy: 'Technology is not the starting point. The first question is what real problem is being solved, without asking a stack, framework, or architecture to find its own reason to exist. The system begins with that answer.' },
  { title: 'Product intent', copy: 'Before deciding how a system works, I want to know what it should accomplish for the person using it. Intent turns a vague idea into a product with a reason to exist and gives later tradeoffs a stable direction.' },
  { title: 'Scope', copy: 'A focused product needs a clear account of what it will solve and what it intentionally will not. Scope keeps adjacent problems from quietly becoming the product. What stays outside matters as much as what enters.' },
  { title: 'Behavior', copy: 'Expected behavior comes before technical mechanisms: what the user experiences, what state exists, what success looks like, how failure is communicated, and which expectations the product creates. Those answers become the contract implementation must uphold.' },
  { title: 'Boundaries', copy: 'Responsibilities, ownership, state, capabilities, and failure need clear boundaries. When those lines stay vague, complexity leaks through the entire system. Clear lines make later changes easier to reason about and contain failure.' },
  { title: 'Architecture', copy: 'Architecture follows the boundaries. Its job is to establish contracts, data flow, lifecycle, and subsystem responsibilities that preserve the product’s intended behavior. A diagram is useful only when it makes those decisions clearer.' },
  { title: 'Implementation', copy: 'Only then should mechanisms dominate the conversation. Languages, frameworks, and libraries remain subordinate to the system’s needs; experiments stay isolated when possible. Stable production technology is usually the default.' },
  { title: 'Evidence', copy: 'Prototypes, tests, observation, live acceptance, and benchmarks resolve unknowns. Working software is evidence, not proof that every earlier decision was correct. Reality gets the final vote. When reality disagrees, the design changes.' },
];

export const currently = [
  { label: 'Building', value: 'EDIP', href: '/products/edip/' },
  { label: 'Building with', value: 'Devonair', href: 'https://devonair.dev/' },
  { label: 'Studying', value: 'Web Programming at Istanbul University' },
  { label: 'Running', value: 'CachyOS / KDE Plasma / Wayland' },
];

export const tools = [
  { title: 'System', items: ['CachyOS', 'KDE Plasma', 'Wayland', 'zsh', 'kitty'] },
  { title: 'Machine', items: ['AMD Ryzen 5 5500', 'NVIDIA RTX 3060 · 12 GB', '16 GB RAM'] },
  { title: 'Languages', items: ['Java', 'Kotlin', 'Rust', 'Python', 'TypeScript / JavaScript'] },
  { title: 'Backend', items: ['Spring Boot', 'REST APIs', 'SSE', 'PostgreSQL', 'Redis', 'Flyway'] },
  { title: 'Android', items: ['Kotlin', 'Jetpack Compose', 'Room', 'WorkManager'] },
  { title: 'Systems / Media', items: ['Linux', 'FFmpeg', 'Process orchestration', 'Local-first systems', 'systemd'] },
  { title: 'Infrastructure', items: ['Docker', 'GitHub Actions', 'Cloudflare', 'Google Cloud', 'GitHub Pages'] },
  { title: 'AI-assisted engineering', items: ['LLM APIs', 'Provider / model orchestration', 'Codex', 'Claude', 'Gemini'] },
];
