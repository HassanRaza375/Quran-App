# Downloads the official sources the Wajibat generators read into .cache/ (git-ignored) and
# checks each file against sources.manifest.json (URL, fetch date, SHA-256 of the file the
# generators read). Raw pages are never committed; this script is how they are re-created.
#
#   python fetch_sources.py              download files missing from .cache/, then verify all hashes
#   python fetch_sources.py --refresh    re-download everything and report which files changed
#   python fetch_sources.py --record     write the current .cache/ files' hashes and dates into the manifest
#
# A changed hash means the official page changed since the data was generated: re-run build.py
# and review the git diff of app/data/wajibat and the snapshot fixture before accepting it.
import datetime, hashlib, json, os, re, subprocess, sys, time, urllib.parse, urllib.request
from paths import HERE, SRC

sys.stdout.reconfigure(encoding="utf-8")
MANIFEST = os.path.join(HERE, "sources.manifest.json")
UA = "Mozilla/5.0"
UA_FULL = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"


def sha256(path):
    """SHA-256 of the file with CRLF normalised to LF, so the hash is the same on every OS
    (text written on Windows has CRLF line endings; the generators don't care either way)."""
    with open(path, "rb") as f:
        return hashlib.sha256(f.read().replace(b"\r\n", b"\n")).hexdigest()


def http_get(url, ua):
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    for attempt in range(4):
        try:
            return urllib.request.urlopen(req, timeout=120).read()
        except Exception:
            if attempt == 3:
                raise
            time.sleep(3 + attempt * 3)


def fetch(entry, dest):
    """Re-creates one cached file exactly as the generators expect it."""
    m = entry["method"]
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if m == "page":  # HTML page → plain text with h2t.py (the converter the data was built with)
        raw = dest + ".html"
        open(raw, "wb").write(http_get(entry["url"], entry.get("ua") == "full" and UA_FULL or UA))
        out = subprocess.run([sys.executable, os.path.join(HERE, "h2t.py"), raw], check=True, capture_output=True).stdout
        open(dest, "wb").write(out)
        os.remove(raw)
    elif m == "raw":  # kept as HTML (the live-page Q&A check reads these)
        open(dest, "wb").write(http_get(entry["url"], UA_FULL))
    elif m == "pdf":  # PDF → text with PyMuPDF, one "<<<PAGE n>>>" marker per page
        import fitz  # pip install pymupdf
        raw = dest + ".pdf"
        open(raw, "wb").write(http_get(entry["url"], UA))
        d = fitz.open(raw)
        open(dest, "w", encoding="utf-8").write("\n".join(f"<<<PAGE {i+1}>>>\n" + p.get_text() for i, p in enumerate(d)))
        d.close(); os.remove(raw)
    elif m == "leader-tree":  # leader.ir book contents endpoint (includes collapsed sections)
        subprocess.run([sys.executable, os.path.join(HERE, "crawl_book.py"), str(entry["catid"]), dest, *map(str, entry["roots"])], check=True)
    else:
        raise ValueError(m)


def main():
    args = set(sys.argv[1:])
    manifest = json.load(open(MANIFEST, encoding="utf-8"))
    files = manifest["files"]
    if "--record" in args:
        for e in files:
            p = os.path.join(SRC, e["path"])
            if os.path.exists(p):
                e["sha256"] = sha256(p)
                e.setdefault("fetched", datetime.date.fromtimestamp(os.path.getmtime(p)).isoformat())
        json.dump(manifest, open(MANIFEST, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1)
        print("recorded", len(files), "files")
        return
    changed, missing = [], []
    for e in files:
        p = os.path.join(SRC, e["path"])
        if "--refresh" in args or not os.path.exists(p):
            print("fetch", e["path"], "<-", e.get("url") or e.get("roots"), flush=True)
            try:
                fetch(e, p)
            except Exception as ex:
                missing.append((e["path"], str(ex)))
                continue
        if e.get("sha256") and sha256(p) != e["sha256"]:
            changed.append(e["path"])
    print(f"{len(files)} files; {len(changed)} changed since the manifest; {len(missing)} could not be fetched")
    for c in changed:
        print("  CHANGED", c)
    for m in missing:
        print("  MISSING", *m)
    sys.exit(1 if changed or missing else 0)


if __name__ == "__main__":
    main()
