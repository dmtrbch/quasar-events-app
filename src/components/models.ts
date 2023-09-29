export interface Event {
  name: string;
  date: string;
  description: string;
  userId: string;
  id: string;
}

export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  events: string[];
  id?: string;
}
