/**
 * Diagnostic test for negative / refuted / incompatible medical queries
 */

import { calculateConsensusMeter, generateSynthesis } from './server/services/consensusEngine.js';
import { auditManuscript } from './server/services/proAgentEngine.js';
import { estimateStance } from './server/services/academicSearch.js';

console.log('=== TEST 1: estimateStance on negative / refuting paper abstracts ===');
const testAbstracts = [
  'In this randomized trial, ivermectin showed no significant difference compared to placebo in reducing mortality.',
  'Hydroxychloroquine failed to show clinical benefit and was not associated with improved viral clearance.',
  'There was no evidence of benefit with homeopathy, which performed identically to placebo controls.',
  'Antibiotic treatment did not improve symptoms or shorten duration of viral upper respiratory tract infections.',
  'Aspirin did not reduce all-cause mortality in healthy elderly individuals and increased major hemorrhage risk.',
  'Glucosamine was not superior to placebo in reducing knee osteoarthritis joint space narrowing.',
  'Vaccination was not associated with any increased risk of autism spectrum disorders in this large cohort of 657,461 children.',
  'Beta-blockers did not reduce cardiovascular mortality in patients with heart failure with preserved ejection fraction (HFpEF).'
];

testAbstracts.forEach((abs, idx) => {
  const stance = estimateStance(abs);
  console.log(`Abstract ${idx + 1}: stance = "${stance}" | ${abs.slice(0, 70)}...`);
});

console.log('\n=== TEST 2: auditManuscript on negative / refuted claims ===');
const testManuscript = `
Aşılar çocuklarda otizm riskini belirgin şekilde artırmaktadır.
Limonlu su tüketimi kanser hücrelerini kemoterapiden daha etkili şekilde yok etmektedir.
Antibiyotikler viral nezle ve grip tedavisinde primer iyileşme sağlar.
Hidroksiklorokin COVID-19 hastalarında mortaliteyi anlamlı derecede düşürmektedir.
Metformin tip 2 diyabet tedavisinde birinci basamak etkin bir ajandır.
`.trim();

auditManuscript({ text: testManuscript }).then(res => {
  console.log('Readiness Score:', res.readinessScore);
  res.claims.forEach((c, idx) => {
    console.log(`\nClaim ${idx + 1}: "${c.sentence}"`);
    console.log(`Status: ${c.status} | Feedback: ${c.feedback}`);
  });
}).catch(err => console.error(err));
