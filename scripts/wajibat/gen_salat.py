# Phase 3 (Salat core) generator. Every text is looked up verbatim in the
# downloaded official sources — nothing is retyped:
#   Sistani:  sistani.org Islamic Laws 4th ed. (src.SIS_EN) / توضیح المسائل (src.SIS_UR)
#   Khamenei: "The Rules on Prayer & Fasting 2023" (kh_rpf.RPF) — first priority (R6).
#             It has no official Urdu edition, so these entries are English only (R1).
import json, os, re, sys
from entries import *  # S(), K(), R(), RULINGS, helpers and book constants
from entries import _cut, _read

OUT_RULINGS, OUT_PROCS = sys.argv[1], sys.argv[2]

# ======================= DAILY PRAYERS =======================
T = "dailyprayers"
R("obligatoryprayers", T, "The obligatory prayers",
  S(intro=(2207, "There are six obligatory prayers", "is regarded as one of the daily prayers.", 3637, "چھ نمازیں واجب ہیں", "روزانہ کی نمازوں میں سے ہے۔", "The Obligatory (Wājib) Prayers — section introduction")),
  K(1))
R("dailyrakat", T, "The five daily prayers and their rakʿahs",
  S(intro=(2208, "There are five obligatory daily prayers", "which is two rakʿahs.", 3637, "روزانہ کی واجب نمازیں پانچ ہیں", "فجر (دورکعت)۔", "The Obligatory Daily Prayers — section introduction")),
  K(3))
R("importanceofprayer", T, "The place of the daily prayers in the religion", K(2))

# ======================= TIMES =======================
T = "prayertimes"
R("zuhrasrtime", T, "The time for ẓuhr and ʿaṣr", S(717), K(8))
R("maghribishatime", T, "The time for maghrib and ʿishāʾ", S(723), K(13))
R("fajrtime", T, "The time for the ṣubḥ (fajr) prayer", S(728), K(4))
R("missedbymidnight", T, "Maghrib and ʿishāʾ not prayed by midnight", S(727), K(15))
R("certaintyoftime", T, "Being certain that the time has set in", S(729), K(18))
R("onerakahintime", T, "Time left for only one rakʿah", S(735), K(24))
R("prayingearly", T, "Praying at the start of the time", S(738), K(16))
R("orderzuhrasr", T, "Ẓuhr before ʿaṣr, maghrib before ʿishāʾ", S(742), K(27))

# ======================= QIBLA =======================
T = "qibla"
R("qibladirection", T, "Facing the qibla", S(763), K(41))
R("qiblaeffort", T, "Finding the direction of the qibla", S(769), K(44))
R("qiblanomeans", T, "When the direction cannot be found", S(771), K(45))
R("qiblarecommended", T, "Recommended prayers while walking or riding", S(768), K(42))

# ======================= CLOTHING / COVERING =======================
T = "clothing"
R("coveringmen", T, "Covering in prayer: men", S(775), K(50))
R("coveringwomen", T, "Covering in prayer: women", S(776), K(51))
R("coveringintentional", T, "Leaving the private parts uncovered", S(778), K(49))
R("clothingconditions", T, "The conditions of the clothing", S(785), K(56))
R("clothingpure", T, "Clothing must be pure", S(786), K(57))
R("impureunaware", T, "Praying unaware that the clothing was impure", S(789), K(59))
R("impurityexemptions", T, "Cases where impurity on the body or clothing is excused", S(834), K(64))
R("woundblood", T, "Blood from a wound or sore", S(835), K(65))
R("usurpedclothing", T, "Usurped clothing", S(802), K(78))
R("nonslaughtered", T, "Clothing from an animal not ritually slaughtered", S(808), K(82))
R("haramanimal", T, "Clothing from an animal whose meat is unlawful", S(811), K(85))
R("goldmen", T, "Gold for men", S(818), K(89))
R("goldjewellerymen", T, "Gold jewellery and watches for men", S(819), K(90))
R("silkmen", T, "Pure silk for men", S(821), K(94))
R("silkwomen", T, "Silk for women", S(825), K(97))

