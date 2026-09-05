import { calculateConsensusMeter, generateSynthesis } from './server/services/consensusEngine.js';
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
    .split(/(?<!\b(?:et al|dr|prof|doç|uzm|vs|vb|bkz|ör|no|vol|pp|i\.e|e\.g|[a-z])\.)(?<=[.!?])\s+/gi)
    .filter(Boolean)
    .map(s => s.trim())
    .filter(s => s.length >= 15 && /[a-z0-9ğüşıöç]/i.test(s));
  return { count: sentences.length, sentences };
}

async function testSingleDeclarative() {
  const scenario = CLINICAL_SCENARIOS_250[0];
  const dummyPapers = Array.from({ length: 12 }, (_, pIdx) => ({
    id: `p-1-${pIdx + 1}`,
    title: `${scenario.question} - Klinik Çalışma #${pIdx + 1}`,
    year: 2024 - (pIdx % 5),
    authors: [{ lastName: `Yazar_${pIdx + 1}` }],
    trTakeaway: `Klinik araştırma ve kılavuz verileri birincil sonlanım noktalarında anlamlı sonuçlar ortaya koymaktadır.`,
    stance: 'positive',
    studyType: 'RCT'
  }));

  const cons = calculateConsensusMeter(dummyPapers, scenario.question);
  const syn = await generateSynthesis(dummyPapers, scenario.question, cons);

  let total = 0;
  syn.sections.forEach((s, idx) => {
    if (s.type === 'table') return;
    const res = countSentences(s.content);
    total += res.count;
    console.log(`Section ${idx + 1} [title: "${s.title}"]: ${res.count} sentences`);
  });
  console.log('\nTotal narrative sentences:', total);
}

testSingleDeclarative();
