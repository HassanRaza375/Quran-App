# Phase 2 (Taharat) generator. Every ruling / Q&A text is looked up verbatim
# from the downloaded official pages (src.py) — nothing is retyped. Procedure
# step instructions are verbatim excerpts, asserted to be substrings of the
# ruling they cite (the dataset validator re-checks this).
import json, re, sys
from src import SIS_EN, SIS_UR, KH_EN, KH_UR, condition_en, condition_ur
from treatise import KT   # Khamenei's Urdu practical treatise (P19)

sys.stdout.reconfigure(encoding="utf-8")
OUT_RULINGS, OUT_PROCS = sys.argv[1], sys.argv[2]

SIS_EN_BOOK, SIS_UR_BOOK = "Islamic Laws (4th edition)", "توضیح المسائل"
KH_EN_BOOK, KH_UR_BOOK = "Practical Laws of Islam", "استفتاآت کے جوابات"
SIS_UR_PAGE_URL = "https://www.sistani.org/urdu/book/61/{}/"
SIS_EN_PAGE_URL = "https://www.sistani.org/english/book/48/{}/"
KH_EN_SECTIONS = [(69, 87, 5140), (88, 98, 5141), (99, 145, 5142), (146, 165, 5246), (166, 192, 5247), (193, 198, 5248),
                  (199, 214, 5249), (215, 224, 5250), (265, 309, 5252), (312, 336, 5255)]
KH_UR_SECTIONS = [(70, 88, 11374), (89, 99, 11375), (100, 146, 11376), (147, 166, 11377), (167, 193, 11378), (194, 199, 11379),
                  (200, 215, 11380), (216, 225, 11381), (266, 310, 11383), (313, 337, 11386)]

def _sn(n, table):
    for a, b, sn in table:
        if a <= n <= b:
            return sn
    raise AssertionError(f"no section for {n}")

LAG_NOTE = "Marked * (revised) in the 4th edition. The official Urdu توضیح المسائل still has the earlier wording, so only the revised English is shown (decision P6)."
MATCH_NOTE = "Marked * (revised) in the 4th edition. The Urdu text was compared and matches in substance."

def infer_basis(text):
    """Basis from the ruling's own opening words — never guessed beyond them (decision P5 / R3)."""
    t = text.strip()
    if re.match(r"^(Based on obligatory precaution|The obligatory precaution is|According to the obligatory caution|By obligatory caution|It is an obligatory caution|It is necessary, based on obligatory caution)", t):
        return "ihtiyat_wajib"
    if re.match(r"^(The recommended precaution is|Based on recommended precaution)", t):
        return "ihtiyat_mustahab"
    if re.match(r"^(As per caution|It is based on caution|According to caution|Based on caution|As a caution)", t):
        return "ihtiyat_unspecified"
    return "fatwa"

def auto_note(text, basis):
    notes = []
    body = text if basis == "fatwa" else text[40:]
    if re.search(r"obligatory (precaution|caution)", body):
        notes.append("Part of this ruling is stated as an obligatory precaution; see the wording.")
    if re.search(r"recommended precaution|mustaḥabb caution", body):
        notes.append("Part of this ruling is stated as a recommended precaution; see the wording.")
    # unqualified 'caution' (Khamenei's usage) not already labelled
    if re.search(r"\b(as per caution|according to caution|based on caution|as a caution|is a caution|as per the caution)\b", body, re.I):
        notes.append("Part of this answer says 'caution' without stating whether it is obligatory or recommended (decision P5).")
    return " ".join(notes) or None

