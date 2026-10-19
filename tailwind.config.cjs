module.exports = {
  content: ['./*.html', './assets/**/*.js'],
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(slate|indigo|emerald|amber|rose|sky|purple|pink|blue|orange|red|green|brand|simple|continuous|tag)-(50|100|200|300|400|500|600|700|800|900|950)$/,
      variants: ['hover', 'focus']
    }
  ],
  theme: { extend: {
  "fontFamily": {
    "sans": ["Arial", "Helvetica", "sans-serif"],
    "display": ["Arial", "Helvetica", "sans-serif"],
    "mono": ["Arial", "Helvetica", "sans-serif"]
  },
  "colors": {
    "brand": {
      "50": "#eef2ff",
      "100": "#e0e7ff",
      "200": "#c7d2fe",
      "500": "#6366f1",
      "600": "#4f46e5",
      "700": "#4338ca",
      "800": "#3730a3",
      "900": "#312e81"
    },
    "simple": {
      "50": "#ecfdf5",
      "100": "#d1fae5",
      "600": "#059669",
      "700": "#047857",
      "800": "#065f46"
    },
    "continuous": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af"
    },
    "tag": {
      "50": "#fff7ed",
      "100": "#ffedd5",
      "500": "#f97316",
      "600": "#ea580c",
      "700": "#c2410c"
    }
  }
} }
};
