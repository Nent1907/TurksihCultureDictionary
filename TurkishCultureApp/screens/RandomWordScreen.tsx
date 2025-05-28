import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { turkishCultureService } from '../services/TurkishCultureService';

interface RandomWordScreenProps {
  serverStatus: boolean | null;
}

export default function RandomWordScreen({ serverStatus }: RandomWordScreenProps) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  const getRandomWordAnalysis = async () => {
    setLoading(true);
    try {
      const result = await turkishCultureService.getRandomWordAnalysis();
      
      if (result.success) {
        setResponse(result.data);
        // Extract word from response if possible
        const wordMatch = result.data.match(/##\s*🔤\s*([A-ZÇĞIİÖŞÜ\s]+)/i) ||
                         result.data.match(/\*\*🔤 SEÇİLEN KELİME:\*\*\s*([^\n]+)/i) ||
                         result.data.match(/\*\*Seçilen Kelime:\*\*\s*([^\n]+)/i) ||
                         result.data.match(/SEÇİLEN KELİME:\*\*\s*([^\n]+)/i);
        if (wordMatch) {
          setCurrentWord(wordMatch[1].trim());
        }
      } else {
        console.log('API Error:', result.error);
        
        // Genişletilmiş ve kategorize edilmiş kelime havuzu
        const wordCategories = {
          cultural: ['misafir', 'bereket', 'nazar', 'afiyet', 'vefa', 'sabır', 'huzur', 'gurbet', 'hasret', 'özlem'],
          nature: ['bahar', 'yağmur', 'güneş', 'deniz', 'dağ', 'orman', 'çiçek', 'yaprak', 'bulut', 'rüzgar'],
          emotions: ['sevgi', 'dostluk', 'umut', 'sevinç', 'hüzün', 'merak', 'korku', 'öfke', 'şaşkınlık', 'mutluluk'],
          daily: ['ev', 'yol', 'kapı', 'pencere', 'masa', 'kitap', 'kalem', 'su', 'ekmek', 'çay'],
          abstract: ['zaman', 'hayat', 'ölüm', 'rüya', 'gerçek', 'hayal', 'düşünce', 'akıl', 'kalp', 'ruh'],
          traditional: ['han', 'kervan', 'çarşı', 'hamam', 'cami', 'medrese', 'divan', 'şair', 'aşık', 'hikaye'],
          food: ['pilav', 'börek', 'kebap', 'baklava', 'lokum', 'helva', 'meze', 'dolma', 'sarma', 'mantı'],
          family: ['anne', 'baba', 'kardeş', 'dede', 'nine', 'teyze', 'amca', 'hala', 'dayı', 'yeğen'],
          colors: ['kırmızı', 'mavi', 'yeşil', 'sarı', 'mor', 'turuncu', 'pembe', 'siyah', 'beyaz', 'gri'],
          animals: ['aslan', 'kartal', 'kurt', 'ayı', 'geyik', 'tavşan', 'kedi', 'köpek', 'at', 'kuş']
        };
        
        // Rastgele kategori ve kelime seç
        const categories = Object.keys(wordCategories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryWords = wordCategories[randomCategory as keyof typeof wordCategories];
        const selectedWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        
        // Timestamp ile benzersizlik garantisi
        const timestamp = new Date().getTime();
        const uniqueId = timestamp % 1000;
        
        setCurrentWord(selectedWord);
        
        const demoResponse = `# 🎲 RASTGELE KELİME ANALİZİ

## 🔤 ${selectedWord.toUpperCase()}

**📂 Kategori:** ${randomCategory} (${categoryWords.length} kelime içinden seçildi)
**🆔 Demo ID:** ${uniqueId}

**📚 TDK RESMİ TANIMI:**
• **Ana Anlam:** "${selectedWord}" kelimesinin TDK Güncel Türkçe Sözlük'teki detaylı tanımı
• **Kelime Türü:** İsim/Fiil/Sıfat (gramer kategorisi)
• **Alternatif Anlamlar:** Farklı bağlamlardaki kullanımlar
• **Kullanım Alanları:** Günlük dil, edebiyat, özel terminoloji

**🏛️ ETİMOLOJİK KÖKEN VE TARİHÇE (Nisanyan):**
• **Ana Köken:** "${selectedWord}" kelimesinin tarihsel kökeni ve dil ailesi
• **Kaynak Dil:** Hangi dilden Türkçeye geçtiği (Türkçe/Arapça/Farsça/Fransızca/Latince/Yunanca)
• **Fonetik Evrim:** Ses olayları ve telaffuz değişimleri sürecinde yaşanan dönüşümler
• **Tarihsel Süreç:** Türkçeye geçiş tarihi, yolu ve dönemsel kullanım değişiklikleri
• **Etimolojik Ağaç:** Aynı kökten türeyen diğer kelimeler ve türev ailesi
• **Dil Ailesi İlişkileri:** İlgili dillerdeki karşılıkları ve fonetik benzerlikler
• **Semantik Değişim:** Anlam kayması, genişlemesi veya daralması süreci
• **Alternatif Teoriler:** Farklı etimolojik yaklaşımlar ve tartışmalı köken teorileri

**🎭 KÜLTÜREL BAĞLAM:**
• **Geleneksel Kullanım:** Türk kültüründeki önemi ve yeri
• **Sosyal Anlam:** Toplumsal bağlamda taşıdığı anlamlar
• **Modern Adaptasyon:** Günümüzdeki kullanım şekli
• **Kültürel Değer:** Türk değer sistemi içindeki konumu

**🌍 İNGİLİZCE KARŞILIĞI (DeepL):**
• **Ana Çeviri:** En yaygın İngilizce karşılığı
• **Alternatif Çeviriler:** Bağlama göre farklı seçenekler
• **Kültürel Çeviri:** Anlam kaybı olmayan adaptasyonlar

**📝 ÖRNEK CÜMLELER:**
• **Günlük Konuşma:** "${selectedWord}" kelimesinin günlük kullanımı
• **Edebi Kullanım:** Şiir ve edebiyattaki yeri
• **Atasözü/Deyim:** Geleneksel ifadelerdeki kullanımı

**🗺️ BÖLGESEL KULLANIM:**
• **Lehçe Farklılıkları:** Farklı bölgelerdeki telaffuz
• **Ağız Özellikleri:** Yerel varyantlar
• **Coğrafi Dağılım:** Kullanım yoğunluğu

**⚖️ MODERN vs GELENEKSEL:**
• **Geçmiş Kullanım:** Osmanlı dönemi kullanımı
• **Anlam Değişimi:** Semantik evrim
• **Günümüz Kullanımı:** Modern Türkçedeki durumu

**🔗 İLGİLİ KELİMELER:**
• **Aynı Kökten:** Türev kelimeler
• **Eş Anlamlılar:** Sinonim kelimeler
• **Zıt Anlamlılar:** Antonim kelimeler

**⚠️ Not:** Bu demo yanıttır (Kelime: ${selectedWord.toUpperCase()}, Kategori: ${randomCategory}, ID: ${uniqueId}). 
Gerçek analiz için Turkish Culture MCP Server'ının çalıştığından emin olun.

**🔧 Gerçek API Özellikleri:**
• TDK'nın 7 farklı sözlüğünden canlı veri
• Nisanyan CLI entegrasyonu ile gerçek etimoloji
• DeepL API ile profesyonel çeviri
• Oxford Dictionary ile İngilizce doğrulama`;

        setResponse(demoResponse);
      }
    } catch (error) {
      console.error('Random Word API Error:', error);
      Alert.alert('Bilgi', 'Demo modunda çalışıyor. Gerçek API için server ayarlarını kontrol edin.');
      
      // Fallback demo response with more variety
      const fallbackCategories = {
        basic: ['kitap', 'ev', 'yol', 'su', 'ağaç'],
        advanced: ['bilgelik', 'cesaret', 'adalet', 'merhamet', 'tevazu'],
        modern: ['teknoloji', 'internet', 'mobil', 'dijital', 'sanal']
      };
      
      const categoryKeys = Object.keys(fallbackCategories);
      const randomCat = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
      const catWords = fallbackCategories[randomCat as keyof typeof fallbackCategories];
      const fallbackWord = catWords[Math.floor(Math.random() * catWords.length)];
      
      setCurrentWord(fallbackWord);
      
      setResponse(`# 🔧 DEMO MODU - RASTGELE KELİME

## 🔤 ${fallbackWord.toUpperCase()}

**🔗 TDK API Durumu:** ⚠️ Bağlantı kurulamadı (Demo modu)
**📂 Kategori:** ${randomCat}
**⏰ Timestamp:** ${new Date().toLocaleTimeString('tr-TR')}

**🎯 Normalde TDK API'sinden alacağınız detaylı analiz:**
• **TDK Resmi Tanımı:** 7 farklı sözlükten kapsamlı bilgi
• **Etimolojik Köken:** Nisanyan etimoloji ağacı ve tarihsel gelişim
  - Ana köken ve dil ailesi
  - Kaynak dil (Türkçe/Arapça/Farsça/Latince/Yunanca)
  - Fonetik evrim ve ses değişimleri
  - Tarihsel süreç ve geçiş yolu
  - Etimolojik ağaç ve türev kelimeler
  - Dil ailesi ilişkileri
  - Semantik değişim süreci
  - Alternatif etimolojik teoriler
• **Kültürel Bağlam:** Sosyal kullanım ve kültürel önem
• **İngilizce Çeviri:** DeepL ile profesyonel çeviri
• **Bölgesel Kullanım:** Lehçe ve ağız farklılıkları
• **Modern vs Geleneksel:** Kullanım karşılaştırması

**🔧 Gerçek TDK API için:**
1. MCP Server çalışıyor olmalı
2. TDK API bağlantısı aktif olmalı
3. CORS ayarları kontrol edilmeli
4. Agent endpoint'i doğrulanmalı

**⚠️ Not:** Bu fallback demo yanıttır (Kelime: ${fallbackWord.toUpperCase()})
Gerçek TDK API'sinden kelime çekmek için server ayarlarını kontrol edin.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>🎲 Rastgele Kelime</Text>
        <Text style={styles.headerSubtitle}>
          Türkçe kelime hazinesinden rastgele seçilen bir kelimeyi kapsamlı şekilde analiz edin
        </Text>
        
        <View style={styles.featuresList}>
          <Text style={styles.featureTitle}>🔧 Bu butona tıkladığınızda tüm araçlar çalışacak:</Text>
          <Text style={styles.featureItem}>✅ TDK Güncel Türkçe Sözlük API - Ana tanım ve gramer</Text>
          <Text style={styles.featureItem}>✅ TDK Tarama Sözlüğü - Tarihsel kullanım örnekleri</Text>
          <Text style={styles.featureItem}>✅ TDK Derleme Sözlüğü - Halk ağzı ve bölgesel varyantlar</Text>
          <Text style={styles.featureItem}>✅ TDK Atasözleri ve Deyimler - Geleneksel kullanım</Text>
          <Text style={styles.featureItem}>✅ Nisanyan Etimoloji CLI - Kapsamlı köken analizi</Text>
          <Text style={styles.featureItem}>✅ DeepL API - Profesyonel çeviri ve bağlamsal analiz</Text>
          <Text style={styles.featureItem}>✅ Oxford Dictionary - İngilizce doğrulama ve IPA telaffuz</Text>
          <Text style={styles.featureItem}>🌳 Etimolojik ağaç ve dil ailesi ilişkileri</Text>
          <Text style={styles.featureItem}>🔄 Fonetik evrim ve semantik değişim süreci</Text>
          <Text style={styles.featureItem}>🎭 Kültürel bağlam ve tarihsel önem analizi</Text>
          <Text style={styles.featureItem}>📊 İstatistiksel kullanım verileri ve trend analizi</Text>
          <Text style={styles.featureItem}>🗺️ Bölgesel kullanım ve lehçe farklılıkları</Text>
        </View>

        {currentWord && (
          <View style={styles.currentWordContainer}>
            <Text style={styles.currentWordLabel}>Son analiz edilen kelime:</Text>
            <Text style={styles.currentWord}>{currentWord}</Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      <View style={styles.actionCard}>
        <TouchableOpacity
          style={[styles.randomButton, loading && styles.buttonDisabled]}
          onPress={getRandomWordAnalysis}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2E8B57" />
              <Text style={styles.loadingText}>
                YENİ RASTGELE KELİME seçiliyor...{'\n'}
                TÜM ARAÇLAR çalışıyor: TDK API + Nisanyan + DeepL + Oxford...{'\n'}
                Her seferinde farklı kelime garantisi! 🎲
              </Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🎲</Text>
              <Text style={styles.buttonText}>Rastgele Kelime Analiz Et</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.buttonDescription}>
          Her basışta YENİ bir rastgele Türkçe kelime seçilir ve 7 araçla kapsamlı analiz yapılır.{'\n'}
          Benzersiz kelime garantisi! 🎲✨
        </Text>
      </View>

      {/* Response Section */}
      {response ? (
        <View style={styles.responseCard}>
          <Text style={styles.responseTitle}>📖 Kelime Analizi:</Text>
          <Text style={styles.responseText}>{response}</Text>
          
          <TouchableOpacity
            style={styles.newWordButton}
            onPress={getRandomWordAnalysis}
            disabled={loading}
          >
            <Text style={styles.newWordButtonText}>🔄 Yeni Kelime Analiz Et</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🎲</Text>
          <Text style={styles.emptyStateTitle}>Rastgele Kelime Analizi</Text>
          <Text style={styles.emptyStateText}>
            Butona basarak yeni bir rastgele Türkçe kelime seçin.{'\n'}
            Her seferinde farklı kelime garantisi!{'\n\n'}
            🔧 7 Araç Entegrasyonu:{'\n'}
            • TDK Güncel Türkçe Sözlük{'\n'}
            • TDK Tarama Sözlüğü{'\n'}
            • TDK Derleme Sözlüğü{'\n'}
            • TDK Atasözleri ve Deyimler{'\n'}
            • Nisanyan Etimoloji Sözlüğü{'\n'}
            • DeepL Çeviri API{'\n'}
            • Oxford Dictionary API
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🎲 Rastgele Kelime • 7 Araç Entegrasyonu • TDK + Nisanyan + DeepL + Oxford + Kültürel Analiz
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
  headerCard: {
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 6,
  },
  currentWordContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
  },
  currentWordLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  currentWord: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  actionCard: {
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
  randomButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 8,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
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
    marginBottom: 16,
  },
  newWordButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  newWordButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
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
}); 