def S(n=None, *, cond=None, cut=None, urdu="auto", hukm=None, basis=None, note=None, urdu_note=None):
    """Sistani entry. n = ruling number; cond=(page, ordinal_en, ordinal_ur, label) for unnumbered conditions.
    cut=(start, end) takes a verbatim excerpt. urdu: auto | match | lag | none."""
    if cond:
        page, ord_en, ord_ur, label = cond
        en, starred = condition_en(page, ord_en)
        ref, url = label + ("*" if starred else ""), SIS_EN_PAGE_URL.format(page)
        ur = condition_ur(3630, ord_ur) if urdu in ("auto", "match") else None
        ur_ref, ur_url = f"({ord_ur} شرط)", SIS_UR_PAGE_URL.format(3630)
    else:
        en, page, starred = SIS_EN[n]
        ref, url = f"Ruling {n}{'*' if starred else ''}", SIS_EN_PAGE_URL.format(page)
        u = SIS_UR.get(n)
        ur = u[0] if u else None
        ur_ref, ur_url = f"مسئلہ ({n})", SIS_UR_PAGE_URL.format(u[1]) if u else None
    excerpt = False
    if cut:
        a, b = cut
        i = en.find(a); j = en.find(b, i)
        assert i >= 0 and j >= 0, (n, cut)
        en = en[i:j + len(b)]
        excerpt = True
        ur = None if urdu == "auto" else ur  # an English excerpt needs a matching Urdu excerpt: pass urdu=("cut", a, b)
    if isinstance(urdu, tuple):
        _, a, b = urdu
        full = SIS_UR[n][0] if n else ur
        i = full.find(a); j = full.find(b, i)
        assert i >= 0 and j >= 0, (n, urdu)
        ur = full[i:j + len(b)]
        urdu = "match"
    if starred and urdu == "auto":
        raise AssertionError(f"Ruling {n or ref} is revised (*): set urdu='match' or 'lag' after comparing")
    lag = urdu == "lag"
    if urdu in ("lag", "none"):
        ur = None
    r = {"marjaId": "sistani", "format": "issue", "text": {"en": en, **({"ur": ur} if ur else {})}}
    b = basis or infer_basis(en)
    if hukm: r["hukm"] = hukm
    r["basis"] = b
    if excerpt: r["excerpt"] = True
    r["source"] = {"title": SIS_EN_BOOK, "reference": ref, "url": url}
    if ur: r["urSource"] = {"title": SIS_UR_BOOK, "reference": ur_ref, "url": ur_url}
    r["verification"] = "A"
    if lag:
        r["urduEditionLag"] = True
        r["urduNote"] = urdu_note or "The official Urdu edition has the pre-revision wording of this ruling."
    elif urdu_note:
        r["urduNote"] = urdu_note
    notes = [x for x in [note, (LAG_NOTE if lag else MATCH_NOTE) if starred else None, auto_note(en, b)] if x]
    if notes: r["note"] = " ".join(notes)
    return r

def K(n, *, ur=None, hukm=None, basis=None, note=None, cut=None):
    q, a = KH_EN[n]
    un = ur if ur is not None else n + 1
    uq, ua = KH_UR[un]
    if cut:
        i = a.find(cut[0]); j = a.find(cut[1], i); assert i >= 0 and j >= 0, (n, cut)
        a = a[i:j + len(cut[1])]
    r = {"marjaId": "khamenei", "format": "qa", "question": {"en": q, "ur": uq}, "text": {"en": a, "ur": ua}}
    b = basis or infer_basis(a)
    if hukm: r["hukm"] = hukm
    r["basis"] = b
    if cut: r["excerpt"] = True
    r["source"] = {"title": KH_EN_BOOK, "reference": f"Q {n}", "url": f"https://www.leader.ir/en/book/32/1?sn={_sn(n, KH_EN_SECTIONS)}"}
    r["urSource"] = {"title": KH_UR_BOOK, "reference": f"س {un}", "url": f"https://www.leader.ir/ur/book/106/1?sn={_sn(un, KH_UR_SECTIONS)}"}
    r["verification"] = "A"
    notes = [x for x in [note, auto_note(a, b)] if x]
    if notes: r["note"] = " ".join(notes)
    return r

TREATISE_NOTE = "Khamenei's official text for this is in Urdu only: his practical treatise (Risāla-yi Āmūzishī) in its official Urdu translation, with no official English translation (decision P19). Compared with his Q&A, the 2023 Rules and the Persian original (Risāla-yi Āmūzishī): no conflict found."
RULINGS = []
def R(id_, topic, subject, *entries, sensitive=False, differs=False, panel=None):
    r = {"id": id_, "topicId": topic, "subject": {"en": subject}, "rulings": [e for e in entries if e]}
    if differs: r["differsBetweenMaraji"] = True
    if sensitive: r["sensitive"] = True
    if panel: r["panel"] = panel
    RULINGS.append(r)

