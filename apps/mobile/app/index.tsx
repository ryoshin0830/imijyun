import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { IMIJUN_COLORS, TUTORIAL_LESSON } from '@imijun/core';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [showStats, setShowStats] = useState(false);

  const startTutorial = () => {
    router.push({
      pathname: '/lesson/[id]',
      params: { id: 'tutorial' }
    });
  };

  const goToLessons = () => {
    router.push('/lessons');
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>意味順英語学習</Text>
            <Text style={styles.subtitle}>
              田地野先生の「意味順」メソッドで英語を学ぼう
            </Text>
          </View>

          {/* Quick Start Buttons */}
          <View style={styles.quickStartSection}>
            <TouchableOpacity style={styles.tutorialButton} onPress={startTutorial}>
              <View style={styles.buttonIcon}>
                <Text style={styles.buttonIconText}>🎓</Text>
              </View>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>チュートリアル</Text>
                <Text style={styles.buttonSubtitle}>
                  初めての方はここから！基本を学びましょう
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.lessonsButton} onPress={goToLessons}>
              <View style={styles.buttonIcon}>
                <Text style={styles.buttonIconText}>📚</Text>
              </View>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>レッスン一覧</Text>
                <Text style={styles.buttonSubtitle}>
                  様々なレベルのレッスンに挑戦しよう
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Imijun Method Explanation */}
          <View style={styles.methodSection}>
            <Text style={styles.sectionTitle}>意味順メソッドとは？</Text>
            <Text style={styles.methodDescription}>
              英語の文を「だれが」「する」「だれ・なに」「どこ」「いつ」の
              5つの意味のまとまりで理解する革新的な学習法です。
            </Text>
          </View>

          {/* Color Palette */}
          <View style={styles.colorPalette}>
            <Text style={styles.sectionTitle}>意味順5つのボックス</Text>
            <View style={styles.colorGrid}>
              <View style={[styles.colorBox, { backgroundColor: IMIJUN_COLORS.subject }]}>
                <Text style={styles.colorLabel}>だれが</Text>
                <Text style={styles.colorSubLabel}>Who</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: IMIJUN_COLORS.verb }]}>
                <Text style={styles.colorLabel}>する</Text>
                <Text style={styles.colorSubLabel}>Do</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: IMIJUN_COLORS.object }]}>
                <Text style={styles.colorLabel}>だれ・なに</Text>
                <Text style={styles.colorSubLabel}>What</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: IMIJUN_COLORS.place }]}>
                <Text style={styles.colorLabel}>どこ</Text>
                <Text style={styles.colorSubLabel}>Where</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: IMIJUN_COLORS.time }]}>
                <Text style={styles.colorLabel}>いつ</Text>
                <Text style={styles.colorSubLabel}>When</Text>
              </View>
            </View>
          </View>

          {/* Progress Stats (Placeholder) */}
          <TouchableOpacity style={styles.statsSection} onPress={toggleStats}>
            <Text style={styles.sectionTitle}>学習の進歩 📊</Text>
            {showStats ? (
              <View style={styles.statsContent}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>完了したレッスン</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>連続学習日数</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>総得点</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.statsToggle}>タップして詳細を表示</Text>
            )}
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>アプリについて</Text>
            <Text style={styles.infoText}>
              このアプリは田地野彰教授の「意味順」メソッドに基づいて作られています。
              文法用語を使わずに、直感的に英語の構造を理解できます。
            </Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: IMIJUN_COLORS.subject,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  quickStartSection: {
    marginBottom: 32,
  },
  tutorialButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: IMIJUN_COLORS.subject,
  },
  lessonsButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: IMIJUN_COLORS.verb,
  },
  buttonIcon: {
    marginRight: 16,
    justifyContent: 'center',
  },
  buttonIconText: {
    fontSize: 32,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  methodSection: {
    backgroundColor: '#f0f9ff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: IMIJUN_COLORS.subject,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  methodDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1e40af',
  },
  colorPalette: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorBox: {
    width: screenWidth * 0.17,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  colorSubLabel: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 2,
  },
  statsSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: IMIJUN_COLORS.subject,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  statsToggle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoSection: {
    backgroundColor: '#fef7ed',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#78350f',
  },
});