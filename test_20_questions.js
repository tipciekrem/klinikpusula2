import { optimizeAcademicQuery } from './server/services/queryOptimizer.js';
import { searchOpenAlex } from './server/services/academicSearch.js';
import { calculateConsensusMeter, generateSynthesis } from './server/services/consensusEngine.js';
import { isEnglishText } from './server/services/translationEngine.js';

const TEST_QUESTIONS = [
  { id: 1, query: 'ACE inhibitörleri kuru öksürüğe neden olur mu?', expectedTopic: 'ace inhibitor dry cough bradykinin' },
  { id: 2, query: 'Statinler kas ağrısı ve rabdomiyoliz riskini artırır mı?', expectedTopic: 'statin myopathy rhabdomyolysis muscle pain' },
  { id: 3, query: 'SGLT2 inhibitörleri ejeksiyon fraksiyonu korunmuş kalp yetersizliğinde sağkalımı artırır mı?', expectedTopic: 'sglt2 inhibitor heart failure preserved ejection fraction' },
  { id: 4, query: 'Romatoid artritte metotreksat ilk basamak tedavi olarak ne kadar etkilidir?', expectedTopic: 'rheumatoid arthritis methotrexate first line' },
  { id: 5, query: 'Kızamık aşısı otizme yol açar mı?', expectedTopic: 'mmr vaccine measles autism refute', expectedConsensus: 'no' },
  { id: 6, query: 'Parkinson hastalığında levodopa uzun dönemde motor dalgalanmalara yol açar mı?', expectedTopic: 'parkinson disease levodopa motor fluctuations dyskinesia' },
  { id: 7, query: 'Tip 2 diyabette tirzepatid kilo kaybında semaglutidden daha mı üstündür?', expectedTopic: 'tirzepatide semaglutide weight loss type 2 diabetes' },
  { id: 8, query: 'Helicobacter pylori eradikasyonu peptik ülser nüksünü engeller mi?', expectedTopic: 'helicobacter pylori eradication peptic ulcer recurrence' },
  { id: 9, query: 'D vitamini takviyesi kırık riskini önlemede gerçekten etkili midir?', expectedTopic: 'vitamin d fracture prevention osteoporosis' },
  { id: 10, query: 'Depresyon tedavisinde SSRI grubu antidepresanların plaseboya üstünlüğü kanıtlanmış mıdır?', expectedTopic: 'ssri antidepressant major depression placebo efficacy' },
  { id: 11, query: 'Koledokolitiyazis tanısında MRCP tanısal duyarlılığı ERCP ile eşdeğer midir?', expectedTopic: 'choledocholithiasis mrcp ercp diagnostic accuracy' },
  { id: 12, query: 'Atriyal fibrilasyonda yeni nesil oral antikoagülanlar varfarinden daha mı güvenlidir?', expectedTopic: 'atrial fibrillation doac noac warfarin bleeding safety' },
  { id: 13, query: 'Gebelikte parasetamol kullanımı çocukta dikkat eksikliği ve otizm riskini artırır mı?', expectedTopic: 'acetaminophen paracetamol pregnancy adhd autism risk' },
  { id: 14, query: 'Kronik böbrek yetmezliğinde düşük proteinli diyet diyalize gidişi geciktirir mi?', expectedTopic: 'chronic kidney disease low protein diet progression' },
  { id: 15, query: 'Lyme hastalığında post-tedavi lyme sendromunda uzun süreli antibiyotik yararlı mıdır?', expectedTopic: 'post treatment lyme disease syndrome prolonged antibiotics' },
  { id: 16, query: 'Meme kanserinde trastuzumab HER2 pozitif olgularda sağkalımı belirgin uzatır mı?', expectedTopic: 'breast cancer trastuzumab her2 overall survival' },
  { id: 17, query: 'Akut iskemik inmede ilk 4.5 saatte trombolitik alteplaz nörolojik sekelleri azaltır mı?', expectedTopic: 'acute ischemic stroke alteplase thrombolysis time window' },
  { id: 18, query: 'Kronik obstrüktif akciğer hastalığında inhale kortikosteroidler pnömoni riskini artırır mı?', expectedTopic: 'copd inhaled corticosteroids pneumonia risk' },
  { id: 19, query: 'Ketojenik diyet ilaca dirençli epilepsili çocuklarda nöbet sıklığını azaltır mı?', expectedTopic: 'ketogenic diet refractory epilepsy children seizure' },
  { id: 20, query: 'Sistemik lupus eritematozusta hidroksiklorokin mortaliteyi ve alevlenmeleri azaltır mı?', expectedTopic: 'systemic lupus erythematosus hydroxychloroquine mortality flare' }
];

