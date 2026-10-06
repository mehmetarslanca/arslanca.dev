interface Entity {
  id: string;
  name: string;
  type: 'Organization' | 'Person' | 'Product';
  parent?: string;
  href?: string;
  description: string;
  caption: string;
  stage: number;
}
export const network: Entity[] = [
  { id: 'ebiren', name: 'Ebiren', type: 'Organization', description: 'The umbrella organization.', caption: 'The umbrella organization.', stage: 0 },
  { id: 'devonair', name: 'Devonair', type: 'Organization', parent: 'ebiren', href: 'https://devonair.dev/', description: 'The software, products & systems side of Ebiren.', caption: 'Software, products & systems', stage: 1 },
  { id: 'brightspire', name: 'Brightspire', type: 'Organization', parent: 'ebiren', href: 'https://brightspirestudio.com/', description: 'The game development side of Ebiren.', caption: 'Game development', stage: 1 },
  { id: 'mehmet', name: 'Mehmet Arslanca', type: 'Person', parent: 'devonair', href: '/about/', description: 'Part of Devonair. Also builds independently.', caption: 'Devonair / independent builder', stage: 2 },
  { id: 'murat', name: 'Murat Bahadır Kayıhan', type: 'Person', parent: 'devonair', href: 'https://kayihan.dev/', description: 'Part of Devonair. Collaborator & independent builder.', caption: 'Devonair / collaborator', stage: 2 },
  { id: 'edip', name: 'EDIP', type: 'Product', parent: 'mehmet', href: '/products/edip/', description: 'Mehmet’s personal product.', caption: 'Mehmet personal · outside Devonair', stage: 3 },
  { id: 'over', name: 'IT’S SO OVER', type: 'Product', parent: 'devonair', href: 'https://devonair.dev/', description: 'Local-only behavioral reality checks for Android.', caption: 'Devonair · Local-only Android · Mehmet + Murat', stage: 3 },
  { id: 'aelova', name: 'Aelova', type: 'Product', parent: 'devonair', href: 'https://kayihan.dev/', description: 'Originally Murat-led; now under Devonair.', caption: 'Murat-led · now Devonair', stage: 4 },
  { id: 'ripple', name: 'Ripple', type: 'Product', parent: 'devonair', href: 'https://kayihan.dev/', description: 'Originally Murat-led; now under Devonair.', caption: 'Murat-led · now Devonair', stage: 4 },
];

// These describe relationships, not a transfer of product ownership.
export const networkConnections = [
  { from: 'ebiren', to: 'devonair', stage: 1 },
  { from: 'ebiren', to: 'brightspire', stage: 1 },
  { from: 'devonair', to: 'mehmet', stage: 2 },
  { from: 'devonair', to: 'murat', stage: 2 },
  { from: 'mehmet', to: 'edip', stage: 3, personal: true },
  { from: 'mehmet', to: 'over', stage: 3, layout: 'desktop' },
  { from: 'murat', to: 'over', stage: 3, layout: 'desktop' },
  { from: 'devonair', to: 'over', stage: 3, layout: 'mobile' },
  { from: 'murat', to: 'aelova', stage: 4 },
  { from: 'murat', to: 'ripple', stage: 4 },
];
