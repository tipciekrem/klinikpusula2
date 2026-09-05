/**
 * Clinical Sample Size & Statistical Power Engine (G*Power standard mathematical model)
 * Supports 5 major clinical designs:
 * 1. Two-sample independent t-test (Cohen's d)
 * 2. Paired samples t-test (Cohen's dz)
 * 3. Chi-square test for two proportions (Cohen's h)
 * 4. One-way ANOVA for multi-arm trials (Cohen's f)
 * 5. Pearson / Spearman correlation (r)
 */

// Approximate standard normal quantiles (Z-scores)
export function getStandardNormalZ(p) {
  const safeP = Math.max(0.0001, Math.min(0.9999, Number(p) || 0.05));
  
  if (safeP <= 0.0005) return 3.291;
  if (safeP <= 0.001) return 3.090;
  if (safeP <= 0.005) return 2.576;
  if (safeP <= 0.01) return 2.326;
  if (safeP <= 0.025) return 1.960;
  if (safeP <= 0.05) return 1.645;
  if (safeP <= 0.10) return 1.282;
  if (safeP >= 0.999) return 3.090;
  if (safeP >= 0.99) return 2.326;
  if (safeP >= 0.975) return 1.960;
  if (safeP >= 0.95) return 1.645;
  if (safeP >= 0.90) return 1.282;
  if (safeP >= 0.85) return 1.036;
  if (safeP >= 0.80) return 0.842;
  return 1.960;
}

