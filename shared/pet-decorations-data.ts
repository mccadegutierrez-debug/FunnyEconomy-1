export interface DecorationData {
  id: string;
  name: string;
  type: 'floor' | 'wall';
  emoji: string;
  cost: number;
}

export const FLOOR_DECORATIONS: DecorationData[] = [
  {
    id: 'rug-basic',
    name: 'Basic Rug',
    type: 'floor',
    emoji: '🟫',
    cost: 500,
  },
  {
    id: 'rug-fancy',
    name: 'Fancy Rug',
    type: 'floor',
    emoji: '🟥',
    cost: 1500,
  },
  {
    id: 'plant-small',
    name: 'Small Plant',
    type: 'floor',
    emoji: '🪴',
    cost: 750,
  },
  {
    id: 'plant-large',
    name: 'Large Plant',
    type: 'floor',
    emoji: '🌿',
    cost: 2000,
  },
  {
    id: 'toy-box',
    name: 'Toy Box',
    type: 'floor',
    emoji: '🧸',
    cost: 1000,
  },
  {
    id: 'food-bowl',
    name: 'Food Bowl',
    type: 'floor',
    emoji: '🍲',
    cost: 500,
  },
  {
    id: 'water-bowl',
    name: 'Water Bowl',
    type: 'floor',
    emoji: '💧',
    cost: 500,
  },
  {
    id: 'pet-bed',
    name: 'Pet Bed',
    type: 'floor',
    emoji: '🛏️',
    cost: 1200,
  },
  {
    id: 'scratching-post',
    name: 'Scratching Post',
    type: 'floor',
    emoji: '🪵',
    cost: 800,
  },
  {
    id: 'ball',
    name: 'Ball',
    type: 'floor',
    emoji: '⚽',
    cost: 300,
  },
  {
    id: 'lamp',
    name: 'Floor Lamp',
    type: 'floor',
    emoji: '💡',
    cost: 1500,
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    type: 'floor',
    emoji: '📚',
    cost: 2500,
  },
];

export const WALL_DECORATIONS: DecorationData[] = [
  {
    id: 'picture-frame',
    name: 'Picture Frame',
    type: 'wall',
    emoji: '🖼️',
    cost: 800,
  },
  {
    id: 'clock',
    name: 'Wall Clock',
    type: 'wall',
    emoji: '🕐',
    cost: 600,
  },
  {
    id: 'mirror',
    name: 'Mirror',
    type: 'wall',
    emoji: '🪞',
    cost: 1000,
  },
  {
    id: 'shelf',
    name: 'Wall Shelf',
    type: 'wall',
    emoji: '📋',
    cost: 700,
  },
  {
    id: 'poster-cat',
    name: 'Cat Poster',
    type: 'wall',
    emoji: '🐱',
    cost: 400,
  },
  {
    id: 'poster-dog',
    name: 'Dog Poster',
    type: 'wall',
    emoji: '🐕',
    cost: 400,
  },
  {
    id: 'banner',
    name: 'Decorative Banner',
    type: 'wall',
    emoji: '🏴',
    cost: 900,
  },
  {
    id: 'wall-art',
    name: 'Abstract Wall Art',
    type: 'wall',
    emoji: '🎨',
    cost: 1500,
  },
  {
    id: 'trophy',
    name: 'Trophy',
    type: 'wall',
    emoji: '🏆',
    cost: 2000,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    type: 'wall',
    emoji: '📅',
    cost: 300,
  },
];

export const FLOOR_STYLES = [
  { id: 'wooden', name: 'Wooden Floor', emoji: '🟫', cost: 0 },
  { id: 'carpet', name: 'Carpet Floor', emoji: '🟥', cost: 2000 },
  { id: 'tile', name: 'Tile Floor', emoji: '⬜', cost: 1500 },
  { id: 'marble', name: 'Marble Floor', emoji: '⬛', cost: 3000 },
  { id: 'grass', name: 'Grass Floor', emoji: '🟩', cost: 2500 },
];

export const WALL_STYLES = [
  { id: 'plain', name: 'Plain Walls', emoji: '⬜', cost: 0 },
  { id: 'brick', name: 'Brick Walls', emoji: '🧱', cost: 1500 },
  { id: 'wallpaper', name: 'Wallpaper', emoji: '🎨', cost: 2000 },
  { id: 'wood-panel', name: 'Wood Panel Walls', emoji: '🟫', cost: 2500 },
  { id: 'stone', name: 'Stone Walls', emoji: '🪨', cost: 3000 },
];

export function getDecorationById(id: string): DecorationData | undefined {
  return [...FLOOR_DECORATIONS, ...WALL_DECORATIONS].find(dec => dec.id === id);
}

export function getDecorationsByType(type: 'floor' | 'wall'): DecorationData[] {
  if (type === 'floor') {
    return FLOOR_DECORATIONS;
  }
  return WALL_DECORATIONS;
}

export function getFloorStyleById(id: string) {
  return FLOOR_STYLES.find(style => style.id === id);
}

export function getWallStyleById(id: string) {
  return WALL_STYLES.find(style => style.id === id);
}
