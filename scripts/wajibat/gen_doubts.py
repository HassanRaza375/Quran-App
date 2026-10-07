# Phase 4a generator: doubts in prayer, ṣalāt al-iḥtiyāṭ, sajdatā al-sahw and forgotten parts.
# Every text is looked up verbatim in the downloaded official sources (entries.py) — nothing is retyped:
#   Sistani:  Islamic Laws 4th ed., Rulings 1151–1257 (sistani.org pages 2250–2263 and 8298) /
#             توضیح المسائل (Urdu page 3638), revised (*) rulings compared one by one (P6).
#   Khamenei: The Rules on Prayer & Fasting 2023, rulings 346–406 (first priority, R6).
# Pairing: one Ruling per point, holding each marja's own ruling on it. A point only one book
# states gets one entry; when the other marja's book states it inside another ruling on the same
# page, `see_also` points there instead of "not added yet".
# Left out on purpose (restatements inside the same book, logged in wajibat_progress_log.md):
#   Khamenei 361 (only names the two kinds of rakʿah doubt), 365 (repeats 364's method),
#   374 (repeats 348) and 377 (repeats the first half of 347).
import sys
from entries import *  # S(), K(), R(), RULINGS

OUT = sys.argv[1]

# ======================= DOUBTS IN PRAYER =======================
T = "doubts"
R("doubtkinds", T, "What counts as a doubt", K(346), see_also={"sistani": "doubtsupposition"})
R("doubtprayeritself", T, "Doubting whether one has prayed at all", S(1166), K(347))
R("doubtsinvalidating", T, "Doubts about the number of rakʿahs that invalidate the prayer", S(1151), K(362), differs=True)
R("doubtinvalidthink", T, "Thinking before giving up the prayer over such a doubt", S(1152), K(363))
R("doubtrakahhow", T, "Dealing with a doubt about the number of rakʿahs", K(360), see_also={"sistani": "doubtsvalid"})
R("doubtsvalid", T, "Valid doubts in a four-rakʿah prayer and what to do", S(1185), K(364), differs=True)
R("doubtsupposition", T, "A stronger supposition about the number of rakʿahs counts as certainty", S(1220, urdu="lag"), K(368))
R("doubtsuppositionchange", T, "When the stronger possibility later seems equal, or the reverse", S(1189), K(369))
R("doubtsuppositionunsure", T, "Not knowing whether one leans to one possibility", S(1190))
R("doubtvaliddontbreak", T, "Not breaking the prayer over a valid doubt", S(1186), K(366))
R("doubtvalidrestart", T, "Restarting the prayer instead of performing ṣalāt al-iḥtiyāṭ", S(1187), K(367), differs=True)
R("doubtknowsnextstage", T, "An invalidating doubt that the next stage would resolve", S(1188))
R("doubtafterprayerunsure", T, "After the prayer, not knowing how one had acted on a doubt", S(1191))
R("doubtsajdahandrakah", T, "Doubting the sajdahs and the number of rakʿahs together", S(1192))
R("doubtbeforetashahhud", T, "Doubting one or two sajdahs together with a rakʿah doubt before tashahhud", S(1193))
R("doubtforgotsajdahstanding", T, "A rakʿah doubt while standing, remembering a missed sajdah", S(1194))
R("doubtchanges", T, "When one doubt is replaced by another", S(1195))
R("doubtafterprayertwo", T, "After the prayer, unsure which of two doubts one had", S(1196))
R("doubtafterprayerkind", T, "After the prayer, unsure whether the doubt was a valid one", S(1197))
R("doubtsdismissedlist", T, "Doubts that must be dismissed", S(1153), K(373))
R("doubtpartgeneral", T, "Doubting a part of the prayer: before or after starting the next part",
  S(1154, note="Quoted exactly as published: the official page prints \"Sūrat al-Ḥamd00\" (a typing slip on sistani.org, page 8298); the text is not corrected here."), K(348))
