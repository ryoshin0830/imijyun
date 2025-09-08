import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IMIJUN_COLORS } from '@imijun/core';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* プロフィールヘッダー */}
        <LinearGradient
          colors={[IMIJUN_COLORS.object, '#F5B500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color={IMIJUN_COLORS.object} />
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>ゲストユーザー</Text>
            <Text style={styles.userEmail}>guest@example.com</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* 学習統計 */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>学習統計</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="calendar" size={24} color={IMIJUN_COLORS.subject} />
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>学習日数</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={24} color={IMIJUN_COLORS.verb} />
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>完了レッスン</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="star" size={24} color={IMIJUN_COLORS.object} />
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>獲得スター</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="time" size={24} color={IMIJUN_COLORS.place} />
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>学習時間(h)</Text>
              </View>
            </View>
          </View>

          {/* 達成バッジ */}
          <View style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>達成バッジ</Text>
            <View style={styles.badgesContainer}>
              <View style={styles.badgePlaceholder}>
                <Ionicons name="trophy-outline" size={32} color="#d1d5db" />
                <Text style={styles.badgeText}>未獲得</Text>
              </View>
              <View style={styles.badgePlaceholder}>
                <Ionicons name="medal-outline" size={32} color="#d1d5db" />
                <Text style={styles.badgeText}>未獲得</Text>
              </View>
              <View style={styles.badgePlaceholder}>
                <Ionicons name="ribbon-outline" size={32} color="#d1d5db" />
                <Text style={styles.badgeText}>未獲得</Text>
              </View>
            </View>
          </View>

          {/* 学習目標 */}
          <View style={styles.goalsSection}>
            <Text style={styles.sectionTitle}>学習目標</Text>
            <TouchableOpacity style={styles.goalCard}>
              <View style={styles.goalIcon}>
                <Ionicons name="flag" size={20} color={IMIJUN_COLORS.subject} />
              </View>
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle}>週間目標</Text>
                <Text style={styles.goalDescription}>週に5レッスン完了する</Text>
                <View style={styles.goalProgress}>
                  <View style={styles.goalProgressBar}>
                    <View style={[styles.goalProgressFill, { width: '0%' }]} />
                  </View>
                  <Text style={styles.goalProgressText}>0/5</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* アカウント管理 */}
          <View style={styles.accountSection}>
            <Text style={styles.sectionTitle}>アカウント</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <Text style={styles.menuItemText}>プロフィール編集</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="notifications-outline" size={20} color="#6b7280" />
              <Text style={styles.menuItemText}>通知設定</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={[styles.menuItemText, { color: '#ef4444' }]}>ログアウト</Text>
              <Ionicons name="chevron-forward" size={20} color="#ef4444" />
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
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: IMIJUN_COLORS.subject,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  badgesSection: {
    marginBottom: 24,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badgePlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  goalsSection: {
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${IMIJUN_COLORS.subject}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
    marginRight: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: IMIJUN_COLORS.subject,
    borderRadius: 2,
  },
  goalProgressText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  accountSection: {
    marginBottom: 24,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
});