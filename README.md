# Chitraguptha

Your AI-powered academic assistant to streamline student life. Automatically sync your university Google accounts to fetch emails and Google Classroom assignments. Leverage Prolog for intelligent tracking and scoring, and Gemini AI for generating optimized 7-day study plans.

## Features

- **Google OAuth**: Fast login exclusively using Google.
- **Email Categorization**: Sync real emails with Prolog-powered smart categorization (urgent/important/spam).
- **Classroom Assignments**: Automatically ingest Google Classroom assignments and calculate priority based on urgency.
- **Attendance Tracker**: Log attendance and automatically compute academic risk factors.
- **AI Study Planner**: Uses Google's Gemini 2.5 Flash to automatically compose a balanced, 7-day study plan considering your at-risk subjects and impending assignments.
- **Dashboard**: A unified hub to quickly ingest all important action metrics.

## Prerequisites

- Node.js 18+
- SWI-Prolog installed on your system (`swipl` in PATH)
- MongoDB running locally or a MongoDB Atlas URI
- Google Cloud Console Account (for Gmail and Classroom APIs)
- Gemini API Key from Google AI Studio

## Setup Instructions

### 1. Google Cloud Console Setup

1. Create a new Google Cloud Project.
2. Enable the **Gmail API** and **Google Classroom API**.
3. Configure the **OAuth consent screen** with the following scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `.../auth/gmail.readonly`
   - `.../auth/classroom.courses.readonly`
   - `.../auth/classroom.coursework.me.readonly`
   - `.../auth/classroom.student-submissions.me.readonly`
4. Create **OAuth 2.0 Client IDs** (Application Type: Web Application). Add `http://localhost:5000/api/auth/google/callback` to the authorized redirect URIs.
5. Note your Client ID and Client Secret.

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill the variables with your actual keys (Google OAuth, Gemini API key, random JWT secret, MongoDB URI).
4. Run `npm run dev`.

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Make sure the backend serves at port 5000 (referenced by `NEXT_PUBLIC_API_URL` implicitly or in `.env.local` if added).
4. Run `npm run dev`.

### Notes
- Since SWI-Prolog is utilized using child processes, make sure `swipl` commands run globally from your terminal. If missing, a rough JavaScript fallback will take up execution invisibly.
-
