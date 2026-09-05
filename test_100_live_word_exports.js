/**
 * Live 100-request benchmark on /api/export-thesis-word
 */

import http from 'http';

const totalRequests = 100;
let completed = 0;
let successCount = 0;
let errorCount = 0;

console.log(`🚀 /api/export-thesis-word Canlı Uç Noktasına 100 Eşzamanlı/Sıralı İstek Testi Başlatılıyor...`);

function runRequest(idx) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      title: `Canlı Stres Testi #${idx + 1}: Tip 2 Diyabette Kardiyorenal Koruma`,
      topic: 'Metformin ve SGLT2 İnhibitörleri',
      pico: {
        population: 'Yetişkin T2D Olguları',
        intervention: 'Empagliflozin',
        comparison: 'Plasebo / Standart Bakım',
        outcome: 'Kardiyovasküler Ölüm & eGFR Kaybı'
      },
      papers: [
        {
          id: `live_paper_${idx}`,
          title: `EMPA-REG OUTCOME Çok Merkezli RKÇ #${idx}`,
          authors: ['Zinman B', 'Wanner C'],
          year: 2021,
          journal: 'New Engl J Med',
          studyType: 'Randomized Controlled Trial',
          gradeRisk: { overallBias: 'Low Risk', overallGrade: 'Yüksek' }
        },
        {
          id: `live_paper_2_${idx}`,
          title: `DAPA-CKD Kronik Böbrek Hastalığı Analizi #${idx}`,
          authors: ['Heerspink HJL', 'Kasapoğlu E'],
          year: 2022,
          journal: 'Lancet',
          studyType: 'Systematic Review',
          gradeRisk: { overallBias: 'Low Risk', overallGrade: 'Yüksek' }
        }
      ],
      synthesis: {
        directAnswer: `Test #${idx + 1} için klinik kanıt sentezi.`,
        structuredSynthesis: {
          clinicalVerdict: 'Kardiyorenal fayda kanıtlanmıştır.',
          biologicalMechanism: 'Glukozüri ve sodyumüri sağlar.',
          contradictionsAndRisks: 'Genital mikotik enfeksiyon riski.',
          practicalGuidelines: 'Günde 10mg sabah dozu.'
        },
        criticalResearchGaps: ['İleri evre KBH verileri']
      },
      citationStyle: idx % 2 === 0 ? 'vancouver' : 'apa'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/export-thesis-word',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let dataLen = 0;
      res.on('data', chunk => dataLen += chunk.length);
      res.on('end', () => {
        if (res.statusCode === 200 && dataLen > 1000) {
          successCount++;
        } else {
          errorCount++;
          console.error(`İstek #${idx} başarısız: HTTP ${res.statusCode}, len: ${dataLen}`);
        }
        completed++;
        resolve();
      });
    });

    req.on('error', (err) => {
      errorCount++;
      console.error(`İstek #${idx} ağ hatası:`, err.message);
      completed++;
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

async function runAll() {
  const startTime = Date.now();
  
  // Run in 10 batches of 10 requests for realistic concurrent client simulation
  for (let batch = 0; batch < 10; batch++) {
    const batchPromises = [];
    for (let i = 0; i < 10; i++) {
      batchPromises.push(runRequest(batch * 10 + i));
    }
    await Promise.all(batchPromises);
    process.stdout.write(`.` );
  }

  const duration = Date.now() - startTime;
  console.log(`\n\n================================================================`);
  console.log(`🏁 100 CANLI WORD İHRACI TESTİ TAMAMLANDI!`);
  console.log(`⏱️ Toplam Süre: ${duration} ms (Ortalama: ${(duration / 100).toFixed(1)} ms/istek)`);
  console.log(`✅ Başarılı İstek: ${successCount} / 100 (%${(successCount / 100 * 100).toFixed(0)})`);
  console.log(`❌ Hatalı İstek: ${errorCount} / 100`);
  console.log(`================================================================`);

  if (errorCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAll();
