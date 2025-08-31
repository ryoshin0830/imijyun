# 意味順英語学習アプリケーション

田地野彰教授（京都大学）が開発した「意味順」メソッドに基づく革新的な英語学習プラットフォーム

## 🎯 プロジェクト概要

### 意味順メソッドとは

意味順メソッドは、文法用語を使わずに英文構造を理解する革新的な学習法です。従来の文法教育とは異なり、以下の5つのボックスで英文を構成します：

1. **だれが** (Who/Subject) - 主語ボックス
2. **する（です）** (Do/Be) - 動詞ボックス  
3. **だれ・なに** (Whom/What) - 目的語ボックス
4. **どこ** (Where) - 場所ボックス
5. **いつ** (When) - 時間ボックス

### 本アプリケーションの特徴

- 🎨 **視覚的学習**: 色分けされたボックスで文構造を直感的に理解
- 🖱️ **インタラクティブ**: ドラッグ&ドロップで楽しく学習
- 📱 **マルチデバイス対応**: PC、タブレット、スマートフォンで利用可能
- 🎯 **段階的学習**: 基礎から応用まで段階的にスキルアップ
- 🚀 **最新技術**: Next.js 14とTypeScriptによる高速・安定動作

## 🚀 クイックスタート

### 前提条件

以下のツールがインストールされている必要があります：

- **Node.js**: v20.11.0以上（推奨: v20.11.0）
- **pnpm**: v8.15.1（グローバルインストール）
- **Git**: 最新版

### セットアップ手順

#### 1. リポジトリのクローン

```bash
# HTTPSを使用する場合
git clone https://github.com/[username]/imijun-app.git

# SSHを使用する場合
git clone git@github.com:[username]/imijun-app.git

# ディレクトリに移動
cd imijun-app
```

#### 2. pnpmのインストール（未インストールの場合）

```bash
# npmを使用してpnpmをインストール
npm install -g pnpm@8.15.1

# または、Homebrewを使用（macOS）
brew install pnpm
```

#### 3. 依存関係のインストール

```bash
# すべてのワークスペースの依存関係をインストール
pnpm install

# 特定のパッケージのみインストールする場合
pnpm --filter @imijun/web install
```

#### 4. 開発サーバーの起動

```bash
# すべてのアプリケーションを起動（推奨）
pnpm dev

# Webアプリケーションのみ起動
pnpm --filter @imijun/web dev

# ポートを指定して起動
PORT=3001 pnpm --filter @imijun/web dev
```

#### 5. アプリケーションへのアクセス

ブラウザで以下のURLにアクセスしてください：

- **開発環境**: http://localhost:3000
- **ビルド確認**: `pnpm build` 実行後、`pnpm start`でプロダクションビルドを確認

## 📁 プロジェクト構造

```
imijun-app/
├── apps/                         # アプリケーション
│   └── web/                      # Next.js Webアプリケーション
│       ├── app/                  # App Router
│       │   ├── components/       # アプリ固有のコンポーネント
│       │   │   ├── ImijunBox.tsx    # 意味順ボックスコンポーネント
│       │   │   └── WordBank.tsx     # 単語バンクコンポーネント
│       │   ├── layout.tsx       # ルートレイアウト
│       │   ├── page.tsx         # ホームページ
│       │   └── globals.css      # グローバルスタイル
│       ├── public/               # 静的ファイル
│       ├── next.config.js       # Next.js設定
│       ├── tailwind.config.ts   # Tailwind CSS設定
│       └── package.json         # パッケージ設定
├── packages/                     # 共有パッケージ
│   ├── ui/                      # 共有UIコンポーネントライブラリ
│   │   └── package.json
│   ├── lib/                     # 共有ユーティリティ関数
│   │   └── package.json
│   └── config/                  # 共有設定ファイル
│       ├── tsconfig.base.json   # 共通TypeScript設定
│       └── package.json
├── docs/                         # ドキュメント
│   └── REQUIREMENTS.md          # 詳細な要件定義書
├── .gitignore                   # Git除外設定
├── .prettierrc                  # Prettier設定
├── .editorconfig                # エディタ設定
├── .nvmrc                       # Node.jsバージョン指定
├── turbo.json                   # Turborepo設定
├── pnpm-workspace.yaml          # pnpmワークスペース設定
├── package.json                 # ルートパッケージ設定
└── README.md                    # このファイル
```

## 🛠 技術スタック

### フロントエンド
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **DnD**: @dnd-kit
- **Animation**: Framer Motion

### 開発環境
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier

### デプロイメント
- **Platform**: Vercel
- **CI/CD**: GitHub Actions

## 📝 利用可能なスクリプト

### 基本コマンド

```bash
# 開発
pnpm dev        # すべてのアプリケーションの開発サーバーを起動
pnpm build      # すべてのアプリケーションをビルド
pnpm start      # プロダクションサーバーを起動

# コード品質
pnpm lint       # ESLintでコード品質をチェック
pnpm format     # Prettierでコードを自動フォーマット

# クリーンアップ
pnpm clean      # ビルドキャッシュとnode_modulesを削除
```

### 高度なコマンド

