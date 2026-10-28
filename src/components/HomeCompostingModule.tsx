import React, { useState, useEffect } from 'react';
import {
  Leaf,
  Layers,
  Thermometer,
  Droplets,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Search,
  Send,
  Bell,
  BellRing,
  RotateCw,
  Clock,
  Calendar,
  X
} from 'lucide-react';
import { COMPOST_INGREDIENTS, ASSET_IMAGES, FALLBACK_IMAGE } from '../data/mockData';
import { useToast } from './Toast';

interface HomeCompostingModuleProps {
  onLogActivity: (activity: {
    title: string;
    category: 'compost';
    pointsEarned: number;
    carbonSavedKg: number;
    notes?: string;
  }) => void;
}

interface CompostReminderSettings {
  enabled: boolean;
  frequencyDays: number;
  lastTurnedDate: string; // ISO String
}

export const HomeCompostingModule: React.FC<HomeCompostingModuleProps> = ({ onLogActivity }) => {
  const { showToast } = useToast();

  // Ingredient quantities in current batch (unit buckets/handfuls)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'ing-1': 2, // Vegetable trimmings
    'ing-2': 1, // Spent coffee grounds
    'ing-6': 4, // Dry autumn leaves
    'ing-7': 2, // Shredded cardboard
  });

  const [activeTab, setActiveTab] = useState<'calculator' | 'tutorial' | 'troubleshooter'>('calculator');
  const [ingredientFilter, setIngredientFilter] = useState<'all' | 'green' | 'brown'>('all');

  // Troubleshooter state
  const [selectedIssueKey, setSelectedIssueKey] = useState<string>('smell');
  const [customIssueText, setCustomIssueText] = useState('');
  const [customDiagnosis, setCustomDiagnosis] = useState<any>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Remind Me State with LocalStorage Persistence
  const [reminderSettings, setReminderSettings] = useState<CompostReminderSettings>(() => {
    const saved = localStorage.getItem('nirmalatvam_compost_reminder');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback default
      }
    }
    // Default: reminder enabled, 3-day frequency, last turned 3 days ago (so initial alert shows)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    return {
      enabled: true,
      frequencyDays: 3,
      lastTurnedDate: threeDaysAgo,
    };
  });

  // Alert banner dismissal state
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // Save reminder settings to localStorage
  useEffect(() => {
    localStorage.setItem('nirmalatvam_compost_reminder', JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  // Calculate days since last turn
  const lastTurnedTimestamp = new Date(reminderSettings.lastTurnedDate).getTime();
  const daysSinceTurn = Math.max(0, Math.floor((Date.now() - lastTurnedTimestamp) / (1000 * 60 * 60 * 24)));
  const daysUntilNextTurn = reminderSettings.frequencyDays - daysSinceTurn;
  const isMaintenanceDue = daysUntilNextTurn <= 0;

  // Toggle Remind Me
  const handleToggleReminder = async () => {
    const nextState = !reminderSettings.enabled;
    setReminderSettings((prev) => ({ ...prev, enabled: nextState }));

    if (nextState) {
      showToast('Compost care reminders activated!', undefined, 'success');
      // Request native notification permission if supported
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (e) {
          // Permissions in iframe might be limited
        }
      }
    } else {
      showToast('Compost reminders paused.', undefined, 'info');
    }
  };

  // Change frequency
  const handleFrequencyChange = (days: number) => {
    setReminderSettings((prev) => ({ ...prev, frequencyDays: days }));
    showToast(`Reminder cadence updated to every ${days} days.`, undefined, 'info');
  };

  // Complete maintenance task
  const handleCompleteMaintenance = () => {
    const nowIso = new Date().toISOString();
    setReminderSettings((prev) => ({
      ...prev,
      lastTurnedDate: nowIso,
    }));
    setIsAlertDismissed(true);

    onLogActivity({
      title: 'Compost Maintenance: Aerated & Watered Pile',
      category: 'compost',
      pointsEarned: 25,
      carbonSavedKg: 0.8,
      notes: 'Turned core with pitchfork and checked moisture for optimal microbial breakdown.',
    });

    showToast('Compost maintenance logged! Next check scheduled.', 25, 'success');
  };

  // Snooze reminder
  const handleSnooze = () => {
    // Postpone by 1 day
    const oneDayAgo = new Date(Date.now() - (reminderSettings.frequencyDays - 1) * 24 * 60 * 60 * 1000).toISOString();
    setReminderSettings((prev) => ({ ...prev, lastTurnedDate: oneDayAgo }));
    setIsAlertDismissed(true);
    showToast('Reminder snoozed for 24 hours.', undefined, 'info');
  };

  // Trigger test/simulation alert
  const handleSimulateAlert = () => {
    const pastDate = new Date(Date.now() - (reminderSettings.frequencyDays + 1) * 24 * 60 * 60 * 1000).toISOString();
    setReminderSettings((prev) => ({ ...prev, enabled: true, lastTurnedDate: pastDate }));
    setIsAlertDismissed(false);

    // Native browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Nirmalatvam Compost Reminder', {
          body: '🌱 Time to aerate your compost pile! Check moisture and turn for optimal 55°C heat.',
          icon: '/favicon.ico',
        });
      } catch (err) {
        // Fallback to in-app toast
      }
    }

    showToast('🌱 Alert Triggered: Time to aerate and check moisture!', undefined, 'alert');
  };

  // Compute greens and browns totals
  const totalGreens = COMPOST_INGREDIENTS.filter((i) => i.type === 'green').reduce(
    (acc, curr) => acc + (quantities[curr.id] || 0),
    0
  );

  const totalBrowns = COMPOST_INGREDIENTS.filter((i) => i.type === 'brown').reduce(
    (acc, curr) => acc + (quantities[curr.id] || 0),
    0
  );

  // Ideal ratio is 2 to 3 parts Brown (Carbon) for every 1 part Green (Nitrogen) by volume.
  const ratio = totalGreens === 0 ? 0 : Number((totalBrowns / totalGreens).toFixed(1));

  let balanceStatus: {
    state: 'ideal' | 'wet' | 'dry' | 'empty';
    title: string;
    recommendation: string;
    color: string;
  };

  if (totalGreens === 0 && totalBrowns === 0) {
    balanceStatus = {
      state: 'empty',
      title: 'Empty Compost Pile',
      recommendation: 'Add greens (nitrogen) and browns (carbon) below to start balancing your batch.',
      color: 'text-slate-500',
    };
  } else if (ratio >= 2.0 && ratio <= 3.5) {
    balanceStatus = {
      state: 'ideal',
      title: 'Ideal Golden Balance (~30:1 C:N Ratio)',
      recommendation: 'Outstanding microbial harmony! Your pile will heat up steadily (50–65°C) without foul odors.',
      color: 'text-emerald-700',
    };
  } else if (ratio < 2.0) {
    balanceStatus = {
      state: 'wet',
      title: 'High Nitrogen / Too Wet',
      recommendation: `Add approximately ${Math.max(1, Math.ceil(totalGreens * 2.5 - totalBrowns))} more buckets of dry leaves or shredded cardboard to avoid ammonia smell.`,
      color: 'text-amber-700',
    };
  } else {
    balanceStatus = {
      state: 'dry',
      title: 'High Carbon / Too Dry',
      recommendation: `Add ${Math.max(1, Math.ceil(totalBrowns / 2.5 - totalGreens))} more buckets of kitchen vegetable scraps or fresh coffee grounds, plus a gentle mist of water.`,
      color: 'text-blue-700',
    };
  }

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Log compost batch
  const handleLogBatch = () => {
    if (totalGreens === 0 && totalBrowns === 0) {
      showToast('Add some ingredients to your batch first!', undefined, 'alert');
      return;
    }

    const points = 40;
    const carbonKg = Number(((totalGreens * 0.45) + (totalBrowns * 0.2)).toFixed(2));

    onLogActivity({
      title: `Logged Home Compost Batch (${totalGreens} Greens : ${totalBrowns} Browns)`,
      category: 'compost',
      pointsEarned: points,
      carbonSavedKg: carbonKg,
      notes: `Batch status: ${balanceStatus.title}`,
    });

    showToast('Compost batch recorded successfully!', points, 'success');
  };

  // Standard troubleshooting issues
  const commonIssues: Record<string, {
    title: string;
    diagnosis: string;
    immediateFix: string;
    prevention: string;
    moistureAction: string;
    tempStatus: string;
  }> = {
    smell: {
      title: 'Rotten Eggs or Ammonia Odor',
      diagnosis: 'Anaerobic conditions caused by too much moisture or excess nitrogen green matter without adequate oxygen.',
      immediateFix: 'Turn the compost pile thoroughly using a garden fork to introduce fresh air pockets, and mix in 2-3 buckets of shredded cardboard or dry autumn leaves.',
      prevention: 'Always cover freshly added food scraps with a 2-inch blanket of dry brown carbon material.',
      moistureAction: 'Stop adding water; incorporate dry, absorbent cellulose.',
      tempStatus: 'Pile will reheat rapidly once aerobic bacteria recover.'
    },
    cold: {
      title: 'Compost is Cold & Not Decomposing',
      diagnosis: 'The pile is either too small (< 1 cubic meter), excessively dry, or lacking nitrogen fuel.',
      immediateFix: 'Mix in high-nitrogen activators like fresh spent coffee grounds, fresh lawn grass, or comfrey leaves, and moisten until damp.',
      prevention: 'Keep your active pile at least 3 feet wide by 3 feet high to insulate internal heat.',
      moistureAction: 'Squeeze test: handful should feel like a damp, wrung-out sponge.',
      tempStatus: 'Target thermophilic temperature: 45°C - 60°C'
    },
    flies: {
      title: 'Swarming Fruit Flies or Gnats',
      diagnosis: 'Sweet fruit peels (melons, bananas, citrus) are exposed near the surface of the compost heap.',
      immediateFix: 'Dig a hole in the core of the pile, bury all kitchen fruit scraps, and cover with 3 inches of shredded brown paper or cardboard.',
      prevention: 'Never leave exposed raw food on top. Use a sealed kitchen caddy with charcoal filter before emptying outside.',
      moistureAction: 'Maintain a dry brown protective top cap.',
      tempStatus: 'Hot composting naturally sterilizes insect larvae.'
    },
    matted: {
      title: 'Soggy, Slimy Green Matting',
      diagnosis: 'Fresh lawn grass clippings or whole leafy greens clumped together without spacer carbon.',
      immediateFix: 'Break up slimy clumps using a pitchfork and thoroughly blend in dry leaves or pine needles.',
      prevention: 'Never dump thick layers of grass clippings. Sprinkle thinly or let dry in the sun for 24 hours first.',
      moistureAction: 'Fluff with coarse twigs or wood chips for passive airflow.',
      tempStatus: 'Needs airflow to maintain beneficial aerobic microbes.'
    }
  };

  // Custom diagnostic submit
  const handleCustomDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIssueText.trim()) return;

    setIsDiagnosing(true);
    try {
      const response = await fetch('/api/compost/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: customIssueText,
          greensCount: totalGreens,
          brownsCount: totalBrowns,
        }),
      });

      const data = await response.json();
      if (data.success && data.diagnosis) {
        setCustomDiagnosis(data.diagnosis);
      }
    } catch (err) {
      showToast('Loaded offline diagnostics', undefined, 'info');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const filteredIngredients = COMPOST_INGREDIENTS.filter((item) => {
    if (ingredientFilter === 'all') return true;
    return item.type === ingredientFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
              <Leaf className="w-4 h-4" />
              <span>Closed-Loop Soil Regeneration</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Home Composting Wizard & Recipe Studio
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Turn kitchen food scraps and yard biomass into nutrient-rich organic fertilizer. Calculate your C:N balance, set automated turning reminders, and diagnose common issues.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'calculator'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ratio Calculator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tutorial')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'tutorial'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5-Step Tutorial
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('troubleshooter')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'troubleshooter'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Troubleshooter
            </button>
          </div>
        </div>
      </section>

      {/* DASHBOARD ALERT: Time to Turn or Water Pile */}
      {reminderSettings.enabled && isMaintenanceDue && !isAlertDismissed && (
        <section className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-300 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xs font-bold font-mono tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded uppercase">
                  Care Reminder Due
                </span>
                <span className="text-xs text-slate-500">
                  Last turned {daysSinceTurn} days ago
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                Time to aerate & water your compost pile!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                Turning with a garden fork infuses oxygen into anaerobic pockets, while a quick squeeze check keeps moisture at the optimal 50% "sponge" level.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-200">
            <button
              type="button"
              onClick={handleSnooze}
              className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl font-medium transition-colors shadow-2xs"
            >
              Snooze 1 Day
            </button>
            <button
              type="button"
              onClick={handleCompleteMaintenance}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Turned (+25 pts)
            </button>
          </div>
        </section>
      )}

      {/* Main Tab 1: Greens vs Browns Ratio Calculator */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Ingredient Selector */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select Organic Household Materials
                </h3>
                <p className="text-xs text-slate-500">
                  Adjust portions (handfuls/buckets) to observe live carbon-nitrogen balancing.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setIngredientFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    ingredientFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All ({COMPOST_INGREDIENTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setIngredientFilter('green')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    ingredientFilter === 'green' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Greens (Nitrogen)
                </button>
                <button
                  type="button"
                  onClick={() => setIngredientFilter('brown')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    ingredientFilter === 'brown' ? 'bg-amber-800 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Browns (Carbon)
                </button>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredIngredients.map((item) => {
                const count = quantities[item.id] || 0;
                const isGreen = item.type === 'green';

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      count > 0
                        ? isGreen
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200/70 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            isGreen ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isGreen ? 'Green (Nitrogen)' : 'Brown (Carbon)'}
                        </span>
                        <span className="text-xs font-mono text-slate-500 tabular-nums">
                          {item.ratioEstimate}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        {item.tips}
                      </p>
                    </div>

                    {/* Counter Buttons */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/50">
                      <span className="text-xs text-slate-500">
                        Portion: <strong className="text-slate-800 font-mono">{count}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={count === 0}
                          className="w-7 h-7 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Reminders + Live Ratio Gauge & Batch Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* REMIND ME COMPONENT CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Compost Care Reminder
                  </h4>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={handleToggleReminder}
                  role="switch"
                  aria-checked={reminderSettings.enabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                    reminderSettings.enabled ? 'bg-emerald-700' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      reminderSettings.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {reminderSettings.enabled ? (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated alert suggests when to aerate and check moisture to maintain peak microbial decomposition.
                  </p>

                  {/* Frequency Selector */}
                  <div>
                    <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Aeration Schedule Cadence
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {[
                        { days: 3, label: '3 Days', desc: 'Fast' },
                        { days: 5, label: '5 Days', desc: 'Optimal' },
                        { days: 7, label: 'Weekly', desc: 'Low care' },
                      ].map((freq) => (
                        <button
                          key={freq.days}
                          type="button"
                          onClick={() => handleFrequencyChange(freq.days)}
                          className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                            reminderSettings.frequencyDays === freq.days
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block leading-tight">{freq.label}</span>
                          <span className="text-3xs text-slate-400 block">{freq.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Countdown Status */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-600">Next Due:</span>
                    </div>
                    <span className={`font-mono font-bold ${isMaintenanceDue ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {isMaintenanceDue ? 'Due Today!' : `In ${daysUntilNextTurn} days`}
                    </span>
                  </div>

                  {/* Test Simulate Alert Button */}
                  <button
                    type="button"
                    onClick={handleSimulateAlert}
                    className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Test / Trigger Alert Now
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400 p-2 bg-slate-50 rounded-lg text-center">
                  Reminders are paused. Toggle above to receive notifications when your pile needs oxygen.
                </div>
              )}
            </div>

            {/* Current Batch Dynamics Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Current Batch Dynamics
              </h3>

              {/* Proportional Bar */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold text-emerald-800">
                    Greens: {totalGreens} parts ({totalGreens + totalBrowns > 0 ? Math.round((totalGreens / (totalGreens + totalBrowns)) * 100) : 0}%)
                  </span>
                  <span className="font-semibold text-amber-900">
                    Browns: {totalBrowns} parts ({totalGreens + totalBrowns > 0 ? Math.round((totalBrowns / (totalGreens + totalBrowns)) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    style={{
                      width: totalGreens + totalBrowns > 0 ? `${(totalGreens / (totalGreens + totalBrowns)) * 100}%` : '0%',
                    }}
                    className="bg-emerald-600 transition-all duration-300"
                  />
                  <div
                    style={{
                      width: totalGreens + totalBrowns > 0 ? `${(totalBrowns / (totalGreens + totalBrowns)) * 100}%` : '0%',
                    }}
                    className="bg-amber-700 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Status Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-5">
                <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                  Ratio Assessment
                </span>
                <h4 className={`text-sm font-bold ${balanceStatus.color} mb-1.5`}>
                  {balanceStatus.title}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {balanceStatus.recommendation}
                </p>
              </div>

              {/* Micro Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                  <span className="text-slate-500 block">Current Proportion</span>
                  <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                    {totalGreens === 0 ? '0' : `1 : ${ratio}`}
                  </span>
                  <span className="text-slate-400 text-3xs">Ideal is ~1:2.5</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                  <span className="text-slate-500 block">Est. Carbon Diverted</span>
                  <span className="text-base font-bold font-mono text-emerald-700 tabular-nums">
                    {((totalGreens * 0.45) + (totalBrowns * 0.2)).toFixed(1)} kg
                  </span>
                  <span className="text-slate-400 text-3xs">CO₂e equivalent</span>
                </div>
              </div>

              {/* Log Batch Action */}
              <button
                type="button"
                onClick={handleLogBatch}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Log Compost Batch (+40 pts)
              </button>
            </div>

            {/* Quick Soil Photo Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="relative aspect-4/3 w-full bg-slate-100">
                <img
                  src={ASSET_IMAGES.compostSoil}
                  alt="Rich organic compost humus"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                  The Result: "Black Gold"
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Finished compost is crumbly, dark brown, and smells sweetly of a fresh forest floor. Use it to supercharge potting soil, mulch fruit trees, or brew liquid plant tea.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: 5-Step Practical Composting Tutorial */}
      {activeTab === 'tutorial' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs space-y-8">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              The 5-Step Home Composting Masterclass
            </h3>
            <p className="text-sm text-slate-600">
              Follow this foundational method to create odorless, pathogen-free compost in your backyard, balcony tumbler, or community patch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                  01
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  Base Aeration Grid
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Layer 4 inches of small twigs, pruned woody branches, or straw at the bottom. This prevents soggy pooling and allows ambient airflow from underneath.
                </p>
              </div>
              <span className="text-3xs font-semibold text-slate-400 mt-4 uppercase">Drainage foundation</span>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                  02
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  The Lasagna Layer
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Add 1 layer of wet kitchen greens (2–3 inches), followed immediately by 2 layers of dry browns (4–6 inches). Never leave wet food scraps directly exposed.
                </p>
              </div>
              <span className="text-3xs font-semibold text-slate-400 mt-4 uppercase">2:1 Brown:Green rule</span>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                  03
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  Sponge Squeeze Test
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Grab a handful of compost wearing a garden glove and squeeze firmly. Exactly 1 or 2 drops of water should seep out. If dripping, add cardboard; if dry, mist water.
                </p>
              </div>
              <span className="text-3xs font-semibold text-slate-400 mt-4 uppercase">50% Optimal moisture</span>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">
                  04
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  Aerate Every 7 Days
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Turn the pile with a garden fork or spin your tumbler weekly. This moves cooler outside materials into the hot biological center where temperatures reach 55°C.
                </p>
              </div>
              <span className="text-3xs font-semibold text-slate-400 mt-4 uppercase">Oxygen infusion</span>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center mb-3">
                  05
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  Cure & Harvest
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  After 8–12 weeks, the pile cools and turns into uniform dark crumbly loam. Screen through a 1/2-inch mesh and feed directly into garden beds and house pots.
                </p>
              </div>
              <span className="text-3xs font-semibold text-emerald-800 mt-4 uppercase">Ready to enrich</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: Troubleshooter Widget */}
      {activeTab === 'troubleshooter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Problem Selector */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Common Compost Symptoms
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an issue below to get immediate micro-biological diagnoses and remedial actions.
            </p>

            <div className="space-y-2">
              {Object.entries(commonIssues).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedIssueKey(key);
                    setCustomDiagnosis(null);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedIssueKey === key && !customDiagnosis
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold shadow-xs'
                      : 'border-slate-200/70 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs">{data.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>

            {/* Custom AI Diagnosis Form */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Have a unique symptom?
              </h4>
              <form onSubmit={handleCustomDiagnosis} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={customIssueText}
                    onChange={(e) => setCustomIssueText(e.target.value)}
                    placeholder="e.g., White fuzzy mold on top layer..."
                    className="w-full text-xs p-2.5 pr-8 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    disabled={isDiagnosing}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-3xs text-slate-400">
                  Backed by Nirmalatvam micro-ecology assistant.
                </p>
              </form>
            </div>
          </div>

          {/* Diagnostic Result Display */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            {customDiagnosis ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                  <span>Custom Microbiological Diagnosis</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    Analysis for: "{customIssueText}"
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {customDiagnosis.diagnosis}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                    Immediate Remedy
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {customDiagnosis.immediateFix}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block font-medium">Prevention</span>
                    <p className="text-slate-700 mt-1">{customDiagnosis.prevention}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block font-medium">Moisture & Air</span>
                    <p className="text-slate-700 mt-1">{customDiagnosis.moistureAction}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>Diagnosis & Remedy</span>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    {commonIssues[selectedIssueKey].title}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {commonIssues[selectedIssueKey].diagnosis}
                  </p>
                </div>

                {/* Immediate Fix Box */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                    Immediate Action to Take Today
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {commonIssues[selectedIssueKey].immediateFix}
                  </p>
                </div>

                {/* Prevention & Temperature status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 block font-semibold mb-1">
                      Prevention Protocol
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {commonIssues[selectedIssueKey].prevention}
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 block font-semibold mb-1">
                      Moisture / Turning Action
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {commonIssues[selectedIssueKey].moistureAction}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
