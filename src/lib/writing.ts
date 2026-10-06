import { getCollection } from 'astro:content';
export async function getPublishedPosts() {
  return (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
