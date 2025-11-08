import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList, Session } from '../../types';
import { CustomButton } from '../../components/CustomButton';
import { IconButton } from '../../components/IconButton';
import { storageService } from '../../services/storage';
import Svg, { Path } from 'react-native-svg';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const { colors } = useTheme();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalDuration: 0,
    averageBPM: 0,
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const saved = await storageService.getSessions();
    setSessions(saved);
    calculateStats(saved);
  };

  const calculateStats = (sessionsList: Session[]) => {
    if (sessionsList.length === 0) {
      setStats({ totalSessions: 0, totalDuration: 0, averageBPM: 0 });
      return;
    }

    const totalDuration = sessionsList.reduce((sum, s) => sum + s.duration, 0);
    const averageBPM = Math.round(
      sessionsList.reduce((sum, s) => sum + s.bpm, 0) / sessionsList.length
    );

    setStats({
      totalSessions: sessionsList.length,
      totalDuration,
      averageBPM,
    });
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all session history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearSessions();
            loadSessions();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton onPress={() => navigation.goBack()} size={40}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </IconButton>

        <Text style={[styles.title, { color: colors.text }]}>PRACTICE HISTORY</Text>

        <IconButton onPress={handleClearHistory} size={40}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </IconButton>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {stats.totalSessions}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            SESSIONS
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {formatDuration(stats.totalDuration)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            TOTAL TIME
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {stats.averageBPM}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            AVG BPM
          </Text>
        </View>
      </View>

      {/* Sessions List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No practice sessions yet.{'\n'}Start practicing to see your history!
            </Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View
              key={session.id}
              style={[styles.sessionCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionDate, { color: colors.text }]}>
                  {formatDate(session.startTime)}
                </Text>
                <Text style={[styles.sessionDuration, { color: colors.primary }]}>
                  {formatDuration(session.duration)}
                </Text>
              </View>

              <View style={styles.sessionDetails}>
                <View style={styles.sessionDetail}>
                  <Text style={[styles.sessionDetailLabel, { color: colors.textSecondary }]}>
                    BPM
                  </Text>
                  <Text style={[styles.sessionDetailValue, { color: colors.text }]}>
                    {session.bpm}
                  </Text>
                </View>

                <View style={styles.sessionDetail}>
                  <Text style={[styles.sessionDetailLabel, { color: colors.textSecondary }]}>
                    Time Signature
                  </Text>
                  <Text style={[styles.sessionDetailValue, { color: colors.text }]}>
                    {session.timeSignature.numerator}/{session.timeSignature.denominator}
                  </Text>
                </View>

                <View style={styles.sessionDetail}>
                  <Text style={[styles.sessionDetailLabel, { color: colors.textSecondary }]}>
                    Sound
                  </Text>
                  <Text style={[styles.sessionDetailValue, { color: colors.text }]}>
                    {session.soundType.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionDuration: {
    fontSize: 16,
    fontWeight: '700',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionDetail: {
    alignItems: 'center',
  },
  sessionDetailLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  sessionDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
