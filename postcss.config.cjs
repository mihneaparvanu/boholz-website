module.exports = {
  plugins: [
    require("@csstools/postcss-global-data")({
      files: ["./src/ui/style/breakpoints.css"],
    }),
    require("postcss-custom-media")(),
    require("postcss-preset-env")({
      stage: 3,
      features: {
        "nesting-rules": true,
      },
      autoprefixer: { flexbox: "no-2009" },
    }),
  ],
};
