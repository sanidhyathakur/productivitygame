'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { LogOut, Zap, Candy } from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const { signOut } = useAuth();
  const { profile } = useUserProfile();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Productivity Game
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {profile && (
              <div className="flex items-center space-x-4 bg-gray-50 rounded-full px-4 py-2">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-amber-700">{profile.energy}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Candy className="h-4 w-4 text-pink-500" />
                  <span className="font-medium text-pink-700">{profile.candy_points}</span>
                </div>
                <div className="text-sm text-gray-600">
                  🔥 {profile.current_streak}
                </div>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}