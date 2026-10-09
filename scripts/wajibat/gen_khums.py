# Phase 6 generator: Khums and Zakat. Every text is looked up verbatim in the downloaded official sources:
#   Sistani:  Islamic Laws 4th ed., Rulings 1768-1866 (Chapter Six, Khums; sistani.org pages 2305-2312, 8299) and
#             1871-2002 (Chapter Eight, Zakat; pages 2314-2327), the unnumbered passage on business goods, /
#             توضیح المسائل (Urdu pages 3645 and 3646). Revised (*) rulings were compared with the Urdu one by one (P6).
#             Rulings 2003-2044 (zakat al-fitrah) are in gen_sawm.py.
#   Khamenei: «The Rulings of Khums» (احکام خمس), questions 1-314 in the English (book 256), the official Urdu (245) and
#             the Persian original (215), paired by question number and read against the Persian (R11, kh_khums.py).
#             Seven English answers the parse could not read cleanly (empty or mixed with another question) are left
#             out and listed in the progress log. The book's 275 unnumbered statements and notes are NOT included
#             (the three editions cannot be paired paragraph by paragraph); his zakat chapter exists only in Persian
#             and Arabic, so he has no zakat entries here (decision G4).
# Amounts (niṣāb, rates, weights) are quoted exactly as the text states them (decision G2); no calculator (G1).
import sys
from entries import *  # S(), KK(), R(), RULINGS

OUT_KHUMS, OUT_ZAKAT = sys.argv[1], sys.argv[2]
LF = chr(10)

def table(text):
    return {int(a): b.strip() for a, b in (ln.split("|", 1) for ln in text.strip().split(LF) if "|" in ln)}

