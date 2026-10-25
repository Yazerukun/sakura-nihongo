import json
import os

OUTPUT_DIR = "/home/ian/Projects/sakura-nihongo/src/data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. Official Pattern Definitions
PATTERNS = [
    {
        "id": "p1_kanji_reading",
        "title": "Pattern 1: Kanji Reading (漢字の読み方)",
        "examSection": "Language Knowledge / Moji",
        "badge": "漢字",
        "description": "Tests your ability to accurately select the correct Hiragana reading for underlined Kanji words in realistic sentences.",
        "strategy": "Pay close attention to long vowels (お vs おう, え vs えい), small っ (sokuon), and voiced consonants (tenten が/ざ/だ/ば/ぱ)."
    },
    {
        "id": "p2_kanji_writing",
        "title": "Pattern 2: Kanji Orthography (表記・漢字選び)",
        "examSection": "Language Knowledge / Moji",
        "badge": "表記",
        "description": "Given a sentence with a Hiragana word, identify the correct Kanji representation from visual distractor characters.",
        "strategy": "Distinguish between visually similar radicals (e.g., 待つ to wait vs 持つ to hold; 言 to speak vs 計 to measure; 書 vs 昼)."
    },
    {
        "id": "p3_context_vocab",
        "title": "Pattern 3: Contextual Vocabulary Choice (文脈規定)",
        "examSection": "Language Knowledge / Goi",
        "badge": "語彙",
        "description": "Choose the most logically and contextually appropriate noun, verb, or adverb that fits inside the sentence blank.",
        "strategy": "Read the whole sentence first before looking at choices. Look for collocation pairs (e.g. 傘をさす, 薬を飲む, 電気を消す, 鍵をかける)."
    },
    {
        "id": "p4_paraphrase",
        "title": "Pattern 4: Paraphrasing & Synonyms (言い換え類義語)",
        "examSection": "Language Knowledge / Goi",
        "badge": "類語",
        "description": "Identify which phrase or sentence conveys the exact same meaning as the underlined word.",
        "strategy": "Focus on the core intent: e.g. 気をつけて -> 注意して; だいたい -> およそ; 遠慮しないで -> 気を使わないで; 確かめる -> 確認する."
    },
    {
        "id": "p5_grammar_form",
        "title": "Pattern 5: Grammar Forms & Particles (文法形式の判断)",
        "examSection": "Grammar / Bunpou",
        "badge": "文法",
        "description": "Fill the blank with correct particles (は, が, を, に, で, へ, と, より) or verb conjugation forms (Te-form, Passive, Causative, Potential, Conditional).",
        "strategy": "Check the verb following the particle. Destination takes に/へ, active action at location takes で, passive takes に/から, ability takes が."
    },
    {
        "id": "p6_star_ordering",
        "title": "Pattern 6: Star ★ Sentence Ordering (文の組み立て・★問題)",
        "examSection": "Grammar / Bunpou",
        "badge": "並び替え★",
        "description": "Reorder 4 scrambled phrase fragments: ＿＿ ＿＿ ★ ＿＿ to form a natural grammatical sentence, then pick the phrase that belongs on the star (★)!",
        "strategy": "Form smaller 2-word collocations first. Look at the end of the sentence to see what verb form is needed, and connect modifiers before nouns."
    },
    {
        "id": "p7_conversation",
        "title": "Pattern 7: Workplace & Daily Can-Do Dialogues (会話表現・やりとり)",
        "examSection": "JFT Kaiwa / Communication",
        "badge": "会話",
        "description": "Select natural, polite conversational responses for workplace shifts, shopping, apologies, and asking permissions.",
        "strategy": "Evaluate social hierarchy: talking to a manager vs coworker. Use 〜てもいいですか for permission, お疲れ様です for shifts, 承知いたしました for requests."
    },
    {
        "id": "p8_short_reading",
        "title": "Pattern 8: Notices, Emails & Short Memos (短文・掲示読解)",
        "examSection": "Reading / Dokkai",
        "badge": "読解",
        "description": "Comprehend real apartment notices, clinic hours, work emails, and instruction flyers.",
        "strategy": "Read the question first to know what target info (date, price, condition) to scan for in the text."
    },
    {
        "id": "p9_info_retrieval",
        "title": "Pattern 9: Information Retrieval & Schedules (情報検索・時刻表・表)",
        "examSection": "Reading / Dokkai",
        "badge": "情報検索",
        "description": "Extract specific details from garbage disposal calendars, train timetables, discount coupons, and event posters.",
        "strategy": "Check footnotes, asterisk (*) conditions, day-of-the-week restrictions, and conditions that apply to specific groups."
    }
]

