import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'kanchi',
    short_name: 'kanchi',
    description: 'A serious social platform where users can anonymously share emotions, confessions, thoughts, and experiences in real time.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/k-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/k-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}