# ---------------- app-written headings (explanations, not rulings) ----------------
S_SUBJ = table("""
1768|What khums is due on
1769|Surplus income from earnings
1770|Property acquired without earning it
1771|Dowry, khulʿ and blood money
1772|Inherited property
1773|Savings made by being frugal
1774|Living expenses paid by someone else
1775|Property given to particular persons
1776|Charity received by a poor person
1777|Buying with money on which khums is unpaid
1778|Paying later with money on which khums is unpaid
1779|Buying something on which the seller has not paid khums
1780|A gift on which khums has not been paid
1781|Property from a disbeliever or one who does not pay khums
1782|When the khums year begins
1783|Paying khums during the year or at its end
1784|Dying during the year
1785|Trade goods whose price rises and then falls
1786|Waiting to sell in the hope of a higher price
1787|Selling property that was not bought for trade
1788|Selling a garden after its price rises
1789|The growth of trees
1790|Several lines of business
1791|The expenses of earning the profit
1792|What counts as the year's living expenses
1793|Vows, kaffārah, gifts and prizes
1794|A daughter's trousseau acquired gradually
1795|Hajj and ziyārah expenses
1796|Property on which khums is not due
1797|Provisions left over at the end of the year
1798|Household furniture used before the year ends
1799|A year without profit
1800|Profit that comes after spending from the capital
1801|Loss of part of the capital
1802|Loss of property other than the capital
1803|Borrowing to meet living expenses
1804|Borrowing to increase wealth
1805|Paying khums from the item or its value
1806|Disposal of property before khums is paid
1807|Taking responsibility for khums
1808|Settling the khums with a jurist
1809|A partner who has not paid khums
1810|A minor's profit
1811|Doubting whether khums was paid
1812|A purchase that is not a necessary expense
1813|Purchasing with a non-specified undertaking
1814|Khums unpaid for years
1815|Mined products
1816|The niṣāb for mined products
1817|Mined products below the niṣāb
1818|Chalk and lime
1819|A mine on any land
1820|Not knowing whether the value reaches the niṣāb
1821|Several persons extracting from a mine
1822|Extracting from another's land without his consent
1823|What a treasure trove is
1824|A treasure trove on barren land
1825|The niṣāb for treasure troves
1826|A treasure trove on purchased or rented land
1827|Treasure troves found in several places
1828|Two people finding a treasure trove
1829|Property found in an animal's stomach
1830|Lawful property mixed with unlawful: quantity and owner unknown
1831|Lawful property mixed with unlawful: quantity known, owner unknown
1832|Lawful property mixed with unlawful: owner known, quantity unknown
1833|Finding out that the unlawful part was larger
1834|Paying khums on mixed property, or giving ṣadaqah for the owner
1835|Mixed property whose owner is one of a group
1836|Gems from underwater diving
1837|Gems obtained without diving
1838|Fish and other animals from the sea
1839|Finding a gem while diving for another purpose
1840|A gem found in a creature's stomach
1841|Diving in large rivers
1842|Ambergris
1843|A diver's or miner's living expenses
1844|A child who extracts or finds
1845|Spoils of war with the Imam's command
1846|War without the Imam's authorisation
1847|Property of those whose property is inviolable
1848|Taking from a ḥarbī disbeliever
1849|The property of a nāṣibī
1850|Land a dhimmī buys from a Muslim
1851|How khums is divided
1852|An orphan or stranded sayyid
1853|A stranded sayyid on a sinful journey
1854|A sayyid who is not dutiful or not a Twelver Shia
1855|A sayyid who uses khums for sin
1856|A person who claims to be a sayyid
1857|A person known as a sayyid in his town
1858|Giving khums to one's sayyidah wife
1859|A sayyid whose living expenses are obligatory on the giver
1860|A poor sayyid whose provider does not provide
1861|The amount that may be given to one person
1862|Taking khums to another town
1863|Receiving khums as the agent of a jurist
1864|Pricing an item above its value in lieu of khums
1865|Counting a debt owed by a sayyid as khums
1866|Making it a condition that the amount is returned
1871|The ten things zakat is due on
1872|The niṣāb and the owner's ownership
1873|Owning an item for eleven months
1874|Sanity and bulūgh
1875|When wheat, barley, raisins and dates are liable
1876|Disposal over the crop
1877|Intoxication or unconsciousness of the owner
1878|Disposal over the other items
1879|Borrowed gold, silver or other items
1880|The niṣāb of wheat, barley, dates and raisins
1881|Consuming the crop before zakat is given
1882|The owner dies after zakat is due
1883|A collector appointed by a jurist
1884|Zakat becoming due after one becomes the owner
1885|Selling the crop after zakat is due
1886|Buying a crop on which zakat may have been given
1887|Weight when wet and when dry
1888|Consuming before the crop dries
1889|The three kinds of dates
1890|Zakat is not repeated on the same crop
1891|Irrigation by rain or a stream
1892|Irrigation by both means
1893|Doubting the means of irrigation: both or rain
1894|Doubting the means of irrigation: both or buckets
1895|Rain and a stream, with some buckets
1896|Land that uses moisture from adjacent land
1897|The expenses of growing the crop
1898|Seeds
1899|The government's share of the produce
1900|Deducting expenses before or after zakat is due
1901|Deducting expenses from the zakat
1902|Giving zakat before threshing or drying
1903|Handing over the standing crop
1904|Costs after handing over the crop
1905|Crops in towns with different harvest times
1906|Fruit twice a year
1907|Fresh dates or grapes
1908|Zakat on dried dates or raisins given in fresh form
1909|A debtor who dies owning the crop
1910|A debtor who dies, and the debt paid first
1911|Crops of different quality
1912|The two niṣābs of gold
1913|The two niṣābs of silver
1914|Zakat every year
1915|Minted gold and silver
1916|Coins used as women's ornaments
1917|Gold and silver below both niṣābs
1918|Eleven months of ownership
1919|Exchanging or melting during the eleven months
1920|Melting coins in the twelfth month
1921|Coins with extra alloy
1922|Coins with the usual alloy
1923|Grazing for the whole year
1924|Bought or rented pastureland
1925|The twelve niṣābs for camels
1926|Camels between two niṣābs
1927|The two niṣābs for cows
1928|The five niṣābs for sheep
1929|Sheep between two niṣābs
1930|Male and female animals
1931|Cows and buffaloes, camels, goats and sheep
1932|The age of the animal given
1933|The value of the sheep given
1934|Partners
1935|Animals in various places
1936|Sick or defective animals
1937|All the animals sick, defective or old
1938|Exchanging animals before the eleventh month ends
1939|Giving zakat from other wealth or from the animals
1940|The eight ways zakat can be spent
1941|More than a year's expenses
1942|Doubting whether the rest will last the year
1943|A craftsman or trader whose income falls short
1944|A poor person who owns a house or tools
1945|A poor person who can work
1946|A person who was poor before
1947|A person who was not poor before
1948|Counting a poor person's debt as zakat
1949|A poor person who dies in debt
1950|Giving without saying it is zakat
1951|Giving to someone who turns out not to be poor
1952|A debtor who cannot repay
1953|A debtor who spent the loan on sin
1954|The lender counting the debt as zakat
1955|A stranded traveller
1956|A stranded traveller's unspent zakat
1957|The receiver must be a Twelver Shia
1958|A poor child or insane person
1959|A poor person who begs
1960|A person who drinks alcohol, does not pray or sins openly
1961|Repaying a debtor's debt
1962|The living expenses of those one must support
1963|Giving zakat to one's son
1964|Books for one's son
1965|Marrying off a poor son or father
1966|A wife whose husband provides for her
1967|A woman in a temporary marriage
1968|A woman giving zakat to her husband
1969|A sayyid receiving zakat from a non-sayyid
1970|A person not known to be a sayyid
1971|The intention for giving zakat
1972|Not specifying which item the zakat is for
1973|An agent giving zakat
1974|When zakat is to be given or set aside
1975|Not giving it at once
1976|Zakat that perishes through negligence
1977|Zakat that perishes without negligence
1978|Setting zakat aside
1979|Using what has been set aside
1980|Profit from what has been set aside
1981|Giving to someone who is present
1982|Trading with set-aside zakat
1983|Giving before zakat is due
1984|A poor person who knows zakat is not due
1985|A poor person who does not know
1986|The respectable poor, relatives and the virtuous
1987|Openly or secretly
1988|No one entitled in one's town
1989|Taking it to another town
1990|Weighing and measuring charges
1991|Asking the recipient to sell it back
1992|Doubting whether zakat was given
1993|A poor person accepting less or more
1994|Books and supplications from the "in the way of Allah" share
1995|Property bought with zakat and endowed to children
1996|Hajj and ziyārah from the "in the way of Allah" share
1997|A poor person as the owner's representative
1998|A poor person who receives animals, gold or silver
1999|Joint owners
2000|Khums, zakat and other debts
2001|Khums, zakat and ḥajj for a person who dies
2002|A student of knowledge
""")

