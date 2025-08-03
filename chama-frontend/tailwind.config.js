module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F7CF7', //blue --> for primary buttons & blue texts
        default: '#8C9095', //gray --> for primary text)
        primarybg: '#242E3B4D', //lightgray --> for gray backgrounds
        success: '#54B685', //green --> for success and submit buttons
        secondary: '#4AA0B5', //green-blue --> for special event texts
        secondary1: '#4084B9', // light-blue
        yellow: '#F7C344', // yellow
        yellowbg: '#F7C34426',
        danger: 'red-500',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable preflight to avoid conflicts with PrimeReact
  },
};
