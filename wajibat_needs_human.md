# Wajibat: mismatches that need a person

Rows the automatic triage could not decide (decision B1). **English/Urdu rows first.** Each is still displayed as before. For each, read the versions side by side, then record a decision with `python scripts/wajibat/decide_mismatch.py` (`accepted` = the versions say the same, `fix`, `withhold`, `restored`).

**81 rulings** (64 with an English/Urdu difference).

### `asphalt` (khamenei, Q 80)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [10] vs []; en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| When the bottom of one’s shoes / soles of feet become najis as a result of walking on the ground, they are purified by walking almost ten steps on a dry and pure ground if the inherently najis substance or the made-najis object is removed from it by walking on, or rubbing it against, the ground. | وہ زمین جو تارکول سے آمیختہ ہو یا اس پرکنکریٹ بچھا یا گیا ہو پاؤں یا جوتے کے تلوے کو پاک نہیں کرتی۔ |

### `birddroppings` (khamenei, Q 278)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 1 vs 0

| English | Urdu |
|---|---|
| Are the droppings of a bird whose meat is not ḥalāl, like that of a crow or an eagle najis? | کیا حرام گوشت پرندوں جیسے عقاب، طوطا، کوا اور جنگلی کوا ۔ کا پاخانہ نجس ہے ؟ |

### `bleedingbeforenine` (khamenei, Q 1878)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [9]; en-ur ordinals **!**: [9] vs []; en-ur negation **!**: 1 vs 0

| English | Urdu |
|---|---|
| Is the experience of having a period by a girl who has not yet completed her ninth year, a sign of her shar‘ī puberty, especially if the blood has all the properties of menstrual blood? | کیا لڑکی کےلئے نو سال پورے ہونے سے پہلے ایسے خون کا دیکھنا جس میں حیض کی نشانیاں موجود ہوں ، اس کے بالغ ہونے کی علامت ہے؟ |

### `dogpig` (khamenei, Q 273)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| In view of the use of brushes in painting and sketching, and considering that good quality brushes are imported from non-Islamic countries and are often made of pig’s hair and are accessible to all, especially in cultural and propagational centers, what is the legal rule regarding using such brushes? | پینٹنگ اور تصویریں بنانے میں بالوں والے برش سے استفادہ کیا جاتاہے۔ انکی بہترین قسم عام طور پر سور کے بالوں سے بنی ہوئی ہوتی ہے اور غیر اسلامی ملکوں سے منگوائی جاتی ہے ایسے برش ہر جگہ خاص طور سے ایڈورٹائزنگ کے اور ثقافتی مراکز میں استعمال کئے جاتے ہیں۔ اس قسم کے برش کے استعمال کے سلسلے میں شرعی حکم کیا ہے؟ |

### `doubtaftersalaminvalid` (khamenei, 376.)

*Why:* The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer, so it was not hidden automatically.  
*Differences:* en-ur numbers **!**: [2, 3, 5] vs [2, 3, 4, 5]; en-fa numbers **!**: [2, 3, 5] vs [2, 3, 4, 5]

| English | Urdu | Persian |
|---|---|---|
| The prayer is invalid if one doubts about the number of rak‘ah of his prayer after salām of the prayer but both sides of the doubt cause the prayer to be invalid. For example, if, after salām of a four-rak‘ah prayer, he doubts whether he prayed three rak‘ah or five rak‘ah, the prayer is invalid. | اگر نماز کے سلام کے بعد رکعتوں کی تعداد کے بارے میں شک کرے لیکن شک کی دو نوں طرف نماز باطل ہوتی ہو مثلاً چار رکعتی نماز کے سلام کے بعد شک کرے کہ تین رکعتیں پڑھی ہیں یا پانچ تو نماز باطل ہے۔ | اگر پس از سلام نماز در رکعات نماز شک کند؛ ولی هر دو طرف شک، موجب بطلان نماز باشد؛ مانند اینکه پس از سلام نماز چهار رکعتی شک کند که سه رکعت خوانده یا پنج رکعت، نماز باطل است. |

### `doubtimam` (khamenei, 378.)

*Why:* The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer, so it was not hidden automatically.  
*Differences:* en-ur numbers **!**: [3, 4, 4, 4, 50] vs [3, 4, 4, 4]; en-fa numbers **!**: [3, 4, 4, 4, 50] vs [3, 4, 4, 4]

| English | Urdu | Persian |
|---|---|---|
| If an imam of congregation doubts the number of rak‘ah; for example, if he doubts whether he prayed three rak‘ah or four rak‘ah, if the ma‘mūm is sure or thinks that more probably he prayed four rak‘ah and informs the imam that he has prayed four rak‘ah, the imam must finish the prayer and it is not necessary to perform the caution prayer. Also, if the imam is certain or thinks that more than fifty percent he has prayed a certain number of rak‘ah and the ma‘mūm doubts about the number of rak‘ah of the prayer, he should not pay attention to his doubt. | اگر امام جماعت رکعتوں کی تعداد کے بارے میں شک کرے مثلاً شک کرے کہ تین رکعتیں پڑھی ہیں یا چار، چنانچہ ماموم کو یقین یا گمان ہو کہ چار رکعتیں پڑھی ہیں اور یہ بات امام کے علم میں لائے کہ چار رکعتیں پڑھی ہیں تو امام کو چاہئے نماز کو تمام کرے اور نماز احتیاط پڑھنا لازم نہیں ہے۔ اسی طرح اگر امام کو رکعتوں کی تعداد کے بارے میں یقین یا گمان ہو اور ماموم کو رکعتوں کی تعداد کے بارے میں شک ہوجائے تو اپنے شک کی پروا نہ کرے۔ | اگر امام جماعت در شماره رکعت ها شک کند؛ مانند اینکه شک کند که سه رکعت خوانده یا چهار رکعت، چنانچه مأموم، یقین یا گمان داشته باشد که چهار رکعت خوانده و به امام بفهماند که چهار رکعت خوانده است، امام باید نماز را تمام کند و خواندن نماز احتیاط لازم نیست. همچنین اگر امام یقین یا گمان داشته باشد که چند رکعت خوانده است و مأموم در شماره رکعت های نماز شک کند نباید به شک خود اعتنا کند. |

### `doubtkinds` (khamenei, 346.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-ur numbers **!**: [3, 50, 50] vs [2, 2, 3]; en-ur negation **!**: 0 vs 1; en-fa numbers **!**: [3, 50, 50] vs [1, 3]; ur-fa numbers **!**: [2, 2, 3] vs [1, 3]; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| There are three types of doubt* in prayer:<br>a. Doubt about prayer itself,<br>b. Doubt about a part of prayer,<br>c. Doubt about prayer’s rak‘ah.<br>* Here by doubt we mean probability of fifty percent. If it is more than fifty percent, it is called ẓan with different rules. | نماز میں شک کی تین قسمیں ہیں:<br>1۔ خود نماز میں شک؛<br>2۔ نماز کے اجزاء میں شک؛<br>3۔ نماز کی رکعتوں میں شک؛<br>* ۔ شک سے مراد دو یا دو سے زائد چیزوں کے مابین مساوی طور پر تردید کا شکار ہونا ہے اس طرح کہ کوئی ایک بھی کسی دوسرے پر ترجیح نہ رکھتا ہو اور اگر ایک طرف دوسرے پر کوئی رجحان یا برتری رکھتا ہو تو برتری رکھنے والا طرف ظن (گمان) اور کمزور طرف وہم کہلاتا ہے۔ | شک 1 در نماز بر سه قسم است:<br><br>‌أ. شک در اصل نماز؛<br><br>‌ب. شک در اجزای نماز؛<br><br>‌ج. شک در رکعات نماز؛ |

### `doubtprayeritself` (khamenei, 347.)

*Why:* The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer, so it was not hidden automatically.  
*Differences:* en-ur numbers **!**: [50, 50] vs []; en-fa numbers **!**: [50, 50] vs []

| English | Urdu | Persian |
|---|---|---|
| If, after the prayer’s time, one doubts whether he has performed it or not, or thinks (more than fifty percent) that he has not performed, it is not necessary to perform it. However, if before the end of prayer’s time, he doubts whether he has performed the prayer or not, he should pray. Rather, if one thinks (i.e. more than fifty percent) that he has performed it, he should pray. | اگر وقت گزرنے کے بعد شک کرے کہ نماز پڑھی ہے یا نہیں یا گمان کرے کہ نہیں پڑھی ہے تو نماز پڑھنا لازم نہیں لیکن اگر وقت ختم ہونے سے پہلے شک کرے کہ نماز پڑھی ہے یا نہیں تو ضروری ہے نماز پڑھے بلکہ نماز پڑھنے کا گمان ہوجائے تو بھی پڑھے۔ | اگر بعد از گذشتن وقت نماز، شک کند که نماز خوانده یا نه، یا گمان کند که نخوانده، لازم نیست نماز را بخواند. اما اگر پیش از پایان وقت نماز، شک کند که نماز خوانده یا نه، باید نماز را بخواند بلکه در صورت گمان به خواندن نیز باید آن را بخواند. |

### `doubtrepeated` (khamenei, 358.)

*Why:* The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer, so it was not hidden automatically.  
*Differences:* en-ur numbers **!**: [2] vs []; en-ur negation: 2 vs 3; en-fa numbers **!**: [2] vs []; en-fa negation: 2 vs 1

| English | Urdu | Persian |
|---|---|---|
| If one doubts about one of the parts of the prayer before starting the next part and performs it, then it turns out that he has performed it twice, if that part is not a rukn of prayer, his prayer is not void. | اگر نماز کے کسی جزء میں شک کرے جبکہ بعد کے جزء میں داخل نہ ہوا ہو اور اس کو انجام دے تاہم بعد میں یاد آئے کہ اس جزء کو دوبار انجام دیا ہے چنانچہ وہ جزء ارکان نماز میں سے نہ ہو تو نماز باطل نہیں ہے۔ | اگر در یکی از اجزای نماز پیش از وارد شدن به جزء بعدی، شک کند و آن را انجام دهد، سپس معلوم شود که آن را دوبار به جا آورده، چنانچه آن جزء از ارکان نماز نباشد، نمازش باطل نیست. |

