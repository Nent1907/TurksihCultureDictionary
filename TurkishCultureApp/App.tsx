import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { turkishCultureService } from './services/TurkishCultureService';
import HomeScreen from './screens/HomeScreen';
import RandomWordScreen from './screens/RandomWordScreen';

type TabType = 'home' | 'random';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    const isOnline = await turkishCultureService.checkServerStatus();
    setServerStatus(isOnline);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen serverStatus={serverStatus} />;
      case 'random':
        return <RandomWordScreen serverStatus={serverStatus} />;
      default:
        return <HomeScreen serverStatus={serverStatus} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1e3a8a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🇹🇷 Turkish Culture Dictionary</Text>
        <Text style={styles.subtitle}>Türk Kültürü ve Dil Sözlüğü</Text>
        
        {/* Server Status - IP gizlendi */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: serverStatus ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            {serverStatus === null ? 'Bağlantı kontrol ediliyor...' : 
             serverStatus ? 'Server\'a bağlandı ✅' : 'Server Bağlantısı Yok (Demo Modu)'}
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'home' && styles.activeTab]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.activeTabIcon]}>🏠</Text>
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>Ana Sayfa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'random' && styles.activeTab]}
          onPress={() => setActiveTab('random')}
        >
          <Text style={[styles.tabIcon, activeTab === 'random' && styles.activeTabIcon]}>🎲</Text>
          <Text style={[styles.tabText, activeTab === 'random' && styles.activeTabText]}>Rastgele Kelime</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#e2e8f0',
    marginTop: 4,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#e2e8f0',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#1e3a8a',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeTabIcon: {
    fontSize: 20,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
});