# ======================= WATER =======================
T = "water"
R("watertypes", T, "Unmixed (muṭlaq) and mixed (muḍāf) water", S(13), K(73))
R("kurrdefinition", T, "What kurr water is", S(14))
R("kurrimpurity", T, "When kurr water becomes impure", S(15))
R("kurrdoubt", T, "Doubt whether water is still kurr", S(21), K(74))
R("qalilwater", T, "Qalīl (little) water and impurity", S(24))
R("flowingwater", T, "Flowing water", S(27), K(77))
R("tapwater", T, "Tap and shower water", S(33), K(72))
R("rainwater", T, "Rainwater as a purifier", S(35, urdu="lag"))
R("mixedwateruse", T, "Using mixed water for purification, wuḍūʾ and ghusl", S(44))
R("waterchangedbyimpurity", T, "Water whose smell, colour or taste changes", S(49))
R("waterpuritydoubt", T, "Doubt whether water is pure", S(52))

# ======================= ISTINJA / TOILET =======================
T = "istinja"
R("coveringprivateparts", T, "Covering the private parts", S(53, hukm="wajib"), K(96))
R("toiletqibla", T, "Facing the qibla in the toilet", S(55), K(93))
R("toiletprohibitedplaces", T, "Places where relieving oneself is unlawful", S(60, hukm="haram"))
R("anuswateronly", T, "When the anus can be purified with water only", S(61))
R("urinaryoutlet", T, "Purifying the urinary outlet", S(62), K(97), differs=True)
R("anuswithwater", T, "Purifying the anus with water", S(63), K(98))
R("anuswithstone", T, "Purifying the anus with stone, earth or cloth", S(64))
R("anusthreetimes", T, "How many times with stone or cloth", S(65))
R("istinjadoubt", T, "Doubt whether one has purified", S(67))
R("istibra", T, "Istibrāʾ (clearing the urethra) for men", S(69, hukm="mustahab"), K(90))
R("dischargesmadhi", T, "Madhī, wadhī and wadī discharges", S(70), K(92))
R("istibradoubt", T, "Discharge after doubting istibrāʾ", S(71), K(91))
R("istibrawomen", T, "Discharge for women after urinating", S(74))

# ======================= NAJASAT =======================
T = "najasat"
R("tennajasat", T, "The ten intrinsically impure things", S(80))
R("urinefaeces", T, "Urine and faeces", S(81))
R("birddroppings", T, "Droppings of birds whose meat is unlawful", S(82), K(278))
R("semen", T, "Semen", S(84), K(276))
R("corpse", T, "Corpses and carcasses", S(85))
R("deadskin", T, "Skin that peels off the body", S(88), K(271))
R("importedleather", T, "Leather and meat of unknown slaughter", S(92), K(275))
R("blood", T, "Blood", S(93), K(265))
R("dogpig", T, "Dogs and pigs", S(102), K(273))
R("wineintoxicants", T, "Wine and other intoxicants", S(108), K(300), differs=True)
R("alcohol", T, "Industrial and medicinal alcohol", S(109, urdu="lag"), K(304))
R("establishingimpurity", T, "How impurity is established", S(115))
R("purityimpuritydoubt", T, "Doubt whether something is pure or impure", S(117), K(284))
R("impuritytransfer", T, "How impurity transfers (wetness)", S(119), K(282))
R("wetnessdoubt", T, "Doubt whether there was wetness", S(120), K(289))
R("quranimpure", T, "Making the Qur'an impure", S(129, hukm="haram"))
# Decision P8: purity of persons — own collapsed panel, quoted exactly, no app commentary.
PP = dict(panel="persons")
R("personsnotbelieving", T, "Not believing in Allah or His oneness",
  S(103, cut=("A person who does not believe in Allah", "His oneness is impure."), urdu=("cut", "کافریعنی وہ شخص", "نجس ہے")), **PP)
R("personsghulat", T, "Ghulāt, Khawārij and Nawāṣib",
  S(103, cut=("Similarly, the following are impure: extremists", "towards the Infallible Imams (ʿA))."), urdu=("cut", "اوراسی طرح غلات", "بھی نجس ہیں ۔")), K(316), **PP)
R("personsrejecting", T, "Rejecting prophethood or an indispensable of the religion",
  S(103, cut=("The same applies to a person who rejects prophethood", "albeit in a general manner."), urdu=("cut", "اسی طرح وہ شخص جوکسی نبی کی نبوت", "خواہ اجمالی طور سے ہی کیوں نہ ہو")), K(335), **PP)
