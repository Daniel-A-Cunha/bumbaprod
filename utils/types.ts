export type StatusType = 'onTrack' | 'alert' | 'delayed';

export interface Allegory {
  id: string;
  name: string;
  status: StatusType;
  progress: {
    design: number;
    structure: number;
    painting: number;
    electrical: number;
    finishing: number;
  };
  description?: string;
  imageUrl?: string;
}

export type TaskStatus = 'todo' | 'inProgress' | 'done';
export type TaskSector = 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  sector: TaskSector;
  allegoryId: string;
  assignedTo: string[];
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  consumption: {
    allegoryId: string;
    amount: number;
  }[];
}

export interface Alert {
  id: string;
  type: 'task' | 'material' | 'bottleneck' | 'team';
  title: string;
  description: string;
  relatedId: string; // ID of related task, material, etc.
  createdAt: string; // ISO date string
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string; // ISO date string
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'worker';
  sector: TaskSector;
  avatar?: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  allegoryId: string;
  sectorId: string;
  timestamp: string; // ISO date string
  type: 'in' | 'out';
}