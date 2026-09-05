import { matchCriticalNegativeCase } from '../server/services/criticalRefutations.js';

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

const dummyPapers = Array.from({length: 12}, (_, i) => ({
  id: 'p' + i,
  title: 'Clinical trial study on cardiology and therapy ' + i,
  year: 2023,
  authors: [{ lastName: 'Smith' + i }],
  trTakeaway: 'Klinik arastirma bulgulari primer sonlanim noktalarinda anlamli klinik iyilesme gostermektedir.',
  stance: 'positive',
  studyType: 'Randomized Controlled Trial'
}));

const bulletPoints = dummyPapers.map(p => ({
  citation: `[SMITH${p.id.slice(1)} 2023]`,
  cleanText: p.trTakeaway,
  text: `${p.trTakeaway} [SMITH${p.id.slice(1)} 2023]`,
  studyType: p.studyType,
  year: 2023
}));

const c = (idx, fallback = 'LİTERATÜR 2024') => bulletPoints[idx]?.citation || `[${fallback}]`;

const query = 'Hipertansiyonda ACE inhibitörleri ve ARB kombinasyonu etkili midir?';
const consensus = { yes: 15, no: 80, possibly: 5 };

// Section 1
const p1 = `Hakemli bilimsel literatürdeki kapsamlı ampirik kanıtlar ve randomize klinik araştırmalar, **"${query}"** hipotezini **desteklememektedir** (%${consensus.no} ret/negatif uzlaşı) ${c(0)}. İncelenen kontrollü çalışmalarda plaseboya veya standart tekli blokaj tedavisine kıyasla istatistiksel olarak anlamlı bir sağkalım üstünlüğü saptanamamış olup, mevcut kanıtlar bu kombinasyonun iddia edilen etkiyi sağlamadığını ve uluslararası kılavuzlarca önerilmediğini ortaya koymaktadır ${c(1)}. Taranan uluslararası hakemli veri tabanlarında (PubMed, Cochrane, OpenAlex) yer alan temel araştırmalar incelendiğinde; birincil klinik ve laboratuvar parametrelerinde tutarlı ampirik eğilimler saptanmıştır ${c(2)}. ${bulletPoints[0].cleanText} ${c(0)}. ${bulletPoints[1].cleanText} ${c(1)}. ${bulletPoints[2].cleanText} ${c(2)}. Bu ampirik veriler, incelenen konunun klinik karar verme süreçlerinde ve kanıta dayalı tıp hiyerarşisinde sağlam bir zemine oturduğunu göstermektedir ${c(3)}.`;

// Section 2
const p2 = `**"${query}"** bağlamında gözlenen klinik yanıtların altında yatan biyomoleküler ve hücresel mekanizmalar, hedef dokulardaki spesifik fizyolojik yolaklar ve biyokimyasal etkileşimler üzerinden şekillenmektedir ${c(4)}. Hücresel düzeyde gerçekleşen reseptör bağlanması, intraselüler sinyal iletim kaskadları ve gen ekspresyonu modülasyonu, gözlenen klinik fenotipin temel itici gücünü oluşturmaktadır ${c(5)}. ${bulletPoints[3].cleanText} ${c(3)}. ${bulletPoints[4].cleanText} ${c(4)}. Bu mekanistik süreçler bir araya geldiğinde; doku homeostazının yeniden tesisi, hücresel adaptasyon mekanizmalarının aktivasyonu ve hedef organ perfüzyonunun regülasyonu sağlanmaktadır ${c(5)}.`;

// Section 3
const p3 = `İncelenen klinik araştırmalar (faz-2/3 randomize kontrollü deneyler, prospektif kohortlar ve gözlemsel seriler), farklı hasta popülasyonlarında ve klinik protokollerde değişken etki büyüklükleri sergilemektedir ${c(6)}. ${bulletPoints[5].cleanText} ${c(5)}. ${bulletPoints[6].cleanText} ${c(6)}. ${bulletPoints[7].cleanText} ${c(7)}. Protokoller arası karşılaştırmalar; uygulama dozajının, tedavi süresinin ve hasta uyumunun (adherence) klinik başarı oranları ve etki büyüklüğü (etki boyutu / NNT) üzerinde belirleyici olduğunu ortaya koymaktadır ${c(8)}. Raporlanan risk oranları (RR), olasılık oranları (OR) ve tehlike oranları (HR), %95 güven aralığında istatistiksel anlamlılık düzeyini (p < 0.05) koruyarak ampirik güvenirliği pekiştirmektedir ${c(9)}.`;

// Section 4
const p4 = `Klinik uygulamada etkinliğin yanı sıra güvenlik profilinin de titizlikle değerlendirilmesi gerektiğinden, literatürdeki advers olay bildirimleri ve tolere edilebilirlik oranları ayrıntılı olarak analiz edilmiştir ${c(10)}. ${bulletPoints[8].cleanText} ${c(8)}. ${bulletPoints[9].cleanText} ${c(9)}. Mevcut araştırmalar, özellikle ileri yaş, renal veya hepatik yetmezlik gibi komorbiditeleri olan hastalarda potansiyel ilaç etkileşimleri ve fizyolojik kısıtlılıklar nedeniyle yakın klinik takip gerektiğini göstermektedir ${c(10)}. Literatürde gözlenen sınırlı sayıdaki çelişkili veya nötr bulguların ise; örneklem büyüklüğünün heterojenliği, hasta seçim kriterlerindeki değişkenlik veya takip süresinin farklılığından kaynaklandığı metodolojik olarak kaydedilmiştir ${c(11)}.`;

// Section 5
const p5 = `Uluslararası bilimsel kılavuzlar ve uzman konsensüs raporları (AHA, ESC, ADA, IDSA, WHO, NICE, EULAR ve Cochrane), **"${query}"** alanında elde edilen verilerin klinik pratiğe aktarılmasında net tavsiyeler sunmaktadır ${c(0)}. ${bulletPoints[10].cleanText} ${c(10)}. Klinisyenlerin tanı ve tedavi süreçlerinde standart kılavuz eşiklerini dikkate alması, laboratuvar ve görüntüleme parametrelerini düzenli izlemesi ve hasta bazlı kişiselleştirilmiş kararlar vermesi önerilmektedir ${c(1)}. Bu alanda hazırlanacak bir tez veya akademik çalışmanın; uzun dönemli takip verilerini, biyobelirteç dinamiklerini ve özel alt grupları incelemesi literatüre yüksek impaktlı ve özgün bir bilimsel katkı sağlayacaktır ${c(2)}.`;

const sections = [
  { title: 'Bölüm 1', content: p1 },
  { title: 'Bölüm 2', content: p2 },
  { title: 'Bölüm 3', content: p3 },
  { title: 'Bölüm 4', content: p4 },
  { title: 'Bölüm 5', content: p5 }
];

let total = 0;
sections.forEach((s, idx) => {
  const sc = countSentences(s.content);
  total += sc;
  console.log(`[Bölüm ${idx+1}]: ${sc} cümle`);
});
console.log('TOTAL SENTENCES:', total);
