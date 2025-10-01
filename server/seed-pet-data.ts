import { db } from "./db";
import { petTypes, petSkills, petSitters } from "@shared/schema";
import { STATIC_PET_TYPES } from "@shared/pet-types-data";
import { AVAILABLE_SKILLS } from "@shared/pet-skills-data";
import { AVAILABLE_SITTERS } from "@shared/pet-sitters-data";
import { sql } from "drizzle-orm";

export async function seedPetData(): Promise<void> {
  try {
    const existingPetTypes = await db.select().from(petTypes);
    const existingPetSkills = await db.select().from(petSkills);
    const existingPetSitters = await db.select().from(petSitters);

    let seededCount = 0;

    const existingPetIds = new Set(existingPetTypes.map(p => p.petId));
    const missingPetTypes = STATIC_PET_TYPES.filter(p => !existingPetIds.has(p.petId));
    
    if (missingPetTypes.length > 0) {
      console.log(`Seeding ${missingPetTypes.length} missing pet types...`);
      for (const petType of missingPetTypes) {
        await db.insert(petTypes).values({
          petId: petType.petId,
          name: petType.name,
          description: petType.description,
          emoji: petType.emoji,
          rarity: petType.rarity,
          hungerDecay: petType.hungerDecay,
          hygieneDecay: petType.hygieneDecay,
          energyDecay: petType.energyDecay,
          funDecay: petType.funDecay,
          adoptionCost: petType.adoptionCost,
          isCustom: petType.isCustom,
        });
        seededCount++;
      }
      console.log(`Seeded ${missingPetTypes.length} pet types`);
    }

    if (existingPetSkills.length === 0) {
      console.log("Seeding pet skills...");
      for (const skill of AVAILABLE_SKILLS) {
        await db.insert(petSkills).values({
          skillId: skill.skillId,
          name: skill.name,
          description: skill.description,
          effect: skill.effect,
          trainingCost: skill.trainingCost,
          category: skill.category,
        });
        seededCount++;
      }
      console.log(`Seeded ${AVAILABLE_SKILLS.length} pet skills`);
    }

    if (existingPetSitters.length === 0) {
      console.log("Seeding pet sitters...");
      for (const sitter of AVAILABLE_SITTERS) {
        await db.insert(petSitters).values({
          sitterId: sitter.sitterId,
          name: sitter.name,
          description: sitter.description,
          abilities: sitter.abilities,
          hourlyRate: sitter.hourlyRate,
          isPremiumOnly: sitter.isPremiumOnly,
        });
        seededCount++;
      }
      console.log(`Seeded ${AVAILABLE_SITTERS.length} pet sitters`);
    }

    if (seededCount > 0) {
      console.log(
        `Pet data seeding complete: ${seededCount} total items seeded`,
      );
    }
  } catch (error) {
    console.error("Error seeding pet data:", error);
    throw error;
  }
}
