/**
 * Critical Clinical Refutations & Medical Myths Knowledge Base
 * 100 Globally Recognized Disproven Interventions, Ineffective Practices,
 * Landmark Negative RCT Findings, and Medical Myths across 10 specialties.
 */

export const CRITICAL_NEGATIVE_CASES = [
  // =========================================================================
  // 1. ENFEKSİYON HASTALIKLARI & MİKROBİYOLOJİ (Vaka 1 - 10)
  // =========================================================================
  {
    id: 1,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'Viral üst solunum yolu enfeksiyonlarında rutin antibiyotik',
    claimSentence: 'Viral üst solunum yolu enfeksiyonlarında amoksisilin-klavulanat tedavisi semptom süresini belirgin biçimde kısaltır ve komplikasyonları önler.',
    keywords: ['antibiyotik', 'amoksisilin', 'viral', 'nezle', 'grip', 'soguk alginligi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Antibiyotikler Viral Nezle/Gripte Tamamen Etkisizdir)',
    noPct: 95,
    medicalRationale: 'Cochrane ve CDC kılavuzları: Antibiyotikler viral patojenlere etki etmez, semptom süresini kısaltmaz ve yalnızca bakteriyel direnç ile advers etkilere yol açar.'
  },
  {
    id: 2,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'Asemptomatik bakteriyüride rutin antibiyotik tedavisi',
    claimSentence: 'Asemptomatik bakteriyürisi olan yaşlı bireylerde antibiyotik tedavisi mortaliteyi ve böbrek hasarı riskini azaltmaktadır.',
    keywords: ['asemptomatik bakteriyuri', 'asemptomatik bakteri', 'idrar yolu', 'antibiyotik'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - IDSA Kılavuzları: Gebe ve Ürolojik Cerrahi Dışı ASB Tedavi Edilmez)',
    noPct: 88,
    medicalRationale: 'IDSA kılavuzları: Gebe kadınlar ve mukozal kanamalı ürolojik girişimler haricinde asemptomatik bakteriyürinin tedavisi dirençli suş gelişimini ve C. difficile riskini artırır.'
  },
  {
    id: 3,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'Post-Lyme sendromunda uzun süreli antibiyotik tedavisi',
    claimSentence: 'Kronik post-Lyme sendromunda aylarca süren intravenöz seftriakson tedavisi bilişsel fonksiyonları ve yorgunluğu kalıcı olarak iyileştirir.',
    keywords: ['lyme', 'post lyme', 'kronik lyme', 'antibiyotik', 'seftriakson'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - NIH & IDSA: Uzun Süreli Antibiyotiğin Kanıtlanmış Faydası Yoktur)',
    noPct: 85,
    medicalRationale: 'NIH çok merkezli RKÇ\'leri: Uzun süreli antibiyotik plaseboya üstünlük göstermemiş, kateter sepsisi ve fatal komplikasyon riskini artırmıştır.'
  },
  {
    id: 4,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'COVID-19 tedavisinde ivermektin kullanımı',
    claimSentence: 'İvermektin kullanımı COVID-19 hastalarında hastaneye yatış ve mortalite oranlarını anlamlı ölçüde düşürmektedir.',
    keywords: ['ivermektin', 'ivermectin', 'covid', 'korona', 'sars-cov-2'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor / Etkisizdir (Hayır - İvermektin COVID-19\'da Klinik Fayda Sağlamaz)',
    noPct: 92,
    medicalRationale: 'TOGETHER, ACTIV-6 ve PRINCIPLE randomize kontrollü çalışmaları: İvermektin mortalite, semptom süresi veya mekanik ventilasyon ihtiyacını azaltmamıştır.'
  },
  {
    id: 5,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'COVID-19 tedavisinde hidroksiklorokin kullanımı',
    claimSentence: 'Hidroksiklorokin tedavisi COVID-19 ile enfekte hastalarda mortaliteyi azaltmakta ve viral klirensi hızlandırmaktadır.',
    keywords: ['hidroksiklorokin', 'hydroxychloroquine', 'plaquenil', 'covid'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - RECOVERY & SOLIDARITY: Hidroksiklorokin Mortaliteyi Düşürmez)',
    noPct: 94,
    medicalRationale: 'RECOVERY ve DSÖ SOLIDARITY çalışmaları: Hidroksiklorokin sağkalımı artırmadığı gibi ölümcül kardiyak disritmi ve QTc uzaması riskini artırmaktadır.'
  },
  {
    id: 6,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'Viral solunum yolu enfeksiyonlu çocuklarda aspirin',
    claimSentence: 'İnfluenza veya suçiçeği geçiren çocuklarda ateşi düşürmek için aspirin güvenli ve birinci basamak bir ajandır.',
    keywords: ['aspirin', 'cocuk', 'pediatri', 'viral', 'influenza', 'reye'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Reye Sendromu Riski Nedeniyle Kesin Kontrendikedir)',
    noPct: 98,
    medicalRationale: 'CDC ve FDA: Viral enfeksiyonlu çocuklarda aspirin kullanımı ölümcül hepatik disfonksiyon ve beyin ödemi ile giden Reye sendromuna yol açar; kesin kontrendikedir.'
  },
  {
    id: 7,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'Kızamık / KKK aşılarının otizme neden olduğu iddiası',
    claimSentence: 'Kızamık ve KKK aşıları çocuklarda otizm spektrum bozukluğu gelişimine neden olmaktadır.',
    keywords: ['asi', 'aşı', 'kizamik', 'kızamık', 'mmr', 'otizm', 'autism'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Aşılar Otizme Yol Açmaz - Hayır)',
    noPct: 96,
    medicalRationale: 'Wakefield\'ın hileli makalesi Lancet tarafından tamamen geri çekilmiş; 1.25 milyondan fazla çocuğu içeren kohort ve meta-analizlerde aşı-otizm ilişkisi çürütülmüştür.'
  },
  {
    id: 8,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'Hafif-orta akut pankreatitte rutin profilaktik antibiyotik',
    claimSentence: 'Akut pankreatit tanısı alan her hastada enfeksiyon gelişimini önlemek için rutin profilaktik antibiyotik başlanmalıdır.',
    keywords: ['pankreatit', 'antibiyotik', 'profilaksi', 'profilaktik'],
    requiredKeywords: ['pankreatit'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - IAP/APA Kılavuzları: Rutin Profilaktik Antibiyotik Önerilmez)',
    noPct: 82,
    medicalRationale: 'Cochrane derlemeleri ve IAP/APA kılavuzları: Enfeksiyöz nekroz kanıtı olmaksızın rutin antibiyotik mortaliteyi düşürmez ve mantar süperenfeksiyonlarını artırır.'
  },
  {
    id: 9,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'Komplike olmayan divertikülitte rutin antibiyotik',
    claimSentence: 'Bilgisayarlı tomografi ile kanıtlanmış komplike olmayan akut sol kolon divertikülitinde sistemik antibiyotik zorunludur.',
    keywords: ['divertikulit', 'antibiyotik', 'komplike olmayan'],
    requiredKeywords: ['divertikulit'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - AVOD & DIABOLO: Semptomatik İzlem Antibiyotiksiz Eşdeğerdir)',
    noPct: 80,
    medicalRationale: 'AVOD ve DIABOLO çok merkezli RKÇ\'leri: Komplike olmayan divertikülitte antibiyotiksiz izlem iyileşme süresi, nüks ve komplikasyon açısından antibiyotiğe eşdeğerdir.'
  },
  {
    id: 10,
    specialty: 'Enfeksiyon Hastalıkları',
    topic: 'Asemptomatik C. difficile taşıyıcılığında oral vankomisin',
    claimSentence: 'İshal veya kolit bulgusu olmayan ancak gaita PCR pozitif olan asemptomatik C. difficile taşıyıcıları rutin vankomisin ile tedavi edilmelidir.',
    keywords: ['difficile', 'asemptomatik', 'vankomisin', 'tasiyici'],
    requiredKeywords: ['asemptomatik', 'tasiyici', 'kolonizasyon'],
    excludeKeywords: ['fidaksomisin'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - SHEA/IDSA: Asemptomatik Kolonizasyon Tedavi Edilmez)',
    noPct: 86,
    medicalRationale: 'SHEA/IDSA kılavuzları: Asemptomatik taşıyıcılıkta antibiyotik bağırsak mikrobiyotasını daha da bozarak klinik psödomembranöz enterokolit nüksünü tetikler.'
  },

  // =========================================================================
  // 2. KARDİYOLOJİ & KARDİYOVASKÜLER TIP (Vaka 11 - 20)
  // =========================================================================
  {
    id: 11,
    specialty: 'Kardiyoloji',
    topic: 'Stabil KAH olgularında rutin acil stent/PCI',
    claimSentence: 'Kronik stabil koroner arter hastalığında rutin perkütan girişim (stent), optimal medikal tedaviye kıyasla miyokard enfarktüsü ve kardiyak ölümü belirgin azaltır.',
    keywords: ['stabil koroner', 'stabil kah', 'stent', 'pci', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - COURAGE & ISCHEMIA: Medikal Tedaviye Mortalite Üstünlüğü Yoktur)',
    noPct: 82,
    medicalRationale: 'COURAGE ve ISCHEMIA landmark çalışmaları: Kronik koroner sendromlarda optimal medikal tedaviye rutin PCI eklenmesi MI ve genel mortaliteyi azaltmamaktadır.'
  },
  {
    id: 12,
    specialty: 'Kardiyoloji',
    topic: 'HFpEF hastalarında rutin beta bloker sağkalım faydası',
    claimSentence: 'Korunmuş ejeksiyon fraksiyonlu kalp yetersizliğinde (HFpEF) beta bloker tedavisi tüm nedenlere bağlı mortaliteyi anlamlı derecede düşürmektedir.',
    keywords: ['beta bloker', 'hfpef', 'korunmus ejeksiyon', 'kalp yetersizligi', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - HFpEF\'de Sağkalım Faydası Gösterilememiştir)',
    noPct: 78,
    medicalRationale: 'ESC ve ACC/AHA kılavuzları: HFrEF\'in aksine HFpEF fenotipinde beta blokerlerin kardiyovasküler ölüm veya hastane yatışını azalttığı kanıtlanmamıştır.'
  },
  {
    id: 13,
    specialty: 'Kardiyoloji',
    topic: 'Primer korumada sağlıklı yaşlılarda rutin aspirin',
    claimSentence: 'Kardiyovasküler hastalığı bulunmayan sağlıklı yaşlı bireylerde primer koruma amacıyla günlük düşük doz aspirin genel sağkalımı uzatır.',
    keywords: ['aspirin', 'primer koruma', 'yasli', 'saglikli', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - ASPREE & ARRIVE: Kanama Riski Kardiyak Faydayı Aşmaktadır)',
    noPct: 84,
    medicalRationale: 'ASPREE (19.000 hasta) ve ARRIVE çalışmaları: Primer korumada aspirin net kardiyovasküler sağkalım yararı sağlamamakta, majör ölümcül kanamaları artırmaktadır.'
  },
  {
    id: 14,
    specialty: 'Kardiyoloji',
    topic: 'Hormon replasman tedavisinin (HRT) kardiyoprotektif etkisi',
    claimSentence: 'Menopoz sonrası kadınlarda sistemik östrojen-progestin tedavisi kardiyovasküler olayları önlemek amacıyla rutin olarak önerilmelidir.',
    keywords: ['hormon replasman', 'hrt', 'ostrojen', 'kardiyovaskuler', 'koroner'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - WHI Çalışması: KAH ve İnme Riskini Artırmaktadır)',
    noPct: 90,
    medicalRationale: 'Women\'s Health Initiative (WHI) landmark çalışması: HRT kardiyovasküler koruma sağlamadığı gibi koroner arter hastalığı, inme ve venöz tromboemboli riskini artırır.'
  },
  {
    id: 15,
    specialty: 'Kardiyoloji',
    topic: 'Kardiyovasküler korumada yüksek doz E vitamini takviyesi',
    claimSentence: 'Yüksek doz E vitamini antioksidan takviyesi aterosklerozu gerileterek kalp yetersizliği ve miyokard enfarktüsü riskini azaltır.',
    keywords: ['e vitamini', 'antioksidan', 'kardiyovaskuler', 'kalp yetersizligi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - HOPE-TOO: Faydasızdır ve Kalp Yetersizliği Riskini Artırabilir)',
    noPct: 85,
    medicalRationale: 'HOPE ve HOPE-TOO çalışmaları: E vitamini takviyesi kardiyovasküler sonlanımları iyileştirmemekte, kalp yetersizliği nedeniyle hastaneye yatış riskini artırmaktadır.'
  },
  {
    id: 16,
    specialty: 'Kardiyoloji',
    topic: 'Homosistein düşürmek için folik asit / B vitamini',
    claimSentence: 'Koroner arter hastalarında folik asit ve B12 vitamini ile plazma homosistein düzeyini düşürmek kardiyovasküler mortaliteyi azaltır.',
    keywords: ['homosistein', 'folik asit', 'b vitamini', 'kardiyovaskuler'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - NORVIT & HOPE-2: Homosistein Düşürülmesi Sonlanımları Değiştirmez)',
    noPct: 80,
    medicalRationale: 'NORVIT ve HOPE-2 çalışmaları: Homosistein düzeyinin biyokimyasal olarak düşürülmesi majör kardiyovasküler olay (MACE) riskini azaltmamaktadır.'
  },
  {
    id: 17,
    specialty: 'Kardiyoloji',
    topic: 'Akut kalp yetersizliğinde rutin nesiritid infüzyonu',
    claimSentence: 'Akut dekompanse kalp yetersizliğinde rutin rekombinant BNP (nesiritid) infüzyonu 30 günlük rehospitalizasyon ve mortaliteyi düşürür.',
    keywords: ['nesiritid', 'nesiritide', 'akut kalp yetersizligi', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - ASCEND-HF: Mortalite veya Rehospitalizasyon Farkı Yoktur)',
    noPct: 78,
    medicalRationale: 'ASCEND-HF çalışması (7.000 hasta): Standart tedaviye nesiritid eklenmesi dispnede klinik olarak anlamlı bir üstünlük sağlamamış, mortaliteyi değiştirmemiştir.'
  },
  {
    id: 18,
    specialty: 'Kardiyoloji',
    topic: 'Kardiyak cerrahi sonrası aritmi için rutin magnezyum',
    claimSentence: 'Koroner bypass cerrahisi geçiren her hastada rutin profilaktik intravenöz magnezyum infüzyonu atriyal fibrilasyon ve mortaliteyi sıfırlar.',
    keywords: ['magnezyum', 'bypass', 'atriyal fibrilasyon', 'profilaksi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Rutin Profilaksinin Genel Sağkalım Avantajı Gösterilememiştir)',
    noPct: 75,
    medicalRationale: 'Meta-analizler: Hipomagnezemi düzeltilmelidir ancak normomagnezemik hastalarda rutin agresif magnezyum infüzyonu mortalite veya yoğun bakım süresini etkilemez.'
  },
  {
    id: 19,
    specialty: 'Kardiyoloji',
    topic: 'Testosteron replasmanının kardiyak olayları artırdığı iddiası',
    claimSentence: 'Hipogonadizmi olan erkeklerde fizyolojik testosteron replasman tedavisi majör kardiyovasküler olay (MACE) riskini doğrudan katlar.',
    keywords: ['testosteron', 'testosterone', 'mace', 'kardiyovaskuler', 'kalp krizi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - TRAVERSE Çalışması: MACE Riskinde Artış Gösterilmemiştir)',
    noPct: 82,
    medicalRationale: 'TRAVERSE landmark RKÇ\'si (5.246 hasta, NEJM 2023): Hipogonadotropik erkeklerde testosteron tedavisi plaseboya kıyasla MACE insidansını artırmamıştır.'
  },
  {
    id: 20,
    specialty: 'Kardiyoloji',
    topic: 'Metforminin normal böbrekte yüksek laktik asidoz riski',
    claimSentence: 'Tip 2 diyabet tedavisinde metformin kullanımı böbrek fonksiyonu normal hastalarda dahi son derece yüksek laktik asidoz riski taşır.',
    keywords: ['metformin', 'laktik asidoz', 'lactic acidosis', 'bobrek', 'zarar'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Laktik Asidoz İnsidansı 100.000\'de 4.3 Olup Son Derece Nadirdir)',
    noPct: 85,
    medicalRationale: 'Cochrane derlemesi (70.000 hasta-yılı): Normal eGFR düzeyine sahip hastalarda metformin kaynaklı laktik asidoz diğer antidiyabetiklerden farksızdır.'
  },

  // =========================================================================
  // 3. NÖROLOJİ & PSİKİYATRİ (Vaka 21 - 30)
  // =========================================================================
  {
    id: 21,
    specialty: 'Nöroloji',
    topic: 'Akut iskemik inmede rutin tam doz heparin / antikoagülasyon',
    claimSentence: 'Akut iskemik inme tanısıyla başvuran hastalarda rutin tam doz intravenöz heparin erken dönemde nörolojik iyileşmeyi ve sağkalımı belirgin artırır.',
    keywords: ['inme', 'iskemik inme', 'heparin', 'antikoagulasyon', 'sagkalim'],
    requiredKeywords: ['heparin', 'antikoagulan', 'antikoagulasyon', 'kan sulandirici'],
    excludeKeywords: ['alteplaz', 'rt-pa', 't-pa', 'trombektomi', 'trombolitik'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - IST & TOAST: Fatal İntrakraniyal Kanama Riskini Artırmaktadır)',
    noPct: 86,
    medicalRationale: 'International Stroke Trial (IST) ve TOAST: Erken dönemde rutin tam doz heparin sekonder inmeyi azaltmazken fatal intraserebral hemoraji riskini belirgin artırır.'
  },
  {
    id: 22,
    specialty: 'Nöroloji',
    topic: 'Demansı önlemek amacıyla rutin Ginkgo biloba kullanımı',
    claimSentence: 'Ginkgo biloba standardize ekstresi yaşlı bireylerde bilişsel gerilemeyi durdurur ve Alzheimer demansı insidansını anlamlı ölçüde düşürür.',
    keywords: ['ginkgo', 'ginkgo biloba', 'demans', 'alzheimer', 'hafiza'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - GEM Çalışması: Demansı Önlemede Plasebodan Farksızdır)',
    noPct: 90,
    medicalRationale: 'Ginkgo Evaluation of Memory (GEM) çalışması (3.000 hasta, JAMA): Ginkgo biloba demans insidansını, Alzheimer oranını veya bilişsel gerilemeyi azaltmamıştır.'
  },
  {
    id: 23,
    specialty: 'Nöroloji',
    topic: 'Sigara ve nikotinin Alzheimer riskini azalttığı iddiası',
    claimSentence: 'Kronik sigara içimi ve nikotin maruziyeti Alzheimer hastalığına karşı nöroprotektif etki göstererek demans riskini azaltmaktadır.',
    keywords: ['sigara', 'nikotin', 'alzheimer', 'demans', 'onler'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Sigara Demans Riskini %30-50 Oranında Artırmaktadır)',
    noPct: 95,
    medicalRationale: 'Tütün endüstrisi fonlu erken vaka-kontrol yanlılıkları düzeltildiğinde; bağımsız prospektif kohortlar sigaranın demans ve Alzheimer riskini %30-50 artırdığını kanıtlamıştır.'
  },
  {
    id: 24,
    specialty: 'Nöroloji',
    topic: 'Travmatik beyin hasarında (TBI) yüksek doz kortikosteroid',
    claimSentence: 'Akut travmatik kafa travması geçiren komadaki hastalarda yüksek doz metilprednizolon infüzyonu mortaliteyi azaltır.',
    keywords: ['travmatik beyin', 'kafa travmasi', 'kortikosteroid', 'metilprednizolon', 'crash'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - CRASH Çalışması: Mortaliteyi Belirgin Şekilde Artırmaktadır)',
    noPct: 97,
    medicalRationale: 'CRASH landmark çalışması (10.008 hasta, Lancet): Akut travmatik beyin hasarında steroid kullanımı mortaliteyi anlamlı biçimde artırmıştır; kesin kontrendikedir.'
  },
  {
    id: 25,
    specialty: 'Nöroloji',
    topic: 'Hafif bilişsel bozuklukta (MCI) rutin kolinesteraz inhibitörü',
    claimSentence: 'Hafif bilişsel bozukluğu (MCI) olan hastalarda donepezil tedavisi Alzheimer demansına progresyonu kalıcı olarak durdurmaktadır.',
    keywords: ['mci', 'hafif bilissel', 'donepezil', 'kolinesteraz', 'alzheimer'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - ADCS Çalışması: Alzheimer\'a Progresyonu Önlemez)',
    noPct: 82,
    medicalRationale: 'ADCS ve Cochrane derlemeleri: Donepezil veya rivastigmin MCI hastalarında demansa uzun vadeli dönüşümü engellememekte, gastrointestinal yan etkileri artırmaktadır.'
  },
  {
    id: 26,
    specialty: 'Nöroloji',
    topic: 'Majör depresyonda tek başına akupunktur monoterapisi',
    claimSentence: 'Majör depresif bozuklukta tek başına akupunktur uygulaması antidepresan ilaçlara tam eşdeğer etkinlikte birincil tedavi yöntemidir.',
    keywords: ['akupunktur', 'depresyon', 'tedavi', 'antidepresan'],
    requiredKeywords: ['akupunktur'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Plasebo Şam Akupunkturuna Kanıtlanmış Bir Üstünlüğü Yoktur)',
    noPct: 84,
    medicalRationale: 'Cochrane ve APA psikiyatri kılavuzları: Akupunktur şam (yalancı) kontrollere kıyasla majör depresyonda monoterapi olarak kılavuz düzeyinde kanıt sağlayamamıştır.'
  },
  {
    id: 27,
    specialty: 'Nöroloji',
    topic: 'Basit febril nöbetlerde sürekli antiepileptik profilaksi',
    claimSentence: 'Basit febril havale geçiren çocuklarda nöbetin tekrarlamasını ve epilepsi gelişimini önlemek için sürekli antiepileptik ilaç başlanmalıdır.',
    keywords: ['febril', 'havale', 'nobet', 'profilaksi', 'antiepileptik'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - AAP Kılavuzları: Basit Febril Nöbetlerde Profilaksi Önerilmez)',
    noPct: 85,
    medicalRationale: 'Amerikan Pediatri Akademisi (AAP): Basit febril konvülsiyonlar benign olup sürekli antiepileptik kullanımı sekonder epilepsi gelişimini önlemez, toksisite riski yüksektir.'
  },
  {
    id: 28,
    specialty: 'Nöroloji',
    topic: 'Multipl Sklerozda (MS) CCSVI venöz balon anjiyoplastisi',
    claimSentence: 'Multipl skleroz kronik serebrospinal venöz yetmezliğe (CCSVI) bağlı bir vasküler hastalık olup internal juguler ven anjiyoplastisi ile kürleşir.',
    keywords: ['ms', 'multipl skleroz', 'ccsvi', 'venoz', 'anjiyoplasti'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Kurtuluş Terapisi Efsanesi RKÇ\'lerle Tamamen Çürütülmüştür)',
    noPct: 95,
    medicalRationale: 'Brave Dreams ve PREMISE randomize kontrollü çalışmaları: Şam kontrollü anjiyoplasti MS lezyon yükü, relaps veya engellilik skoru üzerinde hiçbir fayda sağlamamıştır.'
  },
  {
    id: 29,
    specialty: 'Nöroloji',
    topic: 'Kronik insomnide birinci basamak uzun süreli benzodiyazepin',
    claimSentence: 'Aylardır süren kronik uykusuzluk tedavisinde uzun süreli benzodiyazepin kullanımı bilişsel fonksiyonları bozmayan güvenli bir çözümdür.',
    keywords: ['insomni', 'uykusuzluk', 'benzodiyazepin', 'uzun sureli'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Kognitif Davranışçı Terapi (KDT-I) Birincil Tercihtir)',
    noPct: 88,
    medicalRationale: 'AASM ve ESNI kılavuzları: Benzodiyazepinler tolerans, bağımlılık, düşme, kalça kırığı ve demans riskini artırır; kronik insomnide birinci basamak KDT-I\'dır.'
  },
  {
    id: 30,
    specialty: 'Nöroloji',
    topic: 'Akut Bell palsisinde tek başına antiviral monoterapisi',
    claimSentence: 'Akut Bell palsisi tedavisinde tek başına oral asiklovir/valasiklovir verilmesi kortikosteroid kadar etkilidir.',
    keywords: ['bell palsi', 'yuz felci', 'asiklovir', 'antiviral'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Kortikosteroid Olmaksızın Tek Başına Antiviral Etkisizdir)',
    noPct: 82,
    medicalRationale: 'Cochrane derlemeleri ve Sullivan RKÇ\'si: Bell palsisinde iyileşmeyi sağlayan birincil ajan oral prednizolondur; tek başına antiviral plaseboya üstün değildir.'
  },

  // =========================================================================
  // 4. ONKOLOJİ, HEMATOLOJİ & TARAMA (Vaka 31 - 40)
  // =========================================================================
  {
    id: 31,
    specialty: 'Onkoloji',
    topic: 'Alkali diyet veya limonlu sıcak su ile kanser tedavisi',
    claimSentence: 'Limonlu sıcak su ve karbonat ile vücut pH\'sını alkaliye çevirmek kanser hücrelerini tamamen yok eder ve kemoterapi ihtiyacını ortadan kaldırır.',
    keywords: ['limon', 'alkali', 'karbonat', 'kanser', 'tedavi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Bilimsel Dayanağı Yoktur / Yanılgı (Hayır - Alkali Su veya Limon Kanseri İyileştirmez)',
    noPct: 97,
    medicalRationale: 'Onkoloji konsensüsü: Sistemik kan pH\'sı renal ve respiratuvar tamponlarla dengelenir; diyetle tümör mikroçevresi alkali yapılamaz, tedavi gecikmesi ölüme yol açar.'
  },
  {
    id: 32,
    specialty: 'Onkoloji',
    topic: 'Kanser tedavisinde Laetrile / Amigdalin (B17 Vitamini)',
    claimSentence: 'Kayısı çekirdeğinden elde edilen B17 vitamini (Laetrile) tümörleri küçülten güvenli ve etkili bir doğal antikanser ilacıdır.',
    keywords: ['laetril', 'amigdalin', 'b17', 'kayisi cekirdegi', 'kanser'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Cochrane: Etkisizdir ve Siyanür Zehirlenmesine Yol Açar)',
    noPct: 96,
    medicalRationale: 'Cochrane sistematik derlemesi ve NCI: Laetrile kansere karşı klinik hiçbir etkinlik göstermemiş; aksine fatal siyanür zehirlenmesi vakalarına neden olmuştur.'
  },
  {
    id: 33,
    specialty: 'Onkoloji',
    topic: 'Asemptomatik bireylerde rutin PSA taramasının mortaliteyi azaltması',
    claimSentence: 'Asemptomatik genel popülasyonda her yıl yapılan rutin PSA taraması tüm nedenlere bağlı mortaliteyi belirgin olarak düşürmektedir.',
    keywords: ['psa', 'prostat', 'tarama', 'all-cause', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Rutin PSA Taraması Tüm Nedenlere Bağlı Mortaliteyi Azaltmaz)',
    noPct: 78,
    medicalRationale: 'PLCO ve ERSPC çalışmaları: PSA taraması tüm nedenlere bağlı ölümü azaltmamakta, ciddi aşırı tanı (overdiagnosis), erektil disfonksiyon ve inkontinansa yol açmaktadır.'
  },
  {
    id: 34,
    specialty: 'Onkoloji',
    topic: 'Sağlıklı bireylerde check-up amaçlı tüm vücut BT (Whole Body CT)',
    claimSentence: 'Şikayeti olmayan sağlıklı yetişkinlerde check-up amacıyla tüm vücut bilgisayarlı tomografi taraması yaptırmak yaşam süresini uzatır.',
    keywords: ['tum vucut bt', 'whole body ct', 'tarama', 'check-up', 'sagkalim'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - Aşırı Radyasyon ve Yanlış Pozitif Biyopsi Riski Taşır)',
    noPct: 92,
    medicalRationale: 'ACR ve FDA: Asemptomatik popülasyonda tüm vücut BT sağkalım yararı sağlamaz; gereksiz yüksek kümülatif radyasyon ve invaziv biyopsi komplikasyonlarına yol açar.'
  },
  {
    id: 35,
    specialty: 'Onkoloji',
    topic: 'Sigara içenlerde kanseri önlemek için beta-karoten takviyesi',
    claimSentence: 'Sigara içen bireylerde yüksek doz beta-karoten antioksidan takviyesi akciğer kanseri gelişimini engeller.',
    keywords: ['beta karoten', 'sigara', 'akciger kanseri', 'antioksidan'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - CARET & ATBC: Akciğer Kanserini ve Ölümü Artırmıştır)',
    noPct: 94,
    medicalRationale: 'CARET ve ATBC landmark çalışmaları: Sigara içenlerde beta-karoten takviyesi akciğer kanseri insidansını %18 ve genel mortaliteyi %8 artırarak erken sonlandırılmıştır.'
  },
  {
    id: 36,
    specialty: 'Onkoloji',
    topic: 'Asemptomatik MGUS hastalarında erken kemoterapi',
    claimSentence: 'Asemptomatik belirsiz öneme sahip monoklonal gamopatide (MGUS) erken kemoterapiye başlamak multipl miyeloma dönüşümü engeller.',
    keywords: ['mgus', 'monoklonal gamopati', 'kemoterapi', 'erken tedavi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - IMWG: Asemptomatik MGUS Yalnızca Takip Edilmelidir)',
    noPct: 88,
    medicalRationale: 'Uluslararası Miyelom Çalışma Grubu (IMWG): MGUS benign bir premalign durum olup erken kemoterapi miyeloma dönüşümü önlemez, kemik iliği toksisitesi yaratır.'
  },
  {
    id: 37,
    specialty: 'Onkoloji',
    topic: 'Kanser kaşeksisinde megesterol asetatın sağkalım faydası',
    claimSentence: 'İlerlemiş evre kanser kaşeksisinde megesterol asetat kullanımı kas kitlesini artırarak genel sağkalımı anlamlı uzatır.',
    keywords: ['megesterol', 'kanser kaseksi', 'sagkalim', 'kas kitlesi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Yağ Dokusunu Artırabilir Fakat Sağkalımı Uzatmaz, DVT Riskini Artırır)',
    noPct: 80,
    medicalRationale: 'Cochrane derlemeleri: Megesterol iştahı ve yağ dokusunu artırabilir ancak kas kütlesi veya genel sağkalımı artırmaz; derin ven trombozu riskini belirgin yükseltir.'
  },
  {
    id: 38,
    specialty: 'Onkoloji',
    topic: 'Asemptomatik yetişkinlerde yıllık rutin genel check-up',
    claimSentence: 'Hiçbir yakınması olmayan sağlıklı yetişkinlerde yıllık rutin genel laboratuvar ve fizik muayene check-up\'ları mortaliteyi düşürür.',
    keywords: ['check-up', 'yillik tarama', 'genel muayene', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Cochrane Meta-Analizi: Genel veya Kardiyak Mortaliteyi Düşürmez)',
    noPct: 76,
    medicalRationale: 'Cochrane sistematik derlemesi (182.000 hasta): Rutin genel sağlık kontrolleri genel veya kansere bağlı mortaliteyi azaltmamakta; aşırı tanı ve gereksiz tedaviyi artırmaktadır.'
  },
  {
    id: 39,
    specialty: 'Onkoloji',
    topic: 'Meme kanserinde tek başına kendi kendine meme muayenesi',
    claimSentence: 'Kadınların her ay kendi kendine meme muayenesi yapması mamografi olmaksızın meme kanseri mortalitesini yarı yarıya düşürür.',
    keywords: ['kendi kendine meme muayenesi', 'meme kanseri', 'tarama', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Cochrane: Mortaliteyi Azaltmaz, Benign Biyopsi Oranını İkiye Katlar)',
    noPct: 80,
    medicalRationale: 'Cochrane derlemeleri (388.000 kadın): Kendi kendine meme muayenesi mortaliteyi düşürmemekte; benign lezyon biyopsi oranını yaklaşık iki kat artırmaktadır.'
  },
  {
    id: 40,
    specialty: 'Onkoloji',
    topic: 'Düşük riskli Luminal A meme kanserinde rutin kemoterapi',
    claimSentence: 'Hormon reseptör pozitif, HER2 negatif ve düşük genetik rekürrens skorlu erken evre meme kanserinde kemoterapi zorunludur.',
    keywords: ['meme kanseri', 'kemoterapi', 'oncotypedx', 'luminal a'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - TAILORx: Yalnızca Endokrin Tedavi Kemoterapiye Eşdeğerdir)',
    noPct: 85,
    medicalRationale: 'TAILORx landmark çalışması (NEJM): Düşük ve orta rekürrens skorlu kadınlarda endokrin tedaviye kemoterapi eklenmesi invaziv hastalıksız sağkalımı artırmamaktadır.'
  },

  // =========================================================================
  // 5. ENDOKRİNOLOJİ & METABOLİZMA (Vaka 41 - 50)
  // =========================================================================
  {
    id: 41,
    specialty: 'Endokrinoloji',
    topic: 'Hafif subklinik hipotiroidide rutin levotiroksin kullanımı',
    claimSentence: 'TSH düzeyi 4.5 - 10 mIU/L arasında olan asemptomatik yaşlılarda rutin levotiroksin tedavisi yorgunluğu giderir ve kardiyovasküler olayları önler.',
    keywords: ['subklinik hipotiroidi', 'tsh', 'levotiroksin', 'kardiyovaskuler'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - TRUST Çalışması: Hafif Vakada Rutin Levotiroksinin Klinik Faydası Yoktur)',
    noPct: 78,
    medicalRationale: 'TRUST landmark RKÇ\'si (NEJM): TSH < 10 olan subklinik hipotiroidi hastalarında levotiroksin yaşam kalitesini, bilişsel fonksiyonu veya kas gücünü iyileştirmemiştir.'
  },
  {
    id: 42,
    specialty: 'Endokrinoloji',
    topic: 'Tip 2 diyabette aşırı agresif glisemik hedef (HbA1c < %6.0)',
    claimSentence: 'Uzun süreli tip 2 diyabet hastalarında HbA1c hedefini agresif olarak yüzde altının altına çekmek mortaliteyi belirgin azaltır.',
    keywords: ['hba1c', 'tip 2 diyabet', 'agresif glisemik', 'accord', 'mortalite'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - ACCORD Çalışması: Mortaliteyi ve Hipoglisemiyi Artırmaktadır)',
    noPct: 88,
    medicalRationale: 'ACCORD landmark çalışması (10.000 hasta, NEJM): İntensif kontrol grubunda (HbA1c < %6.0) kardiyovasküler ölüm oranı anlamlı biçimde daha yüksek çıkmış ve çalışma durdurulmuştur.'
  },
  {
    id: 43,
    specialty: 'Endokrinoloji',
    topic: 'Benign tiroid nodülünde rutin levotiroksin süpresyonu',
    claimSentence: 'İİAB ile benign olduğu doğrulanmış ötiroid tiroid nodüllerinde nodülü küçültmek için yüksek doz levotiroksin baskılama tedavisi verilmelidir.',
    keywords: ['tiroid nodulu', 'levotiroksin supresyon', 'baskilama', 'kucultur'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - ATA Kılavuzları: Osteoporoz ve Aritmi Riski Nedeniyle Önerilmez)',
    noPct: 85,
    medicalRationale: 'Amerikan Tiroid Birliği (ATA): TSH baskılama tedavisi benign nodülleri klinik olarak anlamlı küçültmez; atrial fibrilasyon ve kemik kaybı riskini artırır.'
  },
  {
    id: 44,
    specialty: 'Endokrinoloji',
    topic: 'Genel popülasyonda kırıkları önlemek için rutin D vitamini',
    claimSentence: 'D vitamini eksikliği olmayan sağlıklı yetişkinlerde yüksek doz D vitamini takviyesi kemik kırıklarını ve kanser gelişimini önler.',
    keywords: ['d vitamini', 'kemik kirigi', 'vital calismasi', 'kanser onleme'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - VITAL Çalışması: Kırık veya Kanser Riskini Azaltmamıştır)',
    noPct: 82,
    medicalRationale: 'VITAL landmark çalışması (25.871 hasta, NEJM): Genel popülasyonda D vitamini takviyesi plaseboya kıyasla kemik kırıklarını, kardiyovasküler olayları veya kanseri azaltmamıştır.'
  },
  {
    id: 45,
    specialty: 'Endokrinoloji',
    topic: 'Bölgesel karın içi yağ yakan bitkisel karışımlar',
    claimSentence: 'Özel bitkisel detoks çayları ve ekstreler diyet yapmadan doğrudan göbek ve visseral yağları kalıcı olarak eritir.',
    keywords: ['yag yakan', 'detoks', 'gobek eriten', 'zayiflama cayi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Bilimsel Dayanağı Yoktur / Yanılgı (Hayır - Metabolik Olarak İmkansızdır ve Karaciğer Hasarı Riski Taşır)',
    noPct: 96,
    medicalRationale: 'Endokrin konsensüsü: Bölgesel yağ yakımı fizyolojik olarak mümkün değildir; zayıflama çayları sıklıkla gizli sibutramin, laksatif veya tiroid hormonu içerip toksisite yaratır.'
  },
  {
    id: 46,
    specialty: 'Endokrinoloji',
    topic: 'Prediyabette yaşam tarzı olmaksızın testosteron ile diyabet kürü',
    claimSentence: 'Prediyabetik erkeklerde yaşam tarzı ve kilo kontrolü olmaksızın sadece testosteron enjeksiyonu ile diyabet riski tamamen ortadan kalkar.',
    keywords: ['prediyabet', 'testosteron', 'diyabet kuru', 'yasam tarzi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Yaşam Tarzı Değişikliği Olmaksızın Kalıcı Koruma Sağlanamaz)',
    noPct: 80,
    medicalRationale: 'DPP çalışmaları: Diyabet önlenmesinde altın standart yaşam tarzı değişikliği ve kilo kontrolüdür; hormon tedavisi yaşam tarzı olmaksızın kür sağlayamaz.'
  },
  {
    id: 47,
    specialty: 'Endokrinoloji',
    topic: 'Tirotoksik periyodik paralizide kontrolsüz IV potasyum yükleme',
    claimSentence: 'Tirotoksik hipokalemik periyodik paralizi atağında kas gücünü hızla düzeltmek için yüksek hızda agresif intravenöz potasyum infüze edilmelidir.',
    keywords: ['tirotoksik', 'hipokalemik periyodik paralizi', 'potasyum yukleme', 'rebound'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Rebound Hiperkalemi ve Fatal Aritmi Riski Taşır)',
    noPct: 88,
    medicalRationale: 'Endokrin acilleri: Paralizide vücut toplam potasyumu azalmamış, hücre içine kaymıştır; aşırı potasyum verilmesi paralizi düzelirken ölümcül hiperkalemiye yol açar.'
  },
  {
    id: 48,
    specialty: 'Endokrinoloji',
    topic: 'DKA hastalarında pH > 6.9 iken rutin sodyum bikarbonat',
    claimSentence: 'Diyabetik ketoasidozda kan pH değeri 6.9 üzerinde olan hastalarda asidozu hızla nötralize etmek için rutin IV bikarbonat verilmelidir.',
    keywords: ['diyabetik ketoasidoz', 'dka', 'bikarbonat', 'asidoz'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - ADA Kılavuzları: Paradoksal Beyin Asidozu ve Hipokalemi Riskini Artırır)',
    noPct: 85,
    medicalRationale: 'Amerikan Diyabet Birliği (ADA): pH > 6.9 DKA olgularında bikarbonat iyileşmeyi hızlandırmaz; paradoksal intraserebral asidoz, hipokalemi ve hipoksiye yol açar.'
  },
  {
    id: 49,
    specialty: 'Endokrinoloji',
    topic: 'Asemptomatik hiperürisemide rutin allopürinol tedavisi',
    claimSentence: 'Gut atağı veya ürolitiyazisi olmayan yalnızca laboratuvarda ürik asidi yüksek bulunan her asemptomatik bireye rutin allopürinol başlanmalıdır.',
    keywords: ['asemptomatik hiperurisemi', 'allopurinol', 'urik asit', 'gut'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - ACR Kılavuzları: Asemptomatik Hiperürisemi İlaçla Tedavi Edilmez)',
    noPct: 82,
    medicalRationale: 'ACR kılavuzları: Asemptomatik hiperürisemisi olan bireylerin çoğunda gut gelişmez; allopürinole bağlı Stevens-Johnson ve DRESS sendromu riski tedaviyi gereksiz kılar.'
  },
  {
    id: 50,
    specialty: 'Endokrinoloji',
    topic: 'Septik şok dışı kritik hastalarda rutin yüksek doz steroid',
    claimSentence: 'Yoğun bakımda yatan mekanik ventilatördeki non-septik tüm kritik hastalarda rutin yüksek doz kortikosteroid verilmesi sağkalımı artırır.',
    keywords: ['yogun bakim', 'kritik hasta', 'kortikosteroid', 'steroid', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Sekonder Enfeksiyon ve Miyopati Riskini Artırmaktadır)',
    noPct: 80,
    medicalRationale: 'Surviving Sepsis Campaign: Refrakter septik şok haricindeki genel kritik hastalarda rutin yüksek doz steroid immünosüpresyon ve nozokomiyal enfeksiyonu artırır.'
  },

  // =========================================================================
  // 6. NEFROLOJİ & ÜROLOJİ (Vaka 51 - 60)
  // =========================================================================
  {
    id: 51,
    specialty: 'Nefroloji',
    topic: 'Sağlıklı sporcularda kreatinin böbrek hasarı yaptığı iddiası',
    claimSentence: 'Kreatin monohidrat takviyesi sağlıklı genç sporcularda doğrudan glomerüler hasar oluşturarak akut ve kronik böbrek yetmezliğine neden olur.',
    keywords: ['kreatin', 'creatine', 'bobrek yetmezligi', 'bobrek hasari', 'saglikli'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Sağlıklı Sporcularda Önerilen Dozda Kreatin Böbrek Hasarı Yapmaz)',
    noPct: 90,
    medicalRationale: 'ISSN ve nefrotek derlemeleri: Kreatin serum kreatininini sahte olarak hafif yükseltebilir (metabolit artışı), ancak gerçek GFR\'yi veya böbrek histolojisini bozmaz.'
  },
  {
    id: 52,
    specialty: 'Üroloji',
    topic: 'Genç kadınlarda asemptomatik mikroskopik hematüride acil sistoskopi',
    claimSentence: 'İdrar tahlilinde mikroskopik hematüri saptanan 25 yaşındaki asemptomatik sigara içmeyen bir kadında ilk basamakta acil invaziv sistoskopi yapılmalıdır.',
    keywords: ['hematuri', 'sistoskopi', 'genc', 'asemptomatik'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - AUA Kılavuzları: Düşük Riskli Genç Kadınlarda Rutin Sistoskopi Önerilmez)',
    noPct: 84,
    medicalRationale: 'Amerikan Üroloji Birliği (AUA): Düşük riskli genç kadınlarda malignite olasılığı < %0.5 olup rutin invaziv sistoskopi gereksiz üretra travması ve enfeksiyona yol açar.'
  },
  {
    id: 53,
    specialty: 'Üroloji',
    topic: 'Basit asemptomatik böbrek kistlerinde rutin cerrahi eksizyon',
    claimSentence: 'Ultrasonografide rastlantısal olarak saptanan Bosniak Kategori 1 basit böbrek kistleri rüptür ve kanser riski nedeniyle hemen cerrahi ile çıkarılmalıdır.',
    keywords: ['bobrek kisti', 'bosniak 1', 'cerrahi', 'kist eksizyonu'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Basit Kistler Benign Olup Cerrahi Müdahale Gerektirmez)',
    noPct: 94,
    medicalRationale: 'Üroloji kılavuzları: Bosniak 1 kistler tamamen iyi huylu olup malignite riski sıfırdır; semptom vermeyen basit kistlerde cerrahi veya aspirasyon gereksizdir.'
  },
  {
    id: 54,
    specialty: 'Nefroloji',
    topic: 'Akut böbrek hasarında "renal doz" dopamin kullanımı',
    claimSentence: 'Akut böbrek hasarı gelişen yoğun bakım hastalarında düşük doz dopamin infüzyonu böbrek kan akımını artırarak diyaliz ihtiyacını ve ölümü önler.',
    keywords: ['renal doz', 'dopamin', 'akut bobrek hasari', 'diyaliz'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - ANZICS Çalışması: Renal Dopamin Tamamen Etkisizdir)',
    noPct: 95,
    medicalRationale: 'ANZICS landmark çok merkezli RKÇ\'si (Lancet): Düşük doz dopamin diyaliz gereksinimini veya mortaliteyi azaltmamış, taşiaritmi riskini artırmıştır; terk edilmiştir.'
  },
  {
    id: 55,
    specialty: 'Nefroloji',
    topic: 'Kontrast nefropatisi profilaksisinde N-asetilsistein (NAC)',
    claimSentence: 'Koroner anjiyografi yapılacak böbrek hastalarında oral N-asetilsistein (NAC) verilmesi kontrast kaynaklı nefropatiyi önlemede hidrasyona üstündür.',
    keywords: ['n-asetilsistein', 'nac', 'kontrast nefropati', 'radyokontrast'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - PRESERVE Çalışması: NAC Serum Salin Hidrasyonuna Üstün Değildir)',
    noPct: 82,
    medicalRationale: 'PRESERVE landmark çalışması (5.177 hasta, NEJM): Kontrast nefropatisini önlemede N-asetilsistein plaseboya kıyasla hiçbir ek klinik yarar sağlamamıştır.'
  },
  {
    id: 56,
    specialty: 'Nefroloji',
    topic: 'Kronik böbrek yetmezliğinde erken asemptomatik diyaliz',
    claimSentence: 'Kronik böbrek yetmezliğinde semptomlar gelişmeden yalnızca eGFR değerine bakılarak erken diyalize başlamak yaşam süresini belirgin uzatır.',
    keywords: ['erken diyaliz', 'egfr', 'kronik bobrek yetmezligi', 'ideal calismasi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - IDEAL Çalışması: Erken Başlangıcın Geç Başlangıca Sağkalım Üstünlüğü Yoktur)',
    noPct: 80,
    medicalRationale: 'IDEAL landmark çalışması (NEJM): eGFR 10-14 iken erken diyalize başlanması, klinik üremik semptomlar beklenerek başlanan geç gruba kıyasla sağkalım avantajı sağlamamıştır.'
  },
  {
    id: 57,
    specialty: 'Üroloji',
    topic: 'BPH tedavisinde Saw Palmetto (cüce palmiye) takviyesi',
    claimSentence: 'İyi huylu prostat büyümesinde (BPH) Saw Palmetto bitkisel takviyesi idrar akım hızını ve prostat hacmini tamsulosin kadar düzeltir.',
    keywords: ['saw palmetto', 'cuce palmiye', 'bph', 'prostat buyumesi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - Cochrane & CAMUS: Plaseboya Üstünlük Gösterememiştir)',
    noPct: 88,
    medicalRationale: 'Cochrane derlemeleri ve CAMUS çalışması (JAMA): Standart ve çift doz Saw Palmetto ekstreleri üriner semptom skoru ve tepe idrar akımında plasebodan farksız bulunmuştur.'
  },
  {
    id: 58,
    specialty: 'Nefroloji',
    topic: 'Kalsiyum taşlarında diyette kalsiyumun aşırı kısıtlanması',
    claimSentence: 'Kalsiyum oksalat böbrek taşı olan bireylerde taş oluşumunu engellemek için diyetteki süt ve kalsiyum alımı tamamen sıfırlanmalıdır.',
    keywords: ['bobrek tasi', 'kalsiyum oksalat', 'kalsiyum kisitlama', 'diyet'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Kalsiyum Kısıtlaması Oksalat Emilimini Artırarak Taş Riskini Yükseltir)',
    noPct: 85,
    medicalRationale: 'Borghi landmark RKÇ\'si (NEJM): Diyetle kalsiyumun kısıtlanması bağırsakta serbest oksalatı artırıp hiperoksalüri ve taş nüksünü artırır; normal kalsiyum alımı önerilir.'
  },
  {
    id: 59,
    specialty: 'Üroloji',
    topic: 'Akut piyelonefrit veya İYE\'de tek başına yaban mersini',
    claimSentence: 'Ateş ve yan ağrısıyla seyreden akut idrar yolu enfeksiyonunda tek başına konsantre yaban mersini (cranberry) suyu içilmesi enfeksiyonu tamamen iyileştirir.',
    keywords: ['yaban mersini', 'cranberry', 'idrar yolu enfeksiyonu', 'piyelonefrit'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Aktif Akut Enfeksiyon Tedavisinde Antibiyotiğin Yerini Tutamaz)',
    noPct: 92,
    medicalRationale: 'Cochrane derlemeleri: Cranberry proantosiyanidinleri bakteriyel adezyonu hafif azaltabilir ancak yerleşmiş aktif bakteriyel enfeksiyonu eradike edemez; sepsis riski doğurur.'
  },
  {
    id: 60,
    specialty: 'Nefroloji',
    topic: 'Pediatrik nefrotik sendromda rutin profilaktik antikoagülasyon',
    claimSentence: 'Minimal lezyon hastalığı olan her nefrotik çocukta tromboz riskine karşı ilk günden itibaren rutin profilaktik varfarin başlanmalıdır.',
    keywords: ['nefrotik sendrom', 'cocuk', 'antikoagulasyon', 'varfarin', 'profilaksi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Rutin Profilaksinin Kanama Riski Tromboz Faydasını Aşmaktadır)',
    noPct: 84,
    medicalRationale: 'KDIGO kılavuzları: Çocuklarda nefrotik sendromda rutin sistemik antikoagülasyon önerilmez; kanama komplikasyonu riski yüksek olup yalnızca seçilmiş yüksek riskli olgularda düşünülür.'
  },

  // =========================================================================
  // 7. ROMATOLOJİ & ORTOPEDİ (Vaka 61 - 70)
  // =========================================================================
  {
    id: 61,
    specialty: 'Romatoloji',
    topic: 'Diz osteoartritinde glukozamin/kondroitinin kıkırdağı yenilemesi',
    claimSentence: 'Oral glukozamin ve kondroitin sülfat takviyesi gonartrozda aşınmış eklem kıkırdağını yapısal olarak yeniden üretir ve yeniler.',
    keywords: ['glukozamin', 'glucosamine', 'kondroitin', 'kikirdak', 'onarir', 'yeniler'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - OARSI & AAOS: Glukozamin Eklem Kıkırdağını Yapısal Olarak Yenilemez)',
    noPct: 86,
    medicalRationale: 'GAIT çalışması ve OARSI/AAOS kılavuzları: Glukozamin kıkırdak hacminde veya eklem aralığı kaybında plaseboya kıyasla objektif bir iyileşme sağlamamaktadır.'
  },
  {
    id: 62,
    specialty: 'Ortopedi',
    topic: 'Akut mekanik bel ağrısında ilk 4 haftada rutin lomber MRG',
    claimSentence: 'Kırmızı bayrak bulgusu olmayan akut mekanik bel ağrılı her hastada ilk haftada rutin lomber MRG çekilmesi iyileşmeyi hızlandırır.',
    keywords: ['bel agrisi', 'lomber mrg', 'mr', 'rutin goruntuleme'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Choosing Wisely: Ağrıyı veya İyileşmeyi Etkilemez, Anksiyeteyi Artırır)',
    noPct: 88,
    medicalRationale: 'Amerikan Hekimler Birliği (ACP): Kırmızı bayraksız akut bel ağrısında erken MR klinik sonlanımı iyileştirmez; asemptomatik disk dejenerasyonları nedeniyle gereksiz cerrahileri artırır.'
  },
  {
    id: 63,
    specialty: 'Ortopedi',
    topic: 'Subakromiyal sıkışmada rutin subakromiyal dekompresyon',
    claimSentence: 'Subakromiyal omuz sıkışma sendromunda artroskopik subakromiyal dekompresyon cerrahisi plasebo şam cerrahiye göre belirgin üstün ağrı kontrolü sağlar.',
    keywords: ['omuz sikisma', 'subakromiyal', 'dekompresyon', 'csaw'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - CSAW Çalışması: Şam Cerrahiye ve Fizik Tedaviye Üstün Değildir)',
    noPct: 82,
    medicalRationale: 'CSAW landmark çok merkezli RKÇ\'si (Lancet): Subakromiyal dekompresyon şam (artroskopik inceleme) cerrahisine veya yapılandırılmış egzersiz terapisine üstünlük göstermemiştir.'
  },
  {
    id: 64,
    specialty: 'Ortopedi',
    topic: 'Diz osteoartritinde rutin artroskopik lavaj ve debridman',
    claimSentence: 'İleri evre diz kireçlenmesinde artroskopik yıkama ve kıkırdak debridmanı eklem fonksiyonunu kalıcı olarak düzelten etkili bir cerrahidir.',
    keywords: ['gonartroz', 'artroskopi', 'debridman', 'lavaj', 'kireclenme'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Moseley & Kirkley: Şam Cerrahiye Üstünlüğü Yoktur)',
    noPct: 92,
    medicalRationale: 'Moseley (NEJM) ve Kirkley (NEJM) landmark çalışmaları: Diz osteoartritinde artroskopik debridman plasebo şam cerrahiden farksız bulunmuş olup kılavuzlardan çıkarılmıştır.'
  },
  {
    id: 65,
    specialty: 'Ortopedi',
    topic: 'Dejeneratif menisküs yırtığında rutin erken menisektomi',
    claimSentence: 'Osteoartriti olan 50 yaş üzeri bireylerde dejeneratif menisküs yırtıkları tespit edildiğinde hemen parsiyel menisektomi ameliyatı yapılmalıdır.',
    keywords: ['meniskus', 'menisektomi', 'dejeneratif', 'fidelity'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - FIDELITY Çalışması: Fizik Tedaviye ve Şam Cerrahiye Üstünlüğü Yoktur)',
    noPct: 85,
    medicalRationale: 'FIDELITY landmark RKÇ\'si (NEJM): Dejeneratif menisküs yırtıklarında parsiyel menisektomi ameliyatı şam cerrahiye kıyasla diz ağrısı veya fonksiyonunda üstünlük sağlamamıştır.'
  },
  {
    id: 66,
    specialty: 'Romatoloji',
    topic: 'Spondiloartritin (SpA) sadece erkeklerin hastalığı olduğu iddiası',
    claimSentence: 'Aksiyel spondiloartrit ve ankilozan spondilit kadınlarda neredeyse hiç görülmeyen, yalnızca genç erkekleri tutan bir hastalıktır.',
    keywords: ['spondilit', 'spondiloartrit', 'spa', 'sadece erkek', 'kadinlarda gorulmez'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor / Efsane Çürütülmüştür (Hayır - Kadınlarda da ~1:1 Görülür)',
    noPct: 92,
    medicalRationale: 'ASAS konsensüsü ve Rudwaleit: Non-radyografik aksiyel SpA spektrumu dahil edildiğinde kadın ve erkek prevelansı ~1:1 eşittir; SpA\'nın sadece erkek hastalığı olduğu iddiası tamamen çürütülmüştür.'
  },
  {
    id: 67,
    specialty: 'Romatoloji',
    topic: 'Fibromiyaljide birinci basamak rutin opioid kullanımı',
    claimSentence: 'Kronik yaygın fibromiyalji ağrısında tramadol ve fentanil gibi opioid analjezikler birinci basamak temel tedavi seçeneğidir.',
    keywords: ['fibromiyalji', 'opioid', 'tramadol', 'fentanil', 'agri'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - EULAR: Opioidler Hiperaljezi Yapar ve Önerilmez)',
    noPct: 90,
    medicalRationale: 'EULAR ve ACR kılavuzları: Fibromiyaljide opioidlerin uzun vadeli etkinliği yoktur; opioid kaynaklı hiperaljeziye, bağımlılığa ve fonksiyonel kötüleşmeye yol açar.'
  },
  {
    id: 68,
    specialty: 'Ortopedi',
    topic: 'Plantar fasiitte ilk basamakta rutin cerrahi fasyotomi',
    claimSentence: 'Topuk dikeni ve plantar fasiit tanısı alan her hastada germe egzersizi denenmeden derhal cerrahi fasyotomi yapılmalıdır.',
    keywords: ['plantar fasiit', 'topuk dikeni', 'fasyotomi', 'cerrahi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Vakaların %90\'ı Konservatif Germe ve Tabanlıkla İyileşir)',
    noPct: 88,
    medicalRationale: 'Ortopedi kılavuzları: Plantar fasiit hastalarının %90\'ından fazlası konservatif germe ve tabanlıkla düzelir; ilk basamakta cerrahi ark çökmesi ve kronik ağrı riski yaratır.'
  },
  {
    id: 69,
    specialty: 'Fizik Tedavi',
    topic: 'Akut mekanik bel ağrısında uzun süreli mutlak yatak istirahati',
    claimSentence: 'Şiddetli lumbago ve bel tutulmasında hastaya günlerce kalkmadan tam yatak istirahati yapması tavsiye edilmelidir.',
    keywords: ['bel agrisi', 'lumbago', 'yatak istirahati', 'uzun sureli'],
    requiredKeywords: ['yatak istirahati', 'tam yatak'],
    excludeKeywords: ['aktif egzersiz', 'egzersiz terapisi', 'fizik tedavi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Aktif Kalmak İyileşmeyi Hızlandırır, Yatak İstirahati Kötüleştirir)',
    noPct: 94,
    medicalRationale: 'Cochrane sistematik derlemeleri: Akut bel ağrısında yatak istirahati kas atrofisini artırarak iyileşmeyi geciktirir; tolere edildiği ölçüde aktif kalmak altın standarttır.'
  },
  {
    id: 70,
    specialty: 'Romatoloji',
    topic: 'Romatoid artritte DMARD olmaksızın sadece diyetle kür',
    claimSentence: 'Seropozitif romatoid artrit hastalarında metotreksat kullanmadan sadece glutensiz ve alkali beslenme eklem erozyonlarını tamamen durdurur.',
    keywords: ['romatoid artrit', 'diyet', 'metotreksat', 'erozyon', 'dmard'],
    requiredKeywords: ['diyet', 'beslenme', 'glutensiz', 'alkali', 'dmard olmaksizin'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - DMARD Olmaksızın Eklem Harabiyeti ve Sakatlık Kaçınılmazdır)',
    noPct: 95,
    medicalRationale: 'ACR ve EULAR kılavuzları: Romatoid artritte diyet tek başına sinoviti ve progresif eklem ankilozunu engelleyemez; erken sentetik/biyolojik DMARD tedavisi zorunludur.'
  },

  // =========================================================================
  // 8. PEDİATRİ & ÇOCUK SAĞLIĞI (Vaka 71 - 80)
  // =========================================================================
  {
    id: 71,
    specialty: 'Pediatri',
    topic: 'Viral akut bronşiolitte rutin salbutamol kullanımı',
    claimSentence: 'RSV kaynaklı akut viral bronşiolitli bebeklerde rutin inhale salbutamol (albuterol) nebulizasyonu hastanede kalış süresini kısaltır.',
    keywords: ['bronsiolit', 'bronşiolit', 'salbutamol', 'albuterol', 'rsv', 'bebek'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - AAP Kılavuzları: Bronşiolitte Bronkodilatör Rutin Önerilmez)',
    noPct: 90,
    medicalRationale: 'Amerikan Pediatri Akademisi (AAP): Akut viral bronşiolitte bronkospazm değil mukoza ödemi ve sekresyon vardır; salbutamol hastane yatışını kısaltmaz, taşikardi yapar.'
  },
  {
    id: 72,
    specialty: 'Pediatri',
    topic: 'Viral akut bronşiolitte rutin sistemik kortikosteroid',
    claimSentence: 'Akut viral bronşiolit tanılı süt çocuklarında rutin oral deksametazon veya prednizolon verilmesi klinik skoru hızla iyileştirir.',
    keywords: ['bronsiolit', 'kortikosteroid', 'deksametazon', 'prednizolon'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - Cochrane: Viral Bronşiolitte Sistemik Steroid Etkisizdir)',
    noPct: 92,
    medicalRationale: 'Cochrane sistematik derlemesi (17 RKÇ, 2.596 çocuk): Sistemik steroidler viral bronşiolitte hastaneye yatış oranını veya süresini azaltmamaktadır.'
  },
  {
    id: 73,
    specialty: 'Pediatri',
    topic: 'Çocukluk çağı astımında düşük doz İKS\'nin kalıcı cücelik yapması',
    claimSentence: 'Astımlı çocuklarda düşük ve orta doz inhale kortikosteroid kullanımı nihai erişkin boyunda kalıcı ciddi cüceliğe yol açar.',
    keywords: ['cocuk', 'astim', 'inhale kortikosteroid', 'iks', 'boy', 'kisal'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - CAMP Çalışması: Nihai Boy Farkı < 1.2 cm Olup Kalıcı Cücelik Yapmaz)',
    noPct: 82,
    medicalRationale: 'CAMP çalışması: Düşük-orta doz İKS büyüme hızını ilk yıl hafif yavaşlatabilir fakat nihai erişkin boyundaki fark yalnızca ~1.2 cm olup kalıcı cücelik yapmaz.'
  },
  {
    id: 74,
    specialty: 'Pediatri',
    topic: 'İnfantil kolikte rutin simetikon damla kullanımı',
    claimSentence: 'Bebeklerde infantil gaz sancısı ve kolikte simetikon damlaları ağlama nöbetlerini durdurmada plaseboya belirgin üstünlük sağlar.',
    keywords: ['infantil kolik', 'gaz sancisi', 'simetikon', 'damla'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Cochrane: Simetikonun Plaseboya Anlamlı Üstünlüğü Yoktur)',
    noPct: 78,
    medicalRationale: 'Cochrane sistematik derlemesi: Simetikon infantil kolik tedavisinde plaseboya kıyasla ağlama süresinde istatistiksel veya klinik bir üstünlük göstermemiştir.'
  },
  {
    id: 75,
    specialty: 'Pediatri',
    topic: 'Bebeklerde diş çıkarma ateşinde sistemik antibiyotik',
    claimSentence: 'Süt çocuklarında fizyolojik diş çıkarma döneminde görülen hafif ateş tablosunda enfeksiyonu önlemek için antibiyotik başlanmalıdır.',
    keywords: ['dis cikarma', 'bebek', 'ates', 'antibiyotik'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Diş Çıkarma Fizyolojik Süreçtir, Antibiyotik Endikasyonu Yoktur)',
    noPct: 95,
    medicalRationale: 'Pediatri dernekleri: Diş çıkarma fizyolojik bir süreçtir; yüksek ateş yapmaz ve antibiyotik kullanımı kesinlikle endike değildir.'
  },
  {
    id: 76,
    specialty: 'Pediatri',
    topic: '2 yaş üstü hafif akut otitis mediada rutin anında antibiyotik',
    claimSentence: 'İki yaşın üzerindeki çocuklarda komplikasyonsuz hafif seyirli akut orta kulak iltihabında ilk muayenede derhal amoksisilin başlanmalıdır.',
    keywords: ['otitis media', 'orta kulak', 'antibiyotik', 'cocuk', 'bekle ve gor'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - AAP: 48-72 Saat Gözlem ve Bekle-Gör Stratejisi Esastır)',
    noPct: 80,
    medicalRationale: 'AAP kılavuzları: Komplike olmayan olguların %80\'i kendiliğinden iyileşir; 48-72 saat semptomatik analjezikle bekle-gör yaklaşımı gereksiz antibiyotiği önler.'
  },
  {
    id: 77,
    specialty: 'Pediatri',
    topic: 'Çocuklarda esnek düz tabanlıkta rutin sert ortopedik bot',
    claimSentence: 'Küçük çocuklarda asemptomatik esnek düz tabanlık (pes planus) durumunda ayak arkını oluşturmak için sert ortopedik tabanlık ve bot zorunludur.',
    keywords: ['duz taban', 'pes planus', 'ortopedik bot', 'cocuk'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - Esnek Düz Tabanlık Fizyolojik Olup Bot Ark Gelişimini Değiştirmez)',
    noPct: 90,
    medicalRationale: 'Pediatrik Ortopedi kılavuzları: Çocuklarda esnek pes planus fizyolojik yağ yastıkçığına bağlıdır; sert botlar ark gelişimini hızlandırmaz, gereksiz psikososyal yüktür.'
  },
  {
    id: 78,
    specialty: 'Pediatri',
    topic: 'Yenidoğan sarılığında fototerapi yerine güneşe tutma',
    claimSentence: 'Yenidoğan patolojik sarılığında fototerapi cihazı yerine bebeği cam arkasından doğrudan güneş ışığına maruz bırakmak güvenli ve yeterlidir.',
    keywords: ['sarilik', 'yenidogan', 'fototerapi', 'gunes isigi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Güneş Işığı Cilt Yanığı ve Hipertermi Yapar, Kernikterus Riski Taşır)',
    noPct: 96,
    medicalRationale: 'AAP ve Türk Neonatoloji Derneği: Filtresiz güneş ışığı cilt yanıkları, hipertermi ve dehidratasyona yol açar; patolojik sarılıkta kalibre fototerapi şarttır.'
  },
  {
    id: 79,
    specialty: 'Pediatri',
    topic: 'Gece idrar kaçıran çocukta ceza ve sıvı kısıtlama yöntemi',
    claimSentence: 'Primer monosemptomatik gece enürezisi olan çocuklarda gece altını ıslatmayı engellemek için cezalandırma ve katı utandırma yöntemleri uygulanmalıdır.',
    keywords: ['enurezis', 'gece idrar', 'altini islatma', 'ceza'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Psikolojik Travmaya ve Tablonun Kötüleşmesine Yol Açar)',
    noPct: 98,
    medicalRationale: 'Pediatri ve çocuk psikiyatrisi: Enürezis istemsiz bir maturasyonel gecikmedir; ceza ve utandırma anksiyeteyi ve nüksü artırır; alarm tedavisi veya desmopresin esastır.'
  },
  {
    id: 80,
    specialty: 'Pediatri',
    topic: 'İshal olan çocukta 24 saat tam aç bırakma (BRAT)',
    claimSentence: 'Akut viral gastroenterit geçiren süt çocuklarında bağırsakları tamamen dinlendirmek için anne sütü kesilmeli ve çocuk 24 saat aç bırakılmalıdır.',
    keywords: ['ishal', 'gastroenterit', 'anne sutu', 'ac birakma'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - ESPGHAN & DSÖ: Beslenmeye ve Anne Sütüne Kesintisiz Devam Edilmelidir)',
    noPct: 95,
    medicalRationale: 'ESPGHAN ve DSÖ kılavuzları: İshalde beslenmenin kesilmesi enterosit atrofisine yol açar ve iyileşmeyi geciktirir; ORS ile hidrasyon ve kesintisiz beslenme şarttır.'
  },

  // =========================================================================
  // 9. GASTROENTEROLOJİ & GENEL CERRAHİ (Vaka 81 - 90)
  // =========================================================================
  {
    id: 81,
    specialty: 'Genel Cerrahi',
    topic: 'Akut karında opioid vermenin tanıyı gizlediği efsanesi',
    claimSentence: 'Akut apandisit şüphesi olan hastalarda cerrah muayene edene kadar ağrı kesici (opioid) vermek fizik muayene bulgularını ve peritoneal irritasyonu gizler.',
    keywords: ['akut karin', 'apandisit', 'opioid', 'agri kesici', 'taniyi gizler'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Analjezi Tanıyı Gizlemez, Hastayı Rahatlatarak Muayeneyi Kolaylaştırır)',
    noPct: 92,
    medicalRationale: 'Cochrane sistematik derlemesi ve çok merkezli RKÇ\'ler: Erken opioid analjezisi tanısal doğruluğu azaltmaz veya cerrahi gecikmeye yol açmaz; etik olarak şarttır.'
  },
  {
    id: 82,
    specialty: 'Genel Cerrahi',
    topic: 'Asemptomatik sessiz safra taşında rutin kolesistektomi',
    claimSentence: 'Ultrasonografide rastlantısal saptanan hiçbir şikayeti olmayan safra kesesi taşlarında acil profilaktik kolesistektomi ameliyatı yapılmalıdır.',
    keywords: ['safra tasi', 'kolesistolitiazis', 'asemptomatik', 'kolesistektomi'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Yıllık Komplikasyon Riski <%1 Olup Cerrahi Riskleri Aşmaktadır)',
    noPct: 88,
    medicalRationale: 'EASL ve cerrahi kılavuzları: Asemptomatik kolelitiyaziste yıllık semptom gelişme oranı %1-2 olup cerrahi mortalite ve safra yolu yaralanması riski faydasını aşar.'
  },
  {
    id: 83,
    specialty: 'Genel Cerrahi',
    topic: 'Küçük asemptomatik safra polipinde acil cerrahi',
    claimSentence: 'Safra kesesinde saptanan 4 milimetrelik asemptomatik polip kanserleşme riski nedeniyle derhal cerrahi ile alınmalıdır.',
    keywords: ['safra polip', 'safra kesesi polip', 'kolesistektomi', 'kanser'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Avrupa Kılavuzları: 10 mm Altı Poliplerde Cerrahi Değil Takip Önerilir)',
    noPct: 85,
    medicalRationale: 'Ortak Avrupa Kılavuzları (EYS): 10 mm altındaki safra kesesi poliplerinde malignite riski son derece düşük olup cerrahi değil ultrasonografik takip esastır.'
  },
  {
    id: 84,
    specialty: 'Gastroenteroloji',
    topic: 'Ağır erozif özofajitte PPI yerine sadece antiasit çiğnenmesi',
    claimSentence: 'Şiddetli Los Angeles Evre C erozif reflü özofajitinde mide asidini tamamen baskılamak ve mukozayı iyileştirmek için antiasit çiğnemek yeterlidir.',
    keywords: ['reflu', 'ozofajit', 'antiasit', 'ppi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - Erozif Hasarın İyileşmesi İçin Proton Pompa İnhibitörü Şarttır)',
    noPct: 90,
    medicalRationale: 'ACG ve AGA kılavuzları: Antiasitler kısa süreli semptom rahatlatır ancak mukoza iyileşmesini sağlayamaz; ileri reflüde PPI olmadan striktür ve darlık gelişir.'
  },
  {
    id: 85,
    specialty: 'Gastroenteroloji',
    topic: 'IBS hastalarında semptomların yalnızca glütenden kaynaklandığı',
    claimSentence: 'Çölyak dışı irritabl bağırsak sendromu (IBS) olan tüm hastalarda gaz ve şişkinliğin tek ve mutlak sebebi glütendir.',
    keywords: ['ibs', 'irritabl bagirsak', 'gluten', 'fodmap'],
    requiredKeywords: ['gluten', 'colyak disi gluten'],
    excludeKeywords: ['dusuk fodmap', 'fodmap diyeti'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Semptomların Asıl Nedeni Fermente Edilebilir Karbonhidratlardır / FODMAP)',
    noPct: 80,
    medicalRationale: 'Biesiekierski landmark RKÇ\'si (Gastroenterology): Çölyak dışı IBS hastalarında glüten çıkarıldığında semptom düzelmesi spesifik olmayıp asıl tetikleyici FODMAP\'tir.'
  },
  {
    id: 86,
    specialty: 'Genel Cerrahi',
    topic: 'Mekanik bağırsak obstrüksiyonunda oral güçlü laksatif verilmesi',
    claimSentence: 'Tümör veya brid ile tam mekanik bağırsak tıkanıklığı gelişen hastada tıkacı açmak için oral güçlü senna veya bisakodil laksatif verilmelidir.',
    keywords: ['bagirsak tikanikligi', 'obstruksiyon', 'laksatif', 'perforasyon'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Bağırsak Perforasyonu ve Sepsis Riski Nedeniyle Kesin Kontrendikedir)',
    noPct: 98,
    medicalRationale: 'Cerrahi acilleri: Mekanik obstrüksiyonda laksatif verilmesi proksimal basıncı artırarak bağırsak iskemisi, nekroz ve perforasyona yol açar; acil dekompresyon gerekir.'
  },
  {
    id: 87,
    specialty: 'Gastroenteroloji',
    topic: 'Akut alt GİS kanamasında acil oral baryumlu kolon grafisi',
    claimSentence: 'Rektumdan masif parlak kırmızı kanama ile başvuran hemodinamisi anstabil hastada ilk tanısal işlem baryumlu kolon grafisi olmalıdır.',
    keywords: ['gis kanama', 'baryumlu', 'kolonoskopi', 'anjiyografi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Endoskopik ve Anjiyografik Müdahaleyi İmkansız Kılar)',
    noPct: 96,
    medicalRationale: 'ACG kılavuzları: Masif kanamada baryum verilmesi hem kanamayı durduramaz hem de kolonoskopik veya anjiyografik hemostazı imkansız hale getirir; kontrendikedir.'
  },
  {
    id: 88,
    specialty: 'Gastroenteroloji',
    topic: 'Karaciğer sirozunda ensefalopati korkusuyla aşırı protein kısıtlaması',
    claimSentence: 'Dekompanse karaciğer sirozu olan hastalarda hepatik ensefalopati gelişimini engellemek için diyetteki protein miktarı günlük 20 gramın altına indirilmelidir.',
    keywords: ['siroz', 'ensefalopati', 'protein kisitlama', 'malnutrisyon'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - ESPEN & EASL: Şiddetli Sarkopeni ve Mortaliteyi Artırır)',
    noPct: 90,
    medicalRationale: 'EASL ve ESPEN klinik beslenme kılavuzları: Protein kısıtlaması kas kitlesini yıkarak amonyak temizlenmesini bozar ve mortaliteyi artırır; 1.2-1.5 g/kg protein verilmelidir.'
  },
  {
    id: 89,
    specialty: 'Genel Cerrahi',
    topic: 'Kolon cerrahisi sonrası günlerce bağırsak sesi bekleyip aç bırakma',
    claimSentence: 'Kolorektal cerrahi geçiren her hasta bağırsak sesleri duyulup gaz çıkarana kadar en az 5 gün boyunca ağızdan hiçbir şey almamalıdır.',
    keywords: ['cerrahi', 'eras', 'bagirsak sesleri', 'ac birakma', 'erken beslenme'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - ERAS Protokolleri: Erken Enteral Beslenme İyileşmeyi Hızlandırır)',
    noPct: 88,
    medicalRationale: 'Enhanced Recovery After Surgery (ERAS) protokolleri: Erken oral beslenme postoperatif ileusu kısaltır, yara iyileşmesini hızlandırır ve enfeksiyonları azaltır.'
  },
  {
    id: 90,
    specialty: 'Gastroenteroloji',
    topic: 'Mide ülserini iyileştirmek için bol süt ve krema içilmesi',
    claimSentence: 'Aktif mide ve onikiparmak bağırsağı ülseri olan hastalar bol süt ve krema içerek asidi nötralize edip ülseri tamamen kurutabilir.',
    keywords: ['mide ulseri', 'peptik ulser', 'sut', 'krema', 'iyilestirir'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Bilimsel Dayanağı Yoktur / Yanılgı (Hayır - Sütteki Kalsiyum Gastrin Salgılatarak Asit Reboundu Yaratır)',
    noPct: 92,
    medicalRationale: 'Gastroenteroloji konsensüsü: Süt geçici tamponlama yapsa da içerdiği kalsiyum ve protein parietal hücrelerden güçlü gastrin ve asit salgılanmasını uyararak ülseri kötüleştirir.'
  },

  // =========================================================================
  // 10. ACİL TIP, YOĞUN BAKIM & TOKSİKOLOJİ (Vaka 91 - 100)
  // =========================================================================
  {
    id: 91,
    specialty: 'Acil Tıp',
    topic: 'Kardiyak arrestte doğrudan intrakardiyak adrenalin enjeksiyonu',
    claimSentence: 'Kalbi duran kardiyak arrest hastasında epinefrin/adrenalin göğüs duvarından doğrudan kalbin içine (intrakardiyak) enjekte edilmelidir.',
    keywords: ['kardiyak arrest', 'cpr', 'intrakardiyak adrenalin', 'epinefrin'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Koroner Yırtılması ve Pnömotoraks Nedeniyle Terk Edilmiştir)',
    noPct: 98,
    medicalRationale: 'AHA ve ERC resüsitasyon kılavuzları: İntrakardiyak enjeksiyon koroner arter laserasyonu, fatal intramiyokardiyal hematom ve pnömotoraks yapar; IV/IO yol esastır.'
  },
  {
    id: 92,
    specialty: 'Yoğun Bakım',
    topic: 'VAP hastalarında antibiyotik deeskalasyonunun mortaliteyi artırması',
    claimSentence: 'Ventilatör ilişkili pnömonide (VAP) kültür sonucuna göre geniş spektrumlu antibiyotiği daraltmak tedavi başarısızlığı ve ölümü artırır.',
    keywords: ['vap', 'deeskalasyon', 'antibiyotik', 'yogun bakim', 'mortalite'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Antibiyotik Deeskalasyonu Güvenlidir ve Başarısızlığı Artırmaz)',
    noPct: 82,
    medicalRationale: 'ATS/IDSA kılavuzları ve meta-analizler: Kültür ve antibiyogram kılavuzluğunda deeskalasyon güvenli olup dirençli süperenfeksiyonları azaltır, mortaliteyi artırmaz.'
  },
  {
    id: 93,
    specialty: 'Acil Tıp',
    topic: 'Hemorajik şokta agresif litrelerce soğuk kristaloid yüklenmesi',
    claimSentence: 'Travmatik masif iç kanaması olan hastaya cerrahi kanama kontrolünden önce tansiyonu normale getirmek için hızla 4-5 litre izotonik verilmelidir.',
    keywords: ['hemorajik sok', 'kanama', 'kristaloid', 'hasar kontrol'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - Dilüsyonel Koagülopatiyi ve Kanama Ölümünü Artırmaktadır)',
    noPct: 92,
    medicalRationale: 'ATLS ve hasar kontrol resüsitasyonu kılavuzları: Aşırı kristaloid pıhtıyı patlatır (pop the clot), dilüsyonel koagülopati ve hipotermi yapar; kan ürünleri (1:1:1) esastır.'
  },
  {
    id: 94,
    specialty: 'Toksikoloji',
    topic: 'Zehirlenmelerde rutin İpeka şurubu ile kusturma',
    claimSentence: 'Evde toksik kimyasal veya aşırı doz ilaç içen bir çocukta ilk yardım olarak derhal İpeka şurubu verilerek hasta kusturulmalıdır.',
    keywords: ['ipeka surubu', 'kusturma', 'zehirlenme', 'toksik'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Aspirasyon Pnömonisi Riski Nedeniyle Kullanımı Terk Edilmiştir)',
    noPct: 96,
    medicalRationale: 'AAP ve Klinik Toksikoloji Akademisi (AACT): İpeka ile kusturma toksik emilimi belirgin azaltmazken fatal aspirasyon pnömonisi ve özofagus yırtılmasına yol açar.'
  },
  {
    id: 95,
    specialty: 'Acil Tıp',
    topic: 'Yılan veya akrep sokmasında turnike ve yarayı kesip emme',
    claimSentence: 'Zehirli yılan sokmasında zehrin yayılmasını durdurmak için ekstremiteye sıkı turnike bağlanmalı ve yara yeri bıçakla kesilip ağızla emilmelidir.',
    keywords: ['yilan sokmasi', 'turnike', 'emme', 'yara kesme'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Doku Nekrozu ve Ampütasyon Riskini Katlamaktadır)',
    noPct: 97,
    medicalRationale: 'Toksikoloji kılavuzları: Turnike doku iskemisi ve kompartman sendromuna yol açar; kesip emme ise sistemik zehirlenmeyi azaltmaz, enfeksiyon ve nekrozu artırır.'
  },
  {
    id: 96,
    specialty: 'Acil Tıp',
    topic: 'Epileptik jeneralize nöbette hastanın ağzına zorla kaşık sokma',
    claimSentence: 'Jeneralize tonik-klonik nöbet geçiren bir hastanın dilini ısırmasını engellemek için ağzı metal kaşık veya tahta ile zorla açılmalıdır.',
    keywords: ['epilepsi', 'nobet', 'agza kasik sokma', 'dil isirma'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Diş Kırığı ve Hava Yolu Obstrüksiyonuna Yol Açar)',
    noPct: 98,
    medicalRationale: 'Nöroloji ve Acil Tıp dernekleri: Kasılma anında ağza nesne sokulması diş kırılması, çene çıkığı ve kırılan dişin aspire edilerek boğulmasına neden olur; kesinlikle yapılmamalıdır.'
  },
  {
    id: 97,
    specialty: 'Acil Tıp',
    topic: 'Derin hipotermide hastayı hızla kaynar suya sokarak ısıtma',
    claimSentence: 'Vücut sıcaklığı 28 dereceye düşmüş derin hipotermik bir kazazede hızla çok sıcak su dolu küvete sokularak anında ısıtılmalıdır.',
    keywords: ['hipotermi', 'sicak su', 'hizli isitma', 'afterdrop'],
    expectedVerdict: 'Güçlü Uzlaşı: Literatür Desteklemiyor (Hayır - Afterdrop Şoku ve Ventriküler Fibrilasyon Riski Doğurur)',
    noPct: 90,
    medicalRationale: 'WMS hipotermi kılavuzları: Periferik ani vazodilatasyon soğuk ve asidotik kanın kalbe dönmesine ("afterdrop") ve ölümcül ventriküler fibrilasyona yol açar; kademeli aktif gövde ısıtması gerekir.'
  },
  {
    id: 98,
    specialty: 'Acil Tıp',
    topic: 'Anafilaktik şokta adrenalin vermeyip sadece antihistaminik verme',
    claimSentence: 'Stridor ve hipotansiyonla seyreden anafilaksi tablosunda intramüsküler adrenalin yerine yalnızca intravenöz avil ve dekort verilmesi yeterlidir.',
    keywords: ['anafilaksi', 'adrenalin', 'antihistaminik', 'epinefrin'],
    requiredKeywords: ['antihistaminik', 'avil', 'dekort', 'adrenalin vermeyip', 'adrenalin yerine', 'yalnizca antihistaminik', 'sadece antihistaminik'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Kesinlikle Reddediyor (Hayır - Anafilaksinin Tek Hayat Kurtarıcı Birincil Tedavisi Adrenalindir)',
    noPct: 98,
    medicalRationale: 'WAO ve EAACI kılavuzları: Antihistaminikler ve steroidler hava yolu ödemini veya şoku anında durduramaz; adrenalin gecikmesi fatal hipoksik ölümün birincil nedenidir.'
  },
  {
    id: 99,
    specialty: 'Acil Tıp',
    topic: 'Asemptomatik tansiyon yüksekliğinde dilaltı nifedipin ile ani düşürme',
    claimSentence: 'Organ hasarı bulgusu olmayan kan basıncı 190/100 mmHg hastaya tansiyonu hemen normale çekmek için dilaltı nifedipin kapsül patlatılmalıdır.',
    keywords: ['hipertansiyon', 'dilalti nifedipin', 'kaptopril', 'ani dusurme'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Literatür Desteklemiyor (Hayır - Beyin İskemisi, İnme ve MI Riski Nedeniyle Kesinlikle Önerilmez)',
    noPct: 92,
    medicalRationale: 'AHA ve ESC hipertansiyon kılavuzları: Organ hasarı olmayan hipertansif aciliyette kan basıncının aniden düşürülmesi serebral hipoperfüzyon, inme ve miyokard enfarktüsüne yol açar.'
  },
  {
    id: 100,
    specialty: 'Acil Tıp',
    topic: 'Donuk / soğuk ısırığında donmuş uzvu kar ile ovalama',
    claimSentence: 'Donuk (frostbite) nedeniyle beyazlamış ve hissizleşmiş parmaklar ve burun dokusu derhal kar ile sertçe ovalanarak canlandırılmalıdır.',
    keywords: ['donuk', 'frostbite', 'kar ile ovalama', 'soguk isirigi'],
    expectedVerdict: 'Ezici Bilimsel Uzlaşı: Bilimsel Dayanağı Yoktur / Yanılgı (Hayır - Buz Kristalleri Hücreleri Parçalar ve Doku Kaybını Artırır)',
    noPct: 97,
    medicalRationale: 'Vahşi Yaşam Tıp Derneği (WMS): Donmuş dokuyu karla veya mekanik olarak ovalamak hücre içindeki buz kristallerini hareket ettirerek dokuyu parçalar ve ampütasyon riskini artırır.'
  }
];

function normalizeTextToAscii(str = '') {
  return String(str || '')
    .replace(/[İIı]/gu, 'i')
    .replace(/[şŞ]/gu, 's')
    .replace(/[çÇ]/gu, 'c')
    .replace(/[ğĞ]/gu, 'g')
    .replace(/[üÜ]/gu, 'u')
    .replace(/[öÖ]/gu, 'o')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

/**
 * Match text (query or claim sentence) against the 100 critical negative cases
 */
export function matchCriticalNegativeCase(text = '') {
  if (!text || typeof text !== 'string') return null;

  const cleanText = ' ' + normalizeTextToAscii(text) + ' ';

  let bestCase = null;
  let maxScore = 0;

  for (const c of CRITICAL_NEGATIVE_CASES) {
    const cleanTopic = normalizeTextToAscii(c.topic);
    const cleanClaim = normalizeTextToAscii(c.claimSentence);

    // Filter by requiredKeywords if specified
    if (c.requiredKeywords && c.requiredKeywords.length > 0) {
      const hasReq = c.requiredKeywords.some(rk => {
        const cleanRk = normalizeTextToAscii(rk);
        return cleanText.includes(cleanRk);
      });
      if (!hasReq) continue;
    }

    // Filter by excludeKeywords if specified
    if (c.excludeKeywords && c.excludeKeywords.length > 0) {
      const hasExc = c.excludeKeywords.some(ek => {
        const cleanEk = normalizeTextToAscii(ek);
        return cleanText.includes(cleanEk);
      });
      if (hasExc) continue;
    }

    let score = 0;

    // 1. Direct topic or claim containment
    if (cleanText.includes(cleanTopic)) score += 100;
    if (cleanText.includes(cleanClaim)) score += 100;

    // 2. Word tokens of topic overlap (ignoring very short words <=3 chars)
    const topicWords = cleanTopic.split(/\s+/).filter(w => w.length >= 4);
    let matchedTopicWords = 0;
    for (const tw of topicWords) {
      if (cleanText.includes(' ' + tw + ' ') || cleanText.includes(tw)) {
        matchedTopicWords++;
      }
    }
    if (topicWords.length > 0 && matchedTopicWords / topicWords.length >= 0.5) {
      score += (matchedTopicWords / topicWords.length) * 40;
    }

    // 3. Keyword matching (token-aware, preventing substring leaks like 'asi' in 'tedavisi')
    let kwMatches = 0;
    for (const kw of c.keywords) {
      const cleanKw = normalizeTextToAscii(kw);
      if (cleanKw.includes(' ')) {
        if (cleanText.includes(cleanKw)) kwMatches++;
      } else {
        const kwRegex = new RegExp('(\\b|\\s)' + cleanKw, 'i');
        if (kwRegex.test(cleanText)) kwMatches++;
      }
    }
    if (kwMatches >= 2) {
      score += kwMatches * 15;
    }

    if (score > maxScore && score >= 35) {
      maxScore = score;
      bestCase = c;
    }
  }

  return bestCase;
}