def build_full_question_bank():
    questions = []

    # -------------------------------------------------------------
    # PATTERN 1: KANJI READING (25 items)
    # -------------------------------------------------------------
    p1_data = [
        ("毎朝、公園を＿＿散歩＿＿します。", "さんぽ", ["さんぽ", "さくぽ", "ざんぽ", "さぽ"], "散歩 (sanpo) = walk/stroll. 散 = さん, 歩 = ぽ."),
        ("明日は＿＿午後＿＿から雨が降るでしょう。", "ごご", ["ごぜん", "ごご", "ごうご", "ごうぜん"], "午後 (gogo) = afternoon (p.m.). 午前 (gozen) = morning (a.m.)."),
        ("この部屋はとても＿＿明るい＿＿ですね。", "あかるい", ["あかるい", "あかい", "あたたかい", "あぶない"], "明るい (akarui) = bright/cheerful."),
        ("駅前のスーパーで＿＿買い物＿＿をしました。", "かいもの", ["かいもの", "たべもの", "のみもの", "おりもの"], "買い物 (kaimono) = shopping. 買 = か(う), 物 = もの."),
        ("友達に手紙を＿＿送り＿＿ました。", "おくり", ["おくり", "つくり", "とどき", "ならい"], "送る (okuru) = to send. 送り = おくり."),
        ("兄は＿＿病院＿＿で働いています。", "びょういん", ["びょういん", "びよういん", "びょいん", "ぼういん"], "病院 (byouin) = hospital. Note: 美容院 (biyouin) is beauty salon."),
        ("来週、新しい＿＿会社＿＿に入ります。", "かいしゃ", ["かいしゃ", "かいしや", "かいじゃ", "がっしゃ"], "会社 (kaisha) = company/office."),
        ("この川の水はとても＿＿冷たい＿＿です。", "つめたい", ["つめたい", "ぬるい", "あたたかい", "すずしい"], "冷たい (tsumetai) = cold to the touch."),
        ("図書館で本を＿＿借り＿＿ました。", "かり", ["かり", "かし", "かえし", "おり"], "借りる (kariru) = to borrow. 貸す (kasu) = to lend."),
        ("父は毎朝新聞を＿＿読んで＿＿います。", "よんで", ["よんで", "のんで", "すんで", "こんで"], "読む (yomu) -> 読んで (yonde) = reading."),
        ("日本の＿＿料理＿＿を作ってみたいです。", "りょうり", ["りょうり", "りょり", "りょうに", "りょうじ"], "料理 (ryouri) = cooking/cuisine."),
        ("電車が＿＿急に＿＿止まりました。", "きゅうに", ["きゅうに", "きゅに", "ぐうに", "とうに"], "急に (kyuu ni) = suddenly/abruptly."),
        ("＿＿外国＿＿の友達と話します。", "がいこく", ["がいこく", "かいこく", "がいごく", "がいご"], "外国 (gaikoku) = foreign country."),
        ("教室の窓を＿＿開けて＿＿ください。", "あけて", ["あけて", "しめて", "つけて", "みせて"], "開ける (akeru) = to open. 閉める (shimeru) = to close."),
        ("＿＿来月＿＿、東京へ引っ越します。", "らいげつ", ["らいげつ", "せんげつ", "こんげつ", "まいげつ"], "来月 (raigetsu) = next month. 先月 = last month. 今月 = this month."),
        ("山田先生はとても＿＿親切＿＿な人です。", "しんせつ", ["しんせつ", "しんぜつ", "しんさつ", "しんちゃく"], "親切 (shinsetsu) = kind/gentle."),
        ("毎日＿＿自転車＿＿で通っています。", "じてんしゃ", ["じてんしゃ", "じでんしゃ", "じどうしゃ", "じっしゃ"], "自転車 (jitensha) = bicycle."),
        ("この花はとてもいい＿＿匂い＿＿がします。", "におい", ["におい", "あじ", "おと", "いろ"], "匂い (nioi) = smell/scent. 味 = taste, 音 = sound."),
        ("＿＿危険＿＿ですから、入らないでください。", "きけん", ["きけん", "きんけん", "きげん", "けいけん"], "危険 (kiken) = danger/hazardous."),
        ("机の上に＿＿辞書＿＿を置きました。", "じしょ", ["じしょ", "じしょう", "じっしょ", "ずしょ"], "辞書 (jisho) = dictionary."),
        ("＿＿両親＿＿に電話をかけました。", "りょうしん", ["りょうしん", "りょしん", "りょうし", "りょうじん"], "両親 (ryoushin) = parents."),
        ("この料理は少し＿＿辛い＿＿です。", "からい", ["からい", "あまい", "にがい", "すっぱい"], "辛い (karai) = spicy/hot. 甘い = sweet, 苦い = bitter."),
        ("駅の＿＿改札口＿＿で待ち合わせしましょう。", "かいさつぐち", ["かいさつぐち", "かいさつくち", "かいふだぐち", "あらためぐち"], "改札口 (kaisatsuguchi) = ticket gate."),
        ("彼女の笑顔はとても＿＿素敵＿＿です。", "すてき", ["すてき", "そてき", "すてぎ", "しゅてき"], "素敵 (suteki) = lovely/wonderful."),
        ("工場で＿＿安全＿＿に作業してください。", "あんぜん", ["あんぜん", "やすぜん", "あんぜ", "あんぜつ"], "安全 (anzen) = safe/safety.")
    ]
    for idx, (sent, answer, options, exp) in enumerate(p1_data):
        questions.append({
            "id": f"p1_{idx+1}",
            "patternId": "p1_kanji_reading",
            "patternName": "Pattern 1: Kanji Reading (漢字の読み方)",
            "level": "JLPT N5/N4 & JFT-Basic",
            "question": f"下線（＿＿）の言葉はどう読みますか。\n\n{sent}",
            "options": options,
            "correctAnswerIndex": options.index(answer),
            "explanation": exp,
            "patternRule": "Kanji Reading Recognition: Distinguish long vowels, geminate consonants (っ), and voiced plosives.",
            "audioText": sent.replace("＿＿", "")
        })

    # -------------------------------------------------------------
    # PATTERN 2: KANJI WRITING / ORTHOGRAPHY (20 items)
    # -------------------------------------------------------------
    p2_data = [
        ("田中さんはとても＿＿あたま＿＿がいいです。", "頭", ["頭", "顔", "首", "目"], "頭 (atama) = head/mind. 顔 = kao (face), 首 = kubi (neck)."),
        ("毎晩、お風呂に＿＿はいり＿＿ます。", "入り", ["入り", "降り", "折り", "上がり"], "入る (hairu) = to enter/get in. 降る = furu/oriru."),
        ("今朝、おいしい＿＿さかな＿＿を食べました。", "魚", ["魚", "肉", "卵", "牛"], "魚 (sakana) = fish. 肉 (niku) = meat, 卵 (tamago) = egg."),
        ("あの＿＿しろい＿＿シャツを買いたいです。", "白い", ["白い", "青い", "赤色", "黒い"], "白い (shiroi) = white. 青い = blue, 赤い = red, 黒い = black."),
        ("先生の＿＿はなし＿＿をよく聞いてください。", "話", ["話", "語", "言", "読"], "話 (hanashi) = talk/speech. 言 = koto/gen, 読 = yomi."),
        ("京都に＿＿ふるい＿＿お寺があります。", "古い", ["古い", "新しい", "高い", "広い"], "古い (furui) = old (things). 新しい = new, 広い = spacious."),
        ("妹は髪が＿＿ながい＿＿です。", "長い", ["長い", "短い", "早い", "重い"], "長い (nagai) = long. 短い = short, 早い = fast/early."),
        ("あそこに＿＿くるま＿＿がたくさん並んでいます。", "車", ["車", "電車", "自転車", "門"], "車 (kuruma) = car/vehicle."),
        ("雨が降ってきたので、＿＿かさ＿＿をさしました。", "傘", ["傘", "服", "靴", "鞄"], "傘 (kasa) = umbrella. 靴 (kutsu) = shoes, 鞄 (kaban) = bag."),
        ("公園のベンチで＿＿やすみ＿＿ました。", "休み", ["休み", "歩き", "走り", "立ち"], "休む (yasumu) = to rest. 歩く = walk, 走る = run."),
        ("明日は何時に＿＿おき＿＿ますか。", "起き", ["起き", "寝", "着", "待"], "起きる (okiru) = to wake up. 寝る = sleep, 着る = wear."),
        ("日本へ行った＿＿こと＿＿があります。", "事", ["事", "物", "言", "仕"], "こと = 事 (matter/experience). 経験の表現: 〜たことがある."),
        ("ここで少し＿＿まって＿＿ください。", "待って", ["待って", "持って", "侍って", "特って"], "待つ (matsu) = to wait. 持つ (motsu) = to hold."),
        ("ノートに名前を＿＿かいて＿＿ください。", "書いて", ["書いて", "昼いて", "画いて", "消して"], "書く (kaku) = to write. 昼 = noon, 画 = picture."),
        ("昨日、新しい本を３＿＿さつ＿＿買いました。", "冊", ["冊", "本", "枚", "台"], "冊 (satsu) = counter for bound books/notebooks."),
        ("友達と駅で＿＿あいました＿＿。", "会いました", ["会いました", "合いました", "見ました", "合いました"], "会う (au) = to meet someone. 会いました."),
        ("窓から＿＿うみ＿＿が見えます。", "海", ["海", "湖", "川", "池"], "海 (umi) = ocean/sea. 湖 = lake, 川 = river, 池 = pond."),
        ("スーパーの＿＿うりば＿＿に行きました。", "売り場", ["売り場", "買い場", "出り場", "入り場"], "売り場 (uriba) = sales floor/counter."),
        ("＿＿てがみ＿＿をポストに入れました。", "手紙", ["手紙", "毛紙", "手折", "手札"], "手紙 (tegami) = letter/correspondence."),
        ("外は＿＿ゆき＿＿がたくさん積もっています。", "雪", ["雪", "雷", "雲", "霜"], "雪 (yuki) = snow. 雷 = thunder, 雲 = cloud.")
    ]
    for idx, (sent, answer, options, exp) in enumerate(p2_data):
        questions.append({
            "id": f"p2_{idx+1}",
            "patternId": "p2_kanji_writing",
            "patternName": "Pattern 2: Kanji Orthography (表記・漢字選び)",
            "level": "JLPT N5/N4 & JFT-Basic",
            "question": f"下線（＿＿）の言葉の漢字はどう書きますか。\n\n{sent}",
            "options": options,
            "correctAnswerIndex": options.index(answer),
            "explanation": exp,
            "patternRule": "Kanji Orthography: Identify exact visual radical and character stroke form.",
            "audioText": sent.replace("＿＿", "")
        })

    # -------------------------------------------------------------
    # PATTERN 3: CONTEXTUAL VOCABULARY CHOICE (20 items)
    # -------------------------------------------------------------
    p3_data = [
        ("風邪をひいたので、病院で＿＿＿＿＿をもらいました。", "くすり", ["くすり", "切符", "お菓子", "お土産"], "薬 (kusuri) = medicine. 病院で薬をもらう (receive medicine at hospital)."),
        ("出かける前に、部屋の電気を＿＿＿＿＿ください。", "消して", ["消して", "つけて", "開けて", "閉めて"], "電気を消す (denki wo kesu) = turn off lights."),
        ("雨が降ってきたので、傘を＿＿＿＿＿歩きました。", "さして", ["さして", "はいて", "かぶって", "はめて"], "傘をさす (kasa wo sasu) = open/hold an umbrella."),
        ("出かけるときは、必ずドアの鍵を＿＿＿＿＿ください。", "かけて", ["かけて", "しめて", "おして", "とめて"], "鍵をかける (kagi wo kakeru) = lock the key."),
        ("時間がないので、＿＿＿＿＿走って駅へ行きました。", "いそいで", ["いそいで", "ゆっくり", "そろそろ", "だんだん"], "急いで (isoide) = in a hurry. 時間がないので = since there is no time."),
        ("毎晩寝る前に、日記を＿＿＿＿＿います。", "つけて", ["つけて", "よんで", "おいて", "きいて"], "日記をつける (nikki wo tsukeru) = keep a diary."),
        ("この靴は私の足に＿＿＿＿＿合っています。", "ちょうど", ["ちょうど", "あまり", "ぜんぜん", "すっかり"], "ちょうど (choudo) = exactly/just right. ちょうど合っている."),
        ("喉が渇いたので、何か冷たいものを＿＿＿＿＿たいです。", "のみ", ["のみ", "たべ", "すい", "あび"], "喉が渇く (nodo ga kawaku) = thirsty -> 冷たいものを飲む (drink something cold)."),
        ("授業に遅れそうなので、タクシーに＿＿＿＿＿。", "乗りました", ["乗りました", "降りました", "歩きました", "着きました"], "乗り物 (タクシー) + に乗る (ni noru) = board/ride taxi."),
        ("コートを＿＿＿＿＿、部屋に入りました。", "ぬいで", ["ぬいで", "きて", "はいて", "かぶって"], "服を脱ぐ (nugu) = take off clothes/coat. 着る = put on."),
        ("料理ができたので、みんなで＿＿＿＿＿食べましょう。", "いっしょに", ["いっしょに", "ひとりで", "べつべつに", "たまに"], "一緒に (issho ni) = together."),
        ("頭が痛いので、今日は仕事を＿＿＿＿＿たいです。", "休み", ["休み", "働き", "続け", "始め"], "仕事を休む (yasumu) = take off from work."),
        ("この問題はとても＿＿＿＿＿ので、誰でも解けます。", "かんたん（な）", ["かんたん（な）", "むずかしい", "きびしい", "にぎやか（な）"], "簡単 (kantan) = simple/easy. 誰でも解ける = anyone can solve."),
        ("お腹が空いたので、レストランに＿＿＿＿＿ました。", "入り", ["入り", "出", "上がり", "去り"], "店に入る (hairu) = enter a restaurant."),
        ("先生の質問に正しく＿＿＿＿＿ことができました。", "答える", ["答える", "聞く", "話す", "頼む"], "質問に答える (shitsumon ni kotaeru) = answer a question."),
        ("朝起きると、鳥の＿＿＿＿＿が聞こえました。", "鳴き声", ["鳴き声", "足音", "話し声", "ため息"], "鳥の鳴き声 (nakigoe) = birds chirping/singing."),
        ("道が混んでいたので、約束の時間に＿＿＿＿＿しまいました。", "遅れて", ["遅れて", "間に合って", "進んで", "戻って"], "時間に遅れる (okureru) = be late for scheduled time."),
        ("暑い日は、冷たいシャワーを＿＿＿＿＿と気持ちいいです。", "あびる", ["あびる", "つける", "いれる", "ぬる"], "シャワーを浴びる (abiru) = take a shower."),
        ("日本の生活に＿＿＿＿＿慣れてきました。", "だんだん", ["だんだん", "ちっとも", "まったく", "決して"], "だんだん (dandan) = gradually/step-by-step."),
        ("財布を忘れたので、友達にお金を＿＿＿＿＿もらいました。", "貸して", ["貸して", "借りて", "払って", "預けて"], "友達に貸してもらう (have friend lend me money).")
    ]
    for idx, (sent, answer, options, exp) in enumerate(p3_data):
        questions.append({
            "id": f"p3_{idx+1}",
            "patternId": "p3_context_vocab",
            "patternName": "Pattern 3: Contextual Vocabulary Choice (文脈規定)",
            "level": "JLPT N5/N4 & JFT-Basic",
            "question": f"（　）に入れるのに最もよい言葉を、１・２・３・４から一つ選びなさい。\n\n{sent.replace('＿＿＿＿＿', '（　）')}",
            "options": options,
            "correctAnswerIndex": options.index(answer),
            "explanation": exp,
            "patternRule": "Collocation Matching: Pair natural nouns and verbs (傘をさす, 薬を飲む, 鍵をかける).",
            "audioText": sent.replace("＿＿＿＿＿", answer)
        })

    # -------------------------------------------------------------
    # PATTERN 4: PARAPHRASING & SYNONYMS (15 items)
    # -------------------------------------------------------------
    p4_data = [
        ("この道は＿＿あぶない＿＿です。", "きけんです", ["きけんです", "あんぜんです", "ひろいです", "くらいです"], "危ない (abunai) = 危険 (kiken) = dangerous."),
        ("駅から会社まで＿＿だいたい＿＿15分です。", "およそ", ["およそ", "ちょうど", "ぜったいに", "かならず"], "だいたい (daitai) = およそ (oyoso) = approximately/about."),
        ("荷物が重いので、＿＿てつだって＿＿ください。", "てをかして", ["てをかして", "みせて", "もってきて", "あずけて"], "手伝う (tetsudau) = 手を貸す (te wo kasu) = lend a hand/help."),
        ("あしたの予定を＿＿たしかめ＿＿ます。", "かくにんし", ["かくにんし", "へんこうし", "とりけし", "れんらくし"], "確かめる (tashikameru) = 確認する (kakunin suru) = to confirm/verify."),
        ("遠慮しないで、＿＿どんどん＿＿食べてください。", "たくさん", ["たくさん", "すこし", "ゆっくり", "ぜんぶ"], "どんどん (dondon) = freely / plentifully / without hesitation."),
        ("このパソコンは＿＿こわれて＿＿います。", "故障して", ["故障して", "動いて", "切れて", "片付いて"], "壊れている (kowarete iru) = 故障している (koshou shite iru) = broken/out of order."),
        ("車に＿＿気をつけて＿＿渡ってください。", "注意して", ["注意して", "安心して", "期待して", "我慢して"], "気をつける (ki wo tsukeru) = 注意する (chuui suru) = pay attention/be careful."),
        ("彼はとても＿＿まじめな＿＿学生です。", "熱心でしっかりした", ["熱心でしっかりした", "おもしろい", "あかるい", "のんびりした"], "真面目 (majime) = earnest, reliable, diligent."),
        ("来週の会議を＿＿やめます＿＿。", "中止します", ["中止します", "延期します", "続けます", "始めます"], "やめる (yameru) = 中止する (chuushi suru) = cancel."),
        ("部屋を＿＿片付け＿＿ました。", "整理し", ["整理し", "汚し", "飾り", "壊し"], "片付ける (katazukeru) = 整理する (seiri suru) = tidy up/organize."),
        ("その話を聞いて、＿＿びっくりし＿＿ました。", "おどろき", ["おどろき", "よろこび", "おこり", "かなしみ"], "びっくりする = 驚く (odoroku) = surprised/astonished."),
        ("田中さんは今＿＿手が離せません＿＿。", "とても忙しいです", ["とても忙しいです", "暇です", "外出中です", "寝ています"], "手が離せない (te ga hanasenai) = tied up with work / extremely busy right now."),
        ("この服は＿＿サイズが合わない＿＿です。", "大きすぎるか小さすぎます", ["大きすぎるか小さすぎます", "色が嫌いです", "破れています", "高すぎます"], "サイズが合わない = size does not fit (too big or too small)."),
        ("いつでも＿＿遠慮なく＿＿質問してください。", "気を使わずに", ["気を使わずに", "必ず", "静かに", "急いで"], "遠慮なく (enryo naku) = without hesitation / 気を使わずに."),
        ("この本は＿＿つまらない＿＿です。", "おもしろくない", ["おもしろくない", "わかりにくい", "ながい", "むずかしい"], "つまらない (tsumaranai) = 面白くない (omoshirokunai) = boring/not interesting.")
    ]
    for idx, (sent, answer, options, exp) in enumerate(p4_data):
        questions.append({
            "id": f"p4_{idx+1}",
            "patternId": "p4_paraphrase",
            "patternName": "Pattern 4: Paraphrasing & Synonyms (言い換え類義語)",
            "level": "JLPT N5/N4 & JFT-Basic",
            "question": f"下線（＿＿）の言葉とだいたい同じ意味の文を、１・２・３・４から一つ選びなさい。\n\n{sent}",
            "options": options,
            "correctAnswerIndex": options.index(answer),
            "explanation": exp,
            "patternRule": "Semantic Equivalence: Recognize natural synonymous expressions in Japanese.",
            "audioText": sent.replace("＿＿", "")
        })

    # -------------------------------------------------------------
    # PATTERN 5: GRAMMAR FORMS & PARTICLES (25 items)
    # -------------------------------------------------------------
    p5_data = [
        ("日曜日は友達＿＿映画を見に行きました。", "と", ["と", "に", "で", "を"], "Person + と = 'together with'. 友達と = with a friend."),
        ("私は毎朝７時＿＿家を出ます。", "に", ["に", "で", "を", "から"], "Specific clock time takes particle に (７時に)."),
        ("図書館＿＿静かに本を読みます。", "で", ["で", "に", "へ", "と"], "Location of active action takes particle で (図書館で)."),
        ("机の上にペン＿＿ノートがあります。", "や", ["や", "を", "に", "で"], "Non-exhaustive list ('pens and notebooks among other things') takes や."),
        ("写真を撮っ＿＿はいけません。", "て", ["て", "た", "ない", "たら"], "Prohibition form: Verb in Te-form + ははいけません (撮ってはいけません)."),
        ("喉が渇いたので、何か冷たいもの＿＿飲みたいです。", "が", ["が", "を", "に", "で"], "Desire expression: 〜が飲みたい (or 〜を飲みたい). が marks object of たい."),
        ("日本へ日本語の勉強＿＿来ました。", "に", ["に", "で", "へ", "を"], "Purpose of movement: Noun + に来る (勉強に来ました)."),
        ("昨日買ったケーキはとてもおいしかっ＿＿です。", "た", ["た", "て", "ない", "だ"], "Past tense of i-adjective: おいしい -> おいしかった."),
        ("駅まで歩い＿＿、電車に乗りました。", "て", ["て", "た", "ない", "たら"], "Connecting actions in sequence uses Te-form: 歩いて、電車に乗りました."),
        ("明日テストがあるので、早く寝なけれ＿＿なりません。", "ば", ["ば", "て", "たら", "なら"], "Obligation ('must do'): 〜なければなりません (nakereba narimasen)."),
        ("漢字が上手に書ける＿＿なりたいです。", "ように", ["ように", "ために", "ことに", "そうに"], "Change of ability state: Potential verb + ようになる (書けるようになる)."),
        ("雨＿＿降ったので、試合は中止になりました。", "が", ["が", "は", "を", "に"], "Subordinate clause subject takes が: 雨が降ったので."),
        ("田中さんはピアノを弾くこと＿＿できます。", "が", ["が", "を", "に", "は"], "Ability potential pattern: [Verb dictionary form + こと] + ができる."),
        ("危ないですから、ここで遊ば＿＿でください。", "ない", ["ない", "ず", "なく", "なかっ"], "Negative request: Verb negative stem + ないでください (遊ばないでください)."),
        ("窓を開け＿＿、涼しい風が入ってきました。", "たら", ["たら", "なら", "ても", "ても"], "Conditional sequential discovery: 〜たら (開けたら、風が入ってきた)."),
        ("このお茶は熱すぎ＿＿飲めません。", "て", ["て", "で", "たら", "から"], "Excessive form te-link: 〜すぎて (熱すぎて飲めません)."),
        ("明日、雨が降る＿＿天気を調べました。", "かどうか", ["かどうか", "なら", "ので", "から"], "Whether or not: [Plain verb] + かどうか (降るかどうか)."),
        ("先生、この漢字の読み方を教え＿＿いただけませんか。", "て", ["て", "た", "ない", "ば"], "Polite request: Verb Te-form + ていただけませんか."),
        ("私は犬＿＿手をかまれました。", "に", ["に", "を", "で", "と"], "Passive agent marker takes に: 犬にかまれた (bitten by a dog)."),
        ("母は私に部屋を掃除＿＿せました。", "さ", ["さ", "れ", "ら", "て"], "Causative form (Group 3 掃除する -> 掃除させる): 母は私に掃除させました."),
        ("日本料理の＿＿で、寿司が一番好きです。", "中", ["中", "前", "間", "上"], "Superlative scope pattern: [Category] の中で、〜が一番好きです."),
        ("東京は京都＿＿人が多いです。", "より", ["より", "ほど", "くらい", "まで"], "Comparative pattern: A は B より (Tokyo has more people than Kyoto)."),
        ("もっと大きい声で話し＿＿ください。", "て", ["て", "た", "たら", "れば"], "Polite imperative: Verb Te-form + ください (話してください)."),
        ("仕事が終わっ＿＿あとで、食事に行きましょう。", "た", ["た", "て", "る", "ない"], "After doing something: Verb Ta-form + あとで (終わったあとで)."),
        ("傘を持た＿＿に出かけて、濡れてしまいました。", "ず", ["ず", "ない", "なくて", "ぬ"], "Without doing: Verb nai-stem + ずに (持たずに出かけて).")
    ]
    for idx, (sent, answer, options, exp) in enumerate(p5_data):
        questions.append({
            "id": f"p5_{idx+1}",
            "patternId": "p5_grammar_form",
            "patternName": "Pattern 5: Grammar Forms & Particles (文法形式の判断)",
            "level": "JLPT N5/N4 & JFT-Basic",
            "question": f"（　）に入れるのに最もよいものを、１・２・３・４から一つ選びなさい。\n\n{sent.replace('＿＿', '（　）')}",
            "options": options,
            "correctAnswerIndex": options.index(answer),
            "explanation": exp,
            "patternRule": "Particle & Conjugation Matrix: Connect noun markers with verbs accurately.",
            "audioText": sent.replace("＿＿", answer)
        })

    # -------------------------------------------------------------
    # PATTERN 6: STAR ★ SENTENCE ORDERING (16 items)
    # -------------------------------------------------------------
    p6_data = [
        {
            "prefix": "私は",
            "suffix": "行きたいです。",
            "parts": ["友達", "旅行", "と", "に"],
            "correct_order": [0, 2, 1, 3], # 友達 と 旅行 に
            "star_index": 2, # 旅行
            "star_part": "旅行",
            "full_sentence": "私は友達と旅行に行きたいです。",
            "explanation": "Correct sequence: 友達 (1) と (3) ★旅行 (2) に (4). Position 3 (★) is 旅行 (2). Meaning: 'I want to go on a trip with my friend.'"
        },
        {
            "prefix": "毎朝、",
            "suffix": "コーヒーを飲みます。",
            "parts": ["起きて", "から", "すぐ", "に"],
            "correct_order": [0, 1, 2, 3], # 起きて から すぐ に
            "star_index": 2, # すぐ
            "star_part": "すぐ",
            "full_sentence": "毎朝、起きてからすぐにコーヒーを飲みます。",
            "explanation": "Correct sequence: 起きて (1) から (2) ★すぐ (3) に (4). Position on ★ is すぐ. Meaning: 'Every morning right after waking up, I drink coffee.'"
        },
        {
            "prefix": "日本語が",
            "suffix": "毎日勉強しています。",
            "parts": ["上手に", "ように", "なる", "ために"],
            "correct_order": [0, 2, 1, 3], # 上手に なる ように ために -> [上手に][なる][ように][毎日勉強...]
            "star_index": 2, # ように
            "star_part": "ように",
            "full_sentence": "日本語が上手になるように毎日勉強しています。",
            "explanation": "Correct sequence: 上手に (1) なる (3) ★ように (2) ... Position on ★ is ように. Meaning: 'So that I become skilled at Japanese, I study every day.'"
        },
        {
            "prefix": "この部屋は",
            "suffix": "住みやすいです。",
            "parts": ["広くて", "駅", "から", "近いので"],
            "correct_order": [0, 1, 2, 3], # 広くて 駅 から 近いので
            "star_index": 2, # から
            "star_part": "から",
            "full_sentence": "この部屋は広くて駅から近いので住みやすいです。",
            "explanation": "Correct sequence: 広くて (1) 駅 (2) ★から (3) 近いので (4). Position on ★ is から. Meaning: 'This room is spacious and close to the station, so it is comfortable to live in.'"
        },
        {
            "prefix": "田中さんは",
            "suffix": "歌っています。",
            "parts": ["楽し", "そう", "に", "歌を"],
            "correct_order": [0, 1, 2, 3], # 楽し そう に 歌を
            "star_index": 2, # に
            "star_part": "に",
            "full_sentence": "田中さんは楽しそうに歌を歌っています。",
            "explanation": "Correct sequence: 楽し (1) そう (2) ★に (3) 歌を (4). Adverbial appearance: 楽しそうに. Position on ★ is に."
        },
        {
            "prefix": "雨が",
            "suffix": "家で本を読みました。",
            "parts": ["降って", "いた", "ので", "出かけないで"],
            "correct_order": [0, 1, 2, 3], # 降って いた ので 出かけないで
            "star_index": 2, # ので
            "star_part": "ので",
            "full_sentence": "雨が降っていたので出かけないで家で本を読みました。",
            "explanation": "Correct sequence: 降って (1) いた (2) ★ので (3) 出かけないで (4). Because it was raining, without going out I read a book at home."
        },
        {
            "prefix": "山田先生は",
            "suffix": "先生です。",
            "parts": ["とても", "親切", "で", "わかりやすい"],
            "correct_order": [0, 1, 2, 3], # とても 親切 で わかりやすい
            "star_index": 2, # で
            "star_part": "で",
            "full_sentence": "山田先生はとても親切でわかりやすい先生です。",
            "explanation": "Correct sequence: とても (1) 親切 (2) ★で (3) わかりやすい (4). Na-adjective te-form connection: 親切で."
        },
        {
            "prefix": "図書館では",
            "suffix": "いけません。",
            "parts": ["大きな", "声", "で", "話しては"],
            "correct_order": [0, 1, 2, 3], # 大きな 声 で 話しては
            "star_index": 2, # で
            "star_part": "で",
            "full_sentence": "図書館では大きな声で話してはいけません。",
            "explanation": "Correct sequence: 大きな (1) 声 (2) ★で (3) 話しては (4). Prohibition pattern: 大きな声で話してはいけません."
        },
        {
            "prefix": "風邪を",
            "suffix": "学校を休みました。",
            "parts": ["ひいて", "しまった", "ので", "昨日"],
            "correct_order": [3, 0, 1, 2], # 昨日 ひいて しまった ので
            "star_index": 1, # しまった
            "star_part": "しまった",
            "full_sentence": "昨日風邪をひいてしまったので学校を休みました。",
            "explanation": "Correct sequence: 昨日 (4) ひいて (1) ★しまった (2) ので (3). Position on ★ is しまった."
        },
        {
            "prefix": "母が",
            "suffix": "とてもおいしかったです。",
            "parts": ["作って", "くれた", "料理", "は"],
            "correct_order": [0, 1, 2, 3], # 作って くれた 料理 は
            "star_index": 2, # 料理
            "star_part": "料理",
            "full_sentence": "母が作ってくれた料理はとてもおいしかったです。",
            "explanation": "Relative clause modifier: 作ってくれた料理 (the food mom made for me). Position on ★ is 料理."
        },
        {
            "prefix": "明日",
            "suffix": "教えてください。",
            "parts": ["何時に", "駅に", "着く", "か"],
            "correct_order": [0, 1, 2, 3], # 何時に 駅に 着く か
            "star_index": 2, # 着く
            "star_part": "着く",
            "full_sentence": "明日何時に駅に着くか教えてください。",
            "explanation": "Embedded question with particle か: [何時に駅に着く] + ★か. Position on ★ is 着く."
        },
        {
            "prefix": "来週の",
            "suffix": "買いに行きます。",
            "parts": ["パーティー", "で", "着る", "服を"],
            "correct_order": [0, 1, 2, 3], # パーティー で 着る 服を
            "star_index": 2, # 着る
            "star_part": "着る",
            "full_sentence": "来週のパーティーで着る服を買いに行きます。",
            "explanation": "Correct sequence: パーティー (1) で (2) ★着る (3) 服を (4). Clothes to wear at the party."
        },
        {
            "prefix": "早く",
            "suffix": "出かけましょう。",
            "parts": ["準備", "を", "して", "すぐ"],
            "correct_order": [0, 1, 2, 3], # 準備 を して すぐ
            "star_index": 2, # して
            "star_part": "して",
            "full_sentence": "早く準備をしてすぐ出かけましょう。",
            "explanation": "Te-form sequential action: 準備をしてすぐ出かける. Position on ★ is して."
        },
        {
            "prefix": "この靴は",
            "suffix": "疲れません。",
            "parts": ["軽くて", "とても", "歩きやすい", "ので"],
            "correct_order": [0, 1, 2, 3], # 軽くて とても 歩きやすい ので
            "star_index": 2, # 歩きやすい
            "star_part": "歩きやすい",
            "full_sentence": "この靴は軽くてとても歩きやすいので疲れません。",
            "explanation": "Adjective link: 軽くてとても歩きやすいので. Position on ★ is 歩きやすい."
        },
        {
            "prefix": "日本に",
            "suffix": "１年になります。",
            "parts": ["来て", "から", "もう", "すぐ"],
            "correct_order": [0, 1, 2, 3], # 来て から もう すぐ
            "star_index": 2, # もう
            "star_part": "もう",
            "full_sentence": "日本に来てからもうすぐ１年になります。",
            "explanation": "Since arriving: 来てから (1, 2) ★もう (3) すぐ (4). Position on ★ is もう."
        },
        {
            "prefix": "約束の",
            "suffix": "連絡しました。",
            "parts": ["時間に", "遅れそう", "だったので", "事前に"],
            "correct_order": [0, 1, 2, 3], # 時間に 遅れそう だったので 事前に
            "star_index": 2, # だったので
            "star_part": "だったので",
            "full_sentence": "約束の時間に遅れそうだったので事前に連絡しました。",
            "explanation": "Conjectural reason: 遅れそうだったので. Position on ★ is だったので."
        }
    ]
    for idx, item in enumerate(p6_data):
        options = item["parts"][:]
        key_idx = options.index(item["star_part"])
        q_text = f"次の文の ★ に入る最もよいものを、１・２・３・４から一つ選びなさい。\n\n{item['prefix']} ＿＿ ＿＿ ★ ＿＿ {item['suffix']}"
        questions.append({
            "id": f"p6_{idx+1}",
            "patternId": "p6_star_ordering",
            "patternName": "Pattern 6: Star ★ Sentence Ordering (文の組み立て・★問題)",
            "level": "JLPT N5/N4 (Must-Pass Signature Pattern)",
            "question": q_text,
            "options": [f"1. {options[0]}", f"2. {options[1]}", f"3. {options[2]}", f"4. {options[3]}"],
            "correctAnswerIndex": key_idx,
            "explanation": f"{item['explanation']}\n\n✅ Complete Sentence:「{item['full_sentence']}」",
            "patternRule": "Star Question Formula: Link modifier clauses first, align verb stems with target particles, then identify item on position 3 (★).",
            "audioText": item["full_sentence"]
        })

    # -------------------------------------------------------------
    # PATTERN 7: WORKPLACE & DAILY CAN-DO DIALOGUES (16 items)
    # -------------------------------------------------------------
    p7_data = [
        ("店員：「いらっしゃいませ。温めますか？」\n客：「＿＿＿＿＿＿＿」", "はい、お願いします。", ["はい、お願いします。", "いいえ、温めます。", "ごちそうさまでした。", "どういたしまして。"], "When asked if you want convenience store bento heated up, reply politely: 'はい、お願いします。'"),
        ("同僚：「山田さん、お先に失礼します。」\n山田：「＿＿＿＿＿＿＿」", "お疲れ様でした。", ["お疲れ様でした。", "失礼しました。", "ごめんなさい。", "はじめまして。"], "Standard workplace response when a colleague leaves before you: 'お疲れ様でした。'"),
        ("後輩：「すみません、この機械の使い方がわかりません。」\n先輩：「＿＿＿＿＿＿＿」", "じゃあ、教えますね。", ["じゃあ、教えますね。", "いいえ、使いません。", "どういたしまして。", "こちらこそ。"], "Colleague asks for assistance; natural response is: 'じゃあ、教えますね' (Alright, I will show you)."),
        ("客：「すみません、このサイズの黒い靴はありますか？」\n店員：「＿＿＿＿＿＿＿」", "少々お待ちください。確認してきます。", ["少々お待ちください。確認してきます。", "もう買いました。", "結構です。", "お大事に。"], "Store clerk checks stock in back room: '少々お待ちください。確認してきます。'"),
        ("上司：「この資料を明日までにコピーしておいてくれる？」\n部下：「＿＿＿＿＿＿＿」", "はい、かしこまりました。", ["はい、かしこまりました。", "いいえ、大丈夫です。", "ごちそうさまでした。", "いってらっしゃい。"], "Workplace acknowledgment to a manager: 'はい、かしこまりました。' (Certainly, right away)."),
        ("友人：「日曜日に一緒に映画を見に行きませんか。」\n自分：「＿＿＿＿＿＿＿」", "いいですね。ぜひ行きましょう。", ["いいですね。ぜひ行きましょう。", "どうもすみません。", "遠慮しておきます。", "お大事に。"], "Polite acceptance of an invitation: 'いいですね。ぜひ行きましょう。'"),
        ("同僚：「昨日から熱があって頭が痛いんです。」\nあなた：「＿＿＿＿＿＿＿」", "無理をしないで、早く病院に行ってくださいね。", ["無理をしないで、早く病院に行ってくださいね。", "おめでとうございます。", "ごちそうさまでした。", "失礼しました。"], "Sympathy to an unwell coworker: '無理をしないで、早く病院に行ってくださいね。'"),
        ("客：「お会計は別々にお願いできますか。」\nレジ係：「＿＿＿＿＿＿＿」", "はい、別々で計算いたしますね。", ["はい、別々で計算いたしますね。", "いいえ、食べられません。", "ごちそうさまです。", "お疲れ様です。"], "Restaurant checkout: 'はい、別々で計算いたしますね。' (Yes, separate checks)."),
        ("近所の人：「こんにちは、いいお天気ですね。」\nあなた：「＿＿＿＿＿＿＿」", "本当に、気持ちがいいですね。", ["本当に、気持ちがいいですね。", "お疲れ様でした。", "失礼いたします。", "いただきます。"], "Neighborhood greeting small talk about weather: '本当に、気持ちがいいですね。'"),
        ("訪問者：「ごめんください。田中さんはいらっしゃいますか。」\n家の人：「＿＿＿＿＿＿＿」", "はい、少々お待ちください。", ["はい、少々お待ちください。", "いいえ、来ませんでした。", "おかえりなさい。", "いってきます。"], "Answering the home door: 'はい、少々お待ちください。'"),
        ("店員：「ポイントカードはお持ちですか。」\n客：「＿＿＿＿＿＿＿」", "あ、持っていません。", ["あ、持っていません。", "はい、買いました。", "結構です、持っています。", "いりません、あります。"], "Cashier asks for loyalty point card: 'あ、持っていません。' (Oh, I do not have one)."),
        ("同僚：「手伝いましょうか。」\nあなた：「＿＿＿＿＿＿＿」", "助かります。ありがとうございます。", ["助かります。ありがとうございます。", "ごめんなさい、手伝います。", "失礼しました。", "はじめまして。"], "Accepting an offer for help: '助かります。ありがとうございます。' (That would save me, thank you)."),
        ("上司：「少し時間ある？相談があるんだけど。」\n部下：「＿＿＿＿＿＿＿」", "はい、今大丈夫です。何でしょうか。", ["はい、今大丈夫です。何でしょうか。", "いいえ、暇ではありません。", "ごちそうさまでした。", "お大事に。"], "Manager asks if you have time: 'はい、今大丈夫です。何でしょうか。'"),
        ("客：「この料理、辛くないですか。」\n店員：「＿＿＿＿＿＿＿」", "辛くありませんので、ご安心ください。", ["辛くありませんので、ご安心ください。", "はい、すごく辛いですよ。", "いいえ、甘くないです。", "わかりません。"], "Reassuring a customer about spicy food: '辛くありませんので、ご安心ください。'"),
        ("病院の受付：「診察券と保険証をお出しください。」\n患者：「＿＿＿＿＿＿＿」", "はい、これですね。お願いします。", ["はい、これですね。お願いします。", "いいえ、出しません。", "ごちそうさまでした。", "失礼します。"], "Submitting insurance card at clinic: 'はい、これですね。お願いします。'"),
        ("帰宅時：「ただいま帰りました。」\n家族：「＿＿＿＿＿＿＿」", "おかえりなさい。", ["おかえりなさい。", "いってらっしゃい。", "お邪魔します。", "いただきます。"], "Standard reply to 'Tadaima' (I am back): 'おかえりなさい' (Welcome home).")
    ]
    for idx, (sent, answer, options, exp) in enumerate(p7_data):
        questions.append({
            "id": f"p7_{idx+1}",
            "patternId": "p7_conversation",
            "patternName": "Pattern 7: Workplace & Daily Can-Do Dialogues (会話表現・やりとり)",
            "level": "JFT-Basic A2 & JLPT N4",
            "question": f"会話の（　）に入れるのに最も自然な表現を選びなさい。\n\n{sent.replace('＿＿＿＿＿＿＿', '（　）')}",
            "options": options,
            "correctAnswerIndex": options.index(answer),
            "explanation": exp,
            "patternRule": "Can-Do Dialogue Principle: Honorific level matching social setting and conversational role.",
            "audioText": sent.replace("＿＿＿＿＿＿＿", answer)
        })

    # -------------------------------------------------------------
    # PATTERN 8: NOTICES, EMAILS & SHORT MEMOS (12 items)
    # -------------------------------------------------------------
    p8_data = [
        {
            "notice": "【マンションの皆様へ】\n明日の午前９時から午後１時まで、エレベーターの点検を行います。\n点検中はエレベーターを使うことができません。\n階段をご利用ください。ご協力をお願いいたします。",
            "question": "エレベーターが使えない時間はいつですか。",
            "options": ["明日の午前９時から午後１時まで", "明日の午後１時から午後５時まで", "今日の午後９時から", "いつでも階段だけ使う"],
            "correctAnswerIndex": 0,
            "explanation": "The notice states: '明日の午前９時から午後１時まで、エレベーターの点検を行います... 点検中は使うことができません。'"
        },
        {
            "notice": "【図書館からのお知らせ】\n年末年始の休館日：１２月２９日〜１月３日\n※返却ポストは休み中も２４時間ご利用いただけます。\n新年は１月４日午前１０時より開館いたします。",
            "question": "図書館が休みの期間中、利用できるものはどれですか。",
            "options": ["本の返却ポスト", "図書館の中の閲覧席", "カードの新規作成窓口", "パソコンの貸出コーナー"],
            "correctAnswerIndex": 0,
            "explanation": "Footnote with asterisk clearly states: '※返却ポストは休み中も２４時間ご利用いただけます' (The return drop-box can be used 24 hours even during holidays)."
        },
        {
            "notice": "【社内メール：健康診断のお知らせ】\n日時：１０月１５日（水）９：００〜１２：００\n場所：２階 会議室A\n注意：当日の朝は、朝食を食べないでお越しください。\nお水やお茶は飲んでも構いません。",
            "question": "健康診断を受ける人は、当日の朝どうしなければなりませんか。",
            "options": ["朝食を食べないで来る", "水やお茶も一切飲まない", "１階の会議室に行く", "午後１時までに来る"],
            "correctAnswerIndex": 0,
            "explanation": "Under '注意': '当日の朝は、朝食を食べないでお越しください。お水やお茶は飲んでも構いません。'"
        },
        {
            "notice": "【ゴミ収集のお知らせ】\n燃えるゴミ：毎週火曜日・金曜日（朝８時までに出してください）\n燃えないゴミ：第２・第４水曜日\n※前日の夜にはゴミを出さないでください。",
            "question": "ゴミを出すときの正しいルールはどれですか。",
            "options": ["当日の朝８時までに出す", "前日の夜９時に出しておく", "燃えるゴミは水曜日に出す", "燃えないゴミは毎週出す"],
            "correctAnswerIndex": 0,
            "explanation": "The text states: '朝８時までに出してください' and explicitly prohibits: '※前日の夜にはゴミを出さないでください。'"
        },
        {
            "notice": "【スーパーの割引チラシ】\n本日夕方５時よりタイムセール実施！\nお肉とお魚が全品２０％引き！\n※お一人様３パックまでとさせていただきます。",
            "question": "このタイムセールで２０％引きになるのは何ですか。",
            "options": ["お肉とお魚", "野菜とお米", "お菓子とジュース", "すべての店内の商品"],
            "correctAnswerIndex": 0,
            "explanation": "Text clearly states: 'お肉とお魚が全品２０％引き！'"
        },
        {
            "notice": "【語学スクールからのメール】\n台風接近のため、本日の夜７時以降のレッスンはすべてオンラインで行います。\n各自、自宅からZoomリンクをクリックしてご参加ください。",
            "question": "本日の夜７時以降のレッスンはどうなりますか。",
            "options": ["自宅からオンライン（Zoom）で受ける", "スクールの教室に行って受ける", "来週にすべて中止延期される", "昼の１２時に行われる"],
            "correctAnswerIndex": 0,
            "explanation": "Notice states: '本日の夜７時以降のレッスンはすべてオンラインで行います。各自、自宅からZoomリンクをクリックしてご参加ください。'"
        },
        {
            "notice": "【市民プールの利用案内】\n開館時間：午前１０時〜午後８時\n利用料金：大人 ５００円 / 中学生以下 ２００円\n※水泳キャップを必ず着用してください。貸出はありません。",
            "question": "プールを利用するときに注意することは何ですか。",
            "options": ["自分の水泳キャップを持って着用する", "受付で水泳キャップを借りる", "大人も２００円で利用できる", "夜９時まで泳げる"],
            "correctAnswerIndex": 0,
            "explanation": "Rule states: '※水泳キャップを必ず着用してください。貸出はありません。' (Must wear swim cap; no rentals available)."
        },
        {
            "notice": "【宅配便の不在連絡票】\nお荷物をお届けに上がりましたが、ご不在でした。\n再配達をご希望の方は、本日午後６時までに下記QRコードよりお申し込みください。",
            "question": "今日中に荷物を再配達してほしい場合、何をしなければなりませんか。",
            "options": ["本日午後６時までにQRコードから申し込む", "直接配達店まで荷物を取りに行く", "明日まで何もしないで待つ", "ドライバーに電話して怒る"],
            "correctAnswerIndex": 0,
            "explanation": "Text: '再配達をご希望の方は、本日午後６時までに下記QRコードよりお申し込みください。'"
        },
        {
            "notice": "【レストランの求人募集】\n職種：ホールスタッフ・調理補助\n時給：１,２００円（研修期間１ヶ月は１,１５０円）\n交通費全額支給、美味しいまかない（食事）付き！\n週２日、１日４時間からOK！",
            "question": "この仕事の嬉しいメリットとして書かれているものはどれですか。",
            "options": ["交通費が全額支給され、まかない食事が付く", "研修期間の方が時給が高い", "毎日８時間必ず働かなければならない", "交通費は自己負担である"],
            "correctAnswerIndex": 0,
            "explanation": "Benefits listed: '交通費全額支給、美味しいまかない（食事）付き！'"
        },
        {
            "notice": "【駅前駐輪場のご案内】\n最初の２時間は無料です。\nその後、２時間ごとに１００円が加算されます。\n※道路上に放置された自転車は撤去されます。",
            "question": "自転車を３時間駐輪した場合、料金はいくらになりますか。",
            "options": ["１００円", "無料（０円）", "２００円", "３００円"],
            "correctAnswerIndex": 0,
            "explanation": "First 2 hours are free. 3 hours = 2 hours (free) + 1 hour (part of next 2 hours block = 100 yen). Total is 100 yen."
        },
        {
            "notice": "【クリニック休診案内】\n院長学会出席のため、１１月１０日（月）は終日休診となります。\n１１月１１日（火）からは通常通り午前９時より診療いたします。",
            "question": "クリニックがお休みなのはいつですか。",
            "options": ["１１月１０日（月）", "１１月１１日（火）", "１１月１２日（水）", "毎週月曜日と火曜日"],
            "correctAnswerIndex": 0,
            "explanation": "Text states: '１１月１０日（月）は終日休診となります。'"
        },
        {
            "notice": "【アパートの水道工事お知らせ】\n断水日時：木曜日 午後２時〜午後４時（２時間）\n断水中は水が出ません。事前に飲料水のご準備をお願いいたします。",
            "question": "住人が工事前に準備しておくべきことは何ですか。",
            "options": ["事前に飲むための水を準備しておく", "木曜日の午後２時に洗濯機を回す", "木曜日はアパートから引っ越す", "お風呂の水を全部捨てる"],
            "correctAnswerIndex": 0,
            "explanation": "Text instructs: '断水中は水が出ません。事前に飲料水のご準備をお願いいたします。'"
        }
    ]
    for idx, item in enumerate(p8_data):
        questions.append({
            "id": f"p8_{idx+1}",
            "patternId": "p8_short_reading",
            "patternName": "Pattern 8: Notices, Emails & Short Memos (短文・掲示読解)",
            "level": "JFT-Basic A2 & JLPT N4",
            "question": f"次の文章を読んで、質問に最も適した答えを１・２・３・４から一つ選びなさい。\n\n{item['notice']}\n\n質問：{item['question']}",
            "options": item["options"],
            "correctAnswerIndex": item["correctAnswerIndex"],
            "explanation": item["explanation"],
            "patternRule": "Notice Scanning: Match temporal markers (から〜まで) and asterisks (※) for exemptions.",
            "audioText": item["notice"]
        })

    # -------------------------------------------------------------
    # PATTERN 9: INFORMATION RETRIEVAL & SCHEDULES (12 items)
    # -------------------------------------------------------------
    p9_data = [
        {
            "table_text": "【さくらスポーツセンター 料金表】\n区分 | 平日昼間 (10:00-17:00) | 平日夜間 (17:00-21:00) | 土日祝日\n一般 | 400円 | 600円 | 700円\n学生 | 200円 | 300円 | 350円\n※学生の方は受付で学生証をご提示ください。\n※ロッカー代は別途100円（返却式）が必要です。",
            "question": "大学生のリンさんが土曜日の午後２時に利用する場合、利用料はいくらですか。",
            "options": ["350円", "700円", "200円", "400円"],
            "correctAnswerIndex": 0,
            "explanation": "リンさん is a student (学生). Day is Saturday (土日祝日). Table cell for 学生 + 土日祝日 = 350円."
        },
        {
            "table_text": "【急行電車 時刻表（さくら駅 発）】\n行先：空港行き（平日）\n7時：05 (普通) | 22 (急行) | 45 (快速)\n8時：10 (急行) | 25 (普通) | 40 (急行)\n9時：00 (普通) | 15 (急行) | 35 (普通)\n※急行（きゅうこう）は空港まで直通30分です。",
            "question": "8時台にさくら駅を出発する「急行」は何分にありますか。",
            "options": ["8時10分 と 8時40分", "8時25分 だけ", "8時05分 と 8時22分", "8時00分 と 8時15分"],
            "correctAnswerIndex": 0,
            "explanation": "Look at the 8 o'clock row: 8:10 (急行) and 8:40 (急行)."
        },
        {
            "table_text": "【居酒屋 歓送迎会コース割引クーポン】\nコース名 | 通常料金 | クーポン提示料金\nAコース (料理7品) | 3,500円 | 3,000円\nBコース (料理9品・飲み放題) | 5,000円 | 4,200円\n※クーポン利用条件：4名様以上、前日までに要予約。\n※金曜日・祝前日はご利用いただけません。",
            "question": "木曜日に友達5人でBコースを予約してクーポンを使うと、1人あたりいくらになりますか。",
            "options": ["4,200円", "5,000円", "3,000円", "3,500円"],
            "correctAnswerIndex": 0,
            "explanation": "Conditions are met (Thursday != Friday, 5 people >= 4 people). B course with coupon is 4,200円 per person."
        },
        {
            "table_text": "【市民病院 診療受付時間】\n診療科 | 月・火・木・金 | 水曜日 | 土曜日\n内科 | 9:00-12:00 / 14:00-17:00 | 9:00-12:00 | 9:00-12:00\n歯科 | 9:30-13:00 / 15:00-18:00 | 休診 | 休診\n眼科 | 14:00-17:00 のみ | 休診 | 9:00-12:00\n※日曜・祝日はすべての科が休診です。",
            "question": "眼科で診察を受けたい場合、受診できる時間帯はどれですか。",
            "options": ["月曜日の午後３時 または 土曜日の午前１０時", "水曜日の午前１０時", "火曜日の午前１０時", "日曜日の午後２時"],
            "correctAnswerIndex": 0,
            "explanation": "眼科 is open Mon/Tue/Thu/Fri 14:00-17:00 and Saturday 9:00-12:00. Monday 3pm and Saturday 10am both match."
        },
        {
            "table_text": "【日本語スピーチコンテスト 応募要項】\n応募資格：日本滞在3年未満の外国人\n部門 | スピーチ時間 | テーマ\n初級部門 (JFT-A2/N4相当) | 3分以内 | 「日本で驚いたこと」\n中級部門 (N3/N2相当) | 5分以内 | 「私の将来の夢」\n※応募締切：9月20日（必着）。原稿と録音データを提出。",
            "question": "来日1年目でJFT-A2レベルのマリアさんが応募する場合、スピーチ時間は何分ですか。",
            "options": ["3分以内（テーマ：「日本で驚いたこと」）", "5分以内（テーマ：「私の将来の夢」）", "10分以内", "時間は何分でも自由"],
            "correctAnswerIndex": 0,
            "explanation": "Maria matches the 初級部門 (JFT-A2), where time is 3分以内 and theme is 「日本で驚いたこと」."
        },
        {
            "table_text": "【富士山ツアー バス旅プラン】\nプラン | 出発時刻 | 到着時刻 | 料金（昼食付き）\nプランA (日帰り) | 朝7:30 | 夜19:30 | 8,800円\nプランB (温泉付き日帰り) | 朝8:00 | 夜21:00 | 11,500円\n※子供料金（小学生）は全プラン半額。\n※未就学児（6歳未満）は無料（座席・昼食なし）。",
            "question": "大人2人と小学生1人でプランAに参加する場合、合計料金はいくらですか。",
            "options": ["22,000円", "17,600円", "26,400円", "19,800円"],
            "correctAnswerIndex": 0,
            "explanation": "Adults: 8,800 * 2 = 17,600円. Child (elementary): 8,800 / 2 = 4,400円. Total = 17,600 + 4,400 = 22,000円."
        },
        {
            "table_text": "【市内循環バス 運賃案内】\n大人（中学生以上）：210円均一\n子供（小学生）：110円均一\n※ICカード（Suica/PASMO）ご利用の場合は大人200円、子供100円。\n※1日乗車券：大人500円、子供250円（車内で購入可能）。",
            "question": "大人がICカードを使って循環バスに1回乗る場合、いくら支払いますか。",
            "options": ["200円", "210円", "500円", "100円"],
            "correctAnswerIndex": 0,
            "explanation": "Under footnote: IC card fare for adults is exactly 200円."
        },
        {
            "table_text": "【さくら日本語学校 奨学金制度】\n奨学金種別 | 支給額 | 応募条件\n出席優秀賞 | 月額 20,000円 | 出席率98%以上かつ成績優秀者\n努力賞 | 月額 10,000円 | 出席率90%以上かつ学習意欲が高い者\n※過去に無断遅刻が3回以上ある場合は対象外となります。",
            "question": "出席率が95%で無断遅刻がない学生が応募できるのはどれですか。",
            "options": ["努力賞（月額10,000円）", "出席優秀賞（月額20,000円）", "両方同時にもらえる", "対象外で応募できない"],
            "correctAnswerIndex": 0,
            "explanation": "Attendance is 95% (which is >= 90%, but < 98% required for 出席優秀賞). Therefore eligible for 努力賞."
        },
        {
            "table_text": "【映画館 割引サービスのご案内】\n一般通常料金：1,900円\n割引サービス | 適用日・時間 | 割引後料金\nファーストデイ | 毎月1日 | 1,200円\nレディースデイ | 毎週水曜日 | 1,200円\nレイトショー | 毎日20:00以降の回 | 1,400円\nシニア割引 (60歳以上) | 毎日全時間 | 1,200円",
            "question": "金曜日の夜20:30に上映される映画を一般の大人が観る場合、料金はいくらですか。",
            "options": ["1,400円（レイトショー割引）", "1,900円（通常料金）", "1,200円", "1,500円"],
            "correctAnswerIndex": 0,
            "explanation": "20:30 is after 20:00 (毎日20:00以降の回), so the レイトショー rate of 1,400円 applies."
        },
        {
            "table_text": "【国際交流フェスティバル タイムスケジュール】\n時間 | ステージ演目 | 参加国・団体\n11:00-12:00 | 和太鼓パフォーマンス | 日本伝統芸能部\n12:30-13:30 | アジアの民族舞踊 | フィリピン・ベトナム留学生会\n14:00-15:00 | 世界の音楽コンサート | 国際交流バンド\n15:30-16:30 | 日本語スピーチ発表会 | 市内在住外国人",
            "question": "フィリピンやベトナムの民族舞踊が見られるのは何時からですか。",
            "options": ["12:30から13:30まで", "11:00から12:00まで", "14:00から15:00まで", "15:30から16:30まで"],
            "correctAnswerIndex": 0,
            "explanation": "Look at the 12:30-13:30 row: アジアの民族舞踊 (フィリピン・ベトナム留学生会)."
        },
        {
            "table_text": "【大型ゴミ（粗大ゴミ）収集手数料一覧】\n品目 | 手数料納付券の枚数 (1枚300円)\n自転車 | 2枚 (600円)\n布団（ふとん）2枚まで | 1枚 (300円)\nベッド（シングル） | 4枚 (1,200円)\nタンス（高さ120cm以上） | 3枚 (900円)\n※事前に電話またはインターネットで収集日を予約してください。",
            "question": "自転車1台と布団2枚を捨てたい場合、納付券は何枚必要で、合計いくらですか。",
            "options": ["納付券3枚（合計900円）", "納付券2枚（合計600円）", "納付券4枚（合計1,200円）", "納付券1枚（合計300円）"],
            "correctAnswerIndex": 0,
            "explanation": "Bicycle = 2 tickets (600円). Futon (up to 2) = 1 ticket (300円). Total = 3 tickets = 900円."
        },
        {
            "table_text": "【郵便局 配達日数・料金表（東京から発送）】\n種別 | 配達日数 | 料金 (重さ1kgまで)\n普通郵便 | 2〜3日後 | 250円\n速達（そくたつ） | 翌日午前中 | 550円\nゆうパック | 翌日中（日時指定可能）| 850円\n※日曜日・祝日は普通郵便の配達はお休みです。",
            "question": "金曜日に発送して、土曜日の午前中にどうしても届けたい場合、どの方法を選びますか。",
            "options": ["速達（そくたつ）", "普通郵便", "ゆうパック", "どれでも届く"],
            "correctAnswerIndex": 0,
            "explanation": "速達 delivers 翌日午前中 (next day morning), which reaches on Saturday morning."
        }
    ]
    for idx, item in enumerate(p9_data):
        questions.append({
            "id": f"p9_{idx+1}",
            "patternId": "p9_info_retrieval",
            "patternName": "Pattern 9: Information Retrieval & Schedules (情報検索・時刻表・表)",
            "level": "JFT-Basic A2 & JLPT N4",
            "question": f"次の案内や表を読んで、質問に最も適した答えを１・２・３・４から一つ選びなさい。\n\n{item['table_text']}\n\n質問：{item['question']}",
            "options": item["options"],
            "correctAnswerIndex": item["correctAnswerIndex"],
            "explanation": item["explanation"],
            "patternRule": "Table Scanning Matrix: Check row headers, condition notes (*), and time/fee matching.",
            "audioText": item["question"]
        })

    return questions

