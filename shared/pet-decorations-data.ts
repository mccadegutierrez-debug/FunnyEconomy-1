export interface DecorationBonus {
  type: 'hygiene' | 'fun' | 'energy' | 'hunger' | 'exp' | 'decay_reduction';
  value: number;
  description: string;
}

export interface DecorationData {
  id: string;
  name: string;
  type: "floor" | "wall";
  emoji: string;
  cost: number;
  description: string;
  bonuses: DecorationBonus[];
}

export const FLOOR_DECORATIONS: DecorationData[] = [
  {
    id: "rug-basic",
    name: "Basic Rug",
    type: "floor",
    emoji: "🟫",
    cost: 500,
    description: "A simple rug that adds comfort to the room",
    bonuses: [
      { type: 'hygiene', value: 2, description: '+2% hygiene gain' }
    ]
  },
  {
    id: "rug-fancy",
    name: "Fancy Rug",
    type: "floor",
    emoji: "🟥",
    cost: 1500,
    description: "A luxurious rug that makes pets feel pampered",
    bonuses: [
      { type: 'hygiene', value: 5, description: '+5% hygiene gain' },
      { type: 'fun', value: 3, description: '+3% fun gain' }
    ]
  },
  {
    id: "plant-small",
    name: "Small Plant",
    type: "floor",
    emoji: "🪴",
    cost: 750,
    description: "A decorative plant that freshens the air",
    bonuses: [
      { type: 'hygiene', value: 3, description: '+3% hygiene gain' },
      { type: 'decay_reduction', value: 2, description: '-2% decay rate' }
    ]
  },
  {
    id: "plant-large",
    name: "Large Plant",
    type: "floor",
    emoji: "🌿",
    cost: 2000,
    description: "A beautiful large plant that purifies the room",
    bonuses: [
      { type: 'hygiene', value: 6, description: '+6% hygiene gain' },
      { type: 'decay_reduction', value: 5, description: '-5% decay rate' },
      { type: 'energy', value: 3, description: '+3% energy gain' }
    ]
  },
  {
    id: "toy-box",
    name: "Toy Box",
    type: "floor",
    emoji: "🧸",
    cost: 1000,
    description: "Filled with toys to keep pets entertained",
    bonuses: [
      { type: 'fun', value: 8, description: '+8% fun gain' },
      { type: 'decay_reduction', value: 3, description: '-3% fun decay' }
    ]
  },
  {
    id: "food-bowl",
    name: "Food Bowl",
    type: "floor",
    emoji: "🍲",
    cost: 500,
    description: "Always ready for feeding time",
    bonuses: [
      { type: 'hunger', value: 5, description: '+5% hunger satisfaction' }
    ]
  },
  {
    id: "water-bowl",
    name: "Water Bowl",
    type: "floor",
    emoji: "💧",
    cost: 500,
    description: "Fresh water for hydration",
    bonuses: [
      { type: 'hunger', value: 3, description: '+3% hunger satisfaction' },
      { type: 'hygiene', value: 2, description: '+2% hygiene gain' }
    ]
  },
  {
    id: "pet-bed",
    name: "Pet Bed",
    type: "floor",
    emoji: "🛏️",
    cost: 1200,
    description: "A cozy bed for restful sleep",
    bonuses: [
      { type: 'energy', value: 10, description: '+10% energy recovery' },
      { type: 'decay_reduction', value: 4, description: '-4% energy decay' }
    ]
  },
  {
    id: "scratching-post",
    name: "Scratching Post",
    type: "floor",
    emoji: "🪵",
    cost: 800,
    description: "Perfect for sharpening claws and exercise",
    bonuses: [
      { type: 'fun', value: 5, description: '+5% fun gain' },
      { type: 'hygiene', value: 3, description: '+3% hygiene gain' }
    ]
  },
  {
    id: "ball",
    name: "Ball",
    type: "floor",
    emoji: "⚽",
    cost: 300,
    description: "Simple toy for active play",
    bonuses: [
      { type: 'fun', value: 4, description: '+4% fun gain' }
    ]
  },
  {
    id: "lamp",
    name: "Floor Lamp",
    type: "floor",
    emoji: "💡",
    cost: 1500,
    description: "Provides warm, comforting light",
    bonuses: [
      { type: 'energy', value: 4, description: '+4% energy gain' },
      { type: 'fun', value: 2, description: '+2% fun gain' }
    ]
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    type: "floor",
    emoji: "📚",
    cost: 2500,
    description: "Adds sophistication and training opportunities",
    bonuses: [
      { type: 'exp', value: 8, description: '+8% exp gain' },
      { type: 'fun', value: 3, description: '+3% fun gain' }
    ]
  },
];

