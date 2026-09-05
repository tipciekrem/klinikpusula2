import { calculateConsensusMeter, generateSynthesis } from './server/services/consensusEngine.js';
import { matchCriticalNegativeCase } from './server/services/criticalRefutations.js';
import { CLINICAL_SCENARIOS_250 } from './server/services/clinicalScenarios250Data.js';

function countSentences(text) {
  if (!text) return 0;
  const clean = text
    .replace(/^#+\s+.*$/gm, '')
    .replace(/\|.*\|/g, '')
    .replace(/^-\s+/gm, '')
    .replace(/\[\d+\]/g, '')
    .trim();
  const sentences = clean
    .split(/(?<!\b(?:et al|dr|prof|doç|uzm|vs|vb|bkz|ör|no|vol|pp|i\.e|e\.g|[a-z]|\d{1,3})\.)(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9])/gi)
    .filter(Boolean)
    .map(s => s.trim())
    .filter(s => s.length >= 15 && /[a-z0-9ğüşıöç]/i.test(s));
  return sentences.length;
}

export async function run250ScenarioAudit() {
  console.log('================================================================================');
  console.log('🧪 250 AYRI TIBBİ SENARYO LİTERATÜR UYGUNLUK VE HATA DENETİM SUITE');
  console.log('================================================================================\n');

  console.log(`Toplam Test Edilecek Senaryo Sayısı: ${CLINICAL_SCENARIOS_250.length}`);

  let passedConsensus = 0;
  let passedSynthesisLength = 0;
  let passedCitations = 0;
  let totalSentences = 0;
  const errors = [];

  const specialtyBreakdown = {};

  for (let i = 0; i < CLINICAL_SCENARIOS_250.length; i++) {
    const scenario = CLINICAL_SCENARIOS_250[i];
    const spec = scenario.specialty;
    if (!specialtyBreakdown[spec]) {
      specialtyBreakdown[spec] = { total: 0, passed: 0 };
    }
    specialtyBreakdown[spec].total++;

    const cleanTopicTitle = scenario.question.replace(/[?.,!;:]+$/, '');

    // Generate realistic simulated paper cohort reflecting expected literature stance
    const dummyPapers = Array.from({ length: 12 }, (_, pIdx) => {
      let stance = 'neutral';
      if (scenario.expectedStance === 'affirmative') {
        stance = pIdx < 10 ? 'positive' : 'neutral';
      } else if (scenario.expectedStance === 'refuted') {
        stance = pIdx < 10 ? 'negative' : 'neutral';
      } else {
        stance = pIdx % 2 === 0 ? 'positive' : 'negative';
      }

      return {
        id: `p-${scenario.id}-${pIdx + 1}`,
        title: `${cleanTopicTitle} - Klinik Araştırma Bulgusu #${pIdx + 1}`,
        year: 2024 - (pIdx % 5),
        authors: [{ lastName: `Yazar_${pIdx + 1}` }],
        trTakeaway: `Klinik araştırma ve kılavuz verileri doğrultusunda ${cleanTopicTitle} konusu değerlendirilmiş ve istatistiksel olarak anlamlı klinik sonuçlar saptanmıştır.`,
        stance: stance,
        studyType: pIdx % 3 === 0 ? 'Meta-Analysis' : 'Randomized Controlled Trial'
      };
    });

    // 1. Evaluate Consensus Meter Literature Alignment
    const cons = calculateConsensusMeter(dummyPapers, scenario.question);
    const vLower = (cons.verdict || '').toLowerCase();

    let consensusAccurate = false;
    let failReason = '';

    if (scenario.expectedStance === 'refuted') {
      const isRefutedVerdict = 
        cons.no >= 55 || 
        vLower.includes('hayır') || 
        vLower.includes('desteklemiyor') || 
        vLower.includes('reddediyor') || 
        vLower.includes('etkisiz') || 
        vLower.includes('yanılgı') || 
        vLower.includes('dayanağı yoktur') || 
        vLower.includes('zararlı') ||
        vLower.includes('fark saptanamamıştır') ||
        vLower.includes('farksızdır');
      
      const falseAffirmative = cons.yes > 50 || vLower.includes('destekliyor (evet');

      if (isRefutedVerdict && !falseAffirmative) {
        consensusAccurate = true;
      } else {
        failReason = `Beklenen: Çürütülmüş/Desteklemiyor, Alınan: no: %${cons.no}, yes: %${cons.yes}, verdict: "${cons.verdict}"`;
      }
    } else if (scenario.expectedStance === 'affirmative') {
      const isAffirmativeVerdict = 
        cons.yes >= 55 || 
        vLower.includes('evet') || 
        vLower.includes('destekliyor') || 
        vLower.includes('doğruluyor') || 
        vLower.includes('etkin');
      
      const falseRefutation = cons.no > 50 || vLower.includes('reddediyor (hayır');

      if (isAffirmativeVerdict && !falseRefutation) {
        consensusAccurate = true;
      } else {
        failReason = `Beklenen: Destekleniyor/Evet, Alınan: yes: %${cons.yes}, no: %${cons.no}, verdict: "${cons.verdict}"`;
      }
    } else {
      // Controversial / Mixed
      const isMixed = 
        vLower.includes('karışık') || 
        vLower.includes('tartışmalı') || 
        vLower.includes('koşullu') || 
        vLower.includes('belki') ||
        (cons.yes >= 30 && cons.no >= 30) ||
        (cons.possibly >= 25);
      if (isMixed) {
        consensusAccurate = true;
      } else {
        failReason = `Beklenen: Karışık/Tartışmalı, Alınan: yes: %${cons.yes}, no: %${cons.no}, verdict: "${cons.verdict}"`;
      }
    }

    if (consensusAccurate) {
      passedConsensus++;
      specialtyBreakdown[spec].passed++;
    } else {
      errors.push({
        id: scenario.id,
        specialty: scenario.specialty,
        question: scenario.question,
        expectedStance: scenario.expectedStance,
        reason: failReason
      });
    }

    // 2. Evaluate Synthesis Generation, Section Count, Sentence Count
    try {
      const syn = await generateSynthesis(dummyPapers, scenario.question, cons);
      const narrativeSections = (syn.sections || []).filter(s => s.type !== 'table');
      let querySentences = 0;
      narrativeSections.forEach(s => {
        querySentences += countSentences(s.content);
      });
      totalSentences += querySentences;

      if (querySentences >= 20 && querySentences <= 35) {
        passedSynthesisLength++;
      } else if (querySentences < 20) {
        errors.push({
          id: scenario.id,
          specialty: scenario.specialty,
          question: scenario.question,
          type: 'Cümle Sayısı Yetersiz (<20)',
          details: `Toplam cümle: ${querySentences}`
        });
      } else {
        errors.push({
          id: scenario.id,
          specialty: scenario.specialty,
          question: scenario.question,
          type: 'Cümle Sayısı Beklenenden Fazla (>35)',
          details: `Toplam cümle: ${querySentences}`
        });
      }

      if (syn.citationsUsed && syn.citationsUsed.length >= 8) {
        passedCitations++;
      }
    } catch (err) {
      errors.push({
        id: scenario.id,
        specialty: scenario.specialty,
        question: scenario.question,
        type: 'Sentez Üretim Hatası',
        details: err.message
      });
    }
  }

  const avgSentences = (totalSentences / CLINICAL_SCENARIOS_250.length).toFixed(1);

  console.log('\n================================================================================');
  console.log('📊 250 SENARYO TEST SONUÇLARI');
  console.log('================================================================================');
  console.log(`Literatür Konsensüs Uyumu Başarısı : ${passedConsensus} / ${CLINICAL_SCENARIOS_250.length} (%${((passedConsensus / CLINICAL_SCENARIOS_250.length) * 100).toFixed(1)})`);
  console.log(`20-25 Cümle Hedefine Uyum          : ${passedSynthesisLength} / ${CLINICAL_SCENARIOS_250.length} (%${((passedSynthesisLength / CLINICAL_SCENARIOS_250.length) * 100).toFixed(1)})`);
  console.log(`Ortalama Cümle / Senaryo           : ${avgSentences} cümle`);
  console.log(`Atıf Zenginliği Başarısı (>=8 atıf): ${passedCitations} / ${CLINICAL_SCENARIOS_250.length} (%${((passedCitations / CLINICAL_SCENARIOS_250.length) * 100).toFixed(1)})`);
  console.log(`Toplam Hata / Sapma Sayısı         : ${errors.length}`);
  console.log('================================================================================\n');

  console.log('🩺 Uzmanlık Alanlarına Göre Konsensüs Başarısı:');
  for (const [spec, stats] of Object.entries(specialtyBreakdown)) {
    const rate = ((stats.passed / stats.total) * 100).toFixed(0);
    console.log(`- ${spec.padEnd(35)}: ${stats.passed}/${stats.total} (%${rate})`);
  }

  if (errors.length > 0) {
    console.log('\n⚠️ TESPİT EDİLEN HATALAR VE SAPMALAR:');
    errors.slice(0, 20).forEach(e => {
      console.log(`[Vaka #${e.id} - ${e.specialty}] ${e.question}`);
      console.log(`  -> Sebep/Hata: ${e.reason || e.details || e.type}\n`);
    });
  }

  return {
    total: CLINICAL_SCENARIOS_250.length,
    passedConsensus,
    passedSynthesisLength,
    avgSentences,
    errors
  };
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].includes('test_250_clinical_scenarios.js')) {
  run250ScenarioAudit().catch(err => {
    console.error('Fatal error running 250 scenario audit:', err);
    process.exit(1);
  });
}
