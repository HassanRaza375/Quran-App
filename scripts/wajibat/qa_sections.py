# Splits the downloaded Q&A prayer chapters into sections; pairs EN/UR Q&As by
# position within each section (numbering offsets differ between editions).
import re
from src import KH_EN_PRAYER as E, KH_UR_PRAYER as U, _read, HERE
import os, unicodedata
N = lambda x: unicodedata.normalize('NFC', x)
EN_SN = {"Importance and Conditions of Prayer":5256,"Prayer Times":5257,"Qiblah":5258,"The Place of Praying":5259,"Rules of a Masjid":5260,"Rules Regarding Other Religious Places":5261,"Clothes of the Praying Person":5262,"Wearing and Using Gold and Silver":5263,"Adhān and Iqāmah":5264,"Recitation [of the Fātiḥah and the Other Chapter] and its Rules":5265,"Dhikr of Prayer":5266,"Rules of Prostration":5267,"Things that Invalidate Prayer":5268,"Rules of Greeting in Prayers":5269,"Doubt in Prayers":5270,"Qaḍā’ Prayer":5271,"Qaḍā’ Prayers of the Parents":5272,"Congregational Prayers":5273,"Rule of Incorrect Recitation by a Congregational Prayer Imam":5274,"Congregational Prayer Led by a Person Lacking a Body Part":5275,"Women’s Attendance in Congregational Prayer":5276,"Performing Congregational Prayer behind Sunnīs":5315,"Friday Prayer":5277,"The Two ‘Īd Prayers":5278,"A Traveler’s Prayer":5279,"Someone for Whom Traveling Is a Job or a Preliminary for the Job":5280,"Rule of Students":5281,"Intent of Traveling the Shar‘ī Distance and Staying for Ten Days":5282,"Tarakhkhuṣ Limit":5283,"A Travel for the Purposes of Committing a Sin":5284,"Rules Regarding the Watan":5285,"Wife’s and Children’s Following as far as Watan Is Concerned":5286,"Rules of Large Cities":5287,"Prayer Performed by Hiring":5288,"Āyāt Prayer":5289,"Nāfilahs":5290,"Miscellaneous Issues of Prayers":5291}
UR_SN = {"اہمیت اور شرائط نماز":11387,"اوقات نماز":11388,"قبلہ کے احکام":11389,"نماز کی جگہ کے احکام":11390,"مسجد کے احکام":11391,"دیگر مذہبی مقامات کے احکام":11392,"نماز گزار کالباس":11393,"سونے چاندی کا استعمال":11394,"اذان و اقامت":11395,"قرأت اور اس کے احکام":11396,"ذکرنماز":11397,"سجدہ اور اس کے احکام":11398,"مبطلات نماز":11400,"جواب سلام کے احکام":11399,"شکیات نماز":11401,"قضا نماز":11402,"ماں باپ کی قضا نمازیں":11403,"نماز جماعت":11404,"اس امام جماعت کا حکم کہ جس کی قرأت صحیح نہیں ہے":11405,"معذور کی امامت":11406,"نماز جماعت میں عورتوں کی شرکت":11407,"اہل سنت کی اقتداء":11408,"نماز جمعہ":11409,"نماز عیدین":11410,"نماز مسافر":11411,"جس شخص کا پيشہ يا پينشے کا مقدمہ سفر ہو":11412,"طلبہ کا حکم":11413,"قصد مسافرت اور دس دن کی نیت":11414,"حد ترخص":11415,"سفر معصیت":11416,"احکام وطن":11417,"بیوی بچوں کی تابعیت":11418,"بڑے شہروں کے احکام":11419,"نماز اجارہ":11420,"نماز آیات":11421,"نوافل":11422,"نماز کے متفرقہ احکام":11423}
# Fasting chapter (Phase 5): section titles of the English / Urdu fasting pages -> their sn, in page order.
EN_SN_F = {"Pregnant and Nursing Women": 5292, "Illness and Restriction by a Physician": 5293, "Fast Invalidators": 5294, "Remaining Junub": 5295,
           "Masturbation": 5316, "Rules of Breaking Fasting": 5296, "Kaffārah of the Fast and Its Amount": 5297, "Making up Missed Fasts": 5298,
           "Miscellaneous Issues on Fasting": 5299, "Sighting the New Moon": 5300}
UR_SN_F = {"حاملہ اور دودھ پلانے والی عورت کے احکام": 11424, "بیماری اور ڈاکٹر کی طرف سے ممانعت": 11425, "مبطلات روزہ": 11426, "حالت جنابت پر باقی ر ھنا": 11427,
           "استمناء": 11428, "روزے کو باطل کرنے والی چیزوں کے احکام": 11429, "روزہ کا کفارہ اور اس کی مقدار": 11430, "روزوں کی قضا": 11431,
           "روزے کے متفرق مسائل": 11432, "رؤیت ہلال": 11433}
def sections(fname, snmap, qre):
    import unicodedata
    N = lambda x: unicodedata.normalize("NFC", x).replace("\xa0", " ")
    snmap = {N(k).strip(): v for k, v in snmap.items()}
    out, cur = [], None
    for l in _read(os.path.join(HERE, fname)).split("\n"):
        l = N(l)
        if re.search(r"(Print|پرنٹ)\s*;\s*PDF", l):
            h = re.sub(r"\s*(Print|پرنٹ)\s*;.*$", "", l).strip()
            cur = None
            if h in snmap:
                cur = {"title": h, "sn": snmap[h], "qs": []}; out.append(cur)
            continue
        m = re.match(qre, l)
        if m and cur is not None: cur["qs"].append(int(m.group(1)))
    return out
EN_SEC = sections("kh_en_prayer.txt", EN_SN, r"^Q ?(\d+)[:.]")
UR_SEC = sections("kh_ur_prayer.txt", UR_SN, r"^س ?(\d+)\s*:")
EN_SEC = [s for s in EN_SEC if s["sn"] <= 5291 or s["sn"] == 5315]
UR_SEC = [s for s in UR_SEC if 11387 <= s["sn"] <= 11423]
# Fasting sections, in page order (the English and Urdu lists pair one to one; the Urdu numbers are the English + 4 throughout)
EN_SEC += sections("kh_en_fasting.txt", EN_SN_F, r"^Q ?(\d+)[:.]")
UR_SEC += sections("kh_ur_fasting.txt", UR_SN_F, r"^س ?(\d+)\s*:")
EN_SEC = [s for s in EN_SEC if s["sn"] <= 5300 or s["sn"] == 5315 or s["sn"] == 5316]
UR_SEC = [s for s in UR_SEC if 11387 <= s["sn"] <= 11433]
for _s in EN_SEC:
    if _s["sn"] in EN_SN_F.values(): _s["qs"] = [q for q in _s["qs"] if 741 <= q <= 846]
for _s in UR_SEC:
    if _s["sn"] in UR_SN_F.values(): _s["qs"] = [q for q in _s["qs"] if 745 <= q <= 850]
assert len(EN_SEC) == len(UR_SEC), (len(EN_SEC), len(UR_SEC))
