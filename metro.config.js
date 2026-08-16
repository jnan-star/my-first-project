const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prefer CommonJS entrypoints for dependencies such as Zustand when bundling
// for the browser. This avoids leaving import.meta syntax in Metro's classic
// script bundle while preserving the native iOS and Android behavior.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