Q_SUBJ = table("""
1|Goods kept in a shop for sale
2|Valuing shop goods: wholesale or retail price
3|Trees and the profit of planting them
4|A shop bought years ago without a khums year
5|Agricultural land that has risen in value
6|A commercial property and a mortgage on the home
7|Tools used in business
8|Desks, chairs and fittings of a business
9|A machine built for one's business
10|A taxi bought in instalments
11|An apartment bought partly from a pension
12|Sheep bought with a loan for business
13|Khums on the principal capital
14|Capital too small to cover living expenses
15|A truck and the capital needed to replace it
16|A house with a mortgage and a business property
17|A rise in prices caused by inflation
18|A property developer: land, building and sale
19|Bank profit and inflation
20|A rug bought to preserve the value of money
21|A machine bought with money not subject to khums
22|A carpet bought to preserve the value of money, then sold
23|Land bought to sell after its value rises
24|Agricultural land, tools and equipment
25|Shares and securities
27|Stocks bought with a loan
28|A peddler's goods
29|A shop opened with capital already subject to khums
30|Wages owed for years and not paid
31|Wages that cannot be collected by the year's end
32|Lending one's salary
33|A qarḍ ḥasan deposit in a bank
34|A debt that falls due after the khums year
35|Borrowed money and bank loans
36|Contributions to ribā-free loan funds
37|Profits of ribā-free loan funds
38|A monthly fund that pays one member in turn
39|A deposit required by an employer
40|Wages received in advance
41|An advance payment for a tour and hotel
42|An airline ticket bought before the year's end
43|An advance payment on a vehicle
44|An advance payment not completed at delivery
45|Paying for a vehicle before the year ends, taking delivery after
46|A Hajj registration deposit and its bank profit
47|Money set aside for Hajj or ʿUmrah
48|A deposit for a mustaḥabb Hajj
49|Retirement pensions
50|Surplus household items
51|Surplus consumable household items
52|Gold coins
53|Gold coins whose prices keep changing
54|Gold coins bought to trade
55|Gold held as an investment
58|Agricultural products and the khums year
59|Agricultural products with no buyer at the year's end
60|Rice farmers: part sold, part kept
61|Bank profit on income from an orchard
62|Seeds on which khums was not paid
63|Fertilizer bought from annual income
64|Wages earned in a non-Muslim country
65|Income from reciting elegies, praying or reciting the Qurʾān
66|A guarantor who is reimbursed
67|Converting income into goods or gold
68|Deposits for construction projects
69|A bank loan frozen in the account
71|A house bought by three brothers and part rented out
73|Money set aside for redress of wrongs
74|A private school founded with a bank loan
75|A company whose members do not pay khums
76|Money invested in a silent partnership
77|Partnership funds turned into goods
78|A murābaḥa loan to buy goods
79|Ḥarām property mixed with ḥalāl
80|The ḥarām part exceeds one-fifth
81|Income subject to khums mixed with ḥarām property
82|Making wholly unlawful capital lawful
83|Shares in mining companies
84|Items bought for guests who did not come
85|A book not yet used
86|Household items that could not be found
87|A house contract cancelled by the seller
88|Land bought for a family orchard
89|Land bought to develop an orchard
90|A woman's gold bought monthly
91|Birds and an aquarium at home
92|Animals kept by a farmer for his livelihood
93|Collectibles: coins, banknotes, stamps
94|Pens, notebooks, oil and soap kept in stock
95|Stationery
96|Medication left at the year's end
97|Credit left on phone cards and SIM cards
98|Souvenirs bought on pilgrimage
99|Donating property on which khums is unpaid to a mosque
100|Gold bought by a husband for his wife
101|Gifting to one's spouse before the year ends
102|Spouses gifting their profits to each other
103|A salary received in late December
104|Money gifted to a child
105|An expensive property bought and gifted
106|A flat gifted to a daughter at her wedding
107|Charitable spending
108|A gold necklace worn by a man
109|An extravagant wedding
110|Savings made by reducing living expenses
111|Spending income to avoid khums
112|A set of dishes partly used
113|A complete set bought for the household
114|A multi-volume book set of which one volume is used
115|A dowry gradually prepared
116|Household items bought below market price
117|Land bought and a house begun
118|Land suitable for a home
119|Land bought for a necessary residence
120|Saving for necessary expenses
121|A bank account for a young daughter
122|A payment for future residential land
123|A house bought with a loan
124|Clothes bought at a fair
125|Necessities bought with khums-paid income
126|Necessities bought with income subject to khums
127|A house built with income on which khums was not paid
128|An old carpet set aside
129|An item bought mid-year and not needed at the year's end
130|A necessary house that one cannot live in
131|Exchanging a dilapidated house
132|Selling a residence and using the money for capital
133|A parking area later rented out
134|Converting a residence into a business after the year
135|A house with a shop
136|Selling a car bought years ago
137|Selling a residence after the year and depositing the money
138|Selling a house or car bought with annual income
139|Land bought with khums-paid money
140|A salary deposited just before the year's end
141|Saving to buy a residence
142|Saving for marriage
143|Students of Islamic studies and their tithes
144|Saving from daily expenses for construction
145|Decorating a shop
146|Improvements to a shop paid from income
147|A house built to be rented out
148|Taxes deducted from a salary
149|Tax determined but not yet paid
150|Past tax debts
151|Debt for living necessities
152|A debt deducted from annual income
153|A check cashed at the year's end
154|Interest-free loans and debts
155|School tuition paid by check
156|Annual savings, cash debt and instalments
157|Utility bills and wages of a shop
158|A debt equal to a sum owed
159|A loan in the bank account at the year's end
160|A bank loan deposited for a year
161|Instalments of a loan for household items
162|Annual instalments of a multi-year loan
163|A loan for building a house
165|Repaying instalments early
166|Money held in trust
167|A loan given to a tenant
168|A loan taken by the landlord
169|A loan the tenant is compelled to give
170|Khums-paid money left over
171|A method of calculating that began with the first income
172|Non-khums-liable property added to capital
173|Appreciation of khums-paid business tools
174|Selling khums-paid tools for more
175|Unsold goods on which khums was paid last year
176|Goods sold or unsold at the year's end
177|A new businessman's questions
178|A government subsidy paid into the salary account
179|Khums-paid money and new deposits
180|A balance left after paying khums
181|A wedding gift, a marriage loan and a salary
182|Adding to an account on which khums was paid
183|Damaged tools of a producer
184|Sheep and cash compared with last year
185|A pension and a wife's allowance
186|A bride price received from the groom
187|Employee bonuses and rewards
188|Compensation for a former prisoner of war
189|Severance pay
190|Goods given by the government to employees
191|Veterans' pensions
192|Leave pay of former prisoners of war
193|A pension for the parents of a former prisoner of war
194|A pension for the families of martyrs
195|A pension for the children of martyrs
196|Inheritance of a martyr's children
197|Performance bonuses
198|Items on a pay slip
199|Prizes from banks and loan funds
200|A housewife's household money
201|Student stipends and tithes for students of Islamic studies
202|A student's savings from grants
203|A mother whose expenses are paid by her children
204|Maintenance from one's parents
206|Inherited silver coins
207|A garden inherited by a son
208|A wife's dowry
209|Fourteen gold coins as a dowry
210|Interest on a monetary dowry
211|Profits of land and endowment properties
212|Income from an endowment of one's ancestors
213|Blood money
214|Interest on blood money
215|Insurance premiums
216|Compensation paid by insurance companies
217|Compensation for damages in an accident
218|Life insurance accounts
219|Medical costs reimbursed by insurance
220|An insurance company owing medical expenses
221|Unemployment insurance
222|Insurance payments during medical leave
223|A father's pension paid to his survivors
224|Young unmarried people and the khums year
225|A housewife's khums year
226|Having no income left at the year's end
227|Paying before the year ends
228|How the khums year is determined
229|Training stipends and the start of the year
230|Wages paid by check
231|Not having set a khums year
232|A lunar or a solar year
233|Changing from the Gregorian to the solar year
234|Advancing the khums year
235|Delaying the calculation by two months
236|Necessities bought before the first calculation
237|A shared khums year for spouses
238|Dying during the khums year
239|Funeral expenses and the khums year
240|Khums on a minor's property
241|A girl who reached the age of taklīf
242|The property of an insane person
243|A person with severe Alzheimer's disease
244|Money given by someone who then loses his reason
245|Several jobs and several khums years
246|Paying the khums of a property from next year's income
247|Paying last year's khums from this year's income
248|Exchanging money that has not reached its khums year
249|Doubting whether khums was paid
250|Not being sure whether money is liable
251|Money found in a book
252|Years without a calculation
253|Not being able to pay
254|A person abroad who has not paid
255|Unpaid khums for several years
257|Paying in instalments
258|Delaying payment until next year
259|A salary deposited in an investment account
260|A penalty for delay
261|Delaying the calculation for years
262|Unhulled rice kept in a warehouse
263|Permission from a representative of another marja'
264|A debt of khums paid late
265|An old calculation paid late
266|Delay for customary expenses
267|Setting the khums aside
268|Using khums that was set aside
269|A transaction with khums that was set aside
270|Paying khums on each income as it arrives
271|A separate year for large income near the year's end
272|Paying khums to a marja' other than the one followed
273|An earlier marja's authorisation to collect
274|Authorisation to allocate the shares
275|Paying the needy directly
276|Religious tithes and the government
277|Paying a sayyid's electricity and water bills
278|Public schools
279|The Imam's share and Islamic books
280|The Imam's share owed
281|Land given on behalf of a deceased father
282|A poor sayyid and obligatory maintenance
283|A sayyid with a job
284|The sayyids' share for a sayyid's marriage
285|A sayyidah wife
286|A sayyidah widow
287|Paying khums to one's parents
288|A sayyid helping his children
289|An heir and the deceased's unpaid khums
290|Land transferred to a child before death
291|Heirs who refuse to settle the khums
292|An heir who knows the deceased owed khums
293|A father who does not pay khums
294|Socializing with those who do not pay
295|Dealing with those who do not pay
296|Buying something on which khums is unpaid
297|Business partners with no khums account
298|Partners who each pay on their share
299|Gifts and prizes under a former marja'
300|Khums on a sold necessity
301|Khums paid on a property that was not liable
302|Extra khums paid in a year
303|Reclaiming dues paid to a place or person
304|Khums paid by mistake
305|Paying khums without the intention of qurbah
306|Paying khums on behalf of another
307|Land divided among children without paying khums
308|A creditor's debt paid as khums
309|Delivering the exact amount
310|Forgiving khums
311|Khums that cannot be made a settlement
312|Paying a calculated amount whose delay was approved
313|An intermediary who delivers khums
314|The khums year arriving before Hajj registration
""")

