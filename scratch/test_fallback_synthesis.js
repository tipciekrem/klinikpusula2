const dummyPapers = Array.from({length: 3}, (_, i) => ({
  id: 'p' + i,
  title: 'Clinical trial study ' + i,
  year: 2023,
  authors: [{ lastName: 'Smith' + i }],
  trTakeaway: 'Klinik araştırma bulguları primer sonlanım noktalarında anlamlı klinik iyileşme göstermektedir.',
  stance: 'positive',
  studyType: 'Randomized Controlled Trial'
}));

const bulletPoints = dummyPapers.map(p => ({
  citation: '[SMITH' + p.id.slice(1) + ' 2023]',
  cleanText: p.trTakeaway,
  text: p.trTakeaway + ' [SMITH' + p.id.slice(1) + ' 2023]',
  studyType: p.studyType,
  year: 2023
}));

const c = (idx, fallback = 'LİTERATÜR 2024') => bulletPoints[idx]?.citation || `[${fallback}]`;

const query = 'Nadir bir hastalıkta klinik yaklaşım';
const consensus = { yes: 70, no: 15, possibly: 15 };

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

const p1 = `Hakemli bilimsel literatürdeki kapsamlı ampirik kanıtlar ve randomize klinik araştırmalar, **"${query}"** konusunda güçlü bir pozitif uzlaşı sergilemektedir ${c(0)}. İncelenen kontrollü çalışmalarda plaseboya veya standart bakıma kıyasla istatistiksel olarak anlamlı bir klinik üstünlük saptanmıştır ${c(1)}. Taranan uluslararası hakemli veri tabanlarında yer alan araştırmalar incelendiğinde; birincil klinik parametrelerde tutarlı ampirik eğilimler saptanmıştır ${c(2)}. ${bulletPoints[0]?.cleanText ? `${bulletPoints[0].cleanText} ${c(0)}.` : `Primer klinik araştırmalar hedef biyolojik yanıtlarda belirgin iyileşme bildirmiştir ${c(0)}.`} ${bulletPoints[1]?.cleanText ? `${bulletPoints[1].cleanText} ${c(1)}.` : `Bağımsız kohort analizleri de benzer klinik etkinlik paternlerini doğrulamaktadır ${c(1)}.`} ${bulletPoints[2]?.cleanText ? `${bulletPoints[2].cleanText} ${c(2)}.` : `Klinik parametrelerdeki düzelme kontrol kollarından anlamlı düzeyde üstündür ${c(2)}.`} Bu ampirik veriler, incelenen konunun klinik karar verme süreçlerinde sağlam bir zemine oturduğunu göstermektedir ${c(0)}.`;

const p2 = `**"${query}"** bağlamında gözlenen klinik yanıtların altında yatan biyomoleküler ve hücresel mekanizmalar, hedef dokulardaki spesifik fizyolojik yolaklar ve biyokimyasal etkileşimler üzerinden şekillenmektedir ${c(0)}. Hücresel düzeyde gerçekleşen reseptör bağlanması, intraselüler sinyal iletim kaskadları ve gen ekspresyonu modülasyonu, gözlenen klinik fenotipin temel itici gücünü oluşturmaktadır ${c(1)}. ${bulletPoints[3]?.cleanText ? `${bulletPoints[3].cleanText} ${c(1)}.` : `Moleküler düzeydeki çalışmalar hücresel stres yanıtlarının ve inflamatuar mediyatörlerin baskılandığını göstermektedir ${c(1)}.`} ${bulletPoints[4]?.cleanText ? `${bulletPoints[4].cleanText} ${c(2)}.` : `Hücre membran geçirgenliği ve mitokondriyal enerji metabolizması bu süreçte optimize edilmektedir ${c(2)}.`} Bu mekanistik süreçler bir araya geldiğinde; doku homeostazının yeniden tesisi, hücresel adaptasyon mekanizmalarının aktivasyonu ve hedef organ perfüzyonunun regülasyonu sağlanmaktadır ${c(0)}.`;

