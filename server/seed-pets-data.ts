import { storage } from './storage';
import { AVAILABLE_SITTERS, AVAILABLE_SKILLS } from '@shared/pets-2-data';

export async function seedPetsData() {
  console.log('Seeding pet sitters and skills data...');

  try {
    // Seed pet sitters
    const existingSitters = await storage.getAllPetSitters();
    console.log(`Found ${existingSitters.length} existing sitters`);

    for (const sitterData of AVAILABLE_SITTERS) {
      const exists = existingSitters.find(s => s.name === sitterData.name);
      if (!exists) {
        await storage.createPetSitter({
          name: sitterData.name,
          description: sitterData.description,
          abilities: sitterData.abilities,
          hourlyRate: sitterData.hourlyRate,
          isPremiumOnly: sitterData.isPremiumOnly
        });
        console.log(`Created pet sitter: ${sitterData.name}`);
      }
    }

    // Seed pet skills
    const existingSkills = await storage.getAllPetSkills();
    console.log(`Found ${existingSkills.length} existing skills`);

    for (const skillData of AVAILABLE_SKILLS) {
      const exists = existingSkills.find(s => s.name === skillData.name);
      if (!exists) {
        await storage.createPetSkill({
          name: skillData.name,
          description: skillData.description,
          effect: skillData.effect,
          trainingCost: skillData.trainingCost,
          category: skillData.category
        });
        console.log(`Created pet skill: ${skillData.name}`);
      }
    }

    console.log('Pet sitters and skills seeding completed!');
  } catch (error) {
    console.error('Error seeding pets data:', error);
  }
}