# ======================= PLACE OF PRAYER =======================
T = "placeofprayer"
R("usurpedplace", T, "Praying on usurped property", S(853), K(100))
R("stillplace", T, "The place must be still", S(866), K(106))
R("vehicleprayer", T, "Praying in a car, train or plane", S(867), K(107))
R("aheadofgrave", T, "Standing ahead of the grave of the Prophet or an Imam", S(872), K(109))
R("menwomengap", T, "A man and a woman praying side by side", S(873), K(112), differs=False)
R("insidekaba", T, "Obligatory prayers inside the Kaʿbah", S(877))
R("mosquevirtue", T, "Praying in a mosque", S(879), K(114))
R("mosqueimpure", T, "Making a mosque impure", S(886, hukm="haram"), K(115))

# ======================= ADHAN & IQAMAH =======================
T = "adhaniqamah"
R("adhanrecommended", T, "Status of adhān and iqāmah", S(902), K(129))
R("adhanwording", T, "The words of adhān and iqāmah", S(904), K(130))
R("shahadathalithah", T, "“Ashhadu anna ʿAliyyan waliyyullāh”", S(905), K(131))
R("adhancongregation", T, "Joining a congregation that has said adhān", S(909), K(134))
R("adhanafter", T, "Adhān and iqāmah after the time has set in", S(921))
R("iqamahstanding", T, "Saying iqāmah standing and with ṭahārah", S(917))

# ======================= OBLIGATORY PARTS (incl. intention, takbir, standing) =======================
T = "obligatoryparts"
R("elevencomponents", T, "The eleven obligatory components",
  S(intro=(2229, "There are eleven obligatory components of the prayer:", "11. close succession (muwālāh).", 3637, "واجبات نمازگیارہ ہیں", "اجزائے نماز کا پے درپے بجالانا۔", "Obligatory Components of the Prayer — section introduction")),
  K(138))
R("rukns", T, "The elemental parts (rukn)", S(928), K(140))
R("intention", T, "Intention (niyyah)", S(929), K(141))
R("intentionspecified", T, "Specifying which prayer", S(930), K(143))
R("riya", T, "Praying to be seen by others (riyāʾ)", S(932), K(144))
R("takbir", T, "Takbīrat al-iḥrām", S(934), K(164))
R("takbirstill", T, "Being still for takbīrat al-iḥrām", S(937), K(168))
R("qiyam", T, "Standing (qiyām)", S(944), K(149))
R("qiyamstill", T, "Not moving or leaning while standing", S(947), K(153))
R("unabletostand", T, "Praying sitting or lying down", S(955), K(156))

# ======================= RECITATION =======================
T = "qiraah"
R("fatihasurah", T, "Al-Ḥamd and another surah", S(964), K(172))
R("shorttimesurah", T, "When time is short", S(965), K(174))
R("forgotrecitation", T, "Forgetting the recitation", S(967), K(176))
R("sajdahsurahs", T, "Surahs with an obligatory sajdah", S(969), K(178))
R("ikhlaskafirun", T, "Starting al-Ikhlāṣ or al-Kāfirūn", S(974, urdu="lag"), K(180))
R("aloudmen", T, "Reciting aloud or quietly: men", S(978), K(190))
R("aloudsubhmaghrib", T, "Aloud in ṣubḥ, maghrib and ʿishāʾ", S(979))
R("aloudwomen", T, "Reciting aloud or quietly: women", S(980), K(191))
R("aloudmistake", T, "Reciting aloud or quietly by mistake", S(981), K(197))
R("correctrecitation", T, "Reciting correctly", S(983), K(200))
R("thirdfourthrakah", T, "The third and fourth rakʿahs", S(991), K(184))
R("thirdfourthquiet", T, "Reciting quietly in the third and fourth rakʿahs", S(993), K(192))

