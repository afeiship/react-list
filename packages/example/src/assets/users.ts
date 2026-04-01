/**
 * Mock user data for demos.
 */

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  avatar?: string;
}

export const users: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    age: 28,
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    age: 34,
    avatar: 'https://randomuser.me/api/portraits/lego/2.jpg'
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol.williams@example.com',
    age: 25,
    avatar: 'https://randomuser.me/api/portraits/lego/3.jpg'
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david.brown@example.com',
    age: 42,
    avatar: 'https://randomuser.me/api/portraits/lego/4.jpg'
  },
  {
    id: 5,
    name: 'Eve Davis',
    email: 'eve.davis@example.com',
    age: 31,
    avatar: 'https://randomuser.me/api/portraits/lego/5.jpg'
  }
];

export const emptyUsers: User[] = [];
