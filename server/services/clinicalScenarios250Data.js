/**
 * 250 Comprehensive Clinical Scenarios Database
 * Across 15 Medical Disciplines:
 * 1. Kardiyoloji & Kardiyovasküler Tıp (20)
 * 2. Endokrinoloji & Metabolizma (20)
 * 3. Gastroenteroloji & Hepatoloji (20)
 * 4. Nöroloji (20)
 * 5. Göğüs Hastalıkları & Pulmonoloji (18)
 * 6. Enfeksiyon Hastalıkları & Mikrobiyoloji (20)
 * 7. Nefroloji & Üroloji (18)
 * 8. Romatoloji & İmmünoloji (18)
 * 9. Onkoloji & Hematoloji (18)
 * 10. Pediatri & Neonatoloji (18)
 * 11. Kadın Hastalıkları ve Doğum / Jinekoloji (15)
 * 12. Psikiyatri & Ruh Sağlığı (15)
 * 13. Acil Tıp, Yoğun Bakım & Toksikoloji (15)
 * 14. Dermatoloji (8)
 * 15. Ortopedi, Spor Hekimliği & FTR (7)
 * Total: Exactly 250 Scenarios
 */

export const CLINICAL_SCENARIOS_250 = [
  // =========================================================================
  // 1. KARDIYOLOJI & KARDIYOVASKULER TIP (1 - 20)
  // =========================================================================
  {
    id: 1,
    specialty: 'Kardiyoloji',
    question: 'Statin tedavisi sekonder koroner arter hastalığı korunmasında mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: '4S, HPS, CTT meta-analizleri: Statinler sekonder korumada tüm nedenli ve kardiyovasküler mortaliteyi anlamlı derecede azaltır.'
  },
  {
    id: 2,
    specialty: 'Kardiyoloji',
    question: 'Stabil koroner arter hastalığında rutin perkütan koroner girişim (PCI) medikal tedaviye kıyasla mortaliteyi azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'ISCHEMIA ve COURAGE çalışmaları: Stabil KAH olgularında rutin PCI optimal medikal tedaviye kıyasla miyokard enfarktüsü veya ölüm riskini azaltmaz.'
  },
  {
    id: 3,
    specialty: 'Kardiyoloji',
    question: 'Kalp yetersizliğinde SGLT2 inhibitörleri kardiyovasküler ölümü ve hastaneye yatışları azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'DAPA-HF, EMPEROR-Reduced, DELIVER: SGLT2 inhibitörleri ejeksiyon fraksiyonundan bağımsız olarak kalp yetersizliğinde kardiyovasküler ölümü ve yatışları azaltır.'
  },
  {
    id: 4,
    specialty: 'Kardiyoloji',
    question: 'Normoksik akut miyokard enfarktüsünde rutin yüksek akımlı oksijen tedavisi miyokard hasarını azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'AVOID ve DETO2X-AMI çalışmaları: Normoksik MI hastalarında rutin ek oksijen mortaliteyi düşürmez; aksine koroner vazokonstrüksiyon ve reperfüzyon hasarını artırabilir.'
  },
  {
    id: 5,
    specialty: 'Kardiyoloji',
    question: 'Non-valvüler atriyal fibrilasyonda DOAK grubu ilaçlar varfarine kıyasla intrakraniyal kanama riskini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ARISTOTLE, RE-LY, ROCKET-AF meta-analizleri: DOAK\'lar inme korumasında varfarine en az eşdeğer olup intrakraniyal kanamayı yaklaşık %50 azaltır.'
  },
  {
    id: 6,
    specialty: 'Kardiyoloji',
    question: 'Kardiyovasküler primer korumada düşük doz aspirin genel popülasyonda kanamayı aşan net sağkalım faydası sağlar mı?',
    expectedStance: 'refuted',
    keyLiterature: 'ASPREE, ARRIVE, ASCEND: Düşük kardiyovasküler riskli bireylerde aspirinin majör kanama riski potansiyel iskemik koruma faydasını dengeler ve aşar.'
  },
  {
    id: 7,
    specialty: 'Kardiyoloji',
    question: 'Dirençli hipertansiyonda spironolakton eklenmesi kan basıncını anlamlı ölçüde düşürür mü?',
    expectedStance: 'affirmative',
    keyLiterature: 'PATHWAY-2 çalışması: Üçlü tedaviye dirençli hipertansiyonda 4. basamak ajan olarak spironolakton kan basıncını düşürmede en üstün ajandır.'
  },
  {
    id: 8,
    specialty: 'Kardiyoloji',
    question: 'Korunmuş ejeksiyon fraksiyonlu kalp yetersizliğinde (HFpEF) beta blokerler tüm nedenli mortaliteyi azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'SENIORS ve Cochrane meta-analizleri: Sinüs ritmindeki HFpEF hastalarında beta blokerlerin mortalite veya hospitalizasyon üzerinde kanıtlanmış faydası gösterilememiştir.'
  },
  {
    id: 9,
    specialty: 'Kardiyoloji',
    question: 'Kardiyak arrest sonrası hedeflenmiş sıcaklık yönetimi (TTM / hipotermi) nörolojik sağkalımı korur mu?',
    expectedStance: 'affirmative',
    keyLiterature: 'HACA ve TTM-2 çalışmaları: Kardiyak arrest sonrası aktif ateş önleme ve normotermi hedeflenmesi nörolojik sağkalımı optimize eder.'
  },
  {
    id: 10,
    specialty: 'Kardiyoloji',
    question: 'Akut STEMI hastalarında kapı-balon süresinin 90 dakikanın altında olması miyokard hasarını ve mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ACC/AHA ve ESC kılavuzları: Kapı-balon süresinin <90 dk olması miyokard nekroz alanını küçültür ve akut sağkalımı belirgin artırır.'
  },
  {
    id: 11,
    specialty: 'Kardiyoloji',
    question: 'Hipertansiyonda ACE inhibitörü ile ARB kombine kullanımı klinik fayda sağlar mı?',
    expectedStance: 'refuted',
    keyLiterature: 'ONTARGET çalışması: İkili RAAS blokajı (ACEi + ARB) kardiyovasküler olayları azaltmadığı gibi hiperkalemi, senkop ve akut böbrek hasarı riskini anlamlı artırır.'
  },
  {
    id: 12,
    specialty: 'Kardiyoloji',
    question: 'Koroner arter baypas cerrahisinde sol internal torasik arter (LIMA) grefti uzun dönem açıklığı artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Loop FD ve CASS çalışmaları: LIMA-LAD greftinin 10 yıllık açıklık oranı (>%90) safen ven greftlerine göre belirgin üstündür ve uzun dönem sağkalımı uzatır.'
  },
  {
    id: 13,
    specialty: 'Kardiyoloji',
    question: 'Ciddi semptomatik aort darlığında transkateter aort kapak implantasyonu (TAVR) cerrahiye alternatif midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'PARTNER 1-3 ve Evolut çalışmaları: TAVR, yüksek riskten düşük cerrahi riske kadar cerrahi kapak replasmanına (SAVR) en az eşdeğer sağkalım sağlar.'
  },
  {
    id: 14,
    specialty: 'Kardiyoloji',
    question: 'Akut dekompanse kalp yetersizliğinde rutin nesiritid infüzyonu mortalite ve rehospitalizasyonu azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'ASCEND-HF çalışması: Nesiritid akut kalp yetersizliğinde semptomları plasebodan üstün düzeltmemiş, mortalite ve yeniden yatışı azaltmamıştır.'
  },
  {
    id: 15,
    specialty: 'Kardiyoloji',
    question: 'Obstrüktif hipertrofik kardiyomiyopatide mavacamten sol ventrikül çıkış yolu gradiyentini düşürür mü?',
    expectedStance: 'affirmative',
    keyLiterature: 'EXPLORER-HCM ve VALOR-HCM: Kardiyak miyozin inhibitörü mavacamten LVOT gradiyentini dramatik düşürür, septal redüksiyon tedavisi ihtiyacını azaltır.'
  },
  {
    id: 16,
    specialty: 'Kardiyoloji',
    question: 'Kardiyovasküler hastalıklardan korunmada yüksek doz E vitamini takviyesi kardiyak olayları önler mi?',
    expectedStance: 'refuted',
    keyLiterature: 'HOPE ve GISSI çalışmaları: Yüksek doz E vitamini kardiyovasküler koruma sağlamamış, hatta bazı alt gruplarda kalp yetersizliği riskini artırmıştır.'
  },
  {
    id: 17,
    specialty: 'Kardiyoloji',
    question: 'Kronik kalp yetersizliğinde sakubitril/valsartan (ARNI) enalaprile göre kardiyovasküler mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'PARADIGM-HF çalışması: ARNI, enalaprile kıyasla kardiyovasküler ölümü ve kalp yetersizliği yatışını %20 oranında belirgin azaltmıştır.'
  },
  {
    id: 18,
    specialty: 'Kardiyoloji',
    question: 'Akut perikarditte standart tedaviye kolşisin eklenmesi nüks oranlarını azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ICAP ve COPE çalışmaları: Kolşisin perikardit semptomlarının gerilemesini hızlandırır ve perikardit nüks riskini yarı yarıya azaltır.'
  },
  {
    id: 19,
    specialty: 'Kardiyoloji',
    question: 'İzole sistolik hipertansiyonu olan yaşlı bireylerde kalsiyum kanal blokerleri inme insidansını düşürür mü?',
    expectedStance: 'affirmative',
    keyLiterature: 'Syst-Eur çalışması: Nitrendipin/kalsiyum antagonisti tedavisi inme riskini %42 oranında belirgin azaltmıştır.'
  },
  {
    id: 20,
    specialty: 'Kardiyoloji',
    question: 'Asemptomatik çok ciddi aort darlığında erken rutin cerrahi konservatif izleme göre sağkalımı artırır mı?',
    expectedStance: 'controversial',
    keyLiterature: 'RECOVERY ve AVATAR çalışmaları cerrahi lehine erken fayda gösterirken, geleneksel kılavuzlar yakın izlem stratejisini dengeli bulmaktadır.'
  },

  // =========================================================================
  // 2. ENDOKRINOLOJI & METABOLIZMA (21 - 40)
  // =========================================================================
  {
    id: 21,
    specialty: 'Endokrinoloji',
    question: 'Metformin tip 2 diyabet tedavisinde birinci basamak ajan olarak glisemik kontrolü ve güvenliği sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'UKPDS ve ADA/EASD kılavuzları: Metformin kilo nötr/kilo verdirici etkisi, hipoglisemi riskinin düşüklüğü ve kardiyovasküler güvenilirliğiyle ilk seçenektir.'
  },
  {
    id: 22,
    specialty: 'Endokrinoloji',
    question: 'Semaglutid obezite tedavisinde anlamlı kilo kaybı ve kardiyovasküler koruma sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'STEP-1 ve SELECT çalışmaları: Haftalık 2.4 mg semaglutid ortalama %15 kilo kaybı ve kardiyovasküler olaylarda %20 risk azalması sağlamıştır.'
  },
  {
    id: 23,
    specialty: 'Endokrinoloji',
    question: 'Diyabetik böbrek hastalığında SGLT2 inhibitörleri son dönem böbrek yetmezliği ilerlemesini yavaşlatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'CREDENCE ve DAPA-CKD: SGLT2 inhibitörleri eGFR kaybını yavaşlatır, diyaliz ihtiyacını ve kardiyorenal ölümü belirgin geciktirir.'
  },
  {
    id: 24,
    specialty: 'Endokrinoloji',
    question: 'Hafif subklinik hipotiroidide (TSH <10 mIU/L, asemptomatik yaşlı) rutin levotiroksin kardiyovasküler fayda sağlar mı?',
    expectedStance: 'refuted',
    keyLiterature: 'TRUST çalışması: 65 yaş üzeri hafif subklinik hipotiroidi hastalarında levotiroksin tedavisi bilişsel, kas gücü veya kardiyovasküler sonlanımlarda fark yaratmamıştır.'
  },
  {
    id: 25,
    specialty: 'Endokrinoloji',
    question: 'Tip 2 diyabette aşırı yoğun glisemik kontrol (HbA1c < %6.0) genel mortaliteyi azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'ACCORD çalışması: Yoğun tedavi kolunda (HbA1c < %6) şiddetli hipoglisemi ve kardiyovasküler mortalitede artış nedeniyle çalışma erken durdurulmuştur.'
  },
  {
    id: 26,
    specialty: 'Endokrinoloji',
    question: 'Diyabetik ketoasidozda pH 6.9 üzerinde olduğunda rutin sodyum bikarbonat infüzyonu iyileşmeyi hızlandırır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'ADA kılavuzları ve klinik çalışmalar: pH > 6.9 olgularda bikarbonat ketonemi klirensini hızlandırmaz; paradoksal BOS asidozu ve hipokalemi riskini artırır.'
  },
  {
    id: 27,
    specialty: 'Endokrinoloji',
    question: 'Postmenopozal osteoporozda yıllık zoledronik asit infüzyonu vertebra ve kalça kırığı riskini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'HORIZON-PFT çalışması: Yılda bir uygulanan zoledronik asit vertebral kırıkları %70, kalça kırıklarını %41 oranında azaltmıştır.'
  },
  {
    id: 28,
    specialty: 'Endokrinoloji',
    question: 'Primer aldosteronizm taramasında plazma aldosteron/renin oranı (ARR) güvenilir bir ilk basamak test midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'Endocrine Society kılavuzları: ARR dirençli hipertansiyon olgularında primer aldosteronizm taramasında en yüksek tanısal duyarlılığa sahiptir.'
  },
  {
    id: 29,
    specialty: 'Endokrinoloji',
    question: 'Erkek hipogonadizminde fizyolojik testosteron replasmanı majör kardiyovasküler olay riskini artırır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'TRAVERSE çalışması: Kanıtlanmış hipogonadizmi olan erkeklerde testosteron replasman tedavisi plaseboya kıyasla MACE olaylarında artışa yol açmamıştır.'
  },
  {
    id: 30,
    specialty: 'Endokrinoloji',
    question: 'Obezite tedavisinde tirzepatid (ikili GIP/GLP-1 reseptör agonisti) semaglutidden daha yüksek kilo kaybı sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'SURMOUNT-1 ve SURPASS-2: Tirzepatid çift inkretin reseptör aktivasyonu sayesinde %20\'yi aşan vücut ağırlığı kaybı sağlamaktadır.'
  },
  {
    id: 31,
    specialty: 'Endokrinoloji',
    question: 'Akut adrenal kriz tablosunda intravenöz hidrokortizon uygulanması hayat kurtarıcı mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'Endocrine Society kılavuzları: Şok ve elektrolit dengesizliğini tersine çevirmek için 100 mg IV hidrokortizon acil uygulanmalıdır.'
  },
  {
    id: 32,
    specialty: 'Endokrinoloji',
    question: 'Tiroid nodülü olan her hastada rutin serum kalsitonin taraması yapılması maliyet-etkin ve önerilen bir yaklaşım mıdır?',
    expectedStance: 'controversial',
    keyLiterature: 'Avrupa Tiroid Birliği (ETA) rutin taramayı desteklerken, Amerikan Tiroid Birliği (ATA) yüksek yalancı pozitiflik ve maliyet nedeniyle rutin önermemektedir.'
  },
  {
    id: 33,
    specialty: 'Endokrinoloji',
    question: 'Cushing sendromu şüphesinde 24 saatlik idrarda serbest kortizol ölçümü yüksek duyarlılığa sahip midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'Nieman LK ve ark., Endocrine Society Kılavuzu: 24 saatlik idrar serbest kortizolü taramada 3 temel doğrulama testinden biridir.'
  },
  {
    id: 34,
    specialty: 'Endokrinoloji',
    question: 'D vitamini eksikliği olmayan sağlıklı bireylerde rutin yüksek doz D vitamini takviyesi kanser insidansını azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'VITAL çalışması (NEJM): 25.000 katılımcıda günlük 2000 IU D vitamini takviyesi invaziv kanser veya kardiyovasküler olay insidansını azaltmamıştır.'
  },
  {
    id: 35,
    specialty: 'Endokrinoloji',
    question: 'Tip 1 diyabette sürekli glukoz izleme (CGM) sistemleri şiddetli hipoglisemi riskini ve HbA1c düzeyini iyileştirir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'DIAMOND ve GOLD çalışmaları: Gerçek zamanlı CGM sensörleri hedef aralıktaki süreyi (TIR) artırır ve tehlikeli hipoglisemileri önler.'
  },
  {
    id: 36,
    specialty: 'Endokrinoloji',
    question: 'Hipoparatiroidizmde rekombinant insan paratiroid hormonu (rhPTH 1-84) kalsiyum dengesini ve yaşam kalitesini sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'REPLACE ve RELAY çalışmaları: rhPTH tedavisi yüksek oral kalsiyum ve aktif D vitamini ihtiyacını belirgin azaltır.'
  },
  {
    id: 37,
    specialty: 'Endokrinoloji',
    question: 'Diyabetik periferik nöropatide alfa lipoik asit semptomatik nöropatik ağrıyı ve paresteziyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ALADIN ve SYDNEY çalışmaları: İntravenöz ve oral alfa lipoik asit nöropatik ağrı skorlarında plaseboya göre anlamlı iyileşme sağlamıştır.'
  },
  {
    id: 38,
    specialty: 'Endokrinoloji',
    question: 'Şiddetli obezitesi ve tip 2 diyabeti olan hastalarda bariatrik cerrahi medikal tedaviye kıyasla daha uzun süreli diyabet remisyonu sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'STAMPEDE çalışması (NEJM): Cerrahi girişim (gastrik baypas/tüp mide) medikal tedaviye göre 5 yıllık glisemik remisyon ve kardiyovasküler risk kontrolünde üstündür.'
  },
  {
    id: 39,
    specialty: 'Endokrinoloji',
    question: 'Gestasyonel diyabet taraması ve kan şekeri regülasyonu fetal makrozomi ve doğum travması riskini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Crowther CA ve Landon MB çalışmaları (NEJM): Gestasyonel diyabetin tedavisi makrozomi, omuz distozisi ve gestasyonel hipertansiyon oranlarını belirgin düşürür.'
  },
  {
    id: 40,
    specialty: 'Endokrinoloji',
    question: 'Akromegalide cerrahi sonrası rezidüel adenomda uzun etkili somatostatin analogları GH ve IGF-1 düzeyini kontrol eder mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Freda PU ve ark.: Okreotid LAR ve lanreotid akromegalide biyokimyasal kontrol ve tümör hacminde küçülme sağlar.'
  },

  // =========================================================================
  // 3. GASTROENTEROLOJI & HEPATOLOJI (41 - 60)
  // =========================================================================
  {
    id: 41,
    specialty: 'Gastroenteroloji',
    question: 'Helikobakter pilori eradikasyonu peptik ülser nüksünü ve mide kanseri gelişme riskini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Maastricht VI Konsensüsü ve Wong BC çalışması: H. pylori eradikasyonu peptik ülser nüksünü neredeyse sıfırlar ve gastrik kanser riskini azaltır.'
  },
  {
    id: 42,
    specialty: 'Gastroenteroloji',
    question: 'Akut hafif bilier pankreatitte rutin profilaktik antibiyotik enfeksiyöz komplikasyonları ve mortaliteyi azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'Cochrane sistematik derlemeleri ve Atlanta kılavuzu: Profilaktik antibiyotik hafif akut pankreatitte enfeksiyonu veya mortaliteyi azaltmaz, direnç gelişimine yol açar.'
  },
  {
    id: 43,
    specialty: 'Gastroenteroloji',
    question: 'Siroza bağlı akut gastroözofageal varis kanamasında erken vazoaktif ilaç ve endoskopik bant ligasyonu mortaliteyi düşürür mü?',
    expectedStance: 'affirmative',
    keyLiterature: 'Baveno VII Konsensüsü: Terlipressin/okreotid ve 12 saat içinde uygulanan endoskopik bant ligasyonu 6 haftalık mortaliteyi belirgin azaltır.'
  },
  {
    id: 44,
    specialty: 'Gastroenteroloji',
    question: 'Komplikasyonsuz akut sol kolon divertikülitinde ayaktan antibiyotiksiz izlem antibiyotikli tedavi kadar güvenli midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'AVOD ve DIABOLO randomize kontrollü çalışmaları: Komplikasyonsuz divertikülitte antibiyotiksiz semptomatik izlem perforasyon veya nüks oranını artırmaz.'
  },
  {
    id: 45,
    specialty: 'Gastroenteroloji',
    question: 'Karaciğer sirozunda spontan bakteriyel peritonit (SBP) geçiren hastalarda norfloksasin veya rifaksimin profilaksisi nüksü azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'EASL ve AASLD kılavuzları: Sekonder SBP profilaksisinde florokinolon veya rifaksimin kullanımı rekürrensi %70\'in üzerinde engeller.'
  },
  {
    id: 46,
    specialty: 'Gastroenteroloji',
    question: 'Crohn hastalığında erken dönemde başlanan biyolojik ajanlar (anti-TNF) mukozal iyileşme ve remisyon sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'SONIC çalışması (NEJM): İnfliksimab ve azatioprin kombinasyonu monoterapiye göre mukozal iyileşme ve kortikosteroidsiz remisyonda belirgin üstündür.'
  },
  {
    id: 47,
    specialty: 'Gastroenteroloji',
    question: 'Kronik hepatit C enfeksiyonunda direkt etkili antiviraller (DAA) %95\'in üzerinde kalıcı virolojik yanıt (SVR) sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ASTRAL ve POLARIS çalışmaları: 8-12 haftalık pangenotipik DAA rejimleri hepatit C\'yi %98 kür eder ve hepatosellüler karsinom riskini azaltır.'
  },
  {
    id: 48,
    specialty: 'Gastroenteroloji',
    question: '50 yaş üzeri asemptomatik bireylerde kolonoskopi ile kolorektal kanser taraması kanser insidansı ve mortalitesini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'NordICC çalışması ve ABD Ulusal Polip Çalışması: Kolonoskopik adenomatöz polip rezeksiyonu kolorektal kanser mortalitesini %50\'nin üzerinde düşürür.'
  },
  {
    id: 49,
    specialty: 'Gastroenteroloji',
    question: 'Kronik kabızlıkta çözünür lif takviyesi (psyllium) dışkılama sıklığını ve kıvamını düzeltir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'ACG ve Cochrane kılavuzları: Psyllium dışkı su tutma kapasitesini artırarak kronik idiyopatik konstipasyonda güvenli ve etkindir.'
  },
  {
    id: 50,
    specialty: 'Gastroenteroloji',
    question: 'Çölyak hastalığı tanısında doku transglutaminaz IgA (tTG-IgA) antikoru yüksek sensitivite ve spesifiteye sahip midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'ESPGHAN ve ACG kılavuzları: tTG-IgA çölyak taramasında %95\'in üzerinde sensitivite ve spesifiteye sahip altın standart serolojik testtir.'
  },
  {
    id: 51,
    specialty: 'Gastroenteroloji',
    question: 'Akut üst gastrointestinal kanamada ilk 24 saat içinde erken endoskopi yapılması yeniden kanama ve hastanede yatış süresini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Lau JY ve ark., ESGE kılavuzları: Erken endoskopik hemostaz yüksek riskli stigmaları olan ülserlerde transfüzyon ve cerrahi ihtiyacını azaltır.'
  },
  {
    id: 52,
    specialty: 'Gastroenteroloji',
    question: 'Şiddetli alkolik hepatitte (Maddrey skoru >= 32) oral prednizolon tedavisi kısa dönem sağkalımı artırır mı?',
    expectedStance: 'controversial',
    keyLiterature: 'STOPAH çalışması (NEJM): Kortikosteroidler 28 günlük mortaliteyi hafif azaltma eğilimi gösterse de 90 günlük sağkalımda belirgin fark saptanamamıştır.'
  },
  {
    id: 53,
    specialty: 'Gastroenteroloji',
    question: 'Fonksiyonel dispepside proton pompa inhibitörleri plaseboya kıyasla semptomatik rahatlama sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Moayyedi P ve ark. Cochrane analizi: PPI tedavisi epigastrik ağrı sendromu olan fonksiyonel dispepsi hastalarında anlamlı NNT sağlar.'
  },
  {
    id: 54,
    specialty: 'Gastroenteroloji',
    question: 'Akut kolesistitte semptomların ilk 72 saatinde uygulanan erken laparoskopik kolesistektomi gecikmiş cerrahiye üstün müdür?',
    expectedStance: 'affirmative',
    keyLiterature: 'Acar J ve ark., Cochrane meta-analizleri: Erken kolesistektomi toplam yatış süresini kısaltır, cerrahi komplikasyon riskini artırmaz.'
  },
  {
    id: 55,
    specialty: 'Gastroenteroloji',
    question: 'Ülseratif kolit aktif alevlenmesinde fekal mikrobiyota transplantasyonu (FMT) remisyon indüksiyonunda standart bir tedavi midir?',
    expectedStance: 'controversial',
    keyLiterature: 'Parametreleri değişken RKÇ\'lerde umut verici klinik remisyon oranları bildirilse de standardizasyon eksikliği nedeniyle kılavuzlarda henüz rutin önerilmez.'
  },
  {
    id: 56,
    specialty: 'Gastroenteroloji',
    question: 'Karaciğer sirozuna bağlı geniş hacimli parasentezde (>5 L) intravenöz albümin infüzyonu dolaşım disfonksiyonunu önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Ginès P ve ark., EASL kılavuzu: Her 1 litre boşaltılan asit için 8 gram intravenöz albümin verilmesi PICD, hiponatremi ve mortaliteyi engeller.'
  },
  {
    id: 57,
    specialty: 'Gastroenteroloji',
    question: 'İrritabl bağırsak sendromunda (IBS) düşük FODMAP diyeti karın ağrısı ve şişkinlik semptomlarını azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Halmos EP ve ark. (Gastroenterology): Fermente olabilir oligosakkaritlerin kısıtlanması IBS hastalarının %70\'inde semptom kontrolü sağlar.'
  },
  {
    id: 58,
    specialty: 'Gastroenteroloji',
    question: 'Akut parasetamol dışı karaciğer yetmezliğinde N-asetilsistein (NAC) erken evrede sağkalımı destekler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Lee WM ve ark. (Gastroenterology): Evre 1-2 ensefalopatili non-parasetamol akut karaciğer yetmezliğinde NAC transplantasyonsuz sağkalımı artırır.'
  },
  {
    id: 59,
    specialty: 'Gastroenteroloji',
    question: 'NASH (MASH) ilişkili karaciğer fibrozisinde resmetirom (tiroid hormon reseptör-beta agonisti) steatohepatiti geriletir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'MAESTRO-NASH çalışması (NEJM 2024): Resmetirom fibrozisi kötüleştirmeden MASH rezolüsyonu sağlayan ilk FDA onaylı moleküldür.'
  },
  {
    id: 60,
    specialty: 'Gastroenteroloji',
    question: 'Genel asemptomatik popülasyonda rutin karsinoembriyonik antijen (CEA) testi kolorektal kanser tarama testi olarak önerilir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'ASCO ve ABD Koruyucu Hizmetler Görev Gücü (USPSTF): CEA testinin taramada sensitivite ve spesifitesi yetersizdir; yalnızca tedavi sonrası nüks izleminde kullanılır.'
  },

  // =========================================================================
  // 4. NOROLOJI (61 - 80)
  // =========================================================================
  {
    id: 61,
    specialty: 'Nöroloji',
    question: 'Akut iskemik inmede ilk 4.5 saat içinde intravenöz alteplaz (rt-PA) fonksiyonel bağımsızlığı artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'NINDS ve ECASS III çalışmaları: İlk 4.5 saatte uygulanan IV trombolitik 90. günde bağımsız yaşam oranını (modifiye Rankin Skoru 0-1) anlamlı artırır.'
  },
  {
    id: 62,
    specialty: 'Nöroloji',
    question: 'Akut ön sirkülasyon geniş damar oklüzyonlu iskemik inmede mekanik trombektomi nörolojik sağkalımı düzeltir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'MR CLEAN, ESCAPE, EXTEND-IA: Endovasküler trombektomi geniş damar tıkanıklıklarında engellilik oranını dramatik şekilde azaltan devrim niteliğinde tedavidir.'
  },
  {
    id: 63,
    specialty: 'Nöroloji',
    question: 'Kronik ve epizodik migren profilaksisinde CGRP monoklonal antikorları aylık migren gün sayısını azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'EVOLVE, ARISE, PROMISE: Erenumab, fremanezumab ve galkanezumab migren sıklığını ve akut ilaç kullanımını belirgin düşürür.'
  },
  {
    id: 64,
    specialty: 'Nöroloji',
    question: 'Parkinson hastalığında levodopa erken başlandığında motor semptom kontrolünde en etkili tedavi midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'ELLDOPA ve LEAP çalışmaları: Levodopa motor semptomları en hızlı ve güçlü düzelten altın standart dopaminerjik tedavidir.'
  },
  {
    id: 65,
    specialty: 'Nöroloji',
    question: 'Relapsing-remitting multipl sklerozda erken dönemde yüksek etkinlikli DMT kullanımı uzun dönem sakatlığı önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'CARE-MS ve OPERA çalışmaları: Alemtuzumab, okrelizumab ve natalizumab erken başlandığında EDSS skoru ilerlemesini geciktirir.'
  },
  {
    id: 66,
    specialty: 'Nöroloji',
    question: 'Alzheimer hastalığında ginkgo biloba takviyesi bilişsel gerilemeyi durdurur veya demans riskini azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'GEM çalışması (JAMA): 3.000\'den fazla katılımcıda Ginkgo biloba Alzheimer insidansını veya bilişsel yıkımı plasebodan farklı kılmamıştır.'
  },
  {
    id: 67,
    specialty: 'Nöroloji',
    question: 'Akut intraserebral kanamada kan basıncının sistolik 140 mmHg hedefine güvenli şekilde düşürülmesi hematom büyümesini sınırlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'INTERACT-2 ve ATACH-2: Aşırı agresif hipotansiyondan kaçınılarak sistolik basıncın <140 mmHg seviyesine çekilmesi hematom ekspansiyonunu sınırlar.'
  },
  {
    id: 68,
    specialty: 'Nöroloji',
    question: 'Amyotrofik lateral sklerozda (ALS) riluzol trakeostomisiz genel sağkalımı uzatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Bensimon G ve ark., Cochrane derlemesi: Riluzol glutamat eksitotoksisitesini azaltarak ALS hastalarında ortalama 2-3 ay sağkalım uzaması sağlar.'
  },
  {
    id: 69,
    specialty: 'Nöroloji',
    question: 'Asemptomatik orta dereceli karotis stenozunda (<%70) rutin cerrahi endarterektomi medikal tedaviye göre inme riskini anlamlı azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'ACST ve modern kohortlar: Yoğun statin ve antiplatelet medikal tedavisi altında <%70 asemptomatik darlıkta cerrahi risk cerrahi faydayı dengeler.'
  },
  {
    id: 70,
    specialty: 'Nöroloji',
    question: 'Status epileptikusta ilk basamakta intramusküler midazolam veya intravenöz lorazepam nöbeti sonlandırmada en hızlı ajan mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'RAMPART çalışması (NEJM): Hastane öncesi IM midazolam ve IV lorazepam status epileptikusu durdurmada en yüksek başarı oranına sahiptir.'
  },
  {
    id: 71,
    specialty: 'Nöroloji',
    question: 'İdiyopatik fasiyal paralizide (Bell paralizisi) semptomların ilk 72 saatinde oral kortikosteroid tam iyileşmeyi artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Sullivan FM ve ark. (NEJM): Erken başlanan prednizolon fasiyal sinir fonksiyonlarının tam geri kazanımını %85\'in üzerine çıkarır.'
  },
  {
    id: 72,
    specialty: 'Nöroloji',
    question: 'Huzursuz bacaklar sendromunda uzun süreli yüksek doz dopamin agonistleri augmentasyona (semptomların erken başlaması ve şiddetlenmesi) yol açar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Garcia-Borreguero D ve ark., Kılavuzlar: Pramipeksol ve ropinirol uzun dönemde hastaların %50\'sinde augmentasyona neden olur; bu yüzden alfa-2-delta ligandları tercih edilmektedir.'
  },
  {
    id: 73,
    specialty: 'Nöroloji',
    question: 'Erken evre Alzheimer hastalığında amiloid hedefli monoklonal antikorlar (lekanemab, donanemab) bilişsel gerilemeyi kısmen yavaşlatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Clarity AD (NEJM 2023) ve TRAILBLAZER-ALZ 2: Lekanemab amiloid plakları temizleyerek CDR-SB skorunda 18 ayda %27 oranında yavaşlama sağlamıştır.'
  },
  {
    id: 74,
    specialty: 'Nöroloji',
    question: 'Erişkin akut pnömokokal menenjitte ilk antibiyotik dozundan önce deksametazon verilmesi işitme kaybı ve mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'de Gans J ve van de Beek D (NEJM): IV deksametazon S. pneumoniae menenjitinde mortaliteyi ve nörolojik sekelleri anlamlı oranda düşürür.'
  },
  {
    id: 75,
    specialty: 'Nöroloji',
    question: 'Non-kardiyoembolik iskemik inme geçiren hastalarda klopidogrel monoterapisi aspirine göre vasküler olay nüksünü azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'CAPRIE çalışması: Klopidogrel iskemik inme, MI veya vasküler ölüm birleşik sonlanım noktasında aspirine kıyasla %8.7 nispi risk azalması sağlamıştır.'
  },
  {
    id: 76,
    specialty: 'Nöroloji',
    question: 'Diyabetik nöropatik ağrıda ve postherpetik nevraljide gabapentinoidler plaseboya göre anlamlı analjezi sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Finnerup NB ve ark., EFNS/IASP kılavuzları: Pregabalin ve gabapentin nöropatik ağrıda birinci basamak kanıta dayalı tedavilerdir.'
  },
  {
    id: 77,
    specialty: 'Nöroloji',
    question: 'Myastenia gravis alevlenmelerinde intravenöz immünoglobulin (IVIG) ve plazmaferez benzer etkinlik ve güvenlik profiline sahip midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'Gajdos P ve ark. RKÇ\'leri: Akut myastenik krizde IVIG ve plazma değişimi benzer kas gücü düzelmesi ve solunum fonksiyon desteği sağlar.'
  },
  {
    id: 78,
    specialty: 'Nöroloji',
    question: 'Kronik subdural hematom drenajı sonrası nöbet öyküsü olmayan hastalarda rutin profilaktik antiepileptik kullanımı önerilir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'AANS ve Cochrane derlemeleri: Nöbet geçirmemiş subdural hematom olgularında profilaktik antiepileptik ilaçlar nöbet insidansını azaltmaz, yan etki riskini artırır.'
  },
  {
    id: 79,
    specialty: 'Nöroloji',
    question: 'Küme (cluster) baş ağrısı akut atağında %100 normobarik oksijen inhalasyonu ağrıyı 15 dakika içinde keser mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Cohen AS ve ark. (JAMA): Rezervuarlı maske ile 12-15 L/dk hızında verilen oksijen küme baş ağrısı atağını vakaların >%75\'inde güvenle durdurur.'
  },
  {
    id: 80,
    specialty: 'Nöroloji',
    question: 'Yüksek riskli TİA veya minör iskemik inme sonrası ilk 21 gün ikili antiplatelet (aspirin + klopidogrel) erken inme riskini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'CHANCE ve POINT çalışmaları: İlk 24 saatte başlanan ve 21 gün sürdürülen ikili antiplatelet tedavisi 90 günlük majör iskemik inme nüksünü %25-30 azaltır.'
  },

  // =========================================================================
  // 5. GOGUS HASTALIKLARI & PULMONOLOJI (81 - 98)
  // =========================================================================
  {
    id: 81,
    specialty: 'Göğüs Hastalıkları',
    question: 'Ağır astım alevlenmelerinde sistemik kortikosteroidler hastaneye yatış ihtiyacını ve nüksü azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'GINA Kılavuzu ve Cochrane analizleri: Kısa süreli sistemik steroidler bronşiyal inflamasyonu hızla baskılar, yatış oranlarını belirgin düşürür.'
  },
  {
    id: 82,
    specialty: 'Göğüs Hastalıkları',
    question: 'Obstrüktif uyku apnesi sendromunda CPAP tedavisi gündüz aşırı uykululuğu ve AHI skorunu düzeltir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Patil SP ve ark., AASM Kılavuzları: CPAP altın standart tedavi olup Epworth Uykululuk Ölçeğini ve solunumsal apneleri normalize eder.'
  },
  {
    id: 83,
    specialty: 'Göğüs Hastalıkları',
    question: 'Akut hiperkapnik KOAH alevlenmesinde non-invaziv mekanik ventilasyon (NIV / BiPAP) entübasyon ve mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Lightowler JV ve ark. Cochrane derlemesi: NIV entübasyon ihtiyacını %65, hastane içi mortaliteyi %50 oranında düşürür.'
  },
  {
    id: 84,
    specialty: 'Göğüs Hastalıkları',
    question: 'Yüksek riskli sigara içicilerinde yıllık düşük doz bilgisayarlı tomografi (LDCT) akciğer kanseri mortalitesini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'NLST ve NELSON çalışmaları: Yıllık LDCT taraması erken evre yakalama oranını artırarak akciğer kanserine bağlı mortaliteyi %20-24 azaltır.'
  },
  {
    id: 85,
    specialty: 'Göğüs Hastalıkları',
    question: 'İdiyopatik pulmoner fibroziste antifibrotik ajanlar (pirfenidon, nintedanib) FVC yıllık kayıp hızını yavaşlatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'INPULSIS ve ASCEND çalışmaları: Nintedanib ve pirfenidon akciğer fonksiyon kaybı hızını yaklaşık %50 oranında yavaşlatır.'
  },
  {
    id: 86,
    specialty: 'Göğüs Hastalıkları',
    question: 'Akut hemodinamik instabil masif pulmoner embolide sistemik trombolitik tedavi erken mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ESC Pulmoner Emboli Kılavuzu ve PEITHO: Kardiyojenik şok ve hipotansiyon tablosunda alteplaz infüzyonu sağ ventrikül yükünü hızla hafifletir ve sağkalımı korur.'
  },
  {
    id: 87,
    specialty: 'Göğüs Hastalıkları',
    question: 'Stabil hafif KOAH olgularında tek başına inhale kortikosteroid (İKS) monoterapisi alevlenmeleri önlemede ilk basamak mıdır?',
    expectedStance: 'refuted',
    keyLiterature: 'GOLD Kılavuzu: KOAH\'ta İKS monoterapisi önerilmez; pnömoni riskini artırır ve uzun etkili bronkodilatörler (LABA/LAMA) temel tedavidir.'
  },
  {
    id: 88,
    specialty: 'Göğüs Hastalıkları',
    question: 'Hafif-orta astımda inhale kortikosteroid + formoterol (MART protokolü) alevlenme riskini kısa etkili beta agonistlere göre azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'SYGMA 1-2 ve PRACTICAL: İKS-formoterolün hem idame hem rahatlatıcı olarak kullanımı ağır astım alevlenmelerini %60 oranında azaltır.'
  },
  {
    id: 89,
    specialty: 'Göğüs Hastalıkları',
    question: 'Sarkoidozda asemptomatik evre 1 bilateral hiler lenfadenopatide rutin sistemik steroid başlanması gerekir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'ATS/ERS/WASOG Kılavuzu: Evre 1 asemptomatik sarkoidoz olgularının %80\'i kendiliğinden geriler; sistemik kortikosteroid yalnızca organ tutulumu ve semptom varlığında başlanır.'
  },
  {
    id: 90,
    specialty: 'Göğüs Hastalıkları',
    question: 'Pulmoner arteriyel hipertansiyonda erken kombine hedefli vazoaktif tedavi klinik kötüleşmeyi geciktirir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'AMBITION çalışması (NEJM): Eradansentan ve tadalafil kombinasyonu monoterapiye göre klinik kötüleşme ve hospitalizasyon riskini %50 azaltır.'
  },
  {
    id: 91,
    specialty: 'Göğüs Hastalıkları',
    question: 'Akut solunum sıkıntısı sendromunda (ARDS) düşük tidal volümlü koruyucu mekanik ventilasyon (6 mL/kg) mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ARDS Network çalışması (NEJM): Düşük tidal volüm stratejisi geleneksel ventilasyona göre mortaliteyi %39.8\'den %31\'e düşürmüştür.'
  },
  {
    id: 92,
    specialty: 'Göğüs Hastalıkları',
    question: 'Ağır ARDS hastalarında prone (yüzüstü) ventilasyon pozisyonu 28 günlük mortaliteyi anlamlı derecede azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'PROSEVA çalışması (NEJM): PaO2/FiO2 < 150 mmHg olan ARDS hastalarında günde en az 16 saat prone pozisyonu mortaliteyi %32.8\'den %16\'ya indirmiştir.'
  },
  {
    id: 93,
    specialty: 'Göğüs Hastalıkları',
    question: 'Kistik fibroziste üçlü CFTR modülatör tedavisi (eleksakaftor/tezakaftor/ivakaftor) akciğer fonksiyonunu ve ter testini belirgin iyileştirir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Middleton PG ve ark. (NEJM): F508del mutasyonu taşıyan hastalarda FEV1\'de %14 artış ve alevlenmelerde %63 azalma sağlamıştır.'
  },
  {
    id: 94,
    specialty: 'Göğüs Hastalıkları',
    question: 'Sigara bırakma tedavisinde vareniklin nikotin replasman tedavisine göre daha yüksek uzun dönem bırakma oranı sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'EAGLES çalışması (Lancet): Vareniklin nikotin bandı ve bupropiona kıyasla en yüksek sürekli sigara bırakma başarısını sergilemiştir.'
  },
  {
    id: 95,
    specialty: 'Göğüs Hastalıkları',
    question: 'Plevral ampiyem veya komplike parapnömonik effüzyonda göğüs tüpü ile plevral drenaj zorunlu ve küratif bir yaklaşım mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'BTS Plevral Hastalık Kılavuzları: pH < 7.20, pürülan sıvı veya mikrobiyal pozitiflik varlığında tüp torakostomi gecikmeden uygulanmalıdır.'
  },
  {
    id: 96,
    specialty: 'Göğüs Hastalıkları',
    question: 'Kronik tromboembolik pulmoner hipertansiyonda (KTEPH) pulmoner endarterektomi potansiyel olarak küratif midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'Mayer E ve ark., ESC Kılavuzu: Uygun anatomik lezyonu olan KTEPH hastalarında cerrahi endarterektomi hemodinamiyi normalize edebilir.'
  },
  {
    id: 97,
    specialty: 'Göğüs Hastalıkları',
    question: 'Asemptomatik hafif KOAH hastalarında rutin günlük profilaktik antibiyotik alevlenmeyi önlemede önerilir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'GOLD Kılavuzu: Asemptomatik stabil hafif KOAH\'ta rutin profilaktik antibiyotik endike değildir; dirençli patojenler ve yan etkilere yol açar.'
  },
  {
    id: 98,
    specialty: 'Göğüs Hastalıkları',
    question: 'COVID-19 pnömonisinde ek oksijen veya ventilatör desteği alan hastalarda deksametazon mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'RECOVERY çalışması (NEJM): Günlük 6 mg deksametazon invaziv mekanik ventilasyondaki hastalarda 28 günlük mortaliteyi üçte bir oranında düşürmüştür.'
  },

  // =========================================================================
  // 6. ENFEKSIYON HASTALIKLARI & MIKROBIYOLOJI (99 - 118)
  // =========================================================================
  {
    id: 99,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'HIV temas öncesi profilaksisi (PrEP) yüksek riskli bireylerde cinsel yolla HIV bulaşını %99\'a varan oranda önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'iPrEx, PROUD, IPERGAY çalışmaları: Düzenli tenofovir/emtrisitabin kullanımı HIV bulaşma riskini %99 oranında engeller.'
  },
  {
    id: 100,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Staphylococcus aureus bakteriyemisinde enfektif endokarditi dışlamak için tüm hastalarda rutin ekokardiyografi yapılmalı mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'IDSA ve ESC Endokardit Kılavuzları: S. aureus bakteriyemisinde endokardit riski %15-25 olup rutin ekokardiyografi yapılması şarttır.'
  },
  {
    id: 101,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Clostridioides difficile enfeksiyonunda oral fidaksomisin vankomisine kıyasla nüks oranını belirgin azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Louie TJ ve ark. (NEJM): Fidaksomisin dar spektrumu sayesinde bağırsak mikrobiyotasını korur ve enfeksiyon nüksünü %50 azaltır.'
  },
  {
    id: 102,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Sepsis ve septik şokta ilk saat içinde geniş spektrumlu antimikrobiyal başlanması sağkalımı artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Surviving Sepsis Campaign Kılavuzu: Antibiyotik gecikmesinin her saati septik şok mortalitesini yaklaşık %7.6 oranında artırır.'
  },
  {
    id: 103,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'İnfluenza enfeksiyonunda oseltamivir semptomların ilk 48 saatinde başlandığında hastalık süresini kısaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Dobson J ve ark. Lancet meta-analizi: Nöraminidaz inhibitörü oseltamivir ateş ve semptom süresini yaklaşık 24 saat kısaltır.'
  },
  {
    id: 104,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Karbapenem dirençli Klebsiella pneumoniae enfeksiyonlarında seftazidim-avibaktam kolistine göre daha düşük mortalite ve nefrotoksisite sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'CRACKLE-2 kohortu ve Tumbarello M ve ark.: Seftazidim-avibaktam KPC üreten suşlarda sağkalımı anlamlı artırır ve kolistine göre böbrek hasarı yapmaz.'
  },
  {
    id: 105,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Asemptomatik Giardia lamblia kisti taşıyan bağışıklığı sağlam bireylerde rutin metronidazol tedavisi zorunlu mudur?',
    expectedStance: 'refuted',
    keyLiterature: 'CDC ve DSÖ parazitoloji kılavuzları: Asemptomatik kist atıcılarında salgın riski veya immün yetmezlik yoksa rutin eradikasyon tedavisi endike değildir.'
  },
  {
    id: 106,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Ventilatör ilişkili pnömonide (VAP) mikrobiyolojik kültür sonuçlarına göre antibiyotik deeskalasyonu güvenli midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'ATS/IDSA VAP Kılavuzları: Geniş spektrumlu ampirik antibiyotiğin hedefe yönelik daraltılması nüksü veya mortaliteyi artırmadan direnci engeller.'
  },
  {
    id: 107,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Kronik hepatit B enfeksiyonunda uzun süreli tenofovir veya entekavir tedavisi hepatosellüler karsinom riskini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'EASL ve AASLD HBV Kılavuzları: Viral yükün (HBV DNA) baskılanması siroz ilerlemesini durdurur ve karaciğer kanseri insidansını belirgin düşürür.'
  },
  {
    id: 108,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Erken evre Lyme hastalığında eritema migrans lezyonunda 10-14 günlük oral doksisiklin tam iyileşme sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'IDSA Lyme Kılavuzu: Doksisiklin erken dönemde %95\'in üzerinde tam kür sağlar ve geç nöroborreliyoz gelişimini önler.'
  },
  {
    id: 109,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Florokinolon direncinin %10\'un üzerinde olduğu bölgelerde akut piyelonefritte ampirik oral siprofloksasin ilk tercih midir?',
    expectedStance: 'refuted',
    keyLiterature: 'IDSA İYE Kılavuzu: Toplumdaki direnç %10\'u aştığında florokinolonlar tek başına ampirik başlanmamalı; seftriakson gibi paranteral ajanlar tercih edilmelidir.'
  },
  {
    id: 110,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Kalıcı üriner kateteri olan hastalarda gümüş alaşımlı kateterler standart kateterlere göre semptomatik enfeksiyonu kesin önler mi?',
    expectedStance: 'refuted',
    keyLiterature: 'CATHETER randomize çalışması (Lancet): Gümüş alaşımlı kateterler klinik üriner enfeksiyon veya antibiyotik ihtiyacında belirgin fark yaratmamıştır.'
  },
  {
    id: 111,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Kuduz şüpheli temas sonrası yara bakımı ve tam doz aşı/immünoglobulin profilaksisi ensefaliti %100\'e yakın önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'DSÖ Kuduz Kılavuzu: Klinik semptomlar başlamadan önce uygulanan temas sonrası profilaksi (PEP) mortalitesi %100 olan kuduzu tam önler.'
  },
  {
    id: 112,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Tüberküloz tedavisinde doğrudan gözetimli tedavi (DOTS) tedavi uyumunu ve kür oranını artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'DSÖ Tüberküloz Kılavuzları: DOTS stratejisi çoklu ilaca dirençli tüberküloz (MDR-TB) gelişimini önlemede ve küre ulaşmada en etkili modeldir.'
  },
  {
    id: 113,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Akut viral rinosinüzitte ilk 7 gün içinde rutin amoksisilin-klavulanat başlanmalı mıdır?',
    expectedStance: 'refuted',
    keyLiterature: 'AAO-HNS ve IDSA Kılavuzları: Sinüzitlerin %90\'ı viraldir; antibiyotikler semptomlar 10 günü aşmadıkça veya çift fazlı kötüleşme olmadıkça endike değildir.'
  },
  {
    id: 114,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'İnvaziv pulmoner aspergilloz tedavisinde vorikonazol konvansiyonel amfoterisin B\'ye kıyasla daha yüksek sağkalım sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Herbrecht R ve ark. (NEJM): Vorikonazol amfoterisin B\'ye kıyasla daha iyi klinik yanıt (%53 vs %32) ve belirgin sağkalım avantajı sunmuştur.'
  },
  {
    id: 115,
    specialty: 'Enfeksiyon Hastalıkları',
    question: '50 yaş üzeri erişkinlerde rekombinant zona aşısı (Shingrix) Herpes Zoster ve postherpetik nevraljiye karşı >%90 koruyucu mudur?',
    expectedStance: 'affirmative',
    keyLiterature: 'ZOE-50 ve ZOE-70 çalışmaları (NEJM): Rekombinant adjuvanlı aşı zona insidansını %97 oranında azaltarak canlı aşıya üstünlük sağlamıştır.'
  },
  {
    id: 116,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Meningokokal menenjitli hastanın yakın ev temaslılarına kemoprofilaksi (rifampisin veya siprofloksasin) sekonder vakaları önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'CDC ve DSÖ Kılavuzları: İlk 24 saatte uygulanan tek doz siprofloksasin veya kısa süreli rifampisin nazofaringeal taşıyıcılığı yok eder.'
  },
  {
    id: 117,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'Kanlı mukuslu akut dizanterik ishalde loperamid (antimotilite ajanı) kullanımı güvenli midir?',
    expectedStance: 'refuted',
    keyLiterature: 'CDC ve IDSA Kılavuzları: İnvaziv bakteriyel enteritlerde ve toksin üreten patojenlerde antimotilite ajanları toksik megakolon riskini artırır ve kontrendikedir.'
  },
  {
    id: 118,
    specialty: 'Enfeksiyon Hastalıkları',
    question: 'HIV/AIDS hastalarında sitomegalovirüs (CMV) retiniti tedavisinde intravenöz gansiklovir körlüğü engeller mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Jabs DA ve ark., Studies of Ocular Complications of AIDS: Gansiklovir retinal nekroz progresyonunu durdurur ve görme fonksiyonunu korur.'
  },

  // =========================================================================
  // 7. NEFROLOJI & UROLOJI (119 - 136)
  // =========================================================================
  {
    id: 119,
    specialty: 'Nefroloji',
    question: 'Diyabetik nefropatisi ve albüminürisi olan hastalarda ACE inhibitörleri ve ARB\'ler son dönem böbrek yetmezliğini geciktirir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'RENAAL ve IDNT çalışmaları: ARB tedavisi kreatinin ikiye katlanması ve diyaliz ihtiyacını %16-20 oranında geciktirir.'
  },
  {
    id: 120,
    specialty: 'Nefroloji',
    question: 'Tip 2 diyabetli kronik böbrek hastalarında finerenon (non-steroid MRA) kardiyovasküler ve renal olayları azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'FIDELIO-DKD ve FIGARO-DKD: Finerenon albüminüriyi azaltır ve son dönem böbrek hastalığı ilerlemesini yavaşlatır.'
  },
  {
    id: 121,
    specialty: 'Nefroloji',
    question: 'İntravenöz kontrast madde nefropatisini önlemede intravenöz izotonik sodyum klorür hidrasyonu en etkili kanıtlanmış yöntem midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'AMACING ve KDIGO kılavuzları: Yeterli IV kristaloid hidrasyonu kontrast nefropatisi riskini en aza indirmede temel dayanaktır.'
  },
  {
    id: 122,
    specialty: 'Nefroloji',
    question: 'Anjiyografi öncesi oral N-asetilsistein (NAC) verilmesi kontrast ilişkili akut böbrek hasarını hidrasyona göre üstün engeller mi?',
    expectedStance: 'refuted',
    keyLiterature: 'PRESERVE çalışması (NEJM): Yaklaşık 5.000 yüksek riskli hastada oral NAC plaseboya göre kontrast nefropatisini veya 90 günlük ölümü azaltmamıştır.'
  },
  {
    id: 123,
    specialty: 'Nefroloji',
    question: 'Otozomal dominant polikistik böbrek hastalığında tolvaptan toplam böbrek hacmi artışını ve eGFR kaybını yavaşlatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'TEMPO 3:4 ve REPRISE (NEJM): V2 reseptör antagonisti tolvaptan hızlı ilerleyen ADPKD hastalarında böbrek fonksiyon kaybını geciktirir.'
  },
  {
    id: 124,
    specialty: 'Nefroloji',
    question: 'Primer membranöz nefropatide rituksimab siklosporine kıyasla daha uzun süreli ve güvenli proteinüri remisyonu sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'MENTOR çalışması (NEJM): Rituksimab 24. ayda tam ve kısmi remisyonu sürdürmede siklosporinden belirgin üstün bulunmuştur.'
  },
  {
    id: 125,
    specialty: 'Nefroloji',
    question: 'Benign prostat hiperplazisinde 5-alfa redüktaz inhibitörleri (finasterid) prostat hacmini küçültür ve cerrahi riskini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'PLESS ve MTOPS çalışmaları: 5-ARI tedavisi prostat hacmini %20-25 küçültür ve akut idrar retansiyonu riskini yarı yarıya düşürür.'
  },
  {
    id: 126,
    specialty: 'Nefroloji',
    question: 'Asemptomatik akut böbrek hasarında profilaktik çok erken diyaliz başlanması gecikmeli diyalize göre mortaliteyi azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'STARRT-AKI ve IDEAL-ICU (NEJM): Ciddi komplikasyonlar gelişmeden erken profilaktik RRT başlanması sağkalımı artırmamış, kateter komplikasyonlarını artırmıştır.'
  },
  {
    id: 127,
    specialty: 'Nefroloji',
    question: 'Distal üreter taşlarında (<10 mm) tamsulosin ile medikal ekspulsif tedavi taş düşürme oranını artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'SUSPEND ve Cochrane derlemeleri: Distal yerleşimli 5-10 mm taşlarda alfa bloker kullanımı kendiliğinden taş düşürme hızını artırır ve analjezik ihtiyacını azaltır.'
  },
  {
    id: 128,
    specialty: 'Nefroloji',
    question: 'Kronik böbrek hastalarında eritropoietin analogları ile hemoglobin düzeyini tamamen normale (>13 g/dL) yükseltmek mortaliteyi düşürür mü?',
    expectedStance: 'refuted',
    keyLiterature: 'TREAT ve CHOIR çalışmaları: Hemoglobinin >13 g/dL hedefine yükseltilmesi inme ve kardiyovasküler tromboz riskini artırmış, sağkalım faydası sağlamamıştır.'
  },
  {
    id: 129,
    specialty: 'Nefroloji',
    question: 'Aldosteron üreten tek taraflı adrenal adenomda (Conn sendromu) laparoskopik adrenalektomi hipertansiyonu kür edebilir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Endocrine Society Kılavuzları: Cerrahi rezeksiyon hipokalemiyi tamamen düzeltir ve hastaların yarısından fazlasında antihipertansif ihtiyacını ortadan kaldırır.'
  },
  {
    id: 130,
    specialty: 'Nefroloji',
    question: 'Asemptomatik mikroskobik hematürisi olan yaşlı ve sigara öyküsü bulunan erkeklerde ürolojik malignite riski yüksek midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'AUA ve EAU Hematüri Kılavuzları: 50 yaş üstü sigara içen erkeklerde mikroskobik hematüri mesane veya üst üriner sistem kanseri açısından sistoskopi gerektirir.'
  },
  {
    id: 131,
    specialty: 'Nefroloji',
    question: 'Böbrek nakli sonrasında takrolimus siklosporine kıyasla akut rejeksiyon oranını daha fazla azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ELITE-Symphony çalışması (NEJM): Düşük doz takrolimus içeren rejim daha yüksek allogreft sağkalımı ve daha az biyopsi kanıtlı akut rejeksiyon sağlamıştır.'
  },
  {
    id: 132,
    specialty: 'Nefroloji',
    question: 'Kadınlarda stres üriner inkontinans tedavisinde pelvik taban kas eğitimi (Kegel egzersizleri) semptomları düzeltir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Dumoulin C ve ark., Cochrane derlemesi: Pelvik taban kas egzersizleri stres inkontinansta birinci basamak en etkili konservatif tedavi yöntemidir.'
  },
  {
    id: 133,
    specialty: 'Nefroloji',
    question: 'Oligürik olmayan akut tübüler nekrozda rutin yüksek doz furosemid infüzyonu böbrek fonksiyonlarının geri dönüşünü hızlandırır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'KDIGO AKI Kılavuzu: Kıvrım diüretikleri hipervolemi kontrolü haricinde tübüler hasarı geri çevirmez ve GFR toparlanmasını hızlandırmaz.'
  },
  {
    id: 134,
    specialty: 'Nefroloji',
    question: 'Proliferatif lupus nefritinde mikofenolat mofetil siklofosfamide eşdeğer remisyon ve daha az yan etki sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ALMS çalışması (NEJM) ve KDIGO: Mikofenolat mofetil indüksiyon tedavisinde siklofosfamid kadar etkili olup infertilite ve lökopeni riskini azaltır.'
  },
  {
    id: 135,
    specialty: 'Nefroloji',
    question: 'Rekürren kalsiyum taşı olan hiperkalsiürili hastalarda tiyazid grubu diüretikler taş oluşumunu azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Pearle MS ve ark., AUA Kılavuzu: Hidroklorotiyazid/klortalidon distal tübülde kalsiyum geri emilimini artırarak idrar kalsiyumunu düşürür ve taş nüksünü önler.'
  },
  {
    id: 136,
    specialty: 'Nefroloji',
    question: 'Prostat kanseri şüphesinde multiparametrik MR kılavuzluğunda hedefli biyopsi gereksiz biyopsileri ve aşırı tanıyı azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'PRECISION çalışması (NEJM): MRI hedefe yönelik biyopsi klinik önemsiz kanser aşırı tanısını azaltırken klinik anlamlı agresif kanser yakalama oranını artırır.'
  },

  // =========================================================================
  // 8. ROMATOLOJI & IMMUNOLOJI (137 - 154)
  // =========================================================================
  {
    id: 137,
    specialty: 'Romatoloji',
    question: 'Romatoid artritte erken dönemde başlanan metotreksat eklem erozyonlarını ve radyolojik ilerlemeyi önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'EULAR ve ACR Kılavuzları: Metotreksat romatoid artrit tedavisinin temel taşı olup kalıcı eklem hasarını ve sakatlığı belirgin şekilde engeller.'
  },
  {
    id: 138,
    specialty: 'Romatoloji',
    question: 'Aksiyel spondiloartrit tedavisinde TNF inhibitörleri omurga ağrısını ve MRG inflamasyonunu belirgin düzeltir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'ASAS/EULAR Kılavuzları ve ATLAS/ASSERT: Anti-TNF biyolojikler NSAİİ\'ye yanıtsız aktif aksiyel spondiloartritte remisyon oranlarını dramatik artırır.'
  },
  {
    id: 139,
    specialty: 'Romatoloji',
    question: 'Sistemik lupus eritematozusta (SLE) hidroksiklorokin kullanımı alevlenmeleri azaltır ve sağkalımı uzatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'LUMINA kohortu ve EULAR SLE Kılavuzu: Hidroksiklorokin SLE\'li tüm hastalarda organ hasarını, trombozu ve mortaliteyi azaltan vazgeçilmez temel ilaçtır.'
  },
  {
    id: 140,
    specialty: 'Romatoloji',
    question: 'Akut gut atağı sırasında ilk gün allopurinol başlanması atağı hızla sonlandırır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'EULAR ve ACR Gut Kılavuzları: Ürat düşürücü tedavi atağın akut alevli fazında başlandığında kristal mobilizasyonuna bağlı atağı uzatabilir; ilk önce antienflamatuar başlanmalıdır.'
  },
  {
    id: 141,
    specialty: 'Romatoloji',
    question: 'Polimiyaljiya romatikada düşük doz oral kortikosteroid tedavisi semptomlarda 24-48 saat içinde dramatik iyileşme sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'EULAR/ACR Kılavuzları: Günde 12.5-25 mg prednizolon ile 48 saat içinde sağlanan belirgin klinik düzelme polimiyaljiya romatikanın tanısal ve terapötik özelliğidir.'
  },
  {
    id: 142,
    specialty: 'Romatoloji',
    question: 'Dev hücreli (temporal) arteritte görme kaybını engellemek için biyopsi beklenmeden derhal yüksek doz kortikosteroid başlanmalı mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'BSR ve EULAR Kılavuzları: İskemik optik nöropati ve kalıcı körlük riskini engellemek için klinik şüphe duyulur duyulmaz acil steroid infüzyonu şarttır.'
  },
  {
    id: 143,
    specialty: 'Romatoloji',
    question: 'Psöriyatik artritte IL-17A inhibitörleri (sekukinumab, iksekizumab) eklem ve cilt lezyonlarında yüksek klinik yanıt sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'FUTURE 1-5 ve SPIRIT çalışmaları: IL-17 inhibitörleri periferik artrit, daktilit, entezit ve psöriyazis plaklarında üstün etkinlik gösterir.'
  },
  {
    id: 144,
    specialty: 'Romatoloji',
    question: 'Romatoid artritte JAK inhibitörleri (tofasitinib, barisitinib, upadasitinib) oral yoldan biyolojik ajanlara benzer klinik remisyon sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ORAL ve SELECT çalışmaları: Hedefe yönelik sentetik DMARD olan JAK inhibitörleri biyolojik anti-TNF ajanlarla yarışır klinik remisyon sağlar.'
  },
  {
    id: 145,
    specialty: 'Romatoloji',
    question: 'Sistemik skleroz ilişkili interstisiyel akciğer hastalığında mikofenolat mofetil akciğer fonksiyonlarını stabilize eder mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Scleroderma Lung Study II (Lancet Resp Med): Mikofenolat mofetil siklofosfamidle benzer FVC koruması sağlarken belirgin şekilde daha az toksiktir.'
  },
  {
    id: 146,
    specialty: 'Romatoloji',
    question: 'Ankilozan spondilitte ilerleyici füzyonu engellemek için asemptomatik hastalara rutin profilaktik vertebroplasti önerilir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'ASAS ve ACR Kılavuzları: Profilaktik vertebroplasti ankilozan spondilitte kesinlikle kontrendikedir ve füzyonu engellemez; spinal kord hasarı riski taşır.'
  },
  {
    id: 147,
    specialty: 'Romatoloji',
    question: 'Behçet sendromunda oral aft ve genital ülserlerin tekrarlamasını önlemede kolşisin etkili bir birinci basamak mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'Yurdakul S ve ark. (Arthritis Rheum) ve EULAR Behçet Kılavuzu: Kolşisin mukokutanöz lezyonların ve artrit ataklarının sıklığını azaltır.'
  },
  {
    id: 148,
    specialty: 'Romatoloji',
    question: 'ANCA ilişkili vaskülitlerde (GPA/MPA) rituksimab indüksiyon tedavisinde siklofosfamide eşdeğer etkinlik sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'RAVE ve RITUXVAS çalışmaları (NEJM): Rituksimab relapslı veya yeni tanılı ANCA vaskülitlerinde siklofosfamid kadar güçlü remisyon sağlar.'
  },
  {
    id: 149,
    specialty: 'Romatoloji',
    question: 'Diz osteoartritinde glukozamin ve kondroitin takviyesi eklem kıkırdağını anatomik olarak onarır ve kıkırdak kaybını durdurur mu?',
    expectedStance: 'refuted',
    keyLiterature: 'GAIT çalışması (NEJM) ve OARSI/ACR Kılavuzları: Glukozamin eklem kıkırdağını anatomik olarak rejenere etmez ve plaseboya klinik üstünlük göstermez.'
  },
  {
    id: 150,
    specialty: 'Romatoloji',
    question: 'Romatoid artritte hedefe yönelik tedavi (Treat-to-Target) yaklaşımı standart tedaviye göre klinik remisyon oranlarını artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'TICORA çalışması: Hastalık aktivitesinin sık ölçülüp ilacın hedefe göre titre edilmesi radyolojik erozyonları azaltır ve tam remisyonu artırır.'
  },
  {
    id: 151,
    specialty: 'Romatoloji',
    question: 'Fibromiyalji sendromunda duloksetin ve pregabalin ağrı skorunu ve uyku kalitesini düzeltir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'EULAR Fibromiyalji Kılavuzu: Duloksetin ve pregabalin santral duyarlılaşmayı hafifleterek plaseboya göre anlamlı analjezi ve fonksiyonel iyileşme sağlar.'
  },
  {
    id: 152,
    specialty: 'Romatoloji',
    question: 'Spondiloartrit tüm spektrumu (non-radyografik ve radyografik) dikkate alındığında kadın ve erkeklerde yaklaşık eşit oranda görülür mü?',
    expectedStance: 'affirmative',
    keyLiterature: 'ASAS ve Rudwaleit M ve ark.: Non-radyografik aksiyel spondiloartrit dahil edildiğinde kadın-erkek görülme oranı 1:1 eşitliğe ulaşmaktadır.'
  },
  {
    id: 153,
    specialty: 'Romatoloji',
    question: 'Ailesel Akdeniz Ateşinde (FMF) günlük düzenli kolşisin tedavisi sekonder AA amiloidozu ve renal yetmezliği önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Zemer D ve ark. (NEJM): Düzenli kolşisin amiloid nefropatisi gelişimini %99 oranında engeller ve FMF ataklarını baskılar.'
  },
  {
    id: 154,
    specialty: 'Romatoloji',
    question: 'Eozinofilik granülomatoz polianjiyitiste (Churg-Strauss) anti-IL-5 antikoru mepolizumab alevlenme oranını azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'MIRRA çalışması (NEJM): Mepolizumab EGPA hastalarında kortikosteroid dozunu azaltırken relapssız remisyon süresini uzatır.'
  },

  // =========================================================================
  // 9. ONKOLOJI & HEMATOLOJI (155 - 172)
  // =========================================================================
  {
    id: 155,
    specialty: 'Onkoloji',
    question: 'PD-L1 yüksek ileri evre küçük hücreli dışı akciğer kanserinde pembrolizumab monoterapi olarak kemoterapiden üstün sağkalım sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'KEYNOTE-024 (NEJM): Pembrolizumab PD-L1 >=%50 olgularda genel sağkalımı kemoterapiye kıyasla neredeyse ikiye katlamıştır.'
  },
  {
    id: 156,
    specialty: 'Onkoloji',
    question: 'HER2 pozitif erken evre meme kanserinde adjuvan trastuzumab kemoterapiye eklendiğinde nüks ve ölümü azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'HERA ve NSABP B-31/NCCTG N9831: Trastuzumab 10 yıllık hastalıksız sağkalımı ve genel sağkalımı dramatik olarak artırmıştır.'
  },
  {
    id: 157,
    specialty: 'Onkoloji',
    question: 'Kronik miyeloid lösemide (KML) imatinib birinci basamakta 10 yıllık sağkalımı %80\'in üzerine çıkarır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'IRIS çalışması (NEJM): BCR-ABL tirozin kinaz inhibitörü imatinib ölümcül kabul edilen KML\'yi kronik yönetilebilir bir hastalığa dönüştürmüştür.'
  },
  {
    id: 158,
    specialty: 'Onkoloji',
    question: 'Genel asemptomatik sağlıklı popülasyonda rutin tüm vücut PET-CT taraması kanser mortalitesini azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'NCCN ve ASCO Kılavuzları: Sağlıklı bireylerde rutin tüm vücut taraması yüksek yalancı pozitiflik, gereksiz invaziv biyopsiler ve radyasyon yükü yaratır; önerilmez.'
  },
  {
    id: 159,
    specialty: 'Onkoloji',
    question: 'Kanser ilişkili venöz tromboembolizm tedavisinde oral Faktör Xa inhibitörleri (edoksaban, rivaroksaban) DMAH kadar etkili midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'CARAVAGGIO ve Hokusai-VTE Cancer: DOAK grubu ilaçlar kanser hastalarında VTE nüksünü önlemede subkütan dalteparine eşdeğer bulunmuştur.'
  },
  {
    id: 160,
    specialty: 'Hematoloji',
    question: 'Kronik immün trombositopenide (ITP) trombopoietin reseptör agonistleri (romiplostim, eltrombopag) trombosit sayısını güvenle artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Kuter DJ ve Bussel JB çalışmaları (NEJM/Lancet): TPO-RA ilaçları refrakter ITP\'de kanama ataklarını ve splenektomi ihtiyacını belirgin azaltır.'
  },
  {
    id: 161,
    specialty: 'Onkoloji',
    question: 'Evre III kolon kanserinde cerrahi sonrası adjuvan FOLFOX kemoterapisi hastalıksız ve genel sağkalımı artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'MOSAIC çalışması (NEJM): 5-FU/LV rejimine oksaliplatin eklenmesi (FOLFOX) 10 yıllık hastalıksız sağkalımı anlamlı derecede yükseltmiştir.'
  },
  {
    id: 162,
    specialty: 'Onkoloji',
    question: 'BRAF V600 mutasyonlu metastatik melanomda kombine BRAF + MEK inhibisyonu tek başına monoterapiye göre sağkalımı uzatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'COMBI-d ve coBRIM çalışmaları (NEJM): Dabrafenib + trametinib ikilisi direnç gelişimini geciktirerek progresyonsuz ve genel sağkalımı artırır.'
  },
  {
    id: 163,
    specialty: 'Hematoloji',
    question: 'Multipl miyelomda genç ve uygun hastalarda indüksiyon sonrası otolog kök hücre nakli progresyonsuz sağkalımı uzatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'IFM/DFCI 2009 ve DETERMINATION (NEJM): Erken otolog nakil miyelomda progresyonsuz sağkalımı tek başına kemoterapiye göre belirgin uzatır.'
  },
  {
    id: 164,
    specialty: 'Onkoloji',
    question: 'Kemoterapiye bağlı febril nötropenide ampirik geniş spektrumlu intravenöz antibiyotik acil başlanmalı mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'ASCO ve IDSA Nötropenik Ateş Kılavuzları: Febril nötropeni onkolojik acildir; ilk 60 dakikada psödomonal etkili beta-laktam başlanması mortaliteyi düşürür.'
  },
  {
    id: 165,
    specialty: 'Onkoloji',
    question: 'Metastatik kastrasyona dirençli prostat kanserinde enzalutamid ve abirateron genel sağkalımı uzatır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'COU-AA-301 ve AFFIRM çalışmaları: Yeni nesil androjen sinyal inhibitörleri dosetaksel öncesi ve sonrasında genel sağkalımı anlamlı artırmıştır.'
  },
  {
    id: 166,
    specialty: 'Hematoloji',
    question: 'Orak hücreli anemide hidroksiüre tedavisi vazo-oklüzif ağrılı krizleri ve akut göğüs sendromu sıklığını azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'MSH çalışması (NEJM): Hidroksiüre fetal hemoglobin (HbF) düzeyini artırarak kriz sıklığını ve kan transfüzyonu ihtiyacını yarı yarıya düşürür.'
  },
  {
    id: 167,
    specialty: 'Hematoloji',
    question: 'Akut promiyelositik lösemide (APL) tüm-trans retinoik asit (ATRA) ve arsenik trioksit kemoterapisiz yüksek kür sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'APL0406 çalışması (NEJM): Düşük-orta riskli APL\'de ATRA + ATO kombinasyonu %99 tam remisyon ve kemoterapisiz kalıcı kür sağlamıştır.'
  },
  {
    id: 168,
    specialty: 'Onkoloji',
    question: 'Genel popülasyonda rutin yıllık CA-125 ölçümü over kanseri mortalitesini azaltan bir tarama testi midir?',
    expectedStance: 'refuted',
    keyLiterature: 'UKCTOCS çalışması (Lancet 2021): 200.000 kadında yıllık CA-125 ve ultrason taraması over kanseri mortalitesini azaltmamıştır; rutin önerilmez.'
  },
  {
    id: 169,
    specialty: 'Onkoloji',
    question: 'Metastatik kolorektal kanserde KRAS veya NRAS mutasyonu saptandığında anti-EGFR tedavisi (setuksimab, panitumumab) etkisiz midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'CRYSTAL ve PRIME çalışmaları: RAS ekzon 2-4 mutasyonları varlığında anti-EGFR monoklonal antikorlar fayda sağlamaz ve kontrendikedir.'
  },
  {
    id: 170,
    specialty: 'Onkoloji',
    question: 'Yüksek emetojenik kemoterapide 5-HT3 antagonisti + NK1 antagonisti + deksametazon üçlüsü akut ve gecikmiş bulantıyı önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'ASCO ve MASCC/ESMO Antiemetik Kılavuzları: Aprepitant/netupitant, ondansetron ve deksametazon üçlüsü sisplatin kaynaklı emezisi %80\'in üzerinde önler.'
  },
  {
    id: 171,
    specialty: 'Hematoloji',
    question: 'Diffüz büyük B hücreli lenfomada CHOP kemoterapisine rituksimab eklenmesi (R-CHOP) tam remisyon ve genel sağkalımı artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Coiffier B ve ark., GELA LNH-98.5 (NEJM): CD20 hedefli rituksimab eklenmesi agresif lenfomada uzun dönem sağkalımı %15 oranında yükseltmiştir.'
  },
  {
    id: 172,
    specialty: 'Hematoloji',
    question: 'Ağır edinsel aplastik anemide standart immünsüpresif tedaviye eltrombopag eklenmesi hematolojik yanıt oranını artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Townsley DM ve ark. (NEJM): ATG + siklosporin tedavisine eltrombopag eklenmesi tam yanıt oranını belirgin şekilde artırır.'
  },

  // =========================================================================
  // 10. PEDIATRI & NEONATOLOJI (173 - 190)
  // =========================================================================
  {
    id: 173,
    specialty: 'Pediatri',
    question: 'Kızamık, kabakulak, kızamıkçık (MMR) aşısı çocuklarda otizm gelişme riskini artırır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'Hviid A (Annals Int Med 2019, 657k çocuk) ve Madsen KM (NEJM 2002, 537k çocuk): Aşı ile otizm arasında hiçbir nedensel veya zamansal ilişki yoktur.'
  },
  {
    id: 174,
    specialty: 'Pediatri',
    question: 'Viral enfeksiyon geçiren ateşli çocuklarda aspirin kullanımı Reye sendromuna yol açar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Hurwitz ES ve ark. (CDC/NEJM): İnfluenza veya suçiçeği geçiren çocuklarda aspirin kullanımı fatal hepatik ve serebral disfonksiyon (Reye sendromu) yapar.'
  },
  {
    id: 175,
    specialty: 'Pediatri',
    question: 'Çok düşük doğum ağırlıklı prematüre bebeklerde anne sütüyle beslenme nekrotizan enterokolit (NEK) insidansını azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Schanler RJ ve Sullivan S çalışmaları: Anne sütü veya donör anne sütü formül mamaya kıyasla NEK riskini en az %50 azaltır.'
  },
  {
    id: 176,
    specialty: 'Pediatri',
    question: 'Yenidoğan hiperbilirubinemisinde fototerapi kan değişimi ihtiyacını ve kernikterus riskini güvenle engeller mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'AAP Neonatal Sarılık Kılavuzu: 460-490 nm dalga boyundaki yoğun fototerapi indirekt bilirubini fotoizomerlere dönüştürerek nörotoksisiteyi önler.'
  },
  {
    id: 177,
    specialty: 'Pediatri',
    question: 'Prematüre respiratuar distres sendromunda (RDS) trakeal yoldan eksojen sürfaktan verilmesi mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Soll RF, Cochrane derlemesi: Erken eksojen sürfaktan alveolar kollapsı engeller, pnömotoraks ve yenidoğan mortalitesini belirgin düşürür.'
  },
  {
    id: 178,
    specialty: 'Pediatri',
    question: 'Çocuklarda basit febril nöbette gelecekteki epilepsi riskini önlemek için rutin uzun süreli antiepileptik profilaksisi önerilir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'AAP Kılavuzu: Basit febril nöbet benigndir; sürekli fenobarbital veya valproat zeka gelişimini olumsuz etkiler ve epilepsi gelişimini engellemez.'
  },
  {
    id: 179,
    specialty: 'Pediatri',
    question: 'Akut krup sendromlu (laringotrakeobronşit) çocuklarda tek doz oral deksametazon acil servis başvurusunu ve entübasyonu azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Russell KF ve ark., Cochrane derlemesi: 0.15-0.6 mg/kg tek doz deksametazon subglottik ödemi hızla gerileterek hastaneye yatışları azaltır.'
  },
  {
    id: 180,
    specialty: 'Pediatri',
    question: 'Çocukluk çağı astımında düşük doz inhale kortikosteroidler nihai erişkin boyunu kalıcı ve belirgin şekilde kısaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'CAMP çalışması (NEJM): Düşük-orta doz İKS ilk yıl büyüme hızında ~1 cm geçici yavaşlama yapsa da erişkin nihai boyu üzerinde kalıcı kayıp oluşturmaz.'
  },
  {
    id: 181,
    specialty: 'Pediatri',
    question: 'Bebeklerde ani bebek ölümü sendromunu (SIDS) önlemek için sırtüstü uyku pozisyonu en kritik koruyucu önlem midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'AAP Güvenli Uyku Kılavuzu: "Back to Sleep" kampanyası ile bebeklerin sırtüstü yatırılması SIDS insidansını dünya genelinde %50\'den fazla düşürmüştür.'
  },
  {
    id: 182,
    specialty: 'Pediatri',
    question: 'Akut gastroenteritli çocuklarda oral rehidratasyon tuzları (ORS) hafif ve orta dehidratasyonu intravenöz sıvı kadar etkili düzeltir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'DSÖ/UNICEF ve ESPGHAN Kılavuzları: Düşük ozmolariteli ORS dehidratasyonu hızla düzeltir ve intravenöz sıvıya bağlı komplikasyonları azaltır.'
  },
  {
    id: 183,
    specialty: 'Pediatri',
    question: 'Çocuklarda A grubu streptokokal farenjitte oral penisilin tedavisi akut romatizmal ateşi (ARA) önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Catanzaro FJ ve AHA Kılavuzu: Semptomların ilk 9 günü içinde tamamlanan 10 günlük penisilin tedavisi ARA ve romatizmal kalp hastalığını tam önler.'
  },
  {
    id: 184,
    specialty: 'Pediatri',
    question: 'İnfantil kolikte ditsiklomin gibi antikolinerjik ilaçların kullanımı bebeklerde güvenli kabul edilir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'FDA ve AAP Uyarıları: Ditsiklomin infantil kolikte apne, nöbet ve koma gibi ölümcül yan etkilere yol açabilir; bebeklerde kesinlikle kontrendikedir.'
  },
  {
    id: 185,
    specialty: 'Pediatri',
    question: 'Kawasaki hastalığında ilk 10 gün içinde intravenöz immünoglobulin (IVIG) + aspirin verilmesi koroner anevrizmayı önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Newburger JW ve ark. (NEJM): Yüksek doz IVIG koroner arter anevrizması riskini %25\'ten %3-5 seviyesine indirir.'
  },
  {
    id: 186,
    specialty: 'Pediatri',
    question: 'Tüm yenidoğanlara doğumda profilaktik intramusküler K vitamini yapılması erken ve geç hemorajik hastalığı (VKDB) önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'AAP ve DSÖ Kılavuzları: Doğumda tek doz 1 mg IM K vitamini ölümcül intrakraniyal kanamalarla seyreden geç K vitamini eksikliği kanamasını tam önler.'
  },
  {
    id: 187,
    specialty: 'Pediatri',
    question: 'Ağır akut malnütrisyonlu çocuklarda kullanıma hazır terapötik gıdalar (RUTF) ayaktan tedavide mortaliteyi düşürür mü?',
    expectedStance: 'affirmative',
    keyLiterature: 'DSÖ Kılavuzları: RUTF formülasyonu ağır malnütrisyonlu çocukların komplikasyonsuz olgularında hastaneye yatırmadan %90\'ın üzerinde iyileşme sağlar.'
  },
  {
    id: 188,
    specialty: 'Pediatri',
    question: 'Çocuklarda ilk afebril idrar yolu enfeksiyonu sonrasında tüm çocuklara rutin profilaktik günlük antibiyotik verilmeli midir?',
    expectedStance: 'refuted',
    keyLiterature: 'AAP İYE Kılavuzu ve RIVUR çalışması: Rutin antibiyotik profilaksisi böbrek skarını engellemez, yalnızca dirençli bakteriyel floraya yol açar.'
  },
  {
    id: 189,
    specialty: 'Pediatri',
    question: 'Konjenital hipotiroidi taramasında yakalanan bebeklerde ilk 2 haftada başlanan levotiroksin nörokognitif geriliği tam önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Yenidoğan Tarama Programları ve ESPE: Erken replasman kretinizmi tamamen engeller ve çocukların normal IQ seviyesine ulaşmasını sağlar.'
  },
  {
    id: 190,
    specialty: 'Pediatri',
    question: 'Yenidoğanda gonokokal oftalmiya neonatorum profilaksisinde topikal eritromisin veya povidon iyot etkili midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'CDC ve AAP Kılavuzları: Doğumdan hemen sonra göze uygulanan %0.5 eritromisin veya %2.5 povidon iyot körlük yapabilen gonokokal konjonktiviti önler.'
  },

  // =========================================================================
  // 11. KADIN HASTALIKLARI VE DOGUM / JINEKOLOJI (191 - 205)
  // =========================================================================
  {
    id: 191,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Spontan vajinal doğumda rutin epizyotomi uygulanması perineal yırtıkları ve pelvik taban hasarını önler mi?',
    expectedStance: 'refuted',
    keyLiterature: 'Cochrane Kılavuzu ve ACOG: Rutin epizyotomi 3. ve 4. derece perine yırtıklarını azaltmaz; aksine şiddetli yırtık, ağrı ve kanama riskini artırır.'
  },
  {
    id: 192,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Preeklampsi riski yüksek gebelerde 12-16. haftalarda başlanan düşük doz aspirin preeklampsi insidansını azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ASPRE çalışması (NEJM 2017): Yüksek riskli gebelerde geceleri alınan 150 mg aspirin preterm preeklampsi sıklığını %62 oranında azaltır.'
  },
  {
    id: 193,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Ağır preeklampsi ve eklampside nöbetlerin önlenmesi ve tedavisinde magnezyum sülfat ilk seçenek midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'Magpie çalışması (Lancet): Magnezyum sülfat eklamptik konvülsiyonları önlemede diazepam ve fenitoine kıyasla %50 daha üstündür.'
  },
  {
    id: 194,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Postmenopozal kadınlarda kombine hormon replasman tedavisi (östrojen + progestin) primer kardiyovasküler koruma için önerilir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'WHI çalışması (JAMA): Rutin hormon replasmanı inme, invaziv meme kanseri ve venöz tromboembolizm riskini artırmış; primer kardiyak koruma sağlamamıştır.'
  },
  {
    id: 195,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Servikal kanser taramasında yüksek riskli HPV DNA testi tek başına Pap smear sitolojisine göre prekanseröz lezyonları saptamada daha duyarlı mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'Ronco G ve ark. (Lancet) ve USPSTF Kılavuzları: Primer HPV DNA taraması CIN 3+ lezyonlarını saptamada sitolojiye göre %30-40 daha duyarlıdır.'
  },
  {
    id: 196,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Gebelikte sigara içilmesi intrauterin gelişme geriliği (IUGR) ve düşük doğum ağırlığı riskini artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ACOG ve CDC Raporları: Karbonmonoksit ve nikotin plasental vazokonstrüksiyon yaparak fetal oksijenizasyonu bozar ve doğum ağırlığını ortalama 200 g düşürür.'
  },
  {
    id: 197,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: '34 haftanın altındaki erken preterm doğum tehdidinde antenatal kortikosteroid (betametazon) neonatal RDS ve ölümü azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Liggins ve Howie, Cochrane meta-analizi: Antenatal kortikosteroid sürfaktan üretimini hızlandırarak RDS, intraventriküler kanama ve neonatal ölümü %30 azaltır.'
  },
  {
    id: 198,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Polikistik over sendromuna (PKOS) bağlı anovulatuar infertilitede letrozol klomifen sitrata göre daha yüksek canlı doğum oranı sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Legro RS ve ark., PPCOS II (NEJM): Aromataz inhibitörü letrozol klomifene göre daha yüksek kümülatif ovülasyon ve canlı doğum oranı (%27.5 vs %19.1) sağlamıştır.'
  },
  {
    id: 199,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'İlk trimesterde düşük tehdidi (vajinal kanama) yaşayan tüm gebelere mutlak yatak istirahati spontan düşüğü engeller mi?',
    expectedStance: 'refuted',
    keyLiterature: 'Cochrane sistematik derlemesi ve ACOG: Yatak istirahatinin düşüğü engellediğine dair kanıt yoktur; aksine derin ven trombozu ve anksiyete riskini artırır.'
  },
  {
    id: 200,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Doğumun üçüncü evresinde rutin profilaktik intramusküler veya intravenöz oksitosin uygulanması postpartum kanamayı azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'DSÖ Postpartum Kanama Kılavuzu: Bebeğin doğumunu takiben 10 IU oksitosin yapılması uterus atonisi kaynaklı majör kanamayı %50 oranında azaltır.'
  },
  {
    id: 201,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Gebelikte saptanan asemptomatik bakteriyüri akut piyelonefrit ve erken doğum riskini önlemek için tedavi edilmeli midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'USPSTF ve IDSA Kılavuzları: Gebe kadınlarda asemptomatik bakteriyüri tedavi edilmediğinde %30 piyelonefrite ilerler; antibiyotik tedavisi şarttır.'
  },
  {
    id: 202,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Endometriozise bağlı kronik pelvik ağrıda kombine oral kontraseptifler veya progestinler ağrıyı belirgin azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ESHRE Endometriozis Kılavuzu: Hormonal tedavi ektopik endometriyal dokuyu atrofize ederek dismenore ve pelvik ağrıyı baskılamada birinci basamak çözümdür.'
  },
  {
    id: 203,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Gebelikte kızamık, kızamıkçık veya suçiçeği gibi canlı atenüe aşıların yapılması güvenli kabul edilir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'CDC ve ACOG Aşı Kılavuzları: Canlı atenüe aşılar teorik konjenital enfeksiyon ve teratojenite riski nedeniyle gebelikte kesinlikle kontrendikedir.'
  },
  {
    id: 204,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Kronik ve gestasyonel hipertansiyonda labetalol ve metildopa güvenli birinci basamak antihipertansifler midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'CHIPS çalışması (NEJM) ve ACOG: Labetalol ve nifedipin/metildopa fetal teratojenite oluşturmadan kan basıncını güvenle kontrol eder.'
  },
  {
    id: 205,
    specialty: 'Kadın Hastalıkları ve Doğum',
    question: 'Adölesan dönemde yapılan 9 valanlı HPV aşısı servikal prekanseröz lezyonları ve invaziv kanseri %90\'a varan oranda önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Lei J ve ark. (NEJM 2020) ve DSÖ: Cinsel aktiflik öncesi aşılanan genç kızlarda invaziv serviks kanseri insidansı %88 oranında azalmıştır.'
  },

  // =========================================================================
  // 12. PSIKIYATRI & RUH SAGLIGI (206 - 220)
  // =========================================================================
  {
    id: 206,
    specialty: 'Psikiyatri',
    question: 'Majör depresif bozuklukta SSRI grubu antidepresanlar plaseboya kıyasla yanıt oranını anlamlı derecede artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Cipriani A ve ark., Lancet Meta-Analizi: 522 çalışmayı kapsayan dev ağ meta-analizinde tüm antidepresanlar plaseboya üstün yanıt sergilemiştir.'
  },
  {
    id: 207,
    specialty: 'Psikiyatri',
    question: 'Şizofrenide antipsikotik idame tedavisi relaps ve nüks riskini plaseboya göre belirgin şekilde azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Leucht S ve ark., Lancet Meta-Analizi: İdame antipsikotik tedavisi 1 yıllık relaps oranını %64\'ten %27\'ye düşürmüştür.'
  },
  {
    id: 208,
    specialty: 'Psikiyatri',
    question: 'Bipolar bozuklukta lityum idame tedavisi intihar riskini ve duygudurum ataklarını belirgin şekilde önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'BALANCE çalışması (Lancet) ve Cipriani BMJ: Lityum bipolar bozuklukta intiharı doğrudan azaltan kanıtlanmış tek duygudurum dengeleyicidir.'
  },
  {
    id: 209,
    specialty: 'Psikiyatri',
    question: 'Obsesif kompulsif bozuklukta Maruz Bırakma ve Tepki Önleme (ERP) içeren BDT farmakoterapiye benzer ve kalıcı yanıt sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'NICE ve APA OKB Kılavuzları: ERP protokolü obsesyon ve kompulsiyonları azaltmada birinci basamak altın standart psikoterapidir.'
  },
  {
    id: 210,
    specialty: 'Psikiyatri',
    question: 'Erişkin DEHB tedavisinde metilfenidat dikkat süresini ve yürütücü işlevleri düzeltir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Cortese S ve ark. (Lancet Psychiatry Meta-analizi): Psikostimülanlar DEHB semptomlarını kontrol etmede en yüksek etki boyutuna sahiptir.'
  },
  {
    id: 211,
    specialty: 'Psikiyatri',
    question: 'Tedaviye dirençli ve intihar riski yüksek majör depresyonda elektrokonvülsif terapi (EKT) hızlı ve güçlü yanıt sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'UK ECT Review Group (Lancet): EKT şiddetli ve psikotik özellikli depresyonda %80\'e varan hızlı remisyon sağlar.'
  },
  {
    id: 212,
    specialty: 'Psikiyatri',
    question: 'Kronik insomnia tedavisinde Bilişsel Davranışçı Terapi (BDT-I) uzun dönemde hipnotik ilaçlardan daha kalıcı uyku düzelmesi sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Qaseem A ve ark., ACP Kılavuzu: BDT-I yan etki ve bağımlılık riski olmadan uyku kalitesini uzun vadede koruyan ilk tercihtir.'
  },
  {
    id: 213,
    specialty: 'Psikiyatri',
    question: 'Anoreksiya nervoza tedavisinde tek başına trisiklik antidepresan ilaç kullanımı kilo alımını ve temel patolojiyi düzeltir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'APA ve NICE Yeme Bozuklukları Kılavuzları: Anoreksiyada tek başına antidepresanlar kilo alımı sağlamaz; kardiyotoksisite riski nedeniyle trisiklikler önerilmez.'
  },
  {
    id: 214,
    specialty: 'Psikiyatri',
    question: 'Tedaviye dirençli şizofrenide klozapin intihar davranışını ve psikotik semptomları diğer antipsikotiklerden daha fazla azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'CATIE ve InterSePT (Lancet): Klozapin en az 2 antipsikotiğe yanıtsız dirençli şizofrenide üstün etkinlik gösteren ve intiharı azaltan tek ajandır.'
  },
  {
    id: 215,
    specialty: 'Psikiyatri',
    question: 'Panik bozukluk tedavisinde uzun süreli tek başına benzodiazepin kullanımı tolerans ve bağımlılık riski nedeniyle birinci basamak mıdır?',
    expectedStance: 'refuted',
    keyLiterature: 'APA Panik Bozukluk Kılavuzu: Benzodiazepinler bağımlılık ve rebound anksiyete riski taşır; birinci basamak tercih SSRI/SNRI ve BDT\'dir.'
  },
  {
    id: 216,
    specialty: 'Psikiyatri',
    question: 'Travma sonrası stres bozukluğunda (TSSB) travma odaklı BDT ve EMDR travmatik anıların yarattığı sıkıntıyı belirgin azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Bisson JI ve ark., Cochrane derlemesi: Travma odaklı psikoterapiler TSSB semptom skorlarında ilaç tedavisine kıyasla daha kalıcı rahatlama sağlar.'
  },
  {
    id: 217,
    specialty: 'Psikiyatri',
    question: 'Borderline kişilik bozukluğunda Diyalektik Davranış Terapisi (DDT) kendine zarar verme ve intihar girişimlerini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Linehan MM ve ark. (JAMA Psychiatry): DDT duygu regülasyonu becerilerini geliştirerek kendine zarar verme sıklığını ve acil başvurularını yarı yarıya düşürür.'
  },
  {
    id: 218,
    specialty: 'Psikiyatri',
    question: 'Alkol kullanım bozukluğunda naltrekson ve akamprosat nüksü ve aşırı içme günlerini azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'COMBINE çalışması (JAMA): Naltrekson ödül mekanizmasını baskılayarak alkol aşerme sıklığını ve relaps riskini belirgin düşürür.'
  },
  {
    id: 219,
    specialty: 'Psikiyatri',
    question: 'Tedaviye dirençli unipolar depresyonda intravenöz ketamin veya intranazal esketamin saatler içinde hızlı antidepresan etki sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Zarate CA ve Popova V (JAMA Psychiatry): NMDA reseptör antagonisti ketamin/esketamin 2-4 saat içinde intihar düşüncesini ve depresyon skorunu hızla düşürür.'
  },
  {
    id: 220,
    specialty: 'Psikiyatri',
    question: 'Şizofrenide uzun etkili enjektabl (depo) antipsikotikler tedavi uyumsuzluğu olan hastalarda relapsı oral formlara göre azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Kishimoto T ve ark., Lancet Psychiatry Meta-Analizi: Depo antipsikotikler tedavi sürekliliğini güvenceye alarak hastaneye yeniden yatışları belirgin azaltır.'
  },

  // =========================================================================
  // 13. ACIL TIP, YOGUN BAKIM & TOKSIKOLOJI (221 - 235)
  // =========================================================================
  {
    id: 221,
    specialty: 'Acil Tıp',
    question: 'Şiddetli travmatik kanaması olan hastalarda ilk 3 saatte traneksamik asit (TXA) verilmesi mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'CRASH-2 çalışması (Lancet): Olaydan sonraki ilk 3 saat içinde uygulanan TXA kanamaya bağlı ölüm riskini %15 oranında belirgin azaltır.'
  },
  {
    id: 222,
    specialty: 'Toksikoloji',
    question: 'Akut parasetamol zehirlenmesinde ilk 8 saat içinde başlanan N-asetilsistein (NAC) ölümcül hepatotoksisiteyi önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'Prescott LF ve Rumack BH çalışmaları: İlk 8 saatte başlanan NAC glutatyon depolarını yenileyerek hepatik nekrozu %100\'e yakın oranda önler.'
  },
  {
    id: 223,
    specialty: 'Acil Tıp',
    question: 'Akut karbonmonoksit zehirlenmesinde bilinç kaybı olan hastalarda hiperbarik oksijen tedavisi bilişsel sekelleri azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Weaver LK ve ark. (NEJM): Hiperbarik oksijen tedavisi karboksihemoglobini hızla temizler ve 6 haftalık gecikmiş nöropsikiyatrik sekelleri azaltır.'
  },
  {
    id: 224,
    specialty: 'Acil Tıp',
    question: 'Standart tedaviye dirençli ağır akut astım atağında intravenöz magnezyum sülfat bronkodilasyon sağlayıp yatışları azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Goodacre S ve ark., 3Mg çalışması (Lancet Resp Med): 2 gram IV magnezyum sülfat düz kas relaksasyonu sağlayarak solunum yetmezliğini hafifletir.'
  },
  {
    id: 225,
    specialty: 'Yoğun Bakım',
    question: 'Septik şokta sıvı resüsitasyonuna dirençli hipotansiyonda norepinefrin ilk seçenek vazopressör müdür?',
    expectedStance: 'affirmative',
    keyLiterature: 'SOAP II çalışması (NEJM) ve SSC Kılavuzu: Norepinefrin dopamine kıyasla daha az disritmiye yol açar ve septik şokta ilk basamak vazopressördür.'
  },
  {
    id: 226,
    specialty: 'Yoğun Bakım',
    question: 'Akut travmatik beyin hasarında erken dönemde yüksek doz intravenöz metilprednizolon mortaliteyi azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'CRASH-1 çalışması (Lancet): 10.000 hastayı içeren dev çalışmada steroid kolunda mortalite anlamlı olarak daha yüksek bulunmuş; steroidler kontrendike kılınmıştır.'
  },
  {
    id: 227,
    specialty: 'Acil Tıp',
    question: 'Anafilaksi tedavisinde intramusküler epinefrin (adrenalin) uyluk anterolateraline derhal uygulanması gereken ilk basamak ilaç mıdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'EAACI ve WAO Kılavuzları: Epinefrin mast hücre degranülasyonunu ve laringeal ödemi durduran tek hayat kurtarıcı ilk basamak ajandır.'
  },
  {
    id: 228,
    specialty: 'Acil Tıp',
    question: 'Aksidental derin hipotermik kardiyak arrestte ekstrakorporeal yaşam desteği (ECLS / ECMO) sağkalımı artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'ERC Kılavuzları: Vücut sıcaklığı <30°C olan hipotermik kardiyak arrestlerde ECMO ile aktif internal ısıtma %50\'ye varan nörolojik sekelsiz sağkalım sağlar.'
  },
  {
    id: 229,
    specialty: 'Toksikoloji',
    question: 'Akut zehirlenmelerde rutin gastrik lavaj (mide yıkanması) ve ipecac şurubu ile kusturma klinik sonuçları iyileştirir mi?',
    expectedStance: 'refuted',
    keyLiterature: 'AACT ve EAPCCT Ortak Bildirisi: Rutin mide lavajı toksin emilimini azaltmadığı gibi aspirasyon pnömonisi ve özofagus rüptürü riskini artırır; terk edilmiştir.'
  },
  {
    id: 230,
    specialty: 'Acil Tıp',
    question: 'Hemodinamik stabil supraventriküler taşikardide (SVT) modifiye Valsalva manevrası sinüs ritmine dönüş oranını artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'REVERT çalışması (Lancet): Bacak kaldırma bileşeni eklenen modifiye Valsalva manevrası sinüs ritmine dönme başarısını %17\'den %43\'e çıkarmıştır.'
  },
  {
    id: 231,
    specialty: 'Acil Tıp',
    question: 'EKG değişiklikleri olan şiddetli hiperkalemide intravenöz kalsiyum glukonat veya kalsiyum klorür kardiyak membranı hızla stabilize eder mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'AHA ve ERC Kılavuzları: İntravenöz kalsiyum miyokard membran potansiyelini 1-3 dakika içinde normalize ederek ölümcül ventriküler aritmileri önler.'
  },
  {
    id: 232,
    specialty: 'Acil Tıp',
    question: 'Akut opioid aşırı dozuna bağlı solunum depresyonunda intravenöz veya intranazal nalokson solunumu hızla geri çevirir mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'DSÖ Opioid Aşırı Doz Kılavuzu: Saf mi-reseptör antagonisti nalokson solunumsal arresti 2-3 dakika içinde güvenle tersine çevirir.'
  },
  {
    id: 233,
    specialty: 'Yoğun Bakım',
    question: 'Kritik yoğun bakım hastalarında kan glukoz düzeyini aşırı katı (80-110 mg/dL) aralığında tutmak mortaliteyi düşürür mü?',
    expectedStance: 'refuted',
    keyLiterature: 'NICE-SUGAR çalışması (NEJM): 6.000\'den fazla yoğun bakım hastasında çok sıkı glukoz kontrolü şiddetli hipoglisemiyi ve genel mortaliteyi artırmıştır.'
  },
  {
    id: 234,
    specialty: 'Acil Tıp',
    question: 'Sirotik akut özofagus varis kanamasında erken dönemde profilaktik antibiyotik başlanması bakteriyel enfeksiyon ve erken mortaliteyi azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Chavez-Tapia NC ve ark. Cochrane derlemesi ve Baveno VII: Kısa süreli seftriakson profilaksisi SBP\'yi ve kanamaya bağlı mortaliteyi belirgin düşürür.'
  },
  {
    id: 235,
    specialty: 'Yoğun Bakım',
    question: 'Kardiyak arrest sonrası resüsite edilen komadaki hastalarda aktif ateş kontrolü ve normotermi hedeflenmesi sağkalımı korur mu?',
    expectedStance: 'affirmative',
    keyLiterature: 'TTM-2 çalışması (NEJM 2021): Ateşin (>37.8°C) aktif cihazlarla engellenmesi 33°C hipotermi kadar nörolojik sağkalımı korur ve daha az aritmi yapar.'
  },

  // =========================================================================
  // 14. DERMATOLOJI (236 - 243)
  // =========================================================================
  {
    id: 236,
    specialty: 'Dermatoloji',
    question: 'Orta ve şiddetli plak psöriyaziste IL-23 ve IL-17 inhibitörleri PASI 90/100 tam cilt temizliği oranlarını %70\'in üzerine çıkarır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'VOYAGE, CLEAR, UNCOVER çalışmaları: Guselkumab ve sekukinumab gibi monoklonal antikorlar psöriyaziste tam veya tama yakın cilt temizliği sağlar.'
  },
  {
    id: 237,
    specialty: 'Dermatoloji',
    question: 'Şiddetli nodülokistik ve skarla iyileşen aknede oral izotretinoin kalıcı remisyon sağlayan en etkili tedavidir?',
    expectedStance: 'affirmative',
    keyLiterature: 'AAD ve EADV Akne Kılavuzları: Sebasöz bez boyutunu ve sebum üretimini %90 azaltarak kalıcı kür sağlayan altın standart sistemik ajandır.'
  },
  {
    id: 238,
    specialty: 'Dermatoloji',
    question: 'Orta-şiddetli atopik dermatitte dupilumab (anti-IL-4/IL-13) kaşıntı skorunu ve lezyon alanını belirgin azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'SOLO 1-2 ve CHRONOS çalışmaları (NEJM): Dupilumab Th2 aracılı inflamasyonu baskılayarak atopik dermatitte belirgin klinik rahatlama sağlar.'
  },
  {
    id: 239,
    specialty: 'Dermatoloji',
    question: 'Kutanöz malign melanom cerrahi eksizyonunda Breslow kalınlığına göre güvenlik marjı bırakılması lokal nüksü önler mi?',
    expectedStance: 'affirmative',
    keyLiterature: 'NCCN ve EADO Melanom Kılavuzları: Tümör kalınlığına göre 1-2 cm cerrahi sınır bırakılması lokal nüksü en aza indirir.'
  },
  {
    id: 240,
    specialty: 'Dermatoloji',
    question: 'Hidradenitis suppurativada adalimumab inflamatuar nodül ve apse sayısını belirgin azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'PIONEER I ve II çalışmaları (NEJM): Anti-TNF adalimumab orta-ağır hidradenitis suppurativada HiSCR yanıtını anlamlı ölçüde yükseltmiştir.'
  },
  {
    id: 241,
    specialty: 'Dermatoloji',
    question: 'Erkek tipi androjenik alopeside oral finasterid ve topikal minoksidil saç dökülmesini yavaşlatıp saç yoğunluğunu artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Kaufman KD ve ark. (JAAD): Finasterid DHT üretimini baskılayarak 5 yıllık izlemde erkeklerin %90\'ında dökülmeyi durdurur ve yeni saç çıkışı sağlar.'
  },
  {
    id: 242,
    specialty: 'Dermatoloji',
    question: 'Stevens-Johnson sendromu ve Toksik Epidermal Nekrolizde (SJS/TEN) şüpheli suçlu ilacın derhal kesilmesi mortaliteyi azaltan en kritik adımdır?',
    expectedStance: 'affirmative',
    keyLiterature: 'SCORTEN ve Garcia-Doval I ve ark.: Yarı ömrü kısa olan şüpheli ilacın derhal kesilmesi mortalite riskini belirgin şekilde düşürür.'
  },
  {
    id: 243,
    specialty: 'Dermatoloji',
    question: 'Limon suyu ve alkali karbonat karışımlarının melanositik nevüsleri ve melanomu yok ettiği kanıtlanmış mıdır?',
    expectedStance: 'refuted',
    keyLiterature: 'Dermatoloji dernekleri konsensüsü: Kostik asit/alkali uygulamalar melanomu tedavi etmez; aksine derin doku nekrozu, enfeksiyon ve tanı gecikmesine yol açar.'
  },

  // =========================================================================
  // 15. ORTOPEDI, SPOR HEKIMLIGI & FTR (244 - 250)
  // =========================================================================
  {
    id: 244,
    specialty: 'Ortopedi & Spor Hekimliği',
    question: 'Aşil tendinopatisinde eksantrik yüklenme egzersizleri ağrıyı azaltmada ve tendon fonksiyonunu geri kazanmada etkili midir?',
    expectedStance: 'affirmative',
    keyLiterature: 'Alfredson H ve ark., Cochrane derlemesi: 12 haftalık eksantrik baldır egzersizleri aşil tendinopatisinde cerrahi ihtiyacını azaltan altın standarttır.'
  },
  {
    id: 245,
    specialty: 'Ortopedi & Spor Hekimliği',
    question: 'İleri evre diz osteoartritinde intraartiküler hyalüronik asit enjeksiyonu total diz protezi cerrahisi ihtiyacını kalıcı olarak ortadan kaldırır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'AAOS ve OARSI Kılavuzları: Hyalüronik asit enjeksiyonları geçici viskosuplementasyon sağlasa da eklem protezi ihtiyacını ortadan kaldırmaz; güçlü önerilmez.'
  },
  {
    id: 246,
    specialty: 'FTR',
    question: 'Kronik mekanik bel ağrısında yapılandırılmış aktif egzersiz terapisi yatak istirahatine kıyasla fonksiyonel iyileşme sağlar mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Chou R ve ark., ACP Bel Ağrısı Kılavuzu: Uzun süreli yatak istirahatinden kaçınılmalı; aktif güçlendirme ve aerobik egzersiz sakatlığı azaltır.'
  },
  {
    id: 247,
    specialty: 'Ortopedi & Spor Hekimliği',
    question: 'Ön çapraz bağ cerrahisi sonrası yapılandırılmış nöromusküler rehabilitasyon spora dönüş oranlarını ve diz stabilitesini artırır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Grindem H ve ark. (BJSM): Kriter bazlı nöromusküler rehabilitasyon re-rüptür riskini %80 azaltır ve güvenli spora dönüşü sağlar.'
  },
  {
    id: 248,
    specialty: 'Ortopedi & FTR',
    question: 'Osteoporotik vertebra kompresyon kırıklarında rutin perkütan vertebroplasti sham (plasebo) işleme göre ağrıda belirgin üstünlük sağlar mı?',
    expectedStance: 'refuted',
    keyLiterature: 'Buchbinder R ve Kallmes DF çalışmaları (NEJM): Çift-kör plasebo kontrollü çalışmalarda vertebroplasti ile sham işlem arasında ağrı açısından anlamlı fark saptanamamıştır.'
  },
  {
    id: 249,
    specialty: 'Ortopedi & Spor Hekimliği',
    question: 'Subakromiyal sıkışma sendromunda subakromiyal dekompresyon cerrahisi plasebo artroskopiye göre ağrıyı belirgin azaltır mı?',
    expectedStance: 'refuted',
    keyLiterature: 'CSAW çalışması (Lancet 2018): Subakromiyal dekompresyon cerrahisi ile tanısal artroskopi (plasebo cerrahi) arasında omuz ağrısı açısından fark yoktur.'
  },
  {
    id: 250,
    specialty: 'Ortopedi & FTR',
    question: 'Plantar fasiit tedavisinde baldır ve plantar fasya germe egzersizleri sabah ilk adım ağrısını belirgin azaltır mı?',
    expectedStance: 'affirmative',
    keyLiterature: 'Digiovanni BF ve ark. (JBJS): Plantar fasyaya spesifik germe egzersizleri 8 haftalık sürede hastaların %70\'inden fazlasında belirgin ağrı azalması sağlar.'
  }
];