# Rulings of Sistani that have a Khamenei question on the same point (same topic): Sistani ruling -> question number.
PAIR = {1773: 110, 1779: 296, 1783: 227, 1784: 238, 1793: 107, 1794: 115, 1810: 240, 1814: 255, 1830: 79, 1833: 80}
# Revised (*) rulings: compared with the Urdu one by one (P6): "match" keeps the Urdu, "lag" leaves it out.
STAR = {1772: "match", 1782: "match", 1798: "lag", 1803: "lag", 1810: "lag", 1861: "lag", 1865: "lag", 1939: "match"}

rng = lambda a, b: list(range(a, b + 1))
# topic -> (Sistani rulings, Khamenei questions), both in the order shown
KHUMS = {
    "khumsitems": ([1768, 1769, 1770, 1774, 1775, 1776, 1810], rng(240, 243)),
    "khumsunpaid": ([1777, 1778, 1779, 1780, 1781, 1811, 1812, 1813, 1814], rng(252, 255) + rng(293, 296)),
    "khumscapital": (rng(1785, 1791), rng(1, 78)),
    "khumsmaunah": ([1773] + rng(1792, 1799), rng(84, 144)),
    "khumsexpenses": (rng(1800, 1804), rng(145, 184)),
    "khumsexempt": ([1771, 1772], rng(185, 223)),
    "khumsyear": (rng(1782, 1784) + rng(1805, 1809), rng(224, 239) + rng(244, 251) + rng(257, 271)),
    "khumsmined": (rng(1815, 1822), [83]),
    "khumstreasure": (rng(1823, 1829), []),
    "khumsgems": (rng(1836, 1844), []),
    "khumsmixed": (rng(1830, 1835), rng(79, 82)),
    "khumsspoils": (rng(1845, 1850), []),
    "khumsdistribution": (rng(1851, 1866), rng(272, 288)),
    "khumsmisc": ([], rng(289, 292) + rng(297, 314)),
}
ZAKAT = {
    "zakatconditions": rng(1871, 1879),
    "zakatcrops": rng(1880, 1911),
    "zakatgoldsilver": rng(1912, 1922),
    "zakatlivestock": rng(1923, 1939),
    "zakatrecipients": rng(1940, 1970),
    "zakatgiving": rng(1971, 2002),
}

