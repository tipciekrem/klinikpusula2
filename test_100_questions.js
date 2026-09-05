import { optimizeAcademicQuery } from './server/services/queryOptimizer.js';
import { searchOpenAlex } from './server/services/academicSearch.js';
import { calculateConsensusMeter, generateSynthesis } from './server/services/consensusEngine.js';
import { isEnglishText } from './server/services/translationEngine.js';

export const QUESTIONS_100 = [
  // 1-10: Kardiyoloji & Vasküler Tıp
  { id: 1, cat: 'Kardiyoloji', query: 'ACE inhibitörleri kuru öksürüğe neden olur mu?', expectedConsensus: 'yes' },
  { id: 2, cat: 'Kardiyoloji', query: 'Statinler kas ağrısı ve rabdomiyoliz riskini artırır mı?', expectedConsensus: 'yes' },
  { id: 3, cat: 'Kardiyoloji', query: 'SGLT2 inhibitörleri ejeksiyon fraksiyonu korunmuş kalp yetersizliğinde sağkalımı artırır mı?', expectedConsensus: 'yes' },
  { id: 4, cat: 'Kardiyoloji', query: 'Atriyal fibrilasyonda yeni nesil oral antikoagülanlar varfarinden daha mı güvenlidir?', expectedConsensus: 'yes' },
  { id: 5, cat: 'Kardiyoloji', query: 'TAVI yüksek cerrahi riskli aort darlığında cerrahi kapak değişimine üstün müdür?', expectedConsensus: 'yes' },
  { id: 6, cat: 'Kardiyoloji', query: 'Kalp yetersizliğinde ARNI sakubitril valsartan enalaprile kıyasla kardiyovasküler ölümü azaltır mı?', expectedConsensus: 'yes' },
  { id: 7, cat: 'Kardiyoloji', query: 'Akut koroner sendromda koroner stent sonrası 12 ay ikili antiplatelet tedavi şart mıdır?', expectedConsensus: 'yes' },
  { id: 8, cat: 'Kardiyoloji', query: 'Dirençli hipertansiyonda renal denervasyon kan basıncını anlamlı düşürür mü?', expectedConsensus: 'yes' },
  { id: 9, cat: 'Kardiyoloji', query: 'Beta blokerler korunmuş ejeksiyon fraksiyonlu kalp yetmezliğinde mortaliteyi azaltır mı?', expectedConsensus: 'no' },
  { id: 10, cat: 'Kardiyoloji', query: 'Klopidogrel direnci CYP2C19 polimorfizmi olan hastalarda stent trombozu riskini artırır mı?', expectedConsensus: 'yes' },

  // 11-20: Endokrinoloji & Metabolizma
  { id: 11, cat: 'Endokrinoloji', query: 'Semaglutid obezitesi olan diyabetsiz hastalarda kardiyovasküler olayları azaltır mı?', expectedConsensus: 'yes' },
  { id: 12, cat: 'Endokrinoloji', query: 'Metformin kullanan hastalarda laktik asidoz riski klinik olarak yüksek midir?', expectedConsensus: 'no' },
  { id: 13, cat: 'Endokrinoloji', query: 'Tip 2 diyabette tirzepatid kilo kaybında semaglutidden daha mı üstündür?', expectedConsensus: 'yes' },
  { id: 14, cat: 'Endokrinoloji', query: 'SGLT2 inhibitörleri öglisemik diyabetik ketoasidoz riskini artırır mı?', expectedConsensus: 'yes' },
  { id: 15, cat: 'Endokrinoloji', query: 'Subklinik hipotiroidide hafif TSH yüksekliğinde rutin levotiroksin tedavisi kardiyovasküler fayda sağlar mı?', expectedConsensus: 'no' },
  { id: 16, cat: 'Endokrinoloji', query: 'Tiroid ince iğne aspirasyon biyopsisinde Bethesda 3 ve 4 nodüllerde moleküler testler gereksiz cerrahiyi azaltır mı?', expectedConsensus: 'yes' },
  { id: 17, cat: 'Endokrinoloji', query: 'D vitamini takviyesi genel popülasyonda osteoporoza bağlı kırık riskini önlemede etkili midir?', expectedConsensus: null },
  { id: 18, cat: 'Endokrinoloji', query: 'Cushing hastalığında transsfenoidal hipofiz cerrahisi medikal tedaviden daha mı başarılıdır?', expectedConsensus: 'yes' },
  { id: 19, cat: 'Endokrinoloji', query: 'Akromegalide uzun etkili somatostatin analogları GH ve IGF-1 düzeylerini kontrol altına alır mı?', expectedConsensus: 'yes' },
  { id: 20, cat: 'Endokrinoloji', query: 'Hipogonadizmi olan erkeklerde testosteron replasman tedavisi majör kardiyovasküler olayları artırır mı?', expectedConsensus: 'no' },

  // 21-30: Nöroloji & Nöroşirürji
  { id: 21, cat: 'Nöroloji', query: 'Erken evre Alzheimer hastalığında lekanemab bilişsel gerilemeyi yavaşlatır mı?', expectedConsensus: 'yes' },
  { id: 22, cat: 'Nöroloji', query: 'Parkinson hastalığında levodopa uzun dönemde motor dalgalanmalara yol açar mı?', expectedConsensus: 'yes' },
  { id: 23, cat: 'Nöroloji', query: 'Akut iskemik inmede ilk 4.5 saatte trombolitik alteplaz nörolojik sekelleri azaltır mı?', expectedConsensus: 'yes' },
  { id: 24, cat: 'Nöroloji', query: 'Multipl sklerozda natalizumab tedavisi JCV antikoru pozitif hastalarda progresif multifokal lökoensefalopati riskini artırır mı?', expectedConsensus: 'yes' },
  { id: 25, cat: 'Nöroloji', query: 'Kronik migren profilaksisinde CGRP monoklonal antikorları etkili midir?', expectedConsensus: 'yes' },
  { id: 26, cat: 'Nöroloji', query: 'Amiyotrofik lateral sklerozda riluzol genel sağkalımı anlamlı şekilde uzatır mı?', expectedConsensus: 'yes' },
  { id: 27, cat: 'Nöroloji', query: 'Status epileptikus acil tedavisinde intravenöz lorazepam fenitoinden daha mı üstündür?', expectedConsensus: 'yes' },
  { id: 28, cat: 'Nöroloji', query: 'Non-timomatöz myastenia graviste timektomi klinik remisyon oranlarını artırır mı?', expectedConsensus: 'yes' },
  { id: 29, cat: 'Nöroloji', query: 'Semptomatik karotis darlığında cerrahi endarterektomi stentlemeye kıyasla inme riskini daha fazla azaltır mı?', expectedConsensus: 'yes' },
  { id: 30, cat: 'Nöroloji', query: 'Huzursuz bacak sendromunda uzun süreli dopamin agonisti kullanımı semptomlarda augmentasyona yol açar mı?', expectedConsensus: 'yes' },

  // 31-40: Romatoloji & Klinik İmmünoloji
  { id: 31, cat: 'Romatoloji', query: 'Romatoid artritte metotreksat ilk basamak tedavi olarak ne kadar etkilidir?', expectedConsensus: 'yes' },
  { id: 32, cat: 'Romatoloji', query: 'Ankilozan spondilitte anti-TNF biyolojik tedaviler omurga ankilozunu ve radyografik progresyonu yavaşlatır mı?', expectedConsensus: 'yes' },
  { id: 33, cat: 'Romatoloji', query: 'Aksiyel spondiloartrit spektrumunda kadın ve erkek görülme sıklığı eşit midir?', expectedConsensus: 'yes' },
  { id: 34, cat: 'Romatoloji', query: 'Sistemik lupus eritematozusta hidroksiklorokin mortaliteyi ve alevlenmeleri azaltır mı?', expectedConsensus: 'yes' },
  { id: 35, cat: 'Romatoloji', query: 'Kronik gut artritinde allopurinol ürik asit seviyesini düşürerek tofüs gerilemesini sağlar mı?', expectedConsensus: 'yes' },
  { id: 36, cat: 'Romatoloji', query: 'Sistemik sklerozda intertisyel akciğer tutulumunda mikofenolat mofetil siklofosfamidden daha iyi tolere edilir mi?', expectedConsensus: 'yes' },
  { id: 37, cat: 'Romatoloji', query: 'Dev hücreli arteritte IL-6 inhibitörü tocilizumab kortikosteroid ihtiyacını azaltır mı?', expectedConsensus: 'yes' },
  { id: 38, cat: 'Romatoloji', query: 'Psöriyatik artritte IL-17 inhibitörleri sekukinumab periferik artriti geriletir mi?', expectedConsensus: 'yes' },
  { id: 39, cat: 'Romatoloji', query: 'Behçet hastalığında vasküler ve oküler tutulumda immünsüpresif tedavi körlüğü önler mi?', expectedConsensus: 'yes' },
  { id: 40, cat: 'Romatoloji', query: 'Primer Sjögren sendromunda pilokarpin ağız kuruluğu semptomlarını hafifletir mi?', expectedConsensus: 'yes' },

  // 41-50: Gastroenteroloji & Hepatoloji
  { id: 41, cat: 'Gastroenteroloji', query: 'Helicobacter pylori eradikasyonu peptik ülser nüksünü engeller mi?', expectedConsensus: 'yes' },
  { id: 42, cat: 'Gastroenteroloji', query: 'Crohn hastalığında erken basamakta biyolojik anti-TNF başlanması bağırsak rezeksiyonu riskini düşürür mü?', expectedConsensus: 'yes' },
  { id: 43, cat: 'Gastroenteroloji', query: 'Ülseratif kolitte vedolizumab barsak selektif etkisiyle sistemik enfeksiyon riskini azaltır mı?', expectedConsensus: 'yes' },
  { id: 44, cat: 'Gastroenteroloji', query: 'Nonalkolik steatohepatitte resmetirom karaciğer fibrozisinde gerileme sağlar mı?', expectedConsensus: 'yes' },
  { id: 45, cat: 'Gastroenteroloji', query: 'Siroz zemininde gelişen özofagus varislerinde nonselektif beta blokerler kanama mortalitesini düşürür mü?', expectedConsensus: 'yes' },
  { id: 46, cat: 'Gastroenteroloji', query: 'Akut biliyer pankreatitte erken enteral beslenme parenteral beslenmeye kıyasla enfeksiyon komplikasyonlarını azaltır mı?', expectedConsensus: 'yes' },
  { id: 47, cat: 'Gastroenteroloji', query: 'Nüks Clostridioides difficile enfeksiyonunda fekal mikrobiyota nakli vankomisine üstün müdür?', expectedConsensus: 'yes' },
  { id: 48, cat: 'Gastroenteroloji', query: 'Koledokolitiyazis tanısında MRCP tanısal duyarlılığı ERCP ile eşdeğer midir?', expectedConsensus: 'yes' },
  { id: 49, cat: 'Gastroenteroloji', query: 'Çölyak hastalığında sıkı glutensiz diyet intestinal villöz atrofinin tam histolojik düzelmesini sağlar mı?', expectedConsensus: 'yes' },
  { id: 50, cat: 'Gastroenteroloji', query: 'Kolorektal kanser taramasında kolonoskopi 10 yıllık kansere bağlı mortaliteyi belirgin azaltır mı?', expectedConsensus: 'yes' },

  // 51-60: Nefroloji & Üroloji
  { id: 51, cat: 'Nefroloji', query: 'Kronik böbrek yetmezliğinde düşük proteinli diyet diyalize gidişi geciktirir mi?', expectedConsensus: 'yes' },
  { id: 52, cat: 'Nefroloji', query: 'Dapagliflozin diyabetik olmayan kronik böbrek hastalarında da böbrek fonksiyon kaybını yavaşlatır mı?', expectedConsensus: 'yes' },
  { id: 53, cat: 'Nefroloji', query: 'IgA nefropatisinde immünglobulin A birikimi proteinüri düzeyiyle korele midir?', expectedConsensus: 'yes' },
  { id: 54, cat: 'Nefroloji', query: 'Lupus nefritinde standart tedaviye belimumab eklenmesi tam böbrek yanıtını artırır mı?', expectedConsensus: 'yes' },
  { id: 55, cat: 'Nefroloji', query: 'Otozomal dominant polikistik böbrek hastalığında tolvaptan kist büyüme hızını yavaşlatır mı?', expectedConsensus: 'yes' },
  { id: 56, cat: 'Nefroloji', query: 'Diyaliz hastalarında hemodiyaliz periton diyalizine kıyasla ilk 2 yılda sağkalım farkı yaratır mı?', expectedConsensus: null },
  { id: 57, cat: 'Nefroloji', query: 'Metastatik renal hücreli karsinomda immünoterapi kombinasyonları tirozin kinaz inhibitörlerine üstün müdür?', expectedConsensus: 'yes' },
  { id: 58, cat: 'Nefroloji', query: 'Benign prostat hiperplazisinde 5-alfa redüktaz inhibitörleri prostat hacmini küçülterek akut üriner retansiyonu önler mi?', expectedConsensus: 'yes' },
  { id: 59, cat: 'Nefroloji', query: 'Asemptomatik erkeklerde rutin PSA taraması tüm nedenlere bağlı mortaliteyi azaltır mı?', expectedConsensus: 'no' },
  { id: 60, cat: 'Nefroloji', query: 'Komplike olmayan alt idrar yolu enfeksiyonlarında tek doz fosfomisin florokinolonlar kadar etkili midir?', expectedConsensus: 'yes' },

  // 61-70: Onkoloji & Hematoloji
  { id: 61, cat: 'Onkoloji', query: 'Meme kanserinde trastuzumab HER2 pozitif olgularda sağkalımı belirgin uzatır mı?', expectedConsensus: 'yes' },
  { id: 62, cat: 'Onkoloji', query: 'EGFR mutasyonlu küçük hücreli dışı akciğer kanserinde osimertinib birinci basamakta progresyonsuz sağkalımı uzatır mı?', expectedConsensus: 'yes' },
  { id: 63, cat: 'Onkoloji', query: 'İleri evre melanomda anti-PD-1 monoklonal antikorları kemoterapiye kıyasla 5 yıllık sağkalımı artırır mı?', expectedConsensus: 'yes' },
  { id: 64, cat: 'Onkoloji', query: 'Multipl miyelomda bortezomib bazlı üçlü indüksiyon tedavisi kök hücre nakli başarısını artırır mı?', expectedConsensus: 'yes' },
  { id: 65, cat: 'Onkoloji', query: 'Evre 3 kolon kanserinde adjuvan FOLFOX kemoterapisi rekürrens riskini azaltır mı?', expectedConsensus: 'yes' },
  { id: 66, cat: 'Onkoloji', query: 'Refrakter B hücreli lenfomalarda CAR-T hücre tedavisi sitokin salınım sendromu riskine rağmen kalıcı tam remisyon sağlar mı?', expectedConsensus: 'yes' },
  { id: 67, cat: 'Onkoloji', query: 'Kronik immün trombositopenide (ITP) trombopoietin reseptör agonistleri kanama riskini azaltır mı?', expectedConsensus: 'yes' },
  { id: 68, cat: 'Onkoloji', query: 'Yoğun kemoterapiye uygun olmayan AML hastalarında venetoklaks ve azasitidin kombinasyonu genel sağkalımı uzatır mı?', expectedConsensus: 'yes' },
  { id: 69, cat: 'Onkoloji', query: 'Metastatik pankreas kanserinde FOLFIRINOX rejimi gemsitabin monoterapisinden daha yüksek sağkalım sağlar mı?', expectedConsensus: 'yes' },
  { id: 70, cat: 'Onkoloji', query: 'Hodgkin lenfomada brentuksimab vedotin bleomisinin neden olduğu pulmoner toksisiteyi azaltır mı?', expectedConsensus: 'yes' },

  // 71-80: Enfeksiyon Hastalıkları & Mikrobiyoloji
  { id: 71, cat: 'Enfeksiyon', query: 'Lyme hastalığında post-tedavi lyme sendromunda uzun süreli antibiyotik yararlı mıdır?', expectedConsensus: 'no' },
  { id: 72, cat: 'Enfeksiyon', query: 'Yüksek riskli COVID-19 hastalarında nirmatrelvir ritonavir hospitalizasyon ve ölüm oranını azaltır mı?', expectedConsensus: 'yes' },
  { id: 73, cat: 'Enfeksiyon', query: 'HIV temas öncesi profilakside (PrEP) oral tenofovir emtrisitabin cinsel bulaş riskini belirgin düşürür mü?', expectedConsensus: 'yes' },
  { id: 74, cat: 'Enfeksiyon', query: 'Ventilatör ilişkili pnömonide antibiyotik deeskalasyonu tedavi başarısızlığını artırır mı?', expectedConsensus: 'no' },
  { id: 75, cat: 'Enfeksiyon', query: 'Septik şok resüsitasyonunda dengeli kristalloidler normal saline kıyasla akut böbrek hasarı ve mortaliteyi azaltır mı?', expectedConsensus: 'yes' },
  { id: 76, cat: 'Enfeksiyon', query: 'Bakteriyel menenjitte antibiyotikten önce veya antibiyotikle eşzamanlı deksametazon işitme kaybını önler mi?', expectedConsensus: 'yes' },
  { id: 77, cat: 'Enfeksiyon', query: 'Kalıcı idrar sondası olan asemptomatik hastalarda profilaktik antibiyotik kullanımı dirençli bakteri gelişimini artırır mı?', expectedConsensus: 'yes' },
  { id: 78, cat: 'Enfeksiyon', query: 'Kronik hepatit C enfeksiyonunda direkt etkili antivirallerle yüzde 95 üzerinde kalıcı virolojik yanıt elde edilir mi?', expectedConsensus: 'yes' },
  { id: 79, cat: 'Enfeksiyon', query: 'Tüberküloz tanısında GeneXpert moleküler testi rifampisin direncini mikroskopiye göre saatler içinde saptar mı?', expectedConsensus: 'yes' },
  { id: 80, cat: 'Enfeksiyon', query: 'Akut influenza enfeksiyonunda ilk 48 saatte başlanan oseltamivir semptom süresini kısaltır mı?', expectedConsensus: 'yes' },

  // 81-90: Pediatri & Çocuk Sağlığı
  { id: 81, cat: 'Pediatri', query: 'Kızamık aşısı otizme yol açar mı?', expectedConsensus: 'no' },
  { id: 82, cat: 'Pediatri', query: 'Asetil salisilik asit çocuklarda reye sendromuna neden olabilir mi?', expectedConsensus: 'yes' },
  { id: 83, cat: 'Pediatri', query: 'Prematüre bebeklerde anne sütü formül mamaya kıyasla nekrotizan enterokolit riskini azaltır mı?', expectedConsensus: 'yes' },
  { id: 84, cat: 'Pediatri', query: 'Basit febril konvülsiyon geçiren çocuklarda sürekli antiepileptik profilaksi zeka geriliğini önler mi?', expectedConsensus: 'no' },
  { id: 85, cat: 'Pediatri', query: 'Yenidoğan indirekt hiperbilirubinemisinde fototerapi kan değişimi ihtiyacını ve kernikterusu önler mi?', expectedConsensus: 'yes' },
  { id: 86, cat: 'Pediatri', query: 'Çocukluk çağı astımında düşük doz inhale kortikosteroidler erişkin nihai boyunu kalıcı olarak kısaltır mı?', expectedConsensus: 'no' },
  { id: 87, cat: 'Pediatri', query: 'Tip 1 diyabetli çocuklarda sürekli glukoz takip sistemleri HbA1c ve şiddetli hipoglisemi riskini düşürür mü?', expectedConsensus: 'yes' },
  { id: 88, cat: 'Pediatri', query: 'Kistik fibroziste üçlü CFTR modülatör tedavisi akciğer fonksiyonlarında belirgin iyileşme sağlar mı?', expectedConsensus: 'yes' },
  { id: 89, cat: 'Pediatri', query: 'Akut ileokolik intussusepsiyonda ultrason eşliğinde hidrostatik lavman ile redüksiyon ameliyat ihtiyacını azaltır mı?', expectedConsensus: 'yes' },
  { id: 90, cat: 'Pediatri', query: 'Prematüre retinopatisinde intravitreal anti-VEGF enjeksiyonu lazer fotokoagülasyona kıyasla miyopi gelişimini azaltır mı?', expectedConsensus: 'yes' },

  // 91-100: Göğüs Hastalıkları, Psikiyatri & Genel Tıp
  { id: 91, cat: 'Pulmonoloji', query: 'Kronik obstrüktif akciğer hastalığında inhale kortikosteroidler pnömoni riskini artırır mı?', expectedConsensus: 'yes' },
  { id: 92, cat: 'Pulmonoloji', query: 'İdiyopatik pulmoner fibroziste pirfenidon ve nintedanib zorlu vital kapasitedeki yıllık düşüşü yavaşlatır mı?', expectedConsensus: 'yes' },
  { id: 93, cat: 'Pulmonoloji', query: 'Ağır eozinofilik astımda anti-IL-5 monoklonal antikorları astım alevlenmelerini azaltır mı?', expectedConsensus: 'yes' },
  { id: 94, cat: 'Pulmonoloji', query: 'Akut pulmoner emboli tedavisinde direkt oral antikoagülanlar DMAH ve varfarine kıyasla majör kanamayı azaltır mı?', expectedConsensus: 'yes' },
  { id: 95, cat: 'Psikiyatri', query: 'Depresyon tedavisinde SSRI grubu antidepresanların plaseboya üstünlüğü kanıtlanmış mıdır?', expectedConsensus: null },
  { id: 96, cat: 'Psikiyatri', query: 'Bipolar bozuklukta uzun dönem lityum tedavisi intihar riskini anlamlı ölçüde azaltır mı?', expectedConsensus: 'yes' },
  { id: 97, cat: 'Psikiyatri', query: 'Tedaviye dirençli şizofrenide klozapin antipsikotik etkinliği diğer atipik antipsikotiklerden üstün müdür?', expectedConsensus: 'yes' },
  { id: 98, cat: 'Psikiyatri', query: 'Erişkin dikkat eksikliği ve hiperaktivite bozukluğunda metilfenidat çalışma belleği ve dikkati artırır mı?', expectedConsensus: 'yes' },
  { id: 99, cat: 'Genel Tıp', query: 'Gebelikte parasetamol kullanımı çocukta dikkat eksikliği ve otizm riskini artırır mı?', expectedConsensus: 'yes' },
  { id: 100, cat: 'Genel Tıp', query: 'Ketojenik diyet ilaca dirençli epilepsili çocuklarda nöbet sıklığını azaltır mı?', expectedConsensus: 'yes' }
];