R("personsahlalkitab", T, "The People of the Book",
  S(103, cut=("As for the People of the Book", "they are ruled to be pure."), urdu=("cut", "لیکن اھل کتاب", "پاک ہیں ۔")), K(312), **PP)
R("personsnonkitabi", T, "A disbeliever who is not of the People of the Book",
  S(104, urdu="lag"), K(320), **PP)
R("personschild", T, "Children of disbelievers", S(105, urdu="lag"), **PP)
R("personsunknown", T, "Someone not known to be Muslim", S(106), K(298), **PP)
R("personsabusingimams", T, "Abusing the Infallible Imams", S(107, urdu="lag"), **PP)
R("eatingimpure", T, "Eating or drinking impure things", S(135, hukm="haram"))

# ======================= MUTAHHIRAT =======================
T = "mutahhirat"
R("twelvemutahhirat", T, "The twelve purifiers (muṭahhirāt)", S(142))
R("waterconditions", T, "Conditions for water to purify", S(143))
R("utensilwashing", T, "Washing an impure utensil", S(144))
R("immersionkurr", T, "Purifying in kurr or flowing water", S(153))
R("urinequalilwater", T, "Washing something impure with urine using qalīl water", S(154))
R("otherimpurityqalil", T, "Washing other impurities with qalīl water", S(156))
R("intrinsicremoval", T, "The intrinsic impurity must be removed", S(164), K(267))
R("washingmachine", T, "Washing clothes in a washing machine", K(291))
R("earthpurifies", T, "Earth purifies the soles of the feet and shoes",
  S(177, urdu="none", urdu_note="The official Urdu مسئلہ ۱۷۷ omits the English ruling's allowance for moisture on the earth that does not spread, so only the English is shown (decision P10)."), K(79))
R("asphalt", T, "Walking on asphalt or wooden floors", S(178, urdu="lag"), K(80))
R("sunpurifies", T, "The sun as a purifier", S(185), K(81))
R("istihala", T, "Transformation (istiḥālah)", S(189), K(85))
R("islampurifies", T, "Becoming Muslim", S(205))
R("purityestablished", T, "How purity is established", S(221))
R("goldsilverutensils", T, "Gold and silver utensils", S(227, hukm="haram"))

# ======================= WUDU =======================
T = "wudu"
R("wuduobligatoryacts", T, "The obligatory acts of wuḍūʾ", S(235, hukm="wajib"))
R("wuduface", T, "The area of the face to be washed", S(236))
R("wududirection", T, "Washing from top to bottom", S(242))
R("wuduarms", T, "Washing the arms", S(244))
R("wuduwashingcount", T, "How many times to wash", S(247), K(101), differs=True)
R("wuduhead", T, "Wiping the head", S(248))
R("wuduheadarea", T, "The area of the head to be wiped", S(249), K(124))
R("wudufeet", T, "Wiping the feet", S(251), K(104))
R("wudusocks", T, "Wiping over socks or shoes", S(258), K(119))
R("wuduimmersive", T, "Immersive wuḍūʾ", S(260), K(102))
R("wuduwaterimpure", T, "Wuḍūʾ with impure or mixed water", S(264))
R("wuduusurpedwater", T, "Wuḍūʾ with usurped water", S(266))
R("wuduintention", T, "The intention (niyyah) of wuḍūʾ", S(281, urdu=("cut", "وضوکی نیت", "توکافی ہے۔")), K(121))
R("wudusequence", T, "Sequence (tartīb) of wuḍūʾ", S(cond=(8295, "seventh", "ساتویں", "Conditions of wuḍūʾ — 7th condition"), urdu="lag"))
R("wudusuccession", T, "Close succession (muwālāh)", S(282), K(126))
R("wuduobstruction", T, "Obstructions such as nail polish", S(cond=(8295, "eleventh", "گیارہویں", "Conditions of wuḍūʾ — 11th condition")), K(113))
R("wududoubtvoid", T, "Doubt whether wuḍūʾ has become void", S(299), K(122))
R("wududoubtperformed", T, "Doubt whether wuḍūʾ was performed", S(300), KT("doubtperformed", note=TREATISE_NOTE))
R("wuduunaware", T, "Finding out afterwards that one's wuḍūʾ was invalid", S(1251), KT("unaware", note=TREATISE_NOTE + " Compared with his Q&A, Q 136 (س 137): the same ruling."))
R("wuduexcessive", T, "A person who doubts excessively about wuḍūʾ", S(298), KT("excessive", note=TREATISE_NOTE))
R("wududoubtafterprayer", T, "Doubt after prayers about wuḍūʾ", S(303))
R("wududoubtduring", T, "Doubt during prayers whether wuḍūʾ was performed", S(304))
R("wuduorderunknown", T, "Knowing both wuḍūʾ and an invalidator, not which came first", S(301))
R("wuduvoidtime", T, "Finding wuḍūʾ void after prayers, not knowing when", S(305))
R("wuduwhenwajib", T, "When wuḍūʾ is obligatory", S(315, hukm="wajib"))
R("touchingquran", T, "Touching the writing of the Qur'an", S(316), K(153))
R("wuduinvalidators", T, "Things that invalidate wuḍūʾ", S(322), KT("invalidators", note=TREATISE_NOTE + " His English books and his Q&A have no list of invalidators; his Q&A (Q 92, س 93) agrees that madhī, wadhī and wadī do not invalidate wuḍūʾ."))
R("jabirauncovered", T, "Wounds and fractures (jabīrah): uncovered", S(324), K(134))
R("jabiracovered", T, "Wounds and fractures (jabīrah): covered", S(327))

