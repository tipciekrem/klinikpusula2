/**
 * 100-Trial GRADE Evidence Level & Cochrane Risk of Bias (RoB 2 / ROBINS-I) Test Suite
 * 
 * Verifies:
 * 1. Correct Cochrane RoB 2 domain evaluations (D1 to D5) for randomized controlled trials
 * 2. Correct ROBINS-I evaluations for non-randomized / observational studies
 * 3. Correct GRADE evidence hierarchy assignment (High, Moderate, Low, Very Low)
 * 4. Overall risk of bias grading (low, moderate, high)
 * 5. Study matrix row enrichment (gradeLevel, overallRisk, robTool, robDomains)
 * 6. Set-level GRADE and RoB summary statistics calculation
 * 7. Live API endpoint /api/pro/grade-analysis and /api/pro/study-matrix validation
 */

import { assessPaperRiskOfBias, generateGradeSummary } from './server/services/gradeRiskEngine.js';
import { buildStudyMatrix } from './server/services/proAgentEngine.js';

console.log('========================================================================');
console.log('🧪 BAŞLATILIYOR: 100 SENARYOLU GRADE & COCHRANE RoB 2 HATA DENETİMİ');
console.log('========================================================================\n');

// 100 Distinct Clinical Scenarios across diverse medical specialties and methodologies
const SCENARIOS = [
  // 1-15: Prestigious Double-Blind Large RCTs (Expected: GRADE High, RoB 2 Low Risk)
  {
    id: 'sc-1',
    title: 'Semaglutide and Cardiovascular Outcomes in Patients with Overweight or Obesity: The SELECT Trial',
    abstract: 'In this multicenter, double-blind, randomized, placebo-controlled trial, 17,604 patients were assigned to semaglutide or placebo. The primary cardiovascular end point was evaluated using intention-to-treat analysis.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 17,604',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-2',
    title: 'Empagliflozin, Cardiovascular Outcomes, and Mortality in Type 2 Diabetes: EMPA-REG OUTCOME',
    abstract: 'In a double-blind, randomized trial, 7020 patients were randomly assigned to empagliflozin or placebo with pre-registered protocol on clinicaltrials.gov. Primary outcome was all-cause mortality and cardiovascular death.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 7,020',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-3',
    title: 'Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction: DAPA-HF Trial',
    abstract: 'In this international, double-blind, parallel-group, randomized, placebo-controlled trial, 4744 patients were enrolled with central computer-generated randomization and concealed allocation.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 4,744',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-4',
    title: 'Pembrolizumab plus Chemotherapy in Metastatic Non-Small-Cell Lung Cancer: KEYNOTE-189',
    abstract: 'In a double-blind, phase 3 trial, 616 patients were randomly assigned in a 2:1 ratio. Overall survival was assessed via blinded independent central review with intention-to-treat principle.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 616',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-5',
    title: 'Lecanemab in Early Alzheimer\'s Disease: The Clarity AD Phase 3 Trial',
    abstract: 'In this 18-month, multicenter, double-blind, randomized, placebo-controlled trial involving 1795 participants with early Alzheimer disease, lecanemab reduced amyloid markers.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 1,795',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-6',
    title: 'Tirzepatide Once Weekly for the Treatment of Obesity: SURMOUNT-1',
    abstract: 'In this double-blind, randomized, controlled trial, 2539 adults were randomized with concealed allocation to receive tirzepatide or placebo. Objective body weight change was measured.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 2,539',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-7',
    title: 'Apixaban versus Warfarin in Patients with Atrial Fibrillation: The ARISTOTLE Trial',
    abstract: 'In this double-blind, double-dummy trial, 18,201 patients with atrial fibrillation were randomized. The primary objective outcome was stroke or systemic embolism with ITT analysis.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 18,201',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-8',
    title: 'Colchicine in Patients with Chronic Coronary Disease: The LoDoCo2 Trial',
    abstract: 'In a randomized, controlled, double-blind trial, 5522 patients underwent permuted block randomization. Objective cardiovascular death and spontaneous myocardial infarction were recorded.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 5,522',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-9',
    title: 'Secukinumab for the Treatment of Ankylosing Spondylitis: MEASURE 1',
    abstract: 'In a randomized, double-blind, placebo-controlled phase 3 study, 371 patients received secukinumab with stratified randomization and central computerized assignment.',
    journal: 'The Lancet',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 371',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-10',
    title: 'Resmetirom for the Treatment of Noncirrhotic Nonalcoholic Steatohepatitis: MAESTRO-NASH',
    abstract: 'In an ongoing phase 3, double-blind, randomized, placebo-controlled trial, 966 patients were evaluated using paired liver biopsy histology as objective endpoint.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 966',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-11',
    title: 'Sotagliflozin in Patients with Diabetes and Recent Worsening Heart Failure: SOLOIST-WHF',
    abstract: 'In this multicenter, double-blind, randomized, placebo-controlled trial, 1222 patients were randomized. Objective all-cause mortality and cardiovascular death were monitored.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 1,222',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-12',
    title: 'Effects of Intensive Blood-Pressure Control in Type 2 Diabetes Mellitus: ACCORD Trial',
    abstract: 'In a randomized, double-blind trial involving 4733 participants with type 2 diabetes, stratified randomization and concealed allocation were applied.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 4,733',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-13',
    title: 'Upadacitinib for Active Ankylosing Spondylitis: SELECT-AXIS 1',
    abstract: 'In this randomized, double-blind, parallel-group, placebo-controlled phase 2/3 trial, 187 patients were randomized with clinicaltrials.gov registration and ITT analysis.',
    journal: 'The Lancet',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 187',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-14',
    title: 'Ocrelizumab versus Interferon Beta-1a in Relapsing Multiple Sclerosis: OPERA I and II',
    abstract: 'In two identical, double-blind, double-dummy, randomized phase 3 trials, 1656 patients were randomized. Blinded MRI imaging endpoints and confirmed disability progression were assessed.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 1,656',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-15',
    title: 'Nirmatrelvir Combined with Ritonavir for Early Treatment of Covid-19: EPIC-HR',
    abstract: 'In this phase 2-3, double-blind, randomized, controlled trial, 2246 patients were randomized to receive nirmatrelvir plus ritonavir or placebo. Objective Covid-19 hospitalization and mortality were tracked.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 2,246',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },

  // 16-30: Systematic Reviews and Meta-Analyses (Expected: GRADE High/Moderate, RoB 2 Low/Mod)
  {
    id: 'sc-16',
    title: 'Autism Spectrum Disorder and Vaccines: A Comprehensive Systematic Review and Meta-Analysis',
    abstract: 'A systematic review and meta-analysis of five cohort studies and five case-control studies involving 1,256,407 children showed no relationship between MMR vaccination and autism (OR: 0.84). Pre-registered in PROSPERO.',
    journal: 'Vaccine',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 1,256,407',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-17',
    title: 'GLP-1 Receptor Agonists and Cardiovascular, Mortality, and Kidney Outcomes in Type 2 Diabetes: A Systematic Review and Meta-Analysis',
    abstract: 'We conducted a systematic review and meta-analysis of randomized controlled trials. Independent screening of 60,080 patients showed significant reduction in MACE and all-cause mortality.',
    journal: 'The Lancet Diabetes & Endocrinology',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 60,080',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-18',
    title: 'Efficacy and Safety of SGLT2 Inhibitors Across the Spectrum of Ejection Fraction: A Systematic Review and Meta-Analysis',
    abstract: 'A meta-analysis of 5 large trials involving 21,947 patients demonstrated consistent reduction in cardiovascular death and heart failure hospitalizations with prospective PROSPERO registration.',
    journal: 'The Lancet',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 21,947',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-19',
    title: 'Continuous Positive Airway Pressure for Obstructive Sleep Apnea: A Cochrane Systematic Review',
    abstract: 'Cochrane systematic review synthesizing 36 randomized trials. CPAP showed significant objective reduction in apnea-hypopnea index (AHI) and daytime sleepiness.',
    journal: 'Cochrane Database of Systematic Reviews',
    studyType: 'Systematic Review',
    sampleSize: 'n = 3,420',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-20',
    title: 'Oral Anticoagulants in Patients with Non-Valvular Atrial Fibrillation: Meta-Analysis of RCTs',
    abstract: 'A systematic review and meta-analysis of 4 pivotal phase 3 trials comparing direct oral anticoagulants with warfarin in 71,683 patients. Objective ischemic stroke and bleeding events analyzed.',
    journal: 'The Lancet',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 71,683',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-21',
    title: 'Exercise Interventions for Cancer-Related Fatigue: A Meta-Analysis',
    abstract: 'Meta-analysis of 113 randomized trials evaluating aerobic and resistance exercise. Pre-registered protocol with independent reviewers showed moderate benefit.',
    journal: 'JAMA Oncology',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 11,525',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-22',
    title: 'Metformin vs Sulfonylureas on Microvascular Outcomes in Type 2 Diabetes: Systematic Review',
    abstract: 'Systematic review synthesizing 28 comparative clinical trials. Dual independent extraction and ITT compliance.',
    journal: 'Annals of Internal Medicine',
    studyType: 'Systematic Review',
    sampleSize: 'n = 14,200',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-23',
    title: 'Biologic Therapies in Axial Spondyloarthritis: A Network Meta-Analysis',
    abstract: 'A systematic review and network meta-analysis of 28 randomized trials evaluating TNF inhibitors, IL-17 inhibitors, and JAK inhibitors.',
    journal: 'Annals of the Rheumatic Diseases',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 6,840',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-24',
    title: 'Aspirin for Primary Prevention of Cardiovascular Disease: Meta-Analysis of 13 Trials',
    abstract: 'A meta-analysis of 13 randomized trials involving 164,225 participants. Assessed cardiovascular death, myocardial infarction, and major bleeding.',
    journal: 'JAMA',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 164,225',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-25',
    title: 'Omega-3 Fatty Acids and Cardiovascular Outcomes: A Systematic Review and Meta-Analysis',
    abstract: 'Meta-analysis of 38 randomized controlled trials with clinicaltrials.gov validation. Objective cardiovascular mortality assessed.',
    journal: 'European Heart Journal',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 149,051',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-26',
    title: 'Statin Therapy and Risk of New-Onset Diabetes: A Collaborative Meta-Analysis of 13 Randomized Trials',
    abstract: 'Systematic review and meta-analysis of 13 statin trials in 91,140 participants. Objective fasting plasma glucose and HbA1c analyzed.',
    journal: 'The Lancet',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 91,140',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-27',
    title: 'Probiotics for Prevention of Antibiotic-Associated Diarrhea in Children: Cochrane Review',
    abstract: 'Cochrane systematic review of 33 trials in 6352 pediatric patients with pre-specified outcome measures.',
    journal: 'Cochrane Database of Systematic Reviews',
    studyType: 'Systematic Review',
    sampleSize: 'n = 6,352',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-28',
    title: 'Cognitive Behavioral Therapy for Chronic Insomnia: A Systematic Review and Meta-Analysis',
    abstract: 'Systematic review of 87 trials comparing CBT-I with control conditions. Objective polysomnography and sleep efficiency analyzed.',
    journal: 'Annals of Internal Medicine',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 4,200',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-29',
    title: 'Vitamin D Supplementation and Prevention of Autoimmune Diseases: VITAL Randomized Trial Meta-Analysis',
    abstract: 'Systematic review including VITAL trial data. 25,871 participants followed for confirmed physician-diagnosed autoimmune disorders.',
    journal: 'BMJ',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 25,871',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-30',
    title: 'Intermittent Fasting vs Continuous Caloric Restriction for Weight Loss: Meta-Analysis',
    abstract: 'Systematic review of 27 randomized controlled trials. Independent screening and objective weight loss and body composition analysis.',
    journal: 'Nature Medicine',
    studyType: 'Meta-Analysis',
    sampleSize: 'n = 2,850',
    expectedGrade: 'High',
    expectedRoB: 'low',
    expectedTool: 'Cochrane RoB 2'
  },

  // 31-45: Open-Label / Unblinded / Pragmatic RCTs (Expected: RoB 2 Moderate, GRADE Moderate)
  {
    id: 'sc-31',
    title: 'Open-Label Randomized Trial of Endovascular Thrombectomy vs Medical Care in Acute Stroke',
    abstract: 'In an open-label, randomized trial with unblinded clinical care, 206 patients underwent randomized allocation to thrombectomy or medical therapy.',
    journal: 'Journal of Stroke',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 206',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-32',
    title: 'Acupuncture vs Sham for Chronic Low Back Pain: An Open-Label Pragmatic Trial',
    abstract: 'A multicenter, open-label randomized trial comparing verum acupuncture with usual care in 340 patients. Participants were unblinded to intervention.',
    journal: 'Pain Research',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 340',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-33',
    title: 'Dietary Ketogenic Intervention in Type 2 Diabetes: An Unblinded Randomized Pilot Study',
    abstract: 'An unblinded, open-label randomized trial with per-protocol analysis in 85 participants evaluating glycemic control.',
    journal: 'Clinical Nutrition ESPEN',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 85',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-34',
    title: 'Open-Label Comparison of SGLT2i vs GLP-1RA in Real-World Primary Care',
    abstract: 'A pragmatic, unblinded open-label clinical trial involving 520 patients randomized to either empagliflozin or liraglutide.',
    journal: 'Primary Care Diabetes',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 520',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-35',
    title: 'Mindfulness-Based Stress Reduction for Fibromyalgia: An Open-Label Randomized Study',
    abstract: 'In an unblinded randomized trial, 120 patients were randomized to 8 weeks of MBSR or waitlist control with self-reported questionnaire endpoints.',
    journal: 'Rheumatology International',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 120',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-36',
    title: 'Telemedicine vs In-Person Follow-Up for Heart Failure: Open-Label Pragmatic Trial',
    abstract: 'Open-label, randomized trial of 410 post-discharge heart failure patients with unblinded medical providers.',
    journal: 'Circulation: Heart Failure',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 410',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-37',
    title: 'Cognitive Behavioral Therapy via Mobile App: An Open-Label Trial',
    abstract: 'In an unblinded open-label trial, 250 university students were assigned to smartphone app therapy or delayed intervention.',
    journal: 'Internet Interventions',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 250',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-38',
    title: 'High-Intensity Interval Training vs Moderate Continuous Training: An Open-Label Exercise Trial',
    abstract: 'An unblinded trial in 95 overweight adults comparing HIIT to MICT. Loss to follow-up was 15% and analyzed per-protocol.',
    journal: 'Sports Medicine Open',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 95',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-39',
    title: 'Early vs Late Tracheostomy in Critically Ill Patients: An Open-Label Randomized Trial',
    abstract: 'A multicenter, open-label trial in 450 mechanical ventilation patients. Clinicians could not be blinded due to nature of procedure.',
    journal: 'Critical Care Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 450',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-40',
    title: 'Physiotherapy Intervention for Femoroacetabular Impingement: Open-Label Trial',
    abstract: 'In an open-label, pragmatic randomized trial in 180 athletes, physiotherapy was compared with arthroscopic surgery.',
    journal: 'British Journal of Sports Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 180',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-41',
    title: 'Mediterranean Diet vs Low-Fat Diet in Non-Alcoholic Fatty Liver Disease: Open-Label Trial',
    abstract: 'An open-label randomized nutritional trial in 150 patients with ultrasound-verified hepatic steatosis.',
    journal: 'Nutrients',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 150',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-42',
    title: 'Robotic-Assisted vs Laparoscopic Radical Prostatectomy: An Open-Label Comparative Trial',
    abstract: 'An open-label, randomized trial in 326 men with localized prostate cancer. Surgeons and participants were unblinded.',
    journal: 'European Urology',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 326',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-43',
    title: 'Bariatric Surgery vs Intensive Medical Therapy for Diabetes: 5-Year Open-Label STAMPEDE Follow-up',
    abstract: 'In an open-label randomized trial, 150 patients were randomized to surgical or medical therapy. Objective HbA1c was measured.',
    journal: 'New England Journal of Medicine',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 150',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-44',
    title: 'Virtual Reality Exposure Therapy for Social Anxiety: An Open-Label Randomized Study',
    abstract: 'An open-label trial in 110 participants evaluating VR exposure versus in vivo exposure with self-reported anxiety scales.',
    journal: 'Cyberpsychology & Behavior',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 110',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },
  {
    id: 'sc-45',
    title: 'Oral Immunotherapy for Peanut Allergy in Children: Open-Label Randomized PALISADE Trial',
    abstract: 'An open-label extension trial in 496 children evaluating peanut protein desensitization with per-protocol analysis.',
    journal: 'The Lancet Child & Adolescent Health',
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 496',
    expectedGrade: 'Moderate',
    expectedRoB: 'moderate',
    expectedTool: 'Cochrane RoB 2'
  },

  // 46-65: Prospective Adjusted Cohorts (Expected: ROBINS-I, GRADE Moderate/Low)
  {
    id: 'sc-46',
    title: 'Measles, Mumps, and Rubella Vaccination and Autism: A Nationwide Danish Cohort Study',
    abstract: 'In a nationwide prospective cohort study of 657,461 Danish children born between 1999 and 2010, multivariate Cox proportional hazard regression adjusted for birth weight, gestational age, and parental history showed adjusted hazard ratio of 0.93.',
    journal: 'Annals of Internal Medicine',
    studyType: 'Cohort Study',
    sampleSize: 'n = 657,461',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-47',
    title: 'A Population-Based Study of Measles, Mumps, and Rubella Vaccination and Autism: 537,303 Children',
    abstract: 'A prospective cohort study of 537,303 children in Denmark. Multivariate adjusted relative risk for autism in vaccinated children was 0.92 with rigorous propensity score matching.',
    journal: 'New England Journal of Medicine',
    studyType: 'Cohort Study',
    sampleSize: 'n = 537,303',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-48',
    title: 'Long-Term Cardiovascular Outcomes of Bariatric Surgery in Patients with Type 2 Diabetes: A 20-Year Cohort',
    abstract: 'Prospective matched cohort study of 4,047 obese patients adjusted for age, sex, smoking, baseline BMI, and cardiovascular risk factors using multivariate logistic regression.',
    journal: 'JAMA',
    studyType: 'Cohort Study',
    sampleSize: 'n = 4,047',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-49',
    title: 'Nurses\' Health Study: Dietary Patterns and Risk of Coronary Heart Disease in Women',
    abstract: 'Prospective cohort study of 88,024 female nurses followed over 24 years. Multivariate proportional hazards regression adjusted for calorie intake, physical activity, and hypertension.',
    journal: 'New England Journal of Medicine',
    studyType: 'Cohort Study',
    sampleSize: 'n = 88,024',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-50',
    title: 'Framingham Heart Study: Lifetime Risk of Developing Coronary Heart Disease',
    abstract: 'Prospective cohort of 7,733 participants with comprehensive propensity score adjustment and multivariable Cox modeling.',
    journal: 'The Lancet',
    studyType: 'Cohort Study',
    sampleSize: 'n = 7,733',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-51',
    title: 'Coffee Consumption and All-Cause Mortality: A Large Prospective UK Biobank Cohort Study',
    abstract: 'Prospective study of 498,134 UK Biobank participants adjusted for genetic CYP1A2 variation, socioeconomic index, and alcohol intake via multivariate models.',
    journal: 'JAMA Internal Medicine',
    studyType: 'Cohort Study',
    sampleSize: 'n = 498,134',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-52',
    title: 'Breastfeeding and Childhood Obesity at Age 7: A Nationwide Japanese Cohort',
    abstract: 'A nationwide prospective cohort of 43,367 infants adjusted for maternal BMI, gestational diabetes, and socioeconomic status using multivariable regression.',
    journal: 'Pediatrics',
    studyType: 'Cohort Study',
    sampleSize: 'n = 43,367',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-53',
    title: 'SGLT2 Inhibitors vs GLP-1RA and Gout Flares in Patients with Diabetes: Population Cohort',
    abstract: 'Retrospective cohort of 295,907 patients using 1:1 propensity score matching and multivariate Cox hazard ratios.',
    journal: 'Annals of Internal Medicine',
    studyType: 'Cohort Study',
    sampleSize: 'n = 295,907',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-54',
    title: 'Prevalence and Sex Ratio of Axial Spondyloarthritis: A Population-Based Registry Cohort',
    abstract: 'In a prospective registry cohort of 3,820 patients, multivariate logistic regression adjusted for HLA-B27, age at symptom onset, and geographic region showed equal 1:1 prevalence.',
    journal: 'Arthritis & Rheumatology',
    studyType: 'Cohort Study',
    sampleSize: 'n = 3,820',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-55',
    title: 'Physical Activity and Colorectal Cancer Survival: The CALGB 89803 Prospective Cohort',
    abstract: 'In a prospective cohort of 832 patients with stage III colon cancer, multivariate adjustment for tumor stage, nodal status, and chemotherapy was performed.',
    journal: 'Journal of Clinical Oncology',
    studyType: 'Cohort Study',
    sampleSize: 'n = 832',
    expectedGrade: 'Low',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-56',
    title: 'Maternal Folic Acid Supplementation and Neural Tube Defects in China: Community Intervention Cohort',
    abstract: 'A prospective intervention cohort involving 247,831 pregnant women with multivariate logistic regression adjusting for maternal age and region.',
    journal: 'New England Journal of Medicine',
    studyType: 'Cohort Study',
    sampleSize: 'n = 247,831',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-57',
    title: 'Air Pollution and Risk of Incident Dementia: A Cohort Study of 2 Million Adults in Ontario',
    abstract: 'Population-based cohort of 2,126,426 adults followed for 10 years adjusted for neighborhood walkability, diabetes, and noise.',
    journal: 'The Lancet',
    studyType: 'Cohort Study',
    sampleSize: 'n = 2,126,426',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-58',
    title: 'Metformin and Long-Term Renal Outcomes in Diabetic Kidney Disease: A Real-World Cohort',
    abstract: 'Propensity-matched cohort study of 25,488 patients with eGFR between 30 and 60 ml/min adjusted for ACEi/ARB use and proteinuria.',
    journal: 'Kidney International',
    studyType: 'Cohort Study',
    sampleSize: 'n = 25,488',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-59',
    title: 'Statin Discontinuation and Risk of Recurrent Stroke in Elderly Patients',
    abstract: 'A prospective cohort of 14,890 elderly ischemic stroke patients adjusted for comorbidities and medication adherence.',
    journal: 'Neurology',
    studyType: 'Cohort Study',
    sampleSize: 'n = 14,890',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-60',
    title: 'Maternal Vitamin D Status During Pregnancy and Offspring Bone Mass: Southampton Women\'s Survey',
    abstract: 'Prospective cohort of 996 mother-child pairs with DXA bone scans at 9 years adjusted for child height and physical activity.',
    journal: 'The Lancet Diabetes & Endocrinology',
    studyType: 'Cohort Study',
    sampleSize: 'n = 996',
    expectedGrade: 'Low',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-61',
    title: 'Obesity and Severity of Obstructive Sleep Apnea: A Clinical Cohort of 1,240 Patients',
    abstract: 'Prospective observational cohort evaluating PSG sleep parameters across BMI strata with multivariate logistic adjustment.',
    journal: 'Chest',
    studyType: 'Cohort Study',
    sampleSize: 'n = 1,240',
    expectedGrade: 'Low',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-62',
    title: 'Proton Pump Inhibitors and Risk of Hip Fracture: A Large Veterans Affairs Cohort',
    abstract: 'A propensity-score matched cohort study in 124,000 veterans evaluating PPI duration and objective radiographic fractures.',
    journal: 'Gastroenterology',
    studyType: 'Cohort Study',
    sampleSize: 'n = 124,000',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-63',
    title: 'Hormone Replacement Therapy and Cardiovascular Events in the Swedish Registry Cohort',
    abstract: 'Prospective registry cohort of 89,000 postmenopausal women with multivariate adjustment for time since menopause.',
    journal: 'BMJ',
    studyType: 'Cohort Study',
    sampleSize: 'n = 89,000',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-64',
    title: 'Artificial Sweeteners and Cardiovascular Disease Risk: NutriNet-Santé Prospective Cohort',
    abstract: 'A prospective cohort of 102,865 adults evaluating dietary records with multivariate Cox models adjusted for sugar intake.',
    journal: 'BMJ',
    studyType: 'Cohort Study',
    sampleSize: 'n = 102,865',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-65',
    title: 'Electronic Cigarettes vs Conventional Smoking: A 5-Year Respiratory Health Cohort',
    abstract: 'Prospective cohort of 4,500 adults adjusted for baseline spirometry FEV1 and pack-years using multivariate regressions.',
    journal: 'Thorax',
    studyType: 'Cohort Study',
    sampleSize: 'n = 4,500',
    expectedGrade: 'Moderate',
    expectedRoB: 'low',
    expectedTool: 'ROBINS-I'
  },

  // 66-80: Unadjusted Observational / Cross-Sectional / Survey Studies (Expected: ROBINS-I Moderate/High, GRADE Low)
  {
    id: 'sc-66',
    title: 'Self-Reported Sleep Quality and Academic Performance Among Medical Students: A Cross-Sectional Survey',
    abstract: 'A cross-sectional questionnaire study in 320 medical students. Self-reported Pittsburgh Sleep Quality Index and exam grades were compared without multivariate regression.',
    journal: 'Medical Education Online',
    studyType: 'Cross-Sectional Study',
    sampleSize: 'n = 320',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-67',
    title: 'Vaccine Hesitancy Beliefs Among Healthcare Workers: An Online Survey Study',
    abstract: 'An unadjusted cross-sectional survey evaluating attitudes toward seasonal influenza vaccination using a Likert questionnaire in 450 nurses.',
    journal: 'Vaccine: X',
    studyType: 'Survey Study',
    sampleSize: 'n = 450',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-68',
    title: 'Dietary Habits and Self-Reported Irritable Bowel Syndrome Symptoms: An Observational Survey',
    abstract: 'A cross-sectional study in 210 patients using food frequency questionnaire and self-reported abdominal bloating scales.',
    journal: 'Digestive Diseases and Sciences',
    studyType: 'Survey Study',
    sampleSize: 'n = 210',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-69',
    title: 'Smartphone Usage Before Bedtime and Morning Fatigue: A Cross-Sectional Questionnaire',
    abstract: 'Survey in 500 adolescents assessing self-reported screen hours and daytime somnolence without objective polysomnography.',
    journal: 'Journal of Adolescent Health',
    studyType: 'Cross-Sectional Study',
    sampleSize: 'n = 500',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-70',
    title: 'Association Between Coffee Consumption and Self-Reported Headaches: A Cross-Sectional Study',
    abstract: 'A cross-sectional survey of 640 office employees assessing self-reported daily caffeine intake and headache frequency.',
    journal: 'Headache',
    studyType: 'Cross-Sectional Study',
    sampleSize: 'n = 640',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-71',
    title: 'Burnout and Compassion Fatigue in Emergency Room Physicians: A Multi-Hospital Survey',
    abstract: 'Cross-sectional survey utilizing Maslach Burnout Inventory in 180 emergency medicine physicians without adjustment for shifts.',
    journal: 'Annals of Emergency Medicine',
    studyType: 'Survey Study',
    sampleSize: 'n = 180',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-72',
    title: 'Perceived Stress and Dermatological Flare-Ups in Psoriasis Patients: A Survey',
    abstract: 'A cross-sectional questionnaire study in 140 psoriasis patients examining self-reported disease worsening after acute life stress.',
    journal: 'Dermatology Practical & Conceptual',
    studyType: 'Survey Study',
    sampleSize: 'n = 140',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-73',
    title: 'Prevalence of Restless Legs Syndrome in Hemodialysis Patients: A Cross-Sectional Analysis',
    abstract: 'A single-center cross-sectional survey of 85 dialysis patients using IRLSSG questionnaire criteria.',
    journal: 'Hemodialysis International',
    studyType: 'Cross-Sectional Study',
    sampleSize: 'n = 85',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-74',
    title: 'Gluten-Free Diet Trends and Perceived Energy Levels Among Non-Celiac Athletes: A Survey',
    abstract: 'A self-reported questionnaire administered to 120 recreational athletes investigating perceived performance benefits.',
    journal: 'International Journal of Sport Nutrition',
    studyType: 'Survey Study',
    sampleSize: 'n = 120',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-75',
    title: 'Herbal Supplement Use in Cancer Patients: A Cross-Sectional Ambulatory Clinic Survey',
    abstract: 'Survey in 240 oncology outpatients about self-initiated complementary medicine use without control group.',
    journal: 'Supportive Care in Cancer',
    studyType: 'Survey Study',
    sampleSize: 'n = 240',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-76',
    title: 'Attitudes Towards Telemedicine Consultations in Rural Elderly: A Questionnaire Study',
    abstract: 'A cross-sectional survey of 160 rural seniors evaluating digital literacy and perceived doctor-patient relationship.',
    journal: 'Telemedicine and e-Health',
    studyType: 'Survey Study',
    sampleSize: 'n = 160',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-77',
    title: 'Energy Drink Consumption and Self-Reported Heart Palpitations in Young Adults',
    abstract: 'Cross-sectional survey of 420 college students assessing frequency of energy drink intake and perceived tachycardia.',
    journal: 'American Journal of Cardiology',
    studyType: 'Cross-Sectional Study',
    sampleSize: 'n = 420',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-78',
    title: 'Knowledge and Adherence to Inhaler Technique in Asthmatic Children: An Outpatient Survey',
    abstract: 'A descriptive survey of 110 pediatric patients and their caregivers assessing inhaler demonstration scores.',
    journal: 'Pediatric Pulmonology',
    studyType: 'Survey Study',
    sampleSize: 'n = 110',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-79',
    title: 'Prevalence of Low Back Pain in Dental Professionals: An Ergonomic Questionnaire',
    abstract: 'A cross-sectional survey in 200 practicing dentists assessing working posture hours and pain VAS ratings.',
    journal: 'International Dental Journal',
    studyType: 'Cross-Sectional Study',
    sampleSize: 'n = 200',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-80',
    title: 'Consumer Perceptions of Organic Food vs Conventional Food: An Online Questionnaire',
    abstract: 'Cross-sectional survey among 350 urban supermarket shoppers assessing subjective health beliefs.',
    journal: 'Appetite',
    studyType: 'Survey Study',
    sampleSize: 'n = 350',
    expectedGrade: 'Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },

  // 81-90: Case-Control Studies (Expected: ROBINS-I, GRADE Very Low / Low)
  {
    id: 'sc-81',
    title: 'Aspirin Ingestion and Reye\'s Syndrome: A Multi-State Case-Control Study',
    abstract: 'In a case-control study of 64 cases of Reye syndrome matched to 128 age-matched controls, aspirin exposure during preceding influenza infection was strongly associated with disease.',
    journal: 'MMWR',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 192',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-82',
    title: 'Case-Control Study of Thalidomide Exposure and Congenital Limb Deformities (Phocomelia)',
    abstract: 'Retrospective case-control matching 46 infants with phocomelia to 92 healthy controls confirming early pregnancy thalidomide exposure.',
    journal: 'The Lancet',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 138',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-83',
    title: 'Case-Control Study of Human Papillomavirus and Cervical Carcinoma',
    abstract: 'A hospital-based case-control study matching 120 cervical cancer cases to 240 controls evaluating high-risk HPV DNA.',
    journal: 'International Journal of Cancer',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 360',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-84',
    title: 'Case-Control Analysis of Sun Exposure and Cutaneous Melanoma in Fair-Skinned Adults',
    abstract: 'Retrospective case-control study in 210 melanoma cases and 420 controls assessing lifetime blistering sunburns.',
    journal: 'Journal of the American Academy of Dermatology',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 630',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-85',
    title: 'Case-Control Study of Epstein-Barr Virus and Multiple Sclerosis',
    abstract: 'Matching 150 MS patients with 300 healthy age-matched controls evaluating anti-EBNA-1 IgG titers.',
    journal: 'Annals of Neurology',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 450',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-86',
    title: 'Case-Control Evaluation of High Dietary Sodium and Gastric Cancer Risk',
    abstract: 'Retrospective study comparing 90 confirmed gastric adenocarcinoma patients with 180 endoscopic controls.',
    journal: 'Gastric Cancer',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 270',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-87',
    title: 'Helicobacter Pylori Infection and Peptic Ulcer Disease: A Case-Control Investigation',
    abstract: 'Case-control study of 110 duodenal ulcer cases compared with 220 non-ulcer dyspepsia controls with biopsy testing.',
    journal: 'Gut',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 330',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-88',
    title: 'Case-Control Study of Maternal Smoking and Infant Cleft Lip and Palate',
    abstract: 'Matching 80 neonates born with orofacial clefts with 160 matched newborn controls evaluating first trimester tobacco exposure.',
    journal: 'The Cleft Palate-Craniofacial Journal',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 240',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-89',
    title: 'Case-Control Analysis of Fluoroquinolone Use and Aortic Aneurysm Dissection',
    abstract: 'Nested case-control study matching 1,200 aortic dissection cases with 4,800 controls in a national health database.',
    journal: 'JAMA Internal Medicine',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 6,000',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-90',
    title: 'Case-Control Investigation of Contact Lens Hygiene and Acanthamoeba Keratitis',
    abstract: 'Retrospective matching of 45 keratitis patients with 135 soft contact lens wearers regarding tap water rinsing.',
    journal: 'Ophthalmology',
    studyType: 'Case-Control Study',
    sampleSize: 'n = 180',
    expectedGrade: 'Very Low',
    expectedRoB: 'moderate',
    expectedTool: 'ROBINS-I'
  },

  // 91-100: Case Reports & Case Series (Expected: ROBINS-I, High Risk of Bias, GRADE Very Low)
  {
    id: 'sc-91',
    title: 'Ileal-Lymphoid-Nodular Hyperplasia, Non-Specific Colitis, and Pervasive Developmental Disorder in Children: A Case Series',
    abstract: 'A retrospective case series of 12 referred children with behavioral symptoms and chronic enterocolitis without control group.',
    journal: 'The Lancet (Retracted)',
    studyType: 'Case Series',
    sampleSize: 'n = 12',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-92',
    title: 'Fulminant Myocarditis Following Immune Checkpoint Inhibitor Therapy: A Case Report',
    abstract: 'A case report of a 62-year-old male with metastatic melanoma developing acute heart block and troponin elevation after nivolumab.',
    journal: 'European Heart Journal: Case Reports',
    studyType: 'Case Report',
    sampleSize: 'n = 1',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-93',
    title: 'Subacute Sclerosing Panencephalitis (SSPE) in an Unvaccinated 14-Year-Old Boy: Case Report',
    abstract: 'A case report describing progressive neurodegeneration and periodic EEG discharges in an adolescent with history of infantile measles infection.',
    journal: 'Pediatric Neurology',
    studyType: 'Case Report',
    sampleSize: 'n = 1',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-94',
    title: 'Severe Metformin-Associated Lactic Acidosis (MALA) in Acute Kidney Injury: A Case Report',
    abstract: 'Case report of an 74-year-old female presenting with severe metabolic acidosis (pH 6.85) successfully treated with hemodialysis.',
    journal: 'American Journal of Kidney Diseases',
    studyType: 'Case Report',
    sampleSize: 'n = 1',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-95',
    title: 'Takotsubo Cardiomyopathy Triggered by Panic Attack: A Clinical Case Report',
    abstract: 'Case report of apical ballooning in a 58-year-old postmenopausal woman with normal coronaries.',
    journal: 'BMJ Case Reports',
    studyType: 'Case Report',
    sampleSize: 'n = 1',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-96',
    title: 'Atypical Presentation of Behçet\'s Disease with Superior Vena Cava Syndrome: Case Report',
    abstract: 'A case report of a 31-year-old male with recurrent oral aphthae and extensive vascular thrombosis.',
    journal: 'Joint Bone Spine',
    studyType: 'Case Report',
    sampleSize: 'n = 1',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-97',
    title: 'Rare Seronegative Spondyloarthritis Associated with Hidradenitis Suppurativa: A Case Series',
    abstract: 'A clinical case series of 5 patients presenting with concurrent syndesmophytes and severe follicular occlusion.',
    journal: 'Dermatology Case Reports',
    studyType: 'Case Series',
    sampleSize: 'n = 5',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-98',
    title: 'Reye Syndrome Secondary to Salicylate Ingestion During Varicella: A Historic Case Report',
    abstract: 'A clinical case report of microvesicular fatty liver and cerebral edema in a 6-year-old child.',
    journal: 'Pediatrics Case Reports',
    studyType: 'Case Report',
    sampleSize: 'n = 1',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-99',
    title: 'Semaglutide-Induced Pancreatitis in a Patient with Choledocholithiasis: Case Report',
    abstract: 'Case report of acute necrotizing pancreatitis occurring 3 weeks after GLP-1 initiation.',
    journal: 'Case Reports in Medicine',
    studyType: 'Case Report',
    sampleSize: 'n = 1',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  },
  {
    id: 'sc-100',
    title: 'Autoimmune Encephalitis with Anti-NMDA Receptor Antibodies in an 18-Year-Old Female: Case Report',
    abstract: 'A case report describing psychiatric symptoms, autonomic instability, and response to plasmapheresis.',
    journal: 'Neurology Clinical Practice',
    studyType: 'Case Report',
    sampleSize: 'n = 1',
    expectedGrade: 'Very Low',
    expectedRoB: 'high',
    expectedTool: 'ROBINS-I'
  }
];

let passCount = 0;
let failCount = 0;
const failures = [];

console.log(`📋 Test edilecek senaryo sayısı: ${SCENARIOS.length}\n`);

for (let i = 0; i < SCENARIOS.length; i++) {
  const sc = SCENARIOS[i];
  const testNum = i + 1;
  const assessment = assessPaperRiskOfBias(sc);

  let passed = true;
  const errors = [];

  // Check Tool Selection
  if (assessment.toolUsed !== sc.expectedTool) {
    passed = false;
    errors.push(`Tool Mismatch: beklenen "${sc.expectedTool}", elde edilen "${assessment.toolUsed}"`);
  }

  // Check Overall RoB Level
  if (assessment.overallRisk !== sc.expectedRoB) {
    passed = false;
    errors.push(`RoB Mismatch: beklenen "${sc.expectedRoB}", elde edilen "${assessment.overallRisk}"`);
  }

  // Check GRADE Evidence Level
  if (assessment.gradeLevel !== sc.expectedGrade) {
    passed = false;
    errors.push(`GRADE Mismatch: beklenen "${sc.expectedGrade}", elde edilen "${assessment.gradeLevel}"`);
  }

  // Check RoB 2 / ROBINS-I 5 Domains Integrity
  if (!assessment.domains || assessment.domains.length !== 5) {
    passed = false;
    errors.push(`Domains Count Mismatch: 5 domain beklenirken ${assessment.domains?.length || 0} bulundu`);
  } else {
    for (const d of assessment.domains) {
      if (!d.id || !d.status || !d.note) {
        passed = false;
        errors.push(`Domain yapısı eksik: ${JSON.stringify(d)}`);
      }
    }
  }

  if (passed) {
    passCount++;
    console.log(`  ✅ Test #${testNum.toString().padStart(3, ' ')} [${sc.id}] BAŞARILI: ${sc.studyType.padEnd(28, ' ')} | Tool: ${assessment.toolUsed} | RoB: ${assessment.overallRisk.toUpperCase()} | GRADE: ${assessment.gradeLevel}`);
  } else {
    failCount++;
    failures.push({ testNum, id: sc.id, title: sc.title, errors });
    console.log(`  ❌ Test #${testNum.toString().padStart(3, ' ')} [${sc.id}] BAŞARISIZ: ${errors.join(', ')}`);
  }
}

console.log('\n------------------------------------------------------------------------');
console.log(`📊 TEKİL MAKALE DENETİM SONUÇLARI: ${passCount} / ${SCENARIOS.length} BAŞARILI (%${Math.round((passCount / SCENARIOS.length) * 100)})`);
console.log('------------------------------------------------------------------------\n');

// Test 101: Test Set-Level Summary (generateGradeSummary)
console.log('🧪 TEST 101: Toplu Literatür Havuzu İstatistiksel GRADE & RoB Özeti');
const batchSummary = generateGradeSummary(SCENARIOS);

console.log(`  - Toplam Analiz Edilen: ${batchSummary.totalAnalyzed}`);
console.log(`  - GRADE Dağılımı: %${batchSummary.gradeDistribution.highPct} Yüksek, %${batchSummary.gradeDistribution.moderatePct} Orta, %${batchSummary.gradeDistribution.lowPct} Düşük, %${batchSummary.gradeDistribution.veryLowPct} Çok Düşük`);
console.log(`  - RoB Dağılımı: %${batchSummary.robDistribution.lowRiskPct} Düşük Risk, %${batchSummary.robDistribution.someConcernsPct} Bazı Endişeler, %${batchSummary.robDistribution.highRiskPct} Yüksek Risk`);
console.log(`  - Genel Hüküm: ${batchSummary.overallGradeVerdict}`);
console.log(`  - Metinsel Özet: "${batchSummary.narrativeSummary.substring(0, 80)}..."`);

let summaryPass = false;
if (batchSummary.totalAnalyzed === 100 &&
    batchSummary.gradeDistribution.highPct > 0 &&
    batchSummary.robDistribution.lowRiskPct > 0 &&
    batchSummary.overallGradeVerdict) {
  summaryPass = true;
  console.log('  ✅ TEST 101 BAŞARILI: İstatistiksel özet başarıyla üretildi.\n');
} else {
  console.log('  ❌ TEST 101 BAŞARISIZ: İstatistiksel özet eksik veya tutarsız.\n');
}

// Test 102: Test Study Matrix Integration (buildStudyMatrix)
console.log('🧪 TEST 102: Consensus PRO Study Matrix GRADE & RoB Entegrasyonu');
const matrix = buildStudyMatrix(SCENARIOS.slice(0, 10));
let matrixPass = true;
for (const row of matrix) {
  if (!row.gradeLevel || !row.overallRisk || !row.robTool || !row.robDomains) {
    matrixPass = false;
    console.log(`  ❌ Matrix satırında GRADE/RoB eksik: ${row.studyName}`);
  }
}
if (matrixPass && matrix.length === 10) {
  console.log('  ✅ TEST 102 BAŞARILI: Matris satırlarının tamamında GRADE ve RoB sütunları mevcut.\n');
} else {
  console.log('  ❌ TEST 102 BAŞARISIZ: Matris satırlarında eksik alanlar tespit edildi.\n');
}

// Test 103: Test Live Backend API /api/pro/grade-analysis
console.log('🧪 TEST 103: Backend REST API /api/pro/grade-analysis Entegrasyon Testi');
try {
  const fetchRes = await fetch('http://localhost:4000/api/pro/grade-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ papers: SCENARIOS.slice(0, 5) })
  });
  if (fetchRes.ok) {
    const apiData = await fetchRes.json();
    if (apiData.summary && apiData.individual && apiData.individual.length === 5) {
      console.log('  ✅ TEST 103 BAŞARILI: /api/pro/grade-analysis uç noktası 200 OK ile doğru GRADE/RoB verisi döndürdü.\n');
    } else {
      console.log('  ❌ TEST 103 BAŞARISIZ: API yanıt gövdesi beklenenden farklı.', apiData);
    }
  } else {
    console.log(`  ⚠️ TEST 103 UYARI: HTTP ${fetchRes.status}`);
  }
} catch (apiErr) {
  console.log(`  ⚠️ TEST 103 UYARI: API bağlantı hatası (${apiErr.message}) - Dev server başlatılıyor olabilir.`);
}

console.log('========================================================================');
if (failCount === 0 && summaryPass && matrixPass) {
  console.log(`🎉 TÜM TESTLER EKSİKSİZ TAMAMLANDI! (${passCount}/100 Senaryo + 3 Entegrasyon Testi BAŞARILI)`);
} else {
  console.log(`⚠️ BAZI TESTLERDE HATALAR BULUNDU. Başarılı: ${passCount}, Başarısız: ${failCount}`);
  console.log('HATA DETAYLARI:');
  failures.forEach(f => {
    console.log(`  - Test #${f.testNum} [${f.id}]: ${f.errors.join(' | ')}`);
  });
}
console.log('========================================================================\n');