import kh_khums
LEFT_OUT = [n for n in range(1, 315) if n in kh_khums.EN and not (kh_khums.usable(n) and n in kh_khums.FA)]
MISSING_EN = [n for n in range(1, 315) if n not in kh_khums.EN]

def sis(n):
    star = STAR.get(n)
    return S(n, urdu=star) if star else S(n)

# ---- the book's unnumbered statements (kh_stm.py), each in the topic of its section ----
import kh_stm
STM_TOPIC = {35612: "khumsitems", 35613: "khumsitems", 35614: "khumscapital", 35616: "khumscapital", 35624: "khumsmined",
             35628: "khumsmined", 35625: "khumstreasure", 35629: "khumstreasure", 35630: "khumsgems", 35632: "khumsmaunah",
             35633: "khumsmaunah", 35634: "khumsexpenses", 35635: "khumsexempt", 35636: "khumsexempt", 35641: "khumsyear",
             35642: "khumsdistribution", 35643: "khumsmisc"}
def stm_topic(i):
    e = kh_stm.EN[i]
    return "khumsgems" if e["sn"] == 35625 and re.search(r"gemstone|pearl|coral", e["text"]) else STM_TOPIC[e["sn"]]
STM_ADDED = [i for i, e in enumerate(kh_stm.EN) if not kh_stm.fragment(e)]
STM_LEFT = [i for i, e in enumerate(kh_stm.EN) if kh_stm.fragment(e)]
assert all(kh_stm.EN[i]["sn"] in STM_TOPIC for i in STM_ADDED)

