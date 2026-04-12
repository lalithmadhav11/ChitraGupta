import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROLOG_DIR = path.join(__dirname, '../prolog');

// Helper to sanitize strings for Prolog (escape single quotes)
function sanitize(str) {
  return String(str).replace(/'/g, "\\'").toLowerCase();
}

// Helper to run a Prolog query
function runProlog(file, query) {
  try {
    const filePath = path.join(PROLOG_DIR, file);
    const cmd = `echo "${query}" | swipl -q -s "${filePath}"`;
    const result = execSync(cmd, { timeout: 5000 }).toString().trim();
    return result;
  } catch (err) {
    console.warn('Prolog error, using JS fallback:', err.message);
    return null;
  }
}

export function classifyEmail(subject, sender, snippet) {
  const s = sanitize(subject || '');
  const sn = sanitize(sender || '');
  const sni = sanitize(snippet || '');
  const query = `classify('${s}','${sn}','${sni}',P), write(P), halt.`;
  const result = runProlog('email_classifier.pl', query);
  if (!result) return jsClassifyEmail(subject, sender);
  return result;
}

export function getUrgency(daysRemaining) {
  if (daysRemaining === null || daysRemaining === undefined) return 'low';
  const query = `urgency(${daysRemaining},U), write(U), halt.`;
  const result = runProlog('deadline_urgency.pl', query);
  if (!result) return jsGetUrgency(daysRemaining);
  return result;
}

export function analyzeAttendance(attended, total) {
  if (total === 0) return jsAnalyzeAttendance(attended, total);
  const query = `attendance_analysis(${attended},${total},R,C,N), write(R-C-N), halt.`;
  const result = runProlog('attendance_rules.pl', query);
  if (!result) return jsAnalyzeAttendance(attended, total);
  const parts = result.split('-');
  return {
    risk: parts[0] || 'safe',
    canMiss: parseInt(parts[1]) || 0,
    needToAttend: parseInt(parts[2]) || 0
  };
}

// JS Fallbacks (used if swipl not found)
function jsClassifyEmail(subject, sender) {
  const s = (subject || '').toLowerCase();
  const sn = (sender || '').toLowerCase();
  if (['deadline','asap','urgent','exam','tomorrow','due','submit'].some(k => s.includes(k))) return 'urgent';
  if (['ads','promo','shop','sale','discount','offer','win','prize','free'].some(k => s.includes(k) || sn.includes(k))) return 'spam';
  if (sn.includes('.edu') || ['professor','faculty','admin'].some(k => sn.includes(k))) return 'important';
  return 'normal';
}

function jsGetUrgency(days) {
  if (days <= 1) return 'critical';
  if (days <= 3) return 'high';
  if (days <= 7) return 'medium';
  return 'low';
}

function jsAnalyzeAttendance(attended, total) {
  if (total === 0) return { risk: 'critical', canMiss: 0, needToAttend: 0 };
  const pct = (attended / total) * 100;
  const risk = pct < 65 ? 'critical' : pct < 75 ? 'warning' : 'safe';
  const canMiss = pct >= 75 ? Math.max(0, Math.floor((attended - 0.75 * total) / 0.75)) : 0;
  const needToAttend = pct < 75 ? Math.max(0, Math.ceil((0.75 * total - attended) / 0.25)) : 0;
  return { risk, canMiss, needToAttend };
}