# ======================= GHUSL =======================
T = "ghusl"
R("becomingjunub", T, "How one becomes junub", S(344), K(169))
R("semensigns", T, "Signs of semen", S(346), K(176))
R("womenjanabah", T, "Janābah for women", K(170))
R("junubunlawful", T, "Things unlawful for a junub", S(354, hukm="haram"), K(198))
R("ghusljanabahobligatory", T, "When ghusl for janābah is obligatory", S(356, hukm="wajib"))
R("ghusltypes", T, "Sequential and immersive ghusl", S(359))
R("ghusltartibi", T, "Sequential (tartībī) ghusl", S(360), K(190), differs=True)
R("ghuslirtimasi", T, "Instantaneous immersive ghusl", S(366))
R("ghuslgradual", T, "Gradual immersive ghusl", S(367))
R("ghuslwholebody", T, "Washing the whole outer body", S(373), K(188))
R("ghuslobstruction", T, "Obstructions to water in ghusl", S(376), K(177))
R("ghuslhair", T, "Hair in ghusl", S(378), K(192), differs=True)
R("ghusldoubt", T, "Doubt about ghusl", S(383, urdu="lag"), K(196))
R("ghusleventduring", T, "Something invalidating wuḍūʾ during ghusl", S(384), K(184))
R("ghuslseveral", T, "Several obligatory ghusls at once", S(387), K(186))
R("ghuslreplaceswudu", T, "Ghusl for janābah and wuḍūʾ", S(389), K(187))
R("ghuslmassmayyit", T, "Ghusl for touching a corpse (mass al-mayyit)", S(510))

# ======================= HAYD / ISTIHADA / NIFAS (sensitive, collapsed) =======================
T = "haydistihadanifas"
W = dict(sensitive=True)
R("istihadablood", T, "Signs of istiḥāḍah blood", S(390), **W)
R("istihadatypes", T, "The three types of istiḥāḍah", S(391), **W)
R("istihadaslight", T, "Slight istiḥāḍah", S(392), **W)
R("istihadamedium", T, "Medium istiḥāḍah", S(393, urdu="match"), **W)
R("istihadaexcessive", T, "Excessive istiḥāḍah", S(394, urdu="lag"), **W)
R("haydblood", T, "Signs of ḥayḍ blood", S(432), **W)
R("haydduration", T, "Minimum and maximum duration of ḥayḍ", S(438), K(220), **W)
R("haydunlawful", T, "Things unlawful for a ḥāʾiḍ", S(448, hukm="haram"), K(221), **W)
R("haydghusl", T, "Ghusl after ḥayḍ", S(456), **W)
R("haydprayers", T, "Prayers missed during ḥayḍ", S(459), **W)
R("haydfast", T, "Ḥayḍ during an obligatory fast", K(216), **W)
R("haydpostponing", T, "Postponing ḥayḍ with medication", K(218), **W)
R("haydpregnancy", T, "Bleeding during pregnancy", S(435), K(219), **W)
R("haydcategories", T, "The six categories of women in ḥayḍ", S(468), **W)
R("haydspotting", T, "Spotting after becoming clean", K(217), **W)
R("haydcontraceptive", T, "Spotting with contraceptive pills", K(224), **W)
R("nifasdefinition", T, "What nifās is", S(497), K(222), **W)
R("nifasduration", T, "Duration of nifās", S(500), **W)
R("nifasrulings", T, "Rulings that apply in nifās", S(502), **W)
R("menopause", T, "Bleeding after menopause", S(433), K(223), **W)