### `doubtsdismissedlist` (khamenei, 373.)

*Why:* The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer, so it was not hidden automatically.  
*Differences:* en-ur negation **!**: 0 vs 1; en-fa negation **!**: 0 vs 1

| English | Urdu | Persian |
|---|---|---|
| Doubts which are invalid and should be ignored are as follows:<br>1. Doubt about an act after passing its due place,<br>2. Doubt after salām of prayer.<br>3. Doubt after the time of prayer has already passed.<br>4. Doubt by an imam (one who leads the prayer) or a ma‘mūm (the follower of an imam in congregational prayer),<br>5. Doubt of a person who doubts too much,<br>6. Doubt which arises in a mustaḥabb prayers. | وہ شکوک جن کی پروا نہیں کرنی چاہئے، مندرجہ ذیل ہیں:<br>1۔ اس چیز کے بارے میں شک کہ جس کا موقع گزر گیا ہو؛<br>2۔ سلام کے بعد شک؛<br>3۔ نماز کا وقت گزرجانے کے بعد شک؛<br>4۔ امام اور ماموم کا شک؛<br>5۔ کثیر الشک کا شک؛<br>6۔ مستحب نمازوں میں شک؛ | شک هایی که اعتبار ندارند و نباید به آنها اعتنا کرد از این قرار است:<br><br>1. شک در چیزی که محل آن گذشته است؛<br><br>2. شک بعد از سلام؛<br><br>3. شک بعد از وقت نماز؛<br><br>4. شک امام و مأموم؛<br><br>5. شک کثیر الشک؛<br><br>6. شک در نمازهای مستحبی. |

### `doubtsupposition` (khamenei, 368.)

*Why:* The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer, so it was not hidden automatically.  
*Differences:* en-ur numbers **!**: [3, 4, 50] vs [3, 4]; en-fa numbers **!**: [3, 4, 50] vs [3, 4]

| English | Urdu | Persian |
|---|---|---|
| The probability of more than fifty percent regarding number of rak‘ah in a prayer is just like the `certainty`. For example, when one doubts as to whether they have finished three or four rak‘ah, in case that the probability of one of the choices seems more, one should act accordingly and the prayer is alright. | نماز کی رکعتوں کے بارے میں گمان کا حکم یقین کی طرح ہے یعنی جب تین یا چار رکعت پڑھنے میں شک ہوجائے اور کسی ایک طرف زیادہ گمان ہوجائے تو اسی کے مطابق عمل کرے اور نماز صحیح ہے۔ | حکم «گمان» در رکعت های نماز، مانند یقین است. یعنی هنگامی که مردّد می شود که مثلاً سه رکعت خوانده یا چهار رکعت، اگر گمانش به یک طرف بیشتر است باید مطابق آن عمل کند و نمازش صحیح است. |

### `excessiveact` (khamenei, 380.)

*Why:* The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer, so it was not hidden automatically.  
*Differences:* en-ur numbers **!**: [2, 2] vs []; en-fa numbers **!**: [2, 2] vs []; en-fa negation: 3 vs 2

| English | Urdu | Persian |
|---|---|---|
| 'A person who doubts too much' must assume the occurrence of the act about which he doubts if performing it does not invalidate his prayer. For example, if a person doubts whether he has performed sajdah or not, he should assume that he has performed it.<br>If doing it invalidates prayer, he must assume that he has not performed it, like if he doubts whether he has performed one rukū‘ or two, he should posit that he has performed one rukū‘ because making two rukū‘ invalidates prayer. | اگر کثیر الشک کسی عمل کے بجالانے کے بارے میں شک کرے چنانچہ اس عمل کو انجام دینے سے نماز باطل نہ ہوتی ہو تو یوں سمجھنا چاہئے کہ اسے انجام دیا ہے مثلاً شک کرے کہ سجدہ بجالایا ہے یا نہیں تو سمجھے کہ سجدہ بجالاچکا ہے اور اگر اس کو انجام دینے سے نماز باطل ہوتی ہو تو سمجھے کہ وہ کام انجام نہیں دیا ہے مثلاً شک کرے کہ ایک رکوع کیا ہے یا زیادہ تو چونکہ رکوع زیادہ ہونے سے نماز باطل ہوتی جاتی ہے لہذا یوں سمجھے کہ ایک رکوع کیا ہے۔ | کثیر الشک، اگر در به جا آوردن کاری شک کند، در صورتی که انجام آن کار نماز را باطل نمی کند، باید بنا بگذارد که آن را به جا آورده است؛ مانند اینکه شک کند که سجده کرده است یا نه، باید بنا بگذارد که سجده کرده است و چنانچه انجام آن کار نماز را باطل می کند، باید بنا بگذارد که آن را انجام نداده است؛ مانند اینکه شک کند که یک رکوع کرده یا بیشتر، چون زیاد شدن رکوع، نماز را باطل می کند، باید بنا بگذارد که یک رکوع کرده است. |

### `followingthealam` (khamenei, Q 16)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Is it required to follow only the most learned marji‘? And what is the criterion of being the most learned? | کیا مرجع تقلید کا اعلم ہونا شرط ہے یا نہیں ؟ نیز اعلمیت کا معیار کیا ہے ؟ |

### `fridaybest` (khamenei, 764.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-ur numbers **!**: [4, 5, 5125] vs [1, 2, 2, 3, 4, 4, 5, "5/125", 5125]; en-ur negation **!**: 1 vs 0; en-fa numbers **!**: [4, 5, 5125] vs [1, 4, 5]; en-fa negation **!**: 1 vs 0; ur-fa numbers **!**: [1, 2, 2, 3, 4, 4, 5, "5/125", 5125] vs [1, 4, 5]

| English | Urdu | Persian |
|---|---|---|
| The required term for a Friday prayer to be valid are as follows:<br>1. It should be in congregation;<br>2. There must be five person, Imam and four ma‘mūms;<br>3. observing all requirements for a congregational prayer, like valid connection among imam and ma‘mūms;<br>4. The distance between this Friday prayer and the nearest one should not be less than 5125 meter (one farsakh). | نماز جمعہ کی شرائط مندرجہ ذیل ہیں :<br>1 ۔ جماعت کے ساتھ ہو۔<br>2 ۔ کم از کم پانچ افراد ہوں(ایک امام اور چار ماموم)<br>3 ۔ نماز جماعت کی تمام شرائط کی رعایت کرنا مثلاً صفوں کا متصل ہونا۔<br>4 ۔ دو نماز جمعہ کے درمیان کم از کم ایک فرسخ فاصلہ ہو۔<br>* ۔ ایک فرسخ تقریباً 5125 میٹر (5/125 کلو میٹر) ہوتا ہے۔ | شرایط صحت نماز جمعه، عبارت است از:<br><br>1. به جماعت برگزار شدن؛<br><br>2. نمازگزاران حداقل پنج نفر باشند؛ (یک نفر امام و چهار نفر مأموم)<br><br>3. رعایت تمام شرایطی که در نماز جماعت معتبر است، مانند اتصال صفوف؛<br><br>4. حداقل وجود یک فرسخ 1 فاصله با نماز جمعه مجاور. |

### `ghusleventduring` (khamenei, Q 184)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [9]

| English | Urdu |
|---|---|
| It is not obligatory to repeat the ghusl and it does not affect the correctness of the ghusl. Rather, one should complete his ghusl. However, it does not remove the necessity of doing wuḍū’ for prayers and other acts that require wuḍū’. | از سر نو غسل کرنا واجب نہیں ہے اور حدث اصغر کا غسل کی صحت پرکوئی اثر نہیں پڑتا لیکن یہ غسل اس کی نماز اور ان اعمال کے لئے وضو سے کافی نہیں ہے جن میں حدث اصغر سے طہارت شرط ہے۔ |

### `ghusleventduring` (khamenei, Q 184)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [9]

| English | Urdu |
|---|---|
| During ghusl of janābah a wuḍū’ invalidator occurred. Is it obligatory to repeat ghusl or to finish it and to do wuḍū’? | اگر غسل جنابت کے درمیان حدث اصغر صادر ہوجائے تو کیا اس پر از سر نو غسل واجب ہے یا غسل مکمل کرنے کے بعد وہ وضو کرے گا؟ |

### `haydduration` (khamenei, Q 220)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [10]; en-ur ordinals **!**: [10] vs []

| English | Urdu |
|---|---|
| If the bleeding does not stop after the tenth day, the blood on the days of the regular monthly period is ruled as menses, and the remaining days of bleeding as istiḥāḍah. | اگر دس دن تک خون بند نہ ہو تو اس کی عادت کے ایام حیض شمار ہوں گے اور باقی استحاضہ۔ |

### `haydduration` (khamenei, Q 220)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur ordinals **!**: [7] vs []

| English | Urdu |
|---|---|
| A woman who has had regular monthly periods of seven days, for example, has a discharge for twelve days as a result of using a contraceptive device. Is the discharge after the seventh day to be considered menstruation, or is it istiḥāḍah? | ایک عورت کی ماہانہ عادت معین تھی جیسے ایک ہفتہ لیکن پھر اسے مانع حمل چھلہ (loop) رکھوانے کے سبب ہر ماہ ١٢ روز خون آنے لگا تو کیا یہ سات روز سے زیادہ آنے والا خون حیض ہو گا یا استحاضہ؟ |

### `haydpregnancy` (khamenei, Q 219)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [3] vs []

| English | Urdu |
|---|---|
| Any blood discharged during pregnancy and either possesses the properties and conditions of menstruation or it happens at the time of her usual period is considered as menses provided that it continues — even it is only internal bleeding — for three days. Otherwise it is ruled to be istiḥāḍah. | اثناء حمل میں عورت جو خون دیکھتی ہے اگر اس میں حیض کی صفات اور شرائط ہیں یا وہ حیض کی عادت کے زمانے میں آئے او رتین دن تک چلتارہے اگر چہ اندرہی رہے تو وہ حیض ہے ورنہ استحاضہ ہے۔ |

