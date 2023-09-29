<template>
  <div class="q-pa-md">
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="warning" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure you want to delete this event?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="warning" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="warning"
            @click="deleteEvent"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-table
      title="Events"
      :rows="rows"
      :columns="columns"
      row-key="id"
      no-data-label="No events"
      :filter="filter"
      :filter-method="customFilter"
      :rows-per-page-options="[10]"
    >
      <template v-slot:top>
        <div style="width: 100%" class="row">
          <div class="col-6">
            <q-select
              style="padding-right: 10px"
              clearable
              dense
              v-model="userFilter"
              :options="options"
              emit-value
              map-options
              label="Filter by User"
            />
          </div>
          <div class="col-6">
            <q-input
              dense
              debounce="400"
              color="primary"
              label="Search by Name"
              v-model="eventSearch"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" v-if="props.row.userId == authId">
          <q-btn icon="mode_edit" @click="onEdit(props.row.id)"></q-btn>
          <q-btn icon="delete" @click="onDelete(props.row.id)"></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { Event, User } from './models';
import { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import { reactive, ref, computed } from 'vue';
import { useEventsStore } from 'src/stores/events-store';
import { useQuasar } from 'quasar';
import { useUsersStore } from 'src/stores/users-store';

interface UserFilter {
  label: string;
  value: string | undefined;
}

interface Props {
  events: Event[];
  users: User[];
}
const props = withDefaults(defineProps<Props>(), {
  events: () => [],
  users: () => [],
});

const userFilter = ref(null);
const eventSearch = ref('');

let options: UserFilter[] = reactive([]);

props.users.forEach((user) => {
  const fnObj: UserFilter = {
    label: `${user.firstname} ${user.lastname}`,
    value: user.id,
  };

  options.push(fnObj);
});

const columns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    required: true,
    sortable: true,
  },
  {
    name: 'descritption',
    label: 'Description',
    field: 'description',
    align: 'center',
    required: true,
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date',
    field: 'date',
    align: 'center',
    required: true,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Action',
    field: '',
    align: 'center',
  },
];
const rows = props.events;

const confirm = ref(false);
const eventIdForDelete = ref('');

const $q = useQuasar();
const router = useRouter();

const usersStore = useUsersStore();
const { authId } = usersStore;

const filter = computed(() => {
  return { user: userFilter.value, search: eventSearch.value };
});

function onEdit(id: string) {
  router.push({ name: 'EventEdit', params: { id } });
}

function onDelete(id: string) {
  confirm.value = true;
  eventIdForDelete.value = id;
}

function deleteEvent() {
  useEventsStore().deleteEvent(eventIdForDelete.value);

  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Event deleted',
  });
}

function customFilter(rows: Event[], terms: any) {
  let lowerSearch = filter.value.search
    ? filter.value.search.toLowerCase()
    : '';
  let userId = filter.value.user ? filter.value.user : null;

  const filteredData = rows.filter((data) => {
    let ans = false;

    let u = true;
    if (userId) {
      u = false;

      let u_value = data.userId;
      if (u_value === userId) u = true;
    }

    let s = true;
    if (lowerSearch != '') {
      s = false;
      let s_value = data.name;
      let s_lower = s_value.toLowerCase();

      if (s_lower.includes(lowerSearch)) s = true;
    }

    ans = false;

    if (u && s) ans = true;
    return ans;
  });

  return filteredData;
}
</script>