used_q = set()
def khums_topic(topic, s_list, q_list):
    qs = [q for q in q_list if q not in LEFT_OUT and q in kh_khums.EN]
    for n in s_list:
        q = PAIR.get(n)
        if q is not None:
            assert q in qs, (n, q, topic)
            used_q.add(q)
            R(f"sk{n}", topic, S_SUBJ[n], sis(n), KK(q))
        else:
            R(f"sk{n}", topic, S_SUBJ[n], sis(n))
    for i in STM_ADDED:
        if stm_topic(i) == topic:
            e = kh_stm.EN[i]
            R(f"ks{i + 1}", topic, f"{e['title']}, paragraph {e['para']}", KS(i), audience="khamenei")
    for q in qs:
        if q in used_q:
            continue
        used_q.add(q)
        R(f"kq{q}", topic, Q_SUBJ[q], KK(q), audience="khamenei")

for topic, (s_list, q_list) in KHUMS.items():
    khums_topic(topic, s_list, q_list)
n_khums = len(RULINGS)

# ---- Zakat (Sistani only: Khamenei's zakat chapter exists only in Persian and Arabic; G4) ----
for topic, s_list in ZAKAT.items():
    for n in s_list:
        R(f"zk{n}", topic, S_SUBJ[n], sis(n))