### `ihtiyatwajib` (khamenei, Q 8)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [2]

| English | Urdu |
|---|---|
| In cases where the most learned mujtahid gives a fatwā of obligatory caution, we can refer to the second most learned one. Our question is that if he also calls for obligatory caution, is it permissible to refer to the third most learned one and so on? Please explain this rule. | اس چیز کو مدنظر رکھتے ہوئے کہ جن مسائل میں اعلم مجتہد احتیاطِ واجب کا قائل ہے ان میں اس کے بعد والے اعلم کی طرف رجوع کرسکتے ہیں اب اگر اس کے بعد والا اعلم بھی اس مسئلہ میں احتیاطِ واجب کا قائل ہو تو کیا ہم اس مسئلے میں ان دونوں سے بعد والے اعلم کی طرف رجوع کرسکتے ہیں ؟ اور اگر تیسرا بھی اس بات کا قائل ہو تو کیا ہم ان سے بعد والے اعلم کی طرف رجوع کرسکتے ہیں اور اسی طرح … اس مسئلہ کی وضاحت فرمائیے؟ |

### `importedleather` (khamenei, Q 275)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Would you mind clearing up for us your respected opinion regarding leather and other animal parts that are imported from non-Muslim countries? | چمڑے اور دیگر حیوانی اجزاء جو غیر اسلامی ممالک سے آتے ہیں کے بارے میں آپ کی رائے کیا ہے؟ |

### `impuritytransfer` (khamenei, Q 282)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [2] vs []; en-ur ordinals: [3] vs [3, 3]

| English | Urdu |
|---|---|
| The object, which contacts an intrinsically najis material and becomes najis, makes another thing najis if they come into contact with each other when one of the two is wet. The latter makes, by obligatory caution, another thing najis on contact. However this third extrinsically najis object does not make anything najis. | عین نجاست سے لگنے والی چیز نجس ہو جاتی ہے اور اسی طرح اس سے لگنے والی دوسری چیز بھی اگر ان میں سے ایک تر ہو تونجس ہو جاتی ہے اور بنا بر احتیاط واجب اس سے لگنے والی تیسری چیزبھی نجس ہو جاتی ہے، لیکن یہ تیسری لگنے والی چیز کسی چیز کو نجس نہیں کرے گی۔ |

### `impuritytransfer` (khamenei, Q 282)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Something comes in contact with an extrinsically najis object. Does it become najis? And if it becomes najis, does it make anything else najis? What about the subsequent things in this chain? | کیا کسی نجاست سے لگ کر نجس ہونے والی (متنجس) چیز سے لگنے والی چیز بھی نجس ہو جاتی ہے یا نہیں؟ اور اگر نجس ہو جاتی ہے تو یہ حکم کتنے واسطوں تک جاری ہو گا؟ |

### `istibradoubt` (khamenei, Q 91)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 2

| English | Urdu |
|---|---|
| Occasionally, after urinating and doing istibrā’, wetness similar to urine comes out involuntarily. Is it najis or pure? And, if one notices the problem by chance after a while, what is the rule concerning the prayers he has performed earlier? Is it obligatory in the future to examine this wetness, which comes out involuntarily? | پیشاب اور استبراء کے بعد کبھی پیشاب کے مقام سے بلا اختیار ایسی رطوبت نکلتی ہے جو پیشاب سے مشابہ ہوتی ہے، کیا یہ رطوبت نجس ہے یا پاک ؟ اور اگر انسان کچھ مدت کے بعد اسکی طرف اتفاقاًمتوجہ ہو تو اس سے پہلے پڑھی گئی نمازوں کا حکم کیا ہے ؟ کیا اس پر واجب ہے کہ آئندہ اس بے اختیار نکلنے والی رطوبت کے بارے میں تحقیق کرے ؟ |

### `khqa337` (khamenei, Q 337)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [5] vs []

| English | Urdu |
|---|---|
| The five daily obligatory prayers are among the most important obligations in Islamic law; rather, they constitute the pillar of the faith. According to shar‘, forsaking their performance or belittling them is ḥarām and one who does so deserves divine punishment. | نماز پنجگانہ شریعت اسلامیہ کے اہم واجبات میں سے ہیں، بلکہ یہ دین کا ستون ہیں اور ان کا ترک کرنا یا سبک سمجھنا شرعاً حرام اور عذاب کا موجب ہے۔ |

### `khqa360` (khamenei, Q 360)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [2] vs []

| English | Urdu |
|---|---|
| Is the prayer of someone who has performed the second of two prayers before the first — such as the ‘ishā’ before the maghrib — correct? | کیا اس شخص کی نماز صحیح ہے جس نے دوسری نماز کوپہلی نماز پر مقدم کر دیا ہو، جیسے عشاء کو مغرب پر مقدم کیا ہو۔ |

### `khqa364` (khamenei, Q 364)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [4] vs []; en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| If all directions are equally probable and there is enough time, one should perform prayer in four directions, as per obligatory caution. But in the shortage of time one should repeat the prayer to every direction that he thinks it may be the correct one as much as time allows. | اگر کسی طرف کا گمان نہ ہو اور وقت بھی ہو تو بنا بر احتیاط چاروں طرف نماز پڑھی جائے، ورنہ جتنا وقت ہو اس کے مطابق جس سمت میں قبلہ کا احتمال ہے اسکی طرف نماز پڑھے۔ |

### `khqa364` (khamenei, Q 364)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 1 vs 0

| English | Urdu |
|---|---|
| Is it correct to perform prayer in any direction in the course of a fierce battle when it is not possible to determine the direction of qiblah? | جب جنگ میں شدید لڑائی جہت قبلہ کی تعیین سے مانع ہو تو کیا کسی بھی طرف رخ کر کے نماز کا پڑھنا صحیح ہے؟ |

### `khqa372` (khamenei, Q 372)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [2]

| English | Urdu |
|---|---|
| By obligatory caution, there should be a distance of — at least — one hand span between a man and a woman who are praying. In this case, their prayers are valid if they are in the same row or she stands in front of him. | احتیاط واجب کی بناپر ضروری ہے کہ نماز کی حالت میں مرد اور عورت کے درمیان کم از کم ایک بالشت فاصلہ ہو اور اس صورت میں اگر مرد اور عورت عرض میں ایک دوسرے کے بالمقابل کھڑے ہوں یا عورت آگے ہو تو دونوں کی نماز صحیح ہے۔ |

### `khqa382` (khamenei, Q 382)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| The prayer performed on usurped land is void even if one stands on a prayer mat or something else put on the land. | غصبی زمین پر پڑھی جانے والی نماز باطل ہے خواہ وہ جائے نماز یا تخت پر ہی کیوں نہ پڑھی جائے۔ |

### `khqa443` (khamenei, Q 443)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Wearing gold is ḥarām for men, whether for a short period or a long one. | مردوں کے لئے سونا پہننا حرام ہے، اور تھوڑے یا زیادہ وقت میں کوئی فرق نہیں ہے |

### `khqa454` (khamenei, Q 454)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur ordinals **!**: [3] vs []

| English | Urdu |
|---|---|
| What is your esteemed opinion on the third testimony for the master of believers, Imam Ali (a.), as being the commander and the leader, in the adhān and iqāmah of obligatory prayers? | واجب نماز کی اذان اور اقامت میں شہادت ثالثہ یعنی سید الاوصیاء (حضرت علی علیہ السلام ) کے امیر و ولی ہونے کی گواہی دینے کے سلسلے میں آپ کی رائے کیا ہے؟ |

### `khqa455` (khamenei, Q 455)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| I have been suffering from back pain for a long time which sometimes becomes so severe that it prevents me from praying while standing. Taking into consideration that if I want to perform my prayer at its beginning time, I will be compelled to do it in a sitting position, while if I wait, it may be possible for me to pray it at the end of its specific time in standing position, what is my duty in this situation? | ایک مدت سے کمر درد کی تکلیف میں مبتلا ہوں اور بعض اوقات تو اتناشدید ہوجاتا ہے کہ کھڑے ہو کر نماز نہیں پڑھ سکتا اس چیز کے پیش نظر اگر اول وقت میں پڑھوں تو حتماً بیٹھ کر پڑھوں گا لیکن اگر صبر کروں تو ہوسکتا ہے آخری وقت میں کھڑے ہو کر نماز پڑھ سکوں اس صورتحال میں میری ذمہ داری کیا ہے؟ |

### `khqa456` (khamenei, Q 456)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| It is obligatory for men to recite the chapter al-Fātiḥah and the other chapter loudly in the morning, maghrib, and ‘ishā’ prayers, and their prayer is void if they intentionally and knowingly recite them quietly, but if they do so unintentionally, out of ignorance, forgetfulness or for being unaware of the rule, their prayer is correct. | مردوں پر واجب ہے کہ وہ صبح، مغرب اور عشاء کی نماز میں حمد و سورہ کو بلند آواز سے پڑھیں لیکن اگر بھولنے یا مسئلہ نہ جاننے کی وجہ سے آہستہ پڑھ لیں تو نماز صحیح ہے تاہم اگر جان بوجھ کر اور حکم کو جانتے ہوے آہستہ پڑھیں تو نماز باطل ہے۔ |

### `khqa487` (khamenei, Q 487)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [2]; en-ur negation: 1 vs 2

| English | Urdu |
|---|---|
| There is no problem in doing prostration, and tayammum on it, although it is a caution to refrain from doing tayammum on cement and concrete tiles. | ان دونوں پر سجدہ کرنے میں کوئی حرج نہیں ہے اگر چہ احتیاط یہ ہے کہ ان پر تیمم نہ کیا جائے۔ |

### `khqa498` (khamenei, Q 498)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 1 vs 0

| English | Urdu |
|---|---|
| What is one’s shar‘ī duty upon listening to a verse that requires prostration when the reciter is not present, as from a radio, TV or recording instrument? | اگر ریڈیو ، ٹیپ ریکارڈر اور ٹی وی کے ذریعہ ایسی آیات نشر ہورہی ہوں جن میں سجدہ واجب ہے تو ان کو سننے کے بعد شرعی فریضہ کیا ہے؟ |