R("doubttakbir", T, "Doubting takbīrat al-iḥrām", K(349), see_also={"sistani": "doubtpartgeneral"})
R("doubtfatiha", T, "Doubting al-Ḥamd before starting the next part", S(1161), K(350))
R("doubtsurah", T, "Doubting al-Ḥamd or the other surah after starting the next part", S(1163), K(351))
R("doubtverse", T, "Doubting the previous verse while reciting", S(1155), K(356))
R("doubtcorrectness", T, "Doubting whether a part already done was done correctly", S(1156), K(357))
R("doubtruku", T, "Doubting rukūʿ on the way to sajdah", S(1157), K(352))
R("doubtrukn", T, "Doubting a rukn before starting the act after it", S(1160), K(353))
R("doubtrising", T, "Doubting sajdah or tashahhud while getting up", S(1158),
  K(354, note="For a doubt about the sajdahs while getting up, see Ruling 353 in “Doubting a rukn before starting the act after it” on this page."), differs=True)
R("doubtsittingprayer", T, "Doubting sajdah or tashahhud when praying sitting or lying", S(1159))
R("doubtrepeated", T, "Repeating a doubted part, then finding it had been done", K(358), see_also={"sistani": "doubtrukn"})
R("doubtremembermissing", T, "Dismissing a doubt, then remembering the part was missed", S(1162), K(359))
R("doubtsalam", T, "Doubting whether one said the salām", S(1164), K(355))
R("doubtaftersalam", T, "A doubt after the salām", S(1165), K(375))
R("doubtaftersalaminvalid", T, "A doubt after the salām in which both possibilities invalidate", K(376), see_also={"sistani": "doubtaftersalam"})
R("doubtaftertime", T, "Doubting the prayer's correctness after its time", S(1167))
R("doubtzuhrasr", T, "After the time, unsure whether a four-rakʿah prayer was ẓuhr or ʿaṣr", S(1168))
R("doubtmaghribisha", T, "After the time, unsure whether one prayed three or four rakʿahs", S(1169))
R("excessivedoubter", T, "Who counts as an excessive doubter (kathīr al-shakk)", S(1170), K(379))
R("excessiveact", T, "An excessive doubter assumes the act was done", S(1171), K(380))
R("excessivepart", T, "Excessive doubting about one part only", S(1172), K(381))
R("excessiveprayer", T, "Excessive doubting in one prayer only", S(1173), K(382))
R("excessiveplace", T, "Excessive doubting in one place only", S(1174), K(383))
R("excessiveunsure", T, "Unsure whether one has become an excessive doubter", S(1175), K(384))
R("excessiverukn", T, "An excessive doubter who later finds a rukn was missed", S(1176))
R("excessivenonrukn", T, "An excessive doubter who later finds a non-rukn act was missed", S(1177))
R("doubtimam", T, "Doubts of the imam and the follower in congregation", S(1178), K(378))
R("doubtmustahabnumber", T, "Doubting the number of rakʿahs in a recommended prayer", S(1179), K(385))
R("doubtmustahabrukn", T, "Missing or adding a rukn in a recommended prayer", S(1180), K(387), differs=True)
R("doubtmustahabpart", T, "Doubting a part of a recommended prayer", S(1181), K(386))
R("doubtmustahabsupposition", T, "A supposition about the rakʿahs of a two-rakʿah recommended prayer", S(1182))
R("doubtmustahabsahw", T, "No sajdatā al-sahw or qaḍāʾ sajdah in a nāfilah", S(1183))
R("doubtmustahabprayed", T, "Doubting whether one performed a recommended prayer", S(1184))
R("doubtotherprayers", T, "The same rules in the other obligatory prayers", S(1221))

