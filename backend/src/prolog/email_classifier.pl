
% URGENT
% Checks subject first, then snippet.
% Extracted into urgent_keyword/1 helper so both subject
% and snippet reuse the same keyword list — fixes the original
% bug where snippet was passed but never actually used.
%
% Added keywords: quiz, test, viva, resubmit, overdue,
% tonight, alert, internal marks, attendance shortage, last date
% ------------------------------------------------------------
classify(Subject, _, Snippet, urgent) :-
    urgent_keyword(Subject), !.

classify(_, _, Snippet, urgent) :-
    urgent_keyword(Snippet), !.

urgent_keyword(Text) :-
    ( sub_atom(Text, _, _, _, 'deadline')
    ; sub_atom(Text, _, _, _, 'asap')
    ; sub_atom(Text, _, _, _, 'urgent')
    ; sub_atom(Text, _, _, _, 'exam')
    ; sub_atom(Text, _, _, _, 'quiz')
    ; sub_atom(Text, _, _, _, 'test')
    ; sub_atom(Text, _, _, _, 'viva')
    ; sub_atom(Text, _, _, _, 'tomorrow')
    ; sub_atom(Text, _, _, _, 'tonight')
    ; sub_atom(Text, _, _, _, 'due')
    ; sub_atom(Text, _, _, _, 'submit')
    ; sub_atom(Text, _, _, _, 'resubmit')
    ; sub_atom(Text, _, _, _, 'overdue')
    ; sub_atom(Text, _, _, _, 'alert')
    ; sub_atom(Text, _, _, _, 'internal marks')
    ; sub_atom(Text, _, _, _, 'attendance shortage')
    ; sub_atom(Text, _, _, _, 'last date')
    ).

classify(_, Sender, _, important) :-
    important_sender(Sender), !.

classify(Subject, _, _, important) :-
    important_keyword(Subject), !.

classify(_, _, Snippet, important) :-
    important_keyword(Snippet), !.

important_sender(Sender) :-
    ( sub_atom(Sender, _, _, _, '.edu')
    ; sub_atom(Sender, _, _, _, 'professor')
    ; sub_atom(Sender, _, _, _, 'faculty')
    ; sub_atom(Sender, _, _, _, 'admin')
    ; sub_atom(Sender, _, _, _, 'university')
    ; sub_atom(Sender, _, _, _, 'college')
    ; sub_atom(Sender, _, _, _, 'classroom.google')
    ; sub_atom(Sender, _, _, _, 'department')
    ; sub_atom(Sender, _, _, _, 'hod')
    ; sub_atom(Sender, _, _, _, 'registrar')
    ; sub_atom(Sender, _, _, _, 'principal')
    ).

important_keyword(Text) :-
    ( sub_atom(Text, _, _, _, 'circular')
    ; sub_atom(Text, _, _, _, 'notice')
    ; sub_atom(Text, _, _, _, 'announcement')
    ; sub_atom(Text, _, _, _, 'result')
    ; sub_atom(Text, _, _, _, 'timetable')
    ; sub_atom(Text, _, _, _, 'schedule')
    ; sub_atom(Text, _, _, _, 'fee')
    ; sub_atom(Text, _, _, _, 'scholarship')
    ).



classify(_, Sender, _, spam) :-
    spam_sender(Sender), !.

classify(Subject, _, _, spam) :-
    spam_keyword(Subject), !.

classify(_, _, Snippet, spam) :-
    spam_keyword(Snippet), !.

spam_sender(Sender) :-
    ( sub_atom(Sender, _, _, _, 'ads@')
    ; sub_atom(Sender, _, _, _, 'promo@')
    ; sub_atom(Sender, _, _, _, 'shop@')
    ; sub_atom(Sender, _, _, _, 'deals@')
    ; sub_atom(Sender, _, _, _, 'marketing@')
    ; sub_atom(Sender, _, _, _, 'newsletter@')
    ; sub_atom(Sender, _, _, _, 'offers@')
    ; sub_atom(Sender, _, _, _, 'sales@')
    ).

spam_keyword(Text) :-
    ( sub_atom(Text, _, _, _, 'discount')
    ; sub_atom(Text, _, _, _, 'offer')
    ; sub_atom(Text, _, _, _, 'sale')
    ; sub_atom(Text, _, _, _, 'win')
    ; sub_atom(Text, _, _, _, 'prize')
    ; sub_atom(Text, _, _, _, 'free')
    ; sub_atom(Text, _, _, _, 'click here')
    ; sub_atom(Text, _, _, _, 'unsubscribe')
    ; sub_atom(Text, _, _, _, 'newsletter')
    ; sub_atom(Text, _, _, _, 'limited offer')
    ; sub_atom(Text, _, _, _, 'winner')
    ; sub_atom(Text, _, _, _, 'congratulations')
    ; sub_atom(Text, _, _, _, 'lottery')
    ; sub_atom(Text, _, _, _, 'cash back')
    ).

classify(_, _, _, normal).