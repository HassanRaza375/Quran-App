# Phase 5 generator: Sawm (fasting) and zakāt al-fiṭrah.
# Every text is looked up verbatim in the downloaded official sources (entries.py) — nothing is retyped:
#   Sistani:  Islamic Laws 4th ed., Rulings 1529-1718 (Chapter Four, Fasting; sistani.org pages 2278-2300)
#             and 2003-2044 (zakāt al-fiṭrah; pages 2328-2330) / توضیح المسائل (Urdu pages 3644 and 3646).
#             Revised (*) rulings were compared with the Urdu one by one (P6): all seven lag.
#   Khamenei: The Rules on Prayer & Fasting 2023, rulings 787-981 (first priority, R6). The i'tikāf
#             rulings (982-1009) belong to a later phase. His official books have no zakāt al-fiṭrah
#             ruling (Rules, Q&A and the Urdu treatise were searched), so that topic has no Khamenei entry.
# Pairing: one Ruling per point, holding each marja's own ruling on it. A point only one book states gets
# one entry; where the other marja's book states it inside another ruling of the same topic, `see_also`
# points there instead of "not added yet".
import sys
from entries import *  # S(), K(), R(), RULINGS

OUT = sys.argv[1]
W = dict(sensitive=True)   # women-specific rulings: collapsed by default (decision Q8)

# ======================= WHO MUST FAST =======================
T = "sawmwho"
R("sawmconditions", T, "Conditions for fasting in Ramadan to be obligatory", K(787))
R("sawmwhonot", T, "Who is not obliged to fast", K(788))
R("sawmbulugh", T, "A child who reaches bulūgh in Ramadan", S(1541), K(789))
R("sawmgirls", T, "Girls who have just reached bulūgh", K(790), **W)
R("sawmkafir", T, "A disbeliever who becomes a Muslim during a day of Ramadan", S(1545))
R("sawmsickrecovers", T, "A sick person who recovers during a day of Ramadan", S(1546), K(795), differs=True)

# ======================= ILLNESS, HARM, AGE, PREGNANCY, BREASTFEEDING =======================
T = "sawmexempt"
R("sawmharm", T, "When fasting is harmful", S(1712), K(792))
R("sawmdoctor", T, "Recognising harm: one's own judgement and a doctor's advice", S(1711), K(794))
R("sawmharmafter", T, "Finding out after maghrib that the fast was harmful", S(1713), K(793))
R("sawmthirst", T, "An illness that causes great thirst", S(1696), K(959))
R("sawmthirstextreme", T, "Extreme thirst during the fast", S(1560))
R("sawmweakness", T, "Weakness during the fast", S(1562, urdu="lag"), K(831))
R("sawmold", T, "Old age", S(1694, urdu="lag"), K(958), differs=True)
R("sawmoldafter", T, "Someone excused because of old age who is able to fast later", S(1695))
R("sawmpregnant", T, "A pregnant woman", S(1697), K(954), **W)
R("sawmbreastfeeding", T, "A woman who is breastfeeding", S(1698), K(955), **W)
R("sawmpregnantdelay", T, "Making up the fasts missed in pregnancy or breastfeeding", K(956), **W)
R("sawmfidyahwho", T, "Who pays the fidyah or kaffārah of a wife or child", K(957))
R("sawmfidyahamount", T, "The amount of the fidyah", K(960))

