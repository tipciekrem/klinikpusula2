import { optimizeAcademicQuery } from './server/services/queryOptimizer.js';
import { searchOpenAlex } from './server/services/academicSearch.js';
import { calculateConsensusMeter, generateSynthesis } from './server/services/consensusEngine.js';
import { isEnglishText } from './server/services/translationEngine.js';

const FIXED_QUESTIONS = [
  { id: 9, cat: 'Kardiyoloji', query: 'Beta blokerler korunmuş ejeksiyon fraksiyonlu kalp yetmezliğinde mortaliteyi azaltır mı?', expectedConsensus: 'no' },
  { id: 12, cat: 'Endokrinoloji', query: 'Metformin kullanan hastalarda laktik asidoz riski klinik olarak yüksek midir?', expectedConsensus: 'no' },
  { id: 15, cat: 'Endokrinoloji', query: 'Subklinik hipotiroidide hafif TSH yüksekliğinde rutin levotiroksin tedavisi kardiyovasküler fayda sağlar mı?', expectedConsensus: 'no' },
  { id: 20, cat: 'Endokrinoloji', query: 'Hipogonadizmi olan erkeklerde testosteron replasman tedavisi majör kardiyovasküler olayları artırır mı?', expectedConsensus: 'no' },
  { id: 21, cat: 'Nöroloji', query: 'Erken evre Alzheimer hastalığında lekanemab bilişsel gerilemeyi yavaşlatır mı?', expectedConsensus: 'yes' },
  { id: 35, cat: 'Romatoloji', query: 'Kronik gut artritinde allopurinol ürik asit seviyesini düşürerek tofüs gerilemesini sağlar mı?', expectedConsensus: 'yes' },
  { id: 40, cat: 'Romatoloji', query: 'Primer Sjögren sendromunda pilokarpin ağız kuruluğu semptomlarını hafifletir mi?', expectedConsensus: 'yes' },
  { id: 44, cat: 'Gastroenteroloji', query: 'Nonalkolik steatohepatitte resmetirom karaciğer fibrozisinde gerileme sağlar mı?', expectedConsensus: 'yes' },
  { id: 59, cat: 'Nefroloji', query: 'Asemptomatik erkeklerde rutin PSA taraması tüm nedenlere bağlı mortaliteyi azaltır mı?', expectedConsensus: 'no' },
  { id: 73, cat: 'Enfeksiyon', query: 'HIV temas öncesi profilakside (PrEP) oral tenofovir emtrisitabin cinsel bulaş riskini belirgin düşürür mü?', expectedConsensus: 'yes' },
  { id: 74, cat: 'Enfeksiyon', query: 'Ventilatör ilişkili pnömonide antibiyotik deeskalasyonu tedavi başarısızlığını artırır mı?', expectedConsensus: 'no' },
  { id: 84, cat: 'Pediatri', query: 'Basit febril konvülsiyon geçiren çocuklarda sürekli antiepileptik profilaksi zeka geriliğini önler mi?', expectedConsensus: 'no' },
  { id: 86, cat: 'Pediatri', query: 'Çocukluk çağı astımında düşük doz inhale kortikosteroidler erişkin nihai boyunu kalıcı olarak kısaltır mı?', expectedConsensus: 'no' }
];

async function verifyFixes() {
  console.log('===============================================================');
  console.log('  13 ANOMALİ İÇİN DÜZELTME VE DOĞRULAMA TESTİ  ');
  console.log('===============================================================\n');

  let passed = 0;
  for (const item of FIXED_QUESTIONS) {
    const opt = await optimizeAcademicQuery(item.query);
    const searchRes = await searchOpenAlex({
      query: item.query,
      page: 1,
      perPage: 10,
      mode: 'medical'
    });
    const papersCount = searchRes.papers ? searchRes.papers.length : 0;
    const consensus = calculateConsensusMeter(searchRes.papers, item.query);
    const synth = await generateSynthesis(searchRes.papers, item.query, consensus);
    const sectionsCount = synth.sections ? synth.sections.length : 0;

    let leakFound = false;
    for (const sec of (synth.sections || [])) {
      if (sec.content && typeof sec.content === 'string') {
        const sentences = sec.content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 30);
        for (const s of sentences) {
          if (isEnglishText(s)) {
            leakFound = true;
            break;
          }
        }
      }
    }

    let ok = papersCount >= 3 && sectionsCount >= 2 && !leakFound;
    if (item.expectedConsensus === 'no' && consensus.yes > consensus.no) ok = false;
    if (item.expectedConsensus === 'yes' && consensus.no > consensus.yes) ok = false;

    if (ok) {
      passed++;
      console.log(`[BAŞARILI] #${item.id} [${item.cat}] -> ${papersCount} makale | Konsensüs: %${consensus.yes}E / %${consensus.no}H | "${consensus.verdict}"`);
    } else {
      console.log(`[BAŞARISIZ] #${item.id} [${item.cat}] -> ${papersCount} makale | Konsensüs: %${consensus.yes}E / %${consensus.no}H | Beklenen: ${item.expectedConsensus}`);
    }
  }

  console.log(`\nSONUÇ: ${passed}/${FIXED_QUESTIONS.length} DÜZELTİLDİ VE DOĞRULANDI.`);
  return { passed, total: FIXED_QUESTIONS.length };
}

verifyFixes();
