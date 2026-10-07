# Khamenei: prayer doubts (The Rules on Prayer & Fasting 2023, issues 346-406). Authored as data;
# quotes cut verbatim. Rules 364 (the valid doubts) is English-withheld (R11), so its cases are
# quoted from the official Urdu Rules, which agree with the Persian original.
from helpers_dsl import Tree

NS = "kdnotsure"
UR = "ur"


def build():
    t = Tree("khameneidoubts", "doubts", "khamenei", "Prayer doubts: what to do (Ayatollah Khamenei)",
             "Answer a few questions about your situation and this page will show the passage of Ayatollah Khamenei's Rules on Prayer & Fasting that applies. "
             "It never gives a ruling of its own: every answer is his own wording. If a question doesn't fit your case, choose \"I'm not sure\".",
             {"book": "The Rules on Prayer & Fasting 2023", "location": "issues 346–406, \"Doubts in prayer\"",
              "url": "https://www.leader.ir/en/book/241?sn=32530"}, "kdroot")
    Q, OUT = t.Q, t.OUT

    Q("kdroot", "What are you unsure about?", [
        ("Whether I have prayed this prayer at all, or prayed it correctly (the prayer is over)", "kdprayed", [("doubtprayeritself", "after the prayer’s time")]),
        ("Whether I did a part of the prayer (for example al-Fātiḥah, rukūʿ, a sajdah, tashahhud), and I am still in the prayer", "kdact", [("doubtpartgeneral", "doubts whether he has performed one of the obligatory acts of prayer")]),
        ("How many rakʿahs I have prayed, and I am still in the prayer", "kdrak", [("doubtsinvalidating", "Doubt about the number of rak‘ah")]),
        ("Whether I said the salām", "kdsalam", [("doubtsalam", "doubts whether he has said salām or not")]),
        ("A doubt that came after I finished the prayer (after the salām)", "kdafter", [("doubtaftersalam", "After salām, if one doubts")]),
        ("I doubt very often (a person who doubts too much)", "kdexcess", [("excessivedoubter", "a person who doubts too much")]),
        ("I am praying in congregation (as imam or as follower)", "kdimam", [("doubtimam", "imam of congregation")]),
        ("It is a recommended (mustaḥabb) prayer", "kdmust", [("doubtmustahabnumber", "mustaḥabb prayer")]),
    ], NS)

    # ---- the prayer itself ----
    Q("kdprayed", "Has the time for this prayer already ended?", [
        ("No, I am still within its time, and I doubt whether I prayed it", "kdp1", [("doubtprayeritself", "before the end of prayer’s time, he doubts whether he has performed the prayer or not")]),
        ("Yes, its time has ended, and I doubt whether I prayed it", "kdp2", [("doubtprayeritself", "after the prayer’s time, one doubts whether he has performed it or not")]),
        ("Yes, its time has ended, and I doubt whether I prayed it correctly", "kdp3", [("doubtsdismissedlist", "Doubt after the time of prayer has already passed.")]),
    ], NS)
    OUT("kdp1", [t.q("doubtprayeritself", "However, if before the end", None)], ["he should pray"])
    OUT("kdp2", [t.q("doubtprayeritself", "If, after the prayer’s time", "it is not necessary to perform it.")], ["it is not necessary to perform it"])
    OUT("kdp3", [t.q("doubtsdismissedlist", "Doubts which are invalid and should be ignored are as follows:", "should be ignored are as follows:"), t.q("doubtsdismissedlist", "3. Doubt after the time of prayer", "already passed.")], ["Doubt after the time of prayer has already passed."])

    # ---- a part of the prayer ----
    Q("kdact", "Which part of the prayer is it?", [
        ("Takbīrat al-iḥrām, al-Fātiḥah or the second chapter", "kdparta", [("doubtpartgeneral", "if he has not started the next part, he should perform it")]),
        ("Rukūʿ", "kdruku", [("doubtruku", "doubts whether he has performed rukū‘ or not")]),
        ("One of the two sajdahs", "kdsaj", [("doubtrukn", "doubts whether he has performed one or two sajdah")]),
        ("Tashahhud", "kdtash", [("doubtrising", "have said tashahhud or not")]),
        ("A verse I am reciting (the previous verse, or the beginning of this one)", "kdverse", [("doubtverse", "doubts whether he has read the previous verse or not")]),
        ("Whether I did something correctly, after doing it", "kdcorrect", [("doubtcorrectness", "doubts whether they have performed it correctly or not")]),
        ("I ignored a doubt (or acted on one), and later found out what really happened", "kdlater", [("doubtremembermissing", "does not pay attention to his doubt, then he realizes"), ("doubtrepeated", "it turns out that he has performed it twice")]),
    ], NS)
    Q("kdparta", "Have you already started the next part of the prayer (even a recommended part, such as a recommended dhikr)?", [
        ("No, I have not started the next part", "kda1", [("doubtpartgeneral", "if he has not started the next part, he should perform it")]),
        ("Yes, I have started the next part", "kda2", [("doubtpartgeneral", "if he has started the next part (even if it is a mustaḥabb part), he should not pay attention to his doubt")]),
    ], NS)
    OUT("kda1", [t.q("doubtpartgeneral", "FULL", None)], ["he should perform it"], see=["doubttakbir", "doubtfatiha", "doubtsurah"])
    OUT("kda2", [t.q("doubtpartgeneral", "FULL", None)], ["he should not pay attention to his doubt"], see=["doubttakbir", "doubtfatiha", "doubtsurah", "doubtremembermissing"])
    Q("kdruku", "Have you already bent down for sajdah?", [
        ("No, I have not yet bent down for sajdah", "kdr1", [("doubtruku", "before bending down for sajdah")]),
        ("Yes, I am already going down for sajdah or am in it", "kdr2", [("doubtpartgeneral", "if he has started the next part")]),
    ], NS)
    OUT("kdr1", [t.q("doubtruku", "FULL", None)], ["he must perform rukū‘"])
    OUT("kdr2", [t.q("doubtpartgeneral", "FULL", None)], ["he should not pay attention to his doubt"], see=["doubtremembermissing"])
    Q("kdsaj", "Where are you now?", [
        ("In the sajdah, or getting up (before standing for the next rakʿah, or before starting tashahhud)", "kds1", [("doubtrukn", "before getting up for the second/fourth rak‘ah or before starting tashahhud")]),
        ("I have already stood up, or started the next part", "kds2", [("doubtpartgeneral", "if he has started the next part")]),
    ], NS)
    OUT("kds1", [t.q("doubtrukn", "FULL", None)], ["he must perform another sajdah"])
    OUT("kds2", [t.q("doubtpartgeneral", "FULL", None)], ["he should not pay attention to his doubt"], see=["doubtremembermissing"])
    Q("kdtash", "Where are you now?", [
        ("I am still sitting, I have not stood up yet", "kdt1", [("doubtrising", "Before standing up, if one doubts whether they have said tashahhud or not, they should say it")]),
        ("I am getting up, or have started the next part", "kdt2", [("doubtrising", "if this doubt arises while getting up, or if they have started the next, even mustaḥabb, part of the prayer, they should not pay attention to it")]),
    ], NS)
    OUT("kdt1", [t.q("doubtrising", "Before standing up", "they should say it.")], ["they should say it"])
    OUT("kdt2", [t.q("doubtrising", "However, if this doubt arises", None)], ["they should not pay attention to it"])
    OUT("kdverse", [t.q("doubtverse", "FULL", None)], ["he should not pay attention to his doubt"])
    OUT("kdcorrect", [t.q("doubtcorrectness", "FULL", None)], ["they should not pay attention to their doubt"])
    Q("kdlater", "What did you find out?", [
        ("I ignored a doubt about a part, and later realised I had not done it", "kdl1", [("doubtremembermissing", "then he realizes that he did not perform that part")]),
        ("I performed the part because of a doubt, and it turned out I had done it twice", "kdl2", [("doubtrepeated", "it turns out that he has performed it twice")]),
    ], NS)
    OUT("kdl1", [t.q("doubtremembermissing", "FULL", None)], ["he should perform it"])
    OUT("kdl2", [t.q("doubtrepeated", "FULL", None)], ["his prayer is not void"])

    # ---- the salam ----
    Q("kdsalam", "Are you engaged in taʿqīb or another prayer, or has something interrupted the prayer (such as turning away from the qiblah)?", [
        ("Yes", "kds3", [("doubtsalam", "he is engaged in saying ta‘qīb")]),
        ("No, none of these yet", "kds4", [("doubtsalam", "if he doubts before doing these things, he should say salām")]),
    ], NS)
    OUT("kds3", [t.q("doubtsalam", "FULL", "should not pay attention to doubts")], ["should not pay attention to doubts"])
    OUT("kds4", [t.q("doubtsalam", "and if he doubts before doing these things", None)], ["he should say salām"])

    # ---- after the salam ----
    Q("kdafter", "Is one of the two possibilities you are unsure between the correct number of rakʿahs for this prayer (for example four, in a four-rakʿah prayer)?", [
        ("Yes (for example four or five rakʿahs after a four-rakʿah prayer), or the doubt is about an act such as rukūʿ", "kda3", [("doubtaftersalam", "he should not pay attention to his doubt")]),
        ("No, neither possibility is the correct number (for example three or five rakʿahs after a four-rakʿah prayer)", "kda4", [("doubtaftersalaminvalid", "both sides of the doubt cause the prayer to be invalid")]),
    ], NS)
    OUT("kda3", [t.q("doubtaftersalam", "FULL", None)], ["he should not pay attention to his doubt"])
    OUT("kda4", [t.q("doubtaftersalaminvalid", "FULL", None)], ["the prayer is invalid"])

    # ---- doubting too much ----
    Q("kdexcess", "What is your situation?", [
        ("I am a person who doubts too much, and I doubt whether an act of the prayer was done", "kdx1", [("excessiveact", "must assume the occurrence of the act about which he doubts")]),
        ("I doubt too much only about one part, only in one kind of prayer, or only in one place", "kdx2", [("excessivepart", "doubts too much about only one part of prayer"), ("excessiveprayer", "doubts too much in a special prayer"), ("excessiveplace", "doubts too much in a special place")]),
        ("I am not sure whether I have become a person who doubts too much", "kdx3", [("excessiveunsure", "does not know whether he has become")]),
    ], NS)
    OUT("kdx1", [t.q("excessivedoubter", "FULL", None), t.q("excessiveact", "FULL", None)], ["must assume the occurrence of the act about which he doubts"])
    OUT("kdx2", [t.q("excessivepart", "FULL", None), t.q("excessiveprayer", "FULL", None), t.q("excessiveplace", "FULL", None)], ["he should act according to the duties of ordinary people"])
    OUT("kdx3", [t.q("excessiveunsure", "FULL", None)], ["is not ruled as such a person and must act in accordance with the rule of doubt"])

    # ---- imam / follower ----
    Q("kdimam", "Who has the doubt, and what about the other person?", [
        ("I am the imam, and a follower is sure (or thinks it more probable) it is the fourth rakʿah and tells me so", "kdm1", [("doubtimam", "the imam must finish the prayer")]),
        ("I am a follower, and the imam is sure (or thinks it more probable) of the number of rakʿahs", "kdm2", [("doubtimam", "he should not pay attention to his doubt")]),
    ], NS)
    OUT("kdm1", [t.q("doubtimam", "If an imam of congregation", "caution prayer.")], ["it is not necessary to perform the caution prayer"])
    OUT("kdm2", [t.q("doubtimam", "Also, if the imam is certain", None)], ["he should not pay attention to his doubt"])

    # ---- recommended prayers ----
    Q("kdmust", "What is the doubt about?", [
        ("The number of rakʿahs of the recommended prayer", "kdf1", [("doubtmustahabnumber", "doubts about the number of rak‘ah of a mustaḥabb prayer")]),
        ("A part of the recommended prayer (whether or not it is a rukn)", "kdf2", [("doubtmustahabpart", "doubts about a part of a mustaḥabb prayer")]),
        ("I forgot a part of the recommended prayer and remembered it later", "kdf3", [("doubtmustahabrukn", "forgets a part of nāfilah")]),
    ], NS)
    OUT("kdf1", [t.q("doubtmustahabnumber", "FULL", None)], ["he assumes the smaller number"])
    OUT("kdf2", [t.q("doubtmustahabpart", "FULL", None)], ["he should perform it", "he should not pay attention to his doubt"])
    OUT("kdf3", [t.q("doubtmustahabrukn", "FULL", None)], ["he should perform the missed part first"])

    # ---- the number of rak'ahs ----
    Q("kdrak", "How many rakʿahs does this prayer have?", [
        ("Two (for example fajr, or a traveller's shortened prayer)", "kdk2", [("doubtsinvalidating", "two-rak‘ah prayers")]),
        ("Three (maghrib)", "kdk3", [("doubtsinvalidating", "three-rak‘ah prayer")]),
        ("Four (ẓuhr, ʿaṣr, ʿishāʾ)", "kdk4", [("doubtrakahhow", "doubts about the no. of rak‘ah")]),
    ], NS)
    HEAD = ("Doubt about the number of rak‘ah makes the prayer invalid", "in the following cases:")
    OUT("kdk2", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "1. Doubt about the number of rak‘ah of two-rak‘ah", "does not invalidate them.")], ["Doubt about the number of rak‘ah of two-rak‘ah prayers"], see=["doubtinvalidthink"])
    OUT("kdk3", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "2. Doubt about the number of rak‘ah of a three-rak‘ah", "(maghrib prayer).")], ["Doubt about the number of rak‘ah of a three-rak‘ah prayer"], see=["doubtinvalidthink"])
    Q("kdk4", "After thinking about it, do you lean towards one possibility (more than fifty percent), or are the two equally likely?", [
        ("I lean towards one possibility, or am certain", "kdl3", [("doubtrakahhow", "if one side seems more probable, one should complete the prayer according to it"), ("doubtsupposition", "The probability of more than fifty percent")]),
        ("Both are equally likely (fifty-fifty)", "kdnum", [("doubtrakahhow", "if it remains fifty-fifty, one should act according to the following rulings")]),
        ("First I leaned one way, and now both seem equal", "kdnum", [("doubtsuppositionchange", "then both sides becomes equal in his opinion, he must act according to the rule of doubt")]),
    ], NS)
    OUT("kdl3", [t.q("doubtrakahhow", "FULL", None), t.q("doubtsupposition", "FULL", None)], ["one should complete the prayer according to it and the prayer is alright"])

    INV7 = "if one of these three doubts arises before finishing the second sajdah, the prayer is void"
    Q("kdnum", "Which numbers of rakʿahs are you unsure between?", [
        ("Between two and three", "kdq23", [("doubtsvalid", "شک کرے کہ دو رکعتیں پڑھی ہیں یا تین،", UR)]),
        ("Between two and four", "kdq24", [("doubtsvalid", "شک کرے کہ دو رکعتیں پڑھی ہیں یا چار", UR)]),
        ("Between two, three and four", "kdq234", [("doubtsvalid", "شک کرے کہ دو رکعتیں پڑھی ہیں یا تین یا چار", UR)]),
        ("Between three and four", "kdv4", [("doubtsvalid", "شک کرے کہ تین رکعتیں پڑھی ہیں یا چار", UR)]),
        ("Between four and five", "kdq45", [("doubtsvalid", "شک کرے کہ چار رکعتیں پڑھی ہیں یا پانچ", UR)]),
        ("Between one rakʿah and more than one (for example one or two, or one or three)", "kdinv3", [("doubtsinvalidating", "whether one has performed one rak‘ah or more")]),
        ("I don't know at all how many rakʿahs I have prayed", "kdinv5", [("doubtsinvalidating", "does not know at all how many rak‘ah he has performed")]),
        ("Some other numbers", "kdother", [("doubtsvalid", "mentioned in detailed fiqhī books")]),
    ], NS)

    def afterSajdah(qid, yes_next, ph_yes, before_ref):
        Q(qid, "Have you already raised your head from the second sajdah of the rakʿah you are in?", [
            ("Yes, I have raised my head from the second sajdah", yes_next, [("doubtsvalid", ph_yes, UR)]),
            ("No, I am before that point", before_ref, [("doubtsinvalidating", "before finishing the second sajdah")]),
        ], NS)

    afterSajdah("kdq23", "kdv1", "اگر دوسرے سجدے سے سر اٹھانے کے بعد شک کرے کہ دو رکعتیں پڑھی ہیں یا تین", "kdinv4")
    afterSajdah("kdq24", "kdv2", "اگر دوسرے سجدے سے سر اٹھانے کے بعد شک کرے کہ دو رکعتیں پڑھی ہیں یا چار", "kdinv4")
    Q("kdq234", "Have you already finished the second sajdah of the rakʿah you are in?", [
        ("Yes, I have finished the second sajdah", "kdv3", [("doubtsvalid", "اگر دوسرے سجدے کے بعد شک کرے کہ دو رکعتیں پڑھی ہیں یا تین یا چار", UR)]),
        ("No, I am before that point", "kdinv234", [("doubtsvalid", "اگر ان تین شکوک میں سے کوئی شک دوسرا سجدہ مکمل ہونے سے پہلے پیش آئے تو نماز باطل ہے", UR)]),
    ], NS)
    Q("kdq45", "Where are you in the prayer?", [
        ("I have finished the second sajdah (and am not standing for another rakʿah)", "kdv5", [("doubtsvalid", "اگر دوسرے سجدے کے بعد شک کرے کہ چار رکعتیں پڑھی ہیں یا پانچ", UR)]),
        ("I am standing, before rukūʿ", "kdv6", [("doubtsvalid", "اگر قیام کی حالت میں شک کرے کہ چار رکعتیں پڑھی ہیں یا پانچ", UR)]),
        ("I am at another point of the prayer", "kdother", [("doubtsvalid", "mentioned in detailed fiqhī books")]),
    ], NS)

    ur = lambda s, e: t.q("doubtsvalid", s, e, UR)
    SEE = ["ihtiyatmethod", "doubtvaliddontbreak"]
    OUT("kdv1", [ur("1۔ اگر دوسرے سجدے سے سر اٹھانے", "بجالائے۔")], ["نماز احتیاط"], see=SEE)
    OUT("kdv2", [ur("2۔ اگر دوسرے سجدے سے سر اٹھانے", "دو رکعت نماز احتیاط پڑھے۔")], ["دو رکعت نماز احتیاط پڑھے"], see=SEE)
    OUT("kdv3", [ur("3۔ اگر دوسرے سجدے کے بعد", "بجالائے۔"), ur("* ۔ پہلے بیان کیا جاچکا ہے", "باطل ہے۔")], ["دو رکعت نماز احتیاط کھڑے ہوکر اور دو رکعت بیٹھ کر"], see=SEE)
    OUT("kdv4", [ur("4۔ نماز کے دوران", "نماز احتیاط پڑھے۔")], ["ایک رکعت یا بیٹھ کر دو رکعت نماز احتیاط"], see=SEE)
    OUT("kdv5", [ur("5۔ اگر دوسرے سجدے کے بعد", "بجالائے۔")], ["دو سجدہ سہو"], see=["sahwmethod", "doubtvaliddontbreak"])
    OUT("kdv6", [ur("6۔ اگر قیام کی حالت", "نماز احتیاط پڑھے۔")], ["رکوع کئے بغیر بیٹھ جائے"], see=SEE)
    OUT("kdinv4", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "4. Doubt in four-rak‘ah prayers before finishing", "before completing both sajdah.")], ["before finishing the second sajdah"], see=["doubtinvalidthink"])
    OUT("kdinv234", [ur("3۔ اگر دوسرے سجدے کے بعد", "بجالائے۔"), ur("* ۔ پہلے بیان کیا جاچکا ہے", "باطل ہے۔")], ["نماز باطل ہے"], see=["doubtinvalidthink"])
    OUT("kdinv3", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "3. Doubt occurring in a four-rak‘ah prayer", "one rak‘ah or three rak‘ah.")], ["whether one has performed one rak‘ah or more"], see=["doubtinvalidthink"])
    OUT("kdinv5", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "5. Doubts in the number of rak‘ah", "he has performed.")], ["does not know at all how many rak‘ah he has performed"], see=["doubtinvalidthink"])
    t.REFER("kdother", "Ayatollah Khamenei's Rules on Prayer & Fasting list particular combinations of rakʿahs and positions, and say that further cases are in the detailed books of fiqh. "
            "Your case is not one this page can match, so it does not give an answer. Please read the whole passage in his book, or ask his office.")
    t.REFER(NS, "You said you are not sure. The page does not guess: please read the passage in Ayatollah Khamenei's Rules on Prayer & Fasting, or ask his office, so that the answer rests on what actually happened in your prayer.")
    return t
