// Comprehensive profanity filter for chat moderation
// This filter blocks all inappropriate language completely

// Core profanity patterns with extensive variations and bypass attempts
const PROFANITY_PATTERNS = [
  // F-word and variations (most bypassed word)
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks', 'fuckin', 'fking', 'fked',
  'f*ck', 'f**k', 'f***', 'f****', 'fck', 'fuk', 'fucc', 'fukk', 'fook', 'fuc',
  'phuck', 'phuk', 'fawk', 'fock', 'fuc k', 'fu ck', 'f u c k', 'f-u-c-k',
  'f_u_c_k', 'f.u.c.k', 'fu.ck', 'f uck', 'fvck', 'fuxk', 'fack', 'fick',
  'f0ck', 'f0uck', 'fu0k', 'fuk0', 'f@ck', 'f#ck', 'f!ck', 'fµck', 'f°ck',
  'fцск', 'fцck', 'fսck', 'fսсk', 'fʋck', 'fuсk', 'fᴜck', 'ƒuck', 'ḟuck',
  
  // S-word variations
  'shit', 'shits', 'shitting', 'shitted', 'sht', 'shiit', 'shiet', 'shyt',
  'sh*t', 'sh**', 's**t', 's***', 'shyt', 'chit', 'schit', 'shi t', 'sh it',
  's h i t', 's-h-i-t', 's_h_i_t', 's.h.i.t', 'sh.it', 's hit', 'shіt',
  'sh1t', 'shi7', 'sht', 'shiet', 'sheeit', 'shite', 'sh!t', 'sh@t', 'sh#t',
  'ѕhit', 'ѕһit', 'ѕhіt', 'ѕнit', 'shіt', 'sɦit', 'ṣhit', 'şhit',
  
  // B-word variations
  'bitch', 'bitches', 'bitching', 'bitched', 'btch', 'bych', 'byatch', 'biatch',
  'b*tch', 'b**ch', 'b***h', 'bytch', 'beatch', 'beotch', 'biach', 'biotch',
  'bi tch', 'b itch', 'b i t c h', 'b-i-t-c-h', 'b_i_t_c_h', 'b.i.t.c.h',
  'bit.ch', 'b itch', 'bіtch', 'bitch', 'b1tch', 'bi7ch', 'bitc h', 'bit ch',
  'b!tch', 'b@tch', 'b#tch', 'вitch', 'ьitch', 'вітch', 'ḅitch', 'ḇitch',
  
  // A-word variations
  'ass', 'asses', 'arse', 'azz', 'azzes', 'azs', 'a$$', 'a$s', '$ss',
  'a s s', 'a-s-s', 'a_s_s', 'a.s.s', 'as.s', 'a ss', 'аss', 'аѕѕ',
  'a55', '455', 'as5', 'a5s', '@ss', '@s5', 'a@s', 'а55', 'ⱥss', 'ḁss',
  
  // D-word variations
  'dick', 'dicks', 'dic', 'dik', 'dck', 'dikk', 'dyck', 'dyk', 'dix',
  'd*ck', 'd**k', 'd***', 'di ck', 'd ick', 'd i c k', 'd-i-c-k', 'd_i_c_k',
  'd.i.c.k', 'dic.k', 'd ick', 'dіck', 'd1ck', 'dic7', 'di©k', 'd!ck',
  'd@ck', 'd#ck', 'ḍick', 'ḏick', 'dìck', 'díck', 'dîck', 'dīck',
  
  // C-word variations (both meanings)
  'cock', 'cocks', 'cok', 'cck', 'cawk', 'c0ck', 'c*ck', 'c**k', 'c***',
  'co ck', 'c ock', 'c o c k', 'c-o-c-k', 'c_o_c_k', 'c.o.c.k', 'coc.k',
  'cοck', 'соck', 'ċock', 'ḉock', 'ćock', 'ĉock', 'č0ck', 'c0©k',
  
  'cunt', 'cunts', 'cnt', 'cnut', 'kunt', 'c*nt', 'c**t', 'c***', 'cu nt',
  'c unt', 'c u n t', 'c-u-n-t', 'c_u_n_t', 'c.u.n.t', 'cun.t', 'ćunt',
  'cųnt', 'ċunt', 'ḉunt', 'сunt', 'сսnt', 'ćսnt', 'cu₦t', 'cu∩t',
  
  // P-word variations
  'pussy', 'pussies', 'pusy', 'pussi', 'pusie', 'pusi', 'pu$$y', 'pus$y',
  'p*ssy', 'p**sy', 'p***y', 'pu ssy', 'p ussy', 'p u s s y', 'p-u-s-s-y',
  'p_u_s_s_y', 'p.u.s.s.y', 'pus.sy', 'pússy', 'pùssy', 'pūssy', 'рussy',
  
  // Slurs and discriminatory language with extensive variations
  'nigger', 'nigga', 'niga', 'niger', 'nigg', 'n1gger', 'n1gga', 'n*gger', 'n*gga',
  'ni gger', 'n igger', 'n i g g e r', 'n-i-g-g-e-r', 'n_i_g_g_e_r', 'nіgger',
  'nígger', 'ńigger', 'ṅigger', 'ռigger', 'ռigga', 'ռiga', 'пigger', 'пigga',
  'ni99er', 'ni99a', 'n199er', 'n199a', 'nig9er', 'nig9a', 'nigg3r', 'nigg4',
  
  'retard', 'retarded', 'retards', 'tard', 'rtard', 'r3tard', 'ret@rd', 'r*tard',
  'retrd', 're tard', 'r etard', 'r e t a r d', 'r-e-t-a-r-d', 'r_e_t_a_r_d',
  'rétard', 'rētard', 'rətard', 'retαrd', 'retаrd', 're7ard', 're+ard',
  
  'fag', 'faggot', 'fagot', 'fags', 'f@g', 'f4g', 'f@ggot', 'f4ggot', 'fgt',
  'fa g', 'f ag', 'f a g', 'f-a-g', 'f_a_g', 'fagg0t', 'fag90t', 'fa990t',
  'fаg', 'fаggot', 'ḟag', 'ḟaggot', 'fαg', 'fαggot', 'phag', 'phag90t',
  
  // International slurs
  'chink', 'chinks', 'ch1nk', 'ch!nk', 'ch@nk', 'chi nk', 'ch ink',
  'spic', 'spick', 'spics', 'sp1c', 'sp!c', 'sp@c', 'sρic', 'ѕpic',
  'wetback', 'wet back', 'w3tback', 'w37back', 'we7back', 'w3tb@ck',
  'gook', 'g00k', 'g0ok', 'g0∅k', 'g∅∅k', 'jap', 'j@p', 'j4p', 'ј@p',
  'kike', 'k1ke', 'k!ke', 'k@ke', 'k1k3', 'κike', 'κ1ke', 'ķike',
  'beaner', 'b3aner', 'be@ner', 'beanr', 'bean3r', 'ьeaner',
  'paki', 'p@ki', 'p4ki', 'pakí', 'ρaki', 'рaki', 'ρ@ki',
  
  // Sexual content
  'whore', 'whores', 'wh0re', 'wh*re', 'wh0r3', 'whor3', 'who re', 'wh ore',
  'slut', 'sluts', 'sl*t', 'sl0t', 'slu7', 'sloot', 'slooot', 'sl ut', 's lut',
  'hoe', 'ho3', 'h0e', 'h03', 'ħoe', 'ḧoe', 'нoe', 'ħо3',
  
  // Other offensive terms
  'bastard', 'bastards', 'b@stard', 'b4stard', 'ba5tard', 'bast@rd', 'ba57ard',
  'damn', 'damned', 'd@mn', 'd4mn', 'da mn', 'd amn', 'dαmn', 'dаmn',
  'hell', 'hel', 'h3ll', 'h311', 'he11', 'h3l1', 'нell', 'ħell',
  'crap', 'craps', 'cr@p', 'cr4p', 'c rap', 'cr ap', 'ćrap', 'ċrap',
  'piss', 'pissed', 'pissing', 'p*ss', 'p1ss', 'pi ss', 'p iss', 'р1ss',
  
  // Modern slang and internet terms
  'simp', 'simps', 's1mp', 'si mp', 's imp', 'ѕimp', 'ṡimp', '51mp',
  'thot', 'thots', 'th0t', 'th∅t', 'tħot', 'ţhot', '7hot', '+hot',
  'cuck', 'cucks', 'c*ck', 'cu ck', 'c uck', 'ćuck', 'ċuck', 'ĉuck',
  'incel', 'incels', '1ncel', 'inc3l', 'in cel', 'i ncel', 'іncel',
  
  // Acronyms and abbreviations
  'wtf', 'w7f', 'w+f', 'wt f', 'w tf', 'w†f', 'ш†f', 'ω†f',
  'stfu', 's7fu', 's+fu', 'st fu', 's tfu', 'ѕ†fu', 'ṡ†fu',
  'gtfo', 'g7fo', 'g+fo', 'gt fo', 'g tfo', 'g†fo', 'ģ†fo',
  'omfg', '0mfg', 'omf9', '0mf9', 'om fg', 'o mfg', 'οmfg',
  'lmfao', 'lmf@o', 'lmfa0', 'lm fao', 'l mfao', 'ĺmfao', 'łmfao',
  'milf', 'm1lf', 'mi lf', 'm ilf', 'mίlf', 'mіlf', 'ṁilf',
  'dilf', 'd1lf', 'di lf', 'd ilf', 'dίlf', 'dіlf', 'ḍilf'
];