# ======================= THE INTENTION =======================
T = "sawmniyyah"
R("sawmrequires", T, "What a fast requires", K(800))
R("sawmintentwhat", T, "What the intention is", S(1529), K(801))
R("sawmintentnight", T, "Making the intention on the nights of Ramadan", S(1530), K(806))
R("sawmintentlatest", T, "The latest time to make the intention for a fast of Ramadan", S(1531), K(805))
R("sawmintentkind", T, "Specifying the kind of fast", S(1534), K(802))
R("sawmintentduty", T, "Knowing that a fast is owed but not which kind", K(803))
R("sawmintentother", T, "Intending a fast other than Ramadan's during Ramadan", S(1535), K(808))
R("sawmintentsleep", T, "Making the intention at night and then sleeping through the dawn", S(1539), K(807))
R("sawmintentnone", T, "Sleeping before dawn without making the intention", S(1533))
R("sawmintentdeliberate", T, "Deliberately not making the intention until dawn", K(809))
R("sawmintentforgot", T, "Not knowing, or forgetting, that it is Ramadan", S(1540), K(810), differs=True)
R("sawmintentday", T, "Fasting with the intention of the wrong day of Ramadan", S(1536))
R("sawmintentunconscious", T, "Becoming unconscious during the day after making the intention", S(1537, urdu="lag"))
R("sawmintentintoxicated", T, "Becoming intoxicated during the day after making the intention", S(1538))
R("sawmintentassigned", T, "An assigned fast other than Ramadan's", S(1543), K(811))
R("sawmintentfree", T, "A fast that is not assigned to a day", S(1544), K(812))
R("sawmintentrecommended", T, "Making the intention for a recommended fast during the day", S(1532), K(813))
R("sawmdoubtday", T, "A day on which it is doubtful whether it is Sha‘bān or Ramadan", S(1547), K(804))
R("sawmdoubtdayfound", T, "Finding out during the day that it was the first of Ramadan", S(1548))
R("sawmintentcontinue", T, "Hesitating or deciding to break an assigned obligatory fast", S(1549), K(815))
R("sawmintentreturn", T, "Turning away from the intention to fast during the day", K(814))
R("sawmintentbreak", T, "Deciding to break a recommended or unassigned fast", S(1550), K(816))

# ======================= WHAT INVALIDATES THE FAST =======================
T = "sawmmubtilat"
R("sawmlist", T, "The things that invalidate a fast", S(1551), K(817), differs=True)
R("sawmeating", T, "Eating and drinking on purpose", S(1552), K(818))
R("sawmeatingdawn", T, "Realising while eating that it is dawn", S(1553), K(827))
R("sawmeatingforgot", T, "Eating or drinking by mistake", S(1554), K(819))
R("sawminjections", T, "Injections, drips and medicines", S(1555), K(823), differs=True)
R("sawmspray", T, "A spray for shortness of breath", K(863), see_also={"sistani": "sawminjections"})
R("sawmpills", T, "Taking pills", K(825))
R("sawmsublingual", T, "A pill placed under the tongue", K(826))
R("sawmteeth", T, "Swallowing food stuck between the teeth", S(1556), K(820))
R("sawmtoothpick", T, "Using a toothpick before dawn", S(1557))
R("sawmsaliva", T, "Swallowing saliva", S(1558), K(821))
R("sawmmucus", T, "Mucus of the head and chest", S(1559), K(822))
R("sawmbleeding", T, "Bleeding in the mouth", K(828))
R("sawmbleedingsaliva", T, "Blood from the gums dissolved in saliva", K(829))
R("sawmtasting", T, "Chewing or tasting food", S(1561), K(830))
R("sawmintercourse", T, "Sexual intercourse", S(1563), K(832))
R("sawmintercoursepartial", T, "Less than full penetration", S(1564))
R("sawmintercoursedoubt", T, "Doubting whether there was penetration", S(1565))
R("sawmintercourseforgot", T, "Intercourse by one who forgot the fast, or under compulsion", S(1566), K(833))
R("sawmmasturbation", T, "Causing semen to be discharged", S(1567), K(834))
R("sawmcourtship", T, "Intending to discharge semen but not discharging", S(1573), K(835))
R("sawmcourtshipno", T, "Courtship without the intention to ejaculate", S(1574))
R("sawminvoluntary", T, "Semen discharged involuntarily", S(1568), K(836))
R("sawmwetdreamsleep", T, "Sleeping when one knows a wet dream may follow", S(1569), K(837))
R("sawmwetdreamwake", T, "Waking up while semen is being discharged", S(1570), K(838))
R("sawmwetdreamurinate", T, "Urinating after a wet dream", S(1571))
R("sawmwetdreamresidue", T, "Semen remaining in the penis after a wet dream", S(1572))
R("sawmwetdreamghusl", T, "Ghusl after a wet dream during the day", S(1603), K(839))
R("sawmlying", T, "Ascribing a falsehood to Allah, the Prophet or the Imams", S(1575), K(857))
R("sawmlyingreport", T, "Reporting a narration one is not sure of", S(1576), K(858))
R("sawmlyingbelief", T, "Quoting something believing it true, then finding it false", S(1577), K(859))
R("sawmlyingtrue", T, "Ascribing what one knows to be false, then finding it was true", S(1578), K(860))
R("sawmlyingfabricated", T, "Ascribing what another person fabricated", S(1579))
R("sawmlyingask", T, "Answering falsely when asked whether the Prophet said something", S(1580), K(861))
R("sawmlyingrepent", T, "Saying “I lied” after quoting correctly", S(1581))
R("sawmdust", T, "Thick dust reaching the throat", S(1582), K(862))
R("sawmdustthin", T, "Dust that is not thick, or that does not reach the throat", S(1583), K(864))
R("sawmdustcare", T, "Not taking care when thick dust appears", S(1584, urdu="lag"), K(865))
R("sawmsmoke", T, "The smoke of cigarettes and tobacco", S(1585), K(824))
R("sawmdustdoubt", T, "Dust or smoke that one was sure would not reach the throat", S(1586))
R("sawmdustforgot", T, "Dust reaching the throat by mistake or involuntarily", S(1587), K(866))
R("sawmhead", T, "Immersing the whole head in water", S(1588), K(867), differs=True)
R("sawmheadbody", T, "Immersing the head with or without the body", K(868))
R("sawmheadhalf", T, "Immersing the head half at a time", K(869))
R("sawmheadhair", T, "Some of the hair left out of the water", K(870))
R("sawmheaddoubt", T, "Doubting whether the whole head was under water", K(871))
R("sawmheadfell", T, "Falling into water, or forgetting the fast", K(872))
R("sawmshower", T, "Pouring water over the head or standing under a shower", K(873))
R("sawmenema", T, "A liquid enema", S(1615), K(854))
R("sawmvomit", T, "Vomiting on purpose", S(1616), K(855))
R("sawmvomitnight", T, "Eating at night what is known to cause vomiting", S(1617))
R("sawmvomitsick", T, "Feeling sick and not restraining oneself from vomiting", S(1618))
R("sawmswallowed", T, "Food or small items that go down the throat", S(1619))
R("sawmswallowedforgot", T, "Swallowing by mistake and remembering before it reaches the stomach", S(1620))
R("sawmburpcertain", T, "Burping when certain that it will amount to vomiting", S(1621))
R("sawmburp", T, "Something that comes up while burping", S(1622), K(856))
R("sawmintentional", T, "Only what is done intentionally and voluntarily invalidates the fast", S(1623), K(874))
R("sawmrepeat", T, "Doing it again believing the fast is already invalid", S(1624), K(875))
R("sawmforced", T, "Being forced to break the fast", S(1625), K(876))
R("sawmforcedplace", T, "Going where one will be forced to break the fast", S(1626))
R("sawmdoubtdone", T, "Doubting whether one did something that invalidates the fast", K(877))
R("sawmmakruh", T, "Acts that are disapproved for a fasting person", S(1627), K(878))

