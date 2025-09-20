const config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
          500: '#6b6b6b',
          400: '#9f9f9f',
          300: '#c8c8c8',
          200: '#e5e5e5',
          100: '#f2f2f2',
          50: '#fafafa',
          white: '#ffffff'
        }
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' }
    }
  },
  plugins: []
}
export default config