import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { IMIJUN_COLORS } from '@imijun/core';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Typography, Spacing, BorderRadius, Shadows } from '../../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SettingsScreen() {
  const { colors, colorScheme, setColorScheme, actualColorScheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>(colorScheme);

  useEffect(() => {
    setThemeMode(colorScheme);
  }, [colorScheme]);

  const handleThemeChange = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
    setColorScheme(mode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleVibrationToggle = (enabled: boolean) => {
    setVibrationEnabled(enabled);
    if (enabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      '学習データをリセット',
      'すべての学習進捗とスコアがリセットされます。この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセット',
          style: 'destructive',
          onPress: () => {
            // リセット処理
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 学習設定 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>学習設定</Text>
            
            <Card variant="elevated" padding="medium" margin="small">
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="volume-high-outline" size={20} color={colors.textSecondary} />
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>効果音</Text>
                    <Text style={[styles.settingDescription, { color: colors.textTertiary }]}>
                      正解・不正解時の効果音
                    </Text>
                  </View>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={soundEnabled ? '#ffffff' : colors.surface}
                />
              </View>
            </Card>

            <Card variant="elevated" padding="medium" margin="small">
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="phone-portrait-outline" size={20} color={colors.textSecondary} />
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>振動フィードバック</Text>
                    <Text style={[styles.settingDescription, { color: colors.textTertiary }]}>
                      操作時の振動フィードバック
                    </Text>
                  </View>
                </View>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={handleVibrationToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={vibrationEnabled ? '#ffffff' : colors.surface}
                />
              </View>
            </Card>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="text-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>文字サイズ</Text>
                  <Text style={styles.settingDescription}>標準</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="speedometer-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>学習速度</Text>
                  <Text style={styles.settingDescription}>標準ペース</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* 通知設定 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>通知設定</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>プッシュ通知</Text>
                  <Text style={styles.settingDescription}>
                    学習リマインダーなど
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: IMIJUN_COLORS.subject }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f4f4f5'}
              />
            </View>

            {notificationsEnabled && (
              <>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="time-outline" size={20} color="#6b7280" />
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>リマインダー時間</Text>
                      <Text style={styles.settingDescription}>毎日 20:00</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>通知する曜日</Text>
                      <Text style={styles.settingDescription}>毎日</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* 表示設定 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>表示設定</Text>
            
            <Card variant="elevated" padding="medium" margin="small">
              <View style={styles.themeSelector}>
                <Text style={[styles.settingLabel, { color: colors.text, marginBottom: 12 }]}>テーマ</Text>
                <View style={styles.themeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      { borderColor: colors.border },
                      themeMode === 'light' && { 
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '10'
                      }
                    ]}
                    onPress={() => handleThemeChange('light')}
                  >
                    <Ionicons 
                      name="sunny" 
                      size={24} 
                      color={themeMode === 'light' ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.themeOptionText,
                      { color: themeMode === 'light' ? colors.primary : colors.textSecondary }
                    ]}>ライト</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      { borderColor: colors.border },
                      themeMode === 'dark' && { 
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '10'
                      }
                    ]}
                    onPress={() => handleThemeChange('dark')}
                  >
                    <Ionicons 
                      name="moon" 
                      size={24} 
                      color={themeMode === 'dark' ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.themeOptionText,
                      { color: themeMode === 'dark' ? colors.primary : colors.textSecondary }
                    ]}>ダーク</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      { borderColor: colors.border },
                      themeMode === 'auto' && { 
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '10'
                      }
                    ]}
                    onPress={() => handleThemeChange('auto')}
                  >
                    <Ionicons 
                      name="phone-portrait" 
                      size={24} 
                      color={themeMode === 'auto' ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.themeOptionText,
                      { color: themeMode === 'auto' ? colors.primary : colors.textSecondary }
                    ]}>自動</Text>
                  </TouchableOpacity>
                </View>
                {themeMode === 'auto' && (
                  <Text style={[styles.settingDescription, { color: colors.textTertiary, marginTop: 8 }]}>
                    現在: {actualColorScheme === 'dark' ? 'ダークモード' : 'ライトモード'}
                  </Text>
                )}
              </View>
            </Card>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="language-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>言語</Text>
                  <Text style={styles.settingDescription}>日本語</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* データ管理 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>データ管理</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="cloud-upload-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>データをバックアップ</Text>
                  <Text style={styles.settingDescription}>
                    最終バックアップ: なし
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="cloud-download-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>データを復元</Text>
                  <Text style={styles.settingDescription}>
                    バックアップから復元
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <Card 
              variant="elevated" 
              padding="medium" 
              margin="small"
              onPress={handleResetData}
            >
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: colors.error }]}>
                      学習データをリセット
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.textTertiary }]}>
                      すべての進捗をリセット
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.error} />
              </View>
            </Card>
          </View>

          {/* その他 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>その他</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="help-circle-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>ヘルプ</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="document-text-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>利用規約</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>プライバシーポリシー</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>アプリについて</Text>
                  <Text style={styles.settingDescription}>バージョン 1.0.0</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
  },
  themeSelector: {
    width: '100%',
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginHorizontal: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
  },
  themeOptionText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});