import { useState, useEffect } from 'react';
import { supabaseData } from '../services/supabaseData';
import { ProfileTable } from '../services/supabase';

export function useSupabaseProfile(userId: string | null | undefined) {
  const [profile, setProfile] = useState<ProfileTable | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      const data = await supabaseData.fetchUserProfile(userId!);
      setProfile(data);
      setLoading(false);
    }

    load();

    // Subscribe to real-time profile changes
    const unsubscribe = supabaseData.subscribeProfileChanges(userId!, (updatedProfile) => {
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const refreshProfile = async () => {
    if (userId) {
      const fresh = await supabaseData.fetchUserProfile(userId);
      setProfile(fresh);
      return fresh;
    }
    return null;
  };

  return { profile, loading, refreshProfile };
}
