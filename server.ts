import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Static Instant-Pick Items Catalog (Only used for exact/direct matches to instant pick items)
const STATIC_INSTANT_CATALOG: Record<string, any> = {
  'plastic bottle': {
    itemName: 'Plastic Water Bottle (PET #1)',
    category: 'Recyclable',
    subCategory: 'Polyethylene Terephthalate (PET #1)',
    material: 'Clear rigid thermoplastic polymer',
    upcyclingIdea: {
      title: 'Capillary Self-Watering Indoor Herb Planter',
      description: 'Cut horizontally, invert the neck with a cotton wick submerged in the base reservoir for an automated herb planter.',
      difficulty: 'Easy',
      timeMinutes: 15,
      steps: [
        'Rinse bottle and cut horizontally about 4 inches below the neck.',
        'Poke a 5mm hole in the cap and thread an 8-inch natural cotton yarn string through.',
        'Invert top funnel into the lower reservoir base.',
        'Fill reservoir with 1.5 inches of water, then pack potting soil and mint/basil seeds into the upper funnel.'
      ],
      toolsNeeded: ['Scissors or craft blade', 'Cotton twine or shoelace', 'Potting soil', 'Herb seeds']
    },
    disposalInstructions: {
      stepByStep: [
        'Empty all residual liquids and give it a quick rinse.',
        'Crush flat to conserve space in collection trucks.',
        'Screw cap back on (caps are recovered alongside bottle flakes).',
        'Place inside the Blue Dry Recyclables bin.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Keep dry. Do not place in organic or compost bins.'
    },
    environmentalImpact: {
      carbonSavedGrams: 120,
      ecoPoints: 40,
      funFact: 'Recycling 1 plastic bottle saves enough energy to power a 60W lightbulb for over 3 hours.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  },
  'coffee grounds': {
    itemName: 'Spent Coffee Grounds & Filter Paper',
    category: 'Organic',
    subCategory: 'Nitrogen-Rich Kitchen Waste',
    material: 'Organic Plant Residue',
    upcyclingIdea: {
      title: 'Exfoliating Garden Hand Scrub & Slug Barrier',
      description: 'Mix dry spent coffee grounds with virgin coconut oil for a zero-waste skin exfoliant, or ring around seedlings as an organic slug deterrent.',
      difficulty: 'Easy',
      timeMinutes: 10,
      steps: [
        'Spread wet coffee grounds on a baking tray to air-dry completely for 24 hours.',
        'Combine 1/2 cup dried grounds with 2 tbsp melted coconut oil and 1 tsp brown sugar.',
        'Store in an upcycled glass jam jar next to the garden sink.'
      ],
      toolsNeeded: ['Small mixing bowl', 'Glass jar with airtight lid', 'Coconut oil']
    },
    disposalInstructions: {
      stepByStep: [
        'Can be thrown directly into your home compost bin or vermiculture bin.',
        'Unbleached paper filters decompose readily within 2-4 weeks.',
        'If using municipal bins, place in Green Wet Waste.'
      ],
      binColor: 'Green (Wet/Compostable)',
      cautionNotes: 'Acts as a "Green" (high nitrogen, C:N ratio ~20:1) despite dark brown color.'
    },
    environmentalImpact: {
      carbonSavedGrams: 85,
      ecoPoints: 35,
      funFact: 'Coffee grounds add potassium, magnesium, and phosphorus directly into garden soil.'
    },
    isCompostable: true,
    compostType: 'Green'
  },
  'cardboard box': {
    itemName: 'Corrugated Cardboard Box',
    category: 'Recyclable',
    subCategory: 'Cellulose Fibers (Brown Carbon)',
    material: 'Corrugated Paperboard',
    upcyclingIdea: {
      title: 'Sheet Mulching "Lasagna" Weed Barrier',
      description: 'Flatten unprinted cardboard sheets over weed patches in garden beds to suppress weeds while breaking down into rich organic humus.',
      difficulty: 'Easy',
      timeMinutes: 20,
      steps: [
        'Peel away all plastic packing tape and shipping label stickers.',
        'Soak the cardboard sheets with a garden hose so they pliable and wet.',
        'Lay flat over weedy garden patches with 6-inch overlaps.',
        'Cover with 2 inches of composted mulch or wood chips.'
      ],
      toolsNeeded: ['Utility knife to remove tape', 'Water hose or bucket', 'Mulch or leaves']
    },
    disposalInstructions: {
      stepByStep: [
        'Remove all synthetic plastic tapes, bubble mailers, and styrofoam inserts.',
        'Break down and flatten boxes completely.',
        'Keep dry (wet cardboard clogs pulping machinery).',
        'Deposit in curbside paper recycling or local cardboard drop-off.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Greasy pizza box bottoms should go to compost; clean unsoiled lids can be recycled.'
    },
    environmentalImpact: {
      carbonSavedGrams: 210,
      ecoPoints: 45,
      funFact: 'Recycling 1 ton of cardboard saves 17 mature trees and 7,000 gallons of fresh water.'
    },
    isCompostable: true,
    compostType: 'Brown'
  },
  'glass jar': {
    itemName: 'Glass Food Preserve Jar',
    category: 'Recyclable',
    subCategory: 'Cullet Container Glass',
    material: 'Silica Soda-Lime Glass',
    upcyclingIdea: {
      title: 'Microgreen Sprouting Terrarium & Dry Pantry Organizer',
      description: 'Convert old pasta or jam jars into aesthetic zero-waste pantry storage or an inverted sprouting jar for healthy alfalfa/mung beans.',
      difficulty: 'Easy',
      timeMinutes: 15,
      steps: [
        'Soak jar in warm soapy water with 1 tbsp baking soda to strip adhesive labels cleanly.',
        'Dry thoroughly and label contents using waterproof chalk markers.',
        'For sprouting: replace lid with cheesecloth or fine mesh held with an elastic band.'
      ],
      toolsNeeded: ['Warm water', 'Baking soda or vinegar', 'Scrub brush']
    },
    disposalInstructions: {
      stepByStep: [
        'Scrape food remnants clean and rinse interior.',
        'Metal lids can be separated and recycled with scrap tin.',
        'Do not break; place intact in glass collection containers.',
        'Drop into Blue Glass Recycling Bin or local bottle bank.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Never mix tempered glass, Pyrex baking dishes, lightbulbs, or window panes with container bottle glass.'
    },
    environmentalImpact: {
      carbonSavedGrams: 310,
      ecoPoints: 50,
      funFact: 'Glass is 100% infinitely recyclable without any loss in purity or chemical strength.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  },
  'battery': {
    itemName: 'Alkaline or Lithium-Ion Household Battery',
    category: 'E-Waste',
    subCategory: 'Hazardous Electrochemical Waste',
    material: 'Heavy Metals (Zinc, Manganese, Lithium, Cobalt)',
    upcyclingIdea: {
      title: 'Safe Battery Storage Station & Terminal Taping',
      description: 'Used batteries cannot be safely dismantled at home due to chemical hazard, but organizing a safe home drop-box prevents accidental fires before recycling.',
      difficulty: 'Easy',
      timeMinutes: 5,
      steps: [
        'Apply transparent electrical or scotch tape over positive and negative terminal contacts.',
        'Place inside a designated non-conductive plastic container.',
        'Store in a cool, dry spot away from children and flammable materials.',
        'Drop off during your next community hazardous waste collection run.'
      ],
      toolsNeeded: ['Clear tape or electrical tape', 'Small sturdy plastic box']
    },
    disposalInstructions: {
      stepByStep: [
        'NEVER throw batteries into standard household trash or regular curbside recycling bins.',
        'Lithium-ion batteries cause severe compactor truck fires when crushed.',
        'Take to designated e-waste drop-off kiosks (e.g. hardware stores, city recycling depot).'
      ],
      binColor: 'Special Drop-off',
      cautionNotes: 'Extremely flammable when pierced or short-circuited. Tape terminals for 9V and lithium cells.'
    },
    environmentalImpact: {
      carbonSavedGrams: 450,
      ecoPoints: 75,
      funFact: 'Reclaimed battery metals like cobalt and nickel are recycled directly into new EV batteries.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  },
  'aluminum can': {
    itemName: 'Aluminum Beverage Can',
    category: 'Recyclable',
    subCategory: 'Non-Ferrous Sheet Aluminum',
    material: 'UBC Aluminum Alloy',
    upcyclingIdea: {
      title: 'Perforated Desk Pencil Caddy & Lantern',
      description: 'Freeze water inside to stiffen the cylinder, then punch decorative star-pattern holes for an atmospheric tea-light candle holder.',
      difficulty: 'Moderate',
      timeMinutes: 20,
      steps: [
        'Rinse beverage residue and peel off any plastic stickers.',
        'Fill with water and freeze solid overnight to keep walls rigid.',
        'Use hammer and nail to punch celestial dot constellations.',
        'Thaw, dry, and place battery tea light inside.'
      ],
      toolsNeeded: ['Clean hammer', 'Nail', 'Tea light']
    },
    disposalInstructions: {
      stepByStep: [
        'Rinse clean of sticky sugary drinks.',
        'Keep pop-tab attached to lid.',
        'Crush flat to save space in bin.',
        'Place into Blue Metal/Can recycling bin.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Aluminum is infinitely recyclable; recycled cans are back on shelves in 60 days.'
    },
    environmentalImpact: {
      carbonSavedGrams: 280,
      ecoPoints: 45,
      funFact: 'Recycling aluminum saves 95% of the energy needed to make new metal from bauxite ore.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  },
  'banana peels': {
    itemName: 'Banana & Fruit Peels',
    category: 'Organic',
    subCategory: 'Potassium-Rich Kitchen Waste',
    material: 'Biodegradable fruit cellulose',
    upcyclingIdea: {
      title: 'Houseplant Potassium Booster Tea',
      description: 'Soak peels in water for 48 hours to brew an organic liquid potassium fertilizer for indoor pothos and flowering plants.',
      difficulty: 'Easy',
      timeMinutes: 5,
      steps: [
        'Chop 2 banana peels into 1-inch strips.',
        'Place inside a 1-liter glass jar filled with tap water.',
        'Steep for 48 hours, strain liquid, and dilute 1:4 with fresh water for your plants.'
      ],
      toolsNeeded: ['Glass jar', 'Strainer', 'Water']
    },
    disposalInstructions: {
      stepByStep: [
        'Chop into smaller pieces to accelerate microbial breakdown.',
        'Add to home compost pile as a "Green" nitrogen/moisture source.',
        'Cover with dry brown leaves to prevent fruit flies.'
      ],
      binColor: 'Green (Wet/Compostable)',
      cautionNotes: 'Do not throw in plastic bags into organic bins.'
    },
    environmentalImpact: {
      carbonSavedGrams: 95,
      ecoPoints: 30,
      funFact: 'Food waste in landfills generates methane gas, but aerobic composting creates zero methane.'
    },
    isCompostable: true,
    compostType: 'Green'
  },
  'cotton t-shirt': {
    itemName: 'Worn Cotton T-Shirt or Fabric Rags',
    category: 'Recyclable',
    subCategory: 'Natural Plant Fiber Textile',
    material: '100% Cotton knit yarn',
    upcyclingIdea: {
      title: 'Braided Zero-Waste Kitchen Dish Scrubber',
      description: 'Cut worn-out tees into 1-inch ribbons (t-shirt yarn) and braid into durable, machine-washable pot scrubbers.',
      difficulty: 'Moderate',
      timeMinutes: 25,
      steps: [
        'Cut horizontal 1-inch strips across the t-shirt body.',
        'Pull strips lengthwise so edges curl inward into soft yarn.',
        'Braid three 30cm strands together and coil into a round disc.',
        'Stitch edge with needle and thread to form a reusable dish sponge.'
      ],
      toolsNeeded: ['Fabric scissors', 'Needle & thread']
    },
    disposalInstructions: {
      stepByStep: [
        'If still wearable: donate to charity clothing banks.',
        'If ripped or stained: take to textile recycling drop-off bin.',
        'Never place in curbside paper/plastic recycling (they wrap around sorting shafts).'
      ],
      binColor: 'Special Drop-off',
      cautionNotes: 'Pure cotton scraps can even be composted in small shredded pieces!'
    },
    environmentalImpact: {
      carbonSavedGrams: 380,
      ecoPoints: 60,
      funFact: 'Recycling 1kg of cotton saves 20,000 liters of water used in agricultural cultivation.'
    },
    isCompostable: true,
    compostType: 'Brown'
  }
};

// Check if search query matches one of the static instant-pick items
function getStaticItemMatch(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // Exact aliases for the 8 instant pick buttons
  if (q === 'plastic bottle' || q === 'plastic water bottle' || q === 'water bottle' || q === 'pet bottle') return STATIC_INSTANT_CATALOG['plastic bottle'];
  if (q === 'cardboard box' || q === 'cardboard' || q === 'corrugated box') return STATIC_INSTANT_CATALOG['cardboard box'];
  if (q === 'coffee grounds' || q === 'spent coffee grounds' || q === 'coffee') return STATIC_INSTANT_CATALOG['coffee grounds'];
  if (q === 'glass jar' || q === 'jam jar' || q === 'glass food jar') return STATIC_INSTANT_CATALOG['glass jar'];
  if (q === 'battery' || q === 'batteries' || q === 'alkaline battery') return STATIC_INSTANT_CATALOG['battery'];
  if (q === 'aluminum can' || q === 'tin can' || q === 'soda can') return STATIC_INSTANT_CATALOG['aluminum can'];
  if (q === 'banana peels' || q === 'banana peel' || q === 'fruit peels') return STATIC_INSTANT_CATALOG['banana peels'];
  if (q === 'cotton t-shirt' || q === 'cotton shirt' || q === 't-shirt' || q === 'tshirt') return STATIC_INSTANT_CATALOG['cotton t-shirt'];

  return null;
}

// Fallback dynamic generator if AI network call is unavailable or times out
function generateSmartFallback(query: string) {
  const q = query.toLowerCase();
  const titleName = query.charAt(0).toUpperCase() + query.slice(1);

  if (q.includes('chapati') || q.includes('roti') || q.includes('bread') || q.includes('food') || q.includes('rice') || q.includes('apple') || q.includes('vegetable')) {
    return {
      itemName: titleName,
      category: 'Organic',
      subCategory: 'Cooked Kitchen Food Scrap',
      material: 'Organic Grain / Wheat Biomass',
      upcyclingIdea: {
        title: `${titleName} Garden Nitrogen Compost Booster`,
        description: `Tear stale ${q} into small chunks and soak lightly in water before adding to compost to feed soil microbes and earthworms.`,
        difficulty: 'Easy',
        timeMinutes: 5,
        steps: [
          `Tear or chop ${q} into small 1-inch pieces.`,
          'Scatter evenly into the center core of your compost pile.',
          'Cover with 2 inches of dry brown leaves or cardboard to deter pests.',
          'Moisten slightly to activate aerobic digestion.'
        ],
        toolsNeeded: ['Kitchen knife or hands', 'Water', 'Dry leaves/shredded paper']
      },
      disposalInstructions: {
        stepByStep: [
          'Scrape into kitchen organic food scrap caddy.',
          'Do not mix with plastic wrappers.',
          'Deposit into Green Compost / Wet Waste bin.'
        ],
        binColor: 'Green (Wet/Compostable)',
        cautionNotes: 'Keep covered with carbon materials to avoid attracting fruit flies.'
      },
      environmentalImpact: {
        carbonSavedGrams: 75,
        ecoPoints: 30,
        funFact: 'Composting bread and grain scraps prevents methane emissions from landfill decay.'
      },
      isCompostable: true,
      compostType: 'Green'
    };
  }

  if (q.includes('gum') || q.includes('chewing')) {
    return {
      itemName: titleName,
      category: 'Non-Recyclable',
      subCategory: 'Synthetic Elastomer Polymer',
      material: 'Synthetic Gum Base (Polyisobutylene) & Resin',
      upcyclingIdea: {
        title: 'Proper Encapsulation & Litter Prevention',
        description: 'Chewing gum cannot be safely home-upcycled due to synthetic polymers, but proper wrapping prevents wildlife hazards.',
        difficulty: 'Easy',
        timeMinutes: 1,
        steps: [
          'Fold used gum into its original paper wrapper or scrap paper.',
          'Press edges firmly closed so it does not stick to surfaces.',
          'Discard into general domestic residual waste bin.'
        ],
        toolsNeeded: ['Scrap paper or wrapper']
      },
      disposalInstructions: {
        stepByStep: [
          'Wrap securely in waste paper or tissue.',
          'Place in Black/Grey Landfill Bin.',
          'NEVER spit onto pavement or discard into nature (takes over 50 years to degrade).'
        ],
        binColor: 'Black/Grey Bin (Landfill Residual)',
        cautionNotes: 'Contains synthetic polymers; strictly non-compostable and non-recyclable.'
      },
      environmentalImpact: {
        carbonSavedGrams: 20,
        ecoPoints: 15,
        funFact: 'Cities spend millions cleaning dropped gum; specialized industrial facilities now recycle gum into boot soles.'
      },
      isCompostable: false,
      compostType: 'Not recommended'
    };
  }

  if (q.includes('shoe') || q.includes('sneaker') || q.includes('boot')) {
    return {
      itemName: titleName,
      category: 'Non-Recyclable',
      subCategory: 'Composite Footwear (Rubber, Foam, Textiles)',
      material: 'Vulcanized Rubber, EVA Foam, Synthetic Leather',
      upcyclingIdea: {
        title: 'Whimsical Outdoor Garden Boot Planter',
        description: 'Repurpose worn-out shoes into quirky weather-resistant planters for hardy succulents or trailing ivy.',
        difficulty: 'Easy',
        timeMinutes: 20,
        steps: [
          'Drill or poke 3 small drainage holes in the bottom rubber sole.',
          'Fill the toe and heel cavity with potting soil mixed with compost.',
          'Plant small hardy succulents like sedum or jade.',
          'Place on garden steps or porch for a charming zero-waste accent.'
        ],
        toolsNeeded: ['Drill or awl', 'Potting mix', 'Succulent cuttings']
      },
      disposalInstructions: {
        stepByStep: [
          'If gently used: clean and donate to charity thrifts.',
          'If completely worn: check for athletic shoe recycling drop-offs (e.g. Nike Reuse-A-Shoe).',
          'If no drop-off exists, place in general residual bin.'
        ],
        binColor: 'Special Drop-off (Shoe Reclamation)',
        cautionNotes: 'Shoes contain bonded mixed glues and cannot go into curbside bins.'
      },
      environmentalImpact: {
        carbonSavedGrams: 650,
        ecoPoints: 60,
        funFact: 'Recycled rubber shoe soles are granulated into cushioned playground surfaces and running tracks.'
      },
      isCompostable: false,
      compostType: 'Not recommended'
    };
  }

  // General intelligent fallback
  return {
    itemName: titleName,
    category: 'Recyclable',
    subCategory: 'Consumer Household Item',
    material: 'Mixed Material',
    upcyclingIdea: {
      title: `Creative Repurposing for ${titleName}`,
      description: `Clean and inspect ${q} to see if components can be reused for home organization or craft projects.`,
      difficulty: 'Easy',
      timeMinutes: 15,
      steps: [
        'Inspect item for reusable parts, fasteners, or containers.',
        'Clean surfaces thoroughly with warm soapy water.',
        'Repurpose into utility storage or decorative accent.'
      ],
      toolsNeeded: ['Cleaning cloth', 'Scissors']
    },
    disposalInstructions: {
      stepByStep: [
        'Separate any removable recyclable elements (paper, plastic, metal).',
        'Check local municipal waste sorting guide.',
        'Place cleaned dry recyclables in Blue bin, or residual in domestic bin.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Verify municipal accepted materials before curbside disposal.'
    },
    environmentalImpact: {
      carbonSavedGrams: 100,
      ecoPoints: 35,
      funFact: 'Conscious sorting diverts tons of salvageable materials from overflowing landfills.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  };
}

// AI Waste Classifier endpoint
app.post('/api/waste/classify', async (req: Request, res: Response) => {
  try {
    const { itemName, imageBase64, mimeType } = req.body;

    if (!itemName && !imageBase64) {
      return res.status(400).json({ error: 'Please provide either an item name or an image to classify.' });
    }

    // 1. STATIC INSTANT-PICK CHECK:
    // If the search query matches an item in the static list, continue using the static item immediately!
    if (itemName && !imageBase64) {
      const staticMatch = getStaticItemMatch(itemName);
      if (staticMatch) {
        return res.json({ success: true, data: staticMatch, source: 'static-instant-list' });
      }
    }

    // 2. DYNAMIC AI CLASSIFICATION VIA GEMINI:
    // For custom waste items (e.g., "chapati", "chewing gum", "old shoes") or uploaded images, call Gemini dynamically!
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const promptText = `
You are the expert eco-system intelligence behind "Nirmalatvam".
Accurately classify this waste item: "${itemName || 'the item in the provided image'}".

Return strict JSON only (no markdown, no backticks, just raw valid JSON):
{
  "itemName": "Proper Title Case Item Name",
  "category": "Recyclable" | "Organic" | "E-Waste" | "Non-Recyclable" | "Hazardous",
  "subCategory": "Accurate subcategory",
  "material": "Primary material constitution",
  "upcyclingIdea": {
    "title": "Creative practical DIY project title",
    "description": "Engaging 1-2 sentence overview of second-life transformation",
    "difficulty": "Easy" | "Moderate" | "Advanced",
    "timeMinutes": 15,
    "steps": ["Step 1...", "Step 2...", "Step 3...", "Step 4..."],
    "toolsNeeded": ["Tool 1", "Tool 2"]
  },
  "disposalInstructions": {
    "stepByStep": ["Step 1 for proper disposal...", "Step 2..."],
    "binColor": "Blue (Dry/Recyclable)" | "Green (Wet/Compostable)" | "Red/Black (Hazardous/Domestic)" | "Special Drop-off",
    "cautionNotes": "Safety tip or precaution"
  },
  "environmentalImpact": {
    "carbonSavedGrams": 120,
    "ecoPoints": 40,
    "funFact": "One fascinating verified environmental or material fact"
  },
  "isCompostable": boolean,
  "compostType": "Green" | "Brown" | "Not recommended"
}
`;

        const contents: any[] = [];
        if (imageBase64) {
          contents.push({
            inlineData: {
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              mimeType: mimeType || 'image/jpeg',
            },
          });
        }
        contents.push({ text: promptText });

        // Try gemini-3.1-flash-lite first for rapid dynamic responses
        const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
        let parsedResult = null;

        for (const modelName of modelsToTry) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents,
              config: {
                responseMimeType: 'application/json',
                temperature: 0.1,
              },
            });

            const text = response.text;
            if (text) {
              parsedResult = JSON.parse(text);
              if (parsedResult.itemName && parsedResult.category) {
                return res.json({ success: true, data: parsedResult, source: modelName });
              }
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} failed or unavailable:`, modelErr?.message || modelErr);
          }
        }
      } catch (geminiError: any) {
        console.warn('Gemini classification exception:', geminiError?.message || geminiError);
      }
    }

    // 3. Fallback to smart item-aware generator if API was unreachable
    const fallbackData = generateSmartFallback(itemName || 'waste item');
    return res.json({ success: true, data: fallbackData, source: 'smart-fallback' });
  } catch (err: any) {
    console.error('Classification error:', err);
    res.status(500).json({ error: 'Failed to classify item. Please try again.' });
  }
});

// Composting trouble-shooter and ratio advice endpoint
app.post('/api/compost/diagnose', async (req: Request, res: Response) => {
  try {
    const { issue, greensCount, brownsCount } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && issue) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        const prompt = `You are the master composting microbiologist for Nirmalatvam.
User asks about this compost challenge: "${issue}".
Current batch approximate ratio: ${greensCount || 1} parts Greens to ${brownsCount || 2} parts Browns.
Provide a clear, encouraging diagnostic response in JSON:
{
  "diagnosis": "Short 1-sentence cause summary",
  "immediateFix": "What to do right now today",
  "prevention": "How to prevent it going forward",
  "moistureAction": "Add dry leaves / Aerate pile / Add water mist / Turn pile",
  "temperatureStatus": "Optimum aerobic range: 45°C - 65°C"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          return res.json({ success: true, diagnosis: JSON.parse(response.text) });
        }
      } catch (err: any) {
        console.warn('Compost diagnose AI fallback:', err?.message);
      }
    }

    // Curated standard compost issue mapping
    const standardResponses: Record<string, any> = {
      smell: {
        diagnosis: "Anaerobic condition caused by excess moisture or too much nitrogen without adequate oxygen.",
        immediateFix: "Turn the compost pile thoroughly with a garden pitchfork to introduce oxygen, and mix in 2 buckets of shredded dry cardboard or dry autumn leaves.",
        prevention: "Always cap fresh food scraps with a 2-inch blanket of dry 'Brown' matter.",
        moistureAction: "Turn pile and incorporate dry carbon",
        temperatureStatus: "Temperature may spike once aerobic bacteria return"
      },
      dry: {
        diagnosis: "Insufficient moisture or excessively airy dry carbon layer stopping microbial breakdown.",
        immediateFix: "Sprinkle water with a hose nozzle until the pile reaches 'wrung-out sponge' dampness, then toss lightly.",
        prevention: "Keep compost container closed or lightly mulched on top during hot sunny spells.",
        moistureAction: "Add lukewarm water mist and fresh vegetable peelings",
        temperatureStatus: "Will warm up once moisture reactivates enzymes"
      },
      flies: {
        diagnosis: "Exposed sugary fruit peelings or meat/dairy scraps attracting fruit flies and gnats.",
        immediateFix: "Bury all fresh greens at least 4 inches into the center of the pile and cover with shredded brown paper.",
        prevention: "Avoid adding meat, bones, greasy oils, or dairy to standard home compost piles.",
        moistureAction: "Top blanket with 3 inches of clean dry straw or shredded paper",
        temperatureStatus: "Hot composting kills fly larvae naturally"
      }
    };

    const key = Object.keys(standardResponses).find(k => (issue || '').toLowerCase().includes(k)) || 'smell';
    return res.json({ success: true, diagnosis: standardResponses[key] });
  } catch (err) {
    res.status(500).json({ error: 'Diagnosis failed' });
  }
});

// Setup dev vs production serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nirmalatvam eco server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
