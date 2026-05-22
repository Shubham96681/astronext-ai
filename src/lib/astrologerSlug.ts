/** LinkedIn-style profile slug: `first-last-ab0000012d` */
export function astrologerShareSlug(name: string, id: number): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const suffix = `ab${id.toString(16).padStart(8, '0')}`;
  return `${base}-${suffix}`;
}
