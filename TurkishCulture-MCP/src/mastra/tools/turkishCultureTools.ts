import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// TDK API entegrasyonu - Gerçek tdk-all-api paketi kullanarak
async function getTDKData(word: string) {
  try {
    console.log(`TDK API çağrısı başlatılıyor: ${word}`);
    const getWord = require('tdk-all-api');
    
    // Timeout ile API çağrısı
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TDK API timeout')), 10000)
    );
    
    const result = await Promise.race([
      getWord(word),
      timeoutPromise
    ]);
    
    console.log('TDK API başarılı:', result ? 'Veri alındı' : 'Veri yok');
    return result;
  } catch (error) {
    console.log('TDK API hatası:', error);
    // Fallback: Basit mock data döndür
    return {
      word: word,
      lisan: null,
      means: [{
        anlam: `"${word}" kelimesi için TDK API'ye ulaşılamadı. Lütfen daha sonra tekrar deneyin.`,
        orneklerListe: []
      }],
      compounds: [],
      proverbs: null,
      compilation: null,
      glossaryOfScienceAndArtTerms: null,
      westOpposite: null,
      guide: null,
      etymological: null
    };
  }
}

// TDK API'den detaylı veri çıkarma fonksiyonu
function processTDKData(tdkData: any) {
  if (!tdkData) return null;
  
  return {
    word: tdkData.word || null,
    language: tdkData.lisan || null,
    meanings: tdkData.means?.map((meaning: any) => ({
      definition: meaning.anlam,
      examples: meaning.orneklerListe || [],
      properties: meaning.ozelliklerListe || [],
      type: meaning.tur || null
    })) || [],
    compounds: tdkData.compounds || [],
    proverbs: tdkData.proverbs?.map((proverb: any) => ({
      text: proverb.madde,
      meaning: proverb.anlam
    })) || [],
    compilation: tdkData.compilation?.map((comp: any) => ({
      word: comp.madde,
      meaning: comp.anlam,
      region: comp.yer
    })) || [],
    scienceTerms: tdkData.glossaryOfScienceAndArtTerms?.map((term: any) => ({
      term: term.terim,
      definition: term.anlam,
      field: term.alan
    })) || [],
    westernOrigin: tdkData.westOpposite?.map((west: any) => ({
      word: west.madde,
      origin: west.kokeni,
      meaning: west.anlam
    })) || [],
    guide: tdkData.guide?.map((guide: any) => ({
      foreign: guide.yabanci,
      turkish: guide.turkce
    })) || [],
    etymological: tdkData.etymological?.map((etym: any) => ({
      word: etym.madde,
      origin: etym.kokeni,
      meaning: etym.anlam
    })) || []
  };
}

// Nisanyan CLI entegrasyonu (Python CLI kullanarak)
async function getNisanyanEtymologyWithCLI(word: string): Promise<string | null> {
  try {
    console.log(`Nisanyan CLI çağrısı: ${word}`);
    const { stdout, stderr } = await execAsync(`nis "${word}" --plain`, { timeout: 8000 });
    if (stderr) {
      console.log('Nisanyan CLI stderr:', stderr);
    }
    console.log('Nisanyan CLI başarılı');
    return stdout.trim() || null;
  } catch (error) {
    console.log('Nisanyan CLI hatası:', error);
    return `Nisanyan CLI'ye ulaşılamadı: ${word} kelimesi için etimoloji bilgisi şu anda mevcut değil.`;
  }
}

// Nisanyan Tree CLI entegrasyonu (Etimoloji ağacı için)
async function getNisanyanTreeWithCLI(word: string): Promise<string | null> {
  try {
    console.log(`Nisanyan Tree CLI çağrısı: ${word}`);
    const { stdout, stderr } = await execAsync(`nis "${word}" --tree --plain`, { timeout: 8000 });
    if (stderr) {
      console.log('Nisanyan Tree CLI stderr:', stderr);
    }
    console.log('Nisanyan Tree CLI başarılı');
    return stdout.trim() || null;
  } catch (error) {
    console.log('Nisanyan Tree CLI hatası:', error);
    return `Nisanyan etimoloji ağacı şu anda mevcut değil: ${word}`;
  }
}

// Nisanyan Web API entegrasyonu (doğrudan API çağrısı)
async function getNisanyanEtymologyAPI(word: string): Promise<any> {
  try {
    console.log(`Nisanyan Web API çağrısı: ${word}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`https://www.nisanyansozluk.com/api/words/${encodeURIComponent(word)}?session=1`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Nisanyan Web API başarılı');
      return data;
    }
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.log('Nisanyan Web API hatası:', error);
    return {
      isUnsuccessful: true,
      error: `Nisanyan Web API'ye ulaşılamadı: ${word}`,
      words: []
    };
  }
}

