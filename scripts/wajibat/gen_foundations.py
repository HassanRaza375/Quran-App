# Generates app/data/wajibat/rulings/foundations.ts by cutting verbatim
# excerpts out of the downloaded official pages. Every excerpt is asserted
# to exist in its source file — nothing is retyped by hand.
import json, re, sys, os
from src import SIS_UR

from paths import SRC as HERE  # downloaded sources (README.md)
OUT = sys.argv[1]

def load(name):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return f.read()

FILES = {k: load(v) for k, v in {
    "sis_en_taqlid": "sis_en_taqlid.txt",
    "sis_ur_taqlid": "sis_ur_taqlid.txt",
    "sis_en_2355": "p2355.txt",
    "sis_ur_muamalat": "sis_ur_muamalat.txt",
    "sis_en_2171": "p2171.txt",
    "sis_ur_3632": "ur/u3632.txt",
    "kh_en": "kh_en_taqlid.txt",
    "kh_ur": "kh_ur_full.txt",
}.items()}

def clean(s):
    s = re.sub(r"\[\d+\]", "", s)           # footnote markers only; translator glosses [i.e. ...] stay
    s = re.sub(r"[ \t]+", " ", s)
    s = "\n".join(line.strip() for line in s.split("\n"))
    return s.strip()

def cut(fkey, start, end):
    """Verbatim excerpt from the first `start` through the end of the first `end` after it."""
    text = FILES[fkey]
    i = text.find(start)
    assert i >= 0, f"start not found in {fkey}: {start[:60]}"
    j = text.find(end, i)
    assert j >= 0, f"end not found in {fkey}: {end[:60]}"
    return clean(text[i:j + len(end)])

def qa(fkey, qlabel):
    """Q&A pair: line starting with qlabel (e.g. 'Q 2:' / 'س2:') and the following answer line."""
    lines = FILES[fkey].split("\n")
    for n, line in enumerate(lines):
        if line.startswith(qlabel):
            q = line[len(qlabel):].strip()
            a = lines[n + 1]
            a = re.sub(r"^(A:|ج\s*:)\s*", "", a).strip()
            # multi-line answers (numbered lists) continue until the next question/heading
            k = n + 2
            while k < len(lines) and not re.match(r"^(Q ?\d|س ?\d|\s)", lines[k]) and lines[k].strip():
                a += "\n" + lines[k].strip()
                k += 1
            return clean(q), clean(a)
    raise AssertionError(f"{qlabel} not found in {fkey}")

SIS_EN_BOOK = "Islamic Laws (4th edition)"
SIS_UR_BOOK = "توضیح المسائل"
KH_EN_BOOK = "Practical Laws of Islam"
KH_UR_BOOK = "استفتاآت کے جوابات"
SIS_EN_TAQLID = "https://www.sistani.org/english/book/48/2117/"
SIS_UR_TAQLID = "https://www.sistani.org/urdu/book/61/3332/"
SIS_EN_HAJR = "https://www.sistani.org/english/book/48/2355/"
SIS_UR_MUAMALAT = "https://www.sistani.org/urdu/book/61/3648/"
SIS_EN_HAYD = "https://www.sistani.org/english/book/48/2171/"
SIS_UR_HAYD = "https://www.sistani.org/urdu/book/61/3632/"
KH_EN_OPTIONS = "https://www.leader.ir/en/book/32/1?sn=5238"
KH_EN_CONDITIONS = "https://www.leader.ir/en/book/32/1?sn=5239"
KH_EN_TEACHING = "https://www.leader.ir/en/book/32/1?sn=5204"
KH_EN_MATURITY = "https://www.leader.ir/en/book/32/1?sn=5232"
KH_UR_OPTIONS = "https://www.leader.ir/ur/book/106/1?sn=11366"
KH_UR_CONDITIONS = "https://www.leader.ir/ur/book/106/1?sn=11367"
KH_UR_TEACHING = "https://www.leader.ir/ur/book/106/1?sn=23170"
KH_UR_MATURITY = "https://www.leader.ir/ur/book/106/1?sn=23199"

def sistani(ref, en, url, ur=None, ur_ref=None, ur_url=None, hukm=None, basis="fatwa", excerpt=False, urdu_note=None, note=None, urdu_lag=False):
    r = {"marjaId": "sistani", "format": "issue"}
    r["text"] = {"en": en, **({"ur": ur} if ur else {})}
    if hukm: r["hukm"] = hukm
    r["basis"] = basis
    if excerpt: r["excerpt"] = True
    r["source"] = {"title": SIS_EN_BOOK, "reference": f"Ruling {ref}", "url": url}
    if ur: r["urSource"] = {"title": SIS_UR_BOOK, "reference": f"مسئلہ ({ur_ref or ref})", "url": ur_url}
    r["verification"] = "A"
    if urdu_lag: r["urduEditionLag"] = True
    if urdu_note: r["urduNote"] = urdu_note
    if note: r["note"] = note
    return r

