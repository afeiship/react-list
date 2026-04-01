/**
 * Mock todo data for demos.
 */

export interface Todo {
  uuid: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export const todos: Todo[] = [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Review pull requests',
    completed: false,
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Update documentation',
    completed: true,
    priority: 'medium',
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    uuid: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Fix navigation bug',
    completed: false,
    priority: 'high',
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    uuid: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Design new landing page',
    completed: false,
    priority: 'low',
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    uuid: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Optimize database queries',
    completed: true,
    priority: 'medium',
    createdAt: '2024-01-11T11:00:00Z'
  }
];

export const emptyTodos: Todo[] = [];
