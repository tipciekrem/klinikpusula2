/**
 * Citation Engine
 * Formats academic references in APA 7, BibTeX, IEEE, MLA 9, and Chicago.
 */

// Helper to extract last name and initials
function formatAuthorAPA(name = '') {
  let clean = name.trim().replace(/,$/, '');
  if (clean.includes(',')) {
    const [last, first] = clean.split(',').map(s => s.trim());
    const initials = first ? first.split(/\s+/).map(p => p[0].toUpperCase() + '.').join(' ') : '';
    return initials ? `${last}, ${initials}` : last;
  }
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastPart = parts[parts.length - 1].replace(/\.$/, '');
  // If the last token is an initial (e.g. "J" or "RL"), the format is "LastName Initials"
  if (lastPart.length <= 2 && parts.length > 1) {
    const lastName = parts.slice(0, -1).join(' ');
    const initials = lastPart.split('').map(c => c.toUpperCase() + '.').join(' ');
    return `${lastName}, ${initials}`;
  }
  const lastName = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(p => p[0].toUpperCase() + '.').join(' ');
  return `${lastName}, ${initials}`;
}

function formatAuthorBibTeX(name = '') {
  let clean = name.trim().replace(/,$/, '');
  if (clean.includes(',')) return clean;
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastPart = parts[parts.length - 1].replace(/\.$/, '');
  if (lastPart.length <= 2 && parts.length > 1) {
    const lastName = parts.slice(0, -1).join(' ');
    const firstNames = parts[parts.length - 1];
    return `${lastName}, ${firstNames}`;
  }
  const lastName = parts[parts.length - 1];
  const firstNames = parts.slice(0, -1).join(' ');
  return `${lastName}, ${firstNames}`;
}