### `khqa503` (khamenei, Q 503)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Does it invalidate the prayers if a person laughs in the middle of his prayers upon recalling a joke or due to a humorous event? | اگر اثنائے نماز میں کوئی شخص کسی مضحکہ خیز بات کے یاد آنے یا کسی ہنسانے والے سبب کے پیش آنے سے ہنس پڑے توکیا اس کی نماز باطل ہے یا نہیں؟ |

### `khqa515` (khamenei, Q 515)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [2] vs []

| English | Urdu |
|---|---|
| Should a person pay heed to doubts that occur in nāfilah prayers (other than the doubt concerning the number of performed rak‘ahs)? For example, he is unaware whether he has done one prostration or two. | کیا نافلہ نمازوں میں رکعات کے علاوہ کسی اور چیز میں شک کی پروا کی جائیگی؟ مثلاً یہ شک کرے کہ ایک سجدہ بجا لایا ہے یا د و؟ |

### `khqa517` (khamenei, Q 517)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Doubts after the performance of a deed are ignored. In case he is certain of its invalidity, he must perform the qaḍā’ of what is possible. | عمل کے بعد شک کی پروا نہیں کی جاتی اور باطل ہونے کے علم کی صورت میں قابل تدارک عبادتوں کی قضاء واجب ہے۔ |

### `khqa518` (khamenei, Q 518)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [2] vs []; en-ur negation: 2 vs 1

| English | Urdu |
|---|---|
| Unintentional acts in prayer do not bring about its invalidation. In some cases, they call for the performance of two prostrations of inadvertence or some other rulings. But, of course, the prayers are invalidated if a rukn of the prayer is repeated or missed. The same rule is applied if a person is no more in the state of saying prayer. | نماز میں بھولے سے جو اعمال سرزد ہو جاتے ہیں وہ باطل ہونے کا سبب نہیں ہیں ہاں بعض موقعوں پر سجدہ سہو کا موجب بنتے ہیں، لیکن اگر کسی رکن میں کمی یا زیادتی ہو جائے تو اس سے نماز باطل ہوجاتی ہے۔ |

### `khqa518` (khamenei, Q 518)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Does the prayer of a person become void if he mistakenly performs some parts of his prayer in the place of other parts, or looks away at some point during the prayer, or speaks by mistake? | اگر بھول کر نماز کے بعض اجزاء کو دوسرے اجزاء کی جگہ بجا لائے یا اثنائے نماز میں اس کی نظر کسی چیز پر پڑ جائے یا بھولے سے کچھ کہہ دے تو کیا اس کی نماز باطل ہے یا نہیں؟ اور اس پر کیا واجب ہے؟ |

### `khqa521` (khamenei, Q 521)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [2] vs []

| English | Urdu |
|---|---|
| Do two prostrations of inadvertence become obligatory if a word of the dhikrs of the prayer, of the verses of the Holy Qur’an, or of the supplication of qunūt is mistakenly recited? | اگر کوئی شخص بھولے سے یا غلطی سے اذکار نماز، آیات قرآن یا دعائے قنوت کا کوئی لفظ غلط پڑھے تو کیا اس پر سجدۂ سہو واجب ہے؟ |

### `khqa536` (khamenei, Q 536)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [100]

| English | Urdu |
|---|---|
| Most often I offered my prayers and performed the qaḍā’ of those which I missed either because I was asleep during their times or my body and clothes were najis and I failed to clean them due to laziness. Now, how could I calculate the number of the missed daily, āyāt, and shortened prayers due on me? | میں زیادہ تر نمازیں پڑھتا رہا ہوں اورچھوٹ جانے والی نمازوں کی قضا کرتا رہا ہوں۔ یہ چھوٹ جانے والی نمازیں وہ ہیں جن کے اوقات میں، میں سو رہا تھا یا اسوقت میرا بدن و لباس نجس تھا کہ جن کا پاک کرنا دشوار تھا، لہذا نماز پنجگانہ، نماز قصر اور نماز آیات میں سے اپنے ذمے میں موجود نمازوں کا حساب کیسے لگاؤں؟ |

### `khqa563` (khamenei, Q 563)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 1 vs 0

| English | Urdu |
|---|---|
| In the prayers which should be said quietly, e.g. the noon and the afternoon prayers, he, by obligatory caution, is not permitted to recite the Fātiḥah and another chapter even if it is to protect oneself from losing his concentration on the prayer. It is mustaḥabb, instead, to say dhikr. | ظہر و عصر جیسی اخفاتی نمازوں میں، احتیط واجب کی بنا پر ماموم حمد اور سوره نه پڑھے،چاہے اپنے ذہن کو متمرکز کرنے کی غرض ہی سے ہو اور مستحب یه هے که  حمد اور سوره کی بجای کوئی ذکر پڑهے. |

### `khqa574` (khamenei, Q 574)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Do the prayers of the followers become void when the imam is at a higher position than them? | مامومین سے امام کی نماز کے مقام کے بلند ہونے کی رعایت نہ کرنے سے، کیا ان کی نماز باطل ہوجاتی ہے؟ |

### `khqa631` (khamenei, Q 631)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [2] vs []

| English | Urdu |
|---|---|
| The two ‘īd prayers, i.e. ‘Īd of Fitr and ‘Īd of Aḍḥā are not obligatory; rather, they are mustaḥabb in the present period. However, Friday prayer is optionally obligatory. | عصر حاضر میں نماز عیدین واجب نہیں ہے بلکہ مستحب ہے، لیکن نماز جمعہ واجب تخییری ہے۔ |

### `khqa631` (khamenei, Q 631)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [2] vs []

| English | Urdu |
|---|---|
| What kind of obligatory duties are the two ‘īd prayers in your opinion? What about Friday prayer? | آپ کی نظر میں نماز عیدین اور جمعہ، واجبات کی کونسی قسم میں سے ہیں؟ |

### `khqa637` (khamenei, Q 637)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [4]

| English | Urdu |
|---|---|
| The obligation of shortened specifically applies to some daily prayers, i.e., noon, afternoon and ‘ishā’. As for the morning and the maghrib ones, this rule does not apply. | قصر کا وجوب پنجگانہ نمازوں کی صرف چار رکعتی یعنی "ظہر و عصر اور عشائ" کی نمازوں سے مخصوص ہے، صبح اور مغرب کی نماز قصر نہیں ہوتی۔ |

### `khqa638` (khamenei, Q 638)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [10, 4, 4, 8, 8] vs [10, 2, 4, 4, 4, 8, 8, 8, 8]; en-ur negation: 11 vs 10

| English | Urdu |
|---|---|
| They are eight conditions:<br>i. The traveled distance should be at least eight continuous shar‘ī farsakhs, either going or returning, or altogether provided that the going distance is not less than four shar‘ī farsakhs.<br>ii. The intent to travel the distance should exist from the time of departure. Hence if one does not intend to cover the distance, or intends a shorter one and then intends to travel to another place after reaching his destination, whose distance from the first destination is less than the shar‘ī distance, but more than the shar‘ī distance from his home, one will not pray shortened.<br>iii. The continuation of intent until the distance is covered. Thus if one changes his mind before covering four shar‘ī farsakhs or hesitates, the rule of travel will not apply to him after that, but the shortened prayers he performed before changing his intention must be said again by obligatory caution.<br>iv. That there be no intention to interrupt one’s journey while covering the distance by passing through one’s hometown, or by intending to stay ten days or more in another place.<br>v. That the journey be a lawful one according to Islamic law. Thus if the journey is a sinful or ḥarām one, whether it is such in itself like fleeing a holy war, or its purpose is ḥarām, such as traveling to commit highway robbery, for example, the rule of the traveler will not apply to it.<br>vi. That the traveler not be one of those who live a migrant life, like some Bedouins who do not have a fixed location and wander through deserts and stay near water, grass and pastures.<br>vii. That traveling should not be one’s job, such as a driver, a sailor, a person who hires out animals of burden, and so on. One whose job is done in traveling is also treated like the aforementioned.<br>viii. Reaching the tarakhkhuṣ limit, namely the point from where one cannot hear the town’s adhān which is normal and said without a loudspeaker. | یہ آٹھ شرطیں ہیں:<br>١۔ سفر کی مسافت آٹھ شرعی فرسخ ہو یعنی صرف جانے کا فاصلہ یاصرف آنے کا فاصلہ یا دونوں طرف کا مجموعی فاصلہ آٹھ شرعی فرسخ ہو، بشرطیکہ صرف جانے کی مسافت چار فرسخ سے کم نہ ہو۔<br>٢۔ سفر پر نکلتے وقت آٹھ فرسخ کی مسافت کو طے کرنے کا قصد رکھتا ہو۔ لہذا اگرابتدا سے اس مسافت کا قصد نہ کرے یا اس سے کم کا قصد کرے اور منزل پر پہنچ کر دوسری جگہ کا قصد کر لے اور اس دوسری جگہ اور پچھلی منزل کے درمیان کا فاصلہ شرعی مسافت کے برابر نہ ہو، لیکن جہاں سے پہلے چلا تھا وہاں سے شرعی مسافت ہو تو نماز پوری پڑھے۔<br>٣۔ سفر کے دوران شرعی مسافت طے کرنے کے ارادے سے پلٹ جائے، لہذا اگر چار فرسخ تک پہنچنے سے پہلے ارادہ بدل دے یا اس سفر کو جاری رکھنے میں متردد ہو جائے تو اس کے بعد اس پر سفر کا حکم جاری نہیں ہوگا، اگر چہ ارادہ بدلنے سے قبل اس نے جو نمازیں قصر پڑھی ہیں وہ صحیح ہیں۔<br>٤۔شرعی مسافت کو طے کرنے کے دوران اپنے سفر کو اپنے وطن سے گزرنے یا ایسی جگہ سے گزرنے کے ذریعے کہ جہاں دس روز یا اس سے زیادہ ٹھہرنا چاہتاہے قطع کرنے کا ارادہ نہ رکھتا ہو۔<br>٥۔ شرعی اعتبار سے اس کا سفر جائز ہو، لہذا اگر سفر معصیت کاہو، خواہ وہ سفر خود ہی معصیت و حرام ہو جیسے جنگ سے فرار کرنا یا غرضِ سفر حرام ہو جیسے ڈاکہ ڈالنے کے لئے سفر کرنا، تو اس پر سفر کا حکم جاری نہیں ہو گا اور نماز پوری ہوگی۔<br>٦۔ مسافر، ان خانہ بدوشوں میں سے نہ ہو کہ جن کا کوئی معین مقام (وطن) نہیں ہوتا بلکہ وہ صحراؤں میں گھومتے رہتے ہیں اور جہاں انہیں پانی، گھاس اور چراگاہیں مل جائیں وہیں پر ڈیرہ ڈال دیتے ہیں۔<br>٧۔ سفر اس کا پیشہ نہ ہو جیسے ڈرائیور اور ملاح و غیرہ اور یہ حکم ان لوگوں کا بھی ہے جن کا شغل سفر میں ہو۔<br>٨۔ حد ترخص تک پہنچ جائے اور حد ترخص سے مراد وہ جگہ ہے کہ جہاں پر شہر کی اذان نہ سنی جا سکے۔ |