# ======================= RUKU & SUJUD =======================
T = "rukusujud"
R("ruku", T, "Rukūʿ", S(1008), K(213))
R("rukudhikr", T, "The dhikr of rukūʿ", S(1014), K(221), differs=True)
R("rukustill", T, "Stillness in rukūʿ", S(1016), K(223))
R("afterruku", T, "Standing up after rukūʿ", S(1026), K(231))
R("forgotruku", T, "Forgetting rukūʿ", S(1027), K(232))
R("twosajdahs", T, "The two sajdahs", S(1031), K(236))
R("sevenparts", T, "The seven parts of the body in sajdah", S(1047), K(237))
R("sajdahrukn", T, "The two sajdahs together are a rukn", S(1032), K(238))
R("sajdahdhikr", T, "The dhikr of sajdah", S(1035), K(243), differs=True)
R("dhikrwording", T, "Wording of the rukūʿ and sajdah dhikr", K(318))
R("betweensajdahs", T, "Sitting between the two sajdahs", S(1042), K(255))
R("sajdahheight", T, "Height of the place of the forehead", S(1043), K(258))
R("sajdahbarrier", T, "Nothing between the forehead and the turbah", S(1046), K(260))
R("turbahpure", T, "The place of the forehead must be pure", S(1051), K(259))

# ======================= WHAT SAJDAH MAY BE PERFORMED ON =======================
T = "sajdahplace"
R("sajdahearth", T, "Earth and what grows from it", S(1062), K(265))
R("sajdahfodder", T, "Plants eaten only by animals", S(1064), K(268))
R("sajdahbuilding", T, "Limestone, gypsum and building materials", S(1067), K(267))
R("sajdahpaper", T, "Paper", S(1068), K(272))
R("sajdahbest", T, "The best thing to perform sajdah on", S(1069), K(277))
R("sajdahnothing", T, "When nothing permitted is available", S(1070), K(273))
R("sajdahtaqiyyah", T, "Sajdah under taqiyyah", S(1058), K(275))
R("sajdahforother", T, "Sajdah for other than Allah", S(1076, hukm="haram"), K(280))
R("quransajdah", T, "The obligatory sajdahs of the Qur'an", S(1079), K(281))

# ======================= TASHAHHUD, SALAM, TARTIB, MUWALAT, QUNUT =======================
T = "tashahhudsalam"
R("tashahhud", T, "Tashahhud", S(1086), K(289))
R("tashahhudforgot", T, "Forgetting tashahhud", S(1088), K(292))
R("salam", T, "Salām", S(1091), K(294))
R("salamforgot", T, "Forgetting salām", S(1092), K(297))
R("tartib", T, "Sequence (tartīb)", S(1094), K(298))
R("muwalat", T, "Close succession (muwālāh)", S(1100), K(303))
R("qunut", T, "Qunūt", S(1103, hukm="mustahab"), K(306))
R("qunutdhikr", T, "What may be said in qunūt", S(1105), K(309))
R("taqibat", T, "Supplications after the prayer (taʿqībāt)", S(1108), K(312))

# ======================= MUBTILAT =======================
T = "mubtilat"
R("mubtilatlist", T, "Things that invalidate the prayer", S(1112), K(322))
R("turningface", T, "Turning away from the qibla", S(1117), K(325))
R("speaking", T, "Speaking during the prayer", S(1118), K(326))
R("replyingsalam", T, "Replying to a salām during the prayer", S(1124), K(332))
R("laughing", T, "Laughing", S(1137), K(334))
R("eatingdrinking", T, "Eating and drinking", S(1140), K(341))
R("amin", T, "Saying “āmīn” after al-Ḥamd", K(343))
R("breakingprayer", T, "Breaking an obligatory prayer", S(1145), K(344))
R("breakingnecessity", T, "When the prayer must be broken", S(1146), K(345))

