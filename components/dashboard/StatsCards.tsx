'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Zap, Candy, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomActionForm } from '@/components/custom/CustomActionForm';

<CustomActionForm />


export function StatsCards() {
  const { profile } = useUserProfile();

  const cards = [
    {
      title: 'Energy',
      value: profile?.energy || 0,
      max: 100,
      icon: Zap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      progressColor: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    },
    {
      title: 'Candy Points',
      value: profile?.candy_points || 0,
      max: null,
      icon: Candy,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      progressColor: 'bg-gradient-to-r from-pink-400 to-rose-500',
    },
    {
      title: 'Current Streak',
      value: profile?.current_streak || 0,
      max: null,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progressColor: 'bg-gradient-to-r from-orange-400 to-red-500',
    },
    {
      title: 'Best Streak',
      value: profile?.longest_streak || 0,
      max: null,
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progressColor: 'bg-gradient-to-r from-purple-400 to-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.max && (
                  <div className="mt-2">
                    <Progress 
                      value={(card.value / card.max) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {card.value}/{card.max}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}