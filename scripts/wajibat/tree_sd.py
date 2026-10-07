# Sistani: prayer doubts (Islamic Laws 4th ed., Issues 1151-1257). Authored as data; quotes cut verbatim.
from helpers_dsl import Tree

NS = "sdnotsure"


def build():
    t = Tree("sistanidoubts", "doubts", "sistani", "Prayer doubts: what to do (Sayyid al-Sistani)",
             "Answer a few questions about your situation and this page will show the passage of Sayyid al-Sistani's Islamic Laws that applies. "
             "It never gives a ruling of its own: every answer is his own wording. If a question doesn't fit your case, choose \"I'm not sure\".",
             {"book": "Islamic Laws (4th edition)", "location": "Issues 1151–1257, \"Doubts that arise in prayers\"",
              "url": "https://www.sistani.org/english/book/48/2251/"}, "sdroot")
    Q, OUT = t.Q, t.OUT

    Q("sdroot", "What are you unsure about?", [
        ("Whether I have prayed this prayer at all, or prayed it correctly (the prayer is over)", "sdprayed", [("doubtprayeritself", "after the time for prayers has expired")]),
        ("Whether I did an act of the prayer (for example al-Ḥamd, rukūʿ, a sajdah, tashahhud), and I am still in the prayer", "sdact", [("doubtpartgeneral", "performed a certain obligatory act of the prayer")]),
        ("How many rakʿahs I have prayed, and I am still in the prayer", "sdrak", [("doubtsinvalidating", "a doubt about the number of rakʿahs performed")]),
        ("Whether I said the salām", "sdsalam", [("doubtsalam", "doubts whether or not he said the salām of the prayer")]),
        ("A doubt that came after I finished the prayer (after the salām)", "sdafter", [("doubtaftersalam", "doubts after the salām of the prayer")]),
        ("I doubt much more than people like me do (an excessive doubter)", "sdexcess", [("excessivedoubter", "doubts more than usual")]),
        ("I am praying in congregation (as imam or as follower)", "sdimam", [("doubtimam", "congregational prayer")]),
        ("It is a recommended (nāfilah) prayer", "sdnafilah", [("doubtmustahabnumber", "recommended prayer")]),
    ], NS)

    # ---- the prayer itself / after the time ----
    Q("sdprayed", "Has the time for this prayer already ended?", [
        ("No, I am still within its time, and I doubt whether I prayed it", "sdp1", [("doubtprayeritself", "before the time for prayers has expired he doubts whether or not he performed it")]),
        ("Yes, its time has ended, and I doubt whether I prayed it", "sdp2", [("doubtprayeritself", "after the time for prayers has expired one doubts whether or not he performed the prayer")]),
        ("Yes, its time has ended, and I doubt whether I prayed it correctly", "sdp3", [("doubtaftertime", "after the time for prayers has expired one doubts whether or not he performed the prayer correctly")]),
        ("Its time has ended; I know I prayed four rakʿahs but not whether as ẓuhr or ʿaṣr", "sdp4", [("doubtzuhrasr", "does not know whether he performed it with the intention of ẓuhr or ʿaṣr")]),
        ("Its time has ended; I know I prayed but not whether it was three or four rakʿahs (maghrib or ʿishāʾ)", "sdp5", [("doubtmaghribisha", "does not know whether he performed a three or four rakʿah prayer")]),
    ], NS)
    OUT("sdp1", [t.q("doubtprayeritself", "However, if before the time", None)], ["he must perform it even if he supposes he has done so"])
    OUT("sdp2", [t.q("doubtprayeritself", "If after the time for prayers has expired one doubts", "it is not necessary for him to perform that prayer.")], ["it is not necessary for him to perform that prayer"])
    OUT("sdp3", [t.q("doubtaftertime", "FULL", None)], ["he must dismiss his doubt"])
    OUT("sdp4", [t.q("doubtzuhrasr", "FULL", None)], ["he must perform another four rakʿah prayer"])
    OUT("sdp5", [t.q("doubtmaghribisha", "FULL", None)], ["he must make up both the maghrib and ʿishāʾ prayers"])

    # ---- an act of the prayer ----
    Q("sdact", "Is the act you doubt a rukn of the prayer (rukūʿ, or the two sajdahs together), or another act (al-Ḥamd, the surah, tashahhud, the dhikr)?", [
        ("A rukn (for example rukūʿ or the two sajdahs)", "sdrukn", [("doubtrukn", "one of the rukns of prayers")]),
        ("An act that is not a rukn (for example al-Ḥamd or the surah)", "sdnonrukn", [("doubtfatiha", "an act that is not a rukn of the prayer")]),
        ("A part inside something I was reciting (a verse, or whether the dhikr or stillness was done properly)", "sdinside", [("doubtverse", "recited the previous verse"), ("doubtcorrectness", "such as dhikr and keeping the body still")]),
    ], NS)
    Q("sdrukn", "Have you already started the act that comes after it?", [
        ("No, I have not started the next act", "sdr1", [("doubtrukn", "in the event that he has not started to perform the act after it")]),
        ("Yes, I have started the next act", "sdr2", [("doubtpartgeneral", "he must dismiss his doubt"), ("doubtremembermissing", "he then dismisses his doubt but later remembers")]),
    ], NS)
    OUT("sdr1", [t.q("doubtrukn", "FULL", None)], ["he must perform it"], see=["doubtremembermissing"])
    OUT("sdr2", [t.q("doubtpartgeneral", "in the event that he has started", None), t.q("doubtremembermissing", "FULL", None)], ["he must dismiss his doubt"])
    Q("sdnonrukn", "Have you already started the act that comes after it?", [
        ("No, I have not started the next act", "sdn1", [("doubtfatiha", "in the event that he has not started to perform the act after it, he must perform it")]),
        ("Yes, I have started the next act", "sdn2", [("doubtsurah", "in the event that he has started to perform the next act, he must dismiss his doubt")]),
    ], NS)
    OUT("sdn1", [t.q("doubtfatiha", "FULL", None)], ["he must perform it"])
    OUT("sdn2", [t.q("doubtsurah", "FULL", None)], ["he must dismiss his doubt"])
    Q("sdinside", "Which of these is it?", [
        ("I doubt whether I recited the previous verse, or the beginning of the verse I am reciting", "sdi1", [("doubtverse", "doubts whether or not he recited the previous verse")]),
        ("After rukūʿ or sajdah I doubt whether I did its dhikr or kept my body still", "sdi2", [("doubtcorrectness", "such as dhikr and keeping the body still")]),
    ], NS)
    OUT("sdi1", [t.q("doubtverse", "FULL", None)], ["he must dismiss his doubt"])
    OUT("sdi2", [t.q("doubtcorrectness", "FULL", None)], ["he must dismiss his doubt"])

    # ---- the salam ----
    Q("sdsalam", "Have you started reciting taʿqībāt or another prayer, or done something that invalidates prayers?", [
        ("Yes", "sds1", [("doubtsalam", "he has started reciting taʿqībāt")]),
        ("No, none of these yet", "sds2", [("doubtsalam", "If his doubt arises before he has performed these, he must say the salām.")]),
    ], NS)
    OUT("sds1", [t.q("doubtsalam", "If a person doubts whether or not he said the salām", "he must dismiss his doubt.")], ["he must dismiss his doubt"])
    OUT("sds2", [t.q("doubtsalam", "If his doubt arises", "he must say the salām.")], ["he must say the salām"])

    # ---- after the salam ----
    Q("sdafter", "What is the doubt about?", [
        ("Whether the prayer I just finished was valid, or how many rakʿahs I prayed", "sda1", [("doubtaftersalam", "whether or not his prayer was valid")]),
        ("I know I had a doubt during the prayer, but not whether it was one that invalidates the prayer", "sda2", [("doubtafterprayerkind", "does not know whether it was a doubt that invalidates the prayer or not")]),
    ], NS)
    Q("sda1", "Is one of the two possibilities you are unsure between the correct number of rakʿahs for this prayer (for example four, in a four-rakʿah prayer)?", [
        ("Yes (for example four or five rakʿahs after a four-rakʿah prayer), or the doubt is about an act such as rukūʿ", "sda3", [("doubtaftersalam", "he must dismiss his doubt")]),
        ("No, neither possibility is the correct number (for example three or five rakʿahs after a four-rakʿah prayer)", "sda4", [("doubtaftersalam", "each possibility would mean his prayer is invalid")]),
    ], NS)
    OUT("sda3", [t.q("doubtaftersalam", "If a person doubts after the salām", "he must dismiss his doubt.")], ["he must dismiss his doubt"])
    OUT("sda4", [t.q("doubtaftersalam", "However, if both sides", None)], ["his prayer is invalid"])
    OUT("sda2", [t.q("doubtafterprayerkind", "FULL", None)], ["he must perform the prayer again"])

    # ---- excessive doubter ----
    Q("sdexcess", "What is your situation?", [
        ("I doubt whether an act of the prayer was done (a person who is an excessive doubter)", "sdx1", [("excessiveact", "doubts whether or not he has performed an obligatory component")]),
        ("My excessive doubting is only about one act, or only in one prayer, or only in one place", "sdx2", [("excessivepart", "only with regard to that particular act"), ("excessiveprayer", "only with regard to that particular prayer"), ("excessiveplace", "only when he performs prayers in a particular place")]),
        ("I am not sure whether I have become an excessive doubter (or whether I have stopped being one)", "sdx3", [("excessiveunsure", "doubts whether or not he has become an excessive doubter")]),
        ("I dismissed a doubt as an excessive doubter and later realised I had not done the act", "sdx4", [("excessiverukn", "dismisses his doubt but later realises"), ("excessivenonrukn", "dismisses it and later realises")]),
    ], NS)
    OUT("sdx1", [t.q("excessivedoubter", "FULL", None), t.q("excessiveact", "FULL", None)], ["he must assume he has performed it"])
    OUT("sdx2", [t.q("excessivepart", "FULL", None), t.q("excessiveprayer", "FULL", None), t.q("excessiveplace", "FULL", None)], ["he must act according to the instructions"])
    OUT("sdx3", [t.q("excessiveunsure", "FULL", None)], ["he must act according to the instructions concerning doubts"])
    OUT("sdx4", [t.q("excessiverukn", "FULL", None), t.q("excessivenonrukn", "FULL", None)], ["his prayer is invalid based on obligatory precaution", "his prayer is valid"])

    # ---- imam / follower ----
    Q("sdimam", "Who has the doubt, and what about the other person?", [
        ("I am the imam, and a follower is sure (or supposes) it is the fourth rakʿah and tells me so", "sdm1", [("doubtimam", "makes it known to the imam that he has performed four rakʿahs")]),
        ("I am a follower, and the imam is sure (or supposes) of the number of rakʿahs", "sdm2", [("doubtimam", "the follower must dismiss his doubt")]),
    ], NS)
    OUT("sdm1", [t.q("doubtimam", "If an imam of a congregational prayer", "ṣalāt al‑iḥtiyāṭ.")], ["it is not necessary for him to perform ṣalāt al‑iḥtiyāṭ"])
    OUT("sdm2", [t.q("doubtimam", "Similarly, if the imam is certain", None)], ["the follower must dismiss his doubt"])

    # ---- nafilah ----
    Q("sdnafilah", "What is the doubt about?", [
        ("The number of rakʿahs of the recommended prayer", "sdf1", [("doubtmustahabnumber", "doubt about the number of rakʿahs he has performed in a recommended prayer")]),
        ("An act of the recommended prayer", "sdf2", [("doubtmustahabpart", "one of the acts of nāfilah prayers")]),
        ("Whether I prayed a recommended prayer at all", "sdf3", [("doubtmustahabprayed", "doubts whether or not he has performed a recommended prayer")]),
    ], NS)
    OUT("sdf1", [t.q("doubtmustahabnumber", "FULL", None)], ["he must assume the lesser number is correct"])
    OUT("sdf2", [t.q("doubtmustahabpart", "FULL", None)], ["he must perform it", "he must dismiss his doubt"])
    OUT("sdf3", [t.q("doubtmustahabprayed", "FULL", None)], ["he must assume he has not performed it", "he must dismiss his doubt"])

    # ---- number of rak'ahs ----
    Q("sdrak", "How many rakʿahs does this prayer have?", [
        ("Two (for example ṣubḥ, or a traveller's shortened prayer)", "sdk2", [("doubtsinvalidating", "prayers consisting of two rakʿahs")]),
        ("Three (maghrib)", "sdk3", [("doubtsinvalidating", "prayers consisting of three rakʿahs")]),
        ("Four (ẓuhr, ʿaṣr, ʿishāʾ)", "sdk4", [("doubtsvalid", "a four rakʿah prayer")]),
    ], NS)
    OUT("sdk2", [t.q("doubtsinvalidating", "The following are doubts that invalidate prayers:", "invalidate prayers:"), t.q("doubtsinvalidating", "1. a doubt about the number of rakʿahs performed in obligatory prayers consisting of two", "does not invalidate them;")],
        ["a doubt about the number of rakʿahs performed in obligatory prayers consisting of two rakʿahs"], see=["doubtinvalidthink"])
    OUT("sdk3", [t.q("doubtsinvalidating", "The following are doubts that invalidate prayers:", "invalidate prayers:"), t.q("doubtsinvalidating", "2. a doubt about the number of rakʿahs performed in prayers consisting of three", "three rakʿahs;")],
        ["a doubt about the number of rakʿahs performed in prayers consisting of three rakʿahs"], see=["doubtinvalidthink"])
    Q("sdk4", "After thinking about it, do you lean towards one possibility (more than fifty percent), or are the two equally likely?", [
        ("I lean towards one possibility, or am certain", "sdl1", [("doubtsvalid", "he becomes certain or he supposes that a particular possibility is correct"), ("doubtsupposition", "The rule concerning suppositions")]),
        ("Both are equally likely", "sdnum", [("doubtsvalid", "otherwise, he must act according to the instructions that will be mentioned later")]),
        ("First I leaned one way, and now both seem equal", "sdnum", [("doubtsuppositionchange", "later both possibilities appear equal to him")]),
        ("I can't tell whether I lean one way or whether both are equal", "sdnum", [("doubtsuppositionunsure", "does not know if his supposition is inclined more towards one of two possibilities")]),
    ], NS)
    OUT("sdl1", [t.q("doubtsvalid", "In nine situations", "instructions that will be mentioned later."), t.q("doubtsupposition", "The rule concerning suppositions", "the rule concerning certainty;"), t.q("doubtsupposition", "If in a four rakʿah prayer he has a supposition", "is not necessary.")],
        ["he must act according to that possibility and complete the prayer", "is the same as the rule concerning certainty"])
    numbers(t)
    return t