# ======================= TRAVELLER'S PRAYER =======================
T = "travellerprayer"
R("qasrintro", T, "Shortening the four-rakʿah prayers", S(716), K(407))
R("qasrconditions", T, "The conditions for shortening", K(408))
R("qasrdistance", T, "The distance of eight farsakhs", S(1258), K(409))
R("qasrkm", T, "Eight farsakhs in kilometres", K(410))
R("qasrdistancestart", T, "Where the distance is measured from", S(1266, urdu="lag"), K(411))
R("qasrintention", T, "Intending the distance from the start", S(1268), K(430))
R("qasrsinful", T, "A journey for a sinful purpose", S(1282), K(452))
R("qasrleisure", T, "Travelling for recreation", S(1286), K(465))
R("qasrjob", T, "Someone whose job is travelling", S(1293), K(478))
R("qasrlimit", T, "The permitted limit (tarakhkhuṣ)", S(1304), K(506))
R("qasrwatan", T, "The home town (waṭan)", S(1314), K(529))
R("qasrtendays", T, "Intending to stay ten days", S(1320), K(558))
R("qasrthirtydays", T, "Staying thirty days without intending ten", S(1338), K(588))
R("qasrfourplaces", T, "Mecca, Medina, Kūfah and al-Ḥāʾir", S(1341), K(620))
R("qasrignorance", T, "Praying in full not knowing the ruling", S(1344), K(604))

# ======================= QADA =======================
T = "qadaprayers"
R("qadaobligation", T, "Making up missed prayers", S(1355), K(627))
R("qadanotdelay", T, "Not being negligent about qaḍāʾ", S(1357), K(633))
R("qadaorder", T, "Order of qaḍāʾ prayers", S(1360), K(638))
R("qadaunknownnumber", T, "Not knowing how many prayers were missed", S(1359), K(639))
R("qadanafilah", T, "Recommended prayers while qaḍāʾ is owed", S(1358), K(641))
R("qadaliving", T, "Qaḍāʾ for someone still alive", S(1367))
R("eldestson", T, "The eldest son and his parents' missed prayers", S(1370, urdu="lag"), K(651), differs=True)
R("eldestsonwho", T, "Who the eldest son is", S(1377), K(653))

# ======================= CONGREGATIONAL PRAYER =======================
T = "jamaah"
R("jamaahvirtue", T, "Praying in congregation", S(1379), K(692))
R("jamaahneglect", T, "Not attending out of indifference", S(1381), K(763))
R("jamaahwhichprayers", T, "Which prayers may be prayed in congregation", S(1387, urdu="lag"), K(707))
R("imamconditions", T, "Conditions of the imam", S(1433), K(711))
R("followerrecites", T, "What the follower recites", S(1441), K(728))
R("followerquietprayers", T, "The follower in ẓuhr and ʿaṣr", S(1446), K(730))
R("takbirbeforeimam", T, "Saying takbīrat al-iḥrām before the imam", S(1447), K(726))
R("joiningruku", T, "Joining while the imam is in rukūʿ", S(1407), K(745))
R("followerahead", T, "Standing ahead of the imam", S(1412), K(717))
R("womenimam", T, "A woman leading women", S(1460), K(712))

# ======================= OTHER OBLIGATORY PRAYERS =======================
T = "otherprayers"
R("ayatcauses", T, "When the prayer of signs (ṣalāt al-āyāt) is obligatory", S(1470), K(660))
R("ayatmethod", T, "How the prayer of signs is performed", S(1486), K(673))
R("ayatshort", T, "The shorter method of the prayer of signs", S(1487))
R("ayatruku", T, "Every rukūʿ of the prayer of signs is a rukn", S(1494), K(679))
R("eidstatus", T, "The Eid prayers", S(1495), K(681))
R("eidtime", T, "Time of the Eid prayers", S(1496), K(682))
R("fridayprayer", T, "The Friday prayer", S(719, urdu="match"), K(762))
R("fridaybest", T, "When the Friday prayer is established", S(720), K(764))
R("fridayzuhr", T, "Praying ẓuhr instead of the Friday prayer", S(721), K(784))