# ======================= TAYAMMUM =======================
T = "tayammum"
R("tayammumnoaccess", T, "No access to water", S(653))
R("tayammumharm", T, "When using water is harmful", S(658), K(212))
R("tayammumhardship", T, "Hardship in using water", S(662), K(214))
R("tayammumshorttime", T, "Shortage of time", S(667), K(213))
R("tayammumsurfaces", T, "What tayammum may be performed on", S(673), K(209))
R("tayammumgypsum", T, "Gypsum and limestone", S(674), K(199))
R("tayammumpure", T, "The surface must be pure", S(681), K(210))
R("tayammumobligatory", T, "The obligatory acts of tayammum", S(689, hukm="wajib"), K(208))
R("tayammumcomplete", T, "Wiping the whole forehead and hands", S(691))
R("tayammumdirection", T, "Direction and succession in tayammum", S(693))
R("tayammumexcuseends", T, "When the excuse ends", S(708), K(203))
R("tayammuminvalidators", T, "What invalidates tayammum", S(709), K(200))
R("tayammuminsteadofghusl", T, "Tayammum in place of ghusl and wuḍūʾ", S(712, urdu="lag"), K(201))
R("tayammumneither", T, "When neither wuḍūʾ nor tayammum is possible", K(211))

# ======================= PROCEDURES =======================
PROCS = []
def entry(rid, marja):
    r = next(x for x in RULINGS if x["id"] == rid)
    return next(e for e in r["rulings"] if e["marjaId"] == marja)

def step(order, title, rid, marja, a, b, hukm=None, note=None):
    text = entry(rid, marja)["text"]["en"]
    i = text.find(a); j = text.find(b, i)
    assert i >= 0 and j >= 0, (rid, a[:30])
    s = {"id": f"s{order}", "order": order, "title": {"en": title}, "instruction": {"en": text[i:j + len(b)]}, "rulingId": rid}
    if hukm: s["hukm"] = hukm
    if note: s["note"] = note
    return s

def P(id_, topic, marja, title, steps, intro=None):
    p = {"id": id_, "topicId": topic, "marjaId": marja, "title": {"en": title}, "steps": steps}
    PROCS.append(p)