# ======================= JANĀBAH, ḤAYḌ, NIFĀS =======================
T = "sawmjanabah"
R("sawmjunubonpurpose", T, "Remaining junub on purpose until dawn in Ramadan", S(1589), K(840), differs=True)
R("sawmjunubqada", T, "Remaining junub until dawn when keeping a qaḍāʾ fast of Ramadan", S(1590), K(842))
R("sawmjunubother", T, "Remaining junub until dawn when keeping another fast", S(1591))
R("sawmjunubtayammum", T, "When there is no time for ghusl: tayammum", S(1592), K(847))
R("sawmjunubforgot", T, "Forgetting the ghusl of janābah", S(1593), K(845))
R("sawmjunubmake", T, "Becoming junub on purpose when there is no time for ghusl or tayammum", S(1594), K(848))
R("sawmjunubmaketayammum", T, "Becoming junub on purpose when only tayammum is possible", S(1595), K(849))
R("sawmjunubsleepknow", T, "Going to sleep while junub, knowing one will not wake before dawn", S(1596), K(844))
R("sawmjunubsleepprobable", T, "Going to sleep again when one expects to wake before dawn", S(1597))
R("sawmjunubsleepexpect", T, "Expecting to wake and perform ghusl, but sleeping through the dawn", S(1598), K(841))
R("sawmjunubsleepunmindful", T, "Going to sleep while junub, not thinking of ghusl", S(1599))
R("sawmjunubsleepagain", T, "Waking up while junub, not wanting ghusl, and sleeping again", S(1600), K(843))
R("sawmjunubsleepsecond", T, "Not waking from the second sleep", S(1601), K(902))
R("sawmjunubfirstsleep", T, "The sleep in which a wet dream took place", S(1602))
R("sawmjunubdoubt", T, "Doubting whether remaining junub invalidates the fast", K(846))
R("sawmjunubwetdream", T, "Waking after dawn and finding a wet dream", S(1604))
R("sawmjunubwetdreamqada", T, "Finding a wet dream after dawn when keeping a qaḍāʾ fast", S(1605))
R("sawmhaydfast", T, "Ḥayḍ or nifās and the fast", S(1610), K(791), **W)
R("sawmhaydstops", T, "A woman who becomes clean after dawn", K(852), see_also={"sistani": "sawmhaydfast"}, **W)
R("sawmhaydbegins", T, "A woman who has ḥayḍ or gives birth while fasting", K(851), see_also={"sistani": "sawmhaydfast"}, **W)
R("sawmhaydbefore", T, "Ghusl for ḥayḍ or nifās before dawn", S(1606), K(850), **W)
R("sawmhaydtayammum", T, "When there is no time for ghusl after ḥayḍ or nifās", S(1607), **W)
R("sawmhaydtime", T, "Becoming clean without time for ghusl", S(1608), **W)
R("sawmhaydnear", T, "Becoming clean near dawn", S(1609), **W)
R("sawmhaydforgot", T, "Forgetting the ghusl of ḥayḍ or nifās", S(1611), K(853), **W)
R("sawmhaydnegligent", T, "Being negligent in performing the ghusl", S(1612), **W)
R("sawmistihadah", T, "Istiḥāḍah and the fast", S(1613), **W)
R("sawmcorpse", T, "Touching a corpse", S(1614))

