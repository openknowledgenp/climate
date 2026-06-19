/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest:  '#27500A',
        'mid-green': '#639922',
        leaf:    '#EAF3DE',
        amber:   '#EF9F27',
        charcoal:'#2C2C2A',
        'site-bg':'#F7F8F5',
      },
      backgroundImage: {
        'climate': "url('../public/climate.jpg')",
        'one-world': "url('../public/oneowrld.jpg')",
      },
    },
  },
  plugins: [],
}
