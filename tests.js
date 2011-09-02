
var t = Tuple(4, 'a', 0.5);

print(t.matches(4, 'a', 0.5));
print(t.matches(4, _, 0.5));
print(t.matches(_, _, 0.5));
print(t.matches(_, _, _));
print(!t.matches(_, _));
print(!t.matches(4, 'a'));

