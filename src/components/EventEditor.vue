<template>
  <q-form @submit="onSubmit" @reset="emit('cancel')" class="q-gutter-md">
    <q-input
      filled
      v-model="form.name"
      label="Event name"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      v-model="form.description"
      label="Event description"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input filled v-model="form.date" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="form.date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <div>
      <q-btn
        :label="existing ? 'Edit' : 'Create'"
        type="submit"
        color="primary"
      />
      <q-btn label="Cancel" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script setup>
import { reactive, computed } from 'vue';

const props = defineProps({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: String, default: '2023/09/27' },
});

const form = reactive({
  name: props.name,
  description: props.description,
  date: props.date,
});

const existing = computed(() => !!props.name);

function onSubmit() {
  emit('save', { ...form });
}

const emit = defineEmits(['save', 'cancel']);
</script>
