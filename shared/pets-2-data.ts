// Pet Sitters data based on Dank Memer Pets 2.0
export interface PetSitterData {
  id: string;
  name: string;
  description: string;
  abilities: string[];
  hourlyRate: number;
  isPremiumOnly: boolean;
}

export const AVAILABLE_SITTERS: PetSitterData[] = [
  {
    id: 'winston',
    name: 'Winston',
    description: 'A energetic trainer who pushes pets to their limits.',
    abilities: [
      'Pets gain extra XP from all activities',
      'Pets fight more frequently and with pets they don\'t normally fight with',
      'Increases pet activity overall'
    ],
    hourlyRate: 50,
    isPremiumOnly: false
  },
  {
    id: 'tatiana',
    name: 'Tatiana',
    description: 'A gentle caretaker focused on breeding and peace.',
    abilities: [
      'Pets will not fight each other',
      'Increased chance of successful breeding',
      'Pets won\'t fetch items but focus on social activities'
    ],
    hourlyRate: 75,
    isPremiumOnly: false
  },
  {
    id: 'martha',
    name: 'Martha',
    description: 'Premium elite caretaker with balanced approach.',
    abilities: [
      'Slightly increases all pet activities',
      'Balanced care with no negative effects',
      'Premium exclusive service'
    ],
    hourlyRate: 100,
    isPremiumOnly: true
  }
];

// Pet Skills data based on Dank Memer Pets 2.0
export interface PetSkillData {
  id: string;
  name: string;
  description: string;
  effect: {
    type: string;
    value: number;
    description: string;
  };
  trainingCost: number;
  category: 'combat' | 'care' | 'breeding' | 'earning';
}

export const AVAILABLE_SKILLS: PetSkillData[] = [
  {
    id: 'sturdy',
    name: 'Sturdy',
    description: 'Pet won\'t sleep after losing a fight',
    effect: { type: 'no_sleep_after_loss', value: 1, description: 'Stays awake after losing fights' },
    trainingCost: 5000,
    category: 'combat'
  },
  {
    id: 'immunized',
    name: 'Immunized',
    description: 'Recovers from sickness 75% faster',
    effect: { type: 'sickness_recovery', value: 0.75, description: '75% faster recovery from illness' },
    trainingCost: 7500,
    category: 'care'
  },
  {
    id: 'therapized',
    name: 'Therapized',
    description: 'Will no longer fight other pets in the room',
    effect: { type: 'no_fighting', value: 1, description: 'Peaceful, won\'t start fights' },
    trainingCost: 6000,
    category: 'combat'
  },
  {
    id: 'loving',
    name: 'Loving',
    description: 'Increases the chance to breed by 20%',
    effect: { type: 'breeding_bonus', value: 0.2, description: '+20% breeding success rate' },
    trainingCost: 8000,
    category: 'breeding'
  },
  {
    id: 'impatient',
    name: 'Impatient',
    description: 'Increases chance to breed or end relationship by 33%',
    effect: { type: 'relationship_speed', value: 0.33, description: '+33% relationship change rate' },
    trainingCost: 4000,
    category: 'breeding'
  },
  {
    id: 'grindy',
    name: 'Grindy',
    description: 'Earns 5% more pet XP from all sources',
    effect: { type: 'xp_bonus', value: 0.05, description: '+5% XP from all activities' },
    trainingCost: 10000,
    category: 'earning'
  },
  {
    id: 'insomniac',
    name: 'Insomniac',
    description: 'Won\'t sleep, except after losing fights',
    effect: { type: 'no_sleep', value: 1, description: 'Never needs sleep (except after losses)' },
    trainingCost: 6500,
    category: 'care'
  },
  {
    id: 'lucky',
    name: 'Lucky',
    description: '5% chance to double fetch or hunt rewards',
    effect: { type: 'double_rewards', value: 0.05, description: '5% chance to double hunt/fetch rewards' },
    trainingCost: 12000,
    category: 'earning'
  },
  {
    id: 'socially_distanced',
    name: 'Socially Distanced',
    description: 'Won\'t spread disease to other pets',
    effect: { type: 'no_disease_spread', value: 1, description: 'Cannot spread sickness to roommates' },
    trainingCost: 5500,
    category: 'care'
  },
  {
    id: 'budgeting',
    name: 'Budgeting',
    description: 'Care costs reduced by 50%',
    effect: { type: 'cost_reduction', value: 0.5, description: '50% less coins for care actions' },
    trainingCost: 9000,
    category: 'care'
  },
  {
    id: 'eunuch',
    name: 'Eunuch',
    description: 'Won\'t breed with other pets',
    effect: { type: 'no_breeding', value: 1, description: 'Cannot participate in breeding' },
    trainingCost: 3000,
    category: 'breeding'
  }
];

