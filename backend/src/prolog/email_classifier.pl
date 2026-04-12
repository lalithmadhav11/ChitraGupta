% classify(Subject, Sender, Snippet, Priority)

% urgent
classify(Subject, _, _, urgent) :-
    ( sub_atom(Subject, _, _, _, 'deadline')
    ; sub_atom(Subject, _, _, _, 'asap')
    ; sub_atom(Subject, _, _, _, 'urgent')
    ; sub_atom(Subject, _, _, _, 'exam')
    ; sub_atom(Subject, _, _, _, 'tomorrow')
    ; sub_atom(Subject, _, _, _, 'due')
    ; sub_atom(Subject, _, _, _, 'submit')
    ), !.

% spam
classify(Subject, Sender, _, spam) :-
    ( sub_atom(Sender, _, _, _, 'ads')
    ; sub_atom(Sender, _, _, _, 'promo')
    ; sub_atom(Sender, _, _, _, 'shop')
    ; sub_atom(Sender, _, _, _, 'noreply')
    ; sub_atom(Sender, _, _, _, 'sale')
    ; sub_atom(Sender, _, _, _, 'discount')
    ; sub_atom(Sender, _, _, _, 'offer')
    ; sub_atom(Subject, _, _, _, 'discount')
    ; sub_atom(Subject, _, _, _, 'offer')
    ; sub_atom(Subject, _, _, _, 'sale')
    ; sub_atom(Subject, _, _, _, 'win')
    ; sub_atom(Subject, _, _, _, 'prize')
    ; sub_atom(Subject, _, _, _, 'free')
    ), !.

% important
classify(_, Sender, _, important) :-
    ( sub_atom(Sender, _, _, _, '.edu')
    ; sub_atom(Sender, _, _, _, 'professor')
    ; sub_atom(Sender, _, _, _, 'faculty')
    ; sub_atom(Sender, _, _, _, 'admin')
    ; sub_atom(Sender, _, _, _, 'university')
    ; sub_atom(Sender, _, _, _, 'college')
    ), !.

% normal
classify(_, _, _, normal).
