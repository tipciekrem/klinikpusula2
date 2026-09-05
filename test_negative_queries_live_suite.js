// Use global fetch in Node 18+

const NEGATIVE_QUERIES = [
  {
    topic: "Aşılar otizme yol açar mı?",
    expectedVerdictKeywords: ["desteklemiyor", "çürüt", "reddediyor", "yol açmaz", "hayır", "etkisiz"],
    expectedNoMin: 50
  },
  {
    topic: "İvermektin COVID-19 mortalitesini azaltır mı?",
    expectedVerdictKeywords: ["desteklemiyor", "etkisiz", "fayda sağlamaz", "hayır", "reddediyor"],
    expectedNoMin: 50
  },
  {
    topic: "Viral gripte antibiyotik kullanımı semptomları geçirir mi?",
    expectedVerdictKeywords: ["desteklemiyor", "etkisiz", "uygunsuz", "fayda sağlamaz", "hayır", "reddediyor"],
    expectedNoMin: 50
  },
  {
    topic: "Limonlu sıcak su kanseri tamamen tedavi eder mi?",
    expectedVerdictKeywords: ["desteklemiyor", "bilimsel dayanağı yoktur", "dayanağı yoktur", "çürüt", "etkisiz", "yanılgı", "hayır"],
    expectedNoMin: 60
  },
  {
    topic: "Hidroksiklorokin COVID-19 hastalarında mortaliteyi düşürür mü?",
    expectedVerdictKeywords: ["desteklemiyor", "fayda göstermemiş", "etkisiz", "düşürmez", "hayır"],
    expectedNoMin: 50
  }
];

const AUDIT_PARAGRAPH = `
Kızamık ve KKK aşıları çocuklarda otizm spektrum bozukluğu gelişimine neden olmaktadır.
Aralıklı oruç protokolleri prediyabetik hastalarda insülin duyarlılığını artırmakta ve açlık glukozunu regüle etmektedir.
Viral üst solunum yolu enfeksiyonlarında amoksisilin-klavulanat tedavisi semptom süresini belirgin biçimde kısaltır ve komplikasyonları önler.
`;

async function runTests() {
  console.log('================================================================');
  console.log('🧪 NEGATİF VE LİTERATÜRLE ÇELİŞEN ARAMALAR TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  // 1. Test Consensus Center on Negative Queries
  for (const item of NEGATIVE_QUERIES) {
    total++;
    console.log(`[TEST ${total}] Konsensüs Sorgusu: "${item.topic}"`);
    try {
      const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(item.topic)}&limit=15`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const { consensus, synthesis, papers } = data;
      console.log(`   -> Konsensüs Skoru: Evet: %${consensus?.yes} | Belki: %${consensus?.possibly} | Hayır: %${consensus?.no}`);
      console.log(`   -> Karar Başlığı: "${consensus?.verdict}"`);

      // Check consensus.no
      const meetsNo = (consensus?.no || 0) >= item.expectedNoMin;
      // Check verdict phrasing
      const vText = (consensus?.verdict || '').toLowerCase() + ' ' + (consensus?.verdictIntro || '').toLowerCase();
      const hasNegWord = item.expectedVerdictKeywords.some(kw => vText.includes(kw.toLowerCase()));

      // Check synthesis text doesn't claim positive efficacy
      const synthText = JSON.stringify(synthesis || '').toLowerCase();
      const claimsFalseEfficacy = /müdahalenin etkinliğini ve güvenlik profilini doğrulamaktadır/i.test(synthText) ||
                                  /tedavinin üstünlüğünü kanıtlamaktadır/i.test(synthText);

      if (meetsNo && hasNegWord && !claimsFalseEfficacy) {
        console.log(`   ✅ BAŞARILI: Literatürle uyumsuz negatif iddia doğru saptandı (Hayır: %${consensus.no}). Yanlış destekleme cümlesi yok.`);
        passed++;
      } else {
        console.log(`   ❌ BAŞARISIZ: meetsNo=${meetsNo} (${consensus?.no} vs ${item.expectedNoMin}), hasNegWord=${hasNegWord}, claimsFalseEfficacy=${claimsFalseEfficacy}`);
      }
    } catch (err) {
      console.error(`   ❌ HATA:`, err.message);
    }
    console.log('');
  }

  // 2. Test Manuscript Auditor on Contradicted Claims
  total++;
  console.log(`[TEST ${total}] Makale Denetimi (Audit Manuscript) Negatif/Çelişen İddia Denetimi`);
  try {
    const res = await fetch('http://localhost:3000/api/pro/audit-manuscript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manuscriptText: AUDIT_PARAGRAPH })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    console.log(`   -> Atıf Hazırlık Skoru: %${data.readinessScore}`);
    console.log(`   -> Toplam Analiz Edilen Cümle: ${data.claims?.length}`);

    const vaccineClaim = data.claims?.find(c => c.sentence.includes('otizm'));
    const fastingClaim = data.claims?.find(c => c.sentence.includes('oruç'));
    const antibioticClaim = data.claims?.find(c => c.sentence.includes('amoksisilin'));

    let auditOk = true;

    if (vaccineClaim) {
      console.log(`   -> Aşı/Otizm Cümlesi Durumu: ${vaccineClaim.status} (${vaccineClaim.statusText})`);
      if (vaccineClaim.status !== 'contradicted') {
        console.log(`      ❌ HATA: Aşı/otizm iddiası 'contradicted' olmalıydı fakat '${vaccineClaim.status}' geldi!`);
        auditOk = false;
      } else {
        console.log(`      ✅ DOĞRU: Çürütülmüş iddia 'contradicted' olarak etiketlendi.`);
      }
    }

    if (antibioticClaim) {
      console.log(`   -> Antibiyotik/Viral Cümlesi Durumu: ${antibioticClaim.status} (${antibioticClaim.statusText})`);
      if (antibioticClaim.status !== 'contradicted') {
        console.log(`      ❌ HATA: Viral enfeksiyonda antibiyotik iddiası 'contradicted' olmalıydı fakat '${antibioticClaim.status}' geldi!`);
        auditOk = false;
      } else {
        console.log(`      ✅ DOĞRU: Çürütülmüş iddia 'contradicted' olarak etiketlendi.`);
      }
    }

    if (fastingClaim) {
      console.log(`   -> Aralıklı Oruç Cümlesi Durumu: ${fastingClaim.status} (${fastingClaim.statusText})`);
      if (fastingClaim.status !== 'verified') {
        console.log(`      ⚠️ Bilgi: Oruç iddiası '${fastingClaim.status}' geldi.`);
      } else {
        console.log(`      ✅ DOĞRU: Desteklenen klinik iddia 'verified' olarak etiketlendi.`);
      }
    }

    if (auditOk) {
      passed++;
      console.log(`   ✅ BAŞARILI: Makale Denetimi negatif ve çelişen iddialarda yanlış destekleme hatası vermiyor!`);
    }
  } catch (err) {
    console.error(`   ❌ HATA:`, err.message);
  }

  console.log('\n================================================================');
  console.log(`📊 SONUÇ: ${passed}/${total} Test Başarıyla Geçti (%${Math.round(passed/total*100)})`);
  console.log('================================================================');
}

runTests();