```bash
# 特定のワークスペースでコマンドを実行
pnpm --filter @imijun/web dev          # Webアプリのみ開発サーバー起動
pnpm --filter @imijun/ui build         # UIパッケージのみビルド

# Turboコマンド
pnpm turbo run build --filter=@imijun/web  # Webアプリの依存関係も含めてビルド
pnpm turbo run dev --parallel              # 並列実行

# 依存関係管理
pnpm add react --filter @imijun/web        # 特定パッケージに依存関係を追加
pnpm update --latest                       # すべての依存関係を最新に更新
pnpm outdated                              # 古い依存関係を確認

# キャッシュ管理
pnpm turbo run build --force              # キャッシュを無視してビルド
pnpm store prune                          # pnpmストアをクリーンアップ
```

## 🎨 主要機能

### 現在実装済み（MVP）
- ✅ 意味順ボックスUI
- ✅ ドラッグ&ドロップによる単語配置
- ✅ レスポンシブデザイン
- ✅ 基本的な学習フロー

### 今後の実装予定
- [ ] ユーザー認証システム
- [ ] 学習進捗トラッキング
- [ ] ゲーミフィケーション要素
- [ ] 音声機能（TTS/音声認識）
- [ ] AI個別最適化
- [ ] 教師向けダッシュボード
- [ ] モバイルアプリ（React Native）

## 🔧 開発ガイド

### コンポーネント開発

```tsx
// 新しいコンポーネントの作成例
// apps/web/app/components/NewComponent.tsx

"use client";

interface NewComponentProps {
  title: string;
  children: React.ReactNode;
}

export default function NewComponent({ title, children }: NewComponentProps) {
  return (
    <div className="p-4 rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {children}
    </div>
  );
}
```

### スタイリングガイド

```css
/* Tailwindカスタムカラーの使用 */
.imijun-box-primary { @apply bg-imijun-primary; }
.imijun-box-action { @apply bg-imijun-action; }
.imijun-box-object { @apply bg-imijun-object; }
.imijun-box-place { @apply bg-imijun-place; }
.imijun-box-time { @apply bg-imijun-time; }
```

### Git コミットメッセージ規約

```bash
# フォーマット: <type>(<scope>): <subject>

feat(web): 新しい学習モードを追加
fix(ui): ドラッグ&ドロップのバグを修正
docs(readme): インストール手順を更新
style(web): コードフォーマットを統一
refactor(lib): ユーティリティ関数を最適化
test(web): 単体テストを追加
chore(deps): 依存関係を更新
```

## 📊 プロジェクトロードマップ

詳細なロードマップは [REQUIREMENTS.md](./docs/REQUIREMENTS.md) をご参照ください。

### Phase 1: MVP開発 ✅ (完了)
- ✅ 基本的な意味順ボックスUI
- ✅ ドラッグ&ドロップ機能
- ✅ レスポンシブデザイン
- ✅ Monorepo構成

### Phase 2: 機能拡張 🚧 (進行中)
- [ ] ユーザー認証システム (NextAuth.js)
- [ ] 学習進捗トラッキング
- [ ] ゲーミフィケーション要素
- [ ] 複数の例文パターン

### Phase 3: B2B機能 📋 (計画中)
- [ ] 教師ダッシュボード
- [ ] クラス管理機能
- [ ] カスタムコンテンツ作成
- [ ] 学習分析レポート

### Phase 4: モバイル展開 📱 (将来)
- [ ] React Nativeアプリ開発
- [ ] iOS/Androidリリース
- [ ] オフライン学習機能
- [ ] プッシュ通知

## 🤝 貢献ガイドライン

### プルリクエストの手順

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'feat: Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

### 開発規約

- **コーディング規約**: ESLintとPrettierの設定に従う
- **テスト**: 新機能には必ずテストを追加
- **ドキュメント**: 変更内容をREADMEに反映
- **レビュー**: すべてのPRは最低1人のレビューが必要

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### pnpm installでエラーが発生する場合

```bash
# キャッシュをクリア
pnpm store prune

# node_modulesを削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### ポート3000が使用中の場合

```bash
# 別のポートで起動
PORT=3001 pnpm dev

# または、使用中のプロセスを終了
lsof -i :3000
kill -9 [PID]
```

#### TypeScriptエラーが発生する場合

```bash
# TypeScriptのキャッシュをクリア
rm -rf .next
pnpm dev
```

## 📄 ライセンス

本プロジェクトの知的財産権は京都大学および田地野彰教授に帰属します。
商用利用および二次配布については、事前に許可が必要です。

## 👥 プロジェクトチーム

- **メソッド開発者**: 田地野彰教授（京都大学）
- **指導教員**: 笹尾教授
- **協力研究者**: 金丸教授
- **開発リード**: 京都大学博士課程学生

## 📚 参考文献

- 田地野彰 (2011)『「意味順」英語学習法』ディスカヴァー・トゥエンティワン
- [意味順公式サイト](https://www.imijun.com/)（仮URL）

## 📞 お問い合わせ

- **技術的な質問**: GitHubのIssueを作成してください
- **ビジネス関連**: [連絡先メールアドレス]
- **研究協力**: 京都大学 田地野研究室

## 🙏 謝辞

本プロジェクトは、京都大学の支援および多くの協力者の貢献により実現しました。
特に、意味順メソッドの開発者である田地野彰教授に深く感謝いたします。

---

<div align="center">

© 2025 京都大学 - 意味順英語教育プロジェクト

**Built with ❤️ by Kyoto University Research Team**

[Website](https://imijun.com) • [Documentation](./docs) • [Issues](https://github.com/[username]/imijun-app/issues)

</div>