import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { turkishCultureService } from '../services/TurkishCultureService';

interface HomeScreenProps {
  serverStatus: boolean | null;
}

export default function HomeScreen({ serverStatus }: HomeScreenProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const callTurkishCultureAgent = async () => {
    if (!prompt.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir soru veya kelime girin.');
      return;
    }

    setLoading(true);
    try {
      const result = await turkishCultureService.sendMessage(prompt);
      
      if (result.success) {
        setResponse(result.data);
      } else {
        // Hata durumunda kullanıcıya bilgi ver ama demo response göster
        console.log('API Error:', result.error);
        
        // Demo response - gerçek API çalışmadığında
        const demoResponse = `🇹🇷 Turkish Culture Expert Demo Yanıtı

"${prompt}" hakkında bilgi:

📚 **TDK Resmi Veritabanından:**
• Kelime anlamı ve detaylı açıklaması
• Örnek cümleler ve kullanım alanları  
• Bileşik kelimeler ve türevleri

🏛️ **Nisanyan Etimoloji Sözlüğünden:**
• Kelimenin tarihsel kökeni
• Dil ailesi ve fonetik değişimler
• İlgili dillerdeki karşılıkları

🎭 **Kültürel Bağlam:**
• Türk kültüründeki önemi
• Geleneksel ve modern kullanım
• Bölgesel farklılıklar

⚠️ **Not:** Bu demo yanıttır. Gerçek analiz için:
1. Turkish Culture MCP Server'ının çalıştığından emin olun
2. CORS ayarlarını kontrol edin
3. API endpoint'lerini doğrulayın

Bu bilgiler TDK Resmi API, Nisanyan Etimoloji Sözlüğü ve Oxford Dictionary kaynaklarından derlenmiştir.`;

        setResponse(demoResponse);
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Bilgi', 'Demo modunda çalışıyor. Gerçek API için server ayarlarını kontrol edin.');
      
      // Demo response
      setResponse(`🔧 Demo Modu Aktif

Şu anda Turkish Culture Expert demo modunda çalışıyor.

📝 **Sorunuz:** "${prompt}"

🎯 **Normalde alacağınız yanıt:**
• TDK'dan 7 farklı sözlükten detaylı bilgi
• Nisanyan etimoloji ağacı
• Kültürel bağlam analizi
• DeepL ile profesyonel çeviri

🔧 **Gerçek API için:**
1. MCP Server: http://localhost:4111 ✅
2. CORS ayarları kontrol edilmeli
3. Agent endpoint'i doğrulanmalı`);
    } finally {
      setLoading(false);
    }
  };

  const getQuickAction = (action: string) => {
    switch (action) {
      case 'analyze':
        return () => setPrompt('çay kelimesini analiz et');
      case 'translate':
        return () => setPrompt('afiyet olsun ifadesini İngilizceye çevir');
      case 'etymology':
        return () => setPrompt('misafir kelimesinin etimolojisi');
      case 'culture':
        return () => setPrompt('Türk misafirperverlik geleneğini açıkla');
      default:
        return () => {};
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Agent Tanıtımı */}
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>🤖 Turkish Culture Expert</Text>
        <Text style={styles.introText}>
          Merhaba! Ben Turkish Culture Expert, Türk kültürü ve dili konusunda uzmanlaşmış bir AI asistanıyım.
        </Text>
        
        <Text style={styles.sectionTitle}>📚 Profesyonel Veri Kaynaklarım:</Text>
        <View style={styles.dataSourcesContainer}>
          <Text style={styles.dataSourceItem}>• <Text style={styles.bold}>TDK Resmi API:</Text> 7 farklı TDK sözlüğü (Güncel Türkçe, Atasözleri, Derleme, Bilim Terimleri, vb.)</Text>
          <Text style={styles.dataSourceItem}>• <Text style={styles.bold}>Nisanyan Etimoloji Sözlüğü:</Text> CLI ve API entegrasyonu ile profesyonel etimoloji</Text>
          <Text style={styles.dataSourceItem}>• <Text style={styles.bold}>Oxford Dictionary API:</Text> İngilizce karşılıklar</Text>
          <Text style={styles.dataSourceItem}>• <Text style={styles.bold}>DeepL API:</Text> Yüksek kaliteli çeviri</Text>
        </View>

        <Text style={styles.sectionTitle}>🔍 Size nasıl yardımcı olabilirim:</Text>
        
        <View style={styles.serviceSection}>
          <Text style={styles.serviceTitle}>📖 Kelime Analizi</Text>
          <Text style={styles.serviceDescription}>• Türkçe kelimelerin detaylı anlamı (TDK'dan 7 sözlük)</Text>
          <Text style={styles.serviceDescription}>• Etimoloji ağacı (Nisanyan)</Text>
          <Text style={styles.serviceDescription}>• Kültürel bağlam ve tarihsel gelişim</Text>
        </View>

        <View style={styles.serviceSection}>
          <Text style={styles.serviceTitle}>🌍 Profesyonel Çeviri</Text>
          <Text style={styles.serviceDescription}>• Türkçe-İngilizce arası çeviriler</Text>
          <Text style={styles.serviceDescription}>• Kültürel bağlamı koruyan çeviriler</Text>
          <Text style={styles.serviceDescription}>• Alternatif çeviri önerileri</Text>
        </View>

        <View style={styles.serviceSection}>
          <Text style={styles.serviceTitle}>🏛️ Etimoloji Araştırması</Text>
          <Text style={styles.serviceDescription}>• Kelimelerin tarihsel kökeni</Text>
          <Text style={styles.serviceDescription}>• Dil ailesi ve fonetik değişimler</Text>
          <Text style={styles.serviceDescription}>• İlgili dillerdeki karşılıklar</Text>
        </View>

        <View style={styles.serviceSection}>
          <Text style={styles.serviceTitle}>🎭 Kültürel Bağlam</Text>
          <Text style={styles.serviceDescription}>• Türk gelenekleri ve değerleri</Text>
          <Text style={styles.serviceDescription}>• Sosyal yapı ve modern adaptasyonlar</Text>
          <Text style={styles.serviceDescription}>• Bölgesel kültürel farklılıklar</Text>
        </View>

        <Text style={styles.sectionTitle}>💡 Örnek kullanım:</Text>
        <View style={styles.examplesContainer}>
          <Text style={styles.exampleItem}>• 'çay kelimesini analiz et'</Text>
          <Text style={styles.exampleItem}>• 'misafirperverlik geleneğini açıkla'</Text>
          <Text style={styles.exampleItem}>• 'afiyet olsun ifadesini İngilizceye çevir'</Text>
          <Text style={styles.exampleItem}>• 'nazar kelimesinin etimolojisi'</Text>
        </View>

        <Text style={styles.finalQuestion}>Hangi konuda yardımcı olmamı istersiniz?</Text>

        <Text style={styles.usageTitle}>💡 Hızlı Başlangıç:</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickButton} onPress={getQuickAction('analyze')}>
            <Text style={styles.quickButtonText}>📖 Kelime Analizi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={getQuickAction('translate')}>
            <Text style={styles.quickButtonText}>🌍 Çeviri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={getQuickAction('etymology')}>
            <Text style={styles.quickButtonText}>🏛️ Etimoloji</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={getQuickAction('culture')}>
            <Text style={styles.quickButtonText}>🎭 Kültür</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Sorunuzu veya analiz etmek istediğiniz kelimeyi yazın:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Örn: çay kelimesini analiz et"
          placeholderTextColor="#9ca3af"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={callTurkishCultureAgent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.buttonText}>🔍 Analiz Et</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Response Section */}
      {response ? (
        <View style={styles.responseCard}>
          <Text style={styles.responseTitle}>📖 Yanıt:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by TDK API • Nisanyan Etimoloji • DeepL • Oxford Dictionary
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
    marginTop: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  dataSourcesContainer: {
    marginBottom: 16,
  },
  dataSourceItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 4,
  },
  serviceSection: {
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 2,
  },
  examplesContainer: {
    marginBottom: 16,
  },
  exampleItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 2,
  },
  finalQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 80,
  },
  button: {
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  responseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  responseText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  quickButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e3a8a',
  },
}); 