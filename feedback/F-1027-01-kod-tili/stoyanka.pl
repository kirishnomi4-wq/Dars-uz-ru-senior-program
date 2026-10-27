# F-1027-01: AvtoStoyanka sxemasi → inglizcha. Izoh-qatorlar (//, /* */) va CSS tegilmaydi.
next if /^\s*(\/\/|\/\*|\*)/ || /^const HW_V2/ || /^\s*\.[a-z-]+ \{/;
s/(?<![-\w])joylar(?![-\w])/spots/g;
s/(?<![-\w])sessiyalar(?![-\w])/sessions/g;
s/(?<![-\w])joy_id(?![-\w])/spot_id/g;
s/(?<![-\w])bandmi(?![-\w])/is_busy/g;
s/(?<![-\w])sozlamalar(?![-\w])/settings/g;
for my $p (['raqam','label'],['mashina','plate'],['tolov','fee'],['kirgan','entered_at'],['chiqqan','left_at']) {
  my ($o,$n)=@$p;
  s/(?<=[.({\[,'"`])(\s?)$o(?![-\w])/$1$n/g;          # .raqam  (raqam  , raqam  'raqam  "raqam  `raqam
  s/(?<![-\w])$o(?=\s*[:,)'"`\]])/$n/g;               # raqam:  raqam,  raqam)  raqam'  raqam`
  s/(?<![-\w])$o(?= (TEXT|INTEGER|TIMESTAMP|BOOLEAN|= |IS ))/$n/g;
  s/(?<=SUM\()$o/$n/g;
}
s{/api/kirish}{/api/enter}g; s{/api/chiqish}{/api/exit}g; s{/api/tushum}{/api/revenue}g;
