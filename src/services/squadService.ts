import { collection, getDocs, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Player } from '../store/useGameStore';

const SQUAD_COLLECTION = 'squad';

export const squadService = {
  async getSquad(): Promise<Player[]> {
    const querySnapshot = await getDocs(collection(db, SQUAD_COLLECTION));
    return querySnapshot.docs.map(doc => doc.data() as Player);
  },

  async savePlayer(player: Player) {
    // Use player.id as the unique identifier in Firestore
    const playerRef = doc(db, SQUAD_COLLECTION, player.id);
    await setDoc(playerRef, player, { merge: true });
  },

  async deletePlayer(playerId: string) {
    const { deleteDoc } = await import('firebase/firestore');
    const playerRef = doc(db, SQUAD_COLLECTION, playerId);
    await deleteDoc(playerRef);
  },

  async updateSquad(squad: Player[]) {
    const promises = squad.map(player => this.savePlayer(player));
    await Promise.all(promises);
  },

  subscribeToSquad(callback: (squad: Player[]) => void) {
    return onSnapshot(collection(db, SQUAD_COLLECTION), (snapshot) => {
      const squad = snapshot.docs.map(doc => doc.data() as Player);
      if (squad.length > 0) {
        callback(squad);
      }
    });
  }
};