def numbers(t):
    """The 'which numbers' screen and its follow-ups (equal doubt in a four-rakʿah prayer)."""
    Q, OUT = t.Q, t.OUT
    INV = "In each case, if any of these four doubts arise"
    inval = lambda: t.q("doubtsvalid", INV, "his prayer is invalid.")
    Q("sdnum", "Which numbers of rakʿahs are you unsure between?", [
        ("Between two and three", "sdq23", [("doubtsvalid", "doubts whether he has performed two rakʿahs or three rakʿahs")]),
        ("Between two and four", "sdq24", [("doubtsvalid", "doubts whether he has performed two rakʿahs or four rakʿahs")]),
        ("Between two, three and four", "sdq234", [("doubtsvalid", "doubts whether he has performed two, three, or four rakʿahs")]),
        ("Between three and four", "sdo5", [("doubtsvalid", "doubts whether he has performed three or four rakʿahs")]),
        ("Between four and five", "sdq45", [("doubtsvalid", "doubts whether he has performed four or five rakʿahs")]),
        ("Between four and six", "sdq46", [("doubtsvalid", "he doubts whether he has performed four or six rakʿahs")]),
        ("Between three and five", "sdq35", [("doubtsvalid", "doubts whether he has performed three or five rakʿahs")]),
        ("Between three, four and five", "sdq345", [("doubtsvalid", "doubts whether he has performed three, four, or five rakʿahs")]),
        ("Between five and six", "sdq56", [("doubtsvalid", "doubts whether he has performed five or six rakʿahs")]),
        ("Between one rakʿah and more than one", "sdinv1", [("doubtsinvalidating", "whether one has performed one rakʿah or more")]),
        ("Between two and five", "sdinv5", [("doubtsinvalidating", "whether one has performed two or five rakʿahs")]),
        ("Between three and six", "sdinv6", [("doubtsinvalidating", "whether one has performed three or six rakʿahs")]),
        ("I don't know at all how many rakʿahs I have prayed", "sdinv7", [("doubtsinvalidating", "does not know at all how many rakʿahs he has performed")]),
        ("Some other numbers", "sdother", [("doubtsvalid", "In nine situations")]),
    ], NS)

    def sajdah2(qid, yes_next):
        Q(qid, "Have you started the second sajdah of the rakʿah you are in?", [
            ("Yes, I have started the second sajdah (or finished it)", yes_next, [("doubtsvalid", "after starting the second sajdah")]),
            ("No, I am before the second sajdah", "sdinvb", [("doubtsvalid", "after the first sajdah and before performing the second sajdah, his prayer is invalid")]),
        ], NS)

    sajdah2("sdq23", "sdv1")
    sajdah2("sdq24", "sdv2")
    sajdah2("sdq234", "sdv3")
    OUT("sdv1", [t.q("doubtsvalid", "First: after starting", "will not suffice.")], ["he must perform one rakʿah of ṣalāt al‑iḥtiyāṭ in a standing position"], see=["ihtiyatmethod", "doubtvaliddontbreak"])
    OUT("sdv2", [t.q("doubtsvalid", "Second: after starting", "in a standing position.")], ["he must perform two rakʿahs of ṣalāt al‑iḥtiyāṭ in a standing position"], see=["ihtiyatmethod", "doubtvaliddontbreak"])
    OUT("sdv3", [t.q("doubtsvalid", "Third: after starting", "in a sitting position.")], ["followed by two rakʿahs in a sitting position"], see=["ihtiyatmethod", "doubtvaliddontbreak"])
    OUT("sdinvb", [inval()], ["his prayer is invalid"], see=["doubtinvalidthink"])
    Q("sdq45", "Where are you in the prayer?", [
        ("I have started the second sajdah (or finished it)", "sdv4", [("doubtsvalid", "after starting the second sajdah, one doubts whether he has performed four or five rakʿahs")]),
        ("I am standing", "sdv6", [("doubtsvalid", "while standing, one doubts whether he has performed four or five rakʿahs")]),
        ("I am after the first sajdah, before the second", "sdinvb", [("doubtsvalid", "after the first sajdah and before performing the second sajdah, his prayer is invalid")]),
    ], NS)
    sajdah2("sdq46", "sdv4b")
    OUT("sdv4", [t.q("doubtsvalid", "Fourth: after starting", "more than four rakʿahs.")], ["he must perform sajdatā al‑sahw"], see=["sahwmethod", "ihtiyatmethod"])
    OUT("sdv4b", [t.q("doubtsvalid", "Similarly, whenever the weaker possibility", "more than four rakʿahs.")], ["sajdatā al‑sahw based on the possibility that he had performed more than four rakʿahs"], see=["sahwmethod", "ihtiyatmethod"])
    OUT("sdo5", [t.q("doubtsvalid", "Fifth: at any stage", "two rakʿahs in a sitting position.")], ["one rakʿah of ṣalāt al‑iḥtiyāṭ in a standing position or two rakʿahs in a sitting position"], see=["ihtiyatmethod", "doubtvaliddontbreak"])
    OUT("sdv6", [t.q("doubtsvalid", "Sixth: while standing", "two rakʿahs in a sitting position.")], ["he must sit down, say tashahhud and the salām of the prayer"], see=["ihtiyatmethod", "doubtvaliddontbreak"])

    def standing(qid, yes_next, phrase):
        Q(qid, "Are you standing (before going into rukūʿ)?", [
            ("Yes, I am standing", yes_next, [("doubtsvalid", phrase)]),
            ("No, I am at another point of the prayer", "sdother", [("doubtsvalid", "In nine situations")]),
        ], NS)
    standing("sdq35", "sdv7", "while standing, one doubts whether he has performed three or five rakʿahs")
    standing("sdq345", "sdv8", "while standing, one doubts whether he has performed three, four, or five rakʿahs")
    standing("sdq56", "sdv9", "while standing, one doubts whether he has performed five or six rakʿahs")
    OUT("sdv7", [t.q("doubtsvalid", "Seventh: while standing", "in a standing position.")], ["perform two rakʿahs of ṣalāt al‑iḥtiyāṭ in a standing position"], see=["ihtiyatmethod", "doubtvaliddontbreak"])
    OUT("sdv8", [t.q("doubtsvalid", "Eighth: while standing", "in a sitting position.")], ["then perform two rakʿahs in a sitting position"], see=["ihtiyatmethod", "doubtvaliddontbreak"])
    OUT("sdv9", [t.q("doubtsvalid", "Ninth: while standing", "sajdatā al‑sahw.")], ["perform sajdatā al‑sahw"], see=["sahwmethod", "doubtvaliddontbreak"])

    SEE = ["doubtinvalidthink"]
    HEAD = ("The following are doubts that invalidate prayers:", "invalidate prayers:")
    OUT("sdinv1", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "3. a doubt about whether one has performed one rakʿah", "four rakʿahs;")], ["a doubt about whether one has performed one rakʿah or more in a prayer consisting of four rakʿahs"], see=SEE)
    OUT("sdinv5", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "5. a doubt about whether one has performed two or five", "than five rakʿahs;")], ["a doubt about whether one has performed two or five rakʿahs"], see=SEE)
    OUT("sdinv6", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "6. a doubt about whether one has performed three or six", "than six rakʿahs;")], ["a doubt about whether one has performed three or six rakʿahs"], see=SEE)
    OUT("sdinv7", [t.q("doubtsinvalidating", *HEAD), t.q("doubtsinvalidating", "7. a doubt about the number of rakʿahs when one does not know", "has performed;")], ["does not know at all how many rakʿahs he has performed"], see=SEE)
    t.REFER("sdother", "Sayyid al-Sistani's list of doubts that need no action, or that call for ṣalāt al-iḥtiyāṭ or sajdatā al-sahw, covers particular combinations of rakʿahs and positions. "
            "Your case is not one of the cases this page can match, so it does not give an answer. Please read the whole passage in his book, or ask his office.")
    t.REFER(NS, "You said you are not sure. The page does not guess: please read the passage in Sayyid al-Sistani's Islamic Laws, or ask his office, so that the answer rests on what actually happened in your prayer.")
    return t