// Spaced out variations (common bypass technique)
const SPACED_PATTERNS = [
  'f u c k', 'f  u  c  k', 'f-u-c-k', 'f_u_c_k', 'f.u.c.k',
  's h i t', 's  h  i  t', 's-h-i-t', 's_h_i_t', 's.h.i.t',
  'b i t c h', 'b  i  t  c  h', 'b-i-t-c-h', 'b_i_t_c_h', 'b.i.t.c.h',
  'n i g g e r', 'n  i  g  g  e  r', 'n-i-g-g-e-r', 'n_i_g_g_e_r',
  'a s s h o l e', 'a  s  s  h  o  l  e', 'a-s-s-h-o-l-e'
];

// Character substitution patterns (leetspeak and Unicode)
const SUBSTITUTION_PATTERNS = [
  // Common character replacements
  { original: 'a', substitutes: ['@', '4', 'α', 'а', 'ă', 'ą', 'ā', 'à', 'á', 'â', 'ã', 'ä', 'å'] },
  { original: 'e', substitutes: ['3', '€', 'ë', 'è', 'é', 'ê', 'ē', 'ę', 'ě', 'ε', 'е'] },
  { original: 'i', substitutes: ['1', '!', '|', 'ï', 'ì', 'í', 'î', 'ī', 'į', 'ι', 'і'] },
  { original: 'o', substitutes: ['0', '∅', 'ö', 'ò', 'ó', 'ô', 'õ', 'ō', 'ø', 'ο', 'о'] },
  { original: 'u', substitutes: ['µ', 'ü', 'ù', 'ú', 'û', 'ū', 'ų', 'υ', 'у', 'ս'] },
  { original: 's', substitutes: ['$', '5', 'ś', 'š', 'ş', 'ș', 'ѕ', 'ṡ', 'ṣ'] },
  { original: 'c', substitutes: ['©', '¢', 'ç', 'ć', 'č', 'ċ', 'с', 'ḉ'] },
  { original: 'g', substitutes: ['9', 'ğ', 'ģ', 'ġ', 'ց', 'ḡ', 'ģ'] },
  { original: 'l', substitutes: ['1', '|', 'ł', 'ľ', 'ļ', 'ĺ', 'ḷ', 'ŀ'] },
  { original: 't', substitutes: ['7', '+', '†', 'ţ', 'ť', 'ṫ', 'ṭ', 'ț'] },
  { original: 'n', substitutes: ['ñ', 'ń', 'ň', 'ņ', 'ṅ', 'ṇ', 'ռ', 'п'] },
  { original: 'r', substitutes: ['®', 'ř', 'ŕ', 'ŗ', 'ṙ', 'ṛ', 'р', 'ŗ'] },
  { original: 'h', substitutes: ['ħ', 'ĥ', 'ḥ', 'ḧ', 'ḩ', 'н', 'ḣ'] },
  { original: 'f', substitutes: ['ƒ', 'ḟ', 'ḟ', 'ḟ', 'ḟ'] },
  { original: 'k', substitutes: ['κ', 'ķ', 'ḱ', 'ḳ', 'ḵ'] },
  { original: 'p', substitutes: ['ρ', 'ṗ', 'ṕ', 'р', 'ṗ'] },
  { original: 'b', substitutes: ['ъ', 'ь', 'в', 'ḅ', 'ḇ', 'ḃ'] },
  { original: 'v', substitutes: ['ν', 'ṽ', 'ṿ', 'ѵ', 'ṽ'] },
  { original: 'w', substitutes: ['ω', 'ẅ', 'ẇ', 'ẉ', 'ш'] },
  { original: 'y', substitutes: ['ý', 'ÿ', 'ŷ', 'ẏ', 'у'] },
  { original: 'z', substitutes: ['ž', 'ź', 'ż', 'ẓ', 'ẕ'] }
];