# ======================= DAWN, MAGHRIB AND BREAKING THE FAST =======================
T = "sawmtimes"
R("sawmdawndoubt", T, "Doubting whether it is dawn", S(1662, cut=("However, if one doubts whether it is ṣubḥ or not", "even before investigating.")), K(904))
R("sawmdawninvestigate", T, "Doing something that invalidates the fast without being sure it is dawn", S(1661), K(905))
R("sawmmaghribdoubt", T, "Doubting whether it is maghrib", S(1662, cut=("One cannot break his fast if he merely doubts", "whether it is maghrib or not.")), K(906))
R("sawmmaghribwrong", T, "Breaking the fast, then finding it was not maghrib", K(907))
R("sawmmaghribcloud", T, "Thinking it is maghrib because of clouds", K(908))
R("sawmprayerfirst", T, "Praying before breaking the fast", S(1718), K(980))
R("sawmabstain", T, "Abstaining from what invalidates a fast when one is not fasting", S(1717), K(981))

# ======================= KAFFĀRAH =======================
T = "sawmkaffarah"
R("sawmkaffwhen", T, "When kaffārah is due together with qaḍāʾ", S(1628), K(879))
R("sawmkaffignorance", T, "Not knowing the ruling, or believing the fast would not be invalidated", S(1629), K(880))
R("sawmkaffharam", T, "Knowing that an act is ḥarām but not that it invalidates the fast", K(881))
R("sawmkafftypes", T, "The kinds of kaffārah and what to do if one cannot", S(1630), K(887))
R("sawmkaffunable", T, "Not being able to do any of the three", K(893), see_also={"sistani": "sawmkafftypes"})
R("sawmkaffable", T, "Becoming able to fast or feed the poor later", K(894), see_also={"sistani": "sawmkafftypes"})
R("sawmkaffmonths", T, "Fasting for two months", S(1631), K(888), differs=True)
R("sawmkaffmonthsstart", T, "Where the two months must not fall", S(1632))
R("sawmkaffmonthsbreak", T, "Missing a day of the two months without an excuse", S(1633), K(889))
R("sawmkaffmonthsexcuse", T, "An excuse arising during the two months", S(1634), K(890))
R("sawmkaffsixty", T, "Feeding sixty poor people", S(1655), K(895))
R("sawmkaffsixtyhow", T, "The two ways of feeding sixty poor people", K(891))
R("sawmkaffpoor", T, "Who is poor", K(892))
R("sawmkaffunlawful", T, "Breaking the fast by something unlawful", S(1635), K(897))
R("sawmkaffallah", T, "Ascribing a lie to Allah, the Prophet or the Imams", S(1636))
R("sawmkaffseveral", T, "Invalidating the fast several times in one day", S(1637), K(896), differs=True)
R("sawmkaffthen", T, "Another act, then intercourse", S(1638))
R("sawmkaffmixed", T, "A lawful act, then an unlawful one", S(1639))
R("sawmkaffburp", T, "Intentionally swallowing what comes up while burping", S(1640), K(882))
R("sawmkaffvow", T, "Breaking a fast kept by vow", S(1641), K(883))
R("sawmkaffmaghribword", T, "Breaking the fast on someone's word that it is maghrib", S(1642), K(884))
R("sawmkaffjourney", T, "Travelling after breaking the fast", S(1643), K(885))
R("sawmkaffexcuse", T, "An excuse arising after the fast was broken", S(1644))
R("sawmkaffwrongday", T, "Thinking it was the first of Ramadan", S(1645))
R("sawmkaffshawwal", T, "Doubting whether it is the first of Shawwāl", S(1646))
R("sawmkaffspouses", T, "Intercourse between spouses in Ramadan", S(1647), K(886))
R("sawmkaffcompelhusband", T, "A wife who compels her husband", S(1648))
R("sawmkaffcompelwife", T, "A husband who compels his wife, who then consents", S(1649))
R("sawmkaffasleep", T, "Intercourse with a wife who is asleep", S(1650))
R("sawmkaffcompelother", T, "Compelling a spouse to do something else that invalidates the fast", S(1651))
R("sawmkaffcompeltraveller", T, "A husband who is not fasting", S(1652))
R("sawmkaffdelay", T, "Delaying the kaffārah", S(1653), K(898))
R("sawmkaffnoadd", T, "Not giving the kaffārah for years", S(1654), K(899))
R("sawmkaffqadaorder", T, "The order of qaḍāʾ and kaffārah", K(900))

