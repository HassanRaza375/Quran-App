# Shared locations for the Wajibat generators (see README.md).
#   SRC  — downloaded official pages (git-ignored; filled by fetch_sources.py)
#   TMP  — scratch output inside SRC (dataset dump, Q&A placement metadata)
#   DATA — the generated dataset files in the app
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
SRC = os.environ.get("WAJIBAT_SRC") or os.path.join(HERE, ".cache")
TMP = os.path.join(SRC, "_build")
DATA = os.path.join(REPO, "app", "data", "wajibat")
FIXTURE = os.path.join(REPO, "tests", "fixtures", "wajibatSourceSnapshot.json")
os.makedirs(TMP, exist_ok=True)
