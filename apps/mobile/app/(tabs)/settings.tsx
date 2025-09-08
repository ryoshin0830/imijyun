import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IMIJUN_COLORS } from '@imijun/core';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 学習設定 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>学習設定</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="volume-high-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>効果音</Text>
                  <Text style={styles.settingDescription}>
                    正解・不正解時の効果音
                  </Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#d1d5db', true: IMIJUN_COLORS.subject }}
                thumbColor={soundEnabled ? '#ffffff' : '#f4f4f5'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="phone-portrait-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>振動フィードバック</Text>
                  <Text style={styles.settingDescription}>
                    操作時の振動フィードバック
                  </Text>
                </View>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: '#d1d5db', true: IMIJUN_COLORS.subject }}
                thumbColor={vibrationEnabled ? '#ffffff' : '#f4f4f5'}
              />
            </View>

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
            <Text style={styles.sectionTitle}>表示設定</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon-outline" size={20} color="#6b7280" />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>ダークモード</Text>
                  <Text style={styles.settingDescription}>
                    目に優しい暗い配色
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#d1d5db', true: IMIJUN_COLORS.subject }}
                thumbColor={darkMode ? '#ffffff' : '#f4f4f5'}
              />
            </View>

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

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: '#ef4444' }]}>
                    学習データをリセット
                  </Text>
                  <Text style={styles.settingDescription}>
                    すべての進捗をリセット
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ef4444" />
            </TouchableOpacity>
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
    backgroundColor: '#f8f9fa',
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
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
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
    color: '#374151',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
});