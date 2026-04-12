% attendance_analysis(Attended, Total, Risk, CanMiss, NeedToAttend)
attendance_analysis(Attended, Total, Risk, CanMiss, NeedToAttend) :-
    Total > 0,
    Percentage is (Attended / Total) * 100,
    ( Percentage < 65 -> Risk = critical
    ; Percentage < 75 -> Risk = warning
    ; Risk = safe
    ),
    ( Risk == safe ->
      CanMissTemp is floor((Attended - 0.75 * Total) / 0.75),
      (CanMissTemp > 0 -> CanMiss = CanMissTemp ; CanMiss = 0),
      NeedToAttend = 0
    ; 
      NeedToAttendTemp is ceiling((0.75 * Total - Attended) / 0.25),
      (NeedToAttendTemp > 0 -> NeedToAttend = NeedToAttendTemp ; NeedToAttend = 0),
      CanMiss = 0
    ).