export async function run100Tests() {
  console.log('======================================================================');
  console.log('  KLİNİKPUSULA 100 FARKLI LİTERATÜR TARAMASI & GÜVENLİLİK ANALİZİ  ');
  console.log('======================================================================\n');

  const results = [];
  let passCount = 0;
  const anomalies = [];

  const BATCH_SIZE = 4;
  for (let i = 0; i < QUESTIONS_100.length; i += BATCH_SIZE) {
    const batch = QUESTIONS_100.slice(i, i + BATCH_SIZE);
    
    await Promise.all(batch.map(async (item) => {
      const startTime = Date.now();
      const testReport = {
        id: item.id,
        cat: item.cat,
        query: item.query,
        passed: false,
        optimizedQuery: '',
        papersCount: 0,
        consensus: null,
        sectionsCount: 0,
        hasTable: false,
        englishLeakageDetected: false,
        durationMs: 0,
        notes: []
      };

      try {
        // 1. Query Optimization
        const opt = await optimizeAcademicQuery(item.query);
        testReport.optimizedQuery = opt.primaryQuery;

        // 2. Academic Search
        const searchRes = await searchOpenAlex({
          query: item.query,
          page: 1,
          perPage: 10,
          mode: 'medical'
        });
        testReport.papersCount = searchRes.papers ? searchRes.papers.length : 0;

        if (testReport.papersCount < 3) {
          testReport.notes.push(`Düşük makale sayısı: ${testReport.papersCount}`);
        }

        // 3. Consensus Calculation
        const consensus = calculateConsensusMeter(searchRes.papers, item.query);
        testReport.consensus = consensus;

        if (item.expectedConsensus === 'no' && consensus.yes > consensus.no) {
          testReport.notes.push(`Konsensüs yönü uyumsuz (Beklenen Hayır, Alınan Evet: %${consensus.yes})`);
        } else if (item.expectedConsensus === 'yes' && consensus.no > consensus.yes) {
          testReport.notes.push(`Konsensüs yönü uyumsuz (Beklenen Evet, Alınan Hayır: %${consensus.no})`);
        }

        // 4. Synthesis & Table Generation
        const synth = await generateSynthesis(searchRes.papers, item.query, consensus);
        testReport.sectionsCount = synth.sections ? synth.sections.length : 0;
        testReport.hasTable = (synth.sections || []).some(s => s.type === 'table' || (s.title && s.title.includes('Karşılaştırma')));

        // 5. English Leakage Detection
        let leakFound = false;
        for (const sec of (synth.sections || [])) {
          if (sec.content && typeof sec.content === 'string') {
            const sentences = sec.content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 30);
            for (const s of sentences) {
              if (isEnglishText(s)) {
                leakFound = true;
                testReport.notes.push(`İngilizce sızıntısı: "${s.slice(0, 50)}..."`);
                break;
              }
            }
          }
        }
        testReport.englishLeakageDetected = leakFound;

        // Quality check criteria
        const isSuccess = testReport.papersCount >= 3 &&
                          testReport.sectionsCount >= 2 &&
                          !testReport.englishLeakageDetected &&
                          testReport.notes.length === 0;

        testReport.passed = isSuccess;
        testReport.durationMs = Date.now() - startTime;

        if (isSuccess) {
          passCount++;
          console.log(`[PASS] #${item.id} [${item.cat}] ${item.query.slice(0, 45)}... -> ${testReport.papersCount} makale, %${consensus.yes}E/%${consensus.no}H (${(testReport.durationMs / 1000).toFixed(1)}s)`);
        } else {
          console.warn(`[FAIL] #${item.id} [${item.cat}] ${item.query.slice(0, 45)}... -> Notlar: ${testReport.notes.join(' | ')}`);
          anomalies.push(testReport);
        }

      } catch (err) {
        testReport.notes.push(`Hata: ${err.message}`);
        console.error(`[ERR] #${item.id} İstisna:`, err.message);
        anomalies.push(testReport);
      }

      results.push(testReport);
    }));

    // Gentle 100ms pause between batches
    await new Promise(r => setTimeout(r, 100));
  }

  // Sort results by id
  results.sort((a, b) => a.id - b.id);
  const successRate = Math.round((passCount / QUESTIONS_100.length) * 100);

  console.log('\n======================================================================');
  console.log(`  ANALİZ TAMAMLANDI: ${passCount}/100 BAŞARILI (%${successRate} BAŞARI ORANI)`);
  console.log(`  ANOMALİ / DÜZELTİLMESİ GEREKEN HATA SAYISI: ${anomalies.length}`);
  console.log('======================================================================\n');

  return {
    successRate,
    passCount,
    total: QUESTIONS_100.length,
    anomalies,
    results
  };
}

if (process.argv[1]?.endsWith('test_100_questions.js')) {
  run100Tests().then(res => {
    if (res.anomalies.length > 0) {
      console.log('\n--- TESPİT EDİLEN ANOMALİLER ---');
      res.anomalies.forEach(a => {
        console.log(`[#${a.id} ${a.cat}] "${a.query}" -> ${a.notes.join(', ')}`);
      });
    }
  });
}
