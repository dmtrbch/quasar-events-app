<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="max-width: 400px">
      <h3>Create new event</h3>

      <event-editor @save="save" @cancel="cancel" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import EventEditor from 'src/components/EventEditor.vue';
import { useEventsStore } from 'src/stores/events-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();

async function save({
  name,
  description,
  date,
}: {
  name: string;
  description: string;
  date: string;
}) {
  try {
    await useEventsStore().createEvent(name, description, date);

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Event created',
    });

    router.push({ name: 'EventsPage' });
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
function cancel() {
  router.push({ name: 'EventsPage' });
}
</script>
