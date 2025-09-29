// All pets available in the game, based on Dank Memer pets
export interface PetType {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  hungerDecay: number; // hours per point lost
  hygieneDecay: number; // hours per point lost  
  energyDecay: number; // hours per point lost
  funDecay: number; // hours per point lost
  adoptionCost: number; // coins needed to adopt
}

export const AVAILABLE_PETS: PetType[] = [
  // Row 1
  {
    id: 'alien',
    name: 'Alien',
    description: 'A mysterious extraterrestrial companion from outer space.',
    emoji: '👽',
    rarity: 'epic',
    hungerDecay: 48,
    hygieneDecay: 48,
    energyDecay: 72,
    funDecay: 48,
    adoptionCost: 50000
  },
  {
    id: 'axolotl',
    name: 'Axolotl',
    description: 'An adorable aquatic salamander that stays young forever.',
    emoji: '🦎',
    rarity: 'rare',
    hungerDecay: 24,
    hygieneDecay: 12,
    energyDecay: 48,
    funDecay: 36,
    adoptionCost: 25000
  },
  {
    id: 'bird',
    name: 'Bird',
    description: 'A cheerful feathered friend that loves to sing.',
    emoji: '🐦',
    rarity: 'common',
    hungerDecay: 12,
    hygieneDecay: 24,
    energyDecay: 24,
    funDecay: 18,
    adoptionCost: 5000
  },
  {
    id: 'bob',
    name: 'Bob',
    description: 'Just Bob. Nobody knows what Bob really is, but he\'s a good boy.',
    emoji: '🔴',
    rarity: 'legendary',
    hungerDecay: 72,
    hygieneDecay: 72,
    energyDecay: 96,
    funDecay: 72,
    adoptionCost: 100000
  },
  {
    id: 'blobfish',
    name: 'Blobfish',
    description: 'The world\'s most misunderstood fish. Ugly but lovable.',
    emoji: '🐠',
    rarity: 'uncommon',
    hungerDecay: 18,
    hygieneDecay: 12,
    energyDecay: 36,
    funDecay: 24,
    adoptionCost: 10000
  },
  {
    id: 'bunny',
    name: 'Bunny',
    description: 'A fluffy rabbit that hops around and brings joy.',
    emoji: '🐰',
    rarity: 'common',
    hungerDecay: 12,
    hygieneDecay: 18,
    energyDecay: 24,
    funDecay: 12,
    adoptionCost: 8000
  },

  // Row 2
  {
    id: 'capybara',
    name: 'Capybara',
    description: 'The chillest animal in the world. Always calm and relaxed.',
    emoji: '🦫',
    rarity: 'rare',
    hungerDecay: 36,
    hygieneDecay: 24,
    energyDecay: 48,
    funDecay: 72,
    adoptionCost: 30000
  },
  {
    id: 'casino_chip',
    name: 'Casino Chip',
    description: 'A lucky gambling chip that sometimes brings fortune.',
    emoji: '🪙',
    rarity: 'epic',
    hungerDecay: 96,
    hygieneDecay: 96,
    energyDecay: 96,
    funDecay: 24,
    adoptionCost: 75000
  },
  {
    id: 'cat',
    name: 'Cat',
    description: 'An independent feline that judges you silently.',
    emoji: '🐱',
    rarity: 'common',
    hungerDecay: 18,
    hygieneDecay: 6,
    energyDecay: 36,
    funDecay: 24,
    adoptionCost: 7000
  },
  {
    id: 'catgirl',
    name: 'Catgirl',
    description: 'Half cat, half human, all adorable. Nya~',
    emoji: '😸',
    rarity: 'epic',
    hungerDecay: 24,
    hygieneDecay: 12,
    energyDecay: 36,
    funDecay: 18,
    adoptionCost: 60000
  },
  {
    id: 'crab',
    name: 'Crab',
    description: 'A sideways-walking crustacean with powerful claws.',
    emoji: '🦀',
    rarity: 'uncommon',
    hungerDecay: 24,
    hygieneDecay: 36,
    energyDecay: 48,
    funDecay: 36,
    adoptionCost: 12000
  },
  {
    id: 'cupid',
    name: 'Cupid',
    description: 'The god of love, spreading romance wherever they go.',
    emoji: '💘',
    rarity: 'legendary',
    hungerDecay: 72,
    hygieneDecay: 48,
    energyDecay: 72,
    funDecay: 24,
    adoptionCost: 150000
  },

  // Row 3
  {
    id: 'dog',
    name: 'Dog',
    description: 'Man\'s best friend, loyal and always excited to see you.',
    emoji: '🐕',
    rarity: 'common',
    hungerDecay: 12,
    hygieneDecay: 18,
    energyDecay: 24,
    funDecay: 8,
    adoptionCost: 6000
  },
  {
    id: 'dragon',
    name: 'Dragon',
    description: 'A mighty mythical beast that breathes fire and hoards treasure.',
    emoji: '🐉',
    rarity: 'legendary',
    hungerDecay: 48,
    hygieneDecay: 72,
    energyDecay: 96,
    funDecay: 48,
    adoptionCost: 200000
  },
  {
    id: 'duck',
    name: 'Duck',
    description: 'A quacking waterfowl that loves to paddle around.',
    emoji: '🦆',
    rarity: 'common',
    hungerDecay: 18,
    hygieneDecay: 12,
    energyDecay: 24,
    funDecay: 18,
    adoptionCost: 4000
  },
  {
    id: 'exploiting_human',
    name: 'Exploiting Human',
    description: 'A suspicious individual who definitely isn\'t cheating.',
    emoji: '👤',
    rarity: 'rare',
    hungerDecay: 24,
    hygieneDecay: 72,
    energyDecay: 12,
    funDecay: 96,
    adoptionCost: 1
  },
  {
    id: 'flying_spaghetti_monster',
    name: 'Flying Spaghetti Monster',
    description: 'The divine pasta deity, blessed be his noodly appendages.',
    emoji: '🍝',
    rarity: 'legendary',
    hungerDecay: 168,
    hygieneDecay: 168,
    energyDecay: 168,
    funDecay: 168,
    adoptionCost: 500000
  
  },
  {
    id: 'fox',
    name: 'Fox',
    description: 'A clever orange creature that says mysterious things.',
    emoji: '🦊',
    rarity: 'uncommon',
    hungerDecay: 18,
    hygieneDecay: 24,
    energyDecay: 36,
    funDecay: 24,
    adoptionCost: 15000
  },

  // Row 4
  {
    id: 'funnel_web_spider',
    name: 'Funnel Web Spider',
    description: 'A deadly arachnid from Australia. Handle with extreme care.',
    emoji: '🕷️',
    rarity: 'epic',
    hungerDecay: 72,
    hygieneDecay: 96,
    energyDecay: 72,
    funDecay: 72,
    adoptionCost: 45000
  },
  {
    id: 'garden_gnome',
    name: 'Garden Gnome',
    description: 'A mystical lawn ornament that protects your garden.',
    emoji: '🧙',
    rarity: 'rare',
    hungerDecay: 168,
    hygieneDecay: 168,
    energyDecay: 24,
    funDecay: 96,
    adoptionCost: 35000
  },
  {
    id: 'gecko',
    name: 'Gecko',
    description: 'A small lizard that can save you money on car insurance.',
    emoji: '🦎',
    rarity: 'uncommon',
    hungerDecay: 24,
    hygieneDecay: 36,
    energyDecay: 48,
    funDecay: 36,
    adoptionCost: 11000
  },
  {
    id: 'hamster',
    name: 'Hamster',
    description: 'A tiny rodent that loves running on wheels and stuffing cheeks.',
    emoji: '🐹',
    rarity: 'common',
    hungerDecay: 8,
    hygieneDecay: 12,
    energyDecay: 12,
    funDecay: 8,
    adoptionCost: 3000
  },
  {
    id: 'jack_frost',
    name: 'Jack Frost',
    description: 'The spirit of winter, bringing cold and crystalline beauty.',
    emoji: '❄️',
    rarity: 'epic',
    hungerDecay: 72,
    hygieneDecay: 168,
    energyDecay: 48,
    funDecay: 72,
    adoptionCost: 80000
  },
  {
    id: 'jack_o_lantern',
    name: 'Jack O\' Lantern',
    description: 'A spooky Halloween pumpkin that glows in the dark.',
    emoji: '🎃',
    rarity: 'rare',
    hungerDecay: 96,
    hygieneDecay: 96,
    energyDecay: 72,
    funDecay: 24,
    adoptionCost: 31000
  },

  // Row 5
  {
    id: 'koala',
    name: 'Koala',
    description: 'A sleepy Australian marsupial that loves eucalyptus leaves.',
    emoji: '🐨',
    rarity: 'uncommon',
    hungerDecay: 36,
    hygieneDecay: 48,
    energyDecay: 12,
    funDecay: 48,
    adoptionCost: 18000
  },
  {
    id: 'kraken',
    name: 'Kraken',
    description: 'A massive sea monster with tentacles that can sink ships.',
    emoji: '🐙',
    rarity: 'legendary',
    hungerDecay: 96,
    hygieneDecay: 24,
    energyDecay: 96,
    funDecay: 72,
    adoptionCost: 250000
  },
  {
    id: 'krampus',
    name: 'Krampus',
    description: 'The anti-Santa who punishes naughty children at Christmas.',
    emoji: '👹',
    rarity: 'epic',
    hungerDecay: 72,
    hygieneDecay: 96,
    energyDecay: 72,
    funDecay: 48,
    adoptionCost: 66000
  },
  {
    id: 'le_shopez',
    name: 'Le Shopez',
    description: 'A sophisticated French shopping enthusiast.',
    emoji: '🛍️',
    rarity: 'rare',
    hungerDecay: 24,
    hygieneDecay: 12,
    energyDecay: 36,
    funDecay: 18,
    adoptionCost: 40000
  },
  {
    id: 'monkey',
    name: 'Monkey',
    description: 'A mischievous primate that swings from trees and causes chaos.',
    emoji: '🐒',
    rarity: 'common',
    hungerDecay: 12,
    hygieneDecay: 24,
    energyDecay: 18,
    funDecay: 12,
    adoptionCost: 9000
  },
  {
    id: 'obsessive',
    name: 'Obsessive',
    description: 'An extremely dedicated entity with an unhealthy fixation.',
    emoji: '😵',
    rarity: 'epic',
    hungerDecay: 24,
    hygieneDecay: 96,
    energyDecay: 12,
    funDecay: 6,
    adoptionCost: 55000
  }
];

export function getPetById(id: string): PetType | undefined {
  return AVAILABLE_PETS.find(pet => pet.id === id);
}

export function getPetsByRarity(rarity: PetType['rarity']): PetType[] {
  return AVAILABLE_PETS.filter(pet => pet.rarity === rarity);
}

export function calculateStatDecay(lastUpdate: Date | string, decayHours: number): number {
  // Handle both Date objects and date strings
  const date = lastUpdate instanceof Date ? lastUpdate : new Date(lastUpdate);
  const hoursElapsed = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  const decayAmount = Math.floor(hoursElapsed / decayHours);
  return Math.max(0, 100 - decayAmount);
}