export function calculateSampleSize({
  testType = 'two_sample_t',
  alpha = 0.05,
  power = 0.80,
  effectPreset = 'medium',
  customEffect = 0.50,
  allocationRatio = 1.0,
  dropoutRate = 0.10,
  numGroups = 3,
  prop1 = 0.40,
  prop2 = 0.20
} = {}) {
  // 1. Sanitize & clamp input parameters
  const safeAlpha = Math.max(0.001, Math.min(0.20, Number(alpha) || 0.05));
  const safePower = Math.max(0.50, Math.min(0.99, Number(power) || 0.80));
  const safeAllocation = Math.max(0.2, Math.min(5.0, Number(allocationRatio) || 1.0));
  const safeDropout = Math.max(0, Math.min(0.50, Number(dropoutRate) || 0.10));
  const safeGroups = Math.max(2, Math.min(10, Math.round(Number(numGroups) || 3)));
  const safeP1 = Math.max(0.01, Math.min(0.99, Number(prop1) || 0.40));
  const safeP2 = Math.max(0.01, Math.min(0.99, Number(prop2) || 0.20));

  // 2. Resolve effect size with boundary safeguards
  let effectiveEffect = 0.50;
  const validTestType = ['two_sample_t', 'paired_t', 'chi_square', 'anova', 'correlation'].includes(testType)
    ? testType
    : 'two_sample_t';

  if (effectPreset === 'custom') {
    effectiveEffect = Math.max(0.05, Math.min(5.0, Number(customEffect) || 0.50));
  } else if (validTestType === 'two_sample_t' || validTestType === 'paired_t') {
    if (effectPreset === 'small') effectiveEffect = 0.20;
    else if (effectPreset === 'large') effectiveEffect = 0.80;
    else effectiveEffect = 0.50;
  } else if (validTestType === 'chi_square') {
    // Cohen's h = 2*asin(sqrt(p1)) - 2*asin(sqrt(p2))
    const h = Math.abs(2 * Math.asin(Math.sqrt(safeP1)) - 2 * Math.asin(Math.sqrt(safeP2)));
    // Avoid division by zero if p1 == p2
    effectiveEffect = Math.max(0.08, Number(h.toFixed(3)));
  } else if (validTestType === 'anova') {
    if (effectPreset === 'small') effectiveEffect = 0.10;
    else if (effectPreset === 'large') effectiveEffect = 0.40;
    else effectiveEffect = 0.25;
  } else if (validTestType === 'correlation') {
    if (effectPreset === 'small') effectiveEffect = 0.10;
    else if (effectPreset === 'large') effectiveEffect = 0.50;
    else effectiveEffect = 0.30;
  }

  // 3. Compute Z statistics
  const zAlpha = getStandardNormalZ(safeAlpha / 2);
  const zBeta = getStandardNormalZ(safePower);
  const zSum = zAlpha + zBeta;

  let n1 = 0;
  let n2 = 0;
  let totalN = 0;
  let details = '';
  let effectLabel = '';

  if (validTestType === 'two_sample_t') {
    const d = effectiveEffect;
    const k = safeAllocation;
    n1 = Math.ceil(((1 + 1 / k) * Math.pow(zSum, 2)) / Math.pow(d, 2));
    n1 = Math.max(4, n1);
    n2 = Math.ceil(n1 * k);
    totalN = n1 + n2;
    effectLabel = `Cohen's d = ${d.toFixed(2)}`;
    details = `İki Bağımsız Örneklem t-Testi | ${effectLabel}, Tahsis Oranı = ${k}:1`;
  } else if (validTestType === 'paired_t') {
    const dz = effectiveEffect;
    totalN = Math.ceil(Math.pow(zSum, 2) / Math.pow(dz, 2)) + 2;
    totalN = Math.max(6, totalN);
    n1 = totalN;
    n2 = totalN;
    effectLabel = `Cohen's dz = ${dz.toFixed(2)}`;
    details = `Eşleştirilmiş (Öncesi-Sonrası) t-Testi | ${effectLabel}`;
  } else if (validTestType === 'chi_square') {
    const h = effectiveEffect;
    const nPerGroup = Math.max(6, Math.ceil((2 * Math.pow(zSum, 2)) / Math.pow(h, 2)));
    n1 = nPerGroup;
    n2 = Math.ceil(nPerGroup * safeAllocation);
    totalN = n1 + n2;
    effectLabel = `Cohen's h = ${h.toFixed(2)}`;
    details = `Ki-Kare / İki Oran Testi | P1 = %${(safeP1 * 100).toFixed(0)}, P2 = %${(safeP2 * 100).toFixed(0)}, ${effectLabel}`;
  } else if (validTestType === 'anova') {
    const f = effectiveEffect;
    const k = safeGroups;
    const nPerGroup = Math.max(5, Math.ceil(Math.pow(zSum, 2) / (Math.pow(f, 2) * k)) + 2);
    n1 = nPerGroup;
    n2 = nPerGroup;
    totalN = nPerGroup * k;
    effectLabel = `Cohen's f = ${f.toFixed(2)}`;
    details = `Tek Yönlü ANOVA | ${k} Karşılaştırma Grubu, ${effectLabel}`;
  } else if (validTestType === 'correlation') {
    const r = Math.min(0.95, Math.max(0.05, effectiveEffect));
    // Fisher's z-transformation sample size formula
    const fisherZ = 0.5 * Math.log((1 + r) / (1 - r));
    const n = Math.max(8, Math.ceil(Math.pow(zSum / fisherZ, 2)) + 3);
    totalN = n;
    n1 = totalN;
    n2 = 0;
    effectLabel = `r = ${r.toFixed(2)}`;
    details = `Pearson / Spearman Korelasyon Testi | Hedef ${effectLabel}`;
  }

  // 4. Adjust for Dropout / Attrition
  const divisor = Math.max(0.1, 1 - safeDropout);
  const adjustedTotalN = Math.max(totalN, Math.ceil(totalN / divisor));
  const adjustedN1 = Math.max(n1, Math.ceil(n1 / divisor));
  const adjustedN2 = n2 > 0 ? Math.max(n2, Math.ceil(n2 / divisor)) : 0;

  // 5. Generate Copy-ready Formal Ethics Committee Justification Text
  const dropoutPercent = Math.round(safeDropout * 100);
  const powerPercent = Math.round(safePower * 100);
  
  let ethicsStatement = '';
  if (validTestType === 'two_sample_t') {
    ethicsStatement = `Bu çalışmanın örneklem büyüklüğü G*Power yönergeleri doğrultusunda ${details} tasarımı için belirlenmiştir. Tip I hata payı α = ${safeAlpha.toFixed(2)} ve istatistiksel güç (1-β) = %${powerPercent} kabul edildiğinde, ${effectLabel} büyüklüğündeki farkı saptamak için grup başına en az ${n1} hasta (toplam ${totalN} hasta) gerekmektedir. Takip kaybı ve veri eksikliği (%${dropoutPercent} dropout) hesaba katıldığında, 1. gruba ${adjustedN1}, 2. gruba ${adjustedN2} olmak üzere çalışmaya toplam ${adjustedTotalN} hasta dahil edilmesi planlanmıştır.`;
  } else if (validTestType === 'paired_t') {
    ethicsStatement = `Bu çalışmada öncesi-sonrası karşılaştırmalar için Tip I hata payı α = ${safeAlpha.toFixed(2)} ve %${powerPercent} güç ile ${effectLabel} etki büyüklüğünü saptayabilmek amacıyla en az ${totalN} hasta gerekmektedir. Klinik takip süresince %${dropoutPercent} olası hasta kaybı hesaba katılarak nihai örneklem büyüklüğü ${adjustedTotalN} hasta olarak belirlenmiştir.`;
  } else if (validTestType === 'chi_square') {
    ethicsStatement = `Kategorik sonlanım noktalarının karşılaştırılmasında (Ki-Kare testi), α = ${safeAlpha.toFixed(2)} anlamlılık ve %${powerPercent} güç ile ${effectLabel} büyüklüğündeki oran farkını (%${(safeP1*100).toFixed(0)} vs %${(safeP2*100).toFixed(0)}) tespit edebilmek için grup başına ${n1} hasta gerekmektedir. %${dropoutPercent} olası veri kaybı telafisiyle çalışmaya toplam ${adjustedTotalN} hasta dahil edilecektir.`;
  } else if (validTestType === 'anova') {
    ethicsStatement = `${safeGroups} bağımsız grubun karşılaştırıldığı Tek Yönlü ANOVA tasarımında, α = ${safeAlpha.toFixed(2)} ve %${powerPercent} güç ile ${effectLabel} etki büyüklüğünü belirlemek üzere grup başına ${n1} (toplam ${totalN}) katılımcı gerekmektedir. %${dropoutPercent} terk payı eklenerek her gruba ${adjustedN1} olmak üzere toplam ${adjustedTotalN} katılımcı hedeflenmiştir.`;
  } else {
    ethicsStatement = `Değişkenler arasındaki korelasyon analizinde (Pearson/Spearman), α = ${safeAlpha.toFixed(2)} ve %${powerPercent} güç ile ${effectLabel} düzeyindeki ilişkiyi anlamlı olarak saptamak için en az ${totalN} katılımcı gerekmektedir. %${dropoutPercent} olası veri kaybı dikkate alınarak toplam ${adjustedTotalN} katılımcı taranacaktır.`;
  }

  return {
    testType: validTestType,
    alpha: safeAlpha,
    power: safePower,
    effectiveEffect,
    effectLabel,
    n1,
    n2,
    totalN,
    adjustedTotalN,
    adjustedN1,
    adjustedN2,
    zAlpha,
    zBeta,
    details,
    ethicsStatement,
    dropoutRate: safeDropout
  };
}
