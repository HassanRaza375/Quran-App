# (EN Q, topic, Rules n compared, verdict)
PICKS = [
 (337,"dailyprayers",[2],"agree"),
 (348,"prayertimes",[24],"agree"),(350,"prayertimes",[4],"agree"),(358,"prayertimes",[18],"agree"),(360,"prayertimes",[27],"agree"),(361,"prayertimes",[8,13],"agree"),
 (363,"qibla",[44],"agree"),(364,"qibla",[45],"agree"),(366,"qibla",[45],"agree"),
 (382,"placeofprayer",[100],"agree"),(372,"placeofprayer",[112],"agree"),(386,"placeofprayer",[107],"agree"),(723,"placeofprayer",[107],"agree"),(384,"placeofprayer",[114],"agree"),
 (428,"clothing",[59],"agree"),(435,"clothing",[51],"agree"),(440,"clothing",[90],"agree"),(443,"clothing",[90],"agree"),(429,"clothing",[84],"agree"),(439,"clothing",[85],"agree"),
 (454,"adhaniqamah",[131],"agree"),
 (456,"qiraah",[190,197],"agree"),(469,"qiraah",[191],"agree"),(473,"qiraah",[172],"agree"),(465,"qiraah",[200],"agree"),(481,"qiraah",[184],"agree"),
 (455,"obligatoryparts",[162,163],"agree"),
 (485,"rukusujud",[221,243],"agree"),(489,"rukusujud",[260],"agree"),(342,"rukusujud",[223],"differ"),
 (487,"sajdahplace",[267],"agree"),(493,"sajdahplace",[265],"agree"),(498,"sajdahplace",[281],"agree"),
 (503,"mubtilat",[334],"agree"),(501,"mubtilat",[343],"agree"),(510,"mubtilat",[332],"agree"),
 (531,"qadaprayers",[638,639],"agree"),(536,"qadaprayers",[639],"agree"),(540,"qadaprayers",[651],"agree"),
 (563,"jamaah",[730],"agree"),(594,"jamaah",[712],"agree"),(574,"jamaah",[717],"agree"),(577,"jamaah",[728],"agree"),(607,"jamaah",[763],"agree"),
 (605,"otherprayers",[762],"agree"),(622,"otherprayers",[764],"agree"),(629,"otherprayers",[784],"agree"),(631,"otherprayers",[681],"agree"),(707,"otherprayers",[660],"agree"),
 (637,"travellerprayer",[407],"agree"),(638,"travellerprayer",[408],"agree"),(674,"travellerprayer",[506],"agree"),(671,"travellerprayer",[588,558],"agree"),(641,"travellerprayer",[478],"agree"),
 # Phase 4a: "Doubt in Prayers" (EN sn=5270 / UR sn=11401)
 (514,"doubts",[348],"agree"),(515,"doubts",[386],"agree"),(516,"doubts",[380],"agree"),(517,"doubts",[375],"agree"),
 (520,"ihtiyatprayer",[364],"agree"),
 (518,"sahwforgotten",[400],"agree"),(519,"sahwforgotten",[397,388],"agree"),(521,"sahwforgotten",[392],"agree"),
 # Phase 5: the fasting chapter (EN Q 741-846 / UR س 745-850, Urdu = English + 4); each compared with the Rules ruling it agrees with
 (741,"sawmexempt",[954],"agree"),(743,"sawmexempt",[955],"agree"),(744,"sawmexempt",[794],"agree"),(749,"sawmexempt",[794],"agree"),(750,"sawmexempt",[794],"agree"),
 (751,"sawmexempt",[792],"agree"),(753,"sawmexempt",[792],"agree"),
 (754,"sawmniyyah",[814,815],"agree"),
 (755,"sawmmubtilat",[828],"agree"),(756,"sawmmubtilat",[824,862],"agree"),(757,"sawmmubtilat",[824,862],"agree"),(758,"sawmmubtilat",[863],"agree"),
 (759,"sawmmubtilat",[829],"agree"),(760,"sawmmubtilat",[820],"agree"),(761,"sawmmubtilat",[828,873],"agree"),(763,"sawmmubtilat",[823],"agree"),
 (764,"sawmmubtilat",[825],"agree"),(765,"sawmmubtilat",[825],"agree"),(782,"sawmmubtilat",[836],"agree"),(793,"sawmmubtilat",[874,876],"agree"),
 (796,"sawmmubtilat",[862,864],"agree"),
 (769,"sawmonlyqada",[903],"agree"),
 (772,"sawmjanabah",[849],"agree"),(779,"sawmjanabah",[845],"agree"),
 (766,"sawmkaffarah",[886],"agree"),(780,"sawmkaffarah",[897],"agree"),(790,"sawmkaffarah",[896],"agree"),(803,"sawmkaffarah",[900],"agree"),(813,"sawmkaffarah",[880],"agree"),
 (794,"sawmtravel",[940],"agree"),
 (799,"sawmqada",[931],"agree"),(809,"sawmqada",[933],"agree"),
 (831,"sawmmonth",[963],"agree"),(832,"sawmmonth",[970],"agree"),(833,"sawmmonth",[971,972],"agree"),(834,"sawmmonth",[966],"agree"),(836,"sawmmonth",[966],"agree"),
 (839,"sawmmonth",[967],"agree"),(840,"sawmmonth",[968],"agree"),(841,"sawmmonth",[964],"agree"),(844,"sawmmonth",[961],"agree"),
]
UR = {337:338,348:349,350:351,358:359,360:361,361:363,363:365,364:366,366:368,382:384,372:374,386:388,723:727,384:386,428:430,435:437,440:442,443:445,429:431,439:441,454:456,456:458,469:471,473:475,465:467,481:483,455:457,485:487,489:491,342:343,487:489,493:495,498:500,503:505,501:503,510:512,531:533,536:538,540:542,563:565,594:None,574:576,577:579,607:609,605:607,622:624,629:631,631:633,707:711,637:639,638:640,674:676,671:673,641:643,514:516,515:517,516:518,517:519,518:520,519:521,520:522,521:523}
# Fasting chapter: the Urdu book's numbers are the English ones + 4 throughout (section by section, positions pair one to one).
UR.update({q: q + 4 for q, *_ in PICKS if 741 <= q <= 846})