# ======================= ṢALĀT AL-IḤTIYĀṬ =======================
T = "ihtiyatprayer"
R("ihtiyatmethod", T, "How to perform ṣalāt al-iḥtiyāṭ", S(1201), K(370))
R("ihtiyatrecitation", T, "No second surah or qunūt; reciting al-Ḥamd quietly", S(1202), K(371), differs=True)
R("ihtiyatnotneeded", T, "Finding the prayer was complete before or during ṣalāt al-iḥtiyāṭ", S(1203), K(372))
R("ihtiyatfewer", T, "Finding before ṣalāt al-iḥtiyāṭ that rakʿahs were missed", S(1204))
R("ihtiyatsame", T, "Finding afterwards that the shortfall equalled ṣalāt al-iḥtiyāṭ", S(1205))
R("ihtiyatless", T, "Finding afterwards that the shortfall was less than ṣalāt al-iḥtiyāṭ", S(1206))
R("ihtiyatmore", T, "Finding afterwards that the shortfall was more than ṣalāt al-iḥtiyāṭ", S(1207))
R("ihtiyattwothreefour", T, "Doubt of two, three or four: remembering after two standing rakʿahs", S(1208))
R("ihtiyatremembersduring", T, "Remembering the number of rakʿahs during ṣalāt al-iḥtiyāṭ", S(1209))
R("ihtiyatremembersthree", T, "Doubt of two, three or four: remembering three during it", S(1210))
R("ihtiyatdifferentshortfall", T, "Realising during ṣalāt al-iḥtiyāṭ that the shortfall was different", S(1211))
R("ihtiyatdoubtperformed", T, "Doubting whether one performed ṣalāt al-iḥtiyāṭ", S(1212))
R("ihtiyatadded", T, "Performing two rakʿahs instead of one, or adding a rukn", S(1213))
R("ihtiyatdoubtpart", T, "Doubting a part of ṣalāt al-iḥtiyāṭ", S(1214))
R("ihtiyatdoubtnumber", T, "Doubting the number of rakʿahs in ṣalāt al-iḥtiyāṭ", S(1215))
R("ihtiyatnosahw", T, "No sajdatā al-sahw for a non-rukn slip in ṣalāt al-iḥtiyāṭ", S(1216))
R("ihtiyatdoubtaftersalam", T, "Doubting ṣalāt al-iḥtiyāṭ after its salām", S(1217))
R("ihtiyatforgot", T, "Forgetting tashahhud or a sajdah in ṣalāt al-iḥtiyāṭ", S(1218))
R("ihtiyatorder", T, "Ṣalāt al-iḥtiyāṭ before sajdatā al-sahw or a made-up sajdah", S(1219))
R("ihtiyatsitting", T, "Ṣalāt al-iḥtiyāṭ for someone who prays sitting", S(1198))
R("ihtiyatcannotstand", T, "Unable to stand for ṣalāt al-iḥtiyāṭ", S(1199))
R("ihtiyatcanstand", T, "Able to stand for ṣalāt al-iḥtiyāṭ after praying sitting", S(1200))

# ======================= SAJDATĀ AL-SAHW AND FORGOTTEN PARTS =======================
T = "sahwforgotten"
R("sahwcases", T, "When sajdatā al-sahw must be performed", S(1222, urdu="match"), K(388), differs=True)
R("sahwtalking", T, "Talking by mistake", S(1223), K(390), differs=True)
R("sahwsounds", T, "Coughing, sighing or saying “oh”", S(1224), K(391), differs=True)
R("sahwrecitedagain", T, "Repeating correctly what was recited wrongly", S(1225), K(392))
R("sahwonemistake", T, "Several words from one mistake", S(1226), K(393))
R("sahwtasbihat", T, "Leaving out al-tasbīḥāt al-arbaʿah by mistake", S(1227), K(389))
R("sahwsalampart", T, "Saying the salām, or part of it, at the wrong place", S(1228), K(394))
R("sahwsalamall", T, "Saying all three sentences of salām at the wrong place", S(1229), K(395))
R("forgotbeforeruku", T, "A forgotten sajdah or tashahhud remembered before the next rukūʿ", S(1230), K(396))
R("forgotafterruku", T, "A forgotten sajdah or tashahhud remembered in or after the next rukūʿ", S(1231), K(397))
R("forgotsajdahqada", T, "Making up a sajdah forgotten until after rukūʿ", K(401), see_also={"sistani": "forgotafterruku"})
R("forgottashahhudqada", T, "Making up a tashahhud forgotten until after rukūʿ", K(402), see_also={"sistani": "forgotafterruku"})
R("forgotnonrukn", T, "A forgotten part that is not a rukn", K(400))
R("sahwintentional", T, "Not performing sajdatā al-sahw, intentionally or by forgetting", S(1232), K(399))
R("sahwdoubtobligatory", T, "Doubting whether sajdatā al-sahw became obligatory", S(1233))
R("sahwdoubttwofour", T, "Unsure whether two or four sajdahs of sahw are due", S(1234))
R("sahwonemissed", T, "Missing one of the two sajdahs of sahw, or adding a third", S(1235))
R("sahwmethod", T, "How to perform sajdatā al-sahw", S(1236), K(398))
R("qadaconditions", T, "Conditions for making up a forgotten sajdah or tashahhud", S(1237), K(403))
R("qadanosalam", T, "No salām after a made-up tashahhud or sajdah", K(404))
R("qadaseveral", T, "Making up several forgotten sajdahs", S(1238))
R("qadasajdahtashahhud", T, "Forgetting one sajdah and one tashahhud", S(1239))
R("qadasajdahorder", T, "No order needed when making up two sajdahs", S(1240))
R("qadainvalidator", T, "Something that invalidates prayer before the made-up sajdah", S(1241), K(405))
R("qadalastrakah", T, "A sajdah of the last rakʿah remembered after the salām", S(1242))
R("qadasahwbetween", T, "Something requiring sajdatā al-sahw before the made-up sajdah", S(1243))
R("qadasajdahortashahhud", T, "Not knowing whether a sajdah or a tashahhud was forgotten", S(1244))
R("qadadoubtforgot", T, "Doubting whether a sajdah or tashahhud was forgotten", S(1245))
R("qadadoubtremembered", T, "Doubting whether a forgotten sajdah was made up in time", S(1246))
R("qadasahwboth", T, "Both a made-up sajdah and sajdatā al-sahw due: which first", S(1247), K(406))
R("qadadoubtdone", T, "Doubting after the prayer whether the forgotten sajdah was made up", S(1248))
R("omitintentional", T, "Intentionally omitting or adding an obligatory part", S(1249))
R("omitignorance", T, "Omitting or adding a part out of ignorance", S(1250))
R("omitwudu", T, "Learning that one's wuḍūʾ or ghusl was invalid", S(1251))
R("omittwosajdahs", T, "Remembering the two sajdahs of the previous rakʿah were missed", S(1252))
R("omitlastsajdahs", T, "The two sajdahs of the last rakʿah remembered before the salām", S(1253))
R("omitrakahbefore", T, "A missing final rakʿah remembered before the salām", S(1254))
R("omitrakahafter", T, "A missing final rakʿah remembered after the salām", S(1255))
R("omitsajdahsafter", T, "The last two sajdahs remembered after an invalidating act", S(1256))
R("omittimeqibla", T, "Praying before the time or away from the qibla", S(1257))

