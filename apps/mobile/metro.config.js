const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
const existingWatchFolders = config.watchFolders ?? [];
config.watchFolders = Array.from(new Set([...existingWatchFolders, monorepoRoot]));

// 2. Let Metro know where to resolve packages and in what order
const existingNodeModulesPaths = config.resolver?.nodeModulesPaths ?? [];
config.resolver.nodeModulesPaths = Array.from(new Set([
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
  ...existingNodeModulesPaths,
]));

module.exports = config;
