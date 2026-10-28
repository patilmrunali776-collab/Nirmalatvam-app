import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Navigation,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Map as MapIcon,
  List,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { RecyclingCenter } from '../types';
import { RECYCLING_CENTERS } from '../data/mockData';
import { useToast } from './Toast';

interface RecyclingHubModuleProps {
  onLogActivity: (activity: {
    title: string;
    category: 'dropoff';
    pointsEarned: number;
    carbonSavedKg: number;
    notes?: string;
  }) => void;
}

export const RecyclingHubModule: React.FC<RecyclingHubModuleProps> = ({ onLogActivity }) => {
  const { showToast } = useToast();

  const [centers, setCenters] = useState<RecyclingCenter[]>(RECYCLING_CENTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCenterForDetail, setSelectedCenterForDetail] = useState<RecyclingCenter | null>(null);
  const [navigationTarget, setNavigationTarget] = useState<RecyclingCenter | null>(null);

  const categories = ['All', 'E-Waste', 'Plastic', 'Metal', 'Paper', 'Glass', 'Compost', 'Hazardous'];
  const areas = ['All Areas', 'Central District', 'North Industrial Belt', 'South Greenbelt', 'Eastside Arts Quarter', 'Waterfront Logistics'];

  // Filter centers
  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.acceptedMaterials.some((mat) => mat.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      center.categoryBadges.includes(selectedCategory as any);

    const matchesArea =
      selectedArea === 'All Areas' || center.cityArea === selectedArea;

    return matchesSearch && matchesCategory && matchesArea;
  });

  // Log Drop-off Visit
  const handleLogDropoff = (center: RecyclingCenter) => {
    const points = 75;
    const carbonKg = 2.4;

    onLogActivity({
      title: `Recycling Drop-off at ${center.name}`,
      category: 'dropoff',
      pointsEarned: points,
      carbonSavedKg: carbonKg,
      notes: `Materials recycled: ${center.categoryBadges.join(', ')}`,
    });

    showToast(`Drop-off verified! +${points} EcoPoints added.`, points, 'success');
  };

  const handleScheduleReminder = (center: RecyclingCenter) => {
    showToast(`Drop-off reminder saved for ${center.name}`, undefined, 'info');
  };

  return (
    <div className="space-y-8">
      {/* Search & Location Bar */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
              <MapPin className="w-4 h-4" />
              <span>Municipal & Certified Hub Network</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Local Recycling Center Finder & Directory
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Locate authorized drop-off depots for electronics, toxic batteries, clean plastics, scrap metals, and organic biomass.
            </p>
          </div>

          {/* Grid vs Map Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Directory View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Interactive Map
            </button>
          </div>
        </div>

        {/* Search Inputs & Area Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by facility name, accepted material, or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="sm:w-56">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 mr-1.5">Material Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* View Mode: Map View */}
      {viewMode === 'map' && (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Regional Drop-Off Map
            </h3>
            <span className="text-xs text-slate-500">
              Showing {filteredCenters.length} centers in vicinity
            </span>
          </div>

          {/* Stylized Interactive Map Container */}
          <div className="relative w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Grid background representing city map */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

            {/* Simulated River / Waterway */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <path
                d="M -50 250 Q 200 180, 450 300 T 950 220"
                fill="none"
                stroke="#0284c7"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <path
                d="M 120 -20 Q 350 240, 700 450"
                fill="none"
                stroke="#334155"
                strokeWidth="10"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Current User Location Radar */}
            <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 animate-ping absolute" />
                <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg relative z-10" />
              </div>
              <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-white text-3xs font-medium rounded shadow-md border border-slate-700 whitespace-nowrap">
                You are here
              </span>
            </div>

            {/* Facility Pins */}
            {filteredCenters.map((center, idx) => {
              // Deterministic spatial placement across coordinates
              const offsets = [
                { top: '26%', left: '30%' },
                { top: '32%', left: '72%' },
                { top: '75%', left: '38%' },
                { top: '60%', left: '80%' },
                { top: '20%', left: '55%' },
              ];
              const pos = offsets[idx % offsets.length];

              const isSelected = selectedCenterForDetail?.id === center.id;

              return (
                <div
                  key={center.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  onClick={() => setSelectedCenterForDetail(center)}
                >
                  <div
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg transition-transform group-hover:scale-105 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-900 text-slate-200 border-slate-700'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-3xs font-bold whitespace-nowrap max-w-[120px] truncate">
                      {center.name.split(' ')[0]}
                    </span>
                    <span className="text-3xs font-mono text-emerald-300">
                      {center.distanceKm}km
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected facility summary card inside map view */}
          {selectedCenterForDetail && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-0.5">
                  <span>{selectedCenterForDetail.cityArea}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selectedCenterForDetail.distanceKm} km away</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedCenterForDetail.name}
                </h4>
                <p className="text-xs text-slate-600">{selectedCenterForDetail.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNavigationTarget(selectedCenterForDetail)}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Get Directions
                </button>
                <button
                  type="button"
                  onClick={() => handleLogDropoff(selectedCenterForDetail)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Log Drop-Off (+75 pts)
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* View Mode: Directory Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                {/* Header status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-500">
                    {center.cityArea} · <span className="font-mono text-emerald-700 font-bold">{center.distanceKm} km</span>
                  </span>
                  <span
                    className={`text-3xs font-semibold px-2 py-0.5 rounded-md ${
                      center.openNow
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {center.openNow ? 'Open Now' : 'Closed Today'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug mb-2">
                  {center.name}
                </h3>

                <p className="text-xs text-slate-600 mb-3 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  {center.address}
                </p>

                {/* Operating hours */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{center.hours}</span>
                </div>

                {/* Category Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {center.categoryBadges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-3xs font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Accepted Materials list */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 mb-4">
                  <span className="font-bold text-slate-900 block mb-1">Accepted Items:</span>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    {center.acceptedMaterials.slice(0, 3).map((mat, i) => (
                      <li key={i} className="truncate">{mat}</li>
                    ))}
                    {center.acceptedMaterials.length > 3 && (
                      <li className="text-slate-400 text-3xs list-none pl-1">
                        +{center.acceptedMaterials.length - 3} more accepted
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setNavigationTarget(center)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Directions
                </button>
                <button
                  type="button"
                  onClick={() => handleLogDropoff(center)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Log Visit (+75)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation & Directions Modal */}
      {navigationTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Navigation className="w-4 h-4 text-emerald-700" />
                <span>Transit & Directions Guidance</span>
              </div>
              <button
                type="button"
                onClick={() => setNavigationTarget(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {navigationTarget.name}
              </h3>
              <p className="text-xs text-slate-600 mb-3">{navigationTarget.address}</p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950">
                <span className="font-bold block mb-1">Drop-off Regulations:</span>
                {navigationTarget.rules}
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-3xs">
                Suggested Low-Carbon Route
              </h4>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-3xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-medium text-slate-800">Depart from Current Location</p>
                  <p className="text-slate-500">Head North on EcoParkway (approx. 400m)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-3xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-medium text-slate-800">Turn right at Circular Way / Sector 8</p>
                  <p className="text-slate-500">Follow signs for Materials Recovery Gate B</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-3xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-medium text-slate-800">Arrive at Depot Drop-off Weighbridge</p>
                  <p className="text-slate-500">Estimated transit: 6 mins by bike / 4 mins electric shuttle</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setNavigationTarget(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleLogDropoff(navigationTarget);
                  setNavigationTarget(null);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirm Visited & Log (+75 pts)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
