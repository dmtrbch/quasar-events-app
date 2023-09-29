<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row q-qol-gutter-sm" style="justify-content: end">
      <div class="col-md-4 col-sm-12 col-xs-12">
        <q-btn
          class="float-right"
          color="primary"
          label="Create new Event"
          :to="{ name: 'EventCreate' }"
        />
      </div>
    </div>
  </div>
  <q-page class="row items-center justify-evenly">
    <event-list :users="users" :events="events" />
  </q-page>
</template>

<script setup lang="ts">
import EventList from 'src/components/EventList.vue';
import { useUsersStore } from 'src/stores/users-store';
import { useEventsStore } from 'src/stores/events-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const eventsStore = useEventsStore();
const { events } = storeToRefs(eventsStore);

const $q = useQuasar();

try {
  await usersStore.fetchUsers();
  await eventsStore.fetchEvents();
} catch (error) {
  $q.notify({
    color: 'red-4',
    textColor: 'white',
    icon: 'error',
    message: 'Oops. Something went wrong...',
  });
}
</script>
