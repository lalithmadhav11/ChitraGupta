import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateStudyPlan(assignments, attendanceData) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 const model = genAI.getGenerativeModel({ model: 'gemma-4-26b-a4b-it' });

    const pendingAssignments = assignments
      .filter(a => a.dueDate !== null && a.daysRemaining !== null)
      .sort((a, b) => (a.daysRemaining || 999) - (b.daysRemaining || 999))
      .slice(0, 10);

    const assignmentContext = pendingAssignments.length > 0
      ? pendingAssignments.map(a =>
          `- ${a.title} (${a.courseName}): due in ${a.daysRemaining} days, urgency: ${a.urgency}`
        ).join('\n')
      : 'No pending assignments with due dates';

    const atRiskSubjects = attendanceData.filter(a => a.risk !== 'safe');
    const attendanceContext = atRiskSubjects.length > 0
      ? atRiskSubjects.map(a =>
          `- ${a.subject}: ${a.percentage?.toFixed(1) || 0}% attendance, risk: ${a.risk}, needs ${a.needToAttend} more classes`
        ).join('\n')
      : 'All subjects have safe attendance';

    // Generate 7 dates starting from today
    const today = new Date();
    const dates = [];
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        day: dayNames[d.getDay()],
        date: d.toISOString().split('T')[0]
      });
    }

    const prompt = `You are an academic study planner. Create a 7-day study plan.

PENDING ASSIGNMENTS:
${assignmentContext}

AT-RISK SUBJECTS (attendance below 75%):
${attendanceContext}

THE 7 DAYS ARE:
${dates.map(d => `${d.day} ${d.date}`).join('\n')}

Return ONLY a valid JSON object, no markdown, no explanation, no code fences.
Use exactly this structure:
{
  "days": [
    {
      "day": "Sunday",
      "date": "2026-04-12",
      "tasks": [
        {
          "subject": "Subject name",
          "task": "Specific task description",
          "duration": "2 hours",
          "priority": "high"
        }
      ]
    }
  ]
}

Rules:
- Exactly 7 days using the dates provided above
- Maximum 4 tasks per day
- Priority must be: high, medium, or low
- Focus on urgent assignments and at-risk subjects
- Return ONLY the JSON object, nothing else`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Robust JSON extraction
    const extractedData = extractJSON(text);
    return extractedData;
    
  } catch (error) {
    console.error('Gemini Service Error:', error.message);
    throw error;
  }
}

/**
 * Robustly extracts and parses JSON from a string that might contain extra text.
 */
function extractJSON(text) {
  try {
    // 1. Clean markdown code fences
    let clean = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    // 2. Try direct parse first
    try {
      const parsed = JSON.parse(clean);
      if (parsed && (parsed.days || parsed.tasks)) return parsed;
    } catch (e) {
      // Fall through
    }

    // 3. Find all valid JSON blocks and pick the best one
    let start = clean.indexOf('{');
    const candidates = [];

    while (start !== -1) {
      let end = clean.lastIndexOf('}');
      while (end > start) {
        const candidateStr = clean.substring(start, end + 1);
        try {
          const parsed = JSON.parse(candidateStr);
          candidates.push(parsed);
          // If we find one with 'days', it's highly likely the correct one
          if (parsed.days) return parsed;
        } catch (e) {
          // Not valid, try smaller
        }
        end = clean.lastIndexOf('}', end - 1);
      }
      start = clean.indexOf('{', start + 1);
    }

    // 4. Fallback: return the first candidate found if any
    if (candidates.length > 0) return candidates[0];

    // 5. If we reach here, extraction failed
    console.error('Failed to parse Gemini response as JSON. Raw text:', text);
    throw new Error('No valid study plan JSON found in response');
  } catch (error) {
    throw error;
  }
}
