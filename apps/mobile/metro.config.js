const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// モノレポのルートディレクトリを定義
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

// watchFoldersをモノレポルートに設定
config.watchFolders = [monorepoRoot];

// nodeModulesPathsの設定（hoisted対応）
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// disableHierarchicalLookup: true（シンボリックリンク解決の安定化）
config.resolver.disableHierarchicalLookup = true;

// TypeScriptファイルの解決
config.resolver.sourceExts.push('ts', 'tsx');

// パッケージの解決を改善
config.resolver.alias = {
  '@imijun/core': path.resolve(monorepoRoot, 'packages/core'),
  '@imijun/ui': path.resolve(monorepoRoot, 'packages/ui'),
  '@imijun/lib': path.resolve(monorepoRoot, 'packages/lib'),
};

// Metro transformerの設定
config.transformer = {
  ...config.transformer,
  // React Nativeのため、getTransforms関数を設定
  getTransforms: () => ({
    ...config.transformer.getTransforms(),
    // 必要に応じて追加のtransformを設定
  }),
};

module.exports = config;