import { google } from 'googleapis';

function getOAuthClient(accessToken, refreshToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  return oauth2Client;
}

export async function fetchRealAssignments(accessToken, refreshToken) {
  const auth = getOAuthClient(accessToken, refreshToken);
  const classroom = google.classroom({ version: 'v1', auth });

  // Get all active courses where user is a student
  let courses = [];
  try {
    const coursesRes = await classroom.courses.list({
      studentId: 'me',
      courseStates: ['ACTIVE']
    });
    courses = coursesRes.data.courses || [];
  } catch (err) {
    console.warn('Could not fetch courses:', err.message);
    return [];
  }

  const allAssignments = [];

  for (const course of courses) {
    try {
      // Get all coursework for this course
      const workRes = await classroom.courses.courseWork.list({
        courseId: course.id,
        courseWorkStates: ['PUBLISHED']
      });

      const courseWorks = workRes.data.courseWork || [];

      for (const work of courseWorks) {
        // Get student submission for this assignment
        let submissionState = 'NEW';
        try {
          const subRes = await classroom.courses.courseWork.studentSubmissions.list({
            courseId: course.id,
            courseWorkId: work.id,
            userId: 'me'
          });
          const submissions = subRes.data.studentSubmissions || [];
          if (submissions.length > 0) {
            submissionState = submissions[0].state;
          }
        } catch (e) {
          // ignore submission fetch errors
        }

        // Skip already turned in assignments
        if (submissionState === 'TURNED_IN' || submissionState === 'RETURNED') continue;

        // Construct due date
        let dueDate = null;
        if (work.dueDate) {
          const { year, month, day } = work.dueDate;
          const hour = work.dueTime?.hours || 23;
          const minute = work.dueTime?.minutes || 59;
          dueDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
        }

        allAssignments.push({
          classroomId: work.id,
          courseId: course.id,
          courseName: course.name,
          title: work.title,
          description: work.description || '',
          type: work.workType || 'ASSIGNMENT',
          dueDate,
          maxPoints: work.maxPoints || null,
          submissionState
        });
      }
    } catch (err) {
      console.warn(`Could not fetch coursework for ${course.name}:`, err.message);
    }
  }

  return allAssignments;
}
