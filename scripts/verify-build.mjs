import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, relative, extname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
async function walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(files.map((file) => file.isDirectory() ? walk(join(dir, file.name)) : join(dir, file.name)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter((file) => extname(file) === '.html');
const pages = new Map(await Promise.all(htmlFiles.map(async (file) => [file, await readFile(file, 'utf8')])));
const route = (file) => '/' + relative(root, file).replace(/index\.html$/, '').replaceAll('\\', '/');
async function locate(pathname) {
  const path = join(root, decodeURIComponent(pathname));
  for (const candidate of [path, join(path, 'index.html')]) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch { /* Try directory-style static route. */ }
  }
  return undefined;
}
for (const required of ['index.html', 'products/index.html', 'products/edip/index.html', 'engineering/index.html', 'network/index.html', 'about/index.html', 'work/edip/index.html', 'writing/index.html', 'resume/index.html', '404.html', 'CNAME', '.nojekyll', 'robots.txt', 'favicon.svg', 'apple-touch-icon.png', 'images/social.png', 'images/onboard.png', 'sitemap-index.xml']) {
  assert(files.includes(join(root, required)), `Missing output: ${required}`);
}
const titles = new Set();
for (const [file, html] of pages) {
  if (route(file) === '/work/edip/') {
    assert(html.includes('http-equiv="refresh"') && html.includes('/products/edip/'), 'Legacy EDIP route must redirect');
    assert(html.includes('rel="canonical" href="https://arslanca.dev/products/edip/"'), 'Legacy EDIP canonical must point to the new route');
    continue;
  }
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title && !titles.has(title), `Missing or duplicate title: ${file}`);
  titles.add(title);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Expected one h1: ${file}`);
  assert(html.includes('lang="en"') && html.includes('id="main"'), `Missing language or main landmark: ${file}`);
  assert(html.includes('name="description"') && html.includes('property="og:image"'), `Missing metadata: ${file}`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, `https://arslanca.dev${route(file)}`, `Invalid canonical: ${file}`);
  assert(!/Lorem ipsum|Draft template|An internal authoring template/i.test(html) && !html.includes('DevOnAir'), `Unexpected public copy: ${file}`);
  assert(!/<(?:astro-island|button)\b/.test(html), `Unexpected interactive UI: ${file}`);
  for (const match of html.matchAll(/<(?:a|link|img|script)\b[^>]*>/g)) {
    const tag = match[0];
    const href = tag.match(/\b(?:href|src)="([^"]+)"/)?.[1];
    if (!href) continue;
    if (tag.startsWith('<a ') && href.startsWith('https:')) {
      assert(/rel="[^"]*noopener[^\"]*noreferrer/.test(tag), `Missing safe external link attributes: ${href}`);
    }
    const url = new URL(href.replaceAll('&amp;', '&'), `https://arslanca.dev${route(file)}`);
    if (url.origin !== 'https://arslanca.dev') continue;
    const target = await locate(url.pathname);
    assert(target, `Missing local link or asset: ${href} in ${route(file)}`);
    if (url.hash && pages.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert(pages.get(target).includes(`id="${id}"`), `Missing anchor ${href} in ${route(file)}`);
    }
  }
}
const sitemap = await readFile(join(root, 'sitemap-0.xml'), 'utf8');
assert(!/\/resume\/|\/404|\/template\/|\/work\/edip\//.test(sitemap), 'Private placeholder, redirect, or draft in sitemap');
for (const route of ['/products/', '/products/edip/', '/engineering/', '/network/', '/about/', '/writing/']) assert(sitemap.includes(`https://arslanca.dev${route}`), `Missing sitemap route: ${route}`);
const home = pages.get(join(root, 'index.html'));
assert(!home.includes('gc.zgo.at') || home.includes('data-goatcounter="https://'), 'Misconfigured analytics');
const modules = new Set([...pages.values()].flatMap((html) => [...html.matchAll(/<script\b[^>]*type="module"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1])));
const javascriptFiles = files.filter((file) => file.endsWith('.js'));
const javascriptBytes = [...modules].reduce((sum, module) => sum + Buffer.byteLength(module), 0)
  + (await Promise.all(javascriptFiles.map(async (file) => (await stat(file)).size))).reduce((a, b) => a + b, 0);
assert(javascriptBytes > 0 && javascriptBytes < 20_000, `Motion JavaScript exceeds the 20 KB budget: ${javascriptBytes}`);
assert.deepEqual(await readFile(join(root, 'images/onboard.png')), await readFile('public/images/onboard.png'), 'Hero image must come from its source asset');
const image = await readFile(join(root, 'images/social.png'));
assert.equal(image.readUInt32BE(16), 1200);
assert.equal(image.readUInt32BE(20), 630);
assert.equal((await readFile(join(root, 'CNAME'), 'utf8')).trim(), 'arslanca.dev');
console.log(`Verified ${htmlFiles.length} static pages: metadata, local links, anchors, assets, draft exclusion, social image, and Pages files. Motion JavaScript: ${javascriptBytes} bytes. Hero image matches its source.`);