// Compound phrases that should be blocked with extensive variations
const BAD_PHRASES = [
  // Asshole variations
  'asshole', 'ashole', 'a$$hole', '@sshole', 'azzhole', 'ass hole', 'a s s h o l e',
  'a-s-s-h-o-l-e', 'a_s_s_h_o_l_e', 'a.s.s.h.o.l.e', '@$$hole', '@s$hole', '@ss hole',
  'аsshole', 'аss hole', 'ⱥsshole', 'ḁsshole', 'a55hole', 'a55 hole', '455hole',
  
  // Motherfucker variations
  'motherfucker', 'mother fucker', 'motherfcker', 'motherf*cker', 'mthrfckr', 'mofo', 'm0fo',
  'mother f*cker', 'mother f**ker', 'moth3rfuck3r', 'moth3r fuck3r', 'mothafucka', 'motha fucka',
  'mother fcker', 'motherfckr', 'mtherfcker', 'mf3r', 'mfer', 'm fer', 'm f3r',
  'm0th3rfuck3r', 'мotherfucker', 'moth3rfսcker', 'ṁotherfucker', 'mótherfucker',
  
  // Bullshit variations  
  'bullshit', 'bull shit', 'horseshit', 'horse shit', 'dipshit', 'dip shit', 'holy shit',
  'bul shit', 'bull sh*t', 'bull sh1t', 'bullsh*t', 'bullsh1t', 'bul sh*t', 'bul sh1t',
  'bu11shit', 'bu11 shit', 'bullsht', 'bull sht', 'вullshit', 'ьullshit', 'ḅullshit',
  'hol3y shit', 'ho1y shit', 'hοly shit', 'ħoly shit', 'нoly shit', 'holy sh*t', 'holy sh1t',
  
  // Dumbass variations
  'dumbass', 'dumb ass', 'smartass', 'smart ass', 'fatass', 'fat ass', 'badass', 'bad ass',
  'hardass', 'hard ass', 'jackass', 'jack ass', 'kick ass', 'kickass', 'whoop ass', 'whoopas',
  'dum ass', 'dumass', 'dumb a$$', 'dumb @ss', 'dum @ss', 'duмb ass', 'dսmb ass',
  'smart a$$', 'smart @ss', 'smar7 ass', 'ṡmart ass', 'śmart ass', 'sмart ass',
  'fat a$$', 'fat @ss', 'fa7 ass', 'ḟat ass', 'fаt ass', 'fα† ass',
  'bad a$$', 'bad @ss', 'ba d ass', 'вad ass', 'ьad ass', 'ḅad ass',
  'hard a$$', 'hard @ss', 'har d ass', 'ħard ass', 'нard ass', 'ḣard ass',
  
  // Head combinations
  'dickhead', 'dick head', 'shithead', 'shit head', 'asshat', 'ass hat', 'pissoff', 'piss off',
  'dic head', 'dik head', 'dick hed', 'dic7 head', 'd1ck head', 'd!ck head', 'dіck head',
  'shit hed', 'sh*t head', 'sh1t head', 'sht head', 'shіt head', 'ѕhit head',
  'ass ha7', 'a$$ hat', '@ss hat', 'a55 hat', 'аss hat', 'ⱥss hat', 'ḁss hat',
  'pis off', 'p*ss off', 'p1ss off', 'pіss off', 'р1ss off', 'ṗiss off',
  
  // Religious/blasphemous phrases
  'jesus christ', 'jesus h christ', 'christ almighty', 'for christs sake', 'christ sake',
  'goddamn', 'god damn', 'goddam', 'g0ddamn', 'goddammit', 'god dammit', 'god damn it',
  'jesus chr1st', 'jesu5 christ', 'jes0s christ', 'јesus christ', 'jеsus christ', 'jėsus christ',
  'g0d damn', 'god dam', 'god d@mn', 'god d4mn', 'gοd damn', 'ģod damn', 'ġod damn',
  'goddamm1t', 'god damm1t', 'god dam1t', 'g0d dammit', 'gοddammit', 'ģoddammit',
  
  // Racial compound slurs
  'sand nigger', 'sand n*gger', 'sand n1gger', 'sand nіgger', 'ѕand nigger', 'śand nigger',
  'camel jockey', 'camel j0ckey', 'camel јockey', 'ćamel jockey', 'ċamel jockey',
  'white trash', 'wh1te trash', 'whіte trash', 'wħite trash', 'ωhite trash', 'ẇhite trash',
  'trailer trash', 'tra1ler trash', 'traіler trash', 'ţrailer trash', 'ṫrailer trash',
  'cotton picker', 'c0tton picker', 'со††on picker', 'ċotton picker', 'ćotton picker',
  
  // Piece of shit variations
  'piece of shit', 'piece of sh*t', 'piece of sh1t', 'piece of sht', 'piece of shіt',
  'p1ece of shit', 'p!ece of shit', 'pіece of shit', 'ṗiece of shit', 'ρiece of shit',
  'pos', 'p.o.s', 'p o s', 'p-o-s', 'p_o_s', 'ρos', 'р0s', 'ṗos',
  
  // Family insults
  'son of a bitch', 'sonofabitch', 'son of a b*tch', 'son of a b1tch', 'son of a btch',
  'son 0f a bitch', 'ѕon of a bitch', 'śon of a bitch', 'ṡon of a bitch',
  'daughter of a whore', 'daughter of a wh0re', 'daughter of a wh*re',
  'bastard child', 'b@stard child', 'b4stard child', 'ba5tard child', 'вastard child',
  
  // Go to hell variations
  'go to hell', 'go 2 hell', 'go t0 hell', 'g0 to hell', 'gο to hell', 'ģo to hell',
  'go to h3ll', 'go to h311', 'go to he11', 'go to нell', 'go to ħell', 'go to ḧell',
  'burn in hell', 'burn 1n hell', 'burn іn hell', 'ьurn in hell', 'ḅurn in hell',
  'rot in hell', 'r0t in hell', 'го† in hell', 'ŗot in hell', 'ṙot in hell',
  
  // Fuck you/off variations  
  'fuck you', 'fck you', 'fuk you', 'f*ck you', 'f**k you', 'fսck you', 'ƒuck you',
  'fu ck you', 'f uck you', 'f u c k you', 'f-u-c-k you', 'f_u_c_k you',
  'fuck off', 'fck off', 'fuk off', 'f*ck off', 'f**k off', 'fսck off', 'ƒuck off',
  'fu ck off', 'f uck off', 'f u c k off', 'f-u-c-k off', 'f_u_c_k off',
  'screw you', 'scr3w you', 'screw y0u', 'ѕcrew you', 'ścrew you', 'ṡcrew you',
  'eff you', '3ff you', 'ef you', 'eph you', 'єff you', 'ëff you',
  
  // Additional offensive combinations
  'eat shit', 'eat sh*t', 'eat sh1t', 'eat sht', 'eat shіt', '3at shit', 'єat shit',
  'kiss my ass', 'kiss my a$$', 'kiss my @ss', 'kiss my a55', 'kiss my аss',
  'suck my dick', 'suck my d*ck', 'suck my d1ck', 'suck my dic', 'suck my dіck',
  'bite me', 'b1te me', 'bіte me', 'ьite me', 'ḅite me', 'ḇite me',
  'shove it', 'sh0ve it', 'shοve it', 'ѕhove it', 'śhove it', 'ṡhove it',
  'up yours', 'up y0urs', 'up уours', 'սp yours', 'ᴜp yours', 'ūp yours'
];

