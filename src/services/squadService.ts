import { collection, getDocs, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Player } from '../store/useGameStore';

const SQUAD_COLLECTION = 'squad';
const ACHIEVEMENTS_COLLECTION = 'achievements';

export const squadService = {
  async getSquad(): Promise<Player[]> {
    const querySnapshot = await getDocs(collection(db, SQUAD_COLLECTION));
    return querySnapshot.docs.map(doc => doc.data() as Player);
  },

  async savePlayer(player: Player) {
    if (!player || !player.id) {
      console.warn('Player missing ID or invalid, skipping save:', player);
      return;
    }
    try {
      const playerRef = doc(db, SQUAD_COLLECTION, String(player.id));
      await setDoc(playerRef, player, { merge: true });
    } catch (error) {
      console.error(`Error saving player ${player.name}:`, error);
      throw error;
    }
  },

  async deletePlayer(playerId: string) {
    if (!playerId) return;
    try {
      const { deleteDoc } = await import('firebase/firestore');
      const playerRef = doc(db, SQUAD_COLLECTION, String(playerId));
      await deleteDoc(playerRef);
    } catch (error) {
      console.error(`Error deleting player ${playerId}:`, error);
      throw error;
    }
  },

  async updateSquad(squad: Player[]) {
    if (!Array.isArray(squad)) {
      console.error('updateSquad: squad is not an array', squad);
      return;
    }
    const promises = squad.map(player => squadService.savePlayer(player));
    await Promise.all(promises);
  },

  async saveAchievement(achievement: any) {
    if (!achievement || !achievement.id) return;
    try {
      const achRef = doc(db, ACHIEVEMENTS_COLLECTION, String(achievement.id));
      await setDoc(achRef, achievement, { merge: true });
    } catch (error) {
      console.error(`Error saving achievement ${achievement.title}:`, error);
      throw error;
    }
  },

  async updateAchievements(achievements: any[]) {
    const promises = achievements.map(ach => squadService.saveAchievement(ach));
    await Promise.all(promises);
  },

  async deleteAchievement(achId: string) {
    if (!achId) return;
    try {
      const { deleteDoc } = await import('firebase/firestore');
      const achRef = doc(db, ACHIEVEMENTS_COLLECTION, String(achId));
      await deleteDoc(achRef);
    } catch (error) {
      console.error(`Error deleting achievement ${achId}:`, error);
      throw error;
    }
  },

  subscribeToSquad(callback: (squad: Player[]) => void) {
    if (!db) {
      console.error('Firestore DB not initialized');
      return () => {};
    }
    
    try {
      return onSnapshot(collection(db, SQUAD_COLLECTION), (snapshot) => {
        const squad = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as Player;
          return { ...data, id: data.id || docSnap.id };
        });
        if (squad.length > 0) {
          callback(squad);
        }
      }, (error) => {
        console.error('Firestore Subscription Error:', error);
      });
    } catch (error) {
      console.error('Error setting up Firestore subscription:', error);
      return () => {};
    }
  },

  subscribeToAchievements(callback: (achievements: any[]) => void) {
    if (!db) return () => {};
    try {
      return onSnapshot(collection(db, ACHIEVEMENTS_COLLECTION), (snapshot) => {
        const achs = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as any;
          return { ...data, id: data.id || docSnap.id };
        });
        if (achs.length > 0) {
          callback(achs);
        }
      }, (error) => {
        console.error('Firestore Achievements Subscription Error:', error);
      });
    } catch (error) {
      console.error('Error setting up Achievements subscription:', error);
      return () => {};
    }
  }
};
