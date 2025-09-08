import { Redirect } from 'expo-router';

export default function Index() {
  // タブナビゲーションへリダイレクト
  return <Redirect href="/(tabs)" />;
}