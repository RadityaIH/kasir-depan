const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}'
	],
  theme: {
    colors: {
      orange: '#ea580c',
      darkerorange: '#592408',
    },
    extend: {},
  },
  plugins: [],
});