/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Leaf,
  MapPin,
  Trophy,
  Flame,
  Plus,
  Compass,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Camera,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { ToastProvider, useToast } from './components/Toast';
import { WasteClassifierModule } from './components/WasteClassifierModule';
import { HomeCompostingModule } from './components/HomeCompostingModule';
import { RecyclingHubModule } from './components/RecyclingHubModule';
import { EcoLeagueModule } from './components/EcoLeagueModule';
import {
  INITIAL_CHALLENGES,
  INITIAL_LEADERBOARD_FRIENDS,
  INITIAL_ACTIVITIES,
  ASSET_IMAGES,
} from './data/mockData';
import { FriendLeaderboardUser, EcoChallenge, LoggedActivity } from './types';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  syncUserProfileToFirestore,
  syncActivityToFirestore,
} from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

function AppContent() {
  const { showToast } = useToast();

  // Navigation tab state
  const [activeView, setActiveView] = useState<'classifier' | 'compost' | 'hubs' | 'league'>('classifier');
  const [quickScanActive, setQuickScanActive] = useState(false);

  // Firebase auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // LocalStorage state management
  const [currentUser, setCurrentUser] = useState<FriendLeaderboardUser>(() => {
    const saved = localStorage.getItem('nirmalatvam_user');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD_FRIENDS[0];
  });

  const [friends, setFriends] = useState<FriendLeaderboardUser[]>(() => {
    const saved = localStorage.getItem('nirmalatvam_friends');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD_FRIENDS;
  });

  const [challenges, setChallenges] = useState<EcoChallenge[]>(() => {
    const saved = localStorage.getItem('nirmalatvam_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [activities, setActivities] = useState<LoggedActivity[]>(() => {
    const saved = localStorage.getItem('nirmalatvam_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Sync user profile name and photo
        setCurrentUser((prev) => ({
          ...prev,
          name: user.displayName || prev.name,
          avatarUrl: user.photoURL || prev.avatarUrl,
        }));
        setFriends((prev) =>
          prev.map((f) =>
            f.isCurrentUser
              ? { ...f, name: user.displayName || f.name, avatarUrl: user.photoURL || f.avatarUrl }
              : f
          )
        );
        syncUserProfileToFirestore(user, {
          points: currentUser.points,
          streakDays: currentUser.streakDays,
          badges: currentUser.badges,
        });
      }
    });
    return () => unsubscribe();
  }, [currentUser.points, currentUser.streakDays, currentUser.badges]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nirmalatvam_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nirmalatvam_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('nirmalatvam_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('nirmalatvam_activities', JSON.stringify(activities));
  }, [activities]);

  // Quick Scan camera action
  const handleQuickScan = () => {
    setActiveView('classifier');
    setQuickScanActive(true);
    showToast('📷 Quick Scan active — camera stream ready!', undefined, 'info');
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        showToast(`Welcome back, ${user.displayName || 'Eco Pioneer'}! Cloud persistence active.`, undefined, 'success');
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        showToast('Google Sign-in could not be completed. Continuing with local profile.', undefined, 'alert');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Signed out from Google Cloud sync.', undefined, 'info');
    } catch (err) {
      //
    }
  };

  // Log activity handler
  const handleLogActivity = (newAct: {
    title: string;
    category: 'upcycle' | 'recycle' | 'compost' | 'dropoff' | 'cleanup';
    pointsEarned: number;
    carbonSavedKg: number;
    notes?: string;
  }) => {
    const activityItem: LoggedActivity = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      title: newAct.title,
      category: newAct.category,
      pointsEarned: newAct.pointsEarned,
      carbonSavedKg: newAct.carbonSavedKg,
      notes: newAct.notes,
    };

    setActivities((prev) => [activityItem, ...prev]);

    // Update current user points & friends list
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        points: prev.points + newAct.pointsEarned,
        recentAction: newAct.title,
      };
      return updated;
    });

    setFriends((prev) =>
      prev.map((f) =>
        f.isCurrentUser
          ? { ...f, points: f.points + newAct.pointsEarned, recentAction: newAct.title }
          : f
      )
    );

    // Sync to Firestore if authenticated
    if (firebaseUser?.uid) {
      syncActivityToFirestore(firebaseUser.uid, activityItem);
      syncUserProfileToFirestore(firebaseUser, {
        points: currentUser.points + newAct.pointsEarned,
        streakDays: currentUser.streakDays,
        badges: currentUser.badges,
      });
    }
  };

  // Complete challenge
  const handleCompleteChallenge = (challengeId: string) => {
    const targetChallenge = challenges.find((c) => c.id === challengeId);
    if (!targetChallenge || targetChallenge.completed) return;

    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? { ...c, completed: true, currentCount: c.targetCount }
          : c
      )
    );

    handleLogActivity({
      title: `Completed Quest: ${targetChallenge.title}`,
      category: targetChallenge.category as any,
      pointsEarned: targetChallenge.points,
      carbonSavedKg: 1.5,
    });

    showToast(`Quest Completed! +${targetChallenge.points} EcoPoints`, targetChallenge.points, 'success');
  };

  // Add friend
  const handleAddFriend = (name: string, badges: string[]) => {
    const newFriend: FriendLeaderboardUser = {
      id: `usr-${Date.now()}`,
      name,
      points: 520,
      streakDays: 3,
      rank: friends.length + 1,
      badges,
      recentAction: 'Joined Nirmalatvam Eco-League',
      kudosCount: 1,
    };
    setFriends((prev) => [...prev, newFriend]);
  };

  // Send kudos
  const handleSendKudos = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) =>
        f.id === friendId ? { ...f, kudosCount: f.kudosCount + 1 } : f
      )
    );
  };

  // Reset sample data
  const handleResetData = () => {
    localStorage.removeItem('nirmalatvam_user');
    localStorage.removeItem('nirmalatvam_friends');
    localStorage.removeItem('nirmalatvam_challenges');
    localStorage.removeItem('nirmalatvam_activities');
    setCurrentUser(INITIAL_LEADERBOARD_FRIENDS[0]);
    setFriends(INITIAL_LEADERBOARD_FRIENDS);
    setChallenges(INITIAL_CHALLENGES);
    setActivities(INITIAL_ACTIVITIES);
    showToast('Reset sample data to factory state', undefined, 'info');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Contract: 3 zones, gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single Brand wordmark element */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              नि
            </span>
            <button
              type="button"
              onClick={() => setActiveView('classifier')}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-emerald-800 transition-colors text-left"
            >
              Nirmalatvam
            </button>
          </div>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => {
                setActiveView('classifier');
                setQuickScanActive(false);
              }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeView === 'classifier'
                  ? 'text-emerald-800 border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              AI Waste Classifier
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('compost');
                setQuickScanActive(false);
              }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeView === 'compost'
                  ? 'text-emerald-800 border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              Composting Wizard
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('hubs');
                setQuickScanActive(false);
              }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeView === 'hubs'
                  ? 'text-emerald-800 border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              Recycling Hubs
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('league');
                setQuickScanActive(false);
              }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeView === 'league'
                  ? 'text-emerald-800 border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              Friend Eco-League
            </button>
          </nav>

          {/* Zone 3: 1 primary action / score & Quick Scan lockup */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Scan One-Tap Button */}
            <button
              type="button"
              onClick={handleQuickScan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs whitespace-nowrap"
              title="Open camera stream for instant scan"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Quick Scan</span>
            </button>

            {/* Score Pill */}
            <button
              type="button"
              onClick={() => setActiveView('league')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-xl transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-xs font-bold font-mono tabular-nums">{currentUser.points}</span>
              <span className="text-3xs text-emerald-700 font-semibold uppercase">pts</span>
            </button>

            {/* Google Auth Status / Login */}
            {firebaseUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <img
                  src={firebaseUser.photoURL || currentUser.avatarUrl || ASSET_IMAGES.avatar}
                  alt={firebaseUser.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-2xs"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out of Firebase"
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign in</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="flex md:hidden items-center justify-around gap-1 pt-2.5 mt-2 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveView('classifier');
              setQuickScanActive(false);
            }}
            className={`px-2 py-1 rounded-md ${activeView === 'classifier' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Classifier
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView('compost');
              setQuickScanActive(false);
            }}
            className={`px-2 py-1 rounded-md ${activeView === 'compost' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Compost
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView('hubs');
              setQuickScanActive(false);
            }}
            className={`px-2 py-1 rounded-md ${activeView === 'hubs' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Hubs
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView('league');
              setQuickScanActive(false);
            }}
            className={`px-2 py-1 rounded-md ${activeView === 'league' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            League
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
        {/* Editorial Subtitle Kicker & Quick Scan Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-800">Towards a Greener, Cleaner Tomorrow</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Waste Household Resource Management</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Scan One-Tap Button in Dashboard Kicker */}
            <button
              type="button"
              onClick={handleQuickScan}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition-colors shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quick Scan Item</span>
            </button>

            {firebaseUser ? (
              <span className="text-3xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                <UserCheck className="w-3 h-3" /> Cloud Synced
              </span>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="text-3xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium"
              >
                <LogIn className="w-3 h-3" /> Connect Cloud
              </button>
            )}

            <button
              type="button"
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-3xs ml-1"
              title="Reset sample data"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </div>
        </div>

        {/* View Switching */}
        {activeView === 'classifier' && (
          <WasteClassifierModule
            onLogActivity={handleLogActivity}
            autoStartCamera={quickScanActive}
            onCameraClosed={() => setQuickScanActive(false)}
          />
        )}

        {activeView === 'compost' && (
          <HomeCompostingModule onLogActivity={handleLogActivity} />
        )}

        {activeView === 'hubs' && (
          <RecyclingHubModule onLogActivity={handleLogActivity} />
        )}

        {activeView === 'league' && (
          <EcoLeagueModule
            currentUser={currentUser}
            friends={friends}
            challenges={challenges}
            activities={activities}
            onCompleteChallenge={handleCompleteChallenge}
            onAddFriend={handleAddFriend}
            onSendKudos={handleSendKudos}
            onLogCustomActivity={handleLogActivity}
          />
        )}
      </main>

      {/* Quiet, Clean Editorial Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Nirmalatvam</span>
            <span aria-hidden="true">·</span>
            <span>Empowering sustainable communities through conscious sorting & circular living.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Household Circular Economy</span>
            <span aria-hidden="true">·</span>
            <span>Compost Science</span>
            <span aria-hidden="true">·</span>
            <span>E-Waste Stewardship</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
