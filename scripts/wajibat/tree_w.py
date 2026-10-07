# The wuḍūʾ helpers (Phase 4b): Sistani's from his Islamic Laws; Khamenei's from his official Urdu
# practical treatise (Aḥkām-e Āmūzishī, lesson 16: Urdu only, decision P19) and his Q&A.
from helpers_dsl import Tree, entry

NS = "wnotsure"
UR = "ur"


def sistani():
    url = entry("wududoubtvoid", "sistani")["source"]["url"]
    t = Tree("sistaniwudu", "wudu", "sistani", "Wuḍūʾ: doubts and what invalidates it (Sayyid al-Sistani)",
             "Answer a few questions about your situation and this page will show the passage of Sayyid al-Sistani's Islamic Laws that applies. "
             "It never gives a ruling of its own: every answer is his own wording. If a question doesn't fit your case, choose \"I'm not sure\".",
             {"book": "Islamic Laws (4th edition)", "location": "Issues 298–305 and 322 (doubts about wuḍūʾ; things that invalidate wuḍūʾ)", "url": url}, "swroot")
    Q, OUT = t.Q, t.OUT
    ns = "swnotsure"
    Q("swroot", "What is your question about?", [
        ("I am not sure whether I performed wuḍūʾ at all", "swperf", [("wududoubtperformed", "doubts whether he has performed wuḍūʾ or not")]),
        ("I performed wuḍūʾ and am not sure whether it has become void", "swvoid", [("wududoubtvoid", "doubts whether his wuḍūʾ has become void or not")]),
        ("I know I performed wuḍūʾ and that I did something that invalidates it, but not which came first", "swbefore", [("wuduorderunknown", "does not know which one was first")]),
        ("I found out afterwards that my wuḍūʾ was invalid", "swlate", [("wuduunaware", "learns that his wuḍūʾ or ghusl was invalid"), ("wuduvoidtime", "his wuḍūʾ has become void but doubts")]),
        ("I want to know whether something invalidates wuḍūʾ", "swinv", [("wuduinvalidators", "Seven things invalidate wuḍūʾ")]),
        ("I doubt very often about the acts and conditions of wuḍūʾ", "swexcess", [("wuduexcessive", "frequently doubts about the acts of wuḍūʾ")]),
    ], ns)

    Q("swperf", "When did the doubt arise?", [
        ("Before the prayer", "swp1", [("wududoubtperformed", "he must [deem that he has not and] perform wuḍūʾ")]),
        ("During the prayer", "swp2", [("wududoubtduring", "doubts during prayers whether or not he had performed wuḍūʾ")]),
        ("After the prayer", "swp3", [("wududoubtafterprayer", "doubts after prayers whether he had performed wuḍūʾ or not")]),
    ], ns)
    OUT("swp1", [t.q("wududoubtperformed", "FULL", None)], ["perform wuḍūʾ"])
    OUT("swp2", [t.q("wududoubtduring", "FULL", None)], ["he must perform wuḍūʾ and perform the prayer again"])
    OUT("swp3", [t.q("wududoubtafterprayer", "FULL", None)], ["his prayers are valid but he must perform wuḍūʾ for subsequent prayers"])

    Q("swvoid", "Is this your situation: after urinating you did not perform istibrāʾ, then performed wuḍūʾ, and afterwards some fluid came out that you do not know to be urine or something else?", [
        ("No", "swv1", [("wududoubtvoid", "he must treat it as still being valid")]),
        ("Yes", "swv2", [("wududoubtvoid", "his wuḍūʾ is void")]),
    ], ns)
    OUT("swv1", [t.q("wududoubtvoid", "If someone doubts whether his wuḍūʾ has become void or not", "still being valid.")], ["he must treat it as still being valid"])
    OUT("swv2", [t.q("wududoubtvoid", "However, if after urinating", None)], ["his wuḍūʾ is void"], see=["istibradoubt"])

    Q("swbefore", "When did the doubt arise?", [
        ("Before the prayer", "swb1", [("wuduorderunknown", "in the event that he has this doubt before prayers, he must perform wuḍūʾ for those prayers")]),
        ("During the prayer", "swb2", [("wuduorderunknown", "If he has this doubt during prayers, he must break his prayer and perform wuḍūʾ")]),
        ("After the prayer", "swb3", [("wuduorderunknown", "if he has this doubt after prayers, the prayer he performed is valid")]),
    ], ns)
    OUT("swb1", [t.q("wuduorderunknown", "If someone knows he has performed", "for those prayers.")], ["he must perform wuḍūʾ for those prayers"])
    OUT("swb2", [t.q("wuduorderunknown", "If someone knows he has performed", "invalidates wuḍūʾ – for example, he has urinated"), t.q("wuduorderunknown", "If he has this doubt during prayers", "perform wuḍūʾ.")], ["he must break his prayer and perform wuḍūʾ"])
    OUT("swb3", [t.q("wuduorderunknown", "And if he has this doubt after prayers", None)], ["the prayer he performed is valid but he must perform wuḍūʾ for subsequent prayers"])

    Q("swlate", "What did you find out, and when?", [
        ("During or after the prayer I learned that my wuḍūʾ was invalid (or that I prayed without it)", "swl1", [("wuduunaware", "he must perform the prayer again with wuḍūʾ or ghusl")]),
        ("After the prayer I realised my wuḍūʾ had become void, but I don't know whether this happened before or after the prayer", "swl2", [("wuduvoidtime", "doubts whether his wuḍūʾ became void before or after prayers")]),
    ], ns)
    OUT("swl1", [t.q("wuduunaware", "FULL", None)], ["he must perform the prayer again with wuḍūʾ or ghusl"])
    OUT("swl2", [t.q("wuduvoidtime", "FULL", None)], ["the prayers performed by him are valid"])

    Q("swinv", "What happened?", [
        ("I passed urine, stool or wind", "swi1", [("wuduinvalidators", "urinating"), ("wuduinvalidators", "defecating")]),
        ("I slept", "swi2", [("wuduinvalidators", "sleeping, which means that simultaneously one’s eyes do not see and one’s ears do not hear")]),
        ("I lost my mind (insanity, intoxication, unconsciousness)", "swi3", [("wuduinvalidators", "things that cause one to lose his mind")]),
        ("A woman's istiḥāḍah, or janābah, or something else that requires ghusl", "swi4", [("wuduinvalidators", "istiḥāḍah of a woman")]),
        ("Some fluid came out", "swfluid", [("dischargesmadhi", "fluid that sometimes comes out")]),
    ], ns)
    HEAD = lambda: t.q("wuduinvalidators", "Seven things invalidate wuḍūʾ:", "invalidate wuḍūʾ:")
    OUT("swi1", [HEAD(), t.q("wuduinvalidators", "1. urinating", "performing istibrāʾ;"), t.q("wuduinvalidators", "2. defecating;", "2. defecating;"), t.q("wuduinvalidators", "3. passing wind", "from the anus;")], ["Seven things invalidate wuḍūʾ"])
    OUT("swi2", [HEAD(), t.q("wuduinvalidators", "4. sleeping", "his wuḍūʾ does not become invalid;")], ["his wuḍūʾ does not become invalid"])
    OUT("swi3", [HEAD(), t.q("wuduinvalidators", "5. things that cause", "unconsciousness;")], ["things that cause one to lose his mind"])
    OUT("swi4", [HEAD(), t.q("wuduinvalidators", "6. istiḥāḍah", None)], ["janābah"])
    Q("swfluid", "Which of these describes the fluid?", [
        ("A woman who sees fluid and doubts whether it is urine", "swf1", [("istibrawomen", "if a woman sees fluid and doubts whether it is urine or not")]),
        ("A man: the fluid called madhī, wadhī or wadī (or I did istibrāʾ and doubt whether it is urine or one of these)", "swf2", [("dischargesmadhi", "called ‘madhī’")]),
        ("A man: I did not perform istibrāʾ (or doubt that I did), and fluid came out that I don't know to be pure", "swf3", [("istibradoubt", "If a man doubts whether he has performed istibrāʾ or not")]),
        ("A man: I doubt whether the istibrāʾ I performed was correct, and fluid came out", "swf4", [("istibradoubt", "if a man doubts whether the istibrāʾ he performed was correct or not")]),
    ], ns)
    OUT("swf1", [t.q("istibrawomen", "FULL", None)], ["it does not invalidate her wuḍūʾ"])
    OUT("swf2", [t.q("dischargesmadhi", "FULL", None)], ["is pure"], see=["wuduinvalidators"])
    OUT("swf3", [t.q("istibradoubt", "If a man doubts whether he has performed istibrāʾ", "his wuḍūʾ becomes void (bāṭil).")], ["it is impure", "his wuḍūʾ becomes void (bāṭil)"])
    OUT("swf4", [t.q("istibradoubt", "However, if a man doubts whether the istibrāʾ", None)], ["it does not invalidate his wuḍūʾ either"])

    OUT("swexcess", [t.q("wuduexcessive", "FULL", None)], ["must not heed his doubts"])
    t.REFER(ns, "You said you are not sure. The page does not guess: please read the passage in Sayyid al-Sistani's Islamic Laws, or ask his office, so that the answer rests on what actually happened.")
    return t