export const WALL_DECORATIONS: DecorationData[] = [
  {
    id: "picture-frame",
    name: "Picture Frame",
    type: "wall",
    emoji: "🖼️",
    cost: 800,
    description: "Beautiful artwork to admire",
    bonuses: [
      { type: 'fun', value: 4, description: '+4% fun gain' }
    ]
  },
  {
    id: "clock",
    name: "Wall Clock",
    type: "wall",
    emoji: "🕐",
    cost: 600,
    description: "Helps maintain a routine schedule",
    bonuses: [
      { type: 'decay_reduction', value: 3, description: '-3% decay rate' }
    ]
  },
  {
    id: "mirror",
    name: "Mirror",
    type: "wall",
    emoji: "🪞",
    cost: 1000,
    description: "Makes the room feel more spacious",
    bonuses: [
      { type: 'hygiene', value: 5, description: '+5% hygiene gain' },
      { type: 'fun', value: 3, description: '+3% fun gain' }
    ]
  },
  {
    id: "shelf",
    name: "Wall Shelf",
    type: "wall",
    emoji: "📋",
    cost: 700,
    description: "Storage and display space",
    bonuses: [
      { type: 'fun', value: 2, description: '+2% fun gain' },
      { type: 'exp', value: 3, description: '+3% exp gain' }
    ]
  },
  {
    id: "poster-cat",
    name: "Cat Poster",
    type: "wall",
    emoji: "🐱",
    cost: 400,
    description: "Motivational cat poster",
    bonuses: [
      { type: 'fun', value: 3, description: '+3% fun gain' }
    ]
  },
  {
    id: "poster-dog",
    name: "Dog Poster",
    type: "wall",
    emoji: "🐕",
    cost: 400,
    description: "Inspirational dog poster",
    bonuses: [
      { type: 'fun', value: 3, description: '+3% fun gain' }
    ]
  },
  {
    id: "banner",
    name: "Decorative Banner",
    type: "wall",
    emoji: "🏴",
    cost: 900,
    description: "Festive decoration that lifts spirits",
    bonuses: [
      { type: 'fun', value: 5, description: '+5% fun gain' },
      { type: 'energy', value: 2, description: '+2% energy gain' }
    ]
  },
  {
    id: "wall-art",
    name: "Abstract Wall Art",
    type: "wall",
    emoji: "🎨",
    cost: 1500,
    description: "Sophisticated art piece",
    bonuses: [
      { type: 'fun', value: 6, description: '+6% fun gain' },
      { type: 'exp', value: 4, description: '+4% exp gain' }
    ]
  },
  {
    id: "trophy",
    name: "Trophy",
    type: "wall",
    emoji: "🏆",
    cost: 2000,
    description: "A symbol of achievement and pride",
    bonuses: [
      { type: 'exp', value: 10, description: '+10% exp gain' },
      { type: 'fun', value: 5, description: '+5% fun gain' }
    ]
  },
  {
    id: "calendar",
    name: "Calendar",
    type: "wall",
    emoji: "📅",
    cost: 300,
    description: "Helps track time and events",
    bonuses: [
      { type: 'decay_reduction', value: 2, description: '-2% decay rate' }
    ]
  },
];

export interface StyleBonus {
  type: 'hygiene' | 'fun' | 'energy' | 'hunger' | 'exp' | 'decay_reduction';
  value: number;
  description: string;
}

export interface RoomStyle {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  bonuses: StyleBonus[];
}

