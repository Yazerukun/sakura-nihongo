export interface KanaChar {
  hiragana: string;
  katakana: string;
  romaji: string;
  mnemonic: string;
  group: 'vowel' | 'k' | 's' | 't' | 'n' | 'h' | 'm' | 'y' | 'r' | 'w' | 'n_single' | 'dakuten' | 'combo';
}

export const KANA_LIST: KanaChar[] = [
  // Vowels
  { hiragana: 'あ', katakana: 'ア', romaji: 'a', mnemonic: 'Looks like an Apple with a stem', group: 'vowel' },
  { hiragana: 'い', katakana: 'イ', romaji: 'i', mnemonic: 'Two Eels swimming side by side', group: 'vowel' },
  { hiragana: 'う', katakana: 'ウ', romaji: 'u', mnemonic: 'An oooch! heavy boulder on someone\'s back', group: 'vowel' },
  { hiragana: 'え', katakana: 'エ', romaji: 'e', mnemonic: 'An Energetic ninja running forward', group: 'vowel' },
  { hiragana: 'お', katakana: 'オ', romaji: 'o', mnemonic: 'A golf ball On the tee with the hole in one', group: 'vowel' },

  // K group
  { hiragana: 'か', katakana: 'カ', romaji: 'ka', mnemonic: 'A Kite flying in the wind', group: 'k' },
  { hiragana: 'き', katakana: 'キ', romaji: 'ki', mnemonic: 'Looks like a Key', group: 'k' },
  { hiragana: 'く', katakana: 'ク', romaji: 'ku', mnemonic: 'A Cuckoo bird beak pointing left', group: 'k' },
  { hiragana: 'け', katakana: 'ケ', romaji: 'ke', mnemonic: 'A wooden Keg of juice', group: 'k' },
  { hiragana: 'こ', katakana: 'コ', romaji: 'ko', mnemonic: 'Two Co-existing worms', group: 'k' },

  // S group
  { hiragana: 'さ', katakana: 'サ', romaji: 'sa', mnemonic: 'A Samurai sword slashing', group: 's' },
  { hiragana: 'し', katakana: 'シ', romaji: 'shi', mnemonic: 'A giant Fishing hook catching She-fish', group: 's' },
  { hiragana: 'す', katakana: 'ス', romaji: 'su', mnemonic: 'A swirl of delicious hot Soup', group: 's' },
  { hiragana: 'せ', katakana: 'セ', romaji: 'se', mnemonic: 'Someone Saying "Welcome to my home!"', group: 's' },
  { hiragana: 'そ', katakana: 'ソ', romaji: 'so', mnemonic: 'A Sewing stitch zigzagging down', group: 's' },

  // T group
  { hiragana: 'た', katakana: 'タ', romaji: 'ta', mnemonic: 'Spells out the letters "t" and "a"', group: 't' },
  { hiragana: 'ち', katakana: 'チ', romaji: 'chi', mnemonic: 'A cute Cheerleader waving pompoms', group: 't' },
  { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu', mnemonic: 'A giant Tsunami tidal wave', group: 't' },
  { hiragana: 'て', katakana: 'テ', romaji: 'te', mnemonic: 'A wagging dog\'s Tail', group: 't' },
  { hiragana: 'と', katakana: 'ト', romaji: 'to', mnemonic: 'A Thorn stuck in a big Toe', group: 't' },

  // N group
  { hiragana: 'な', katakana: 'ナ', romaji: 'na', mnemonic: 'A Nun praying in front of a cross', group: 'n' },
  { hiragana: 'に', katakana: 'ニ', romaji: 'ni', mnemonic: 'A Needle and thread stitches', group: 'n' },
  { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu', mnemonic: 'Tangled delicious Ramen Noodles', group: 'n' },
  { hiragana: 'ね', katakana: 'ネ', romaji: 'ne', mnemonic: 'A cute Neko (cat) with a curled tail', group: 'n' },
  { hiragana: 'の', katakana: 'ノ', romaji: 'no', mnemonic: 'A round "No Smoking" prohibition sign', group: 'n' },

  // H group
  { hiragana: 'は', katakana: 'ハ', romaji: 'ha', mnemonic: 'The letter "H" paired with an "a"', group: 'h' },
  { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi', mnemonic: 'A big smiling mouth laughing "Hee hee!"', group: 'h' },
  { hiragana: 'ふ', katakana: 'フ', romaji: 'fu', mnemonic: 'Mount Fuji surrounded by clouds', group: 'h' },
  { hiragana: 'へ', katakana: 'ヘ', romaji: 'he', mnemonic: 'Points to Heaven atop the hill', group: 'h' },
  { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho', mnemonic: 'A Santa wearing a hat saying "Ho ho ho!"', group: 'h' },

  // M group
  { hiragana: 'ま', katakana: 'マ', romaji: 'ma', mnemonic: 'Mama wearing a double necklace', group: 'm' },
  { hiragana: 'み', katakana: 'ミ', romaji: 'mi', mnemonic: 'Looks like lucky number 21 for me', group: 'm' },
  { hiragana: 'む', katakana: 'ム', romaji: 'mu', mnemonic: 'A friendly Cow saying "Moo"', group: 'm' },
  { hiragana: 'め', katakana: 'メ', romaji: 'me', mnemonic: 'A lovely anime eye (Me = 目 eye)', group: 'm' },
  { hiragana: 'も', katakana: 'モ', romaji: 'mo', mnemonic: 'A big fishhook catching More worms', group: 'm' },

  // Y group
  { hiragana: 'や', katakana: 'ヤ', romaji: 'ya', mnemonic: 'A cute Yak with tall horns', group: 'y' },
  { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu', mnemonic: 'A unique fish swimming in water', group: 'y' },
  { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo', mnemonic: 'A Yo-yo hitching on a finger', group: 'y' },

  // R group
  { hiragana: 'ら', katakana: 'ラ', romaji: 'ra', mnemonic: 'A cute Rabbit standing upright', group: 'r' },
  { hiragana: 'り', katakana: 'リ', romaji: 'ri', mnemonic: 'Two Reeds swaying in the wind', group: 'r' },
  { hiragana: 'る', katakana: 'ル', romaji: 'ru', mnemonic: 'A loop that holds a precious Ruby', group: 'r' },
  { hiragana: 'れ', katakana: 'レ', romaji: 're', mnemonic: 'Someone Resting under a cozy shelter', group: 'r' },
  { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro', mnemonic: 'The Ruby was Robbed (no inner loop!)', group: 'r' },

  // W & N
  { hiragana: 'わ', katakana: 'ワ', romaji: 'wa', mnemonic: 'A White swan gliding on calm water', group: 'w' },
  { hiragana: 'を', katakana: 'ヲ', romaji: 'wo', mnemonic: 'Olympic athlete throwing a discus', group: 'w' },
  { hiragana: 'ん', katakana: 'ン', romaji: 'n', mnemonic: 'A stylish lowercase script "n"', group: 'n_single' },

  // Dakuten (G, Z, D, B, P)
  { hiragana: 'が', katakana: 'ガ', romaji: 'ga', mnemonic: 'Ka with tenten = Ga', group: 'dakuten' },
  { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi', mnemonic: 'Ki with tenten = Gi', group: 'dakuten' },
  { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu', mnemonic: 'Ku with tenten = Gu', group: 'dakuten' },
  { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge', mnemonic: 'Ke with tenten = Ge', group: 'dakuten' },
  { hiragana: 'ご', katakana: 'ゴ', romaji: 'go', mnemonic: 'Ko with tenten = Go', group: 'dakuten' },
  { hiragana: 'ざ', katakana: 'ザ', romaji: 'za', mnemonic: 'Sa with tenten = Za', group: 'dakuten' },
  { hiragana: 'じ', katakana: 'ジ', romaji: 'ji', mnemonic: 'Shi with tenten = Ji', group: 'dakuten' },
  { hiragana: 'ず', katakana: 'ズ', romaji: 'zu', mnemonic: 'Su with tenten = Zu', group: 'dakuten' },
  { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze', mnemonic: 'Se with tenten = Ze', group: 'dakuten' },
  { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo', mnemonic: 'So with tenten = Zo', group: 'dakuten' },
  { hiragana: 'だ', katakana: 'ダ', romaji: 'da', mnemonic: 'Ta with tenten = Da', group: 'dakuten' },
  { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji (dji)', mnemonic: 'Chi with tenten = Dji', group: 'dakuten' },
  { hiragana: 'づ', katakana: 'ヅ', romaji: 'dzu', mnemonic: 'Tsu with tenten = Dzu', group: 'dakuten' },
  { hiragana: 'で', katakana: 'デ', romaji: 'de', mnemonic: 'Te with tenten = De', group: 'dakuten' },
  { hiragana: 'ど', katakana: 'ド', romaji: 'do', mnemonic: 'To with tenten = Do', group: 'dakuten' },
  { hiragana: 'ば', katakana: 'バ', romaji: 'ba', mnemonic: 'Ha with tenten = Ba', group: 'dakuten' },
  { hiragana: 'び', katakana: 'ビ', romaji: 'bi', mnemonic: 'Hi with tenten = Bi', group: 'dakuten' },
  { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu', mnemonic: 'Fu with tenten = Bu', group: 'dakuten' },
  { hiragana: 'べ', katakana: 'ベ', romaji: 'be', mnemonic: 'He with tenten = Be', group: 'dakuten' },
  { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo', mnemonic: 'Ho with tenten = Bo', group: 'dakuten' },
  { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa', mnemonic: 'Ha with maru = Pa', group: 'dakuten' },
  { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi', mnemonic: 'Hi with maru = Pi', group: 'dakuten' },
  { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu', mnemonic: 'Fu with maru = Pu', group: 'dakuten' },
  { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe', mnemonic: 'He with maru = Pe', group: 'dakuten' },
  { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po', mnemonic: 'Ho with maru = Po', group: 'dakuten' }
];
