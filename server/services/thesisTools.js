/**
 * Thesis Tools Service
 * Powers Thesis Assistant: Literature Review synthesizer,
 * Hypothesis refiner, and Local persistent thesis library.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatCitations } from './citationEngine.js';
import { translateTextToTurkish } from './translationEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_FILE = path.join(__dirname, '..', 'storage', 'thesisData.json');

// Ensure storage directory and file exist
export function initStorage() {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(STORAGE_FILE)) {
      const initial = {
        chapters: [
          { id: 'chap-1', name: 'Bölüm 1: Giriş ve Kuramsal Çerçeve', papers: [] },
          { id: 'chap-2', name: 'Bölüm 2: Literatür Taraması', papers: [] },
          { id: 'chap-3', name: 'Bölüm 3: Metodoloji ve Veri', papers: [] }
        ],
        savedPapers: [],
        notes: {},
        customUploads: []
      };
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(initial, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('[thesisTools] Failed to initialize storage:', err);
  }
}

export function getThesisData() {
  initStorage();
  try {
    const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      chapters: Array.isArray(parsed?.chapters) ? parsed.chapters : [],
      savedPapers: Array.isArray(parsed?.savedPapers) ? parsed.savedPapers : [],
      notes: (parsed?.notes && typeof parsed.notes === 'object') ? parsed.notes : {},
      customUploads: Array.isArray(parsed?.customUploads) ? parsed.customUploads : []
    };
  } catch (e) {
    console.error('Error reading thesisData:', e);
    return { chapters: [], savedPapers: [], notes: {}, customUploads: [] };
  }
}

export function saveThesisData(data) {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error saving thesisData:', e);
    return false;
  }
}

/**
 * Synthesizes selected papers into a structured Literature Review for thesis chapters
 */