# ======================= GUIDED PRAYERS =======================
PROCS = []
def entry(rid, marja):
    r = next(x for x in RULINGS if x["id"] == rid)
    return next(e for e in r["rulings"] if e["marjaId"] == marja)

def step(order, title, rid, marja, a, b, *, hukm=None, rukn=False, note=None):
    text = entry(rid, marja)["text"]["en"]
    s = {"id": f"s{order}", "order": order, "title": {"en": title}, "instruction": {"en": _cut(text, a, b, rid)}, "rulingId": rid}
    if hukm: s["hukm"] = hukm
    if rukn: s["isRukn"] = True
    if note: s["note"] = note
    return s

# Each marja's own texts for the acts of the prayer: (rulingId, start, end).
ACTS = {
    "sistani": {
        "intention": ("intention", "One must perform prayers with the intention of qurbah", "Lord of the worlds"),
        "takbir": ("takbir", "Saying ‘allāhu akbar’ at the beginning of every prayer", "elementary part of the prayer."),
        "recite": ("fatihasurah", "In the first and second rakʿahs of the daily obligatory prayers", "followed by another surah"),
        "tasbihat": ("thirdfourthrakah", "In the third and fourth rakʿahs of prayers", "wallāhu akbar"),
        "ruku": ("ruku", "In every rakʿah after qirāʾah, one must bend forward", "This action is called ‘rukūʿ’."),
        "rukudhikr": ("rukudhikr", "It is better that when one has the option to, he says in rukūʿ:", "subḥānal lāh, three times."),
        "stand": ("afterruku", "After completing the dhikr of rukūʿ, one must stand straight", "one must stand straight"),
        "sajdah": ("twosajdahs", "In every rakʿah of the obligatory and recommended prayers, one must perform two sajdahs after rukūʿ.", "two sajdahs after rukūʿ."),
        "sajdahdhikr": ("sajdahdhikr", "When one has the option to, it is better that in sajdah he says:", "biḥamdih three, five, seven, or even more times."),
        "sit": ("betweensajdahs", "After completing the dhikr of the first sajdah", "go into sajdah again."),
        "qunut": ("qunut", "In all the obligatory and recommended prayers, it is recommended to perform qunūt", "before the rukūʿ of the second rakʿah."),
        "tashahhud": ("tashahhud", "In the second rakʿah of all obligatory and recommended prayers", "ʿalā muḥammadin wa āli muḥammad"),
        "salam": ("salam", "After completing tashahhud of the last rakʿah of the prayer", "assalāmu ʿalaykum"),
    },
    "khamenei": {
        "intention": ("intention", "Making an intention is obligatory for performing the prayer", "to comply with the order of God."),
        "takbir": ("takbir", "Saying takbīrah al-iḥrām is obligatory for the prayer", "at the beginning of the prayer."),
        "recite": ("fatihasurah", "One should recite chapter al-Fātiḥah in the first and second rak‘ah", "a complete chapter."),
        "tasbihat": ("thirdfourthrakah", "It is enough in the 3rd and 4th rak‘ah of the prayer to say", "wallāhu akbar once."),
        "ruku": ("ruku", "In every rak‘ah after the recitation, the praying person should make a rukū‘", "fingertips can reach the knees."),
        "rukudhikr": ("dhikrwording", "سُبْحَانَ ربی العظیم و بحمده", "Glorified is my Lord, the Almighty, and I praise Him"),
        "stand": ("afterruku", "It is obligatory to stand straight after the completion of rukū‘", "one should go to sajdah."),
        "sajdah": ("twosajdahs", "In every rak‘ah of the obligatory or mustaḥabb prayers after rukū‘, two sajdah should be performed", "out of humility before Allah."),
        "sajdahdhikr": ("dhikrwording", "سُبْحَانَ ربی الأعلی و بحمده", "Glorified is my Lord, the H"),
        "sit": ("betweensajdahs", "After finishing the dhikr of the first sajdah", "make sajdah again."),
        "qunut": ("qunut", "In all obligatory and mustaḥabb prayers, it is mustaḥabb to raise the hands", "This action is called qunūt."),
        "tashahhud": ("tashahhud", "The obligatory dhikr in tashahhud is:", None),
        "salam": ("salam", "The last part of prayer, with the recitation of which the prayer ends, is salām.", "is salām."),
    },
}
RUKN_NOTE = {
    "sistani": "Rukn: listed among the five rukns of the prayer in Ruling 928.",
    "khamenei": "Rukn: listed among the foundational elements (rukns) of prayer in ruling 140.",
}
WAJIB_NOTE = {
    "sistani": "Marked wājib because it is one of the eleven obligatory components listed in “Obligatory Components of the Prayer” (section introduction).",
    "khamenei": "Marked wājib because it is one of the eleven obligatory acts listed in ruling 138.",
}
LABELS = {
    "intention": "Intention", "takbir": "Takbīrat al-iḥrām", "recite": "Recite al-Ḥamd and another surah",
    "tasbihat": "Al-tasbīḥāt al-arbaʿah (or al-Ḥamd), quietly", "ruku": "Rukūʿ", "rukudhikr": "Dhikr of rukūʿ",
    "stand": "Stand up straight", "sajdah": "First sajdah", "sajdahdhikr": "Dhikr of sajdah", "sit": "Sit, then the second sajdah",
    "qunut": "Qunūt (recommended)", "tashahhud": "Tashahhud", "salam": "Salām",
}
RUKN_ACTS = {"intention", "takbir", "ruku", "sajdah"}
WAJIB_ACTS = {"intention", "takbir", "recite", "tasbihat", "ruku", "rukudhikr", "sajdah", "sajdahdhikr", "tashahhud", "salam"}

