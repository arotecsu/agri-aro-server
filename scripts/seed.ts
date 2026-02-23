import mongoose from "mongoose";
import { cropsData, soilData, devicesData } from "./data/seedData";

// Registrar todos os modelos
import { Crop, Soil, Device, SoilCrop } from "../src/database/models";

const MONGODB_URI =
  process.env.DATABASE_URL || "mongodb://localhost:27017/agri-aro";

async function seedCrops() {
  console.log("🌱 Seeding crops...");
  try {
    await Crop.deleteMany({});

    const inserted = await Crop.insertMany(cropsData);
    console.log(`✅ ${inserted.length} crops inserted`);
    inserted.forEach((crop) => {
      console.log(`   - ${crop.name}`);
    });
    return inserted;
  } catch (error) {
    console.error("❌ Error inserting crops:", error);
    throw error;
  }
}

async function seedSoils() {
  console.log("\n🌍 Seeding soils...");
  try {
    await Soil.deleteMany({});

    const inserted = await Soil.insertMany(soilData);
    console.log(`✅ ${inserted.length} soils inserted`);
    inserted.forEach((soil) => {
      console.log(`   - ${soil.name}`);
    });
    return inserted;
  } catch (error) {
    console.error("❌ Error inserting soils:", error);
    throw error;
  }
}

async function seedSoilCrop() {
  console.log("\n🔗 Seeding soil-crop combinations...");
  try {
    await SoilCrop.deleteMany({});

    const crops = await Crop.find();
    const soils = await Soil.find();

    const soilCropData: any[] = [];

    // For each soil
    soils.forEach((soil) => {
      const soilDoc = soilData.find((s) => s.name === soil.name);

      if (!soilDoc) {
        console.warn(`⚠️ No soil data found for soil: ${soil.name}`);
        return;
      }

      // For each crop
      crops.forEach((cropInDb) => {
        const cropDoc = cropsData.find((c) => c.name === cropInDb.name);

        if (!cropDoc) {
          console.warn(`⚠️ No crop data found for crop: ${cropInDb.name}`);
          return;
        }

        // Get specific specifications for this crop in this soil type
        const specs = (cropDoc.specifications as any)[soil.name];

        if (!specs) {
          console.warn(
            `⚠️ No specifications for ${cropInDb.name} in ${soil.name} soil`,
          );
          return;
        }

        soilCropData.push({
          soil: soil._id,
          crop: cropInDb._id,
          parameters: [
            {
              key: "temperature",
              minValue: specs.temperature.min,
              maxValue: specs.temperature.max,
            },
            {
              key: "soilMoisture",
              minValue: specs.soilMoisture.min,
              maxValue: specs.soilMoisture.max,
            },
            {
              key: "ambientMoisture",
              minValue: specs.ambientMoisture.min,
              maxValue: specs.ambientMoisture.max,
            },
            {
              key: "ph",
              minValue: specs.ph.min,
              maxValue: specs.ph.max,
            },
            {
              key: "nitrogen",
              minValue: specs.nitrogen.min,
              maxValue: specs.nitrogen.max,
            },
            {
              key: "phosphorus",
              minValue: specs.phosphorus.min,
              maxValue: specs.phosphorus.max,
            },
            {
              key: "potassium",
              minValue: specs.potassium.min,
              maxValue: specs.potassium.max,
            },
          ],
          isRecommended: true,
        });
      });
    });

    const inserted = await SoilCrop.insertMany(soilCropData);
    console.log(`✅ ${inserted.length} soil-crop combinations inserted`);
  } catch (error) {
    console.error("❌ Error inserting combinations:", error);
    throw error;
  }
}

async function seedDevices() {
  console.log("\n📱 Seeding devices...");
  try {
    await Device.deleteMany({});

    const inserted = await Device.insertMany(devicesData);
    console.log(`✅ ${inserted.length} devices inserted`);
    inserted.forEach((device) => {
      console.log(`   - ${device.deviceName} (${device.serieId})`);
    });
    return inserted;
  } catch (error) {
    console.error("❌ Error inserting devices:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting database seed...\n");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Run seeds
    await seedCrops();
    await seedSoils();
    await seedSoilCrop();
    await seedDevices();

    console.log("\n✅ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during seed:", error);
    process.exit(1);
  }
}

main();
