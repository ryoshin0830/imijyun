import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// 共有パッケージからのインポートテスト
// Note: TypeScriptエラーが発生する可能性があるため、実際のビルド時にコメントアウトを解除
// import { IMIJUN_COLORS } from '@imijun/core/constants';
// import { Button } from '@imijun/ui/components';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>意味順英語学習アプリ</Text>
        <Text style={styles.subtitle}>Mobile App - Hello World</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metro Bundler設定テスト</Text>
          <Text style={styles.description}>
            このページが表示されていれば、Metro Bundlerの基本設定は正常に動作しています。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>モノレポ構造</Text>
          <Text style={styles.description}>
            • apps/mobile - React Native + Expo アプリケーション
            {'\n'}• packages/core - 共有ビジネスロジック
            {'\n'}• packages/ui - 共有UIコンポーネント
            {'\n'}• packages/lib - 共有ユーティリティ
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expo Router</Text>
          <Text style={styles.description}>
            Expo Routerのファイルベースルーティングが動作しています。
            この画面は app/index.tsx から表示されています。
          </Text>
        </View>

        <View style={styles.colorPalette}>
          <Text style={styles.sectionTitle}>意味順カラーパレット</Text>
          <View style={styles.colorGrid}>
            <View style={[styles.colorBox, { backgroundColor: '#60A5FA' }]}>
              <Text style={styles.colorLabel}>だれが</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: '#F472B6' }]}>
              <Text style={styles.colorLabel}>する</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: '#FBBF24' }]}>
              <Text style={styles.colorLabel}>だれ・なに</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: '#34D399' }]}>
              <Text style={styles.colorLabel}>どこ</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: '#A78BFA' }]}>
              <Text style={styles.colorLabel}>いつ</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#60A5FA',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
  },
  colorPalette: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorBox: {
    width: '30%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});