export const FLOOR_STYLES: RoomStyle[] = [
  { 
    id: "wooden", 
    name: "Wooden Floor", 
    emoji: "🟫", 
    cost: 0,
    description: "Classic wooden flooring",
    bonuses: []
  },
  { 
    id: "carpet", 
    name: "Carpet Floor", 
    emoji: "🟥", 
    cost: 2000,
    description: "Soft and comfortable carpet",
    bonuses: [
      { type: 'energy', value: 5, description: '+5% energy recovery' },
      { type: 'hygiene', value: 3, description: '+3% hygiene gain' }
    ]
  },
  { 
    id: "tile", 
    name: "Tile Floor", 
    emoji: "⬜", 
    cost: 1500,
    description: "Easy to clean tile flooring",
    bonuses: [
      { type: 'hygiene', value: 8, description: '+8% hygiene gain' }
    ]
  },
  { 
    id: "marble", 
    name: "Marble Floor", 
    emoji: "⬛", 
    cost: 3000,
    description: "Luxurious marble flooring",
    bonuses: [
      { type: 'hygiene', value: 10, description: '+10% hygiene gain' },
      { type: 'fun', value: 5, description: '+5% fun gain' },
      { type: 'exp', value: 3, description: '+3% exp gain' }
    ]
  },
  { 
    id: "grass", 
    name: "Grass Floor", 
    emoji: "🟩", 
    cost: 2500,
    description: "Natural grass for outdoor feel",
    bonuses: [
      { type: 'fun', value: 8, description: '+8% fun gain' },
      { type: 'energy', value: 5, description: '+5% energy gain' }
    ]
  },
];

export const WALL_STYLES: RoomStyle[] = [
  { 
    id: "plain", 
    name: "Plain Walls", 
    emoji: "⬜", 
    cost: 0,
    description: "Simple white walls",
    bonuses: []
  },
  { 
    id: "brick", 
    name: "Brick Walls", 
    emoji: "🧱", 
    cost: 1500,
    description: "Rustic brick walls",
    bonuses: [
      { type: 'decay_reduction', value: 4, description: '-4% decay rate' }
    ]
  },
  { 
    id: "wallpaper", 
    name: "Wallpaper", 
    emoji: "🎨", 
    cost: 2000,
    description: "Colorful decorative wallpaper",
    bonuses: [
      { type: 'fun', value: 6, description: '+6% fun gain' },
      { type: 'energy', value: 3, description: '+3% energy gain' }
    ]
  },
  { 
    id: "wood-panel", 
    name: "Wood Panel Walls", 
    emoji: "🟫", 
    cost: 2500,
    description: "Warm wooden paneling",
    bonuses: [
      { type: 'energy', value: 5, description: '+5% energy gain' },
      { type: 'decay_reduction', value: 3, description: '-3% decay rate' }
    ]
  },
  { 
    id: "stone", 
    name: "Stone Walls", 
    emoji: "🪨", 
    cost: 3000,
    description: "Sturdy stone walls",
    bonuses: [
      { type: 'decay_reduction', value: 7, description: '-7% decay rate' },
      { type: 'hygiene', value: 4, description: '+4% hygiene gain' }
    ]
  },
];

export function getDecorationById(id: string): DecorationData | undefined {
  return [...FLOOR_DECORATIONS, ...WALL_DECORATIONS].find(
    (dec) => dec.id === id,
  );
}

export function getDecorationsByType(type: "floor" | "wall"): DecorationData[] {
  if (type === "floor") {
    return FLOOR_DECORATIONS;
  }
  return WALL_DECORATIONS;
}

export function getFloorStyleById(id: string): RoomStyle | undefined {
  return FLOOR_STYLES.find((style) => style.id === id);
}

export function getWallStyleById(id: string): RoomStyle | undefined {
  return WALL_STYLES.find((style) => style.id === id);
}

export function calculateRoomBonuses(
  floorStyle: string,
  wallStyle: string,
  floorDecorations: string[],
  wallDecorations: string[]
): Map<string, number> {
  const bonuses = new Map<string, number>();
  
  const floorStyleData = getFloorStyleById(floorStyle);
  const wallStyleData = getWallStyleById(wallStyle);
  
  const allDecorations = [
    ...floorDecorations.map(id => getDecorationById(id)),
    ...wallDecorations.map(id => getDecorationById(id))
  ].filter((d): d is DecorationData => d !== undefined);
  
  const allBonuses = [
    ...(floorStyleData?.bonuses || []),
    ...(wallStyleData?.bonuses || []),
    ...allDecorations.flatMap(d => d.bonuses)
  ];
  
  for (const bonus of allBonuses) {
    const current = bonuses.get(bonus.type) || 0;
    bonuses.set(bonus.type, current + bonus.value);
  }
  
  return bonuses;
}
