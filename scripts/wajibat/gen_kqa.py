# P13 / rule R7: Khamenei's Q&A book (Practical Laws of Islam / استفتاآت کے جوابات)
# as supplementary entries for Salat. Every question/answer is copied verbatim from
# the downloaded chapter pages (kh_en_prayer.txt / kh_ur_prayer.txt) and must also
# appear in the live leader.ir section page (checked by verify_kqa.py).
# Shown only where the Q&A agrees with the cited ruling(s) of The Rules on Prayer &
# Fasting 2023 (first priority, R6); a Q&A that differs is recorded, not shown.
import json, os, re, sys, unicodedata
from paths import TMP
from src import KH_EN_PRAYER as E, KH_UR_PRAYER as U
from kh_rpf import RPF
from qa_sections import EN_SEC, UR_SEC
from picks import PICKS, UR

sys.stdout.reconfigure(encoding="utf-8")
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OUT_SAWM = sys.argv[2] if len(sys.argv) > 2 else None   # Phase 5: the fasting Q&A entries go to their own file
nfc = lambda s: unicodedata.normalize("NFC", s).strip() if s else s
EN_BOOK, UR_BOOK, RPF_BOOK = "Practical Laws of Islam", "استفتاآت کے جوابات", "The Rules on Prayer & Fasting 2023"
EN_URL = "https://www.leader.ir/en/book/32/Practical-Laws-of-Islam?sn={}"
UR_URL = "https://www.leader.ir/ur/book/106/1?sn={}"
RPF_URL = "https://www.leader.ir/en/book/241?sn={}"

# App-written subject labels (explanations, not rulings).
SUBJECT = {
    337: "Abandoning or belittling prayer", 348: "How much of the prayer must fall within its time", 350: "True dawn and false dawn",
    358: "Relying on announced prayer times", 360: "Praying the second of two prayers first", 361: "The end of ʿaṣr time and shar‘ī midnight",
    363: "Finding the qiblah with a pole's shadow or a compass", 364: "Praying when the qiblah cannot be determined in battle",
    366: "When all four directions are equally likely", 382: "Praying on usurped land on a prayer mat",
    372: "The gap between a man and a woman praying", 386: "Praying in a boat when the time would otherwise run out", 723: "Bus passengers asking the driver to stop for prayer",
    384: "Congregational prayer in a ḥusayniyyah next to a masjid", 428: "Discovering najāsah after or during the prayer",
    435: "How much a woman covers in prayer", 440: "Men wearing a gold ring in prayer", 443: "Men wearing gold for a short time",
    429: "Leather from an animal whose slaughter is doubtful", 439: "A cat's hair or saliva on one's clothes",
    454: "The third testimony in adhān and iqāmah", 456: "Reciting quietly in the loud prayers", 469: "Women reciting aloud",
    473: "Reciting a complete surah after al-Fātiḥah", 465: "Pronouncing the words of the prayer correctly",
    481: "Saying al-tasbīḥāt al-arbaʿah once", 455: "Waiting to pray standing when unable to stand early in the time",
    485: "The obligatory dhikr of rukūʿ and sajdah", 489: "A turbah with a stain that blocks the forehead",
    342: "Stillness during recommended dhikrs", 487: "Sajdah on cement or concrete tiles", 493: "Sajdah on marble",
    498: "Hearing a sajdah verse from a radio or recording", 503: "Laughing during the prayer", 501: "Saying “āmīn” in a Sunni congregation",
    510: "Replying to a salām after a delay", 531: "Order and number of many missed prayers", 536: "Working out how many prayers were missed",
    540: "Which son makes up the parents' prayers", 563: "A follower reciting in the quiet congregational prayers",
    594: "When a woman may lead congregational prayer", 574: "An imam standing higher than the followers",
    577: "Joining the congregation in the third rakʿah without reciting", 607: "Not attending Friday prayer for lack of concern",
    605: "Friday prayer as an alternative obligation", 622: "Praying Friday prayer individually", 629: "Praying ẓuhr and ʿaṣr early when unable to attend Friday prayer",
    631: "The status of the two ʿĪd prayers and Friday prayer", 707: "What āyāt prayer is and what makes it obligatory",
    637: "Which prayers a traveller shortens", 638: "The eight conditions for shortening the prayer", 674: "The tarakhkhuṣ limit",
    671: "Not knowing whether one will stay ten days", 641: "Pilots who fly beyond the shar‘ī distance for work",
    # Phase 4a
    514: "Doubting the qunūt in the third rakʿah", 515: "Doubts about the parts of a nāfilah prayer",
    516: "What an excessive doubter does when a doubt arises", 517: "Doubting, years later, that past worship was valid",
    518: "Inadvertent mistakes in the prayer", 519: "A forgotten rakʿah remembered in the last rakʿah",
    520: "How many rakʿahs of ṣalāt al-iḥtiyāṭ are due", 521: "Mispronouncing a word of a dhikr, verse or qunūt",
    # Phase 5: fasting
    741: "A pregnant woman unsure whether fasting will harm the baby", 743: "A breastfeeding mother whose milk may dry up",
    744: "A doctor who is not trustworthy", 749: "Parents who fast although it aggravates their illness", 750: "A doctor's order not to fast for life",
    751: "Obeying a doctor's order not to fast", 753: "Diabetics and fasting", 754: "Deciding to break the fast, then changing one's mind",
    755: "Bleeding in the mouth", 756: "Smoking while fasting", 757: "Tobacco placed under the tongue", 758: "An asthma spray",
    759: "Bleeding gums and saliva", 760: "Swallowing food left between the teeth by mistake", 761: "Bleeding gums and pouring water over the head",
    763: "Injections while fasting", 764: "Taking pills for high blood pressure", 765: "Taking tablets", 766: "Intercourse with one's wife in Ramadan",
    769: "Fasting while junub without knowing the ruling", 772: "Becoming junub on purpose at night", 779: "Forgetting the ghusl of janābah",
    780: "Breaking the fast by ḥarām means", 782: "An emission caused by excitement", 790: "Breaking the fast repeatedly in one day",
    793: "Being forced to eat, or having one's head forced under water", 794: "Breaking the fast before the tarakhkhuṣ point", 796: "Dust at work",
    799: "Qaḍāʾ delayed for several years", 803: "The order of qaḍāʾ and kaffārah", 809: "Not knowing that qaḍāʾ is due before the next Ramadan",
    813: "Invalidating the fast out of ignorance of the ruling", 831: "Sighting the crescent through binoculars or a telescope",
    832: "Radio and television announcements of Shawwāl", 833: "The first of Ramadan or Shawwāl not established", 834: "Sameness of horizon",
    836: "Cities whose horizons differ", 839: "A mujtahid's own certainty of the new moon", 840: "A decree announcing ʿĪd",
    841: "A very thin crescent on the evening of ʿĪd", 844: "How Ramadan begins and ends",
}
# Existing ids kept so saved bookmarks still resolve.
KEEP_ID = {363: "qiblaeffortqa", 366: "qiblanomeansqa", 485: "rukusajdahdhikrqa"}
# Urdu says "بنابر احتیاط" / "احتیاط یہ ہے" (caution) where the English and the Rules say "obligatory caution".
UR_LESS_SPECIFIC = {364, 366, 455}
# The English answer itself says only "based on caution" where the Rules say "obligatory caution".
EN_LESS_SPECIFIC = {519}