export async function generateLiteratureReview({ papers = [], thesisTopic = '', language = 'tr' }) {
  const validPapers = (papers || []).filter(p => p && typeof p === 'object');
  if (validPapers.length === 0) {
    return {
      title: 'Literatür Taraması Taslağı',
      content: 'Henüz inceleme için makale seçilmedi. Lütfen en az 2-3 makale seçin.'
    };
  }

  const isTr = language === 'tr';
  const topicTitle = thesisTopic || (isTr ? 'İlgili Araştırma Alanı' : 'The Research Field');

  // Pre-translate takeaways to Turkish if needed
  if (isTr) {
    for (const p of validPapers) {
      if (!p.trTakeaway && (p.keyTakeaway || p.title)) {
        try {
          p.trTakeaway = await translateTextToTurkish(p.keyTakeaway || p.title);
        } catch {
          p.trTakeaway = p.keyTakeaway || p.title;
        }
      }
    }
  }

  // Format in-text citation
  const cite = (p) => {
    const rawAuthors = p.authors || [];
    let author = isTr ? 'Anonim' : 'Anonymous';
    if (rawAuthors.length > 0) {
      const a0 = rawAuthors[0];
      if (typeof a0 === 'string') {
        author = a0.trim().split(/\s+/).pop().replace(/[.,]$/, '');
      } else if (a0 && typeof a0 === 'object') {
        if (a0.lastName) author = a0.lastName;
        else if (a0.name) author = a0.name.trim().split(/\s+/).pop().replace(/[.,]$/, '');
      }
    }
    const etAl = rawAuthors.length > 1 ? (isTr ? ' ve ark.' : ' et al.') : '';
    return `(${author}${etAl}, ${p.year || '2023'})`;
  };

  // Group papers by study type safely
  const metaAnalyses = validPapers.filter(p => (p.studyType || '').includes('Meta') || (p.studyType || '').includes('Systematic'));
  const empiricalStudies = validPapers.filter(p => (p.studyType || '').includes('Trial') || (p.studyType || '').includes('Experimental') || (p.studyType || '').includes('Cohort'));
  const otherStudies = validPapers.filter(p => !metaAnalyses.includes(p) && !empiricalStudies.includes(p));

  const getTakeaway = (p) => {
    const raw = isTr 
      ? (p.trTakeaway || p.trTitle || p.keyTakeaway || p.title || 'klinik bulgular bildirilmiştir') 
      : (p.keyTakeaway || p.title || 'clinical findings reported');
    return raw.replace(/\.$/, '');
  };

  let doc = '';

  if (isTr) {
    doc += `# ${topicTitle.toUpperCase()}: LİTERATÜR TARAMASI VE KURAMSAL ÇERÇEVE\n\n`;
    
    doc += `## 1. Giriş ve Kuramsal Temeller\n`;
    doc += `Son yıllarda ${topicTitle.toLowerCase()} konusu, akademik yazında giderek artan bir ilgi odağı haline gelmiştir. Konuya ilişkin yürütülen ilk çalışmalar, temel değişkenler arasındaki etkileşimin doğrudan ve doğrusal olduğunu varsaymaktaydı. Ancak güncel bulgular, bu ilişkinin çok daha dinamik ve parametrik faktörlere bağlı olduğunu ortaya koymaktadır.\n\n`;
    
    doc += `## 2. Metodolojik Yaklaşımlar ve Temel Kanıtlar\n`;
    if (metaAnalyses.length > 0) {
      doc += `Literatürdeki yüksek kanıt düzeyine sahip sistematik derleme ve meta-analizler incelendiğinde; `;
      metaAnalyses.forEach(p => {
        doc += `${cite(p)} çalışmalarında, ${getTakeaway(p).toLowerCase()} sonucuna ulaşmıştır. `;
      });
      doc += `\n\n`;
    }

    if (empiricalStudies.length > 0) {
      doc += `Deneysel ve ampirik yöntemleri benimseyen çalışmalarda ise nedensellik bağı daha ayrıntılı test edilmiştir. Örneğin; `;
      empiricalStudies.forEach(p => {
        const sample = p.sampleSize ? ` (${p.sampleSize} katılımcı ile gerçekleştirilen)` : '';
        doc += `${cite(p)} tarafından yürütülen${sample} çalışmada, ${getTakeaway(p)} olduğu tespit edilmiştir. `;
      });
      doc += `\n\n`;
    }

    if (otherStudies.length > 0) {
      doc += `Gözlemsel ve betimsel araştırmalarda da benzer eğilimler desteklenmekle birlikte; `;
      otherStudies.forEach(p => {
        doc += `${cite(p)} bulguları, ${getTakeaway(p).toLowerCase()} yönündedir. `;
      });
      doc += `\n\n`;
    }

    doc += `## 3. Literatürdeki Çelişkiler ve Tartışmalı Noktalar\n`;
    doc += `Her ne kadar genel bir uzlaşı eğilimi gözlemlense de, çalışmaların örneklem profilleri, ölçüm araçları ve analiz modellerindeki çeşitlilik bazı çelişkili sonuçların ortaya çıkmasına zemin hazırlamaktadır. Özellikle dışsal değişkenlerin kontrol altında tutulamadığı durumlarda raporlanan etki büyüklüklerinin farklılık gösterdiği görülmektedir.\n\n`;

    doc += `## 4. Literatürdeki Boşluklar (Research Gap) ve Bu Tezin Özgün Değeri\n`;
    doc += `Mevcut literatür taramasında tespit edilen en belirgin eksiklik, söz konusu ilişkinin bağlamsal koşullarla birlikte bütüncül bir model dahilinde ele alınmamış olmasıdır. Bu tez çalışması; incelenen literatürün sunduğu teorik altyapıyı temel alarak, önceki araştırmalarda göz ardı edilen bu boşluğu doldurmayı ve alan yazına özgün bir katkı sunmayı amaçlamaktadır.\n\n`;

    doc += `## 5. Kaynakça (APA 7th Edition)\n`;
    papers.forEach(p => {
      const c = formatCitations(p);
      doc += `- ${c.apa}\n`;
    });

  } else {
    // English version
    doc += `# LITERATURE REVIEW: ${topicTitle.toUpperCase()}\n\n`;
    doc += `## 1. Introduction & Theoretical Foundations\n`;
    doc += `The academic discourse surrounding ${topicTitle.toLowerCase()} has evolved substantially in recent years. While early research suggested generalized correlations, contemporary studies have increasingly focused on underlying mechanisms and contextual moderators.\n\n`;
    
    doc += `## 2. Methodological Approaches and Key Findings\n`;
    papers.forEach(p => {
      const studyStr = (p.studyType || 'study').toLowerCase();
      doc += `According to ${cite(p)}, findings indicate that ${getTakeaway(p).toLowerCase()}. This ${studyStr} highlights critical implications for empirical inquiry.\n\n`;
    });

    doc += `## 3. Research Gaps & Positioning of Current Thesis\n`;
    doc += `A critical examination of the current literature reveals significant gaps regarding holistic model validation and contextual moderating variables. The primary objective of this thesis is to address these methodological and conceptual limitations.\n\n`;

    doc += `## 4. References\n`;
    papers.forEach(p => {
      const c = formatCitations(p);
      doc += `- ${c.apa}\n`;
    });
  }

  return {
    title: isTr ? `${topicTitle} - Literatür Taraması` : `Literature Review - ${topicTitle}`,
    content: doc,
    paperCount: papers.length
  };
}

