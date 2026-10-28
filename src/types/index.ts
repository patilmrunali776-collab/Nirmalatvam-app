export type WasteCategory = 'Recyclable' | 'Organic' | 'E-Waste' | 'Non-Recyclable' | 'Hazardous';

export interface UpcyclingIdea {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  timeMinutes: number;
  steps: string[];
  toolsNeeded: string[];
}

export interface DisposalInstructions {
  stepByStep: string[];
  binColor: string;
  cautionNotes?: string;
}

export interface EnvironmentalImpact {
  carbonSavedGrams: number;
  ecoPoints: number;
  funFact: string;
}

export interface WasteClassificationResult {
  itemName: string;
  category: WasteCategory;
  subCategory: string;
  material: string;
  upcyclingIdea: UpcyclingIdea;
  disposalInstructions: DisposalInstructions;
  environmentalImpact: EnvironmentalImpact;
  isCompostable: boolean;
  compostType?: 'Green' | 'Brown' | 'Not recommended';
}

export interface RecyclingCenter {
  id: string;
  name: string;
  categoryBadges: ('E-Waste' | 'Plastic' | 'Metal' | 'Paper' | 'Glass' | 'Hazardous' | 'Compost')[];
  address: string;
  cityArea: string;
  distanceKm: number;
  hours: string;
  openNow: boolean;
  phone: string;
  website: string;
  acceptedMaterials: string[];
  rules: string;
  lat: number;
  lng: number;
}

export interface CompostIngredient {
  id: string;
  name: string;
  type: 'green' | 'brown';
  ratioEstimate: string; // e.g. 20:1
  moisture: 'High' | 'Medium' | 'Dry';
  tips: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  category: 'upcycle' | 'compost' | 'recycle' | 'cleanup' | 'habit' | 'dropoff';
  points: number;
  targetCount: number;
  currentCount: number;
  unit: string;
  completed: boolean;
}

export interface FriendLeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  streakDays: number;
  rank: number;
  isCurrentUser?: boolean;
  badges: string[];
  recentAction: string;
  kudosCount: number;
}

export interface LoggedActivity {
  id: string;
  timestamp: string;
  title: string;
  category: 'upcycle' | 'compost' | 'recycle' | 'dropoff' | 'cleanup';
  pointsEarned: number;
  carbonSavedKg: number;
  notes?: string;
}