# 10 Full-length structured mock exams
def generate_mock_exam_series(all_questions):
    mock_exams = []
    
    # Organize questions by pattern
    by_pattern = {}
    for p in PATTERNS:
        by_pattern[p["id"]] = [q for q in all_questions if q["patternId"] == p["id"]]

    exam_themes = [
        "Comprehensive Foundation & Star Sentence Master (基礎総合力・並び替え特訓)",
        "Workplace Communication & Can-Do Challenge (職場会話・実務コミュニケーション)",
        "Daily Living & Community Notices Dokkai (生活掲示・案内読解攻略)",
        "Kanji Orthography & Contextual Collocation (漢字表記・連語マスター)",
        "Grammar Form Matrix & Particle Logic (文法形式・助詞完全制覇)",
        "Fast Timetable & Information Retrieval (時刻表・料金表・情報検索)",
        "Official 2025 JFT-Basic Standard Simulation (2025年度 JFT-Basic 標準模擬)",
        "Official 2026 JLPT N5/N4 Direct Predictor (2026年 直前予想模試)",
        "Advanced Can-Do & Workplace Task Mastery (高度Can-Do・タスク達成力)",
        "Final Master Graduation Grand Test (最終合格判定・総合グラウンドテスト)"
    ]

    for test_idx in range(1, 11):
        # Pick 18 curated questions per mock exam covering every pattern
        test_q_ids = []
        
        # 2 from P1 (Kanji reading)
        p1_pool = by_pattern["p1_kanji_reading"]
        test_q_ids.append(p1_pool[(test_idx * 2 - 2) % len(p1_pool)]["id"])
        test_q_ids.append(p1_pool[(test_idx * 2 - 1) % len(p1_pool)]["id"])

        # 2 from P2 (Kanji writing)
        p2_pool = by_pattern["p2_kanji_writing"]
        test_q_ids.append(p2_pool[(test_idx * 2 - 2) % len(p2_pool)]["id"])
        test_q_ids.append(p2_pool[(test_idx * 2 - 1) % len(p2_pool)]["id"])

        # 2 from P3 (Context vocab)
        p3_pool = by_pattern["p3_context_vocab"]
        test_q_ids.append(p3_pool[(test_idx * 2 - 2) % len(p3_pool)]["id"])
        test_q_ids.append(p3_pool[(test_idx * 2 - 1) % len(p3_pool)]["id"])

        # 2 from P4 (Paraphrase)
        p4_pool = by_pattern["p4_paraphrase"]
        test_q_ids.append(p4_pool[(test_idx * 2 - 2) % len(p4_pool)]["id"])
        test_q_ids.append(p4_pool[(test_idx * 2 - 1) % len(p4_pool)]["id"])

        # 3 from P5 (Grammar forms)
        p5_pool = by_pattern["p5_grammar_form"]
        test_q_ids.append(p5_pool[(test_idx * 3 - 3) % len(p5_pool)]["id"])
        test_q_ids.append(p5_pool[(test_idx * 3 - 2) % len(p5_pool)]["id"])
        test_q_ids.append(p5_pool[(test_idx * 3 - 1) % len(p5_pool)]["id"])

        # 2 from P6 (Star questions)
        p6_pool = by_pattern["p6_star_ordering"]
        test_q_ids.append(p6_pool[(test_idx * 2 - 2) % len(p6_pool)]["id"])
        test_q_ids.append(p6_pool[(test_idx * 2 - 1) % len(p6_pool)]["id"])

        # 2 from P7 (Dialogues)
        p7_pool = by_pattern["p7_conversation"]
        test_q_ids.append(p7_pool[(test_idx * 2 - 2) % len(p7_pool)]["id"])
        test_q_ids.append(p7_pool[(test_idx * 2 - 1) % len(p7_pool)]["id"])

        # 2 from P8 (Reading notices)
        p8_pool = by_pattern["p8_short_reading"]
        test_q_ids.append(p8_pool[(test_idx - 1) % len(p8_pool)]["id"])
        test_q_ids.append(p8_pool[(test_idx) % len(p8_pool)]["id"])

        # 1 from P9 (Information retrieval)
        p9_pool = by_pattern["p9_info_retrieval"]
        test_q_ids.append(p9_pool[(test_idx - 1) % len(p9_pool)]["id"])

        mock_exams.append({
            "testId": f"mock_exam_{test_idx}",
            "testNumber": test_idx,
            "title": f"2025/2026 Mock Exam #{test_idx}: {exam_themes[test_idx - 1]}",
            "japaneseTitle": f"第{test_idx}回 総合模擬試験",
            "targetLevel": "JFT-Basic A2 & JLPT N5/N4",
            "timeLimitMinutes": 35,
            "totalQuestions": len(test_q_ids),
            "passingScore": 75,
            "description": f"Standardized 18-question official simulation covering all 9 test patterns (Kanji, Vocabulary, Star ★ Ordering, Workplace Dialogues, Notices & Information Retrieval).",
            "questionIds": test_q_ids
        })

    return mock_exams

def main():
    questions = build_full_question_bank()
    mock_exams = generate_mock_exam_series(questions)
    
    drills_path = os.path.join(OUTPUT_DIR, "pattern_drills.json")
    with open(drills_path, "w", encoding="utf-8") as f:
        json.dump({
            "patterns": PATTERNS,
            "questions": questions,
            "mockExams": mock_exams
        }, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Generated {len(questions)} high-quality pattern questions across {len(PATTERNS)} patterns and {len(mock_exams)} mock exams.")

if __name__ == "__main__":
    main()