// Nisanyan Yer Adları API entegrasyonu
async function getNisanyanPlace(place: string) {
  try {
    const nisanyanmap = require('nisanyanmap');
    const result = await nisanyanmap.get(place, { verbose: true });
    return result;
  } catch (error) {
    console.log('Nisanyan Map API error:', error);
    return null;
  }
}

// DeepL API çeviri fonksiyonu
async function translateWithDeepL(text: string, sourceLang: string, targetLang: string) {
  const DEEPL_API_KEY = process.env.DEEPL_API_KEY || "5068c5dc-7c77-4b9c-80ad-069011001cf0:fx";
  
  try {
    console.log(`DeepL API çağrısı: ${sourceLang} -> ${targetLang}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'text': text,
        'source_lang': sourceLang.toUpperCase(),
        'target_lang': targetLang.toUpperCase(),
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      console.log('DeepL API başarılı');
      return data.translations[0]?.text || text;
    }
    throw new Error(`DeepL HTTP ${response.status}`);
  } catch (error) {
    console.log('DeepL API hatası, fallback kullanılıyor:', error);
    return null; // Fallback'e geç
  }
}

// Oxford API kelime analizi fonksiyonu
async function getOxfordDefinition(word: string): Promise<string[] | null> {
  const OXFORD_APP_ID = process.env.OXFORD_APP_ID || "54074b30";
  const OXFORD_API_KEY = process.env.OXFORD_API_KEY || "d20d9306cbd5d7abd170f2901b9f42bc";
  const OXFORD_BASE_URL = process.env.OXFORD_BASE_URL || "https://od-api-sandbox.oxforddictionaries.com/api/v2";
  
  try {
    const response = await fetch(`${OXFORD_BASE_URL}/entries/en-gb/${word.toLowerCase()}`, {
      headers: {
        'app_id': OXFORD_APP_ID,
        'app_key': OXFORD_API_KEY,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const lexicalEntries = data.results[0]?.lexicalEntries || [];
      const definitions: string[] = [];
      
      for (const entry of lexicalEntries) {
        const senses = entry.entries[0]?.senses || [];
        for (const sense of senses) {
          if (sense.definitions) {
            definitions.push(...sense.definitions);
          }
        }
      }
      
      return definitions.length > 0 ? definitions : null;
    }
  } catch (error) {
    console.log('Oxford API error, using fallback definitions');
  }
  
  return null;
}

// Turkish word analysis tool - TDK ve Nisanyan entegrasyonu ile
export const analyzeTurkishWordTool = createTool({
  id: "analyze_turkish_word",
  description: "Türkçe kelimelerin detaylı analizini yapar - TDK resmi veritabanı ve Nisanyan etimoloji sözlüğü entegrasyonu ile zenginleştirilmiş profesyonel analiz.",
  inputSchema: z.object({
    word: z.string().describe("Analiz edilecek Türkçe kelime"),
    includeEtymology: z.boolean().optional().describe("Etimoloji bilgisi dahil edilsin mi (varsayılan: true)"),
    includeCulturalContext: z.boolean().optional().describe("Kültürel bağlam dahil edilsin mi (varsayılan: true)")
  }),
  outputSchema: z.object({
    word: z.string(),
    tdkData: z.object({
      word: z.string().optional(),
      language: z.string().optional(),
      meanings: z.array(z.object({
        definition: z.string(),
        examples: z.array(z.any()),
        properties: z.array(z.any()),
        type: z.string().optional()
      })).optional(),
      compounds: z.array(z.string()).optional(),
      proverbs: z.array(z.object({
        text: z.string(),
        meaning: z.string()
      })).optional(),
      compilation: z.array(z.object({
        word: z.string(),
        meaning: z.string(),
        region: z.string()
      })).optional(),
      scienceTerms: z.array(z.object({
        term: z.string(),
        definition: z.string(),
        field: z.string()
      })).optional(),
      westernOrigin: z.array(z.object({
        word: z.string(),
        origin: z.string(),
        meaning: z.string()
      })).optional(),
      guide: z.array(z.object({
        foreign: z.string(),
        turkish: z.string()
      })).optional(),
      etymological: z.array(z.object({
        word: z.string(),
        origin: z.string(),
        meaning: z.string()
      })).optional()
    }).optional(),
    nisanyanData: z.object({
      cliOutput: z.string().optional(),
      apiData: z.any().optional(),
      etymologyTree: z.string().optional()
    }).optional(),
    oxfordDefinitions: z.array(z.string()).optional(),
    culturalContext: z.object({
      significance: z.string(),
      traditionalUsage: z.string(),
      modernUsage: z.string(),
      regionalVariations: z.array(z.string()).optional()
    }).optional(),
    examples: z.array(z.object({
      sentence: z.string(),
      translation: z.string(),
      context: z.string()
    })),
    relatedConcepts: z.array(z.string()),
    dataSource: z.string()
  }),
  execute: async ({ context: { word, includeEtymology = true, includeCulturalContext = true } }) => {
    console.log(`Analyzing Turkish word with real APIs: ${word}`);
    
    // TDK API'den resmi veri al
    const tdkData = await getTDKData(word);
    
    // Nisanyan verilerini al (hem CLI hem API)
    let nisanyanData: any = {};
    if (includeEtymology) {
      const [cliOutput, apiData, etymologyTree] = await Promise.all([
        getNisanyanEtymologyWithCLI(word),
        getNisanyanEtymologyAPI(word),
        getNisanyanTreeWithCLI(word)
      ]);
      
      nisanyanData = {
        cliOutput,
        apiData,
        etymologyTree
      };
    }
    
    // Oxford API'den İngilizce karşılığını al
    const englishTranslation = await translateWithDeepL(word, "tr", "en");
    let oxfordDefinitions: string[] | null = null;
    
    if (englishTranslation) {
      oxfordDefinitions = await getOxfordDefinition(englishTranslation);
    }
    
    // Yerel kültürel bağlam veritabanı (TDK'dan gelen veriyi tamamlayıcı)
    const culturalContextDatabase: Record<string, any> = {
      "misafir": {
        significance: "Türk kültüründe misafirperverlik en önemli değerlerden biridir. 'Misafir Allah'ın emaneti' anlayışı yaygındır.",
        traditionalUsage: "Geleneksel Türk evlerinde misafir odası ayrılır, en iyi yemekler misafire ikram edilir",
        modernUsage: "Modern yaşamda da misafir ağırlama geleneği devam eder, apartman dairelerinde bile önemlidir",
        regionalVariations: ["Anadolu'da 'konuk'", "Doğu'da 'mehman'"]
      },
      "çay": {
        significance: "Türk sosyal yaşamının merkezi, dostluk ve sohbetin simgesi. Günde ortalama 3-5 bardak çay içilir.",
        traditionalUsage: "İnce belli bardaklarda servis edilir, şekerle içilir, çay ocağının sürekli yanık tutulması geleneği",
        modernUsage: "Günde ortalama 3-5 bardak çay içilir, her fırsatta ikram edilir, ofislerde çay molası geleneği",
        regionalVariations: ["Doğu'da samovar çayı", "Rize'de yerel çay üretimi"]
      },
      "nazar": {
        significance: "Türk halk inançlarının önemli parçası, koruyucu amaçlı kullanılır. Özellikle bebek ve çocuklar için önemli.",
        traditionalUsage: "Mavi boncuklar, nazarlıklar koruma amaçlı takılır, evlerin girişine asılır",
        modernUsage: "Hala yaygın olarak kullanılır, bebeklere ve değerli eşyalara takılır, modern takılarda da görülür",
        regionalVariations: ["Anadolu'da mavi boncuk", "Kapadokya'da özel nazarlık sanatı"]
      }
    };

    // TDK verisini işle
    const processedTDKData = processTDKData(tdkData);

    // Kültürel bağlam
    const culturalContext = includeCulturalContext ? culturalContextDatabase[word.toLowerCase()] : undefined;

    // Örnek cümleler (TDK'dan gelen örnekleri kullan, yoksa varsayılan)
    let examples = [];
    if (processedTDKData && processedTDKData.meanings?.[0]?.examples?.length > 0) {
      examples = processedTDKData.meanings[0].examples.map((example: any) => ({
        sentence: example.ornek || example,
        translation: `Example: ${example.ornek || example}`,
        context: "TDK örnek cümle"
      }));
    }

    // İlgili kavramlar
    let relatedConcepts = [];
    if (processedTDKData?.compounds) {
      relatedConcepts = processedTDKData.compounds.slice(0, 5);
    }

    // Veri kaynağı bilgisi
    let dataSource = "Yerel veritabanı";
    if (tdkData) dataSource = "TDK Resmi API (7 Sözlük)";
    if (nisanyanData.cliOutput || nisanyanData.apiData) dataSource += " + Nisanyan Etimoloji";
    if (oxfordDefinitions) dataSource += " + Oxford Dictionary";

    return {
      word,
      tdkData: processedTDKData || undefined,
      nisanyanData: Object.keys(nisanyanData).length > 0 ? nisanyanData : undefined,
      oxfordDefinitions: oxfordDefinitions || undefined,
      culturalContext,
      examples,
      relatedConcepts,
      dataSource
    };
  }
});

// Text translation tool - DeepL entegrasyonu ile
export const translateTextTool = createTool({
  id: "translate_text",
  description: "Metinleri Türkçe-İngilizce arasında çevirir. DeepL API entegrasyonu ile yüksek kaliteli çeviri sunar ve kültürel bağlamı korur.",
  inputSchema: z.object({
    text: z.string().describe("Çevrilecek metin"),
    sourceLang: z.enum(["tr", "en"]).describe("Kaynak dil (tr: Türkçe, en: İngilizce)"),
    targetLang: z.enum(["tr", "en"]).describe("Hedef dil (tr: Türkçe, en: İngilizce)"),
    preserveCulturalContext: z.boolean().optional().describe("Kültürel bağlam korunsun mu (varsayılan: true)")
  }),
  outputSchema: z.object({
    originalText: z.string(),
    translatedText: z.string(),
    sourceLang: z.string(),
    targetLang: z.string(),
    translationSource: z.string(),
    culturalNotes: z.array(z.string()).optional(),
    alternativeTranslations: z.array(z.string()).optional()
  }),
  execute: async ({ context: { text, sourceLang, targetLang, preserveCulturalContext = true } }) => {
    console.log(`Translating from ${sourceLang} to ${targetLang}: ${text}`);
    
    // Önce DeepL API'yi dene
    let translatedText = await translateWithDeepL(text, sourceLang, targetLang);
    let translationSource = "DeepL API";
    
    // DeepL başarısız olursa fallback çeviri sistemi
    if (!translatedText) {
      translationSource = "Fallback Dictionary";
      
      const translations: Record<string, Record<string, string>> = {
        "tr-en": {
          "merhaba": "hello",
          "çay": "tea",
          "misafir": "guest",
          "nazar": "evil eye",
          "hoş geldiniz": "welcome",
          "afiyet olsun": "bon appétit / enjoy your meal",
          "maşallah": "mashallah (expression of appreciation)",
          "inşallah": "god willing",
          "hayırlı olsun": "may it be blessed",
          "teşekkür ederim": "thank you",
          "günaydın": "good morning",
          "iyi akşamlar": "good evening",
          "nasılsınız": "how are you",
          "görüşürüz": "see you later"
        },
        "en-tr": {
          "hello": "merhaba",
          "tea": "çay",
          "guest": "misafir",
          "evil eye": "nazar",
          "welcome": "hoş geldiniz",
          "thank you": "teşekkür ederim",
          "please": "lütfen",
          "excuse me": "affedersiniz",
          "good morning": "günaydın",
          "good evening": "iyi akşamlar",
          "how are you": "nasılsınız",
          "see you later": "görüşürüz"
        }
      };

      const translationKey = `${sourceLang}-${targetLang}`;
      const translationDict = translations[translationKey] || {};
      
      translatedText = text.toLowerCase();
      
      // Kelime kelime çeviri
      for (const [original, translated] of Object.entries(translationDict)) {
        if (translatedText.includes(original.toLowerCase())) {
          translatedText = translatedText.replace(new RegExp(original.toLowerCase(), 'g'), translated);
        }
      }
      
      // Eğer çeviri bulunamadıysa
      if (translatedText === text.toLowerCase()) {
        translatedText = `[Çeviri bulunamadı: ${text}]`;
      }
    }
    
    // Kültürel notlar
    let culturalNotes: string[] = [];
    if (preserveCulturalContext) {
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("afiyet olsun")) {
        culturalNotes.push("'Afiyet olsun' is said before or after meals, similar to 'bon appétit' but also used after eating to wish good health");
      }
      if (lowerText.includes("maşallah")) {
        culturalNotes.push("'Maşallah' is used to express appreciation and protect from evil eye, showing admiration without envy");
      }
      if (lowerText.includes("misafir")) {
        culturalNotes.push("In Turkish culture, guests are considered sacred and hospitality is extremely important - 'guest is God's trust'");
      }
      if (lowerText.includes("çay")) {
        culturalNotes.push("Tea is central to Turkish social life, offered to guests and consumed throughout the day as a social bonding activity");
      }
      if (lowerText.includes("nazar")) {
        culturalNotes.push("Evil eye belief is deeply rooted in Turkish culture, with blue beads used as protection against negative energy");
      }
    }

    return {
      originalText: text,
      translatedText,
      sourceLang,
      targetLang,
      translationSource,
      culturalNotes: preserveCulturalContext ? culturalNotes : undefined,
      alternativeTranslations: undefined
    };
  }
});

// Etymology tool - Nisanyan ve TDK entegrasyonu ile
export const getEtymologyTool = createTool({
  id: "get_etymology",
  description: "Türkçe kelimelerin etimolojik kökenini ve tarihsel gelişimini detaylı olarak açıklar. Nisanyan Etimoloji Sözlüğü CLI ve TDK verilerini kullanır.",
  inputSchema: z.object({
    word: z.string().describe("Etimolojisi araştırılacak kelime"),
    includeRelatedLanguages: z.boolean().optional().describe("İlgili dillerdeki karşılıkları dahil edilsin mi"),
    showEtymologyTree: z.boolean().optional().describe("Etimoloji ağacı gösterilsin mi (varsayılan: true)")
  }),
  outputSchema: z.object({
    word: z.string(),
    nisanyanCLI: z.string().optional(),
    nisanyanTree: z.string().optional(),
    nisanyanAPI: z.any().optional(),
    tdkEtymology: z.string().optional(),
    etymology: z.object({
      origin: z.string(),
      originalMeaning: z.string(),
      languageFamily: z.string(),
      historicalPath: z.array(z.string()),
      firstKnownUse: z.string().optional(),
      relatedLanguages: z.record(z.string()).optional()
    }),
    linguisticAnalysis: z.object({
      morphology: z.string(),
      phoneticalChanges: z.array(z.string()),
      semanticEvolution: z.string()
    }),
    dataSource: z.string()
  }),
  execute: async ({ context: { word, includeRelatedLanguages = false, showEtymologyTree = true } }) => {
    console.log(`Getting etymology for: ${word}`);
    
    // Nisanyan CLI'den etimoloji al
    const nisanyanCLI = await getNisanyanEtymologyWithCLI(word);
    
    // Nisanyan Tree CLI'den etimoloji ağacı al
    let nisanyanTree: string | null = null;
    if (showEtymologyTree) {
      nisanyanTree = await getNisanyanTreeWithCLI(word);
    }
    
    // Nisanyan Web API'den detaylı veri al
    const nisanyanAPI = await getNisanyanEtymologyAPI(word);
    
    // TDK'dan etimoloji al
    const tdkData = await getTDKData(word);
    const tdkEtymology = tdkData?.etymological || null;
    
    // Yerel etimoloji veritabanı (API verilerini tamamlayıcı)
    const etymologyDatabase: Record<string, any> = {
      "çay": {
        etymology: {
          origin: "Çince 'cha' (茶)",
          originalMeaning: "Çay yaprağı, çay bitkisi",
          languageFamily: "Sino-Tibetan > Chinese",
          historicalPath: [
            "Çince 'cha' (茶)",
            "Türkçe 'çay' (19. yüzyıl)",
            "Rusça 'chai' etkisi",
            "Modern Türkçe kullanım"
          ],
          firstKnownUse: "19. yüzyıl ortaları",
          relatedLanguages: includeRelatedLanguages ? {
            "Chinese": "茶 (cha)",
            "Russian": "чай (chai)",
            "Persian": "چای (chai)",
            "Arabic": "شاي (shai)"
          } : undefined
        },
        linguisticAnalysis: {
          morphology: "Tek heceli, basit kök",
          phoneticalChanges: ["cha > çay (Türkçe ses uyumu)"],
          semanticEvolution: "Bitki adından içecek adına, sonra kültürel kavrama dönüşüm"
        }
      },
      "misafir": {
        etymology: {
          origin: "Arapça 'musafir' (مسافر)",
          originalMeaning: "Yolcu, seyahat eden kişi",
          languageFamily: "Semitic > Arabic",
          historicalPath: [
            "Arapça 'musafir' (مسافر) - yolcu",
            "Osmanlı Türkçesi 'misafir'",
            "Modern Türkçe 'misafir' - konuk"
          ],
          firstKnownUse: "Osmanlı dönemi",
          relatedLanguages: includeRelatedLanguages ? {
            "Arabic": "مسافر (musafir)",
            "Persian": "مسافر (musafer)",
            "Urdu": "مسافر (musafir)"
          } : undefined
        },
        linguisticAnalysis: {
          morphology: "mi-sa-fir (üç heceli)",
          phoneticalChanges: ["musafir > misafir (ünlü uyumu)"],
          semanticEvolution: "Yolcu anlamından konuk anlamına semantik genişleme"
        }
      }
    };

    const wordData = etymologyDatabase[word.toLowerCase()];
    
    // Veri kaynağı bilgisi
    let dataSource = "Yerel etimoloji veritabanı";
    if (nisanyanCLI || nisanyanAPI) dataSource = "Nisanyan Etimoloji Sözlüğü (CLI + API)";
    if (tdkEtymology) dataSource += " + TDK";
    
    // Nisanyan API'den etimoloji bilgisi çıkar
    let extractedEtymology: any = null;
    if (nisanyanAPI && !nisanyanAPI.isUnsuccessful && nisanyanAPI.words?.length > 0) {
      const firstWord = nisanyanAPI.words[0];
      if (firstWord.etymology) {
        extractedEtymology = {
          origin: firstWord.etymology.origin || "Nisanyan API'den alınmış",
          originalMeaning: firstWord.etymology.meaning || "API verilerinde mevcut",
          languageFamily: firstWord.etymology.languageFamily || "API verilerinden belirtilmiş",
          historicalPath: firstWord.etymology.path || ["API verilerinden alınmış"],
          firstKnownUse: firstWord.etymology.firstUse,
          relatedLanguages: includeRelatedLanguages ? (firstWord.etymology.relatedLanguages || {}) : undefined
        };
      }
    }
    
    if (!wordData && !nisanyanCLI && !tdkEtymology && !nisanyanAPI) {
      return {
        word,
        nisanyanCLI: undefined,
        nisanyanTree: undefined,
        nisanyanAPI: undefined,
        tdkEtymology: undefined,
        etymology: {
          origin: "Etimoloji bilgisi mevcut değil",
          originalMeaning: "Araştırılmalı",
          languageFamily: "Bilinmiyor",
          historicalPath: ["Tarihsel gelişim araştırılmalı"],
          relatedLanguages: includeRelatedLanguages ? {} : undefined
        },
        linguisticAnalysis: {
          morphology: "Analiz edilmeli",
          phoneticalChanges: [],
          semanticEvolution: "Araştırılmalı"
        },
        dataSource: "Veri bulunamadı"
      };
    }

    return {
      word,
      nisanyanCLI: nisanyanCLI || undefined,
      nisanyanTree: nisanyanTree || undefined,
      nisanyanAPI: nisanyanAPI || undefined,
      tdkEtymology: tdkEtymology || undefined,
      etymology: extractedEtymology || wordData?.etymology || {
        origin: nisanyanCLI ? "Nisanyan CLI'den alınmış" : "API verilerinden alınan veri",
        originalMeaning: "API verilerinde mevcut",
        languageFamily: "API verilerinden belirtilmiş",
        historicalPath: ["API verilerinden alınmış"],
        relatedLanguages: includeRelatedLanguages ? {} : undefined
      },
      linguisticAnalysis: wordData?.linguisticAnalysis || {
        morphology: "API verilerinden analiz edilebilir",
        phoneticalChanges: [],
        semanticEvolution: "API verilerinden çıkarılabilir"
      },
      dataSource
    };
  }
});

// Cultural context tool
export const getCulturalContextTool = createTool({
  id: "get_cultural_context",
  description: "Türk kültürü bağlamında kelimelerin, kavramların ve geleneklerin kültürel önemini açıklar",
  inputSchema: z.object({
    concept: z.string().describe("Kültürel bağlamı araştırılacak kavram"),
    includeRegionalVariations: z.boolean().optional().describe("Bölgesel farklılıklar dahil edilsin mi"),
    includeHistoricalContext: z.boolean().optional().describe("Tarihsel bağlam dahil edilsin mi")
  }),
  outputSchema: z.object({
    concept: z.string(),
    culturalSignificance: z.string(),
    traditionalPractices: z.array(z.string()),
    modernAdaptations: z.array(z.string()),
    socialImportance: z.string(),
    regionalVariations: z.array(z.object({
      region: z.string(),
      variation: z.string(),
      description: z.string()
    })).optional(),
    historicalContext: z.object({
      origins: z.string(),
      evolution: z.string(),
      keyPeriods: z.array(z.string())
    }).optional(),
    relatedTraditions: z.array(z.string())
  }),
  execute: async ({ context: { concept, includeRegionalVariations = false, includeHistoricalContext = false } }) => {
    console.log(`Getting cultural context for: ${concept}`);
    
    const culturalDatabase: Record<string, any> = {
      "misafirperverlik": {
        culturalSignificance: "Türk kültürünün en temel değerlerinden biri, konuğa gösterilen saygı ve özenin ifadesi",
        traditionalPractices: [
          "Misafir geldiğinde ayakkabılarını çıkarması",
          "En iyi yemeklerin misafire ikram edilmesi",
          "Misafir odası hazırlanması",
          "Çay ve kahve ikramı",
          "Misafiri uğurlarken hediye verilmesi"
        ],
        modernAdaptations: [
          "Apartman dairelerinde misafir ağırlama",
          "Restoranlarda hesabı ödeme yarışı",
          "Sosyal medyada misafir paylaşımları",
          "Modern ev dekorasyonunda misafir alanları"
        ],
        socialImportance: "Toplumsal statü ve saygınlığın göstergesi, aile onurunun parçası",
        regionalVariations: includeRegionalVariations ? [
          {
            region: "Doğu Anadolu",
            variation: "Daha geleneksel ve resmi protokoller",
            description: "Misafir ağırlama daha uzun sürer, daha çok ritüel içerir"
          },
          {
            region: "Ege Bölgesi",
            variation: "Daha rahat ve samimi yaklaşım",
            description: "Misafir ağırlama daha sıcak ve dostane"
          }
        ] : undefined,
        historicalContext: includeHistoricalContext ? {
          origins: "Göçebe Türk kültüründen gelen gelenek",
          evolution: "İslam kültürü ile birleşerek güçlenmiş",
          keyPeriods: ["Göçebe dönem", "İslamiyet kabulü", "Osmanlı dönemi", "Cumhuriyet dönemi"]
        } : undefined,
        relatedTraditions: ["ikram", "hediyeleşme", "komşuluk", "akrabalık"]
      },
      "çay kültürü": {
        culturalSignificance: "Türk sosyal yaşamının merkezi, dostluk ve sohbetin vazgeçilmez parçası",
        traditionalPractices: [
          "İnce belli bardaklarda servis",
          "Şekerle birlikte içilmesi",
          "Çay ocağının sürekli yanık tutulması",
          "Misafire ilk ikram çay olması",
          "Çay bahçelerinde sosyalleşme"
        ],
        modernAdaptations: [
          "Ofislerde çay molası geleneği",
          "Çay bardağı tasarımlarının modernleşmesi",
          "Çay markalarının çeşitlenmesi",
          "Çay evlerinin kafelere dönüşümü"
        ],
        socialImportance: "Sosyal bağların güçlendirilmesi, iş görüşmelerinin başlatılması",
        regionalVariations: includeRegionalVariations ? [
          {
            region: "Rize",
            variation: "Yerel çay üretimi ve tüketimi",
            description: "Çay tarımının merkezi, özel çay kültürü"
          },
          {
            region: "Doğu",
            variation: "Samovar çayı geleneği",
            description: "Rus etkisi ile samovar kullanımı"
          }
        ] : undefined,
        historicalContext: includeHistoricalContext ? {
          origins: "19. yüzyılda Çin'den gelen içecek",
          evolution: "Kısa sürede Türk kültürünün parçası oldu",
          keyPeriods: ["19. yüzyıl girişi", "Cumhuriyet dönemi yaygınlaşma", "Modern dönem endüstrileşme"]
        } : undefined,
        relatedTraditions: ["sohbet", "misafirperverlik", "çay bahçeleri", "çay saati"]
      }
    };

    const conceptData = culturalDatabase[concept.toLowerCase()];
    
    if (!conceptData) {
      return {
        concept,
        culturalSignificance: "Bu kavramın kültürel önemi araştırılmalı",
        traditionalPractices: [],
        modernAdaptations: [],
        socialImportance: "Sosyal önemi belirlenmelidir",
        regionalVariations: includeRegionalVariations ? [] : undefined,
        historicalContext: includeHistoricalContext ? {
          origins: "Köken araştırılmalı",
          evolution: "Gelişim süreci incelenmeli",
          keyPeriods: []
        } : undefined,
        relatedTraditions: []
      };
    }

    return conceptData;
  }
});

// General Turkish culture info tool
export const getTurkishCultureInfoTool = createTool({
  id: "get_turkish_culture_info",
  description: "Türk kültürü hakkında genel bilgiler, gelenekler, değerler ve modern yaşamdaki yansımaları",
  inputSchema: z.object({
    topic: z.enum([
      "gelenekler",
      "değerler", 
      "aile_yapısı",
      "sosyal_ilişkiler",
      "yemek_kültürü",
      "müzik_dans",
      "sanat_edebiyat",
      "din_inanç",
      "eğitim",
      "iş_yaşamı"
    ]).describe("Bilgi alınacak kültürel konu"),
    detailLevel: z.enum(["basic", "detailed", "comprehensive"]).optional().describe("Detay seviyesi")
  }),
  outputSchema: z.object({
    topic: z.string(),
    overview: z.string(),
    keyElements: z.array(z.string()),
    traditionalAspects: z.array(z.string()),
    modernAdaptations: z.array(z.string()),
    culturalValues: z.array(z.string()),
    examples: z.array(z.object({
      title: z.string(),
      description: z.string(),
      significance: z.string()
    })),
    relatedTopics: z.array(z.string())
  }),
  execute: async ({ context: { topic, detailLevel = "basic" } }) => {
    console.log(`Getting Turkish culture info for topic: ${topic}`);
    
    const cultureDatabase: Record<string, any> = {
      "gelenekler": {
        overview: "Türk gelenekleri, binlerce yıllık tarihten gelen zengin bir kültürel mirasın ürünüdür",
        keyElements: [
          "Misafirperverlik",
          "Saygı ve hürmet",
          "Aile bağları",
          "Bayramlar ve özel günler",
          "Geçiş törenleri"
        ],
        traditionalAspects: [
          "Büyüklere saygı gösterme",
          "El öpme geleneği",
          "Bayram ziyaretleri",
          "Düğün gelenekleri",
          "Cenaze törenleri"
        ],
        modernAdaptations: [
          "Sosyal medyada bayram kutlamaları",
          "Modern düğün organizasyonları",
          "Şehirli yaşamda gelenek adaptasyonu",
          "Teknoloji ile gelenek birleşimi"
        ],
        culturalValues: [
          "Aile birliği",
          "Toplumsal dayanışma",
          "Misafirperverlik",
          "Saygı",
          "Yardımlaşma"
        ],
        examples: [
          {
            title: "Bayram Ziyaretleri",
            description: "Dini bayramlarda büyükleri ziyaret etme geleneği",
            significance: "Aile bağlarını güçlendirir ve kuşaklar arası iletişimi sağlar"
          },
          {
            title: "El Öpme",
            description: "Büyüklerin elini öpüp alnına götürme",
            significance: "Saygı ve hürmetin fiziksel ifadesi"
          }
        ],
        relatedTopics: ["değerler", "aile_yapısı", "sosyal_ilişkiler", "din_inanç"]
      },
      "yemek_kültürü": {
        overview: "Türk mutfağı, Orta Asya'dan Anadolu'ya uzanan zengin bir kuliner geleneğin ürünüdür",
        keyElements: [
          "Çeşitlilik ve zenginlik",
          "Mevsimsel yemekler",
          "Bölgesel özellikler",
          "Sosyal yemek kültürü",
          "Misafir ikramı"
        ],
        traditionalAspects: [
          "Tandır ve ocak başı pişirme",
          "Kış hazırlıkları (turşu, reçel)",
          "Bayram yemekleri",
          "Düğün yemekleri",
          "Geleneksel tarifler"
        ],
        modernAdaptations: [
          "Restoran kültürü",
          "Fast food adaptasyonları",
          "Modern mutfak aletleri",
          "Televizyon yemek programları",
          "Sosyal medyada yemek paylaşımı"
        ],
        culturalValues: [
          "Paylaşma",
          "Bereket",
          "Misafirperverlik",
          "Aile birliği",
          "Geleneklere bağlılık"
        ],
        examples: [
          {
            title: "Çay Saati",
            description: "Günün her saatinde çay içme geleneği",
            significance: "Sosyal bağları güçlendirir, dinlenme ve sohbet fırsatı"
          },
          {
            title: "Ramazan İftarları",
            description: "Ramazan ayında toplu iftar yemekleri",
            significance: "Toplumsal dayanışma ve paylaşımın ifadesi"
          }
        ],
        relatedTopics: ["gelenekler", "sosyal_ilişkiler", "din_inanç", "aile_yapısı"]
      }
    };

    const topicData = cultureDatabase[topic];
    
    if (!topicData) {
      return {
        topic,
        overview: `${topic} konusu hakkında detaylı bilgi henüz mevcut değil`,
        keyElements: [],
        traditionalAspects: [],
        modernAdaptations: [],
        culturalValues: [],
        examples: [],
        relatedTopics: []
      };
    }

    // Detay seviyesine göre bilgi filtreleme
    if (detailLevel === "basic") {
      return {
        ...topicData,
        examples: topicData.examples.slice(0, 2)
      };
    }

    return topicData;
  }
}); 