def split_qa(q, a, marker):
    """Questions with sub-items: the parser puts them at the start of the answer, before a line 'A:' / 'ج:'."""
    m = re.search(rf"\n{marker}\s*:\s*", a)
    if m:
        return q + "\n" + a[:m.start()].strip(), a[m.end():].strip()
    return q, a

def qa_unit(q, lang):
    """The extracted (question, answer) source unit: EN Q n or UR س n, sub-questions moved into
    the question, footnotes dropped (markers and the section's footnote text are not part of the answer)."""
    if lang == "en":
        eq, ea = split_qa(*E[q], "A")
        eq, ea = nfc(eq), nfc(ea)
        if q == 439: ea = ea.split("\n1. Except for cases")[0]      # section footnote, belongs to Q 428's marker
        if q == 428: ea = ea.replace("during the prayer1,", "during the prayer,")  # <sup>1</sup> footnote marker
        return eq, ea
    uq, ua = split_qa(*U[q], "ج")
    if q == 758: ua = ua.replace("دن(1) کے", "دن کے")   # footnote marker "(1)" (a superscript on the live page)
    return nfc(uq), nfc(ua)

def infer_basis(t):
    t = t.strip()
    if re.match(r"^(By obligatory caution|According to the obligatory caution|It is an obligatory caution|It is based on obligatory caution)", t): return "ihtiyat_wajib"
    if re.match(r"^(According to mustaḥabb caution|It is a mustaḥabb caution)", t): return "ihtiyat_mustahab"
    if re.match(r"^(It is a caution|According to caution|By caution)", t): return "ihtiyat_unspecified"
    return "fatwa"

def auto_note(t, basis):
    body = t if basis == "fatwa" else t[40:]
    notes = []
    if re.search(r"obligatory (precaution|caution)", body): notes.append("Part of this answer is stated as an obligatory caution; see the wording.")
    if re.search(r"mustaḥabb caution|recommended precaution", body): notes.append("Part of this answer is stated as a recommended (mustaḥabb) caution; see the wording.")
    if re.search(r"\b(it is a caution|based on caution|is based on caution|as per caution|although it is a caution)\b", body, re.I):
        notes.append("Part of this answer says 'caution' without stating whether it is obligatory or recommended (decision P5).")
    return notes

def sec_of(q):
    i = next(k for k, s in enumerate(EN_SEC) if q in s["qs"])
    return EN_SEC[i]["sn"], UR_SEC[i]["sn"]

def rpf_cite(n):
    return {"title": RPF_BOOK, "reference": f"{n}.", "url": RPF_URL.format(RPF[n]["sn"])}