# business goods: an unnumbered passage of the 4th edition (page 2323); the Urdu edition has no counterpart located
BUSINESS = S(intro=(2323, "Goods which a person comes to own through a contract of exchange", "it is not obligatory for him to give zakat on them.", None, None, None, "Zakat on business goods (unnumbered passage)"),
             urdu_note="The official Urdu edition (توضیح المسائل) has no counterpart to this passage that could be located, so only the English is shown (decision R1).")
R("zkbusiness", "zakatbusiness", "Zakat on business goods and its conditions", BUSINESS)
# keep the passage in its place: after the livestock rulings, before the recipients (topic order handles it)

# ---- checks ----
ids = [r["id"] for r in RULINGS]
assert len(ids) == len(set(ids))
all_q = set(q for _, (_, ql) in KHUMS.items() for q in ql if q not in LEFT_OUT and q in kh_khums.EN)
assert used_q == all_q, (sorted(all_q - used_q)[:5])
unplaced = [q for q in kh_khums.EN if q not in used_q and q not in LEFT_OUT]
assert not unplaced, unplaced
for q in used_q:
    assert q in Q_SUBJ, ("no heading for question", q)
for n in set(sum([s for s, _ in KHUMS.values()], []) + sum(ZAKAT.values(), [])):
    assert n in S_SUBJ, ("no heading for ruling", n)
