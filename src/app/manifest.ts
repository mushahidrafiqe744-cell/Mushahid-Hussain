import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Mushahid Hussain - Web Developer Portfolio',
    short_name: 'Mushahid Portfolio',
    description: 'Professional Web & Full-Stack Developer portfolio of Mushahid Hussain featuring responsive projects, GitHub repositories, technical skills showcase, interactive resume, and contact channels.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F8F5EE',
    theme_color: '#0A3D22',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
