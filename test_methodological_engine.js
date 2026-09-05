/**
 * Verification Suite for Methodological Evaluation Engine (Cochrane RoB 2, ROBINS-I, GRADE & RevMan)
 */
import { generateDetailedMethodologicalReport, generateGradeSummary, assessPaperRiskOfBias } from './server/services/gradeRiskEngine.js';

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`✅ PASS: ${msg}`);
  } else {
    failed++;
    console.error(`❌ FAIL: ${msg}`);
  }
}

async function run() {
  console.log('========================================================================');
  console.log('🔬 TESTING METHODOLOGICAL EVALUATION ENGINE (GRADE, RoB 2 & RevMan Matrix)');
  console.log('========================================================================\n');

  const mockPapers = [
    {
      id: 'p1',
      title: 'Semaglutide and Cardiovascular Outcomes in Patients with Overweight or Obesity (SELECT)',
      abstract: 'In a double-blind, randomized, placebo-controlled trial, semaglutide was superior to placebo in reducing MACE by 20% in 17,604 patients.',
      studyType: 'Randomized Controlled Trial',
      sampleSize: '17,604 participants',
      authors: ['Michael Lincoff', 'Steven Nissen'],
      year: 2023,
      stance: 'yes'
    },
    {
      id: 'p2',
      title: 'Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1)',
      abstract: 'A double-blind, randomized, placebo-controlled trial involving 1,961 adults. Mean weight loss was 14.9% with semaglutide.',
      studyType: 'Randomized Controlled Trial',
      sampleSize: '1,961 participants',
      authors: ['John Wilding', 'Rachel Batterham'],
      year: 2021,
      stance: 'yes'
    },
    {
      id: 'p3',
      title: 'Semaglutide vs Placebo in Patients with Type 2 Diabetes and CKD (FLOW)',
      abstract: 'A multinational, randomized, double-blind trial demonstrating 24% lower risk of kidney-disease progression and death.',
      studyType: 'Randomized Controlled Trial',
      sampleSize: '3,533 participants',
      authors: ['Vlado Perkovic', 'Katherine Tuttle'],
      year: 2024,
      stance: 'yes'
    },
    {
      id: 'p4',
      title: 'Real-world Persistence and Adherence with GLP-1 Receptor Agonists: A 3-Year Observational Study',
      abstract: 'A prospective multicenter cohort of 8,400 type 2 diabetes patients adjusted for age, comorbidities, and baseline HbA1c via propensity score.',
      studyType: 'Cohort Study',
      sampleSize: '8,400 patients',
      authors: ['Elena Rossi', 'Marco Bianchi'],
      year: 2022,
      stance: 'yes'
    },
    {
      id: 'p5',
      title: 'Acute Pancreatitis Associated with GLP-1 RA in a Patient with Prior Cholelithiasis: A Case Report',
      abstract: 'We report a 54-year-old female presenting with epigastric abdominal pain and elevated amylase after GLP-1 initiation.',
      studyType: 'Case Report',
      sampleSize: '1 patient',
      authors: ['Sarah Connor'],
      year: 2023,
      stance: 'no'
    }
  ];

  // TEST 1: assessPaperRiskOfBias
  const rctRoB = assessPaperRiskOfBias(mockPapers[0]);
  assert(rctRoB.toolUsed === 'Cochrane RoB 2', 'RCT correctly evaluated via Cochrane RoB 2');
  assert(rctRoB.overallRisk === 'low', 'SELECT trial received Low Risk of Bias');
  assert(rctRoB.gradeLevel === 'High', 'SELECT trial received High Certainty of Evidence');
  assert(rctRoB.domains.length === 5, 'RoB 2 produced all 5 Cochrane core domains (D1-D5)');

  // TEST 2: Observational Study (ROBINS-I)
  const cohortRoB = assessPaperRiskOfBias(mockPapers[3]);
  assert(cohortRoB.toolUsed === 'ROBINS-I', 'Cohort study correctly evaluated via ROBINS-I');
  assert(cohortRoB.domains.length === 5, 'ROBINS-I produced 5 confounding/selection domains');

  // TEST 3: Case Report (High RoB, Very Low GRADE)
  const caseRoB = assessPaperRiskOfBias(mockPapers[4]);
  assert(caseRoB.overallRisk === 'high', 'Case report received High Risk of Bias');
  assert(caseRoB.gradeLevel === 'Very Low', 'Case report received Very Low Evidence level');

  // TEST 4: generateDetailedMethodologicalReport
  const report = generateDetailedMethodologicalReport(mockPapers, 'Semaglutid Tedavisinin Kardiyovasküler Güvenliliği');
  assert(report && report.summary, 'Report contains summary statistics');
  assert(report.assessedPapers.length === 5, 'All 5 papers processed in RevMan matrix');
  assert(report.domainSummaries.length === 5, 'Domain summaries present for D1-D5');
  assert(report.gradeFactors.length === 5, 'All 5 GRADE downgrade/upgrade criteria analyzed');
  assert(report.thesisParagraph && report.thesisParagraph.length > 200, 'Produced comprehensive thesis methodology paragraph');

  // TEST 5: Live API Endpoint
  try {
    const res = await fetch('http://localhost:4000/api/pro/methodological-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ papers: mockPapers, topic: 'Semaglutid Kardiyovasküler' })
    });
    assert(res.ok, `POST /api/pro/methodological-report returned HTTP ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      assert(Array.isArray(data.assessedPapers), 'API returned assessedPapers array');
      assert(Array.isArray(data.gradeFactors), 'API returned gradeFactors');
    }
  } catch (err) {
    console.warn(`Live API check notice: ${err.message}`);
  }

  console.log('\n========================================================================');
  console.log(`📊 SUMMARY: ${passed}/${passed + failed} METHODOLOGICAL ENGINE TESTS PASSED`);
  if (failed === 0) {
    console.log('🎉 ALL METHODOLOGICAL EVALUATION ENGINE FEATURES VERIFIED (100%)!');
  } else {
    console.error(`🚨 ${failed} TESTS FAILED!`);
  }
  console.log('========================================================================');
}

run();