# ======================= ONLY QAḌĀʾ =======================
T = "sawmonlyqada"
R("sawmonlyqadalist", T, "Cases in which only qaḍāʾ is due", S(1657), K(901))
R("sawmonlyqadaforgot", T, "Fasting for days in janābah after forgetting the ghusl", K(903), see_also={"sistani": "sawmonlyqadalist"})
R("sawmonlyqadaallowed", T, "Becoming permitted or obliged to invalidate the fast", K(909), see_also={"sistani": "sawmonlyqadalist"})
R("sawmgargle", T, "Gargling when water may go down the throat", S(1660), K(911))
R("sawmgargleunintended", T, "Water going in involuntarily while gargling", K(910), see_also={"sistani": "sawmonlyqadalist"})
R("sawmswallowother", T, "Swallowing something else, or water from the nose", S(1658))
R("sawmgarglemuch", T, "Gargling a lot", S(1659))

# ======================= QAḌĀʾ AND FIDYAH =======================
T = "sawmqada"
R("sawmqadainsane", T, "Fasts missed during insanity", S(1663))
R("sawmqadakafir", T, "Fasts missed as a disbeliever", S(1664))
R("sawmqadaunconscious", T, "Fasts missed while unconscious", K(912))
R("sawmqadadrunk", T, "Fasts missed because of intoxication", S(1665), K(913))
R("sawmqadadrunkpart", T, "Intending to fast, then becoming intoxicated", K(914))
R("sawmqadadrunkany", T, "Whether the intoxicant was ḥarām", K(915))
R("sawmqadahayd", T, "Fasts missed because of ḥayḍ or childbirth", K(916), **W)
R("sawmqadadeath", T, "Dying before the fasts could be made up", S(1671), K(917))
R("sawmqadacount", T, "Not knowing how many fasts were missed", S(1666), K(918))
R("sawmqadaorder", T, "Qaḍāʾ owed for several Ramadans", S(1667), K(919))
R("sawmqadaintention", T, "Not specifying which Ramadan the qaḍāʾ is for", S(1668), K(922))
R("sawmqadabreak", T, "Breaking a qaḍāʾ fast before ẓuhr", S(1669), K(920))
R("sawmqadabreakafter", T, "Breaking a qaḍāʾ fast of Ramadan after ẓuhr", S(1656), K(921))
R("sawmqadadead", T, "A qaḍāʾ fast kept for a dead person", S(1670))
R("sawmqadaable", T, "Becoming able to fast before the next Ramadan", K(923))
R("sawmqadaillness", T, "Illness that lasts until the next Ramadan", S(1672), K(924))
R("sawmqadaanother", T, "Another excuse arising after the illness is cured", S(1673), K(925))
R("sawmqadatravel", T, "Travel that continues until the next Ramadan", K(926))
R("sawmqadaweak", T, "Physical weakness, and repentance after years of not fasting", K(927))
R("sawmqadadelayed", T, "Intentionally not making up the fasts before the next Ramadan", S(1674), K(928))
R("sawmqadashortage", T, "An excuse arising when little time remains", S(1675))
R("sawmqadaillnessyears", T, "Illness that continues for years", S(1676))
R("sawmqadamudd", T, "Giving the mudd of several days to one poor person", S(1677), K(932))
R("sawmqadadelayyears", T, "Delaying the qaḍāʾ for several years", S(1678), K(931))
R("sawmqadadelayamount", T, "The amount of the kaffārah of delay", K(930))
R("sawmqadadelayignorance", T, "Not knowing that the qaḍāʾ had to be made before the next Ramadan", K(933))
R("sawmqadaintentionalmiss", T, "Intentionally not fasting in Ramadan", S(1679), K(929))
R("sawmqadaintentionalrepeat", T, "Intercourse or other acts repeated on a day of intentionally missed Ramadan", S(1680))
R("sawmqadaparents", T, "The fasts of a deceased parent", S(1681), K(934))
R("sawmqadaparentspurpose", T, "Fasts a parent intentionally did not keep", K(935))
R("sawmqadaparentsother", T, "A father's other obligatory fasts", S(1682))

