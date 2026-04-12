import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateStudyPlan(assignments, attendanceData) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Build context from assignments
  const assignmentContext = assignments
    .filter(a => a.dueDate !== null)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 10)
    .map(a => `- ${a.title} (${a.courseName}): due in ${a.daysRemaining} days, urgency: ${a.urgency}`)
    .join('\n');

  // Build context from attendance
  const attendanceContext = attendanceData
    .filter(a => a.risk !== 'safe')
    .map(a => `- ${a.subject}: ${a.percentage?.toFixed(1)}% attendance, status: ${a.risk}, needs ${a.needToAttend} more classes`)
    .join('\n');

  // Get today's date in UTC
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const prompt = `
You are an academic study planner. Create a 7-day study plan starting from ${todayStr}.

PENDING ASSIGNMENTS:
${assignmentContext || 'No pending assignments'}

AT-RISK SUBJECTS (attendance below 75%):
${attendanceContext || 'No at-risk subjects'}

Generate a realistic, balanced 7-day study plan. Return ONLY a valid JSON object with this exact structure:
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
- Generate exactly 7 days starting from ${todayStr}
- Use correct day names for each date (calculate properly)
- Maximum 4 tasks per day
- Priority must be one of: high, medium, low
- Focus on urgent assignments and at-risk subjects
- Include revision and rest balance
- Return ONLY the JSON, no markdown, no explanation
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip markdown code fences if present
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