def khamenei(qn, url, ur_qn=None, ur_url=None, hukm=None, basis="fatwa", note=None, en_label=None, ur_label=None):
    q_en, a_en = qa("kh_en", en_label or f"Q {qn}:")
    r = {"marjaId": "khamenei", "format": "qa"}
    q_ur = a_ur = None
    if ur_qn is not None:
        q_ur, a_ur = qa("kh_ur", ur_label or f"س{ur_qn}:")
    r["question"] = {"en": q_en, **({"ur": q_ur} if q_ur else {})}
    r["text"] = {"en": a_en, **({"ur": a_ur} if a_ur else {})}
    if hukm: r["hukm"] = hukm
    r["basis"] = basis
    r["source"] = {"title": KH_EN_BOOK, "reference": f"Q {qn}", "url": url}
    if ur_qn is not None:
        r["urSource"] = {"title": KH_UR_BOOK, "reference": f"س {ur_qn}", "url": ur_url}
    r["verification"] = "A"
    if note: r["note"] = note
    return r

RULINGS = [
    # ---------------- taqlid ----------------
    {"id": "taqlidoptions", "topicId": "taqlid",
     "subject": {"en": "Ijtihad, taqlid or precaution in religious laws"},
     "rulings": [
        sistani(1,
            cut("sis_en_taqlid", "However, in matters concerning the laws of religion", "it is obligatory for those who are not mujtahids and cannot act on precaution to follow a mujtahid."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "لیکن (مسلّمات دین)", "توان پرواجب ہے کہ کسی مجتہد کی تقلید کریں ۔"),
            ur_url=SIS_UR_TAQLID, hukm="wajib", excerpt=True),
        khamenei(2, KH_EN_OPTIONS, 2, KH_UR_OPTIONS),
     ]},
    {"id": "mujtahidconditions", "topicId": "taqlid",
     "subject": {"en": "Who may be followed in taqlid"},
     "rulings": [
        sistani(2,
            cut("sis_en_taqlid", "Following a jurist in Islamic laws means", "and dutiful (ʿādil), can be followed."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "دینی احکام میں تقلید یعنی", "زندہ اور عادل ہو،"),
            ur_url=SIS_UR_TAQLID, excerpt=True),
        khamenei(9, KH_EN_CONDITIONS, 9, KH_UR_CONDITIONS),
     ]},
    {"id": "meaningofadil", "topicId": "taqlid",
     "subject": {"en": "What 'just' (ʿādil) means"},
     "rulings": [
        sistani(2,
            cut("sis_en_taqlid", "A ‘dutiful’ person is someone who", "they would confirm his good character."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "اور عادل وہ شخص ہے", "اس کی اچھائی کی تصدیق کریں ۔"),
            ur_url=SIS_UR_TAQLID, excerpt=True),
        khamenei(13, KH_EN_CONDITIONS, 13, KH_UR_CONDITIONS),
     ]},
    {"id": "followingthealam", "topicId": "taqlid",
     "subject": {"en": "Following the most learned (aʿlam)"},
     "rulings": [
        sistani(2,
            cut("sis_en_taqlid", "In cases where a person knows, albeit vaguely", "from among all the mujtahids of his time."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "اگریہ بات(اگرچہ اجمالاً)", "سب سے بہتر صلاحیت رکھتا ہو۔"),
            ur_url=SIS_UR_TAQLID, hukm="wajib", excerpt=True),
        khamenei(16, KH_EN_CONDITIONS, 16, KH_UR_CONDITIONS, basis="ihtiyat_unspecified",
            note="The answer says 'it is a caution' without stating whether the caution is obligatory or recommended. The book's glossary does not define an unqualified 'caution', and Q 48 defines only 'obligatory caution', so the type is left unspecified (decision P5)."),
     ]},
    {"id": "identifyingmujtahid", "topicId": "taqlid",
     "subject": {"en": "How a mujtahid or the most learned is identified"},
     "rulings": [
        sistani(3,
            cut("sis_en_taqlid", "A mujtahid or the most learned can be identified in one of three ways:", "confirm that someone is a mujtahid or the most learned.\nRuling 4")[:-len("\nRuling 4")],
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "مجتہد اوراعلم کی شناخت تین طریقوں سے ممکن ہے:", "اور ان کی تصدیق سے انسان مطمئن ہو جائے۔"),
            ur_url=SIS_UR_TAQLID),
     ]},
    {"id": "obtainingfatwa", "topicId": "taqlid",
     "subject": {"en": "How a mujtahid's fatwa is obtained"},
     "rulings": [
        sistani(4,
            cut("sis_en_taqlid", "There are four ways to obtain a fatwa", "on condition that one has confidence in the manual being correct."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "کسی مجتہد کافتویٰ حاصل کرنے کے چار طریقے ہیں", "بشرطیکہ اس کتاب کی صحت کے بارے میں اطمینان ہو۔"),
            ur_url=SIS_UR_TAQLID),
     ]},
    {"id": "ihtiyatwajib", "topicId": "taqlid",
     "subject": {"en": "Obligatory precaution (iḥtiyāṭ wājib) and referring to the next most learned"},
     "rulings": [
        sistani(6,
            cut("sis_en_taqlid", "If the most learned mujtahid gives a fatwa on any matter", "or ‘problematic’ (maḥall al‑ishkāl)."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "اگرمجتہد اعلم کوئی فتویٰ دے", "تواس کابھی یہی حکم ہے۔"),
            ur_url=SIS_UR_TAQLID),
        khamenei(8, KH_EN_OPTIONS, 8, KH_UR_OPTIONS),
     ]},
    {"id": "ihtiyatmustahab", "topicId": "taqlid",
     "subject": {"en": "Recommended precaution (iḥtiyāṭ mustaḥabb)"},
     "rulings": [
        sistani(7,
            cut("sis_en_taqlid", "If before or after giving a fatwa on a matter", "This is called ‘recommended precaution’ (al‑iḥtiyāṭ al‑mustaḥabb)."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "اگرمجتہد اعلم کسی مسئلے کے بارے میں فتویٰ دینے کے بعدیااس سے پہلے", "اس قسم کی احتیاط کواحتیاط مستحب کہتے ہیں ۔"),
            ur_url=SIS_UR_TAQLID),
     ]},
    {"id": "deceasedmujtahid", "topicId": "taqlid",
     "subject": {"en": "When the followed mujtahid dies"},
     "rulings": [
        sistani("8*",
            cut("sis_en_taqlid", "If a mujtahid whom a mukallaf is following", "it does not mean acting according to his instructions."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "اگروہ مجتہد جس کی ایک شخص تقلید کرتاہے فوت ہوجائے", "نہ کہ اس کے حکم کے مطابق عمل کرنا۔"),
            ur_ref=8, ur_url=SIS_UR_TAQLID,
            note="Marked * in the 4th edition (revised to the 36th Persian edition). The Urdu text was compared and matches in substance."),
     ]},
    {"id": "learningrulings", "topicId": "taqlid",
     "subject": {"en": "Learning the rulings one needs"},
     "rulings": [
        sistani(9,
            cut("sis_en_taqlid", "It is necessary for a mukallaf to learn those rulings", "‘Sinning’ means not performing obligatory acts or performing unlawful acts."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "مکلف کےلئے ضروری ہے کہ جن مسائل", "تو اسے سیکھنا ضروری ہے۔"),
            ur_url=SIS_UR_TAQLID, hukm="wajib"),
        khamenei(6, KH_EN_OPTIONS, 6, KH_UR_OPTIONS),
     ]},
    {"id": "actionswithouttaqlid", "topicId": "taqlid",
     "subject": {"en": "Acts performed without following a mujtahid"},
     "rulings": [
        sistani("12*",
            cut("sis_en_taqlid", "If for some time a mukallaf performs his actions without following a mujtahid", "apart from a few cases that are mentioned in Minhāj al-Ṣāliḥīn."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "اگرکوئی مکلف ایک مدت تک کسی کی تقلید کئے بغیر", "سوائے ان مقامات کے جن کاذکر منہاج الصالحین میں ہواہے۔"),
            ur_ref=12, ur_url=SIS_UR_TAQLID, excerpt=True,
            note="Marked * in the 4th edition (revised to the 36th Persian edition). The Urdu text was compared and matches in substance."),
        khamenei(7, KH_EN_OPTIONS, 7, KH_UR_OPTIONS, ur_label="س 7:"),
     ]},
    # ---------------- ahkam ----------------
    {"id": "mustahabbatrajaan", "topicId": "ahkam",
     "subject": {"en": "Recommended and disapproved acts done 'in hope' (rajāʾan)"},
     "rulings": [
        sistani("12*",
            cut("sis_en_taqlid", "It is worth mentioning that with regard to many of the recommended acts", "i.e. in the hope that their avoidance is desired by Allah."),
            SIS_EN_TAQLID, excerpt=True,
            urdu_note="This paragraph is not in the Urdu توضیح المسائل's مسئلہ ۱۲, so it is shown in English only."),
     ]},
    # ---------------- usul al-din ----------------
    {"id": "usulnottaqlid", "topicId": "usuldin",
     "subject": {"en": "Belief in the fundamentals (uṣūl al-dīn): certainty, not taqlid"},
     "rulings": [
        sistani(1,
            cut("sis_en_taqlid", "A Muslim’s belief in the fundamentals of religion", "all the laws (aḥkām) of Islam and the faith are applicable to him."),
            SIS_EN_TAQLID,
            ur=cut("sis_ur_taqlid", "ہرمسلمان کے لئے اصول دین", "ایمان اور اسلام کے تمام احکام جاری ہوں گے،"),
            ur_url=SIS_UR_TAQLID, excerpt=True),
        khamenei(1312, KH_EN_TEACHING, 1321, KH_UR_TEACHING, en_label="Q1312.", ur_label="س1321:"),
     ]},
    # ---------------- bulugh ----------------
    {"id": "bulughsigns", "topicId": "bulugh",
     "subject": {"en": "Signs of reaching bulugh (age of legal responsibility)"},
     "rulings": [
        sistani("2270*",
            cut("sis_en_2355", "The sign of having reached the age of legal responsibility (bulūgh) for a girl", "3. completion of fifteen lunar years."),
            SIS_EN_HAJR,
            ur=cut("sis_ur_muamalat", "لڑکی میں بالغ ہونے کی علامت یہ ہے", "عمرکے پندرہ قمری سال پورے کرنا۔"),
            ur_ref=2270, ur_url=SIS_UR_MUAMALAT, excerpt=True,
            note="Marked * in the 4th edition. The Urdu wording of this excerpt was compared and matches; another part of Ruling 2270 (not shown here) differs in the Urdu edition."),
        khamenei(1873, KH_EN_MATURITY, 1889, KH_UR_MATURITY, en_label="Q1873.", ur_label="س 1889:"),
     ]},
    {"id": "bulughlunaryears", "topicId": "bulugh",
     "subject": {"en": "Lunar or solar years for the age of bulugh"},
     "rulings": [
        khamenei(1871, KH_EN_MATURITY, 1887, KH_UR_MATURITY, en_label="Q1871.", ur_label="س 1887:"),
     ]},
    {"id": "bulughfacialhair", "topicId": "bulugh",
     "subject": {"en": "Facial hair and other bodily changes as signs of bulugh"},
     "rulings": [
        sistani("2271*",
            cut("sis_en_2355", "The growth of thick hair on the face and above the lips are signs of bulūgh.", "are not signs of bulūgh."),
            SIS_EN_HAJR, urdu_lag=True,
            urdu_note="The Urdu توضیح المسائل (مسئلہ ۲۲۷۱) still has the wording from before the revision, so only the revised English is shown (decision P6)."),
     ]},
    {"id": "bleedingbeforenine", "topicId": "bulugh", "sensitive": True,
     "subject": {"en": "Bleeding before a girl completes nine years"},
     "rulings": [
        sistani(434,
            cut("sis_en_2171", "Bleeding that a girl experiences before the age of nine is not ḥayḍ.", "is not ḥayḍ."),
            SIS_EN_HAYD,
            ur=SIS_UR[434][0],
            ur_url=SIS_UR_HAYD),
        khamenei(1878, KH_EN_MATURITY, 1894, KH_UR_MATURITY, en_label="Q1878.", ur_label="س 1894:"),
     ]},
]