/**
 * Refines a thesis topic into research questions & hypotheses
 */
export function refineThesisTopic(topic = '') {
  if (!topic || topic.trim().length === 0) {
    topic = 'Yapay zeka ve akademik üretkenlik';
  }

  const clean = topic.trim();

  return {
    originalTopic: clean,
    primaryQuestion: `${clean} bağlamında temel belirleyiciler ve etki mekanizmaları nelerdir?`,
    subQuestions: [
      `1. Literatürde ${clean} ile ilgili en sık raporlanan pozitif ve negatif çıktılar nelerdir?`,
      `2. Farklı alt gruplar veya uygulama alanları arasında anlamlı farklılıklar bulunmakta mıdır?`,
      `3. Bu ilişkiyi kuvvetlendiren veya zayıflatan temel moderatör/aracı değişkenler nelerdir?`,
      `4. Uygulama sürecinde karşılaşılan metodolojik ve pratik kısıtlar nelerdir?`
    ],
    hypotheses: [
      {
        code: 'H0',
        type: 'Sıfır Hipotezi (Null)',
        statement: `${clean} ile hedeflenen performans/çıktı değişkenleri arasında istatistiksel olarak anlamlı bir ilişki yoktur.`
      },
      {
        code: 'H1',
        type: 'Temel Araştırma Hipotezi (Alternative)',
        statement: `${clean}, hedeflenen çıktılar üzerinde istatistiksel olarak anlamlı ve pozitif bir etkiye sahiptir.`
      },
      {
        code: 'H2',
        type: 'Moderatör Hipotezi',
        statement: `Bireysel/kurumsal deneyim düzeyi, ${clean} ile nihai başarı arasındaki ilişkiye pozitif yönlü aracılık etmektedir.`
      }
    ],
    recommendedQueries: [
      `effects of ${clean} systematic review`,
      `${clean} randomized controlled trial empirical evidence`,
      `${clean} methodology and outcome evaluation`,
      `challenges and limitations in ${clean}`
    ],
    thesisChapterStructure: [
      'Giriş: Problem Durumu, Amaç, Önem ve Araştırma Soruları',
      'Kuramsal Çerçeve ve Kavramsal Tanımlar',
      'Kapsamlı Literatür Taraması ve Benzer Çalışmalar',
      'Araştırma Yöntemi, Evren-Örneklem ve Veri Toplama Araçları',
      'Bulgular ve Hipotez Testleri',
      'Tartışma, Sonuç ve Gelecek Araştırmalar İçin Öneriler'
    ]
  };
}
