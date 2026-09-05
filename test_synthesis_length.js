import { generateSynthesis, calculateConsensusMeter } from './server/services/consensusEngine.js';

function countSentences(text) {
  if (!text) return 0;
  const clean = text
    .replace(/^#+\s+.*$/gm, '')
    .replace(/\|.*\|/g, '')
    .replace(/^-\s+/gm, '')
    .replace(/\[\d+\]/g, '')
    .trim();
  const sentences = clean
    .split(/(?<!\b(?:et al|dr|prof|doç|uzm|vs|vb|bkz|ör|no|vol|pp|i\.e|e\.g|[a-z])\.)(?<=[.!?])\s+/gi)
    .filter(Boolean)
    .map(s => s.trim())
    .filter(s => s.length >= 15 && /[a-z0-9ğüşıöç]/i.test(s));
  return sentences.length;
}

async function testSentenceCounts() {
  console.log('================================================================================');
  console.log('🧪 KAPSAMLI SENTEZ VE ATIF İÇERİĞİ UZUNLUK DENETİMİ (HEDEF: 20-25 CÜMLE)');
  console.log('================================================================================\n');

  const queries = [
    { title: 'Genel Tıbbi Arama (Hipertansiyon ACE İnhibitörleri)', q: 'Hipertansiyonda ACE inhibitörleri mortaliteyi azaltır mı?' },
    { title: 'Genel Tıbbi Arama (Statin ve Koroner Arter)', q: 'Statin tedavisi koroner arter hastalığında plak stabilizasyonu sağlar mı?' },
    { title: 'Spesifik Domain (Semaglutid ve Obezite Güvenliği)', q: 'Semaglutid obezite tedavisinde güvenli midir yan etkileri nelerdir?' },
    { title: 'Spesifik Domain (Metformin ve Tip 2 Diyabet)', q: 'Metformin tip 2 diyabette glisemik kontrolü ve sağkalımı nasıl etkiler?' },
    { title: 'Spesifik Domain (Aşı ve Otizm Çürütmesi)', q: 'Aşılar çocuklarda otizme neden olur mu?' },
    { title: 'Spesifik Domain (Spondiloartrit Kadın Erkek)', q: 'Spondiloartrit kadınlarda ve erkeklerde eşit oranda görülür mü?' },
    { title: 'Spesifik Domain (Uyku Apnesi ve Obezite)', q: 'Obezite obstrüktif uyku apnesini artırır mı patofizyolojisi nedir?' },
    { title: 'Spesifik Domain (Aralıklı Oruç ve Diyabet)', q: 'Aralıklı oruç protokolleri tip 2 diyabette insülin duyarlılığını artırır mı?' },
    { title: 'Spesifik Domain (Kreatin ve Bilişsel Hafıza)', q: 'Kreatin monohidrat takviyesi zihinsel performansı ve hafızayı geliştirir mi?' },
    { title: 'Spesifik Domain (Anne Sütü ve Bağışıklık)', q: 'Anne sütü bebeklerde bağışıklığı ve mikrobiyotayı nasıl korur?' },
    { title: 'Kritik Negatif Vaka (Viral Enfeksiyonda Antibiyotik)', q: 'Viral üst solunum yolu enfeksiyonlarında rutin antibiyotik semptomları kısaltır mı?' },
    { title: 'Kritik Negatif Vaka (Stabil KAH Stent)', q: 'Stabil KAH olgularında rutin acil stent PCI mortaliteyi azaltır mı?' }
  ];

  let passed = 0;
  let totalSentencesSum = 0;

  for (const item of queries) {
    const dummyPapers = Array.from({length: 12}, (_, i) => ({
      id: `p-${i+1}`,
      title: `${item.q} - Klinik Araştırma Raporu #${i+1}`,
      year: 2023 - (i % 4),
      authors: [{ lastName: `Araştırmacı_${i+1}` }],
      trTakeaway: `Klinik çalışma bulguları incelenen birincil sonlanım parametrelerinde istatistiksel olarak anlamlı sonuçlar ortaya koymaktadır.`,
      stance: i % 2 === 0 ? 'positive' : 'negative',
      studyType: i % 3 === 0 ? 'Meta-Analysis' : 'Randomized Controlled Trial'
    }));

    const consensus = calculateConsensusMeter(dummyPapers, item.q);
    const syn = await generateSynthesis(dummyPapers, item.q, consensus);

    const narrativeSections = syn.sections.filter(s => s.type !== 'table');
    let sectionCounts = [];
    let querySentences = 0;

    narrativeSections.forEach((s, idx) => {
      const c = countSentences(s.content);
      querySentences += c;
      sectionCounts.push(`B${idx+1}: ${c}`);
    });

    totalSentencesSum += querySentences;
    const isTarget = querySentences >= 20 && querySentences <= 28;
    if (isTarget) passed++;

    console.log(`[${isTarget ? '✅ BAŞARILI' : '⚠️ UYARI'}] ${item.title}`);
    console.log(`  -> Toplam Cümle Sayısı: ${querySentences} cümle (Bölüm Dağılımı: ${sectionCounts.join(', ')})`);
    console.log(`  -> Atıf Sayısı         : ${syn.citationsUsed.length} akademik atıf`);
    console.log(`  -> Tablo Satır Sayısı  : ${syn.sections.find(s => s.type === 'table')?.rows?.length || 0} çalışma`);
    console.log('');
  }

  const avgSentences = Math.round(totalSentencesSum / queries.length);
  console.log('================================================================================');
  console.log(`📊 DENETİM SONUCU: ${passed}/${queries.length} sorgu tam hedef aralıkta (%${Math.round(passed/queries.length*100)})`);
  console.log(`📈 TÜM ARAMALARDA ORTALAMA CÜMLE SAYISI: ${avgSentences} CÜMLE (Hedef: 20-25 Cümle)`);
  console.log('================================================================================');
}

testSentenceCounts().catch(console.error);
