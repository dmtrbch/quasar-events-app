<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Events App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list class="q-mt-xl">
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="authUser" clickable v-ripple to="/events">
          <q-item-section avatar>
            <q-icon name="event" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Events</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="!authUser" clickable v-ripple to="/register">
          <q-item-section avatar>
            <q-icon name="how_to_reg" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Register</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="!authUser" clickable v-ripple to="/login">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Login</q-item-label>
          </q-item-section>
        </q-item>
        <q-btn
          v-if="authUser"
          class="q-ml-sm"
          @click="signOut"
          color="primary"
          icon="logout"
          label="Log Out"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <suspense>
        <router-view />
      </suspense>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUsersStore } from 'src/stores/users-store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const usersStore = useUsersStore();
const { authUser } = storeToRefs(usersStore);

const $q = useQuasar();

const router = useRouter();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function signOut() {
  try {
    await usersStore.signOut();
    router.push({ name: 'LoginPage' });
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: 'Oops. Something went wrong...',
    });

    console.log(error);
  }
}
</script>