export function formatCitations(paper) {
  if (!paper) return {};

  const rawAuthors = paper.authors || [];
  const authors = rawAuthors.map(a => {
    if (typeof a === 'string') return { name: a };
    if (a && typeof a === 'object') {
      if (a.name) return a;
      if (a.lastName) return { name: `${a.firstName ? a.firstName + ' ' : ''}${a.lastName}` };
    }
    return { name: 'Anonymous' };
  });

  const year = paper.year || 'n.d.';
  const title = (paper.title || 'Untitled').trim().replace(/\.$/, '');
  const journal = paper.journal || 'Academic Journal';
  const doi = paper.doi ? (paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi.replace(/^doi:/i, '')}`) : null;

  // 1. APA 7th Edition
  let apaAuthors = 'Anonymous';
  if (authors.length === 1) {
    apaAuthors = formatAuthorAPA(authors[0].name);
  } else if (authors.length === 2) {
    apaAuthors = `${formatAuthorAPA(authors[0].name)}, & ${formatAuthorAPA(authors[1].name)}`;
  } else if (authors.length > 2 && authors.length <= 20) {
    const allExceptLast = authors.slice(0, -1).map(a => formatAuthorAPA(a.name)).join(', ');
    apaAuthors = `${allExceptLast}, & ${formatAuthorAPA(authors[authors.length - 1].name)}`;
  } else if (authors.length > 20) {
    const first19 = authors.slice(0, 19).map(a => formatAuthorAPA(a.name)).join(', ');
    apaAuthors = `${first19}, ... ${formatAuthorAPA(authors[authors.length - 1].name)}`;
  }

  const apa = `${apaAuthors} (${year}). ${title}. ${journal}.${doi ? ` ${doi}` : ''}`;

  // 2. BibTeX (LaTeX / Overleaf / Zotero)
  const firstAuthorLast = authors[0]?.name ? authors[0].name.split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g, '') : 'paper';
  const firstWordTitle = title.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
  const bibKey = `${firstAuthorLast}${year}${firstWordTitle}`;
  const bibAuthors = authors.map(a => formatAuthorBibTeX(a.name)).join(' and ') || 'Anonymous';

  const bibtex = `@article{${bibKey},
  author  = {${bibAuthors}},
  title   = {${title}},
  journal = {${journal}},
  year    = {${year}},${doi ? `\n  doi     = {${doi}},` : ''}
  note    = {Cited by: ${paper.citationCount || 0}}
}`;

  // 3. IEEE
  let ieeeAuthors = 'Anon.';
  if (authors.length === 1) {
    const parts = authors[0].name.trim().split(/\s+/);
    ieeeAuthors = `${parts.slice(0, -1).map(p => p[0].toUpperCase() + '.').join(' ')} ${parts[parts.length - 1]}`;
  } else if (authors.length > 1 && authors.length <= 6) {
    ieeeAuthors = authors.map(a => {
      const parts = a.name.trim().split(/\s+/);
      return `${parts.slice(0, -1).map(p => p[0].toUpperCase() + '.').join(' ')} ${parts[parts.length - 1]}`;
    }).join(', ');
  } else if (authors.length > 6) {
    const first = authors[0].name.trim().split(/\s+/);
    ieeeAuthors = `${first.slice(0, -1).map(p => p[0].toUpperCase() + '.').join(' ')} ${first[first.length - 1]} et al.`;
  }

  const ieee = `${ieeeAuthors}, "${title}," ${journal}, ${year}.${doi ? ` doi: ${doi}` : ''}`;

  // 4. MLA 9th Edition
  let mlaAuthors = 'Anonymous.';
  if (authors.length === 1) {
    mlaAuthors = `${authors[0].name}.`;
  } else if (authors.length === 2) {
    mlaAuthors = `${authors[0].name}, and ${authors[1].name}.`;
  } else if (authors.length > 2) {
    mlaAuthors = `${authors[0].name}, et al.`;
  }

  const mla = `${mlaAuthors} "${title}." ${journal}, ${year}.${doi ? ` ${doi}` : ''}`;

  // 5. Vancouver (Medical Standard / NLM)
  let vancouverAuthors = 'Anonymous';
  if (authors.length > 0) {
    vancouverAuthors = authors.slice(0, 6).map(a => {
      const parts = a.name.trim().split(/\s+/);
      const last = parts[parts.length - 1];
      const initials = parts.slice(0, -1).map(p => p[0].toUpperCase()).join('');
      return `${last} ${initials}`.trim();
    }).join(', ');
    if (authors.length > 6) {
      vancouverAuthors += ', et al.';
    }
  }
  const vancouver = `${vancouverAuthors}. ${title}. ${journal}. ${year}.${doi ? ` doi:${doi.replace(/^https?:\/\/doi\.org\//i, '')}` : ''}`;

  return {
    apa,
    bibtex,
    ieee,
    mla,
    vancouver,
    ris: generateRIS(paper),
    inText: `(${authors[0]?.name ? authors[0].name.split(/\s+/).pop() : (typeof authors[0] === 'string' ? authors[0].split(/\s+/).pop() : 'Anonymous')}${authors.length > 1 ? ' et al.' : ''}, ${year})`
  };
}

/**
 * Generate standard RIS format for Zotero, EndNote, Mendeley
 */
// Helper to escape LaTeX/BibTeX special characters
function escapeBibTeX(str = '') {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_');
}

/**
 * Generate standard RIS format for Zotero, EndNote, Mendeley
 */
export function generateRIS(paper) {
  if (!paper || typeof paper !== 'object') return '';
  const lines = [
    'TY  - JOUR',
    `TI  - ${paper.title || 'Untitled'}`,
    `T1  - ${paper.title || 'Untitled'}`
  ];

  const rawAuthors = Array.isArray(paper.authors)
    ? paper.authors
    : (typeof paper.authors === 'string' ? [paper.authors] : []);

  for (const author of rawAuthors) {
    if (!author) continue;
    let name = '';
    if (typeof author === 'string') {
      name = author.trim();
    } else if (typeof author === 'object') {
      if (author.name) {
        name = author.name.trim();
      } else if (author.lastName) {
        name = `${author.firstName ? author.firstName + ' ' : ''}${author.lastName}`.trim();
      } else if (author.author?.display_name) {
        name = author.author.display_name.trim();
      }
    }
    if (name) lines.push(`AU  - ${name}`);
  }

  if (paper.year) lines.push(`PY  - ${paper.year}`);
  if (paper.journal) lines.push(`JO  - ${paper.journal}`);
  if (paper.volume) lines.push(`VL  - ${paper.volume}`);
  if (paper.issue) lines.push(`IS  - ${paper.issue}`);
  if (paper.pages) lines.push(`SP  - ${paper.pages}`);
  if (paper.abstract) lines.push(`AB  - ${paper.abstract}`);
  if (paper.doi) {
    const cleanDoi = String(paper.doi).replace(/^https?:\/\/doi\.org\//i, '').replace(/^doi:/i, '').trim();
    lines.push(`DO  - ${cleanDoi}`);
  }
  if (paper.pdfUrl) lines.push(`UR  - ${paper.pdfUrl}`);
  if (paper.studyType) lines.push(`KW  - ${paper.studyType}`);
  if (paper.pmid) lines.push(`AN  - PMID:${paper.pmid}`);
  lines.push('ER  - ');
  return lines.join('\r\n');
}

/**
 * Batch generate RIS file content for multiple papers
 */
export function generateBatchRIS(papers = []) {
  const safePapers = (Array.isArray(papers) ? papers : []).filter(p => p && typeof p === 'object');
  return safePapers.map(p => generateRIS(p)).join('\r\n\r\n');
}

/**
 * Generate standard BibTeX entry for LaTeX, Overleaf, Zotero
 */
export function generateBibTeX(paper) {
  if (!paper || typeof paper !== 'object') return '';
  const rawAuthors = Array.isArray(paper.authors)
    ? paper.authors
    : (typeof paper.authors === 'string' ? [paper.authors] : []);

  const authors = rawAuthors.map(a => {
    if (typeof a === 'string' && a.trim()) return a.trim();
    if (a && typeof a === 'object') {
      return a.name || `${a.firstName ? a.firstName + ' ' : ''}${a.lastName || ''}`.trim() || 'Anonymous';
    }
    return 'Anonymous';
  }).filter(a => a && a !== '');

  const year = paper.year || '2024';
  const rawTitle = (paper.title || 'Untitled').trim().replace(/[\r\n]+/g, ' ');
  const title = escapeBibTeX(rawTitle);
  const journal = escapeBibTeX(paper.journal || 'Academic Journal');
  const cleanDoi = paper.doi ? String(paper.doi).replace(/^https?:\/\/doi\.org\//i, '').replace(/^doi:/i, '').trim() : null;

  let firstAuthorLast = 'Paper';
  if (authors[0]) {
    const rawA0 = authors[0].trim();
    if (rawA0.includes(',')) {
      firstAuthorLast = rawA0.split(',')[0].trim().replace(/[^a-zA-Z]/g, '');
    } else {
      firstAuthorLast = rawA0.split(/\s+/).pop().replace(/[^a-zA-Z]/g, '');
    }
  }
  const firstWordTitle = rawTitle.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
  const bibKey = `${firstAuthorLast || 'Ref'}${year}${firstWordTitle || 'Study'}`;
  const bibAuthors = authors.length > 0 
    ? authors.map(a => formatAuthorBibTeX(a)).join(' and ') 
    : 'Anonymous';

  let entry = `@article{${bibKey},\n`;
  entry += `  author  = {${bibAuthors}},\n`;
  entry += `  title   = {${title}},\n`;
  entry += `  journal = {${journal}},\n`;
  entry += `  year    = {${year}}`;
  if (cleanDoi) entry += `,\n  doi     = {${cleanDoi}}`;
  if (paper.volume) entry += `,\n  volume  = {${paper.volume}}`;
  if (paper.issue) entry += `,\n  number  = {${paper.issue}}`;
  if (paper.pages) entry += `,\n  pages   = {${paper.pages}}`;
  if (paper.pdfUrl) entry += `,\n  url     = {${paper.pdfUrl}}`;
  if (paper.pmid) entry += `,\n  eprint  = {PMID:${paper.pmid}}`;
  entry += `\n}`;
  return entry;
}

/**
 * Batch generate BibTeX file content for multiple papers
 */
export function generateBatchBibTeX(papers = []) {
  const safePapers = (Array.isArray(papers) ? papers : []).filter(p => p && typeof p === 'object');
  return safePapers.map(p => generateBibTeX(p)).join('\n\n');
}
