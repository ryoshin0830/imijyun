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
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
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
            presentation: 'modal',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}