print("statements:", len(STM_ADDED), "with Urdu+Persian:", sum(1 for i in STM_ADDED if i in kh_stm.TRIPLE), "left out (a Q/A fragment):", STM_LEFT)
print("khums rulings:", n_khums, "zakat rulings:", len(RULINGS) - n_khums,
      "| Khamenei questions placed:", len(used_q), "left out (unclear in the source):", LEFT_OUT, "| not in the English edition:", MISSING_EN)

finalize(RULINGS)
from holds import apply_holds
apply_holds(RULINGS)

HDR = """// GENERATED by scripts/wajibat/gen_khums.py: do not hand-edit the quoted strings.
// Every ruling text was copied by script from the marja's official publication:
//   Sistani:  sistani.org Islamic Laws 4th ed. (English) / توضیح المسائل (Urdu)
//   Khamenei: leader.ir "The Rulings of Khums" (English, with the official Urdu and the Persian original)
// Revised (*) Sistani rulings were compared with the Urdu one by one (decision P6).
// Amounts are quoted exactly as the text states them (decision G2).
"""
def write(path, const, doc, rulings):
    with open(path, "w", encoding="utf-8", newline=LF) as f:
        f.write(doc + HDR + 'import type { Ruling } from "../types";' + LF + LF + f"export const {const}: Ruling[] = " + ts(rulings) + ";" + LF)

K_R = [r for r in RULINGS if r["topicId"] in KHUMS]
Z_R = [r for r in RULINGS if r["topicId"] not in KHUMS]
write(OUT_KHUMS, "KHUMS_RULINGS", "// Khums (Phase 6).\n//\n", K_R)
write(OUT_ZAKAT, "ZAKAT_RULINGS", "// Zakat (Phase 6).\n//\n", Z_R)

# Keep each topic's rulingIds in app/data/wajibat/topics.ts in step with the rulings generated here.
import os, re
from paths import DATA
tp = os.path.join(DATA, "topics.ts")
s = open(tp, encoding="utf-8").read()
for topic in dict.fromkeys(r["topicId"] for r in RULINGS):
    m = re.search(r'(id: "%s",.*?rulingIds: \[)([^\]]*)\]' % topic, s, re.S)
    assert m, f"topic {topic} missing from topics.ts"
    ids_t = [r["id"] for r in RULINGS if r["topicId"] == topic]
    s = s[:m.start(2)] + ", ".join(f'"{x}"' for x in ids_t) + s[m.end(2):]
open(tp, "w", encoding="utf-8", newline=LF).write(s)

from collections import Counter
c = Counter(); u = Counter()
for r in RULINGS:
    for e in r["rulings"]:
        c[(r["topicId"], e["marjaId"])] += 1
        if e["text"].get("ur"): u[(r["topicId"], e["marjaId"])] += 1
print("rulings:", len(RULINGS), "entries:", sum(c.values()))
for k in sorted(c): print(k, c[k], "urdu", u[k])
