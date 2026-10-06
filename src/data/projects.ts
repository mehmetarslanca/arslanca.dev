export interface Project {
  slug: string;
  name: string;
  ownership: string;
  status: 'In production' | 'In development' | 'Archived' | 'Learning-era' | 'Experiment';
  description: string;
  attribution: string;
  tags: string[];
  href?: string;
  external?: boolean;
  featured: boolean;
  visual?: { src: string; alt: string; width: number; height: number };
}

export const selectedProjects: Project[] = [
  {
    slug: 'edip', name: 'EDIP', ownership: 'Personal', status: 'In production',
    description: 'A local-first, AI-oriented video editor for creators. Bring raw footage, describe the result you want, inspect the edit, and revise it conversationally.',
    attribution: 'Designed and built by Mehmet Arslanca.',
    tags: ['Local-first', 'Chat-driven', 'Non-destructive', 'AI-oriented end-to-end editing'],
    href: '/products/edip/', featured: true,
    visual: { src: '/images/projects/edip/edip.png', alt: 'Concept visual for EDIP, a local-first conversational video editor.', width: 1672, height: 941 },
  },
  {
    slug: 'its-so-over', name: "IT’S SO OVER", ownership: 'Devonair', status: 'In development',
    description: 'A local-only Android product built around behavioral reality checks. Permissioned device signals become on-device behavioral context that helps decide whether a timely nudge is worth making and which curated message fits the moment.',
    attribution: 'Built with Murat Bahadır Kayıhan at Devonair.',
    tags: ['Android', 'Local-only', 'Behavior-aware', 'Curated reality checks'],
    href: 'https://devonair.dev/', external: true, featured: true,
    visual: { src: '/images/projects/iso/iso.png', alt: 'Concept visual for IT’S SO OVER, a local-only Android behavior and reality-check product.', width: 1672, height: 941 },
  },
];

export const archiveProjects: Project[] = [
  {
    slug: 'orchestrai', name: 'OrchestrAI', ownership: 'Personal', status: 'Archived',
    description: 'This one didn’t make it. OrchestrAI explored serious LLM and provider orchestration through a production-minded backend. The original question was real: how could a product coordinate providers and models without coupling its behavior to any one of them? Authentication, persistence, streaming, and orchestration were treated as parts of one coherent system rather than a disposable demo. The ecosystem then moved quickly enough that parts of the original value were implemented or commoditized elsewhere. Continuing would have meant spending more time defending an old premise than solving a useful problem, so I archived it. Stopping was the better product decision.',
    attribution: 'Mehmet Arslanca',
    tags: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Redis', 'Flyway', 'JWT/auth', 'SSE', 'Docker'], featured: false,
  },
  {
    slug: 'mangamuse', name: 'MangaMuse', ownership: 'Personal', status: 'Learning-era',
    description: 'An earlier Android learning project kept here because it belongs to the path, not because it represents my current product work.',
    attribution: 'Mehmet Arslanca', tags: ['Android', 'Kotlin'], featured: false,
  },
  {
    slug: 'geocall', name: 'GeoCall', ownership: 'Personal', status: 'Experiment',
    description: 'A small local automation experiment for monitoring a remote backup device’s location and sending Telegram notifications from configurable geographic zones, replacing a manual check with a private local tool.',
    attribution: 'Mehmet Arslanca', tags: ['Python', 'SQLite', 'Telegram bot', 'systemd', 'Local scheduling', 'Geographic zone logic'], featured: false,
  },
];
