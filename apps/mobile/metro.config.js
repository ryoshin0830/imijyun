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

// Metro transformerの設定は既存の設定をそのまま使用
// config.transformerの追加設定が必要な場合はここに追加

module.exports = config;