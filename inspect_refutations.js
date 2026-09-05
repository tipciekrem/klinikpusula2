import { CRITICAL_NEGATIVE_CASES } from './server/services/criticalRefutations.js';

console.log('Total critical negative cases:', CRITICAL_NEGATIVE_CASES.length);
CRITICAL_NEGATIVE_CASES.forEach(c => {
  console.log(`[#${c.id}] (${c.specialty}) Topic: "${c.topic}" | Keywords: ${JSON.stringify(c.keywords)}`);
});
