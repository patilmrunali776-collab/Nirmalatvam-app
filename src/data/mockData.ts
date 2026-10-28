import {
  WasteClassificationResult,
  RecyclingCenter,
  CompostIngredient,
  EcoChallenge,
  FriendLeaderboardUser,
  LoggedActivity,
} from '../types';

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';

export const ASSET_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
  compostSoil: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  upcyclingWorkshop: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
};


export const POPULAR_ITEMS_CATALOG: WasteClassificationResult[] = [
  {
    itemName: 'Plastic Water Bottle (PET #1)',
    category: 'Recyclable',
    subCategory: 'Polyethylene Terephthalate (#1 PET)',
    material: 'Clear rigid thermoplastic polymer',
    upcyclingIdea: {
      title: 'Capillary Self-Watering Indoor Herb Planter',
      description: 'Cut horizontally, invert the top funnel with a cotton wick to keep basil, mint, or thyme perfectly hydrated with zero root rot.',
      difficulty: 'Easy',
      timeMinutes: 15,
      steps: [
        'Rinse clean and slice the bottle horizontally 10cm from the top rim.',
        'Drill a 5mm hole through the cap and thread an organic cotton cord through.',
        'Invert funnel into the base water reservoir filled with 300ml fresh water.',
        'Fill top with compost soil and sow seeds; moisture will wick up naturally.'
      ],
      toolsNeeded: ['Kitchen scissors or craft knife', 'Cotton cord or shoe string', 'Potting soil', 'Herb seeds']
    },
    disposalInstructions: {
      stepByStep: [
        'Empty all contents completely and rinse quickly.',
        'Crush body flat to save storage and collection volume.',
        'Screw cap back on (caps are recovered alongside bottle flakes).',
        'Place into Blue Dry Recyclables Bin.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Keep dry. Do not place in organic or compost bins.'
    },
    environmentalImpact: {
      carbonSavedGrams: 120,
      ecoPoints: 40,
      funFact: 'Recycling 1 plastic bottle powers a 60W LED bulb for 4+ hours and saves 0.2 liters of crude oil.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  },
  {
    itemName: 'Spent Coffee Grounds & Filter',
    category: 'Organic',
    subCategory: 'High-Nitrogen Kitchen Scrap (C:N 20:1)',
    material: 'Organic roasted coffee bean cellulose',
    upcyclingIdea: {
      title: 'Ant-Repelling Garden Soil Amendment & Body Scrub',
      description: 'Blend dried grounds with olive oil for an invigorating skin polish, or sprinkle in rings around outdoor vegetable patches to deter slugs and snails.',
      difficulty: 'Easy',
      timeMinutes: 10,
      steps: [
        'Spread damp grounds onto a tray in the sun for 12 hours until dry.',
        'Mix 1 cup dried grounds with 2 tablespoons olive or almond oil.',
        'Store in a sealed glass jar for natural bathroom exfoliation.'
      ],
      toolsNeeded: ['Shallow drying tray', 'Upcycled glass jar', 'Carrier oil']
    },
    disposalInstructions: {
      stepByStep: [
        'Add directly to your home compost bin or kitchen vermicomposting tumbler.',
        'Paper filters break down cleanly without needing to be separated.',
        'Deposit into Green Wet Organic Bin if utilizing city composting.'
      ],
      binColor: 'Green (Wet/Compostable)',
      cautionNotes: 'Acts as a "Green" nitrogen source despite its dark brown color; pair with shredded leaves.'
    },
    environmentalImpact: {
      carbonSavedGrams: 90,
      ecoPoints: 35,
      funFact: 'Diverting coffee grounds keeps methane out of landfills and injects direct phosphorus and potassium into soil.'
    },
    isCompostable: true,
    compostType: 'Green'
  },
  {
    itemName: 'Corrugated Shipping Box',
    category: 'Recyclable',
    subCategory: 'Cardboard & Paperboard (Carbon Brown)',
    material: 'Fluted wood pulp cellulose',
    upcyclingIdea: {
      title: 'Permaculture Sheet-Mulching Weed Barrier ("Lasagna Bed")',
      description: 'Lay flattened cardboard over stubborn weeds to naturally smother invasive grass while building rich earthworm soil.',
      difficulty: 'Easy',
      timeMinutes: 20,
      steps: [
        'Strip all plastic packing tape and synthetic shipping labels.',
        'Thoroughly saturate the cardboard sheets with a hose or water bucket.',
        'Overlap edges by 15cm on the garden bed so no weeds emerge.',
        'Top with 5cm of wood chips or autumn leaf mulch.'
      ],
      toolsNeeded: ['Blade to remove shipping tape', 'Garden hose', 'Mulch or straw']
    },
    disposalInstructions: {
      stepByStep: [
        'Peel away clear plastic tapes, labels, and bubble wrap.',
        'Flatten box completely to save 80% collection space.',
        'Keep dry; store indoors until curbside collection day.',
        'Place inside the Blue Paper & Cardboard recycling bin.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Discard oil-soaked cardboard (like pizza grease puddles) into compost, not paper recycling.'
    },
    environmentalImpact: {
      carbonSavedGrams: 260,
      ecoPoints: 50,
      funFact: 'Recycling 1 ton of cardboard prevents 17 trees from being cut down and saves 4,000 kW of energy.'
    },
    isCompostable: true,
    compostType: 'Brown'
  },
  {
    itemName: 'Glass Pasta Sauce or Jam Jar',
    category: 'Recyclable',
    subCategory: 'Container Cullet Glass',
    material: '100% recyclable soda-lime silicate glass',
    upcyclingIdea: {
      title: 'Aesthetic Kitchen Pantry Spice & Sprout Jar',
      description: 'Remove label with baking soda paste and convert into zero-waste spice jars or an upside-down alfalfa sprout greenhouse.',
      difficulty: 'Easy',
      timeMinutes: 15,
      steps: [
        'Submerge jar in hot water with 1 tbsp baking soda for 10 minutes to peel label effortlessly.',
        'Scrub any leftover sticky residue with a dash of oil.',
        'Replace metal cap with a small mesh screen or cheesecloth for alfalfa sprouting, or chalk label for spices.'
      ],
      toolsNeeded: ['Warm water & baking soda', 'Sponge', 'Chalk pen or label']
    },
    disposalInstructions: {
      stepByStep: [
        'Empty and rinse clean of food residue.',
        'Separate metal lid (recycle with metal cans).',
        'Keep glass bottle intact; do not crush or shatter.',
        'Drop into Blue Glass Recycling Bin or local bottle bank.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Do not mix glassware with ceramics, porcelain, drinking glasses, or window panes.'
    },
    environmentalImpact: {
      carbonSavedGrams: 310,
      ecoPoints: 50,
      funFact: 'Glass is 100% infinitely recyclable without degrading in quality or structural purity.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  },
  {
    itemName: 'Alkaline AA / AAA Battery',
    category: 'E-Waste',
    subCategory: 'Domestic Electrochemical Cell',
    material: 'Zinc, Manganese Dioxide, Steel Casing',
    upcyclingIdea: {
      title: 'Fire-Safe Home Battery Collection Box',
      description: 'Batteries cannot be safely dismantled at home, but building a spark-proof drop box ensures safe community collection without fire risk.',
      difficulty: 'Easy',
      timeMinutes: 5,
      steps: [
        'Apply clear tape over positive and negative terminal contacts.',
        'Label an airtight plastic tub "E-Waste / Battery Drop Box".',
        'Keep in a cool dry place away from heat or direct sunlight.',
        'Take to a designated certified battery drop-off hub.'
      ],
      toolsNeeded: ['Insulating tape', 'Plastic container']
    },
    disposalInstructions: {
      stepByStep: [
        'NEVER toss into household trash or standard curbside recycling.',
        'Tape terminals of 9V and lithium batteries to avoid shorts.',
        'Deposit into designated municipal hazardous e-waste kiosk.'
      ],
      binColor: 'Special Drop-off',
      cautionNotes: 'Punctured or crushed batteries cause hazardous landfill fires and leach heavy metals.'
    },
    environmentalImpact: {
      carbonSavedGrams: 420,
      ecoPoints: 75,
      funFact: 'Zinc and manganese extracted from recycled alkaline batteries are reused in plant fertilizers and steel rebar.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  },
  {
    itemName: 'Aluminum Beverage Can',
    category: 'Recyclable',
    subCategory: 'UBC Aluminum Alloy',
    material: 'Non-ferrous sheet aluminum',
    upcyclingIdea: {
      title: 'Desk Stationery Pencil Caddy & Candle Lantern',
      description: 'Smooth top lip with a safety can opener and puncture celestial pattern holes with a nail to create a luminous tea-light lantern.',
      difficulty: 'Moderate',
      timeMinutes: 20,
      steps: [
        'Rinse thoroughly and let dry.',
        'Fill with water and freeze solid (ice prevents metal from collapsing during punching).',
        'Use a hammer and nail to punch decorative dot patterns into the cylinder.',
        'Thaw ice, dry completely, and place a safe tea light candle inside.'
      ],
      toolsNeeded: ['Clean hammer', 'Medium nail', 'Freezer', 'Tea light']
    },
    disposalInstructions: {
      stepByStep: [
        'Rinse beverage residue cleanly.',
        'Leave pop-tab intact on the lid.',
        'Crush if needed to save bin room.',
        'Place into Blue Metal/Can recycling bin.'
      ],
      binColor: 'Blue (Dry/Recyclable)',
      cautionNotes: 'Aluminum can be back on store shelves as a new can in as little as 60 days.'
    },
    environmentalImpact: {
      carbonSavedGrams: 280,
      ecoPoints: 45,
      funFact: 'Recycling aluminum saves 95% of the energy needed to produce fresh virgin aluminum from bauxite.'
    },
    isCompostable: false,
    compostType: 'Not recommended'
  },
  {
    itemName: 'Banana & Fruit Peels',
    category: 'Organic',
    subCategory: 'Potassium-Rich Kitchen Waste',
    material: 'Biodegradable fruit biomass',
    upcyclingIdea: {
      title: 'Nutrient-Dense Banana Peel Tea for Houseplants',
      description: 'Soak fresh banana peels in water for 48 hours to brew a potassium-rich organic liquid booster for flowering plants.',
      difficulty: 'Easy',
      timeMinutes: 5,
      steps: [
        'Chop 2-3 banana skins into 2cm cubes.',
        'Place in a 1-liter glass jar filled with tap water.',
        'Steep for 48 hours at room temperature, then strain liquid.',
        'Dilute 1:4 with water and feed your potted monsteras, pothos, or tomatoes.'
      ],
      toolsNeeded: ['Glass jar', 'Kitchen knife', 'Strainer']
    },
    disposalInstructions: {
      stepByStep: [
        'Chop roughly to speed up decomposition.',
        'Toss into your home compost pile as a "Green".',
        'Or place into municipal Green Organic wet waste bin.'
      ],
      binColor: 'Green (Wet/Compostable)',
      cautionNotes: 'Avoid piling too thick in one spot; mix with dry shredded leaves to keep aerobic.'
    },
    environmentalImpact: {
      carbonSavedGrams: 95,
      ecoPoints: 30,
      funFact: 'Organic food scrap composting generates zero methane when properly turned with oxygen.'
    },
    isCompostable: true,
    compostType: 'Green'
  },
  {
    itemName: 'Old Cotton T-Shirt / Fabric Rags',
    category: 'Recyclable',
    subCategory: 'Natural Plant Fiber Textile',
    material: '100% Cotton knit yarn',
    upcyclingIdea: {
      title: 'Braided Zero-Waste Kitchen Scrubbers & Produce Bag',
      description: 'Cut worn-out cotton tees into 1-inch ribbons (t-shirt yarn) and finger-weave durable dish scrubbers that can be washed and reused for months.',
      difficulty: 'Moderate',
      timeMinutes: 25,
      steps: [
        'Cut horizontal 1-inch strips across the t-shirt body.',
        'Gently pull strips lengthwise so edges curl inward into soft cord yarn.',
        'Braid three 30cm strands together and coil into a round disc.',
        'Stitch edge with needle and thread to form a machine-washable pot scrubber.'
      ],
      toolsNeeded: ['Fabric scissors', 'Needle & thread']
    },
    disposalInstructions: {
      stepByStep: [
        'If clean and wearable: donate to local thrift or shelter clothing drive.',
        'If torn/stained: drop off at designated textile recycling collection banks.',
        'Never place in standard curbside plastic/paper recycling (tanglers jam machinery).'
      ],
      binColor: 'Special Drop-off',
      cautionNotes: 'Textiles in general landfill take decades to decompose if synthetic blends are present.'
    },
    environmentalImpact: {
      carbonSavedGrams: 380,
      ecoPoints: 60,
      funFact: 'Diverting 1kg of cotton textiles saves 20,000 liters of water used in raw cotton crop cultivation.'
    },
    isCompostable: true,
    compostType: 'Brown'
  }
];

export const RECYCLING_CENTERS: RecyclingCenter[] = [
  {
    id: 'rc-1',
    name: 'GreenHaven Regional Materials Recovery Facility',
    categoryBadges: ['Plastic', 'Paper', 'Metal', 'Glass'],
    address: '420 EcoParkway Blvd, Sector 8',
    cityArea: 'Central District',
    distanceKm: 1.4,
    hours: 'Mon – Sat: 08:00 AM – 06:00 PM',
    openNow: true,
    phone: '+1 (555) 234-7890',
    website: 'https://greenhaven-recovery.eco',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    acceptedMaterials: [
      'PET #1 & HDPE #2 Plastics',
      'Corrugated Cardboard & Mixed Paper',
      'Tin & UBC Aluminum Cans',
      'Bottle & Jar Container Glass',
      'Shredded Office Documents'
    ],
    rules: 'Materials must be rinsed and clean. Separate glass bottles by color (Amber, Green, Clear) at the bay.',
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: 'rc-2',
    name: 'Metro SafeHub Electronics & Battery Depot',
    categoryBadges: ['E-Waste', 'Hazardous', 'Metal'],
    address: '118 Industrial Circuit Road, Gateway North',
    cityArea: 'North Industrial Belt',
    distanceKm: 2.8,
    hours: 'Tue – Sun: 09:00 AM – 05:00 PM',
    openNow: true,
    phone: '+1 (555) 890-4421',
    website: 'https://metrosafehub.org',
    imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    acceptedMaterials: [
      'Household Alkaline & Lithium Batteries',
      'Smartphones, Laptops & Tablet PCs',
      'Power Cables, Adapters & Copper Wire',
      'Small Kitchen Appliances (Toasters, Blenders)',
      'Unbroken Fluorescent & LED Tubes'
    ],
    rules: 'Tape terminal contacts on all 9V and Lithium cells. Remove ink cartridges from printers beforehand.',
    lat: 37.7833,
    lng: -122.4167
  },
  {
    id: 'rc-3',
    name: 'SunShine Community Biomass & Composting Yard',
    categoryBadges: ['Compost', 'Paper'],
    address: '89 Willow Creek Lane, Near Community Orchards',
    cityArea: 'South Greenbelt',
    distanceKm: 3.5,
    hours: 'Daily: 07:00 AM – 07:00 PM',
    openNow: true,
    phone: '+1 (555) 662-1198',
    website: 'https://sunshinecompost.green',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    acceptedMaterials: [
      'Raw Fruit & Vegetable Scraps',
      'Untreated Garden Wood Prunings & Twigs',
      'Dry Autumn Foliage & Brown Grass',
      'Spent Coffee Grounds & Tea Leaves',
      'Shredded Unprinted Cardboard'
    ],
    rules: 'No cooked meats, fats, synthetic plastic bags, dog/cat feces, or treated timber accepted.',
    lat: 37.7600,
    lng: -122.4300
  },
  {
    id: 'rc-4',
    name: 'EcoCircular Textile & Flexible Film Hub',
    categoryBadges: ['Plastic', 'Paper'],
    address: '204 Heritage Mill Lane, Suite 12',
    cityArea: 'Eastside Arts Quarter',
    distanceKm: 4.1,
    hours: 'Wed – Sun: 10:00 AM – 06:00 PM',
    openNow: true,
    phone: '+1 (555) 345-9988',
    website: 'https://ecocircularfilms.org',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    acceptedMaterials: [
      'Clean Plastic Grocery Bags (LDPE #4)',
      'Bubble Mailers & Bubble Wrap',
      'Old Cotton / Linen Worn Clothing',
      'Burlap Sacks & Jute Fibers',
      'Denim & Canvas Scraps'
    ],
    rules: 'Bag soft plastics together inside one clear plastic sack. Ensure textiles are clean and dry.',
    lat: 37.7700,
    lng: -122.4000
  },
  {
    id: 'rc-5',
    name: 'Apex Scrap Metal & Catalytic Reclaimers',
    categoryBadges: ['Metal', 'E-Waste'],
    address: '55 Foundry Way, Dockyard Pier 14',
    cityArea: 'Waterfront Logistics',
    distanceKm: 5.7,
    hours: 'Mon – Fri: 07:30 AM – 04:30 PM',
    openNow: false,
    phone: '+1 (555) 771-3320',
    website: 'https://apexmetals-reclaim.com',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    acceptedMaterials: [
      'Brass, Copper Pipe & Plumbing Fixtures',
      'Stainless Steel Sinks & Cookware',
      'Bicycle Frames & Steel Rims',
      'Iron Railings & Structural Angle Iron',
      'Electric Motors & Alternators'
    ],
    rules: 'Cash payouts available for weight-certified copper and aluminum loads. Hard hats required on site.',
    lat: 37.7900,
    lng: -122.3900
  }
];

export const COMPOST_INGREDIENTS: CompostIngredient[] = [
  // Greens (Nitrogen rich)
  {
    id: 'ing-1',
    name: 'Vegetable Trimmings & Salad Scraps',
    type: 'green',
    ratioEstimate: '20:1 C:N',
    moisture: 'High',
    tips: 'Chop larger stems to decompose 3x faster. High in moisture and essential nitrogen.'
  },
  {
    id: 'ing-2',
    name: 'Spent Coffee Grounds & Paper Filters',
    type: 'green',
    ratioEstimate: '20:1 C:N',
    moisture: 'Medium',
    tips: 'Despite dark color, grounds are a premier nitrogen booster. Paper filters break down rapidly.'
  },
  {
    id: 'ing-3',
    name: 'Fresh Lawn Grass Clippings',
    type: 'green',
    ratioEstimate: '15:1 C:N',
    moisture: 'High',
    tips: 'Layer thinly! Clumps of fresh wet grass turn slimy and smelly if not tossed with dry browns.'
  },
  {
    id: 'ing-4',
    name: 'Crushed Eggshells',
    type: 'green',
    ratioEstimate: 'Balanced Mineral',
    moisture: 'Dry',
    tips: 'Rinse and crush finely. Supplies vital calcium carbonate that buffers compost pile pH.'
  },
  {
    id: 'ing-5',
    name: 'Fruit Peels & Apple Cores',
    type: 'green',
    ratioEstimate: '25:1 C:N',
    moisture: 'High',
    tips: 'Bury into center of pile to avoid attracting gnats or fruit flies.'
  },
  // Browns (Carbon rich)
  {
    id: 'ing-6',
    name: 'Dry Autumn Leaves',
    type: 'brown',
    ratioEstimate: '60:1 C:N',
    moisture: 'Dry',
    tips: 'The king of carbon. Run lawnmower over dry leaves to shred them before mixing into pile.'
  },
  {
    id: 'ing-7',
    name: 'Shredded Brown Cardboard & Egg Cartons',
    type: 'brown',
    ratioEstimate: '350:1 C:N',
    moisture: 'Dry',
    tips: 'Tear into hand-sized chunks. Creates crucial air pockets that prevent anaerobic odors.'
  },
  {
    id: 'ing-8',
    name: 'Clean Untreated Wood Shavings / Sawdust',
    type: 'brown',
    ratioEstimate: '400:1 C:N',
    moisture: 'Dry',
    tips: 'Use only raw untreated wood. Scatter sparingly because high carbon digests slowly.'
  },
  {
    id: 'ing-9',
    name: 'Shredded Newspaper & Paper Towel Scraps',
    type: 'brown',
    ratioEstimate: '175:1 C:N',
    moisture: 'Dry',
    tips: 'Modern black newsprint uses soy ink and is safe for gardens. Avoid glossy colored magazines.'
  },
  {
    id: 'ing-10',
    name: 'Dry Coconut Coir & Husk Fibers',
    type: 'brown',
    ratioEstimate: '100:1 C:N',
    moisture: 'Dry',
    tips: 'Exceptional moisture retainer with ideal porous aeration for vermicomposting worms.'
  }
];

export const INITIAL_CHALLENGES: EcoChallenge[] = [
  {
    id: 'ch-1',
    title: 'Upcycle 3 Household Containers',
    description: 'Transform glass jars, plastic bottles, or tin cans into seed planters or pantry organizers.',
    category: 'upcycle',
    points: 90,
    targetCount: 3,
    currentCount: 2,
    unit: 'items',
    completed: false
  },
  {
    id: 'ch-2',
    title: 'Home Compost 2kg Kitchen Scraps',
    description: 'Divert peelings, coffee grounds, and trimmings into your compost bin or tumbler.',
    category: 'compost',
    points: 120,
    targetCount: 2,
    currentCount: 1.4,
    unit: 'kg',
    completed: false
  },
  {
    id: 'ch-3',
    title: 'Certified E-Waste Drop-Off Run',
    description: 'Safely recycle depleted batteries or broken electronic gadgets at a verified hub.',
    category: 'dropoff',
    points: 80,
    targetCount: 1,
    currentCount: 1,
    unit: 'visit',
    completed: true
  },
  {
    id: 'ch-4',
    title: 'Zero Single-Use Plastic Streak (3 Days)',
    description: 'Carry canvas tote bags, reusable tumblers, and metal water bottles for 72 hours.',
    category: 'habit',
    points: 150,
    targetCount: 3,
    currentCount: 2,
    unit: 'days',
    completed: false
  },
  {
    id: 'ch-5',
    title: 'Neighborhood Litter Cleanup Sweep',
    description: 'Spend 20 minutes clearing roadside plastics or park litter in your area.',
    category: 'cleanup',
    points: 100,
    targetCount: 20,
    currentCount: 20,
    unit: 'mins',
    completed: true
  }
];

export const INITIAL_LEADERBOARD_FRIENDS: FriendLeaderboardUser[] = [
  {
    id: 'usr-1',
    name: 'You (Eco Pioneer)',
    points: 840,
    streakDays: 6,
    rank: 2,
    isCurrentUser: true,
    badges: ['Compost Master', 'Plastic Diverter', 'Zero-Waste Streak'],
    recentAction: 'Transformed 2 glass pasta jars into herb hydroponics',
    kudosCount: 14,
    avatarUrl: ASSET_IMAGES.avatar
  },
  {
    id: 'usr-2',
    name: 'Aarav Sharma',
    points: 960,
    streakDays: 9,
    rank: 1,
    badges: ['Circular Champion', 'E-Waste Guardian', 'Compost Master'],
    recentAction: 'Turned 12kg cold-cured compost into community garden beds',
    kudosCount: 28,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-3',
    name: 'Priya Patel',
    points: 790,
    streakDays: 5,
    rank: 3,
    badges: ['Upcycle Artisan', 'Plastic Saver'],
    recentAction: 'Crafted 4 self-watering planters from PET beverage bottles',
    kudosCount: 19,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-4',
    name: 'Marcus Vance',
    points: 680,
    streakDays: 4,
    rank: 4,
    badges: ['River Protector', 'Clean Sweep'],
    recentAction: 'Collected 3kg plastic bottles along waterfront trails',
    kudosCount: 11,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-5',
    name: 'Elena Rostova',
    points: 540,
    streakDays: 3,
    rank: 5,
    badges: ['Soil Enthusiast', 'Zero Waste'],
    recentAction: 'Set up balanced 3:1 Brown:Green lasagna compost bin',
    kudosCount: 8,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-6',
    name: 'Devika Nair',
    points: 490,
    streakDays: 2,
    rank: 6,
    badges: ['Battery SafeKeeper'],
    recentAction: 'Dropped off 18 spent lithium-ion cells at Metro SafeHub',
    kudosCount: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_ACTIVITIES: LoggedActivity[] = [
  {
    id: 'act-1',
    timestamp: 'Today at 09:15 AM',
    title: 'Upcycled 2 Glass Sauce Jars',
    category: 'upcycle',
    pointsEarned: 50,
    carbonSavedKg: 0.62,
    notes: 'Cleaned labels with baking soda; now storing organic chia and flax seeds.'
  },
  {
    id: 'act-2',
    timestamp: 'Yesterday at 04:30 PM',
    title: 'Turned & Balanced Home Compost Pile',
    category: 'compost',
    pointsEarned: 40,
    carbonSavedKg: 1.15,
    notes: 'Added 2 buckets of dry oak leaves with fresh coffee grounds to fix ammonia odor.'
  },
  {
    id: 'act-3',
    timestamp: '3 days ago',
    title: 'Certified Battery SafeHub Drop-off',
    category: 'dropoff',
    pointsEarned: 75,
    carbonSavedKg: 0.45,
    notes: 'Taped terminal ends of 8 alkaline AA batteries and delivered to Metro SafeHub.'
  },
  {
    id: 'act-4',
    timestamp: '5 days ago',
    title: 'Curbside Cardboard Breakdown',
    category: 'recycle',
    pointsEarned: 45,
    carbonSavedKg: 0.85,
    notes: 'Stripped synthetic packing tape from 4 delivery cartons and flattened.'
  }
];