# Rulings whose meaning is carried by a Q&A *question* must keep it; strip the
# helper-only prefixes that qa() leaves on the numbered-dot style labels.
header = """// Foundations (§6.1) rulings — Taqlid, Ahkam, Usul al-Din, Bulugh.
//
// GENERATED from the official texts, do not hand-edit the quoted strings:
// every `text`/`question` below was cut verbatim (by script) from the
// marja's official website as downloaded on 2026-09-25 —
//   Sistani:  sistani.org Islamic Laws 4th ed. (English) / توضیح المسائل (Urdu)
//   Khamenei: leader.ir Practical Laws of Islam (English) / استفتاآت کے جوابات (Urdu)
// Only footnote markers like [3] were removed; the translator's own square-
// bracket glosses are kept. Urdu comes from each marja's official Urdu book
// with its own ruling/Q number (decision R1) — never translated by the app.
// Makarem Shirazi has no entries until his risala is provided (decision P1).
import type { Ruling } from "../types";

export const FOUNDATIONS_RULINGS: Ruling[] = """

sys.stdout.reconfigure(encoding="utf-8")
body = json.dumps(RULINGS, ensure_ascii=False, indent=2)
body = re.sub(r'^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":', r"\1\2:", body, flags=re.M)
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write(header + body + ";\n")
print("rulings:", len(RULINGS), "entries:", sum(len(r["rulings"]) for r in RULINGS))
for r in RULINGS:
    for m in r["rulings"]:
        print(r["id"], m["marjaId"], m["source"]["reference"], "| ur:", m.get("urSource", {}).get("reference"), "|", m["text"]["en"][:50].replace("\n"," "))
