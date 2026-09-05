import { optimizeAcademicQuery } from './server/services/queryOptimizer.js';
import { searchOpenAlex } from './server/services/academicSearch.js';
import { calculateConsensusMeter, generateSynthesis } from './server/services/consensusEngine.js';

const QS = [
  { id: 35, cat: 'Romatoloji', query: 'Kronik gut artritinde allopurinol ürik asit seviyesini düşürerek tofüs gerilemesini sağlar mı?', expectedConsensus: 'yes' },
  { id: 38, cat: 'Romatoloji', query: 'Psöriyatik artritte IL-17 inhibitörleri sekukinumab periferik artriti geriletir mi?', expectedConsensus: 'yes' },
  { id: 39, cat: 'Romatoloji', query: 'Behçet hastalığında vasküler ve oküler tutulumda immünsüpresif tedavi körlüğü önler mi?', expectedConsensus: 'yes' },
  { id: 40, cat: 'Romatoloji', query: 'Primer Sjögren sendromunda pilokarpin ağız kuruluğu semptomlarını hafifletir mi?', expectedConsensus: 'yes' },
  { id: 44, cat: 'Gastroenteroloji', query: 'Nonalkolik steatohepatitte resmetirom karaciğer fibrozisinde gerileme sağlar mı?', expectedConsensus: 'yes' }
];

async function check() {
  console.log('4 HIZLI DOĞRULAMA TESTİ:');
  for (const q of QS) {
    const res = await searchOpenAlex({ query: q.query, page: 1, perPage: 10, mode: 'medical' });
    const c = calculateConsensusMeter(res.papers, q.query);
    console.log(`[#${q.id}] ${q.cat} -> ${res.papers.length} makale | Konsensüs: %${c.yes}E / %${c.no}H | "${c.verdict}"`);
  }
}

check();