# ======================= FASTING AND TRAVEL =======================
T = "sawmtravel"
R("sawmtravelnofast", T, "Which traveller must not fast", S(1683), K(938))
R("sawmtravelcannot", T, "A traveller and the intention to stay ten days", K(937), see_also={"sistani": "sawmtravelnofast"})
R("sawmtravelallowed", T, "Travelling in Ramadan", S(1684), K(936))
R("sawmtravelassigned", T, "An assigned fast other than Ramadan's", S(1685), K(942))
R("sawmtravelvow", T, "A recommended fast made obligatory by vow", S(1686), K(943))
R("sawmtravelrecommended", T, "Recommended fasts while travelling", K(945))
R("sawmtravelmedina", T, "Recommended fasts in Medina", S(1687), K(946))
R("sawmtravelplaces", T, "The four places where the traveller may pray in full", K(944))
R("sawmtravelsin", T, "A journey of sin", K(947))
R("sawmtravelsinchange", T, "Giving up the intention of sin during the journey", K(948))
R("sawmtravelsinafternoon", T, "Giving up the intention of sin in the afternoon", K(949))
R("sawmtravelunaware", T, "A traveller who did not know the ruling", S(1688), K(950))
R("sawmtravelunawareterms", T, "A traveller who did not know the conditions of the ruling", K(951))
R("sawmtravelunawareshari", T, "A traveller who did not know the distance was shar‘ī", K(952))
R("sawmtravelforgot", T, "Forgetting that one is travelling", S(1689), K(953))
R("sawmtraveldepart", T, "Setting out on a journey while fasting", S(1690), K(939))
R("sawmtravelbreak", T, "Breaking the fast before the tarakhkhuṣ point", K(940), see_also={"sistani": "sawmtraveldepart"})
R("sawmtravelarrive", T, "Arriving home or at a place of ten days' stay before ẓuhr", S(1691), K(941))
R("sawmtravelarriveafter", T, "Arriving after ẓuhr", S(1692))
R("sawmtravelfull", T, "Intercourse, or eating and drinking one's fill", S(1693))

# ======================= THE FIRST OF THE MONTH =======================
T = "sawmmonth"
R("sawmmonthways", T, "How the first of the month is established", S(1699, urdu="lag"), K(961), differs=True)
R("sawmmonthevening", T, "Seeing the crescent in the evening", K(962), see_also={"sistani": "sawmmonthways"})
R("sawmmonthequipment", T, "Seeing the crescent with a telescope or camera", K(963), see_also={"sistani": "sawmmonthways"})
R("sawmmoonshape", T, "The size and height of the moon", S(1702), K(964))
R("sawmmonthastronomers", T, "Calendars and astronomers' calculations", S(1701), K(965))
R("sawmmonthhakim", T, "The verdict of the ḥākim of shar‘", S(1700), K(967))
R("sawmmonthhakimcountry", T, "A verdict covering the whole country", K(968), see_also={"sistani": "sawmmonthhakim"})
R("sawmmonthhorizon", T, "Other cities on the same horizon", S(1704), K(966))
R("sawmmonthgovernment", T, "An announcement by an oppressive or non-Islamic government", K(969))
R("sawmmonthmedia", T, "Radio and television announcements", K(970))
R("sawmmonthnotestablished", T, "The first of Ramadan not established, then established", S(1703), K(971))
R("sawmmonthshawwaldoubt", T, "Doubting whether it is the last day of Ramadan or the first of Shawwāl", S(1705), K(973))
R("sawmmonthshawwal", T, "The first of Shawwāl not established", K(972), see_also={"sistani": "sawmmonthshawwaldoubt"})
R("sawmmonthprisoner", T, "A prisoner who cannot be sure of the month", S(1706))