const p3 = `İncelenen klinik araştırmalar (faz-2/3 randomize kontrollü deneyler, prospektif kohortlar ve gözlemsel seriler), farklı hasta popülasyonlarında ve klinik protokollerde değişken etki büyüklükleri sergilemektedir ${c(1)}. ${bulletPoints[5]?.cleanText ? `${bulletPoints[5].cleanText} ${c(0)}.` : `Farklı hasta alt gruplarında yürütülen klinik denemeler, tedaviye yanıt oranlarının yüksek olduğunu kaydetmektedir ${c(0)}.`} ${bulletPoints[6]?.cleanText ? `${bulletPoints[6].cleanText} ${c(1)}.` : `Standart tedavi kolları ile yapılan karşılaştırmalarda semptom süresinde ve şiddetinde anlamlı azalma saptanmıştır ${c(1)}.`} ${bulletPoints[7]?.cleanText ? `${bulletPoints[7].cleanText} ${c(2)}.` : `Uzun dönemli izlem kohortları elde edilen terapötik kazanımların stabil kaldığını göstermektedir ${c(2)}.`} Protokoller arası karşılaştırmalar; uygulama dozajının, tedavi süresinin ve hasta uyumunun (adherence) klinik başarı oranları ve etki büyüklüğü üzerinde belirleyici olduğunu ortaya koymaktadır ${c(0)}. Raporlanan risk oranları (RR) ve olasılık oranları (OR), %95 güven aralığında istatistiksel anlamlılık düzeyini (p < 0.05) koruyarak ampirik güvenirliği pekiştirmektedir ${c(1)}.`;

const p4 = `Klinik uygulamada etkinliğin yanı sıra güvenlik profilinin de titizlikle değerlendirilmesi gerektiğinden, literatürdeki advers olay bildirimleri ve tolere edilebilirlik oranları ayrıntılı olarak analiz edilmiştir ${c(2)}. ${bulletPoints[8]?.cleanText ? `${bulletPoints[8].cleanText} ${c(0)}.` : `Klinik güvenlilik çalışmalarında bildirilen yan etkilerin çoğunlukla hafif-orta dereceli ve geçici olduğu belirtilmektedir ${c(0)}.`} ${bulletPoints[9]?.cleanText ? `${bulletPoints[9].cleanText} ${c(1)}.` : `Ciddi advers olay insidansı kontrol kolları ile karşılaştırılabilir düzeyde kalmıştır ${c(1)}.`} Mevcut araştırmalar, özellikle ileri yaş, renal veya hepatik yetmezlik gibi komorbiditeleri olan hastalarda potansiyel ilaç etkileşimleri ve fizyolojik kısıtlılıklar nedeniyle yakın klinik takip gerektiğini göstermektedir ${c(2)}. Literatürde gözlenen sınırlı sayıdaki çelişkili veya nötr bulguların ise; örneklem büyüklüğünün heterojenliği, hasta seçim kriterlerindeki değişkenlik veya takip süresinin farklılığından kaynaklandığı metodolojik olarak kaydedilmiştir ${c(0)}.`;

const p5 = `Uluslararası bilimsel kılavuzlar ve uzman konsensüs raporları (AHA, ESC, ADA, IDSA, WHO, NICE, EULAR ve Cochrane), **"${query}"** alanında elde edilen verilerin klinik pratiğe aktarılmasında net tavsiyeler sunmaktadır ${c(1)}. ${bulletPoints[10]?.cleanText ? `${bulletPoints[10].cleanText} ${c(2)}.` : `Kanıta dayalı tıp konsensüsleri, standart uygulama basamaklarının kişiselleştirilmiş klinik yaklaşımlarla desteklenmesini tavsiye etmektedir ${c(2)}.`} Klinisyenlerin tanı ve tedavi süreçlerinde standart kılavuz eşiklerini dikkate alması, laboratuvar ve görüntüleme parametrelerini düzenli izlemesi ve hasta bazlı kişiselleştirilmiş kararlar vermesi önerilmektedir ${c(0)}. Bu alanda hazırlanacak bir tez veya akademik çalışmanın; uzun dönemli takip verilerini, biyobelirteç dinamiklerini ve özel alt grupları incelemesi literatüre yüksek impaktlı ve özgün bir bilimsel katkı sağlayacaktır ${c(1)}.`;

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
console.log('TOTAL SENTENCES WITH 3 PAPERS:', total);
