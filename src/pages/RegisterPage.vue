<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width: 300px; height: 625px">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-md">Register</h4>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-px-sm q-pt-sm q-pb-lg">
              <q-input
                square
                clearable
                v-model="form.firstname"
                label="First Name"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="form.lastname"
                label="Last Name"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
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
                v-model="form.username"
                type="username"
                label="Username"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
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
                  label="Register"
                  type="submit"
                />
              </q-card-actions>
              <q-card-section class="text-center q-pa-sm">
                <router-link :to="{ name: 'LoginPage' }" class="text-grey-6"
                  >Login instead</router-link
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
  firstname: '',
  lastname: '',
  email: '',
  username: '',
  password: '',
});

const router = useRouter();
const $q = useQuasar();

async function onSubmit() {
  try {
    await useUsersStore().registerUserWithEmailAndPassword(form);

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'User registered',
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
</script>

<style></style>
