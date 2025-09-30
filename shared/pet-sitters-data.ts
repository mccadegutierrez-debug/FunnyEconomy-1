import { InsertPetSitter } from "./schema";

export interface PetSitterData extends Omit<InsertPetSitter, 'id'> {
  sitterId: string;
  name: string;
  description: string;
  abilities: string[];
  hourlyRate: number;
  isPremiumOnly: boolean;
}

export const AVAILABLE_SITTERS: PetSitterData[] = [
  {
    sitterId: 'winston',
    name: 'Winston',
    description: 'An energetic trainer who keeps your pet active and learning.',
    abilities: [
      'Boosts XP gain by 15%',
      'Increases activity and energy',
      'Plays with your pet regularly',
    ],
    hourlyRate: 50,
    isPremiumOnly: false,
  },
  {
    sitterId: 'tatiana',
    name: 'Tatiana',
    description: 'A gentle caretaker who specializes in breeding and peaceful care.',
    abilities: [
      'Prevents pets from fighting',
      '10% breeding success bonus',
      'Maintains high hygiene levels',
    ],
    hourlyRate: 75,
    isPremiumOnly: false,
  },
  {
    sitterId: 'martha',
    name: 'Martha',
    description: 'Elite balanced care provider who excels at everything.',
    abilities: [
      'Slight boost to all stats',
      'Balanced care across all needs',
      'Premium quality service',
      '5% XP bonus',
    ],
    hourlyRate: 100,
    isPremiumOnly: true,
  },
];

export function getSitterById(sitterId: string): PetSitterData | undefined {
  return AVAILABLE_SITTERS.find(sitter => sitter.sitterId === sitterId);
}

export function getAvailableSitters(hasPremium: boolean): PetSitterData[] {
  if (hasPremium) {
    return AVAILABLE_SITTERS;
  }
  return AVAILABLE_SITTERS.filter(sitter => !sitter.isPremiumOnly);
}

export function getAllSitters(): PetSitterData[] {
  return AVAILABLE_SITTERS;
}
