'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function CustomActionForm() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [energy, setEnergy] = useState(0);
  const [candy, setCandy] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // 1. Check if user has enough
    const { data: profile, error: profileError } = await supabase
      .from('users_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      toast.error('Failed to fetch profile');
      return;
    }

    if (profile.energy < energy || profile.candy_points < candy) {
      toast.error('Not enough energy or candy');
      return;
    }

    // 2. Insert custom action
    const { error: insertError } = await supabase.from('custom_actions').insert([
      {
        user_id: user.id,
        name,
        energy_change: -Math.abs(energy),
        candy_change: -Math.abs(candy),
      },
    ]);

    if (insertError) {
      toast.error(insertError.message);
      return;
    }

    // 3. Update profile
    const { error: updateError } = await supabase
      .from('users_profile')
      .update({
        energy: profile.energy - energy,
        candy_points: profile.candy_points - candy,
      })
      .eq('user_id', user.id);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    toast.success('Action logged and points deducted!');
    setName('');
    setEnergy(0);
    setCandy(0);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Spend Candy / Energy</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log an Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Action Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Energy to Spend</Label>
            <Input type="number" value={energy} onChange={(e) => setEnergy(+e.target.value)} />
          </div>
          <div>
            <Label>Candy to Spend</Label>
            <Input type="number" value={candy} onChange={(e) => setCandy(+e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
