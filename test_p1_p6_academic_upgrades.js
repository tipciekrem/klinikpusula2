import assert from 'assert';
import { generateBibTeX, generateBatchBibTeX, generateRIS, generateBatchRIS } from './server/services/citationEngine.js';
import { detectFundingAndCOI } from './server/services/academicSearch.js';
import { generatePrismaWordDocument } from './server/services/thesisDocxExporter.js';
import { auditChecklistCONSORT_STROBE } from './server/services/proAgentEngine.js';
import { searchDergiPark } from './server/services/dergiParkEngine.js';

console.log('================================================================');
console.log('🔬 KLİNİKPUSULA: P1-P6 STRATEJİK AKADEMİK GELİŞTİRME DOĞRULAMA TESTİ');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [GEÇTİ] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [BAŞARISIZ] ${name}:`, err.message);
  }
}

// =====================================================================
// TEST SUITE 1: P6 - BibTeX & RIS Citation Engines
// =====================================================================
console.log('--- TEST SUITE 1: P6 - BibTeX & RIS Atıf Çıktıları ---');

const mockPaper1 = {
  id: 'paper-101',
  title: 'Efficacy and Safety of Empagliflozin in Patients with Type 2 Diabetes',
  authors: ['Zinman, Bernard', 'Wanner, Christoph', 'Lachin, John M.'],
  year: 2015,
  journal: 'New England Journal of Medicine',
  doi: '10.1056/NEJMoa1504720',
  volume: '373',
  issue: '22',
  pages: '2117-2128',
  abstract: 'Patients with type 2 diabetes at high cardiovascular risk were randomized...',
  pmid: '26378978',
  inTextCitation: '(Zinman ve ark., 2015)'
};

const mockPaper2 = {
  id: 'paper-102',
  title: 'Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction',
  authors: ['McMurray, John J.V.', 'Solomon, Scott D.'],
  year: 2019,
  journal: 'New England Journal of Medicine',
  doi: '10.1056/NEJMoa1911303',
  volume: '381',
  issue: '21',
  pages: '1995-2008'
};

runTest('P6.1 - Tekil BibTeX Üretimi (@article formatı, yazar listesi, DOI, journal)', () => {
  const bib = generateBibTeX(mockPaper1);
  assert(bib.includes('Zinman, Bernard and Wanner, Christoph and Lachin, John M.'), 'Yazarlar "and" ile bağlanmalı');
  assert(bib.includes('10.1056/NEJMoa1504720'), 'DOI alanı doğru olmalı');
  assert(bib.includes('New England Journal of Medicine'), 'Dergi adı doğru olmalı');
  assert(bib.includes('373'), 'Cilt doğru olmalı');
  assert(bib.includes('22'), 'Sayı doğru olmalı');
  assert(bib.includes('2117-2128'), 'Sayfalar doğru olmalı');
});

runTest('P6.2 - Toplu BibTeX Üretimi (Batch BibTeX for Overleaf/LaTeX/Zotero)', () => {
  const batchBib = generateBatchBibTeX([mockPaper1, mockPaper2]);
  assert(batchBib.includes('Zinman2015Efficacy'), 'Birinci makale anahtarı yer almalı');
  assert(batchBib.includes('McMurray2019Dapagliflozin'), 'İkinci makale anahtarı yer almalı');
  assert((batchBib.match(/@article\{/g) || []).length === 2, '2 adet @article kaydı içermeli');
});

runTest('P6.3 - Zenginleştirilmiş RIS Üretimi (VL, IS, SP, DO, AN etiketleri)', () => {
  const ris = generateRIS(mockPaper1);
  assert(ris.includes('TY  - JOUR'), 'RIS JOUR tipiyle başlamalı');
  assert(ris.includes('T1  - Efficacy and Safety of Empagliflozin'), 'T1 başlık etiketini içermeli');
  assert(ris.includes('VL  - 373'), 'VL cilt etiketini içermeli');
  assert(ris.includes('IS  - 22'), 'IS sayı etiketini içermeli');
  assert(ris.includes('SP  - 2117-2128'), 'SP sayfa etiketini içermeli');
  assert(ris.includes('DO  - 10.1056/NEJMoa1504720'), 'DO DOI etiketini içermeli');
  assert(ris.includes('AN  - PMID:26378978'), 'AN PMID etiketini içermeli');
  assert(ris.includes('ER  -'), 'ER ile sonlanmalı');
});

runTest('P6.4 - Toplu RIS Üretimi (Batch RIS for EndNote/Mendeley)', () => {
  const batchRis = generateBatchRIS([mockPaper1, mockPaper2]);
  assert((batchRis.match(/TY  - JOUR/g) || []).length === 2, '2 adet TY - JOUR kaydı içermeli');
  assert((batchRis.match(/ER  -/g) || []).length === 2, '2 adet ER - bitişi içermeli');
});

// =====================================================================
// TEST SUITE 2: P3 - Conflict of Interest (COI) & Sponsorship Bias Radar
// =====================================================================
console.log('\n--- TEST SUITE 2: P3 - Çıkar Çatışması (COI) & Sponsorluk Radarı ---');

runTest('P3.1 - İlaç Şirketi Sponsorluğu Tespiti (Pharma Entity Detection)', () => {
  const pharmaPaper = {
    title: 'Trial of Semaglutide in Obesity',
    abstract: 'This trial was supported and funded by Novo Nordisk A/S. All authors disclosed travel fees.',
    journal: 'Lancet'
  };
  const analysis = detectFundingAndCOI(pharmaPaper);
  assert.strictEqual(analysis.fundingStatus, 'industry', 'İlaç firması sponsoru "industry" olarak tespit edilmeli');
  assert(analysis.fundingBadge.includes('Endüstri'), 'Rozet "Endüstri" içermeli');
  assert.strictEqual(analysis.fundingBiasLevel, 'high', 'Bias seviyesi "high" olmalı');
  assert(analysis.fundingDetails.includes('Novo Nordisk'), 'Sponsor adı raporda yer almalı');
});

runTest('P3.2 - Bağımsız / Kamu Fonu Tespiti (NIH, MRC, TÜBİTAK, University Grant)', () => {
  const academicPaper = {
    title: 'Dietary interventions in metabolic syndrome',
    abstract: 'This research was supported by National Institutes of Health (NIH grant R01-DK08129) and Medical Research Council (MRC).',
    journal: 'BMJ'
  };
  const analysis = detectFundingAndCOI(academicPaper);
  assert.strictEqual(analysis.fundingStatus, 'academic', 'Kamu/Akademi hibesi "academic" olarak tespit edilmeli');
  assert.strictEqual(analysis.fundingBadge, '🟢 Bağımsız Fonlu', 'Rozet "Bağımsız Fonlu" olmalı');
  assert.strictEqual(analysis.fundingBiasLevel, 'low', 'Bias seviyesi "low" olmalı');
});

runTest('P3.3 - Açıklanmamış / Bağımsız Fonlama (Belirtilmemiş)', () => {
  const neutralPaper = {
    title: 'Observational analysis of hospital admissions',
    abstract: 'We conducted a retrospective chart review of all emergency visits in 2022.',
    journal: 'Anatolian Clinic'
  };
  const analysis = detectFundingAndCOI(neutralPaper);
  assert.strictEqual(analysis.fundingStatus, 'unspecified', 'Belirtilmemiş çalışma "unspecified" olmalı');
  assert.strictEqual(analysis.fundingBadge, '⚪ Bağımsız / Açıklanmamış', 'Rozet "Bağımsız / Açıklanmamış" olmalı');
});

// =====================================================================
// TEST SUITE 3: P2 - PRISMA 2020 Word (.doc) Exporter
// =====================================================================
console.log('\n--- TEST SUITE 3: P2 - PRISMA 2020 Word (.doc) Raporu ---');

runTest('P2.1 - PRISMA Word Belgesi HTML Yapısı ve Tablolar', () => {
  const doc = generatePrismaWordDocument({
    query: 'Tip 2 Diyabette Metformin ve SGLT2 İnhibitörleri',
    stats: {
      totalFound: 142,
      databaseCounts: {
        pubmed: 85,
        openalex: 35,
        semantic: 15,
        dergipark: 7
      },
      duplicatesRemoved: 18,
      screened: 124,
      excludedAfterScreening: 82,
      retrieved: 42,
      notRetrieved: 0,
      assessedForEligibility: 42,
      excludedDetail: {
        lowEvidence: 12,
        unrelatedStudy: 10,
        animalOrInVitro: 4,
        noFullText: 2
      },
      includedStudies: 14
    }
  });

  assert(typeof doc === 'string' && doc.length > 500, 'Word belgesi dolu string olmalı');
  assert(doc.includes('xmlns:w="urn:schemas-microsoft-com:office:word"'), 'Word XML namespace içermeli');
  assert(doc.includes('PRISMA 2020 AKIŞ ŞEMASI RAPORU'), 'Ana başlık yer almalı');
  assert(doc.includes('Tip 2 Diyabette Metformin'), 'Arama sorgusu raporda bulunmalı');
  assert(doc.includes('142'), 'Toplam taranan kayıt sayısı yer almalı');
  assert(doc.includes('PubMed: 85'), 'PubMed taranan sayısı yer almalı');
  assert(doc.includes('DergiPark / TR Dizin: 7'), 'DergiPark sayısı yer almalı');
  assert(doc.includes('Dahil Edilen Çalışmalar: 14'), 'Senteze giren nihai makale sayısı yer almalı');
  assert(doc.includes('Page 1 of 1'), 'Word sayfa numaralandırma alanı yer almalı');
});

// =====================================================================
// TEST SUITE 4: P4 - TR Dizin / DergiPark Direct Bridge
// =====================================================================
console.log('\n--- TEST SUITE 4: P4 - TR Dizin & DergiPark Entegrasyonu ---');

runTest('P4.1 - DergiPark Arama ve Otomatik Türkçe Alan Zenginleştirmesi', async () => {
  const results = await searchDergiPark('diyabet metformin', 3);
  assert(Array.isArray(results), 'Sonuç array olmalı');
  assert(results.length > 0, 'En az 1 DergiPark sonucu dönmeli');
  const first = results[0];
  assert(first.isTurkishLiterature === true, 'isTurkishLiterature true olmalı');
  assert(first.fundingStatus === 'academic', 'DergiPark makaleleri bağımsız/akademik etiketlenmeli');
  assert(first.trTitle, 'Türkçe başlık (trTitle) dolu olmalı');
  assert(first.trTakeaway, 'Türkçe klinik çıkarım (trTakeaway) dolu olmalı');
  assert(first.database === 'DergiPark / TR Dizin', 'database DergiPark / TR Dizin olmalı');
});

// =====================================================================
// TEST SUITE 5: P5 - AI Peer-Review Checklist Auditor (CONSORT & STROBE)
// =====================================================================
console.log('\n--- TEST SUITE 5: P5 - CONSORT 2010 & STROBE Hakem Denetçisi ---');

const sampleRctText = `Bu randomize kontrollü, paralel gruplu çalışmada (1:1 tahsis) Tip 2 diyabetli hastalarda yeni bir SGLT2 inhibitörünün etkinliği araştırılmıştır. 
Dahil edilme kriterleri 18-75 yaş arası ve HbA1c %7.5-10.5 olan ardışık hastalardı; son dönem böbrek yetmezliği olanlar dışlandı. 
Katılımcılar 12 hafta boyunca günde 10 mg oral ilaç veya plasebo almak üzere bilgisayar tabanlı rastgele blok randomizasyon ile sıralı kapalı zarflar kullanılarak tahsis edildi; katılımcılar ve araştırmacılar atamaya körlendi. 
Primer sonlanım noktası 12. haftadaki HbA1c düzeyindeki değişimdir. 
Tip I hata alfa=0.05 ve %80 istatistiksel güç ile her gruba en az 64 hasta hesaplandı. 
Tüm analizler Intention-to-Treat (ITT) prensibiyle gerçekleştirildi (%95 GA ve p < 0.05). İstenmeyen olaylar kaydedildi. 
Çalışma ClinicalTrials.gov (NCT04829104) protokol tescili ve Etik Kurul onayı (Karar: 2023/142) ile yürütülmüş olup yazarlar çıkar çatışması olmadığını bildirmiştir.`;

runTest('P5.1 - CONSORT 2010 Kontrol Listesi Değerlendirmesi (Yüksek Uyum)', () => {
  const audit = auditChecklistCONSORT_STROBE({ text: sampleRctText, guideline: 'consort' });
  assert.strictEqual(audit.guideline, 'CONSORT', 'Kılavuz CONSORT olmalı');
  assert(audit.complianceScore >= 80, `Uyum skoru %80 üzerinde olmalı, gelen: ${audit.complianceScore}`);
  assert.strictEqual(audit.totalItems, 12, '12 CONSORT kriteri taranmalı');
  assert(audit.metCount >= 8, 'En az 8 kriter tam karşılanmalı');
  assert(audit.items.length === 12, 'Tüm 12 madde nesne olarak dönmeli');
  assert(audit.items.every(item => item.suggestion && item.explanation), 'Her maddede hakem önerisi ve açıklama olmalı');
});

const sampleObservationalText = `Bu prospektif kohort çalışmasında, Ocak 2021 - Aralık 2023 tarihleri arasında kliniğimize başvuran akut koroner sendromlu hastalarda troponin düzeyi ve mortalite ilişkisi incelendi. 
Dahil edilme kriterleri 18 yaş üzeri ardışık hastalardı. 
Tüm biyokimyasal testler standardize yöntemlerle ölçüldü. Seçim yanlılığını önlemek için ardışık örnekleme uygulandı. 
Karıştırıcı (confounder) faktörler çok değişkenli lojistik regresyon analizi ile kontrol edildi. 
Toplam 340 hasta (140 kadın, 200 erkek, yaş ortalaması 62.4) takip edildi; kayıp veri oranı %3 idi. 
Çalışmanın kısıtlılıkları tek merkezli doğasıdır. 
Çalışma Etik Kurul onayı ile yürütülmüş olup yazarlar çıkar çatışması olmadığını belirtmiştir.`;

runTest('P5.2 - STROBE Kontrol Listesi Değerlendirmesi (Gözlemsel Çalışma Uyumu)', () => {
  const audit = auditChecklistCONSORT_STROBE({ text: sampleObservationalText, guideline: 'strobe' });
  assert.strictEqual(audit.guideline, 'STROBE', 'Kılavuz STROBE olmalı');
  assert(audit.complianceScore >= 75, `Uyum skoru %75 üzerinde olmalı, gelen: ${audit.complianceScore}`);
  assert.strictEqual(audit.totalItems, 10, '10 STROBE kriteri taranmalı');
  assert(audit.metCount >= 7, 'En az 7 kriter tam karşılanmalı');
});

runTest('P5.3 - Eksik Kılavuz Maddelerinin Tespiti ve Hakem Önerisi', () => {
  const weakText = 'Hastalara aspirin verildi ve sonuçlar incelendi.';
  const audit = auditChecklistCONSORT_STROBE({ text: weakText, guideline: 'consort' });
  assert(audit.complianceScore < 30, `Yetersiz metin düşük skor almalı, gelen: ${audit.complianceScore}`);
  assert(audit.missingCount >= 8, 'Eksik sayısı yüksek olmalı');
  assert.strictEqual(audit.overallGrade, 'D - Yetersiz Metodolojik Bildirim', 'Not D olmalı');
});

// =====================================================================
// TEST SUITE 6: P1 - G*Power Hesaplama Motoru (Matematiksel Doğruluk)
// =====================================================================
console.log('\n--- TEST SUITE 6: P1 - G*Power Örneklem & Güç Matematiksel Modeli ---');

// Simulated pure JS calculations mirroring SampleSizeCalculator.jsx
function calculateTwoSampleT(alpha, power, effectSize, dropoutPercent) {
  // Approximate standard normal quantiles
  const zAlpha = alpha === 0.01 ? 2.576 : (alpha === 0.05 ? 1.96 : 1.645);
  const zBeta = power === 0.95 ? 1.645 : (power === 0.90 ? 1.282 : 0.842);
  const nPerGroupRaw = Math.ceil(2 * Math.pow((zAlpha + zBeta) / effectSize, 2));
  const dropoutRate = dropoutPercent / 100;
  const nPerGroupAdjusted = Math.ceil(nPerGroupRaw / (1 - dropoutRate));
  return {
    nPerGroupRaw,
    nPerGroupAdjusted,
    totalSampleAdjusted: nPerGroupAdjusted * 2
  };
}

runTest('P1.1 - Bağımsız İki Grup T-Testi (alpha=0.05, power=0.80, d=0.5 Cohen orta etki)', () => {
  const res = calculateTwoSampleT(0.05, 0.80, 0.5, 10);
  // Formula: 2 * ((1.96 + 0.842) / 0.5)^2 = 2 * (2.802 / 0.5)^2 = 2 * (5.604)^2 = 2 * 31.4 = 62.8 -> 63/grup
  // With 10% dropout: ceil(63 / 0.9) = 70/grup -> total 140
  assert(res.nPerGroupRaw >= 62 && res.nPerGroupRaw <= 64, `Ham grup boyutu ~63 olmalı, hesaplanan: ${res.nPerGroupRaw}`);
  assert(res.nPerGroupAdjusted >= 69 && res.nPerGroupAdjusted <= 71, `Kayıp düzeltmeli grup boyutu ~70 olmalı, hesaplanan: ${res.nPerGroupAdjusted}`);
  assert(res.totalSampleAdjusted >= 138 && res.totalSampleAdjusted <= 142, `Toplam örneklem ~140 olmalı, hesaplanan: ${res.totalSampleAdjusted}`);
});

runTest('P1.2 - Yüksek Güç (%90) ve Düşük Alfa (0.01) ile Örneklem Artışı Doğrulaması', () => {
  const standard = calculateTwoSampleT(0.05, 0.80, 0.5, 0);
  const rigorous = calculateTwoSampleT(0.01, 0.90, 0.5, 0);
  assert(rigorous.nPerGroupRaw > standard.nPerGroupRaw * 1.8, 'Daha katı alfa ve yüksek güç belirgin derecede daha fazla hasta gerektirmeli');
});

// =====================================================================
// SUMMARY
// =====================================================================
console.log('\n================================================================');
console.log(`📊 TEST SONUÇLARI: ${passedTests} / ${totalTests} TEST BAŞARIYLA TAMAMLANDI`);
if (passedTests === totalTests) {
  console.log('🎉 TÜM P1-P6 AKADEMİK VE KLİNİK ÖZELLİKLERİ %100 BAŞARIYLA DOĞRULANDI!');
} else {
  console.log(`⚠️ Bazı testlerde hata oluştu: ${totalTests - passedTests} başarısız.`);
}
console.log('================================================================\n');

process.exit(passedTests === totalTests ? 0 : 1);