async function runTests() {
  console.log('===============================================================');
  console.log('  KLİNİKPUSULA 20 RASTGELE BİLİMSEL SORU STRES & KALİTE TESTİ  ');
  console.log('===============================================================\n');

  const results = [];
  let passCount = 0;

  for (const item of TEST_QUESTIONS) {
    const startTime = Date.now();
    console.log(`[Test ${item.id}/20] Soru: "${item.query}"`);

    const testReport = {
      id: item.id,
      query: item.query,
      passed: false,
      optimizedQuery: '',
      papersCount: 0,
      consensus: null,
      sectionsCount: 0,
      hasTable: false,
      englishLeakageDetected: false,
      durationMs: 0,
      notes: []
    };

    try {
      // 1. Query Optimization
      const opt = await optimizeAcademicQuery(item.query);
      testReport.optimizedQuery = opt.primaryQuery;
      console.log(`  -> Optimize Edilen İngilizce Arama: "${opt.primaryQuery}"`);

      // 2. Academic Search
      const searchRes = await searchOpenAlex({
        query: item.query,
        page: 1,
        perPage: 10,
        mode: 'medical'
      });
      testReport.papersCount = searchRes.papers ? searchRes.papers.length : 0;
      console.log(`  -> Bulunan Makale Sayısı: ${testReport.papersCount}`);

      if (testReport.papersCount < 3) {
        testReport.notes.push('Düşük makale sayısı (< 3)');
      }

      // 3. Consensus Meter
      const consensus = calculateConsensusMeter(searchRes.papers, item.query);
      testReport.consensus = consensus;
      console.log(`  -> Konsensüs Metresi: Evet: %${consensus.yes}, Olası: %${consensus.possibly}, Hayır: %${consensus.no} | Karar: "${consensus.verdict}"`);

      if (item.expectedConsensus === 'no' && consensus.yes > consensus.no) {
        testReport.notes.push('Konsensüs yönü çelişkili (Beklenen: Hayır/Desteklemiyor)');
      }

      // 4. Academic Synthesis
      const synth = await generateSynthesis(searchRes.papers, item.query, consensus);
      testReport.sectionsCount = synth.sections ? synth.sections.length : 0;
      testReport.hasTable = (synth.sections || []).some(s => s.type === 'table' || (s.title && s.title.includes('Karşılaştırma')));
      console.log(`  -> Sentez Bölüm Sayısı: ${testReport.sectionsCount} | Karşılaştırma Tablosu: ${testReport.hasTable ? 'VAR' : 'YOK'}`);

      // 5. English Leakage & Quality Check
      let leakFound = false;
      for (const sec of (synth.sections || [])) {
        if (sec.content && typeof sec.content === 'string') {
          // Check if entire paragraph is English
          const sentences = sec.content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 30);
          for (const s of sentences) {
            if (isEnglishText(s)) {
              leakFound = true;
              testReport.notes.push(`İngilizce sızıntısı: "${s.slice(0, 50)}..."`);
              break;
            }
          }
        }
      }
      testReport.englishLeakageDetected = leakFound;

      // Evaluation criteria
      const isSuccess = testReport.papersCount >= 3 && 
                        testReport.sectionsCount >= 2 && 
                        !testReport.englishLeakageDetected;

      testReport.passed = isSuccess;
      if (isSuccess) {
        passCount++;
        console.log(`  [BAŞARILI] Soru ${item.id} tüm kalite kriterlerini karşıladı.`);
      } else {
        console.log(`  [UYARI/EKSİK] Soru ${item.id} kriterleri karşılayamadı: ${testReport.notes.join(', ')}`);
      }

    } catch (err) {
      console.error(`  [HATA] Soru ${item.id} işlenirken istisna oluştu:`, err.message);
      testReport.notes.push(`İstisna: ${err.message}`);
    }

    testReport.durationMs = Date.now() - startTime;
    results.push(testReport);
    console.log(`  -> Süre: ${(testReport.durationMs / 1000).toFixed(2)}s\n`);
  }

  const successRate = Math.round((passCount / TEST_QUESTIONS.length) * 100);
  console.log('===============================================================');
  console.log(`  TEST SONUCU: ${passCount}/${TEST_QUESTIONS.length} BAŞARILI (%${successRate} BAŞARI YÜZDESİ)`);
  console.log('===============================================================');

  return { successRate, results, passCount, total: TEST_QUESTIONS.length };
}

runTests().then(res => {
  console.log('\nJSON ÖZET:');
  console.log(JSON.stringify(res, null, 2));
});
