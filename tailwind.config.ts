import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'arrowAuth': "url('/images/arrow--auth.svg')",
        'arrowProfile': "url('/images/arrow--profile.svg')",
        'frame': "url('/images/frame.svg')",
      },
      backgroundPosition: {
        'arrowAuth': '120% 65px',
      },
      backgroundSize: {
        'full': '100% 100%'
      },
      borderWidth: {
        1: '1px',
        3: '3px',
      },
      colors: {
        springBud: '#9dff00' /* lime green */,
        mineShaft: '#313131' /* dark gray */,
        black: '#000000' /* black */,
        white: '#ffffff' /* white */,
        battleshipGray: '#828282', /* medium gray */
        mountainMist: '#949494' /* medium gray */,
        licorice: '#141414', /* almost black */
        codGray: '#2f2f2f', /* dark gray */
        chicago: '#5e5e5e',
      },
      padding: {
        page: '32px'
      },
      zIndex: {
        searchButton: '9999',
        search: '9998',
      }
    },
    fontFamily: {
      mono: ['Space Mono', 'monospace'],
      sans: ['Space Grotesk', 'sans-serif']
    }
  },
  plugins: [],
} satisfies Config