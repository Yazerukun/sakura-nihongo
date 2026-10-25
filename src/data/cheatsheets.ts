export interface TeFormRule {
  group: string;
  endings: string;
  rule: string;
  exampleBase: string;
  exampleTe: string;
  meaning: string;
  note?: string;
}

export const TE_FORM_RULES: TeFormRule[] = [
  {
    group: 'Group 1 (Godan)',
    endings: 'う (u), つ (tsu), る (ru)',
    rule: 'Replace ending with って (tte)',
    exampleBase: '会う (au) / 待つ (matsu) / 取る (toru)',
    exampleTe: '会って (atte) / 待って (matte) / 取って (totte)',
    meaning: 'To meet -> meeting / To wait -> waiting / To take -> taking'
  },
  {
    group: 'Group 1 (Godan)',
    endings: 'む (mu), ぶ (bu), ぬ (nu)',
    rule: 'Replace ending with んで (nde)',
    exampleBase: '飲む (nomu) / 遊ぶ (asobu) / 死ぬ (shinu)',
    exampleTe: '飲んで (nonde) / 遊んで (asonde) / 死んで (shinde)',
    meaning: 'To drink -> drinking / To play -> playing'
  },
  {
    group: 'Group 1 (Godan)',
    endings: 'く (ku)',
    rule: 'Replace ending with いて (ite)',
    exampleBase: '書く (kaku) / 聞く (kiku)',
    exampleTe: '書いて (kaite) / 聞いて (kiite)',
    meaning: 'To write -> writing / To listen -> listening',
    note: '⚠️ Special Exception: 行く (iku / to go) becomes 行って (itte)!'
  },
  {
    group: 'Group 1 (Godan)',
    endings: 'ぐ (gu)',
    rule: 'Replace ending with いで (ide)',
    exampleBase: '泳ぐ (oyogu) / 急ぐ (isogu)',
    exampleTe: '泳いで (oyoide) / 急いで (isoide)',
    meaning: 'To swim -> swimming / To hurry -> hurrying'
  },
  {
    group: 'Group 1 (Godan)',
    endings: 'す (su)',
    rule: 'Replace ending with して (shite)',
    exampleBase: '話す (hanasu) / 探す (sagasu)',
    exampleTe: '話して (hanashite) / 探して (sagashite)',
    meaning: 'To speak -> speaking / To search -> searching'
  },
  {
    group: 'Group 2 (Ichidan)',
    endings: 'Any verb ending in -iru or -eru with single stem',
    rule: 'Drop る and add て (te)',
    exampleBase: '食べる (taberu) / 見る (miru) / 寝る (neru)',
    exampleTe: '食べて (tabete) / 見て (mite) / 寝て (nete)',
    meaning: 'To eat -> eating / To look -> looking / To sleep -> sleeping'
  },
  {
    group: 'Group 3 (Irregular)',
    endings: 'する (suru) & くる (kuru)',
    rule: 'Irregular transformation',
    exampleBase: 'する (suru) / 来る (kuru) / 勉強する (benkyou suru)',
    exampleTe: 'して (shite) / 来て (kite) / 勉強して (benkyou shite)',
    meaning: 'To do -> doing / To come -> coming / To study -> studying'
  }
];

export interface ParticleItem {
  particle: string;
  romaji: string;
  coreFunction: string;
  keyRule: string;
  exampleJp: string;
  exampleEn: string;
  commonPitfall: string;
}

