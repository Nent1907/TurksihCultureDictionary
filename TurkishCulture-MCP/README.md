# Turkish Culture MCP & Agent

Bu proje, Türk kültürü ile ilgili kelime analizi, etimoloji, çeviri ve kültürel bağlam bilgileri sunan bir Mastra Agent ve MCP (Model Context Protocol) server'ı içerir.

## 🌟 Özellikler

### 🔍 Kelime Analizi
- Türkçe kelimelerin detaylı anlamı
- Etimolojik köken bilgisi
- Kültürel bağlam ve tarihsel önem
- Çoklu dil çevirileri
- İlgili kelimeler ve örnekler

### 🌍 Çeviri Hizmetleri
- Türkçe-İngilizce çeviri desteği
- Kültürel bağlamı koruyan çeviriler
- Kültürel notlar ve açıklamalar
- Alternatif çeviri önerileri

### 📚 Kültürel Bilgi
- Türk gelenekleri ve değerleri
- Tarihsel bağlam
- Modern kullanım örnekleri
- Bölgesel kültürel farklılıklar

### 🔧 MCP Tools
- `analyze_turkish_word`: Kapsamlı kelime analizi
- `translate_text`: Metin çevirisi
- `get_etymology`: Etimoloji bilgisi
- `get_cultural_context`: Kültürel bağlam
- `get_turkish_culture_info`: Genel kültür bilgisi

## 🚀 Kurulum

### Gereksinimler
- Node.js (v20.0+)
- npm veya pnpm
- Groq API anahtarı

### 1. Bağımlılıkları Yükleyin
```bash
npm install
# veya
pnpm install
```

### 2. Ortam Değişkenlerini Ayarlayın
`.env` dosyası oluşturun:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

## 🤖 Agent Kullanımı

Turkish Culture Agent'ı şu şekilde kullanabilirsiniz:

```typescript
import { turkishCultureAgent } from './src/mastra/agents/turkishCultureAgent';

// Kelime analizi
const response = await turkishCultureAgent.generate([
  { role: 'user', content: 'misafir kelimesini analiz et' }
]);

// Çeviri
const translation = await turkishCultureAgent.generate([
  { role: 'user', content: 'Translate "hoş geldiniz" to English with cultural context' }
]);
```

## 🔌 MCP Server

### MCP Server'ı Build Etme
```bash
npm run build:mcp
```

### MCP Server'ı Çalıştırma
```bash
node dist/stdio.js
```

### MCP Client ile Kullanım
```typescript
import { MCPClient } from '@mastra/mcp';

const mcp = new MCPClient({
  servers: {
    turkishCulture: {
      command: 'node',
      args: ['dist/stdio.js']
    }
  }
});

const tools = await mcp.getTools();
```

## 📖 API Referansı

### analyze_turkish_word
Türkçe kelimelerin detaylı analizini yapar.

**Parametreler:**
- `word` (string): Analiz edilecek Türkçe kelime
- `includeEtymology` (boolean, opsiyonel): Etimoloji bilgisi dahil edilsin mi
- `includeCulturalContext` (boolean, opsiyonel): Kültürel bağlam dahil edilsin mi

**Örnek:**
```typescript
const result = await analyzeTurkishWord({
  word: "çay",
  includeEtymology: true,
  includeCulturalContext: true
});
```

### translate_text
Metinleri Türkçe-İngilizce arasında çevirir.

**Parametreler:**
- `text` (string): Çevrilecek metin
- `sourceLang` ("tr" | "en"): Kaynak dil
- `targetLang` ("tr" | "en"): Hedef dil
- `preserveCulturalContext` (boolean, opsiyonel): Kültürel bağlam korunsun mu

### get_etymology
Türkçe kelimelerin etimolojik kökenini açıklar.

**Parametreler:**
- `word` (string): Etimolojisi araştırılacak kelime
- `includeRelatedLanguages` (boolean, opsiyonel): İlgili dillerdeki karşılıkları dahil edilsin mi

### get_cultural_context
Türk kültürü bağlamında kavramların kültürel önemini açıklar.

**Parametreler:**
- `concept` (string): Kültürel bağlamı araştırılacak kavram
- `includeRegionalVariations` (boolean, opsiyonel): Bölgesel farklılıklar dahil edilsin mi
- `includeHistoricalContext` (boolean, opsiyonel): Tarihsel bağlam dahil edilsin mi

### get_turkish_culture_info
Türk kültürü hakkında genel bilgiler sunar.

**Parametreler:**
- `topic` (enum): Bilgi alınacak kültürel konu
  - "gelenekler", "değerler", "aile_yapısı", "sosyal_ilişkiler", "yemek_kültürü", vb.
- `detailLevel` ("basic" | "detailed" | "comprehensive", opsiyonel): Detay seviyesi

## 🗂️ Proje Yapısı

```
TurkishCulture-MCP/
├── src/
│   └── mastra/
│       ├── agents/
│       │   └── turkishCultureAgent.ts    # Ana agent
│       ├── tools/
│       │   └── turkishCultureTools.ts    # MCP tools
│       ├── mcp/
│       │   └── turkishCultureMCP.ts      # MCP server
│       ├── stdio.ts                      # MCP stdio entry point
│       └── index.ts                      # Mastra konfigürasyonu
├── dist/                                 # Build çıktıları
├── package.json
└── README.md
```

## 🧪 Test Etme

### Agent'ı Test Etme
```bash
npm run dev
```
Tarayıcıda `http://localhost:4111` adresine gidin ve agent'ı test edin.

### MCP Server'ı Test Etme
```bash
# MCP server'ı build edin
npm run build:mcp

# Test edin
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/stdio.js
```

## 🚀 Deploy Etme

### NPM'e Yayınlama
```bash
# Build
npm run build:mcp

# Yayınla
npm publish --access public
```

### MCP Client'ta Kullanım
```typescript
const mcp = new MCPClient({
  servers: {
    turkishCulture: {
      command: 'npx',
      args: ['-y', 'turkishculture-mcp@latest']
    }
  }
});
```

## 📝 Örnek Kullanımlar

### Kelime Analizi
```
Kullanıcı: "misafir kelimesini analiz et"
Agent: [analyze_turkish_word tool'unu kullanarak detaylı analiz sunar]
```

### Kültürel Çeviri
```
Kullanıcı: "Translate 'afiyet olsun' to English"
Agent: [translate_text tool'unu kullanarak kültürel notlarla çeviri yapar]
```

### Etimoloji Araştırması
```
Kullanıcı: "çay kelimesinin etimolojisi nedir?"
Agent: [get_etymology tool'unu kullanarak tarihsel gelişimi açıklar]
```

### Kültürel Bağlam
```
Kullanıcı: "misafirperverlik geleneği hakkında bilgi ver"
Agent: [get_cultural_context tool'unu kullanarak detaylı açıklama yapar]
```

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje ISC lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- [Mastra.ai](https://mastra.ai) - AI agent framework
- [Groq](https://groq.com) - LLM API
- Türk kültürü ve dil uzmanları

## 📞 İletişim

Sorularınız için issue açabilir veya proje maintainer'ları ile iletişime geçebilirsiniz.

---

**Turkish Culture MCP & Agent** - Türk kültürünün dijital dünyada yaşatılması için geliştirilmiştir. 🇹🇷 