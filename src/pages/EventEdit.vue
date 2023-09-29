<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="max-width: 400px">
      <h3>
        Edit <i>{{ eventData.name }}</i>
      </h3>

      <event-editor
        :name="eventData?.name"
        :description="eventData?.description"
        :date="eventData?.date"
        @save="save"
        @cancel="cancel"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import EventEditor from 'src/components/EventEditor.vue';
import { useEventsStore } from 'src/stores/events-store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const eventsStore = useEventsStore();
const { event } = storeToRefs(eventsStore);

const $q = useQuasar();
const router = useRouter();

const eventData = computed(() => event.value(props.id));

const props = defineProps({
  id: { type: String, required: true },
});

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
    await eventsStore.updateEvent(eventData.value.id, name, description, date);

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Event updated',
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
