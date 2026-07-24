const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = XLSX.readFile('translations.xlsx');
const enDir = path.join(__dirname, 'messages', 'en');
const jaDir = path.join(__dirname, 'messages', 'ja');

function loadAllJsons(dir) {
  const result = {};
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.json')) {
      result[file.replace('.json', '')] = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    }
  }
  return result;
}

function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? prefix + '.' + key : key;
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (typeof item === 'object' && item !== null) Object.assign(result, flatten(item, fullKey + '.' + i));
          else result[fullKey + '.' + i] = item;
        });
      } else Object.assign(result, flatten(value, fullKey));
    } else result[fullKey] = value;
  }
  return result;
}

const enMessages = loadAllJsons(enDir);
const jaMessages = loadAllJsons(jaDir);

const enFlat = {}, jaFlat = {};
for (const [ns, data] of Object.entries(enMessages)) {
  for (const [k, v] of Object.entries(flatten(data))) enFlat[ns + '.' + k] = v;
}
for (const [ns, data] of Object.entries(jaMessages)) {
  for (const [k, v] of Object.entries(flatten(data))) jaFlat[ns + '.' + k] = v;
}

// Reverse index: EN text -> keys
const enTextToKeys = {};
for (const [key, val] of Object.entries(enFlat)) {
  if (typeof val === 'string' && val.trim()) {
    const n = val.trim();
    if (!enTextToKeys[n]) enTextToKeys[n] = [];
    enTextToKeys[n].push(key);
  }
}

const allNs = Object.keys(enMessages);
const results = [];

for (const sheetName of wb.SheetNames) {
  const data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;
    const xlsxKey = String(row[0]).trim();
    const xlsxEn = row[1] != null ? String(row[1]).trim() : '';
    const xlsxJa = row[2] != null ? String(row[2]).trim() : '';
    if (!xlsxEn && !xlsxJa) continue;

    // Find matching JSON key
    let foundKeys = [];
    for (const ns of allNs) {
      const fk = ns + '.' + xlsxKey;
      if (enFlat[fk] !== undefined) foundKeys.push(fk);
    }
    if (foundKeys.length === 0 && xlsxEn) {
      const m = enTextToKeys[xlsxEn];
      if (m) foundKeys = [...m];
    }

    if (foundKeys.length > 0) {
      // Deduplicate — prefer the one where EN matches
      const best = foundKeys.find(fk => typeof enFlat[fk] === 'string' && enFlat[fk].trim() === xlsxEn) || foundKeys[0];
      const enVal = typeof enFlat[best] === 'string' ? enFlat[best].trim() : String(enFlat[best] || '');
      const jaVal = typeof jaFlat[best] === 'string' ? jaFlat[best].trim() : String(jaFlat[best] || '');
      const enMatches = enVal === xlsxEn;
      const jaMatches = jaVal === xlsxJa;
      const jaHasJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(jaVal);

      let jaStatus;
      if (jaMatches) jaStatus = 'JA_MATCHES_XLSX';
      else if (!jaVal) jaStatus = 'JA_MISSING';
      else if (jaVal === enVal && !jaHasJapanese) jaStatus = 'JA_STILL_ENGLISH';
      else if (jaHasJapanese) jaStatus = 'JA_DIFFERENT';
      else jaStatus = 'JA_OTHER';

      results.push({
        sheet: sheetName,
        xlsxKey,
        jsonKey: best,
        enMatch: enMatches ? 'YES' : 'NO',
        jaStatus,
        xlsxEn,
        xlsxJa,
        jsonEn: enVal,
        jsonJa: jaVal
      });
    } else {
      results.push({
        sheet: sheetName,
        xlsxKey,
        jsonKey: null,
        enMatch: 'N/A',
        jaStatus: 'NOT_IN_JSON',
        xlsxEn,
        xlsxJa,
        jsonEn: null,
        jsonJa: null
      });
    }
  }
}

// Summary stats
const summary = {
  totalXlsxRows: results.length,
  foundInJson: results.filter(r => r.jsonKey).length,
  notFoundInJson: results.filter(r => !r.jsonKey).length,
  byStatus: {},
  bySheet: {}
};

for (const r of results) {
  summary.byStatus[r.jaStatus] = (summary.byStatus[r.jaStatus] || 0) + 1;
  if (!summary.bySheet[r.sheet]) summary.bySheet[r.sheet] = { total: 0, found: 0, notFound: 0, jaMatches: 0, jaDifferent: 0, jaStillEn: 0, jaMissing: 0 };
  const s = summary.bySheet[r.sheet];
  s.total++;
  if (r.jsonKey) s.found++; else s.notFound++;
  if (r.jaStatus === 'JA_MATCHES_XLSX') s.jaMatches++;
  if (r.jaStatus === 'JA_DIFFERENT') s.jaDifferent++;
  if (r.jaStatus === 'JA_STILL_ENGLISH') s.jaStillEn++;
  if (r.jaStatus === 'JA_MISSING') s.jaMissing++;
}

fs.writeFileSync('xlsx_audit_results.json', JSON.stringify({ summary, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