RULINGS, DIFFER, PLACE = [], [], []
for q, topic, ns, verdict in PICKS:
    en_sn, ur_sn = sec_of(q)
    eq, ea = qa_unit(q, "en")
    if verdict == "differ":
        DIFFER.append((q, topic, ns)); continue
    u = UR.get(q)
    e = {"marjaId": "khamenei", "format": "qa", "question": {"en": eq}, "text": {"en": ea}}
    if u:
        e["question"]["ur"], e["text"]["ur"] = qa_unit(u, "ur")
    b = infer_basis(ea)
    e["basis"] = b
    e["source"] = {"title": EN_BOOK, "reference": f"Q {q}", "url": EN_URL.format(en_sn)}
    if u: e["urSource"] = {"title": UR_BOOK, "reference": f"س {u}", "url": UR_URL.format(ur_sn)}
    e["verification"] = "A"
    if not u:
        e["urduNote"] = "The Urdu edition of the Q&A book has no counterpart to this question in the same section, so only the English is shown (decision R1)."
    cites = " and ".join(f"Ruling {n}" for n in ns)
    notes = [f"Supplementary Q&A entry (decision P13/rule R7), quoted from Khamenei's Q&A book under its own number — not a translation of {cites} of The Rules on Prayer & Fasting 2023, with which it was compared and agrees."]
    if q in EN_LESS_SPECIFIC:
        notes.append("Where this answer (in English and in Urdu: احتیاط یہ ہے) says the made-up tashahhud is 'based on caution', the Rules (397, 402) say 'by obligatory caution'; it is less specific, not different, so it is shown.")
    if q in UR_LESS_SPECIFIC:
        notes.append("The Urdu edition's answer says only 'by caution' (احتیاط) where the English answer and the Rules book say 'obligatory caution'; it is less specific, not different, so it is shown.")
    notes += auto_note(ea, b)
    e["note"] = " ".join(notes)
    rid = KEEP_ID.get(q, f"khqa{q}")
    RULINGS.append({"id": rid, "topicId": topic, "subject": {"en": SUBJECT[q]},
                    "supplementary": {"marjaId": "khamenei", "agreesWith": [rpf_cite(n) for n in ns]},
                    "rulings": [e]})

def ts(obj):
    body = json.dumps(obj, ensure_ascii=False, indent=2)
    return re.sub(r'^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":', r"\1\2:", body, flags=re.M)

from holds import apply_holds
apply_holds(RULINGS)
SAWM_TOPICS = {"sawmwho", "sawmexempt", "sawmniyyah", "sawmmubtilat", "sawmjanabah", "sawmtimes", "sawmkaffarah", "sawmonlyqada", "sawmqada", "sawmtravel", "sawmmonth", "sawmtypes", "zakatfitrah"}
SALAT_RULINGS = [r for r in RULINGS if r["topicId"] not in SAWM_TOPICS]
SAWM_RULINGS = [r for r in RULINGS if r["topicId"] in SAWM_TOPICS]
if OUT:
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("""// Salat — Khamenei's Q&A book as supplementary entries (decision P13 / rule R7).
//
// GENERATED, do not hand-edit the quoted strings: every question/answer was copied by
// script from leader.ir — English "Practical Laws of Islam" (book 32) and Urdu
// "استفتاآت کے جوابات" (book 106), Prayer chapter — and checked against the live section
// page on 2026-10-07. Each entry is shown only to Khamenei's followers, only where it
// agrees with the cited ruling(s) of The Rules on Prayer & Fasting 2023 (`supplementary.
// agreesWith`), and never as a translation of that ruling. Q&As that differ are listed in
// wajibat_progress_log.md and not shown.
import type { Ruling } from "../types";

export const SALAT_QA_RULINGS: Ruling[] = """ + ts(SALAT_RULINGS) + ";\n")
if OUT_SAWM:
    with open(OUT_SAWM, "w", encoding="utf-8", newline="\n") as f:
        f.write("""// Sawm — Khamenei's Q&A book as supplementary entries (decision P13 / rule R7), Phase 5.
//
// GENERATED, do not hand-edit the quoted strings: every question/answer was copied by
// script from leader.ir — English "Practical Laws of Islam" (book 32) and Urdu
// "استفتاآت کے جوابات" (book 106), Fasting chapter (English Q 741-846, Urdu س 745-850) — and
// checked against the live section pages (verify_live_qa.py). Each entry is shown only to
// Khamenei's followers, only where it agrees with the cited ruling(s) of The Rules on Prayer
// & Fasting 2023 (`supplementary.agreesWith`), and never as a translation of that ruling.
import type { Ruling } from "../types";

export const SAWM_QA_RULINGS: Ruling[] = """ + ts(SAWM_RULINGS) + ";\n")

if OUT:
    json.dump({"differ": DIFFER, "ids": {r["id"]: (r["topicId"], [c["reference"] for c in r["supplementary"]["agreesWith"]]) for r in RULINGS}},
              open(os.path.join(TMP, "kqa_meta.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    from collections import Counter
    c = Counter(r["topicId"] for r in RULINGS); cu = Counter(r["topicId"] for r in RULINGS if r["rulings"][0]["text"].get("ur"))
    print("entries", len(RULINGS), "with urdu", sum(cu.values()), "differ", DIFFER)
    for t in sorted(c): print(t, c[t], "urdu", cu[t])