def guided(marja, rakahs):
    seq = [("intention", 1), ("takbir", 1)]
    for k in range(1, rakahs + 1):
        seq.append(("recite" if k <= 2 else "tasbihat", k))
        if k == 2: seq.append(("qunut", k))
        seq += [("ruku", k), ("rukudhikr", k), ("stand", k), ("sajdah", k), ("sajdahdhikr", k), ("sit", k)]
        if k == 2 or k == rakahs: seq.append(("tashahhud", k))
    seq.append(("salam", rakahs))
    steps = []
    for i, (act, k) in enumerate(seq, 1):
        rid, a, b = ACTS[marja][act]
        title = f"Rakʿah {k} · {LABELS[act]}" if act not in ("intention", "takbir", "salam") else LABELS[act]
        notes = []
        if act in RUKN_ACTS: notes.append(RUKN_NOTE[marja])
        if act in WAJIB_ACTS: notes.append(WAJIB_NOTE[marja])
        steps.append(step(i, title, rid, marja, a, b,
                          hukm="mustahab" if act == "qunut" else ("wajib" if act in WAJIB_ACTS else None),
                          rukn=act in RUKN_ACTS, note=" ".join(notes) or None))
    return steps

for marja in ("sistani", "khamenei"):
    for pid, title, n in (("fajr", "Guided prayer: ṣubḥ (fajr), 2 rakʿahs", 2),
                          ("maghrib", "Guided prayer: maghrib, 3 rakʿahs", 3),
                          ("zuhr", "Guided prayer: ẓuhr, 4 rakʿahs", 4)):
        PROCS.append({"id": f"{pid}{marja}", "topicId": "guidedprayers", "marjaId": marja, "title": {"en": title}, "steps": guided(marja, n)})