W235 = "Marked wājib because Ruling 235 states: “" + SIS_EN[235][0] + "”"
P("wudusistani", "wudu", "sistani", "How to perform wuḍūʾ", [
    step(1, "Intention", "wuduintention", "sistani", "It is not necessary", "command of Allah the Exalted."),
    step(2, "Wash the face", "wuduface", "sistani", "The length of the face", "tip of the thumb.", hukm="wajib", note=W235),
    step(3, "Wash the right arm", "wuduarms", "sistani", "After washing the face, one must wash his right arm", "tips of the fingers,", hukm="wajib", note=W235),
    step(4, "Wash the left arm", "wuduarms", "sistani", "and he must then proceed to wash his left arm", "in the same way.", hukm="wajib", note=W235),
    step(5, "Wipe the head", "wuduhead", "sistani", "After washing both arms", "remained on his hand.", hukm="wajib", note=W235),
    step(6, "Wipe the feet", "wudufeet", "sistani", "After wiping the head", "raised part in the middle of the foot [before the ankle] will not suffice.", hukm="wajib", note=W235),
    step(7, "Keep the order: right foot before left", "wudusequence", "sistani", "And based on obligatory precaution", "after the right foot."),
])
P("ghusltartibisistani", "ghusl", "sistani", "How to perform sequential (tartībī) ghusl", [
    step(1, "Wash the head and neck", "ghusltartibi", "sistani", "In sequential ghusl, one must", "the entire head and neck"),
    step(2, "Wash the rest of the body", "ghusltartibi", "sistani", "and then the entire body with the intention of ghusl", "then the left."),
])
P("ghuslirtimasisistani", "ghusl", "sistani", "How to perform immersive (irtimāsī) ghusl", [
    step(1, "Go completely under the water with the intention of ghusl", "ghuslirtimasi", "sistani", "In instantaneous immersive ghusl", "with the intention of performing ghusl."),
])
P("tayammumsistani", "tayammum", "sistani", "How to perform tayammum", [
    step(1, "Strike both palms on the surface", "tayammumobligatory", "sistani", "1. striking or placing the palms", "must be done simultaneously;", hukm="wajib"),
    step(2, "Wipe the forehead", "tayammumobligatory", "sistani", "2. wiping the palms of both hands over the entire forehead", "over the eyebrows as well;", hukm="wajib"),
    step(3, "Wipe the backs of the hands", "tayammumobligatory", "sistani", "3. wiping the palm of the left hand", "then the back of the left].", hukm="wajib"),
    step(4, "Intention of attaining proximity to Allah", "tayammumobligatory", "sistani", "It is necessary that tayammum be performed", "with regard to performing wuḍūʾ."),
])
P("tayammumkhamenei", "tayammum", "khamenei", "How to perform tayammum", [
    step(1, "Intention", "tayammumobligatory", "khamenei", "First, one makes the intention.", "the intention."),
    step(2, "Strike both palms and wipe the forehead", "tayammumobligatory", "khamenei", "Then, the entire palms", "upper part of the nose."),
    step(3, "Wipe the backs of the hands", "tayammumobligatory", "khamenei", "Thereafter the left palm", "back of the entire left hand."),
    step(4, "Strike again and wipe the backs of the hands (obligatory caution)", "tayammumobligatory", "khamenei", "Also, based on obligatory caution", "back of the entire left hand."),
])

def ts(obj):
    body = json.dumps(obj, ensure_ascii=False, indent=2)
    return re.sub(r'^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":', r"\1\2:", body, flags=re.M)

HDR = """// GENERATED from the official texts, do not hand-edit the quoted strings:
// every `text`/`question`/`instruction` was looked up verbatim (by script) in
// the marja's official website as downloaded on 2026-09-25 —
//   Sistani:  sistani.org Islamic Laws 4th ed. (English) / توضیح المسائل (Urdu)
//   Khamenei: leader.ir Practical Laws of Islam, "Rules on Purity" (English) /
//             استفتاآت کے جوابات, "احکام طهارت" (Urdu; Q numbers run one ahead of the English)
// Revised (*) rulings were compared with the Urdu one by one: where the Urdu
// still has the pre-revision wording, it is withheld (`urduEditionLag`, decision P6).
// `basis` comes from the ruling's own opening words (fatwa / obligatory /
// recommended / unspecified precaution) — never inferred beyond them (R3).
"""
from holds import apply_holds, apply_holds_procs
apply_holds(RULINGS); apply_holds_procs(PROCS)
with open(OUT_RULINGS, "w", encoding="utf-8", newline="\n") as f:
    f.write("// Taharat (§6.2) rulings — Phase 2.\n//\n" + HDR + 'import type { Ruling } from "../types";\n\nexport const TAHARAT_RULINGS: Ruling[] = ' + ts(RULINGS) + ";\n")
with open(OUT_PROCS, "w", encoding="utf-8", newline="\n") as f:
    f.write("// Taharat (§6.2) step-by-step procedures — Phase 2.\n// Step titles are app-written labels; each `instruction` is a verbatim excerpt\n// of the ruling in `rulingId` for the same marja' (the validator checks this).\n//\n" + HDR + 'import type { Procedure } from "../types";\n\nexport const TAHARAT_PROCEDURES: Procedure[] = ' + ts(PROCS) + ";\n")

from collections import Counter
c = Counter(); u = Counter()
for r in RULINGS:
    for e in r["rulings"]:
        c[(r["topicId"], e["marjaId"])] += 1
        if e["text"].get("ur"): u[(r["topicId"], e["marjaId"])] += 1
print("rulings:", len(RULINGS), "entries:", sum(c.values()), "procedures:", len(PROCS))
for k in sorted(c): print(k, c[k], "urdu", u[k])
