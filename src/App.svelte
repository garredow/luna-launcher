<script lang="ts">
  import { OnyxKeys } from 'onyx-keys';
  import { OnyxNavigation } from 'onyx-navigation';
  import OnyxApp from 'onyx-ui/components/app/OnyxApp.svelte';
  import { Onyx } from 'onyx-ui/services';
  import { onDestroy, onMount } from 'svelte';
  import Router, { pop } from 'svelte-spa-router';
  import AppMenu from './components/AppMenu.svelte';
  import AddWidget from './routes/AddWidget.svelte';
  import AppList from './routes/AppList.svelte';
  import AppSettings from './routes/AppSettings.svelte';
  import DeviceSettings from './routes/DeviceSettings.svelte';
  import Dialer from './routes/Dialer.svelte';
  import NetworkStats from './routes/NetworkStats.svelte';
  import Page from './routes/Page.svelte';
  import Redirect from './routes/Redirect.svelte';
  import Search from './routes/Search.svelte';
  import { apps } from './stores/apps';
  import { contacts } from './stores/contacts';
  import { settings } from './stores/settings';

  console.log(`Env: ${process.env.NODE_ENV}`);

  OnyxNavigation.startListening();

  const routes = {
    '/page/:pageId': Page,
    '/page/:pageId/add': AddWidget,
    '/apps': AppList,
    '/settings': AppSettings,
    '/device': DeviceSettings,
    '/search': Search,
    '/dialer': Dialer,
    '/networkstats': NetworkStats,
    '*': Redirect,
  };

  const keys = OnyxKeys.subscribe(
    {
      onBackspace: async (ev) => !ev.detail.targetIsInput && pop(),
    },
    { priority: 0 }
  );

  onMount(async () => {
    apps.refresh();
    contacts.refresh();
  });

  onDestroy(() => keys.unsubscribe());

  $: Onyx.settings.update($settings);
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <Router {routes} />
</OnyxApp>