export const PARTICLES_LIST: ParticleItem[] = [
  {
    particle: 'は',
    romaji: 'wa (written ha)',
    coreFunction: 'Topic Marker ("As for X...")',
    keyRule: 'Sets the conversational theme or general topic. Highlights what follows it.',
    exampleJp: '私はさくらです。',
    exampleEn: 'As for me, I am Sakura.',
    commonPitfall: 'Confusing with が. は marks old/known information; が marks new focus.'
  },
  {
    particle: 'が',
    romaji: 'ga',
    coreFunction: 'Subject Marker / Identifier ("X is the one that...")',
    keyRule: 'Marks the specific grammatical actor, existence (あります/います), or desires/preferences (好き, 欲しい).',
    exampleJp: '猫がいます。 / 日本料理が好きです。',
    exampleEn: 'There is a cat. / I like Japanese food.',
    commonPitfall: 'Always use が before 好き, 嫌い, 上手, 下手, 欲しい, あります, います.'
  },
  {
    particle: 'を',
    romaji: 'o (written wo)',
    coreFunction: 'Direct Object Marker',
    keyRule: 'Marks the entity receiving the action of a transitive verb.',
    exampleJp: 'お茶を飲みます。 / 本を読みます。',
    exampleEn: 'I drink green tea. / I read a book.',
    commonPitfall: 'Pronounced "o", but always typed and written as を.'
  },
  {
    particle: 'に',
    romaji: 'ni',
    coreFunction: 'Target / Specific Time / Destination / Location of Existence',
    keyRule: 'Pinpoints an exact coordinate in space or time.',
    exampleJp: '７時に起きます。 / 日本に行きます。 / 部屋にいます。',
    exampleEn: 'I wake up at 7:00. / I am going to Japan. / I am in the room.',
    commonPitfall: 'Do NOT use に for relative time words (今日, 明日, 毎日, 週末).'
  },
  {
    particle: 'で',
    romaji: 'de',
    coreFunction: 'Location of Action / Means / Tool / Reason',
    keyRule: 'Shows where an active event takes place, or by what vehicle/instrument.',
    exampleJp: '図書館で勉強します。 / 電車で行きます。 / 箸で食べます。',
    exampleEn: 'I study at the library. / I go by train. / I eat with chopsticks.',
    commonPitfall: 'Static location of existence uses に (東京に住んでいます), active event uses で (東京で働きます).'
  },
  {
    particle: 'へ',
    romaji: 'e (written he)',
    coreFunction: 'Direction / Heading towards',
    keyRule: 'Emphasizes physical direction of travel.',
    exampleJp: '京都へ向かいます。',
    exampleEn: 'Heading toward Kyoto.',
    commonPitfall: 'Pronounced "e", written as へ.'
  },
  {
    particle: 'と',
    romaji: 'to',
    coreFunction: 'Complete "And" / "Together with"',
    keyRule: 'Exhaustive listing of nouns, or accompanying person.',
    exampleJp: 'パンと牛乳を買いました。 / イアンと勉強します。',
    exampleEn: 'I bought bread and milk (and nothing else). / I study with Ian.',
    commonPitfall: 'Use と for complete lists. For non-exhaustive ("among other things"), use や.'
  },
  {
    particle: 'から & まで',
    romaji: 'kara & made',
    coreFunction: 'From ... Until ... (Starting point & Ending point)',
    keyRule: 'Used for time periods, physical distances, or schedules.',
    exampleJp: '９時から５時まで働きます。 / 東京から大阪まで新幹線で行きます。',
    exampleEn: 'I work from 9:00 to 5:00. / I travel from Tokyo to Osaka by Shinkansen.',
    commonPitfall: 'から can also mean "because / since" when placed after a clause.'
  },
  {
    particle: 'も',
    romaji: 'mo',
    coreFunction: 'Inclusive "Also / Too / Even"',
    keyRule: 'Replaces は, が, or を to mean "also".',
    exampleJp: '私も行きたいです。',
    exampleEn: 'I also want to go.',
    commonPitfall: 'Never write はも or がも. も directly takes their place!'
  }
];

export interface CounterItem {
  counter: string;
  furigana: string;
  usage: string;
  examples: string[];
}

export const COUNTERS_LIST: CounterItem[] = [
  { counter: '〜人', furigana: 'にん (nin)', usage: 'People', examples: ['1人 (ひとり)', '2人 (ふたり)', '3人 (さんにん)', '4人 (よにん)'] },
  { counter: '〜つ', furigana: 'つ (tsu)', usage: 'General inanimate objects (Native Japanese)', examples: ['1つ (ひとつ)', '2つ (ふたつ)', '3つ (みっつ)', '4つ (よっつ)'] },
  { counter: '〜本', furigana: 'ほん / ぼん / ぽん', usage: 'Long cylindrical objects (bottles, pens, trees, roads, umbrellas)', examples: ['1本 (いっぽん)', '2本 (にほん)', '3本 (さんぼん)', '6本 (ろっぽん)'] },
  { counter: '〜枚', furigana: 'まい (mai)', usage: 'Thin, flat objects (paper, shirts, tickets, plates)', examples: ['1枚 (いちまい)', '2枚 (にまい)', '5枚 (ごまい)'] },
  { counter: '〜冊', furigana: 'さつ (satsu)', usage: 'Bound volumes (books, magazines, notebooks)', examples: ['1冊 (いっさつ)', '2冊 (にさつ)', '3冊 (さんさつ)'] },
  { counter: '〜台', furigana: 'だい (dai)', usage: 'Machines, vehicles, furniture, electronic devices', examples: ['1台 (いちだい)', '2台 (にだい)', '3台 (さんだい)'] },
  { counter: '〜匹', furigana: 'ひき / びき / ぴき', usage: 'Small animals, fish, insects, cats, dogs', examples: ['1匹 (いっぴき)', '2匹 (にひき)', '3匹 (さんびき)'] },
  { counter: '〜階', furigana: 'かい / がい', usage: 'Building floors', examples: ['1階 (いっかい)', '2階 (にかい)', '3階 (さんがい)'] }
];