### `khqa638` (khamenei, Q 638)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [4]

| English | Urdu |
|---|---|
| What are the conditions for the four-rak‘ah prayers to become obligatorily shortened on the traveler? | مسافر پر چار رکعتی نمازوں میں وجوب قصر کے شرائط کیا ہیں؟ |

### `learningrulings` (khamenei, Q 6)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| If his carelessness in learning religious rules leads to forsaking an obligation or committing a ḥarām action, he will be a sinner. | اگر شرعی مسائل کا نہ سیکھنا کسی واجب کے چھوٹ جانے یا فعل حرام کے ارتکاب کا سبب بنے تو گناہگار ہے ۔ |

### `maghribishatime` (khamenei, 13.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-ur numbers **!**: [2, 2, 2] vs [2, 2, 3]; en-fa numbers **!**: [2, 2, 2] vs [3]; ur-fa numbers **!**: [2, 2, 3] vs [3]

| English | Urdu | Persian |
|---|---|---|
| Both maghrib and ‘ishā’ prayers have special and common times. A few minutes — enough to perform it — after maghrib is special for maghrib prayer. A few minutes — enough to perform it — before shar‘ī midnight is special to ‘ishā’ prayer. The gap between these two special times is common time for both. | نماز مغرب و عشاء کےلئے مخصوص اور مشترک وقت ہے۔ نماز مغرب کا مخصوص وقت مغرب کی ابتدا سے اس وقت تک ہے جس میں تین رکعت نماز پڑھ سکیں۔ نماز عشاء کا مخصوص وقت آدھی رات ہونے سے پہلے اتنا وقت ہو جس میں فقط نماز عشاء پڑھ سکیں۔ ان دونوں کا درمیانی وقت دونوں نمازوں کا مشترکہ وقت ہے۔ | هر یک از نماز مغرب و عشا وقت مخصوص و مشترک دارند؛ وقت مخصوص نماز مغرب از اول مغرب تا هنگامی است که به اندازۀ خواندن سه رکعت از مغرب بگذرد و وقت مخصوص نماز عشا هنگامی است که به اندازۀ خواندن نماز عشا تا نصف شب وقت مانده باشد و فاصلۀ بین وقت مخصوص نماز مغرب و وقت مخصوص نماز عشا، وقت مشترک نماز مغرب و نماز عشا می باشد. |

### `mubtilatlist` (khamenei, 322.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-ur negation **!**: 0 vs 1; en-fa numbers **!**: [] vs [1]; ur-fa numbers **!**: [] vs [1]; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| The prayer is invalidated in the following cases:<br>1. When one of the conditions of prayer ceases to exist during prayer;<br>2. When wuḍū’ or ghusl is invalidated;<br>3. To turn away from the qiblah;<br>4. Talking;<br>5. Laughing;<br>6. Weeping;<br>7. When the form of the prayer is disrupted;<br>8. Eating and drinking;<br>9. Doubts which invalidate the prayer;<br>10. To repeat a foundational element or to neglect it;<br>11. Saying āmīn after chapter al-Fātiḥah;<br>12. Placing one hand on the other in a certain manner which is called takattuf. | مبطلات نماز درج ذیل ہیں :<br>1۔ ان شرائط میں سے کسی کا مفقود ہونا جن کی نماز میں رعایت کرنا ضروری ہے۔<br><br>2۔ وضو یا غسل کا باطل ہونا۔<br><br>3۔ قبلے سے رخ پھیرنا<br><br>4۔ بات کرنا<br><br>5۔ ہنسنا<br><br>6۔ رونا<br><br>7۔ نماز کی شکل باقی نہ رہنا<br><br>8۔ کھانا اور پینا<br><br>9۔ وہ شک جو نماز کو باطل کرتا ہے<br><br>10۔ ارکان نماز کو کم کرنا اور بڑھانا<br><br>11۔ الحمد کے بعد آمین کہنا<br><br>12۔ پیٹ پر ہاتھوں کو باندھنا (تکتف)<br>* ۔ شکیات نماز میں بیان کئے جائیں گے۔ | مبطلات نماز عبارتند از:<br><br>1. از بین رفتن یکی از شرایطی که باید در حال نماز رعایت شود؛<br><br>2. باطل شدن وضو یا غسل؛<br><br>3. رو گرداندن از قبله؛<br><br>4. حرف زدن؛<br><br>5. خندیدن؛<br><br>6. گریه کردن؛<br><br>7. به هم خوردن صورت نماز؛<br><br>8. خوردن و آشامیدن؛<br><br>9. شک هایی که نماز را باطل می کند؛ 1<br><br>10. کم و زیاد کردن ارکان نماز؛<br><br>11. آمین گفتن بعد از حمد؛<br><br>12. روی هم گذاشتن دست ها در جلوی بدن (تکتف). |

### `obligatoryprayers` (khamenei, 1.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-ur negation **!**: 0 vs 1; en-fa numbers **!**: [] vs [1]; ur-fa numbers **!**: [] vs [1]; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| Obligatory prayers are as follows:<br>1. Daily prayers;<br>2. Prayer of ṭawāf which is said after obligatory tawāf around Ka‘bah;<br>3. Āyāt prayer which is performed due to natural phenomena such as a lunar/solar eclipse, earthquake, etc.<br>4. Mayyit prayer which is performed on the corpse of a deceased Muslim<br>5. Qaḍā’ prayers of one's father and, by obligatory caution, of the mother as well; to be performed by the eldest son.<br>6. The prayer which becomes obligatory due to nadhr (reciprocal vow), ‘ahd (covenant), qasam (oath), or through being hired to preform it. | واجب نمازیں درج ذیل ہیں؛<br>1۔ یومیہ نمازیں<br>2۔ نماز طواف جو خانہ کعبہ کے واجب طواف کے بعد ادا کی جاتی ہے۔<br>3۔ نماز آیات جو سورج گرہن، چاند گرہن، زلزلہ وغیرہ کے وقت ادا کی جاتی ہے۔<br>4۔ نماز میت جو دنیا سے رخصت ہونے والے مسلمان کے جنازے پر پڑھی جاتی ہے۔<br>5۔ باپ کی قضا نماز اور احتیاط واجب کی بناپر ماں کی قضا نماز جو بڑے بیٹے پر واجب ہے۔<br>6۔ وہ نماز جو عہد، نذر، قسم یا اجارہ کی وجہ سے واجب ہوتی ہے۔<br>* درحقیقت (ان مواقع پر) مستحب نماز واجب میں نہیں بدلتی بلکہ نذر، عہد، قسم اور اجارہ پر عمل کرنا واجب ہوتا ہے۔ | نمازهای واجب عبارت است از:<br><br>1. نمازهای یومیه؛<br><br>2. نماز طواف که پس از طواف واجب خانۀ کعبه خوانده می‌ شود؛<br><br>3. نماز آیات که هنگام خورشید گرفتگی، ماه گرفتگی، زلزله و مانند آنها خوانده می‌ شود؛<br><br>4. نماز میت که بر بدن مسلمانی که از دنیا رفته، خوانده می‌ شود؛<br><br>5. نماز قضای پدر و بنابر احتیاط واجب مادر که بر پسر بزرگ‌ واجب است؛<br><br>6. نمازی که به واسطه عهد، نذر، قسم و یا به واسطۀ اجاره، واجب (1) است خوانده شود. |

### `personsrejecting` (khamenei, Q 335)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| Does the rule applicable to a non-Muslim apply to a person who rejects some indispensable elements of the religion, such as fasting, etc.? | جو شخص ضروریات دین ۔جیسے روزہ و غیرہ ۔میں سے کسی کامنکر ہو جائے تو کیا اس پر کافر کا حکم لگے گا یا نہیں؟ |

### `personsunknown` (khamenei, Q 298)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| In an Islamic country a foreign person, whose religion is unknown, sells food items and touches it in the presence of transmitting moisture. Is it obligatory to ask him about his religion, or will the principle of presuming a state of purity apply? | ایک شخص کھا نا بیچتا ہے اور سرایت کرنے والی تری کے ساتھ کھا نے کو اپنے جسم سے چھوتا ہے، لیکن اس کے دین کا پتہ نہیں ہے اور وہ کسی دوسرے ملک سے اسلامی ملک میں کام کرنے کیلئے آیا ہے کیا اس سے اس کے دین کے بارے میں سوال کرنا واجب ہے؟ یا اس پر اصالت طہارت کا حکم جاری ہوگا؟ |

### `qiblaeffortqa` (khamenei, Q 363)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [2] vs [1, 16, 28]; en-ur ordinals **!**: [16, 28] vs [7]

