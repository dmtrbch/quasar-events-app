import { defineStore } from 'pinia';
import { Event } from 'src/components/models';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useUsersStore } from './users-store';

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [] as Event[],
  }),
  getters: {
    event: (state) => {
      return (id: string): Event => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const event: Event = state.events.find((event) => event.id === id)!;
        // if (!event) return {};
        return event;
      };
    },
  },
  actions: {
    async fetchEvents() {
      console.log('🔥', '🏷', 'all');

      const events = await firebase
        .firestore()
        .collection('events')
        .orderBy('date', 'desc')
        .get();

      events.forEach((event) => {
        const eventData = { ...event.data(), id: event.id };
        const eventIndex = this.events.findIndex((e) => e.id === eventData.id);

        if (eventData.id && eventIndex !== -1)
          this.events[eventIndex] = eventData as Event;
        else this.events.push(eventData as Event);
      });
    },
    async createEvent(name: string, description: string, date: string) {
      const event: Event = {} as Event;
      event.name = name;
      event.description = description;
      event.date = date;

      const usedId = useUsersStore().authId;
      event.userId = usedId;

      const eventRef = firebase.firestore().collection('events').doc();
      event.id = eventRef.id;

      const userRef = firebase.firestore().collection('users').doc(usedId);

      const batch = firebase.firestore().batch();
      batch.set(eventRef, event);
      // append event to user
      batch.update(userRef, {
        events: firebase.firestore.FieldValue.arrayUnion(eventRef.id),
      });
      await batch.commit();

      this.events = [];
    },
    async updateEvent(
      eventId: string,
      name: string,
      description: string,
      date: string
    ) {
      const event = this.events.find((e) => e.id === eventId);
      let newEvent = { ...event, name, description, date };

      const eventRef = firebase.firestore().collection('events').doc(eventId);
      await eventRef.update(newEvent);

      const serverData = await eventRef.get();
      newEvent = {
        ...serverData.data(),
        id: newEvent.id,
      } as Event;

      const eventIndex = this.events.findIndex((i) => i.id === newEvent.id);
      if (newEvent.id && eventIndex !== -1) {
        this.events[eventIndex] = newEvent as Event;
      } else this.events.push(newEvent as Event);
    },
    async deleteEvent(eventId: string) {
      const indexOfEventToDelete = this.events.findIndex(
        (i) => i.id === eventId
      );

      const event = this.events.find((e) => e.id === eventId);

      const eventRef = firebase.firestore().collection('events').doc(eventId);
      const userRef = firebase
        .firestore()
        .collection('users')
        .doc(event?.userId);

      const batch = firebase.firestore().batch();
      batch.delete(eventRef);
      // remove event from user
      batch.update(userRef, {
        events: firebase.firestore.FieldValue.arrayRemove(eventId),
      });
      await batch.commit();

      this.events.splice(indexOfEventToDelete, 1); // TODO: this is hacky, get realtime update from firebase
    },
  },
});
