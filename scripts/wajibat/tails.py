import sys, review_rules as r
from align_rules import en_to_fa
a, b, cut, w = map(int, sys.argv[1:5])
for i, (rid, n, e) in enumerate(r.ENTRIES):
    if not (a <= i < b): continue
    m = en_to_fa(n); en = e["text"]["en"].replace("\n", " | "); ur = r.U[m][0].replace("\n", " | ")
    if len(en) > cut or len(ur) > cut * 0.95:
        print(f"#{i} [{rid}]"); print("  EN…", en[cut:cut + w]); print("  UR…", ur[int(cut * 0.95):int(cut * 0.95) + w]); print()