| English | Urdu |
|---|---|
| Please answer the following questions:<br>i. It is stated based on some books on Islamic law that the sun is exactly above the Ka‘bah on two days: the 28th of May and the 16th of July. In such a condition, is it possible to determine the direction of the qiblah by fixing a pole in the ground at the time of adhān in Mecca? In case the direction of qiblah in the prayer niches of masjids differs from the direction of the pole’s shadow, which one is more correct?<br>ii. Is it correct to rely on a compass to find the qiblah? | درج ذیل سوالوں کے جواب عنایت فرمائیں۔<br>١ ۔ بعض فقہی کتابوں میں ذکر ہے کہ خرداد کی ساتویں اور تیر کی پچیسویں تاریخ بمطابق ۲۸مئی اور۱۶ جولائی کو سورج عمودی طور پر خانہ کعبہ کے اوپر ہوتا ہے، تو کیا اس صورت میں جس وقت مکہ میں اذان ہوتی ہے اس وقت شاخص نصب کر کے جہت قبلہ کو معین کیا جا سکتا ہے؟ اور اگر مسجدوں کے محراب کے قبلہ کی جہت، شاخص کے سایہ سے مختلف ہو تو کس کو صحیح سمجھا جائے گا؟<br>٢۔ کیا قبلہ نما پر اعتماد کرنا صحیح ہے؟ |

### `qiblanomeansqa` (khamenei, Q 366)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [4] vs []; en-ur negation: 1 vs 2

| English | Urdu |
|---|---|
| What should a person do in a place where he does not knows the direction of the qiblah for sure or with probability, i.e., all four directions enjoy equal chances to be that of the qiblah? | جس جگہ ہم جہت قبلہ کو نہ جانتے ہوں اور کسی جہت کا گمان بھی نہ ہو تو ایسی جگہ پر ہمیں کیا کرنا چاہیے یعنی کس سمت کی طرف رخ کرکے نماز پڑھیں ؟ |

### `quransajdah` (khamenei, 281.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-ur numbers **!**: [15, 19, 32, 37, 4, 41, 53, 62, 96] vs [1, 15, 19, 2, 3, 37, 4, 4, 62]; en-fa numbers **!**: [15, 19, 32, 37, 4, 41, 53, 62, 96] vs [1, 4]; ur-fa numbers **!**: [1, 15, 19, 2, 3, 37, 4, 4, 62] vs [1, 4]

| English | Urdu | Persian |
|---|---|---|
| In each of the four chapters of the holy Qur’an — chapter al-Sajdah, chapter Fuṣṣilat, chapter al-Najm, and chapter al-‘Alaq — there is a verse of obligatory sajdah. If you recite the whole verse or listen to it, you are immediately required to make sajdah. if you forget to perform it, you should do so when you remember.*<br><br>* The verses of obligatory sajdah are 32:15, 41:37, 53:62, and 96:19. | چار سوروں سورہ سجدہ (الم تنزیل)، فصلت (حم سجدہ)، نجم اور علق میں سے ہر ایک میں واجب سجدے کی ایک آیت ہے جسےاگر انسان پڑھے یا سنے تو اس کے ختم ہونے کے فوراً بعد سجدہ کرنا ضروری ہے اور اگرسجدہ کرنا بھول جائے تو جب بھی یاد آئے سجدے کو انجام دے۔<br>* سجدے والی آیات: 1۔ سورہ سجدہ، آیت 15۔ 2۔ سورہ فصلت، آیت37۔ 3۔ سورہ نجم، آیت62۔ 4۔ سورہ علق، آیت19 | در هریک از چهار سوره سجده (الم تنزیل)، فصلت (حم سجده)، نجم و علق ، یک آیه سجده واجب وجود دارد که اگر انسان آن را بخواند یا به آن گوش دهد، باید پس از پایان آیه فوراً سجده کند و اگر فراموش کند، هر وقت یادش آمد باید سجده را انجام دهد. 1 |

### `tayammuminvalidators` (khamenei, Q 200)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| When a junub person performs a valid tayammum as a substitute for the ghusl of janābah and a wuḍū’ invalidator occurs later, then as long as the excuse of performing tayammum instead of ghusl is existing it is of obligatory caution for him to perform tayammum instead of ghusl for every act that requires being in a state of purity and then to do wuḍū’, as well,. If he is excused from wuḍū’, he is to perform another tayammum instead of wuḍū’. | جب مجنب شخص غسل جنابت کے بدلے صحیح تیمم کر لے اور اس تیمم کے بعد اگر اس سے حدث اصغر سرزد ہو جائے تو جب تک تیمم کو جائز قرا ردینے والا شرعی عذر باقی ہے بنابر احتیاط واجب جن اعمال میں طہارت شرط ہے ان کیلئے غسل کے بدلے تیمم کرے اور پھر وضو بھی کرے اور اگر وضو بھی نہ کرسکتاہو تو ایک دوسرا تیمم وضو کے بدلے کرے۔ |

### `thirdfourthrakah` (khamenei, 184.)

*Why:* The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer, so it was not hidden automatically.  
*Differences:* en-ur numbers **!**: [3, 4] vs [3]; en-fa numbers **!**: [3, 4] vs [3]

| English | Urdu | Persian |
|---|---|---|
| It is enough in the 3rd and 4th rak‘ah of the prayer to say Subḥānallāhi wal ḥamdu lillhāhi wa lā ilḥā illallāu wallāhu akbar once. However, according to mustaḥabb caution, it is said three times. Of course, instead of this dhikr, which is called the four tasbīḥ, one may recite chapter al-Fātiḥah. | نماز کی تیسری اور چوتھی رکعت میں ایک دفعہ سبحان الله والحمدلله ولا الله الاالله والله اکبر پڑھنا کافی ہے اگرچہ احتیاط مستحب یہ ہے کہ تین دفعہ پڑھا جائے البتہ اس ذکر (جس کو تسبیحات اربعہ کہتے ہیں) کے بجائے سورہ حمد بھی پڑھ سکتے ہیں۔ | در رکعت سوم و چهارم نمازها گفتن یک بار «سبحان الله و الحمدلله و لااله الاالله و الله اکبر» کافی است؛ هرچند احتیاط مستحب آن است که سه مرتبه گفته شود. البته می توان به جای این ذکر (که تسبیحات اربعه نامیده می شود)، سوره حمد خواند. |

### `wuduimmersive` (khamenei, Q 102)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| For wuḍū’ by immersion one may submerge the face and the hands only twice into the water. It is obligatory for the first time, permissible for the second time, and impermissible for more than that. Regarding the hands, in the given wuḍū’, one should intend washing for wuḍū’ when bringing them out of water in order to make it possible to use their wuḍū’ water for wiping. | صرف دو مرتبہ ڈبویا جاسکتاہے پہلی مرتبہ ڈبونا واجب ہے اور دوسری مرتبہ جائز ہے اور اس سے زیادہ جائز نہیں ہے لیکن ضروری ہے کہ ارتماسی وضو میں وضو کیلئے ہاتھوں کے دھونے کی نیت اس وقت کرے جب انہیں پانی سے نکال رہا ہو تا کہ مسح آبِ وضو کے ساتھ انجام دے سکے۔ |

### `wuduobstruction` (khamenei, Q 113)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur negation **!**: 0 vs 1

| English | Urdu |
|---|---|
| If the fingernail polish has a substance that prevents water from reaching the nails, the wuḍū’ is void, and wiping performed on socks is incorrect, however transparent they may be. | اگر اس پالش کی اپنی تہ ہو تو وہ پانی کے ناخن تک پہنچنے سے رکاوٹ ہے اور وضو باطل ہے اور جوراب پر مسح صحیح نہیں ہے چاہے وہ کتنا ہی باریک ہو۔ |

### `wudusocks` (khamenei, Q 119)

*Why:* No Persian original to decide with (Q&A answer, or the Urdu-only treatise).  
*Differences:* en-ur numbers **!**: [] vs [2]

| English | Urdu |
|---|---|
| My feet are affected with paralysis and I walk with the help of medical shoes and crutches. It is not possible for me to take off the shoes for wuḍū’. Please explain my shar‘ī duty concerning the wiping of the feet. | میرے دونوں پاؤں مفلوج ہوچکے ہیں اور میں طبی جوتوں اور بیسا کھیوں کے ساتھ چلتاہوں ۔ وضو کرتے وقت کسی بھی صورت میں میرے لئے جوتوں کا اتارنا ممکن نہیں ہے لذا بتائیے پاؤں کے مسح کے سلسلے میں میری شرعی ذمہ داری کیا ہے ؟ |

### `ayatcauses` (khamenei, 660.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 2 vs 0; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| Āyāt prayer becomes obligatory for one of the following four reasons:<br>1. Solar eclipse, even if only a very small part of sun is not visible;<br>2. lunar eclipse, even if only a very small part of moon is not visible;<br>3. Earthquake;<br>4. Any abnormal event in the sky that causes fear to most of the people, such as black and red winds and lightning. | نماز آیات مندرجہ ذیل چار میں سے کسی ایک کے سبب واجب ہوتی ہے؛<br>1۔ کسوف (سورج گرہن) اگر چہ کچھ حصے کو ہی گرہن لگے۔<br>2۔ خسوف (چاند گرہن) اگرچہ کچھ حصے کو ہی گرہن لگے۔<br>3۔ زلزلہ<br>4۔ ہر غیر معمولی حادثہ جس کے باعث لوگوں کی اکثریت خوف میں مبتلا ہوجائے مثلاً سیاہ و سرخ آندھی اور بجلی کی کڑک۔ | نماز آیات با وجود یکی از چهار سبب زیر واجب می شود:<br><br>1. کسوف (خورشید گرفتگی) اگرچه مقدار کمی از آن گرفته باشد؛<br><br>2. خسوف (ماه گرفتگی) اگرچه مقدار کمی از آن گرفته باشد؛<br><br>3. زلزله؛<br><br>4. هر حادثه غیر عادی آسمانی که باعث ترس بیشتر مردم شود، مانند بادهای سیاه و سرخ و صاعقه. |

### `clothingconditions` (khamenei, 56.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 4 vs 0; ur-fa negation **!**: 4 vs 0

