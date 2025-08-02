const WORDS = [
  'BLATI', 'CHOFO', 'HMARA', 'NCHOF', 'NDIRO', 'JAMIL', 'ZWINA', 'BINGA', 'JWANE', 'FRAKA',
  'TQADA', 'NQRAW', 'FRASH', 'FIKRA', 'SKHON', 'DERTI', 'WARDA', 'SABER', 'BARDA', 'WAJED',
  'MOTOR', 'MIZAN', 'ZAHRI', 'KHDAM', 'QRAYA', 'POUFA', 'ARGAN', 'KHOYA', 'MZIAN', 'KHRYA',
  'WAKHA', 'NADYA', 'FORSA', 'TAACH', 'BAYDA', 'SALITI', 'KHOBZ', 'BABOR', 'KHAYB', 'JIBLI',
  'GHADI', 'ZERGA', 'SMYKA', 'WELDI', 'AMIRA', 'SWIQA', 'ZELAL', 'ZELIJ', 'SMHLI', 'FUNDO',
  'BLAKA', 'YTIRI', 'KELBA', 'DRARI', 'RZINA', 'STAFET', 'WAHED', 'SEYAD', 'BKHOR', 'TQDIA',
  'ZAWYA', 'HBIBA', 'KHDMA', 'SFIHA', 'HABIB', 'GHADA', 'SMIYA', 'TKHAF', 'MSAWB', 'BRIKA',
  'BATAL', 'RAHMA', 'HZINA', 'DOROF', 'MKTAB', 'HADIK', 'FTOUR', 'DERBO', 'FADOL', 'MACHI',
  'LEJAM', 'YARBI', 'FARAH', 'MBWEQ', 'MDINA', 'KHALI', 'SKHIT', 'MGDER', 'NIQAB', 'BELDI',
  'RKHIS', 'MQWED', 'BGHEL', 'FAHIM', 'NQSHA', 'MAZAL', 'NOKTA', 'BATEL', 'TASSA', 'CHRAB',
  'MSKIN', 'QABLA', 'FLOKA', 'FLOSS', 'FERDA', 'CHRBIL', 'HANYA', 'NIIYA', 'HAKIM', 'TQDIR',
  'RAKOM', 'GHRAZ', 'WCHAM', 'KHALA', 'KHLIH', 'DKHOL', 'MZIKA', 'HKAYA', 'QZDIR', 'ASIDI',
  'ZAYDA', 'BRIQE', 'QAMAR', 'MRIDA', 'HMAMA', 'SAHBI', 'WAYLI', 'QEHWA', 'TCHOF', 'DKHLA',
  'BERAD', 'BNDIR', 'SKATA', 'QHIWA', 'LBZIM', 'FAWDA', 'TQSER', 'TERMA', 'DERSA', 'HEMAM',
  'QEDAM', 'ZRIBA'
];

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

const GAME_STATES = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost'
};


export {
  WORDS,
  KEYBOARD_ROWS,
  GAME_STATES,
};
