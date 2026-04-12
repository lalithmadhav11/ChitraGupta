% study_priority.pl
score_attendance(critical, 10).
score_attendance(warning, 5).
score_attendance(safe, 0).

score_assignment(critical, 8).
score_assignment(high, 5).
score_assignment(medium, 3).
score_assignment(low, 1).

% subject_total_score(AttendanceRisk, Urgency, TotalScore)
subject_total_score(AttendanceRisk, Urgency, TotalScore) :-
    score_attendance(AttendanceRisk, A_Score),
    score_assignment(Urgency, U_Score),
    TotalScore is A_Score + U_Score.
