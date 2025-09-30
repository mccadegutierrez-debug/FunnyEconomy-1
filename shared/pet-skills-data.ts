import { InsertPetSkill } from "./schema";

export interface PetSkillData extends Omit<InsertPetSkill, 'id'> {
  skillId: string;
  name: string;
  description: string;
  effect: Record<string, any>;
  trainingCost: number;
  category: string;
}

export const AVAILABLE_SKILLS: PetSkillData[] = [
  {
    skillId: 'sturdy',
    name: 'Sturdy',
    description: "Your pet won't sleep after losing a fight. Ready for round two!",
    effect: {
      type: 'combat',
      preventSleepAfterLoss: true,
    },
    trainingCost: 5000,
    category: 'Combat',
  },
  {
    skillId: 'immunized',
    name: 'Immunized',
    description: 'Your pet recovers from sickness 75% faster. Strong immune system!',
    effect: {
      type: 'care',
      sicknessRecoveryMultiplier: 1.75,
    },
    trainingCost: 7500,
    category: 'Care',
  },
  {
    skillId: 'therapized',
    name: 'Therapized',
    description: "Your pet won't fight other pets. A peaceful companion!",
    effect: {
      type: 'combat',
      preventFighting: true,
    },
    trainingCost: 6000,
    category: 'Combat',
  },
  {
    skillId: 'trained',
    name: 'Trained',
    description: 'Your pet deals 25% more damage in fights. A fierce warrior!',
    effect: {
      type: 'combat',
      damageMultiplier: 1.25,
    },
    trainingCost: 10000,
    category: 'Combat',
  },
  {
    skillId: 'efficient',
    name: 'Efficient',
    description: 'Your pet stats decay 20% slower. Low maintenance!',
    effect: {
      type: 'care',
      decayReduction: 0.8,
    },
    trainingCost: 8000,
    category: 'Care',
  },
  {
    skillId: 'lucky',
    name: 'Lucky',
    description: 'Your pet gets 10% better rewards when hunting. Fortune favors the bold!',
    effect: {
      type: 'earning',
      huntRewardBonus: 1.10,
    },
    trainingCost: 12000,
    category: 'Earning',
  },
  {
    skillId: 'breeder',
    name: 'Breeder',
    description: 'Your pet has a 15% higher breeding success rate. Family matters!',
    effect: {
      type: 'breeding',
      breedingSuccessBonus: 1.15,
    },
    trainingCost: 15000,
    category: 'Breeding',
  },
  {
    skillId: 'hunter',
    name: 'Hunter',
    description: 'Your pet completes hunts 25% faster. Born to hunt!',
    effect: {
      type: 'earning',
      huntSpeedMultiplier: 0.75,
    },
    trainingCost: 10000,
    category: 'Earning',
  },
];

export function getSkillById(skillId: string): PetSkillData | undefined {
  return AVAILABLE_SKILLS.find(skill => skill.skillId === skillId);
}

export function getSkillsByCategory(category: string): PetSkillData[] {
  return AVAILABLE_SKILLS.filter(skill => skill.category === category);
}

export function getAllSkills(): PetSkillData[] {
  return AVAILABLE_SKILLS;
}