// Standalone words that are safe but could be problematic in compound form
const CONTEXT_SENSITIVE_WORDS = [
  'ass' // Only block when standalone or in compounds, not in words like "class", "pass", "assistant"
];

// Advanced text normalization to handle sophisticated bypass attempts
function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  
  // Remove common separators and special characters used to bypass filters
  normalized = normalized.replace(/[-_.,:;!@#$%^&*()+={}[\]|\\/<>?~`'"]/g, '');
  
  // Handle spaced out words (f u c k -> fuck)
  normalized = normalized.replace(/\s+/g, '');
  
  // Apply character substitution mappings
  for (const pattern of SUBSTITUTION_PATTERNS) {
    for (const substitute of pattern.substitutes) {
      const regex = new RegExp(substitute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      normalized = normalized.replace(regex, pattern.original);
    }
  }
  
  // Additional common substitutions not covered above
  normalized = normalized
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/9/g, 'g')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a')
    .replace(/\+/g, 't')
    .replace(/!/g, 'i')
    .replace(/\|/g, 'l');
  
  return normalized;
}

// Generate all possible variations of spaced text
function generateSpacedVariations(text: string): string[] {
  const variations = [text];
  
  // Add variations with different spacing patterns
  const chars = text.split('');
  if (chars.length > 2) {
    // f u c k
    variations.push(chars.join(' '));
    // f  u  c  k  
    variations.push(chars.join('  '));
    // f-u-c-k
    variations.push(chars.join('-'));
    // f_u_c_k
    variations.push(chars.join('_'));
    // f.u.c.k
    variations.push(chars.join('.'));
    // f,u,c,k
    variations.push(chars.join(','));
  }
  
  return variations;
}

// Check if text contains profanity using comprehensive detection
export function containsProfanity(text: string): boolean {
  const originalText = text.toLowerCase();
  const normalized = normalizeText(text);
  
  // Check all profanity patterns directly
  for (const pattern of PROFANITY_PATTERNS) {
    const normalizedPattern = normalizeText(pattern);
    
    // Direct substring match in normalized text
    if (normalized.includes(normalizedPattern)) {
      return true;
    }
    
    // Check original text for exact pattern match
    if (originalText.includes(pattern.toLowerCase())) {
      return true;
    }
    
    // Check for spaced variations in original text
    const spacedVariations = generateSpacedVariations(pattern);
    for (const variation of spacedVariations) {
      if (originalText.includes(variation.toLowerCase())) {
        return true;
      }
    }
  }
  
  // Check spaced patterns specifically
  for (const spacedPattern of SPACED_PATTERNS) {
    if (originalText.includes(spacedPattern.toLowerCase())) {
      return true;
    }
    
    // Also check without spaces in case it's already normalized
    const withoutSpaces = spacedPattern.replace(/\s+/g, '');
    if (originalText.includes(withoutSpaces.toLowerCase())) {
      return true;
    }
  }
  
  // Check bad phrases with all variations
  for (const phrase of BAD_PHRASES) {
    const normalizedPhrase = normalizeText(phrase);
    
    // Direct match in normalized text
    if (normalized.includes(normalizedPhrase)) {
      return true;
    }
    
    // Check original text
    if (originalText.includes(phrase.toLowerCase())) {
      return true;
    }
    
    // Check spaced variations
    const spacedVariations = generateSpacedVariations(phrase);
    for (const variation of spacedVariations) {
      if (originalText.includes(variation.toLowerCase())) {
        return true;
      }
    }
  }
  
  // Additional checks for common bypass attempts
  
  // Check for repeated characters (shiiiit, fuuuuck)
  const deduped = originalText.replace(/(.)\1{2,}/g, '$1');
  if (deduped !== originalText) {
    return containsProfanity(deduped);
  }
  
  // Check for mixed case bypass (ShIt, FuCk)
  const mixedCaseNormalized = originalText.replace(/[A-Z]/g, (match) => match.toLowerCase());
  if (mixedCaseNormalized !== originalText) {
    return containsProfanity(mixedCaseNormalized);
  }
  
  // Check for reverse bypass (kcuf instead of fuck)
  const reversed = originalText.split('').reverse().join('');
  const commonReversed = ['kcuf', 'tihs', 'ssa', 'kcid'];
  for (const rev of commonReversed) {
    if (reversed.includes(rev)) {
      return true;
    }
  }
  
  return false;
}

// Filter message and return error if profanity detected
export function filterMessage(message: string): { allowed: boolean; reason?: string } {
  if (containsProfanity(message)) {
    return {
      allowed: false,
      reason: "Message blocked: inappropriate language detected"
    };
  }
  
  return { allowed: true };
}