// Room Decoration data
export interface DecorationData {
  id: string;
  name: string;
  type: 'floor' | 'wall' | 'floor_style' | 'wall_style' | 'door' | 'window';
  cost: number;
  currency: 'coins' | 'gems';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  unlockRequirement?: string;
}

export const AVAILABLE_DECORATIONS: DecorationData[] = [
  // Floor Styles
  { id: 'wooden', name: 'Wooden Floor', type: 'floor_style', cost: 0, currency: 'coins', rarity: 'common', description: 'Classic wooden flooring' },
  { id: 'marble', name: 'Marble Floor', type: 'floor_style', cost: 15000, currency: 'coins', rarity: 'uncommon', description: 'Elegant marble flooring' },
  { id: 'carpet', name: 'Carpet Floor', type: 'floor_style', cost: 8000, currency: 'coins', rarity: 'common', description: 'Soft carpeted flooring' },
  
  // Wall Styles  
  { id: 'plain', name: 'Plain Walls', type: 'wall_style', cost: 0, currency: 'coins', rarity: 'common', description: 'Simple painted walls' },
  { id: 'brick', name: 'Brick Walls', type: 'wall_style', cost: 12000, currency: 'coins', rarity: 'uncommon', description: 'Rustic brick walls' },
  { id: 'wallpaper', name: 'Floral Wallpaper', type: 'wall_style', cost: 20000, currency: 'coins', rarity: 'rare', description: 'Decorative floral wallpaper' },
  
  // Floor Decorations (max 4 per room)
  { id: 'pet_bed', name: 'Pet Bed', type: 'floor', cost: 2500, currency: 'coins', rarity: 'common', description: 'Comfortable bed for pets' },
  { id: 'toy_box', name: 'Toy Box', type: 'floor', cost: 3000, currency: 'coins', rarity: 'common', description: 'Storage for pet toys' },
  { id: 'food_bowl', name: 'Food Bowl', type: 'floor', cost: 1500, currency: 'coins', rarity: 'common', description: 'Premium food bowl' },
  { id: 'scratching_post', name: 'Scratching Post', type: 'floor', cost: 4000, currency: 'coins', rarity: 'uncommon', description: 'For pets who need to scratch' },
  
  // Wall Decorations (max 6 per room)
  { id: 'pet_portrait', name: 'Pet Portrait', type: 'wall', cost: 5000, currency: 'coins', rarity: 'uncommon', description: 'Framed portrait of a cute pet' },
  { id: 'shelf', name: 'Wall Shelf', type: 'wall', cost: 3500, currency: 'coins', rarity: 'common', description: 'Storage shelf for pet supplies' },
  { id: 'mirror', name: 'Mirror', type: 'wall', cost: 6000, currency: 'coins', rarity: 'uncommon', description: 'Reflective mirror for pets to admire themselves' },
  
  // Doors
  { id: 'wooden_door', name: 'Wooden Door', type: 'door', cost: 0, currency: 'coins', rarity: 'common', description: 'Standard wooden door' },
  { id: 'fancy_door', name: 'Fancy Door', type: 'door', cost: 10000, currency: 'coins', rarity: 'uncommon', description: 'Ornate decorative door' },
  
  // Windows
  { id: 'basic_window', name: 'Basic Window', type: 'window', cost: 0, currency: 'coins', rarity: 'common', description: 'Simple glass window' },
  { id: 'bay_window', name: 'Bay Window', type: 'window', cost: 8000, currency: 'coins', rarity: 'uncommon', description: 'Large bay window with view' }
];

// Helper functions
export function getSitterById(sitterId: string): PetSitterData | undefined {
  return AVAILABLE_SITTERS.find(sitter => sitter.id === sitterId);
}

export function getSkillById(skillId: string): PetSkillData | undefined {
  return AVAILABLE_SKILLS.find(skill => skill.id === skillId);
}

export function getDecorationById(decorationId: string): DecorationData | undefined {
  return AVAILABLE_DECORATIONS.find(decoration => decoration.id === decorationId);
}

export function getSkillsByCategory(category: string): PetSkillData[] {
  return AVAILABLE_SKILLS.filter(skill => skill.category === category);
}

export function getDecorationsByType(type: string): DecorationData[] {
  return AVAILABLE_DECORATIONS.filter(decoration => decoration.type === type);
}