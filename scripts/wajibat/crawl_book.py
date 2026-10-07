# Crawl a leader.ir book through the site's own contents endpoint (POST /ajax/book),
# which returns every section with its HTML body, including the ones the page
# renders collapsed. Usage: crawl_book.py <catid> <out.json> <root sn> [<root sn> ...]
# (the roots are the top-level section ids linked from the book's own page)
import json, sys, time, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
CATID, OUT = int(sys.argv[1]), sys.argv[2]
def children(pid):
    req = urllib.request.Request("https://www.leader.ir/ajax/book", data=urllib.parse.urlencode({"parent": pid, "catid": CATID}).encode(),
                                 headers={"User-Agent": UA, "X-Requested-With": "XMLHttpRequest"})
    for attempt in range(4):
        try:
            return json.loads(urllib.request.urlopen(req, timeout=60).read().decode("utf-8"))[1]["data"]
        except Exception:
            time.sleep(2 + attempt * 2)
    raise RuntimeError(pid)
nodes = []
DELAY = float(__import__("os").environ.get("CRAWL_DELAY", "0"))
def walk(pid, path=()):
    time.sleep(DELAY)
    for c in children(pid):
        nodes.append({"id": c["id"], "parent": pid, "title": c["title"], "order": c["norder"], "type": c["nodetype"], "body": c.get("body") or "", "path": list(path) + [c["title"]]})
        walk(c["id"], tuple(path) + (c["title"],))
for root in [int(x) for x in sys.argv[3:]] or [0]:
    walk(root)
json.dump(nodes, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)
print(CATID, len(nodes), "nodes")
