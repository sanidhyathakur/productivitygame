'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AuthForm } from '@/components/auth/AuthForm';
import { Navbar } from '@/components/layout/Navbar';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TaskList } from '@/components/tasks/TaskList';
import { FocusTimer } from '@/components/focus/FocusTimer';
import { DailyQuote } from '@/components/quotes/DailyQuote';
import { Loader2 } from 'lucide-react';
import { CustomActionForm } from '@/components/custom/CustomActionForm';



<CustomActionForm />


export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="text-gray-600">Loading your productivity dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back, Achiever!
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to turn your tasks into victories?
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Daily Quote */}
          <DailyQuote />
          {/* Custom Action Form */}
<div className="text-center">
  <CustomActionForm />
</div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks - Takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <TaskList />
            </div>

            {/* Focus Timer - Takes up 1 column */}
            <div className="space-y-6">
              <FocusTimer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}