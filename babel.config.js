module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@components": "./components",
            "@screens": "./screens",
            "@navigation": "./navigation",
            "@services": "./services",
            "@utils": "./utils",
            "@hooks": "./hooks",
            "@context": "./context",
            "@constants": "./constants",
            "@config": "./config",
            "@styles": "./styles",
            "@assets": "./assets",
          },
          extensions: [
            ".ios.js",
            ".android.js",
            ".native.js",
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".json",
          ],
        },
      ],
    ],
  };
};