| English | Urdu | Persian |
|---|---|---|
| The clothes of a praying person should be:<br>1. pure;<br>2. permissible to use;<br>3. not a part of an animal of not-ritually slaughtered;<br>4. not a part of an animal of ḥarām meat;<br>5. for men, not to be golden;<br>6. for men, not to made from silk only. | نمازی کے لباس کی شرائط درج ذیل ہیں:<br>1۔ پاک ہو؛<br>2۔ مباح ہو؛<br>3۔ مردار کے اجزاء سے نہ بنا ہو؛<br>4۔ حرام گوشت حیوان کے اجزاء سے نہ بنا ہو؛<br>5۔ مرد کا لباس سونے کا نہ ہو؛<br>6۔ مرد کا لباس خالص ریشم کا نہ ہو؛ | لباس نمازگزار باید دارای شرایط زیر باشد:<br><br>1. پاک باشد؛<br><br>2. مباح باشد؛<br><br>3. از اجزای مردار نباشد؛<br><br>4. از اجزای حیوان حرام گوشت نباشد؛<br><br>5. لباس مرد از طلا نباشد؛<br><br>6. لباس مرد از ابریشم خالص نباشد. |

### `dailyrakat` (khamenei, 3.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa numbers **!**: [17, 2, 3, 4, 4, 4] vs [2, 3, 4, 4, 4]; ur-fa numbers **!**: [17, 2, 3, 4, 4, 4] vs [2, 3, 4, 4, 4]

| English | Urdu | Persian |
|---|---|---|
| The daily prayers consist of 17 rak‘ah which are made up of the following:<br>1. Fajr prayer (two rak‘ah)<br>2. Ẓuhr prayer (four rak‘ah)<br>3. ‘Aṣr prayer (four rak‘ah)<br>4. Maghrib prayer (three rak‘ah)<br>5. ‘ishā’ prayer (four rak‘ah) | یومیہ واجب نمازیں 17 رکعت ہیں جوکہ درج ذیل ہیں؛<br>نماز صبح (دو رکعت)<br>نماز ظہر (چار رکعت)<br>نماز عصر (چار رکعت)<br>نماز مغرب (تین رکعت)<br>نماز عشاء (چار رکعت) | نمازهای واجب شبانه‌روز هفده رکعت است که عبارت‌ اند از:<br><br>* نماز صبح (دو رکعت)<br><br>* نماز ظهر (چهار رکعت)<br><br>* نماز عصر (چهار رکعت)<br><br>* نماز مغرب (سه رکعت)<br><br>* نماز عشاء (چهار رکعت). |

### `excessiveprayer` (khamenei, 382.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa numbers **!**: [] vs [1, 2]; ur-fa numbers **!**: [] vs [1, 2]

| English | Urdu | Persian |
|---|---|---|
| The one, who doubts too much in a special prayer, like in loud prayers*, if he doubts in another prayer, such as in a whispering prayer**, he should act according to the rule of doubt.<br><br>* Jahr prayers, i.e. those in which chapter al-Fātiḥah and the second chapter are recited aloud.<br><br>** Ikhfāt prayers, i.e. those in which chapter al-Fātiḥah and the second chapter are recited whispering. | جو شخص کسی مخصوص نماز مثلاً جہریہ نمازوں میں زیادہ شک کرتا ہو اگر دوسری نماز مثلاً اخفاتی نماز میں شک کرے تو اس شک کے حکم پر عمل کرے۔ | کسی که در نماز مخصوصی؛ مانند نمازهای جهریّه 1 زیاد شک می کند، اگر در نماز دیگری مانند نماز اخفاتی 2 شک کند، باید به دستور شک رفتار کند. |

### `followerahead` (khamenei, 717.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa numbers **!**: [1, 2, 3, 4] vs []; en-fa negation: 8 vs 2; ur-fa numbers **!**: [1, 2, 3, 4] vs []; ur-fa negation: 5 vs 2

| English | Urdu | Persian |
|---|---|---|
| The followings terms should be observed in congregational prayer:<br>1- A ma‘mūm should not stand in front of the imam. Rather, it is an obligatory caution to stand a little behind.<br>2- The imam’s place should not be higher than that of ma‘mūms. Of course, a little difference, less than one handspan, is no problem.<br>3- There should not be a long gap between the imam and the ma‘mūm nor among different rows.<br>4- There should not be a barrier, like a wall or a curtain, between the imam and the ma‘mūm nor among the rows. However, putting a curtain or the like between the rows of men and women is no problem. | نماز جماعت میں مندرجہ ذیل شرائط کا خیال رکھنا ضروری ہے :<br>1 ۔ مقتدی امام سے آگے کھڑ انہ ہو اور احتیاط واجب یہ ہے کہ امام سے تھوڑا پیچھے کھڑا ہو۔<br>2 ۔ امام کی جگہ مقتدی کی جگہ سے بلند نہ ہو البتہ تھوڑی بلند ہونا (ایک بالشت سے کم) اشکال نہیں رکھتا۔<br>3 ۔ امام اور مقتدی اور اسی طرح صفوں کے درمیان زیادہ فاصلہ نہ ہو۔<br>4 ۔ امام اور مقتدی کے درمیان اور اسی طرح صفوں کے درمیان دیوار یا پردہ جیسی کوئی چیز حائل نہ ہو، البتہ مردوں اور عورتوں کی صف کے درمیان پردہ حائل ہونا کوئی اشکال نہیں رکھتا۔ | در نماز جماعت، شرایط زیر باید مراعات شود:<br><br>1. مأموم جلوتر از امام نایستد و احتیاط واجب آن است کمی عقب تر بایستد.<br><br>2. مکان امام از مکان مأمومین بالاتر نباشد، البته اختلاف کم (کمتر از یک وجب) اشکال ندارد.<br><br>3. فاصلة میان امام و مأموم، همچنین فاصله بین صف ها زیاد نباشد.<br><br>4. بین امام و مأموم، همچنین بین صف ها چیزی مانند دیوار یا پرده مانع نباشد ولی نصب پرده و مانند آن بین صف مردان و زنان اشکال ندارد. |

### `fridayprayer` (khamenei, 762.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa numbers **!**: [] vs [1]; ur-fa numbers **!**: [] vs [1]

| English | Urdu | Persian |
|---|---|---|
| The Friday prayer which replaces the ẓuhr prayer on Fridays is a takhyīrī (optionally incumbent) obligation* at the present time, i.e. during the occultation of Imam Mahdi (a). However, at a time when a just Islamic government is ruling in Iran, the mustaḥabb caution is not to miss it if possible.<br>* Takhyīrī obligation means that the person is allowed to offer either the Friday prayer or ẓuhr prayer. | موجودہ زمانے (زمانہ غیبت امام عجل اللہ فرجہ الشریف) میں نماز جمعہ پڑھنا کہ جو جمعے کے روز نماز ظہر کے جگہ پڑھی جاتی ہے، واجب تخییری ہے اور احتیاط مستحب یہ ہے کہ آج کے دور میں کہ جب ایران میں اسلامی عادل حکومت قائم ہے حتی الامکان نماز جمعہ کو ترک نہ کیا جائے۔<br>* ۔ واجب تخییری سے مراد یہ ہے کہ مکلف کو روز جمعہ کے ظہر کے وقت واجب فریضے کی ادائیگی میں نماز جمعہ یا نماز ظہر پڑھنے کے مابین اختیار حاصل ہے کہ کسی ایک کو واجب کی نیت سے پڑھے۔ | نماز جمعه که در روز جمعه به جای نماز ظهر خوانده می شود، در عصر حاضر (زمان غیبت امام عجل الله تعالی فرجه الشریف) واجب تخییری 1 است و احتیاط مستحب آن است که در این زمان که حکومت عدل اسلامی در ایران برقرار است حتی المقدور نماز جمعه ترک نشود. |

### `impureunaware` (khamenei, 59.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 1 vs 0; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| If a person does not know that his body or clothes are najis and realizes it after the prayer, his prayer is valid, but if he knew before the prayer that his body or clothes were najis, then forgot and performed the prayer with it, his prayer is invalid. | جو شخص نہیں جانتا کہ اس کا بدن یا لباس نجس ہے اور نماز کے بعد معلوم ہوجائے تو اس کی نماز صحیح ہے لیکن اگر پہلے سے اس کے نجس ہونے کا علم تھامگر بھول کر اس کے ساتھ نماز پڑھی ہو تو اس کی نماز باطل ہے۔ | اگر نداند که بدن یا لباسش نجس است و بعد از نماز بفهمد، نمازش صحیح است ولی اگر قبلاً نجاست آن را می دانسته و فراموش کرده و با آن نماز خوانده است، نمازش باطل است. |

### `muwalat` (khamenei, 303.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 2 vs 0; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| The praying person should perform the acts of the prayer successively, meaning that he should not leave a lengthy unusual gap between the acts of prayer, such as rukū‘, sajdah and tashahhud. Therefore, if a person leaves a lengthy break between the acts of prayer so that, according to an onlooker, it seems like he is not praying, the prayer is void. | نماز پڑھنےوالے کو چاہئے کہ نماز کے اجزاء مثلا ًرکوع، سجدہ اور تشہد وغیرہ کو پے در پے بجالائے اور ان کے درمیان طویل اور غیرمعمولی فاصلہ نہ ڈالے۔ اس عمل کو موالات کہتے ہیں۔ بنابرایں اگر نماز کے اجزاء کے درمیان اتنا فاصلہ ڈالے کہ دیکھنے والے کی نظر میں نماز کی حالت سے خارج ہوجائے تو نماز باطل ہے۔ | نمازگزار باید اجزای نماز، مانند رکوع، سجده، تشهد و غیر اینها را پیدرپی به جا آورد و بین آنها فاصله طولانی و غیر متعارف نیندازد، به این امر موالات گفته می شود. بنابراین اگر بین اجزای نماز به قدری فاصله شود که در نظر بیننده از حالت نماز خواندن خارج شود، نماز باطل است. |

