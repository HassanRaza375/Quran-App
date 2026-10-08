import json,re,sys
sys.stdout.reconfigure(encoding="utf-8")
import os
from paths import SRC
t=open(os.path.join(SRC,"sis_en.txt"),encoding="utf-8").read()
g=t[t.find("<<<PAGE 510>>>"):]
def d(head, end):
    # headword at a line start, followed by its definition on the same line
    # (skips wrapped continuation lines such as "tayammum " ending a previous entry)
    m=re.search("\n"+re.escape(head)+r" +(?=\S)", g)
    assert m, head
    i=m.start()+1
    w=re.sub(r"\s+"," ",g[i+len(head)+1:i+len(head)+600])
    e=re.sub(r"\s+"," ",end)
    j=w.find(e); assert j>=0,(head,end)
    return w[:j+len(e)].strip()
# (id, glossary headword, end-of-definition, arabic, urdu)
T=[("wajib","wājib","obligatory","واجب","واجب"),
("haram","ḥarām","unlawful; prohibited","حرام","حرام"),
("mustahab","mustaḥabb","recommended","مستحب","مستحب"),
("makruh","makrūh","disapproved","مکروہ","مکروہ"),
("mubah","mubāḥ","(2) not usurped","مباح","مباح"),
("mujtahid","mujtahid","authority \nin Islamic law","مجتهد","مجتہد"),
("marja","marjaʿ","a source of emulation in these matters","مرجع","مرجع"),
("taqlid","taqlīd","following a jurist","تقليد","تقلید"),
("muqallid","muqallid","in matters of Islamic law","مقلد","مقلد"),
("mukallaf","mukallaf","to fulfil religious duties","مكلف","مکلف"),
("baligh","bāligh","a major","بالغ","بالغ"),
("bulugh","bulūgh","age of legal responsibility","بلوغ","بلوغ"),
("adil","ʿādil","possessing moral probity","عادل","عادل"),
("alam","aʿlam","mujtahids of his time","أعلم","اعلم"),
("ihtiyat","iḥtiyāṭ","precaution","احتياط","احتیاط"),
("ihtiyatlazim","al‑iḥtiyāṭ al‑lāzim","al‑iḥtiyāṭ al‑wājib)","الاحتياط اللازم","احتیاط لازم"),
("ihtiyatmustahab","al‑iḥtiyāṭ al‑mustaḥabb","recommended precaution","الاحتياط المستحب","احتیاط مستحب"),
("mumayyiz","mumayyiz","a discerning minor","مميز","ممیز"),
("usuldin","uṣūl al‑dīn","fundamentals of religion","أصول الدين","اصول دین"),
("kurr","kurr","approximately 384 litres","كر","کر"),
("qalil","qalīl","less than kurr","قليل","قلیل"),
("mutlaq","muṭlaq","unmixed water","مطلق","مطلق"),
("mudaf","muḍāf","mixed water","مضاف","مضاف"),
("najis","najis","impure","نجس","نجس"),
("tahir","ṭāhir","pure","طاهر","طاہر"),
("istibra","istibrāʾ","clearing the male urethra of urine after urinating","استبراء","استبراء"),
("wudu","wuḍūʾ","ablution","وضوء","وضو"),
("jabirah","jabīrah","is applied to a wound","جبيرة","جبیرہ"),
("tartib","tartīb","sequence","ترتيب","ترتیب"),
("muwalah","muwālāh","close succession","موالاة","موالات"),
("ghusl","ghusl","ritual bathing","غسل","غسل"),
("junub","junub","state of janābah","جنب","جنب"),
("janabah","janābah","ritual impurity","جنابة","جنابت"),
("hayd","ḥayḍ","menstruation; period","حيض","حیض"),
("istihadah","istiḥāḍah","irregular blood discharge","استحاضة","استحاضہ"),
("nifas","nifās","blood discharge after childbirth","نفاس","نفاس"),
("tayammum","tayammum","dry ablution","تيمم","تیمم"),
("rukn","rukn","elemental component of an act of worship","ركن","رکن"),
("rakah","rakʿah","a unit of the prayer","ركعة","رکعت"),
("qiraah","qirāʾah","recitation","قراءة","قرأت"),
("ruku","rukūʿ","bowing position in the prayer","ركوع","رکوع"),
("sajdah","sajdah","prostration","سجدة","سجدہ"),
("tashahhud","tashahhud","testifying","تشهد","تشہد"),
("salam","salām","salutation","سلام","سلام"),
("qunut","qunūt","in front of the face","قنوت","قنوت"),
("adhan","adhān","call to prayer","أذان","اذان"),
("iqamah","iqāmah","call to stand up for prayer","إقامة","اقامت"),
("qibla","qibla","Kaʿbah in Mecca","قبلة","قبلہ"),
("qasr","qaṣr","shortened prayers of a traveller","قصر","قصر"),
("tamam","tamām","complete form of the prayer","تمام","تمام"),
("qada","qaḍāʾ","not performed in its prescribed time","قضاء","قضا"),
("ada","adāʾ","as opposed to qaḍāʾ","أداء","ادا"),
("jamaah","jamāʿah","congregation","جماعة","جماعت"),
("mamum","maʾmūm","in congregational prayers","مأموم","ماموم"),
("watan","waṭan","home town","وطن","وطن"),
("turbah","turbah","when prostrating","تربة","تربت"),
("niyyah","niyyah","intention","نية","نیت"),
("takbiratalihram","takbīrat al‑iḥrām","at the beginning of the prayer","تكبيرة الإحرام","تکبیرۃ الاحرام"),
("taqibat","taʿqībāt","supplications after prayers","تعقيبات","تعقیبات"),
("mubtilat","mubṭilāt","things that invalidate","مبطلات","مبطلات"),
("zawal","zawāl","begins to decline","زوال","زوال"),
("nafilah","nāfilah","the supererogatory prayer","نافلة","نافلہ"),
("furada","furādā","as opposed to in jamāʿah","فرادى","فرادیٰ"),
("salatalayat","ṣalāt al‑āyāt","the prayer of signs","صلاة الآيات","نماز آیات"),
("jahr","jahr","whispering it (ikhfāt)","جهر","جہر"),
("ikhfat","ikhfāt","aloud (jahr)","إخفات","اخفات"),
# Phase 4a: doubts, ṣalāt al-iḥtiyāṭ, sajdatā al-sahw
("shakk","shakk","doubt","شك","شک"),
("shakkiyyat","shakkiyyāt","doubts that arise in prayers","شكيات","شکیات"),
("zann","ẓann","supposition; conjecture","ظن","ظن"),
("kathiralshakk","kathīr al‑shakk","excessive doubter","كثير الشك","کثیر الشک"),
("salatalihtiyat","ṣalāt al‑iḥtiyāṭ","the precautionary prayer","صلاة الاحتياط","نماز احتیاط"),
("sajdatalsahw","sajdatā al‑sahw","the two prostrations for inadvertence","سجدتا السهو","سجدۂ سہو"),
# Phase 5: fasting and zakāt al-fiṭrah
("sawm","ṣawm","fasting","صوم","روزہ"),
("kaffarah","kaffārah","recompense","كفارة","کفارہ"),
("fidyah","fidyah","under certain circumstances","فدية","فدیہ"),
("mudd","mudd","approximately 750 grams","مد","مد"),
("saa","ṣāʿ","2.823 kilograms","صاع","صاع"),
("iftar","ifṭār","breaking a fast","إفطار","افطار"),
("faqir","faqīr","expenses for one year","فقير","فقیر"),
("rajaa","rajāʾ","desired by Allah","رجاء","رجاء"),
("madhimmah","mā fī al‑dhimmah","with regard to a particular act","ما في الذمة","ما فی الذمہ"),
("maghrib","maghrib","has passed overhead","مغرب","مغرب"),
("hadd","ḥadd al‑tarakhkhuṣ","permitted limit","حد الترخص","حد ترخص"),
("nadhr","nadhr","vow","نذر","نذر"),
("zakatfitrah","zakāt al-fiṭrah","fiṭrah alms tax","زكاة الفطرة","زکوٰۃ فطرہ"),
]
out=[]
for id_,h,end,ar,ur in T:
    end=end.replace(" \n","\n")
    try: txt=d(h,end)
    except AssertionError: txt=d(h,end.replace("\n"," "))
    out.append({"id":id_,"term":h,"arabic":ar,"urdu":ur,"definition":{"en":txt},
      "source":{"title":"Islamic Laws (4th edition)","reference":"Glossary","url":"https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"}})
    print(id_,"|",txt)
body=json.dumps(out,ensure_ascii=False,indent=2)
body=re.sub(r'^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":',r"\1\2:",body,flags=re.M)
hdr='''// Wajibat glossary. `definition.en` is cut verbatim (by script) from the
// Glossary of al-Sistani's *Islamic Laws* (4th ed., sistani.org PDF,
// downloaded 2026-09-25). `arabic`/`urdu` are the app's standard spellings of
// the term itself (labels, not definitions). Urdu definitions are not added:
// the official Urdu book's glossary has not been matched term-by-term yet.
import type { GlossaryTerm } from "./types";

export const WAJIBAT_GLOSSARY: GlossaryTerm[] = '''
open(sys.argv[1],"w",encoding="utf-8",newline="\n").write(hdr+body+";\n")
