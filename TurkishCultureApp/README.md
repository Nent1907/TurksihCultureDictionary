# 🇹🇷 Turkish Culture Dictionary Mobile App

Turkish Culture Expert AI Agent'ını kullanan React Native Expo mobil uygulaması.

## 📱 Özellikler

- **Şık ve Modern UI**: Material Design ilkelerine uygun tasarım
- **Turkish Culture Expert Entegrasyonu**: Gerçek AI agent ile iletişim
- **Çoklu API Desteği**: TDK, Nisanyan, DeepL, Oxford Dictionary
- **Hızlı Başlangıç Butonları**: Yaygın kullanım senaryoları için
- **Gerçek Zamanlı Durum**: Agent bağlantı durumu göstergesi
- **Responsive Tasarım**: Tüm ekran boyutlarında uyumlu

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- Expo CLI
- Turkish Culture MCP Server (çalışır durumda)

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Turkish Culture MCP Server'ını başlatın:**
```bash
cd ../TurkishCulture-MCP
npm run dev
```

3. **Mobil uygulamayı başlatın:**
```bash
# Web'de çalıştır
npm run web

# Android'de çalıştır
npm run android

# iOS'ta çalıştır (macOS gerekli)
npm run ios
```

## 🎯 Kullanım

### Hızlı Başlangıç Butonları
- **📖 Kelime Analizi**: "çay kelimesini analiz et"
- **🌍 Çeviri**: "afiyet olsun ifadesini İngilizceye çevir"
- **🏛️ Etimoloji**: "misafir kelimesinin etimolojisi"
- **🎭 Kültür**: "Türk misafirperverlik geleneğini açıkla"

### Örnek Sorgular
```
çay kelimesini analiz et
nazar kelimesinin etimolojisi
misafirperverlik geleneğini açıkla
afiyet olsun ifadesini İngilizceye çevir
Türk kahve kültürü hakkında bilgi ver
```

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler
- **React Native**: Mobil uygulama framework'ü
- **Expo**: Development ve build platform'u
- **TypeScript**: Type safety için
- **Axios**: HTTP client
- **React Hooks**: State management

### API Entegrasyonu
- **Endpoint**: `http://localhost:3000/api/agents/Turkish Culture Expert/chat`
- **Method**: POST
- **Timeout**: 30 saniye
- **Error Handling**: Kapsamlı hata yönetimi

### Dosya Yapısı
```
TurkishCultureApp/
├── App.tsx                 # Ana uygulama komponenti
├── services/
│   └── TurkishCultureService.ts  # API servis katmanı
├── package.json
└── README.md
```

## 🎨 UI/UX Özellikleri

### Renk Paleti
- **Primary**: #1e3a8a (Koyu mavi)
- **Background**: #f8fafc (Açık gri)
- **Cards**: #ffffff (Beyaz)
- **Text**: #374151 (Koyu gri)
- **Success**: #10b981 (Yeşil)
- **Error**: #ef4444 (Kırmızı)

### Tasarım Prensipleri
- **Card-based Layout**: İçerik kartlar halinde organize
- **Shadow Effects**: Derinlik hissi için gölgeler
- **Rounded Corners**: Modern görünüm için yuvarlatılmış köşeler
- **Responsive Typography**: Farklı ekran boyutlarına uyumlu
- **Loading States**: Kullanıcı deneyimi için yükleme göstergeleri

## 🔗 Bağımlılıklar

### Ana Bağımlılıklar
```json
{
  "expo": "~52.0.0",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "axios": "^1.6.0"
}
```

### Dev Bağımlılıklar
```json
{
  "@types/react": "~18.3.0",
  "@types/react-native": "^0.73.0",
  "typescript": "^5.3.0"
}
```

## 🚨 Sorun Giderme

### Yaygın Sorunlar

1. **"Agent Çevrimdışı" Hatası**
   - Turkish Culture MCP Server'ının çalıştığından emin olun
   - `cd ../TurkishCulture-MCP && npm run dev`

2. **Network Error**
   - Localhost:3000 adresinin erişilebilir olduğunu kontrol edin
   - Firewall ayarlarını kontrol edin

3. **Build Hataları**
   - Node modules'ları temizleyin: `rm -rf node_modules && npm install`
   - Expo cache'ini temizleyin: `expo r -c`

## 📝 Geliştirme Notları

### Gelecek Özellikler
- [ ] Offline mode desteği
- [ ] Favori kelimeler listesi
- [ ] Sesli okuma özelliği
- [ ] Dark mode desteği
- [ ] Push notification'lar
- [ ] Kelime geçmişi

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- **TDK**: Resmi Türkçe sözlük verileri için
- **Nisanyan**: Etimoloji verileri için
- **DeepL**: Çeviri hizmetleri için
- **Oxford**: İngilizce sözlük verileri için 