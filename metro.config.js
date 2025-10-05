const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Enable absolute imports with @ prefix
config.resolver.alias = {
  "@": __dirname,
  "@components": __dirname + "/components",
  "@screens": __dirname + "/screens",
  "@navigation": __dirname + "/navigation",
  "@services": __dirname + "/services",
  "@utils": __dirname + "/utils",
  "@hooks": __dirname + "/hooks",
  "@context": __dirname + "/context",
  "@constants": __dirname + "/constants",
  "@config": __dirname + "/config",
  "@styles": __dirname + "/styles",
  "@assets": __dirname + "/assets",
};

module.exports = config;
