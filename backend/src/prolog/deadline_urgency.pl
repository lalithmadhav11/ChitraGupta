% urgency(DaysRemaining, Urgency)
urgency(DaysRemaining, critical) :- DaysRemaining =< 1, !.
urgency(DaysRemaining, high) :- DaysRemaining =< 3, !.
urgency(DaysRemaining, medium) :- DaysRemaining =< 7, !.
urgency(DaysRemaining, low) :- DaysRemaining > 7, !.
