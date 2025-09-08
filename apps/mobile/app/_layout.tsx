import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IMIJUN_COLORS } from '@imijun/core';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={IMIJUN_COLORS.subject} />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "意味順英語学習",
            headerStyle: {
              backgroundColor: IMIJUN_COLORS.subject,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="lessons"
          options={{
            title: "レッスン選択",
            headerStyle: {
              backgroundColor: IMIJUN_COLORS.verb,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitle: "戻る",
          }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            title: "レッスン",
            headerStyle: {
              backgroundColor: IMIJUN_COLORS.object,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitle: "戻る",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}