def khamenei():
    t = Tree("khameneiwudu", "wudu", "khamenei", "Wuḍūʾ: doubts and what invalidates it (Ayatollah Khamenei)",
             "Answer a few questions about your situation and this page will show Ayatollah Khamenei's own wording. Most of his rulings on this come from the official Urdu translation of his practical treatise "
             "(Aḥkām-e Āmūzishī, lesson 16); no official English translation of that treatise exists, so those answers are shown in Urdu, exactly as published, with a label, and the page never translates them. "
             "English readers can check them in his risala or ask his office. If a question doesn't fit your case, choose \"I'm not sure\".",
             {"book": "Aḥkām-e Āmūzishī (official Urdu translation of Risāla-yi Āmūzishī)", "location": "Lesson 16 (wuḍūʾ) and Practical Laws of Islam Q 90–92, 122",
              "url": "https://www.leader.ir/ur/book/201/1?sn=32120"}, "kwroot")
    Q, OUT = t.Q, t.OUT
    ns = "kwnotsure"
    Q("kwroot", "What is your question about?", [
        ("I am not sure whether I performed wuḍūʾ at all", "kwperf", [("wududoubtperformed", "اصل وضو میں شک", UR)]),
        ("I performed wuḍūʾ and am not sure whether it has become void", "kw1", [("wududoubtvoid", "doubt concerning state of purity after the performance of wuḍū’")]),
        ("I found out afterwards that my wuḍūʾ was invalid", "kw2", [("wuduunaware", "وضو باطل ہونے کے بارے میں", UR)]),
        ("I want to know whether something invalidates wuḍūʾ", "kwinv", [("wuduinvalidators", "پیشاب نکلنا", UR)]),
        ("I doubt very often about the acts and conditions of wuḍūʾ", "kw3", [("wuduexcessive", "زیادہ شک کرتا ہے", UR)]),
    ], ns)
    Q("kwperf", "When did the doubt arise?", [
        ("Before the prayer", "kwp1", [("wududoubtperformed", "نماز سے پہلے ہوتو وضو کرنا چاہئے", UR)]),
        ("During the prayer", "kwp2", [("wududoubtperformed", "نماز کے دوران ہوتو اس کی نماز باطل ہے", UR)]),
        ("After the prayer", "kwp3", [("wududoubtperformed", "نماز کے بعد (شک کرے", UR)]),
    ], ns)
    UQ = lambda s, e=None: t.q("wududoubtperformed", s, e, UR)
    OUT("kwp1", [UQ("اصل وضو میں شک", "(یعنی شک کرے کہ وضو کیا ہے یا نہیں)"), UQ("نماز سے پہلے ہوتو", "وضو کرنا چاہئے")], ["وضو کرنا چاہئے"])
    OUT("kwp2", [UQ("اصل وضو میں شک", "(یعنی شک کرے کہ وضو کیا ہے یا نہیں)"), UQ("نماز کے دوران ہوتو", "دوبارہ نماز پڑھے")], ["اس کی نماز باطل ہے"])
    OUT("kwp3", [UQ("اصل وضو میں شک", "(یعنی شک کرے کہ وضو کیا ہے یا نہیں)"), UQ("نماز کے بعد (شک کرے", "وضو کرنا چاہئے")], ["جو نماز پڑھی ہے وہ صحیح ہے"])
    OUT("kw1", [t.q("wududoubtvoid", "FULL", None)], ["No attention should be paid to doubt concerning state of purity after the performance of wuḍū’"])
    OUT("kw2", [t.q("wuduunaware", "FULL", None, UR)], ["دوبارہ وضو کرے"])
    OUT("kw3", [t.q("wuduexcessive", "FULL", None, UR)], ["اپنے شک پر اعتناء نہ کرے"])
    Q("kwinv", "What happened?", [
        ("I passed urine, stool or wind", "kwi1", [("wuduinvalidators", "پیشاب نکلنا", UR)]),
        ("I slept", "kwi2", [("wuduinvalidators", "نیند آنا", UR)]),
        ("I lost my mind (insanity, intoxication, unconsciousness)", "kwi3", [("wuduinvalidators", "بے ہوشی", UR)]),
        ("A woman's istiḥāḍah, or janābah, or something else that requires ghusl", "kwi4", [("wuduinvalidators", "استحاضہ", UR)]),
        ("Some fluid came out (madhī, wadhī, wadī, or a doubtful fluid after urinating)", "kwfluid", [("dischargesmadhi", "pure and do not invalidate wuḍū’")]),
    ], ns)
    IQ = lambda s, e: t.q("wuduinvalidators", s, e, UR)
    OUT("kwi1", [IQ("1۔ پیشاب نکلنا", "ہوا نکلنا")], ["پیشاب نکلنا"])
    OUT("kwi2", [IQ("4۔ اس طرح نیند آنا", "کان نہ سنے")], ["نیند"])
    OUT("kwi3", [IQ("5۔ وہ چیزیں", "بے ہوشی")], ["بے ہوشی"])
    OUT("kwi4", [IQ("6۔ عورتوں کا استحاضہ", "مس میت")], ["استحاضہ"])
    Q("kwfluid", "Which describes the fluid?", [
        ("The fluid called madhī, wadhī or wadī", "kwf1", [("dischargesmadhi", "All of them are pure and do not invalidate wuḍū’")]),
        ("Fluid that came out after istibrāʾ, and I doubt whether it is urine", "kwf2", [("istibradoubt", "after doing istibrā’, about which one doubts whether it is urine")]),
        ("Fluid that came out after urinating when I did not do istibrāʾ, and I doubt what it is", "kwf3", [("istibra", "if one does not do istibrā’ and a doubtful liquid comes out, it will be ruled as urine")]),
    ], ns)
    OUT("kwf1", [t.q("dischargesmadhi", "FULL", None)], ["All of them are pure and do not invalidate wuḍū’"])
    OUT("kwf2", [t.q("istibradoubt", "FULL", None)], ["is not considered urine"])
    OUT("kwf3", [t.q("istibra", "FULL", None)], ["it will be ruled as urine"])
    t.REFER(ns, "You said you are not sure. The page does not guess: please read Ayatollah Khamenei's treatise (the Urdu Aḥkām-e Āmūzishī, or the Persian Risāla-yi Āmūzishī), or ask his office, so that the answer rests on what actually happened.")
    return t


def build():
    return [sistani(), khamenei()]