finalize(RULINGS)  # arabicInSource flags + field order (entries.py)

HDR = """// GENERATED by scripts/wajibat/gen_doubts.py — do not hand-edit (decision R9).
// Every `text` is looked up verbatim (by script) on the marja's official website:
//   Sistani:  sistani.org Islamic Laws 4th ed. (English) / توضیح المسائل (Urdu)
//   Khamenei: leader.ir "The Rules on Prayer & Fasting 2023" (first priority for salat, R6)
// Revised (*) Sistani rulings were compared with the Urdu one by one (decision P6).
// `basis` comes from the ruling's own opening words — never inferred beyond them (R3).
"""
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write("// Salat — doubts, ṣalāt al-iḥtiyāṭ, sajdatā al-sahw and forgotten parts (Phase 4a).\n//\n" + HDR
            + 'import type { Ruling } from "../types";\n\nexport const DOUBTS_RULINGS: Ruling[] = ' + ts(RULINGS) + ";\n")

# Keep each topic's rulingIds in app/data/wajibat/topics.ts in step with the rulings generated here
# (supplementary Q&A ids are then re-placed by place_qa_ids.py, which build.py runs next).
import os, re
from paths import DATA
tp = os.path.join(DATA, "topics.ts")
s = open(tp, encoding="utf-8").read()
for topic in dict.fromkeys(r["topicId"] for r in RULINGS):
    m = re.search(r'(id: "%s",.*?rulingIds: \[)([^\]]*)\]' % topic, s, re.S)
    assert m, f"topic {topic} missing from topics.ts"
    ids = [r["id"] for r in RULINGS if r["topicId"] == topic]
    s = s[:m.start(2)] + ", ".join(f'"{x}"' for x in ids) + s[m.end(2):]
open(tp, "w", encoding="utf-8", newline="\n").write(s)

from collections import Counter
c = Counter(); u = Counter()
for r in RULINGS:
    for e in r["rulings"]:
        c[(r["topicId"], e["marjaId"])] += 1
        if e["text"].get("ur"): u[(r["topicId"], e["marjaId"])] += 1
print("rulings:", len(RULINGS), "entries:", sum(c.values()))
for k in sorted(c): print(k, c[k], "urdu", u[k])
