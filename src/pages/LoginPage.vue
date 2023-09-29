<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width: 300px; height: 415px">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-md">Login</h4>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-px-sm q-pt-sm q-pb-lg">
              <q-input
                square
                clearable
                v-model="form.email"
                type="email"
                label="Email"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="form.password"
                type="password"
                label="Password"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length >= 6) ||
                    'Please type something. Must be at least 6 cahracters and containing a special character',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
              <q-card-actions class="q-px-lg q-mt-md">
                <q-btn
                  unelevated
                  size="lg"
                  color="primary"
                  class="full-width text-white"
                  label="Login"
                  type="submit"
                />
              </q-card-actions>
              <q-card-section class="text-center q-pa-sm">
                <router-link :to="{ name: 'RegisterPage' }" class="text-grey-6"
                  >No account? Register</router-link
                >
              </q-card-section>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue';
import { useUsersStore } from 'src/stores/users-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const form = reactive({
  email: '',
  password: '',
});

const usersStore = useUsersStore();

const router = useRouter();
const $q = useQuasar();

async function onSubmit() {
  try {
    await usersStore.signInWithEmailAndPassword({
      email: form.email,
      password: form.password,
    });
    await router.push({ name: 'EventsPage' });
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'User logged in',
    });
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

<style></style>
