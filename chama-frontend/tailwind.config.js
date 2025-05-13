// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/**/*.{js,ts,jsx,tsx}',
//     './node_modules/primereact/**/*.{js,ts,jsx,tsx}',
//     './public/index.html',
//   ],
//   safelist: [
//     'bg-gray-700',
//     'hover:bg-gray-700',
//     'text-gray-400',
//     'hover:text-white',
//   ],
//   theme: {
//     extend: {
//       fontSize: {
//         base: '14px',
//       },
//     },
//   },
//   plugins: [],
// }

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable preflight to avoid conflicts with PrimeReact
  },
}

// module.exports = {
  
//   mode: 'jit',
//   content: [
//     './src/**/*.{js,ts,jsx,tsx}',
//     './public/index.html',
//     './node_modules/primereact/**/*.{js,ts,jsx,tsx}'
//   ],
//   safelist: [
//     'bg-gray-700',
//     'hover:bg-gray-700',
//     'bg-gray-800',
//     'hover:bg-gray-600',
//     'bg-gray-500',
//     'hover:bg-gray-400',
//     'text-gray-400',
//     'hover:text-white'
//   ],
//   theme: {
//     extend: {
//       fontSize: {
//         base: '14px',
//       },
//     },
//   },
//   plugins: [],
// }