### `prayingearly` (khamenei, 16.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 1 vs 0; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| It is mustaḥabb that one offers prayers at the beginning of their times as Islamic instructions advise it with emphasis. If a person cannot offer a prayer at the beginning of its time, then the closest to this time you offer, the better unless it is better to delay it for a reason, such as when a person wants to perform the prayer in congregation. | مستحب ہے کہ انسان نماز کو اول وقت میں پڑھے۔ اس کے بارے میں اسلامی دستورات میں تاکید کے ساتھ سفارش کی گئی ہے اور اگر اول وقت میں نہ پڑھ سکے تو اول وقت سے جتنا نزدیک پڑھ سکے بہتر ہے مگر یہ کہ تاخیر سے پڑھنا کسی لحاظ سے بہتر ہو مثلا جماعت کے ساتھ نماز پڑھنا چاہے۔ | مستحب است انسان نماز را در اول وقت بخواند، در دستورهای اسلامی در این مورد سفارش مؤکّدی شده است و اگر نتواند در اول وقت نماز بخواند، هرچه نزدیکتر به اول وقت باشد، بهتر است، مگر آنکه تأخیر نماز از جهتی بهتر باشد، مانند اینکه بخواهد آن را به جماعت بخواند. |

### `qasrdistancestart` (khamenei, 411.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa numbers **!**: [] vs [1]; en-fa negation **!**: 1 vs 0; ur-fa numbers **!**: [] vs [1]; ur-fa negation **!**: 2 vs 0

| English | Urdu | Persian |
|---|---|---|
| The criterion for calculating the shar‘ī distance is the distance between the end of the city of departure and the beginning of the city of destination*; whether the city is large or not.<br>* i.e. from the last houses in the city of departure till the first houses of the city of destination. | مسافت شرعی کو حساب کرنے کا معیار جس شہر سے سفر شروع کررہا ہے اس کے آخر سے لے کر جس شہر کی طرف سفر کررہا ہے اس کی ابتدا تک کا فاصلہ ہے اس میں کوئی فرق نہیں کہ شہر بڑا ہو یا نہ ہو۔<br>* ۔ یعنی جس شہر سے سفر شروع کررہا ہے اس کے آخری گھروں سے منزل مقصود والے شہر کے ابتدائی گھروں تک کا فاصلہ حساب کیا جائے گا۔ | ملاک محاسبه مسافت شرعی فاصله بین آخر شهر مبدأ و ابتدای شهر مقصد است؛ 1 خواه شهر جزو بلاد کبیره باشد خواه نباشد. |

### `qasrignorance` (khamenei, 604.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa numbers **!**: [] vs [1]; en-fa negation: 4 vs 2; ur-fa numbers **!**: [] vs [1]

| English | Urdu | Persian |
|---|---|---|
| A traveler who does not know that the prayer is short while traveling, and performs complete prayer contrary to his duty while he is qāṣir* ignorant, then after understanding the ruling, he does not need to repeat the prayer.<br>* It means that he does not know the ruling nor aware of his ignorance. | جو مسافر نہ جانتا ہو کہ سفر میں نماز قصر ہوتی ہے اور اپنے وظیفے کے برعکس نماز کو پوری پڑھتا ہو چنانچہ جاہل قاصر ہو تو حکم کو جاننے کے بعد نماز کو دوبارہ یا قضا کرنا لازمی نہیں ہے۔ | مسافری که نمی داند نماز در سفر قصر است و بر خلاف وظیفه اش نماز را تمام می خواند، در صورتی که جاهل قاصر باشد 1 ، پس از فهمیدن حکم، لازم نیست نماز را اعاده یا قضا کند. |

### `qasrjob` (khamenei, 478.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 1 vs 0; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| One of the conditions for shortening the prayer while traveling is that the trip is not for work, so if the trip is for work, whether travel constitute the work, such as driving or piloting, or whether traveling is a preliminary to the job, such as the travel of a doctor or a teacher who travels for his job, prayer is complete during that trip and fasting is correct. | سفر میں نماز قصر ہونے کی شرائط میں سے ایک یہ ہے کہ سفر اس کا پیشہ نہ ہو ، بنابرایں اگر کسی شخص کا پیشہ سفر ہو چاہے اس کے پیشے کا وجود سفر سےہو (یعنی سفر اس کی درآمد کا ذریعہ ہو) مثلاً ڈرائیور اور پائلٹ یا سفر اس کے پیشے کا مقدمہ(ضروری تمہید) ہو مثلاً ڈاکٹر یا معلم جو اپنے پیشے کے لئے سفر کرتے ہیں، اس سفر میں نماز پوری ہوگی اور روزہ صحیح ہے۔ | از شرایط قصر نماز در سفر آن است که سفر شغل نباشد، بنابراین اگر سفر شغل باشد؛ خواه قوام شغل به سفر کردن باشد، مانند رانندگی یا خلبانی و خواه سفر کردن مقدمة شغل باشد، مانند سفر پزشک یا معلمی که برای شغلش سفر می کند، نماز در آن سفر تمام و روزه صحیح است. |

### `sajdahheight` (khamenei, 258.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 1 vs 0; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| The place where a person puts his forehead for sajdah should not be more than four joined fingers lower or higher than the place where he places his knees and the tips of his toes. | سجدے کی حالت میں پیشانی کی جگہ گھٹنوں اور پاوں کی انگلیوں کی جگہ سے چار ملی ہوئی انگلیوں کی مقدار سے نیچی یا بلند نہیں ہونا چاہئے۔ | در حال سجده باید جای پیشانی از جای زانوها و سرانگشتان پا، بالاتر یا پایین تر از چهار انگشت بسته نباشد. |

### `tashahhudforgot` (khamenei, 292.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 1 vs 0; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| A person who forgets tashahhud and stands up for the third rak‘ah, if he remembers that he has not recited tashahhud before going to rukū‘, he has to sit, recite tashahhud, stand up again, say tasbīḥ of the third rak‘ah, and finish the prayer. Then, based on mustaḥabb caution, he performs two sahw sajdah because of his wrongly standing. | اگر تشہد پڑھنا بھول جائے اور تیسری رکعت کے لئے کھڑا ہوجائے لیکن رکوع سے پہلے یاد آئے تو بیٹھ جائے اور تشہد پڑھے اور دوبارہ کھڑے ہوکر تیسری رکعت کی تسبیحات کو دوبارہ پڑھے اور نماز جاری رکھے اور نماز کے بعد بے جا قیام کے لئے احتیاط مستحب کی بناپر دو سجدہ سہو بجالائے۔ | اگر تشهد را فراموش کند و برای رکعت سوم بایستد ولی پیش از رکوع یادش بیاید، باید بنشیند و تشهد را بگوید و دوباره بایستد و تسبیحات رکعت سوم را مجدداً بگوید و نماز را ادامه دهد و پس از نماز برای ایستادن بی جا، بنابر احتیاط مستحب دو سجده سهو به جا آورد. |

### `turningface` (khamenei, 325.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa numbers **!**: [] vs [2]; ur-fa numbers **!**: [] vs [2]

| English | Urdu | Persian |
|---|---|---|
| If a person intentionally turns his face or his body from the qiblah so that he can see the right or left easily, his prayer is invalidated. If a person does so unintentionally, by obligatory caution, his prayer becomes invalidated. However, if a person turns his face a little to each side, his prayer is not invalidated. | اگر جان بوجھ کر قبلے سے اس حد تک اپنا بدن یا رخ پھیرے کہ دائیں اور بائیں طرف آسانی سے دیکھ سکتا ہو تو نماز باطل ہے اور اگر بھول کربھی ایسا کرے تو احتیاط واجب کی بناپر نماز باطل ہے لیکن اگر چہرے کو ایک طرف تھوڑا پھیرے تو نماز باطل نہیں ہے۔ | اگر عمداً صورت یا بدن خود را از قبله برگرداند، به طوری که بتواند سمت راست و چپ خود را به آسانی ببیند، نمازش باطل است و اگر سهواً هم این کار را بکند، بنابر احتیاط واجب نماز باطل است ولی اگر اندکی صورت را به یکی از دو طرف برگرداند، نمازش باطل نمی شود. |

### `usurpedclothing` (khamenei, 78.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa negation **!**: 1 vs 0; ur-fa negation **!**: 1 vs 0

| English | Urdu | Persian |
|---|---|---|
| The clothes of the praying person should be permissible (they should not be usurped). | نماز پڑھنے والے کا لباس مباح ہو یعنی غصبی نہ ہو۔ | لباس نمازگزار باید مباح باشد؛ یعنی غصبی نباشد. |

### `zuhrasrtime` (khamenei, 8.)

*Why:* Neither the English nor the Urdu matches the Persian.  
*Differences:* en-fa numbers **!**: [2, 2, 2] vs []; ur-fa numbers **!**: [2] vs []

| English | Urdu | Persian |
|---|---|---|
| Both ẓuhr and ‘aṣr prayers have special and common times. A few minutes — enough to say it — after shar‘ī noon is special for ẓuhr prayer. A few minutes — enough to perform it — before sunset is special to ‘aṣr prayer. The gap between these two special times is common time for both. | نماز ظہر اور عصر میں سے ہر ایک کے لئے مخصوص اور مشترک وقت ہے۔ نماز ظہر کا مخصوص وقت ابتدائے ظہر سے لے کر اتنا وقت گزرنے تک ہے کہ جس میں نماز ظہر پڑھ سکیں اور نماز عصر کا مخصوص وقت غروب آفتاب سے پہلے اتنا وقت ہے کہ جس میں فقط نماز عصر پڑھ سکیں۔ ان دونوں کا درمیانی وقت نماز ظہر و عصر کا مشترک وقت ہے۔ | نماز ظهر و عصر هر کدام وقت مخصوص و مشترک دارند؛ وقت مخصوص نماز ظهر از اول ظهر است تا هنگامی که به اندازۀ خواندن نماز ظهر از اول ظهر گذشته باشد و وقت مخصوص نماز عصر موقعی است که به اندازۀ خواندن نماز عصر به غروب آفتاب وقت مانده باشد و فاصله بین وقت مخصوص نماز ظهر و وقت مخصوص نماز عصر، وقت مشترک نماز ظهر و نماز عصر است. |
