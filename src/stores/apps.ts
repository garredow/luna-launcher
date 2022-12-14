import { get, writable } from 'svelte/store';
import type { App } from '../entities';
import { Device } from '../services/device';
import { Storage } from '../services/storage';

function createStore() {
  const store = writable<App[]>([]);

  async function refresh(populateDataStats = false) {
    const apps = await Device.getApps();

    if (populateDataStats) {
      for (const app of apps) {
        await app.refreshDataStats();
      }
    }

    store.set(apps.filter((a) => !a.role));
  }

  function markFavorite(origin: string, fav: boolean) {
    let origins = Storage.getItem<string[]>('favoriteApps') || [];

    if (fav && !origins.includes(origin)) {
      origins.push(origin);
    }
    if (!fav) {
      origins = origins.filter((a) => a !== origin);
    }

    Storage.setItem('favoriteApps', origins);
    store.set(get(store));
  }

  return {
    subscribe: store.subscribe,
    refresh,
    markFavorite,
  };
}

export const apps = createStore();
