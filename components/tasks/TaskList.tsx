'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { TaskForm } from './TaskForm';
import { Check, Zap, Candy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const categoryColors = {
  Work: 'bg-blue-100 text-blue-800',
  Study: 'bg-green-100 text-green-800',
  Health: 'bg-red-100 text-red-800',
  Personal: 'bg-purple-100 text-purple-800',
  Exercise: 'bg-orange-100 text-orange-800',
  Social: 'bg-pink-100 text-pink-800',
};

export function TaskList() {
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleTaskCompleted = async (taskId: string, task: Task) => {
    if (!user || !profile) return;

    try {
      // Update task as completed
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', taskId);

      if (taskError) throw taskError;

      // Update user profile with rewards
      const newEnergy = Math.min(100, profile.energy + task.energy_reward);
      const newCandyPoints = profile.candy_points + task.candy_reward;

      await updateProfile({
        energy: newEnergy,
        candy_points: newCandyPoints,
      });

      // Update local state
      setTasks(tasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: true, completed_at: new Date().toISOString() }
          : t
      ));

      toast.success(
        `Task completed! +${task.energy_reward} energy, +${task.candy_reward} candy points`
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleTaskAdded = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tasks</h2>
        </div>
        <div className="text-center py-8">Loading tasks...</div>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <TaskForm onTaskAdded={handleTaskAdded} />
      </div>

      {/* Pending Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Pending ({pendingTasks.length})</h3>
        <AnimatePresence>
          {pendingTasks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-gray-500">
                No pending tasks. Add one to get started!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={false}
                          onCheckedChange={() => handleTaskCompleted(task.id, task)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{task.title}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge className={categoryColors[task.category as keyof typeof categoryColors]}>
                              {task.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-amber-600">
                              <Zap className="h-3 w-3" />
                              +{task.energy_reward}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-pink-600">
                              <Candy className="h-3 w-3" />
                              +{task.candy_reward}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Completed ({completedTasks.length})</h3>
          <div className="grid gap-4">
            {completedTasks.slice(0, 5).map((task) => (
              <Card key={task.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium line-through text-gray-600">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={categoryColors[task.category as keyof typeof categoryColors]}>
                          {task.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-amber-600">
                          <Zap className="h-3 w-3" />
                          +{task.energy_reward}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-pink-600">
                          <Candy className="h-3 w-3" />
                          +{task.candy_reward}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}