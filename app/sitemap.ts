import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Alle Seiten von Suchmaschinen ausgeschlossen
  return [];
}
