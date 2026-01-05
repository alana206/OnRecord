
import { Commitment, Status, Category } from './types';

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: '1',
    title: 'No Work Talk After 8 PM',
    description: 'Protecting evening quality time by removing professional distractions.',
    promisor: 'Alex',
    promisee: 'Jordan',
    category: Category.COUPLE,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    deadline: undefined,
    definitionOfDone: 'Phones away, no mentions of Slack or projects until 8 AM next day.',
    status: Status.MET,
    updates: [
      { id: 'u1', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, author: 'Jordan', note: 'Consistent for 3 days.' }
    ]
  },
  {
    id: '2',
    title: 'Therapy Appointment Booking',
    description: 'Commitment to finding a specialist and booking the first intake session.',
    promisor: 'Jordan',
    promisee: 'Alex',
    category: Category.COUPLE,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    deadline: Date.now() + 1000 * 60 * 60 * 24 * 2,
    definitionOfDone: 'Proof of booking and date shared.',
    status: Status.PENDING,
    updates: []
  },
  {
    id: '3',
    title: 'Child Pickup - Friday',
    description: 'Handle soccer practice pickup and dinner.',
    promisor: 'Sam',
    promisee: 'Taylor',
    category: Category.CO_PARENTING,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    deadline: Date.now() - 1000 * 60 * 60 * 24 * 1,
    definitionOfDone: 'Child is home by 7 PM fed and ready for sleep.',
    status: Status.BREACHED,
    updates: [
      { id: 'u2', timestamp: Date.now() - 1000 * 60 * 60 * 22, author: 'Taylor', note: 'Sam was 45 mins late. Child was distressed.' }
    ]
  },
  {
    id: '4',
    title: 'Weekly Budget Review',
    description: 'Review expenses and upcoming bills for the month.',
    promisor: 'Both',
    promisee: 'Household',
    category: Category.PERSONAL,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    deadline: Date.now() + 1000 * 60 * 60 * 2,
    definitionOfDone: 'Spreadsheet updated and consensus reached on discretionary spending.',
    status: Status.PENDING,
    updates: []
  }
];
