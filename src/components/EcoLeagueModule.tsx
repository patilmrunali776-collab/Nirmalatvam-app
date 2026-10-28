import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Plus,
  CheckCircle2,
  Sparkles,
  Users,
  Heart,
  TrendingUp,
  Clock,
  Send,
  UserPlus,
  Share2,
  X,
  Target
} from 'lucide-react';
import { FriendLeaderboardUser, EcoChallenge, LoggedActivity } from '../types';
import { ASSET_IMAGES } from '../data/mockData';
import { useToast } from './Toast';

interface EcoLeagueModuleProps {
  currentUser: FriendLeaderboardUser;
  friends: FriendLeaderboardUser[];
  challenges: EcoChallenge[];
  activities: LoggedActivity[];
  onCompleteChallenge: (challengeId: string) => void;
  onAddFriend: (name: string, badges: string[]) => void;
  onSendKudos: (friendId: string) => void;
  onLogCustomActivity: (activity: {
    title: string;
    category: 'upcycle' | 'compost' | 'recycle' | 'dropoff' | 'cleanup';
    pointsEarned: number;
    carbonSavedKg: number;
    notes?: string;
  }) => void;
}

export const EcoLeagueModule: React.FC<EcoLeagueModuleProps> = ({
  currentUser,
  friends,
  challenges,
  activities,
  onCompleteChallenge,
  onAddFriend,
  onSendKudos,
  onLogCustomActivity,
}) => {
  const { showToast } = useToast();

  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendBadge, setNewFriendBadge] = useState('Eco Ally');

  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCategory, setActivityCategory] = useState<'upcycle' | 'compost' | 'recycle' | 'dropoff' | 'cleanup'>('cleanup');
  const [activityNotes, setActivityNotes] = useState('');

  // Combined and sorted leaderboard
  const allLeaderboard = [...friends].sort((a, b) => b.points - a.points);

  const handleCreateFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    onAddFriend(newFriendName.trim(), [newFriendBadge]);
    showToast(`Added ${newFriendName.trim()} to your Eco League!`, undefined, 'success');
    setNewFriendName('');
    setIsAddFriendOpen(false);
  };

  const handleCustomActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    const pointsMap = {
      cleanup: 60,
      upcycle: 50,
      compost: 40,
      recycle: 30,
      dropoff: 75,
    };
    const pts = pointsMap[activityCategory];
    const carbonEst = 1.2;

    onLogCustomActivity({
      title: activityTitle.trim(),
      category: activityCategory,
      pointsEarned: pts,
      carbonSavedKg: carbonEst,
      notes: activityNotes.trim() || undefined,
    });

    showToast(`Activity recorded! +${pts} EcoPoints`, pts, 'success');
    setActivityTitle('');
    setActivityNotes('');
    setIsLogActivityOpen(false);
  };

  const handleCheer = (friend: FriendLeaderboardUser) => {
    onSendKudos(friend.id);
    showToast(`Sent cheers & high-five to ${friend.name}! 🎉`, undefined, 'info');
  };

  return (
    <div className="space-y-8">
      {/* User Eco Status Hero Banner */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl || ASSET_IMAGES.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-emerald-700 text-white text-3xs font-bold font-mono rounded shadow">
                #{currentUser.rank}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {currentUser.name}
                </h2>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-md text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>{currentUser.streakDays} Day Streak</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Weekly League Tier: <strong className="text-emerald-800">Green Vanguard (Division 1)</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 w-full lg:w-auto">
            <div>
              <span className="text-xs text-slate-500 block">Weekly Score</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
                {currentUser.points} <span className="text-xs text-emerald-900 font-sans font-medium">pts</span>
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Carbon Diverted</span>
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                24.8 <span className="text-xs text-slate-500 font-sans font-medium">kg CO₂e</span>
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Items Salvaged</span>
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                38 <span className="text-xs text-slate-500 font-sans font-medium">items</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLogActivityOpen(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap ml-auto lg:ml-0"
            >
              <Plus className="w-4 h-4" />
              Log Custom Activity
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Challenges vs Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Weekly Challenge Tracker */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-0.5">
                <Target className="w-4 h-4" />
                <span>Active Quests</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Weekly Community Eco-Challenges
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Resets in 3 days
            </span>
          </div>

          <div className="space-y-4">
            {challenges.map((ch) => {
              const progressPct = Math.min(100, Math.round((ch.currentCount / ch.targetCount) * 100));

              return (
                <div
                  key={ch.id}
                  className={`p-4 rounded-xl border transition-all ${
                    ch.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50/50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900">
                          {ch.title}
                        </h4>
                        <span className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                          +{ch.points} pts
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ch.description}
                      </p>
                    </div>

                    {ch.completed ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCompleteChallenge(ch.id)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors shrink-0 shadow-xs"
                      >
                        Complete
                      </button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-200/50">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span className="font-mono tabular-nums">
                        {ch.currentCount} / {ch.targetCount} {ch.unit} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200/70 overflow-hidden">
                      <div
                        style={{ width: `${progressPct}%` }}
                        className={`h-full transition-all duration-300 ${
                          ch.completed ? 'bg-emerald-600' : 'bg-emerald-700'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Friend Leaderboard & Add Friend */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Friend Eco-League
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsAddFriendOpen(true)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Friend
              </button>
            </div>

            {/* Ranked List */}
            <div className="space-y-2.5">
              {allLeaderboard.map((user, idx) => {
                const rankNum = idx + 1;
                const isUser = user.isCurrentUser;

                return (
                  <div
                    key={user.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isUser
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank badge */}
                      <span
                        className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                          rankNum === 1
                            ? 'bg-amber-100 text-amber-900'
                            : rankNum === 2
                            ? 'bg-slate-200 text-slate-800'
                            : rankNum === 3
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {rankNum}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate ${isUser ? 'text-emerald-950' : 'text-slate-900'}`}>
                            {user.name}
                          </span>
                          {user.streakDays > 0 && (
                            <span className="flex items-center gap-0.5 text-3xs text-amber-800 font-mono font-bold">
                              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                              {user.streakDays}d
                            </span>
                          )}
                        </div>

                        {/* Recent action snippet */}
                        <p className="text-3xs text-slate-500 truncate">
                          {user.recentAction}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Points and Kudos button */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-slate-900 tabular-nums block leading-tight">
                          {user.points}
                        </span>
                        <span className="text-3xs text-slate-400 font-medium">pts</span>
                      </div>

                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCheer(user)}
                          title="Cheer with Kudos"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Log Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recent Activity Feed
            </h3>
            <div className="space-y-3">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span>{act.timestamp}</span>
                    <span className="font-mono font-bold text-emerald-700">+{act.pointsEarned} pts</span>
                  </div>
                  <p className="font-semibold text-slate-900">{act.title}</p>
                  {act.notes && <p className="text-slate-600 mt-0.5">{act.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Friend Modal */}
      {isAddFriendOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add an Eco Friend</h3>
              <button
                type="button"
                onClick={() => setIsAddFriendOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFriend} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Friend Name / Alias</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Samantha Reed"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Specialty Badge</label>
                <select
                  value={newFriendBadge}
                  onChange={(e) => setNewFriendBadge(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="Plastic Saver">Plastic Saver</option>
                  <option value="Compost Master">Compost Master</option>
                  <option value="Upcycle Artisan">Upcycle Artisan</option>
                  <option value="Zero Waste Warrior">Zero Waste Warrior</option>
                  <option value="River Guardian">River Guardian</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFriendOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Save Friend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Custom Activity Modal */}
      {isLogActivityOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Log Sustainable Clean-Up Activity</h3>
              <button
                type="button"
                onClick={() => setIsLogActivityOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCustomActivitySubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 20-min park plastic cleanup, made tin can lantern"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={activityCategory}
                  onChange={(e) => setActivityCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="cleanup">Park / Roadside Cleanup (+60 pts)</option>
                  <option value="upcycle">DIY Upcycling & Second-Life (+50 pts)</option>
                  <option value="compost">Organic Home Composting (+40 pts)</option>
                  <option value="recycle">Curbside Sorting (+30 pts)</option>
                  <option value="dropoff">Certified Facility Drop-off (+75 pts)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Proof Note / Details (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Collected 1.5kg of plastic bottle caps from the neighborhood jogging trail."
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogActivityOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Submit & Earn Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