# ======================= KINDS OF FAST =======================
T = "sawmtypes"
R("sawmkinds", T, "The four kinds of fast", K(974))
R("sawmobligatory", T, "The obligatory fasts", K(975))
R("sawmharam", T, "Forbidden fasts", S(1707), K(976))
R("sawmharamother", T, "Other unlawful fasts", S(1714))
R("sawmharamwife", T, "A wife's recommended fast and her husband's rights", S(1708))
R("sawmharamchild", T, "A child's recommended fast and the annoyance of a parent", S(1709))
R("sawmharamchildday", T, "A parent forbidding the child during the day", S(1710))
R("sawmdisapproved", T, "Disapproved fasts", S(1715), K(978))
R("sawmrecommended", T, "Recommended fasts", S(1716), K(977))
R("sawmrecommendedbreak", T, "Not completing a recommended fast", K(979))
R("sawmrecommendedqada", T, "A recommended fast while owing qaḍāʾ", S(1542, urdu="lag"), K(796))
R("sawmrecommendedqadaunaware", T, "Not knowing that one owes qaḍāʾ", K(797))
R("sawmrecommendedqadaunsure", T, "Not knowing whether one owes qaḍāʾ", K(798))
R("sawmrecommendedqadaforgot", T, "Forgetting the qaḍāʾ and keeping a recommended fast", K(799))

# ======================= ZAKĀT AL-FIṬRAH =======================
T = "zakatfitrah"
R("fitrahwho", T, "Who must give zakāt al-fiṭrah, and how much", S(2003))
R("fitrahpoor", T, "Who counts as poor and so does not give fiṭrah", S(2004))
R("fitrahdependants", T, "Giving fiṭrah for one's dependants", S(2005))
R("fitrahdependanttown", T, "A dependant in another town", S(2006))
R("fitrahguestbefore", T, "A guest who arrives before sunset", S(2007))
R("fitrahguestafter", T, "A guest who arrives after sunset", S(2008))
R("fitrahinsane", T, "An insane person at the time of sunset", S(2009))
R("fitrahbeforesunset", T, "Meeting the conditions before sunset", S(2010))
R("fitrahaftersunset", T, "Meeting the conditions after sunset but before ẓuhr", S(2011))
R("fitrahconvert", T, "A disbeliever who becomes a Muslim, or a Muslim who becomes a Shia", S(2012))
R("fitrahonesaa", T, "Someone who has only one ṣāʿ", S(2013))
R("fitrahbirth", T, "A child born, or a wife married, around sunset", S(2014))
R("fitrahmove", T, "A dependant who changes household before sunset", S(2015))
R("fitrahother", T, "A person whose fiṭrah is obligatory on another", S(2016, urdu="lag"))
R("fitrahowngive", T, "Giving one's own fiṭrah when another must give it", S(2017))
R("fitrahsayyid", T, "A non-sayyid and a sayyid", S(2018))
R("fitrahbreastfed", T, "The fiṭrah of a breastfed child", S(2019))
R("fitrahunlawful", T, "Dependants maintained with unlawful property", S(2020))
R("fitrahhired", T, "Hired workers", S(2021))
R("fitrahdeath", T, "A person who dies around the eve of Eid", S(2022))
R("fitrahrecipients", T, "To whom fiṭrah may be given", S(2023))
R("fitrahchild", T, "A poor child", S(2024))
R("fitrahnotdutiful", T, "A recipient who is not dutiful", S(2025))
R("fitrahsin", T, "A recipient who spends it on sin", S(2026))
R("fitrahless", T, "Giving a poor person less than one ṣāʿ", S(2027))
R("fitrahhalf", T, "Giving half a ṣāʿ of a costlier item", S(2028))
R("fitrahmixed", T, "Half a ṣāʿ of one item and half of another", S(2029))
R("fitrahrelatives", T, "Preferring relatives and neighbours", S(2030))
R("fitrahnotpoor", T, "Giving fiṭrah to someone who turns out not to be poor", S(2031))
R("fitrahclaim", T, "A person who claims to be poor", S(2032))
R("fitrahintention", T, "The intention for giving fiṭrah", S(2033))
R("fitrahearly", T, "Giving fiṭrah before or during Ramadan", S(2034))
R("fitrahsoil", T, "Fiṭrah mixed with soil or another thing", S(2035))
R("fitrahdefective", T, "A defective item", S(2036))
R("fitrahitems", T, "Different items for different persons", S(2037))
R("fitrahprayer", T, "Before or after the Eid prayer", S(2038))
R("fitrahsetaside", T, "Setting fiṭrah aside", S(2039))
R("fitrahlate", T, "Not giving fiṭrah by ẓuhr on the day of Eid", S(2040))
R("fitrahuse", T, "Using what has been set aside", S(2041))
R("fitrahworth", T, "An item worth more than the fiṭrah", S(2042))
R("fitrahperish", T, "Fiṭrah that perishes", S(2043))
R("fitrahtransfer", T, "Moving fiṭrah to another place", S(2044))