# ---- Post-generation data, decided in review (kept here so the file stays reproducible) ----
# P12: Sistani's rukūʿ/sajdah dhikr Arabic from his official Urdu Tawzih, shown as a separate
# Recitation (app/data/wajibat/recitations.ts), never spliced into the English quote.
P12_NOTE = {
    "rukudhikr": " The English 4th edition publishes this dhikr only as an image (/files-new/book-photo/48/ruku.png), so it is quoted here exactly as the English book has it (with the image left unretyped); the Arabic itself is shown separately as a sourced recitation (P12), taken from the official Urdu edition, not spliced into this English quote.",
    "sajdahdhikr": " The English 4th edition publishes this dhikr only as an image, so it is quoted here exactly as the English book has it (with the image left unretyped); the Arabic itself is shown separately as a sourced recitation (P12), taken from the official Urdu edition, not spliced into this English quote.",
}
for rid, rec in (("rukudhikr", "rukudhikrarabic"), ("sajdahdhikr", "sajdahdhikrarabic")):
    r = next(x for x in RULINGS if x["id"] == rid)
    r["recitationIds"] = [rec]
    e = entry(rid, "sistani"); e["note"] = (e.get("note") or "").strip() + P12_NOTE[rid]
for p in PROCS:
    if p["marjaId"] == "sistani":
        for st in p["steps"]:
            if st["rulingId"] in ("rukudhikr", "sajdahdhikr"):
                st["recitationIds"] = ["rukudhikrarabic" if st["rulingId"] == "rukudhikr" else "sajdahdhikrarabic"]
# P14: data note only, not shown in the UI.
e651 = next(e for r in RULINGS for e in r["rulings"] if e["marjaId"] == "khamenei" and e["source"]["reference"] == "651.")
e651["note"] = (e651.get("note") or "") + " Data note (P14, not shown in the UI): the footnote to Ruling 656 in the same book describes this same duty as just \"a caution\" rather than \"an obligatory caution\". This is a plain caution in a footnote, not a second source to reconcile with 651 (which agrees with the Q&A book, Q 540) — so 651 is quoted verbatim and the footnote is left unshown."
# Key order: keep the dataset's usual field order (note last).
finalize(RULINGS)  # arabicInSource flags + field order (entries.py)

HDR = """// GENERATED from the official texts, do not hand-edit the quoted strings:
// every `text`/`instruction` was looked up verbatim (by script) on the marja's
// official website as downloaded on 2026-09-25 / 2026-10-02 —
//   Sistani:  sistani.org Islamic Laws 4th ed. (English) / توضیح المسائل (Urdu)
//   Khamenei: leader.ir "The Rules on Prayer & Fasting 2023" (book 241), first priority
//             for salat (decision R6). It has no official Urdu edition, so Khamenei's
//             salat entries are English only (decision R1).
// Revised (*) Sistani rulings were compared with the Urdu one by one (decision P6).
// `basis` comes from the ruling's own opening words — never inferred beyond them (R3).
"""
from holds import apply_holds, apply_holds_procs
apply_holds(RULINGS); apply_holds_procs(PROCS)
with open(OUT_RULINGS, "w", encoding="utf-8", newline="\n") as f:
    f.write("// Salat (§6.3, excluding doubts) rulings — Phase 3.\n//\n" + HDR + 'import type { Ruling } from "../types";\n\nexport const SALAT_RULINGS: Ruling[] = ' + ts(RULINGS) + ";\n")
with open(OUT_PROCS, "w", encoding="utf-8", newline="\n") as f:
    f.write("// Salat guided prayers — Phase 3. Step titles are app-written labels; each\n// `instruction` is a verbatim excerpt of the ruling in `rulingId` for the same\n// marja' (the validator checks this). Recitations are text only (decision Q9).\n//\n" + HDR + 'import type { Procedure } from "../types";\n\nexport const SALAT_PROCEDURES: Procedure[] = ' + ts(PROCS) + ";\n")

from collections import Counter
c = Counter(); u = Counter()
for r in RULINGS:
    for e in r["rulings"]:
        c[(r["topicId"], e["marjaId"])] += 1
        if e["text"].get("ur"): u[(r["topicId"], e["marjaId"])] += 1
print("rulings:", len(RULINGS), "entries:", sum(c.values()), "procedures:", len(PROCS), "steps:", sum(len(p["steps"]) for p in PROCS))
for k in sorted(c): print(k, c[k], "urdu", u[k])
