# Decision R11 (2026-10-07): Khamenei's English and Urdu *Rules on Prayer & Fasting* are both
# translations of the same Persian edition. Every pair was read against the Persian original
# (رساله نماز و روزه, leader.ir book 180) and classified; where they disagree the Persian decides:
# the version that matches it is shown, the other is hidden, and the case is logged here.
#
#   (absent)           English, Urdu and Persian agree            -> both shown (Urdu in Urdu mode)
#   "english-withheld" English differs from the Persian; the Urdu matches -> Urdu shown in every mode
#   "urdu-withheld"    Urdu differs from the Persian; the English matches -> English only
#   "footnote-trim"    body agrees, one edition's footnote differs         -> English body only (a
#                      verbatim excerpt, footnote left out), Urdu complete with its footnote
#
# Keyed by the English book's ruling number. `reason` is audit text (data and log only): it is
# never shown to users and is never a translation of the ruling.
VERDICTS = {
    # --- English withheld ---
    465: ("english-withheld", "P15: the English says prayer on a leisure trip 'is not shortened'; the Persian (مسأله 466) and the Urdu (مسئلہ 466) say it is shortened (قصر), as do Rules 452/462. Mistranslation."),
    89: ("english-withheld", "English says 'woven with gold'; the Persian and Urdu say woven with gold OR in which gold is used (یا طلا در آن به کار رفته باشد). The English leaves out a case."),
    190: ("english-withheld", "English leaves out 'the first two rak'ahs' of fajr/maghrib/'isha' and says only men for the quiet prayers; the Persian and Urdu say men AND women for zuhr/'asr (بر مرد و زن)."),
    221: ("english-withheld", "English allows 'another dhikr' in ruku' without the Persian/Urdu exception (غیر از ذکر مخصوص سجده: not the dhikr specific to sajdah). The English is more permissive."),
    394: ("english-withheld", "English says flatly 'he should perform two sajdahs of inadvertence'; the Persian and Urdu say by obligatory caution (بنابر احتیاط واجب) for the full salam."),
    364: ("english-withheld", "English item 1 says 'three or four rak'ahs ... consider it the 3rd rak'ah, perform another rak'ah'; the Persian and Urdu say two or three (دو رکعت خوانده یا سه رکعت), which is what the rest of the item requires. The English is internally inconsistent: a mistranslation."),
    711: ("english-withheld", "English says 'by obligatory caution' (bāligh); the Persian and Urdu say only 'by caution' (بنابر احتیاط) without 'obligatory'. The type is unspecified in the source."),
    # --- Urdu withheld ---
    265: ("urdu-withheld", "Urdu gives 'gold, silver and glass' as the example of minerals; the Persian says metals and glass (فلزات و شیشه). The Urdu narrows it."),
    390: ("urdu-withheld", "Urdu says 'by mistake, thinking the prayer was finished' (one condition); the Persian says unwillingly OR thinking the prayer was finished (ناخواسته یا به خیال اینکه نماز تمام شده)."),
    588: ("urdu-withheld", "Urdu says the full prayer is due 'after the 31st day' (اکتیسویں دن کے بعد); the Persian and English say after the 30th day (بعد از روز سی ام). The Urdu shifts it by a day."),
    # --- footnote differs ---
    4: ("footnote-trim", "English footnote ends 'one should exercise caution'; the Persian/Urdu footnote adds the practical guidance (about ten minutes after the adhan begins)."),
    44: ("footnote-trim", "English footnote says the sun is above the Ka'bah on 'May 7'; the Persian (هفتم خرداد) and Urdu (28 May) give the Persian-calendar date 7 Khordad = 28 May."),
}

# English ruling number -> Persian/Urdu ruling numbers, where the English edition merges two.
MERGES = {506: [508, 509]}