# ---- checks ----
ids = [r["id"] for r in RULINGS]
assert len(ids) == len(set(ids)), [i for i in ids if ids.count(i) > 1]
used_s = [e["source"]["reference"] for r in RULINGS for e in r["rulings"] if e["marjaId"] == "sistani" and not e.get("excerpt")]
assert len(used_s) == len(set(used_s)), "a Sistani ruling is used twice"
used_k = [e["source"]["reference"] for r in RULINGS for e in r["rulings"] if e["marjaId"] == "khamenei"]
assert len(used_k) == len(set(used_k)), "a Khamenei ruling is used twice"
missing_s = [n for n in list(range(1529, 1719)) + list(range(2003, 2045)) if f"Ruling {n}" not in used_s and f"Ruling {n}*" not in used_s
             and not any(r.startswith(f"Ruling {n}") for r in used_s)]
missing_k = [n for n in range(787, 982) if f"{n}." not in used_k]
print("Sistani rulings not used:", missing_s, "| Khamenei rulings not used:", missing_k)

finalize(RULINGS)
from holds import apply_holds
apply_holds(RULINGS)

HDR = """// GENERATED by scripts/wajibat/gen_sawm.py: do not hand-edit the quoted strings.
// Every ruling text was copied by script from the marja's official publication:
//   Sistani:  sistani.org Islamic Laws 4th ed. (English) / توضیح المسائل (Urdu)
//   Khamenei: leader.ir "The Rules on Prayer & Fasting 2023" (first priority, R6)
// Revised (*) Sistani rulings were compared with the Urdu one by one (decision P6).
// `basis` comes from the ruling's own opening words, never inferred beyond them (R3).
"""
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write("// Sawm: fasting and zakāt al-fiṭrah (Phase 5).\n//\n" + HDR
            + 'import type { Ruling } from "../types";\n\nexport const SAWM_RULINGS: Ruling[] = ' + ts(RULINGS) + ";\n")

# Keep each topic's rulingIds in app/data/wajibat/topics.ts in step with the rulings generated here
# (supplementary Q&A ids are then re-placed by place_qa_ids.py, which build.py runs next).
import os, re
from paths import DATA
tp = os.path.join(DATA, "topics.ts")
s = open(tp, encoding="utf-8").read()
for topic in dict.fromkeys(r["topicId"] for r in RULINGS):
    m = re.search(r'(id: "%s",.*?rulingIds: \[)([^\]]*)\]' % topic, s, re.S)
    assert m, f"topic {topic} missing from topics.ts"
    ids_t = [r["id"] for r in RULINGS if r["topicId"] == topic]
    s = s[:m.start(2)] + ", ".join(f'"{x}"' for x in ids_t) + s[m.end(2):]
open(tp, "w", encoding="utf-8", newline="\n").write(s)

from collections import Counter
c = Counter(); u = Counter()
for r in RULINGS:
    for e in r["rulings"]:
        c[(r["topicId"], e["marjaId"])] += 1
        if e["text"].get("ur"): u[(r["topicId"], e["marjaId"])] += 1
print("rulings:", len(RULINGS), "entries:", sum(c.values()))
for k in sorted(c): print(k, c[k], "urdu", u[k])
