import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROLOG_DIR = join(__dirname, '../prolog');

function sanitize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ')
    .replace(/&/g, 'and')
    .replace(/[^\x20-\x7E]/g, '')
    .slice(0, 200);
}

function runProlog(plFile, query) {
  const tmpFile = join(tmpdir(), `prolog_query_${Date.now()}.pl`);
  try {
    const plFilePath = join(PROLOG_DIR, plFile);
    const queryContent = `:- consult('${plFilePath.replace(/\\/g, '/')}').\n:- ${query}\n:- halt.\n`;
    writeFileSync(tmpFile, queryContent, 'utf8');
    const result = execSync(`swipl -q -f "${tmpFile}"`, {
      timeout: 5000,
      windowsHide: true
    }).toString().trim();
    return result || null;
  } catch (err) {
    console.warn('Prolog error, using JS fallback:', err.message.split('\n')[0]);
    return null;
  } finally {
    try { unlinkSync(tmpFile); } catch (e) {}
  }
}

export function classifyEmail(subject, sender, snippet) {
  const s = sanitize(subject);
  const sn = sanitize(sender);
  const sni = sanitize(snippet);
  const query = `classify('${s}','${sn}','${sni}',P), write(P), nl.`;
  const result = runProlog('email_classifier.pl', query);
  if (!result) return jsClassifyEmail(subject, sender);
  return result.trim();
}

export function getUrgency(daysRemaining) {
  if (daysRemaining === null || daysRemaining === undefined) return 'low';
  const days = parseInt(daysRemaining);
  const query = `urgency(${days},U), write(U), nl.`;
  const result = runProlog('deadline_urgency.pl', query);
  if (!result) return jsGetUrgency(days);
  return result.trim();
}

export function analyzeAttendance(attended, total) {
  const query = `attendance_analysis(${attended},${total},R,C,N), write(R), write('-'), write(C), write('-'), write(N), nl.`;
  const result = runProlog('attendance_rules.pl', query);
  if (!result) return jsAnalyzeAttendance(attended, total);
  const parts = result.trim().split('-');
  return {
    risk: parts[0] || 'safe',
    canMiss: parseInt(parts[1]) || 0,
    needToAttend: parseInt(parts[2]) || 0
  };
}

// JS Fallbacks
function jsClassifyEmail(subject, sender) {
  const s = (subject || '').toLowerCase();
  const sn = (sender || '').toLowerCase();
  if (['deadline','asap','urgent','exam','tomorrow','due tonight','submit'].some(k => s.includes(k))) return 'urgent';
  if (['unsubscribe','ads','promo','shop','sale','discount','offer','win','prize'].some(k => s.includes(k) || sn.includes(k))) return 'spam';
  if (sn.includes('.edu') || sn.includes('classroom.google') || ['professor','faculty','admin','no-reply@classroom'].some(k => sn.includes(k))) return 'important';
  return 'normal';
}

function jsGetUrgency(days) {
  if (days <= 1) return 'critical';
  if (days <= 3) return 'high';
  if (days <= 7) return 'medium';
  return 'low';
}

function jsAnalyzeAttendance(attended, total) {
  const pct = (attended / total) * 100;
  const risk = pct < 65 ? 'critical' : pct < 75 ? 'warning' : 'safe';
  const canMiss = pct >= 75 ? Math.max(0, Math.floor((attended - 0.75 * total) / 0.75)) : 0;
  const needToAttend = pct < 75 ? Math.max(0, Math.ceil((0.75 * total - attended) / 0.25)) : 0;
  return { risk, canMiss, needToAttend };
}
