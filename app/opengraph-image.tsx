import OpengraphImage from 'components/opengraph-image';

// Rendered on demand: next/og cannot run during the static prerender step.
export const dynamic = 'force-dynamic';

export default async function Image() {
  return await OpengraphImage({ title: 'Kaffeerösterei Ottobeuren' });
}
