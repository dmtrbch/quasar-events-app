import { defineStore } from 'pinia';
import { User } from 'src/components/models';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    authId: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    authUserUnsubscribe: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    authObserverUnsubscribe: () => {},
  }),
  getters: {
    authUser: (state) => {
      const user = state.users
        ? state.users.find((u) => u.id === state.authId)
        : null;

      if (!user) return null;
      return user;
    },
  },
  actions: {
    async registerUserWithEmailAndPassword({
      firstname,
      lastname,
      username,
      email,
      password,
    }: {
      firstname: string;
      lastname: string;
      username: string;
      email: string;
      password: string;
    }) {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (result.user?.uid) {
        await this.createUser({
          id: result.user?.uid,
          firstname,
          lastname,
          username,
          email,
        });
      }
    },
    async signInWithEmailAndPassword({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) {
      return await firebase.auth().signInWithEmailAndPassword(email, password);
    },
    async signOut() {
      await firebase.auth().signOut();
      this.authId = '';
    },
    async fetchUsers() {
      console.log('🔥', '🙋', 'all');

      const users = await firebase.firestore().collection('users').get();

      users.forEach((user) => {
        const userData = { ...user.data(), id: user.id };
        const userIndex = this.users.findIndex((u) => u.id === userData.id);

        if (userData.id && userIndex !== -1)
          this.users[userIndex] = userData as User;
        else this.users.push(userData as User);
      });
    },

    async createUser({
      id,
      firstname,
      lastname,
      username,
      email,
    }: {
      id: string;
      firstname: string;
      lastname: string;
      username: string;
      email: string;
    }) {
      username = username.toLowerCase();
      email = email.toLowerCase();

      const userEvents: string[] = [];
      const user: User = {
        firstname,
        lastname,
        username,
        email,
        events: userEvents,
      };

      const userRef = await firebase.firestore().collection('users').doc(id);
      userRef.set(user);

      const newUser = await userRef.get();
      this.users.push(newUser as unknown as User);
    },
    initAuthentication() {
      this.unsubscribeAuthObserverSnapshot();

      return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          this.unsubscribeAuthUserSnapshot();
          if (user) {
            await this.fetchAuthUser();
            resolve(user);
          } else {
            resolve(null);
          }
        });

        this.authObserverUnsubscribe = unsubscribe;
      });
    },
    async fetchAuthUser() {
      const userId = firebase.auth().currentUser?.uid;

      if (!userId) return;

      return new Promise((resolve) => {
        const unsubscribe = firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .onSnapshot((doc) => {
            const user = { ...doc.data(), id: doc.id };

            const userIndex = this.users.findIndex((i) => i.id === userId);
            if (userId && userIndex !== -1) {
              this.users[userIndex] = user as User;
            } else this.users.push(user as User);

            // authuserunsubscribe

            this.authId = userId;

            //unsubscribe(); // TODO: maybe remove this
            resolve(user);
          });

        this.authUserUnsubscribe = unsubscribe;
      });
    },
    async unsubscribeAuthUserSnapshot() {
      if (this.authUserUnsubscribe) {
        this.authUserUnsubscribe();
        this.authUserUnsubscribe = () => ({});
      }
    },
    async unsubscribeAuthObserverSnapshot() {
      if (this.authObserverUnsubscribe) {
        this.authObserverUnsubscribe();
        this.authObserverUnsubscribe = () => ({});
      }
    },
  },
});
