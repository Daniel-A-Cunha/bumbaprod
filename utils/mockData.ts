import { Allegory, Task, Material, Alert, User, ChatMessage, CheckIn } from './types';

export const mockAllegories: Allegory[] = [
  {
    id: '1',
    name: 'Boto Encantado',
    status: 'onTrack',
    progress: {
      design: 100,
      structure: 85,
      painting: 70,
      electrical: 60,
      finishing: 30
    },
    description: 'Alegoria principal representando o boto encantado',
    imageUrl: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg'
  },
  {
    id: '2',
    name: 'Cunhã Poranga',
    status: 'alert',
    progress: {
      design: 100,
      structure: 90,
      painting: 60,
      electrical: 40,
      finishing: 20
    },
    description: 'Alegoria da personagem Cunhã Poranga',
    imageUrl: 'https://images.pexels.com/photos/2444429/pexels-photo-2444429.jpeg'
  },
  {
    id: '3',
    name: 'Pajé',
    status: 'delayed',
    progress: {
      design: 100,
      structure: 75,
      painting: 30,
      electrical: 20,
      finishing: 10
    },
    description: 'Alegoria representando o Pajé',
    imageUrl: 'https://images.pexels.com/photos/11418920/pexels-photo-11418920.jpeg'
  },
  {
    id: '4',
    name: 'Porta Estandarte',
    status: 'onTrack',
    progress: {
      design: 100,
      structure: 100,
      painting: 90,
      electrical: 80,
      finishing: 70
    },
    description: 'Alegoria do porta estandarte do boi',
    imageUrl: 'https://images.pexels.com/photos/8838888/pexels-photo-8838888.jpeg'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Finalizar estrutura de ferro do Boto',
    description: 'Soldagem da estrutura metálica principal do Boto Encantado',
    status: 'inProgress',
    sector: 'structure',
    allegoryId: '1',
    assignedTo: ['2', '3'],
    dueDate: '2025-06-10T00:00:00Z',
    createdAt: '2025-05-15T14:30:00Z',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Pintura base da Cunhã Poranga',
    description: 'Aplicação da primeira camada de tinta na alegoria',
    status: 'todo',
    sector: 'painting',
    allegoryId: '2',
    assignedTo: ['4'],
    dueDate: '2025-06-12T00:00:00Z',
    createdAt: '2025-05-16T09:15:00Z',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Instalação das luzes do Pajé',
    description: 'Montagem e teste do sistema de iluminação',
    status: 'todo',
    sector: 'electrical',
    allegoryId: '3',
    assignedTo: ['5', '6'],
    dueDate: '2025-06-15T00:00:00Z',
    createdAt: '2025-05-17T11:45:00Z',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Acabamento em isopor do Boto',
    description: 'Esculpir detalhes em isopor e aplicar acabamento',
    status: 'todo',
    sector: 'finishing',
    allegoryId: '1',
    assignedTo: ['7'],
    dueDate: '2025-06-18T00:00:00Z',
    createdAt: '2025-05-18T15:20:00Z',
    priority: 'low'
  },
  {
    id: '5',
    title: 'Revisão do projeto elétrico',
    description: 'Conferir toda a instalação elétrica das alegorias',
    status: 'done',
    sector: 'electrical',
    allegoryId: '4',
    assignedTo: ['5'],
    dueDate: '2025-06-05T00:00:00Z',
    createdAt: '2025-05-10T10:00:00Z',
    priority: 'high'
  },
  {
    id: '6',
    title: 'Compra de materiais para adereços',
    description: 'Adquirir penas, tecidos e outros materiais decorativos',
    status: 'done',
    sector: 'general',
    allegoryId: '2',
    assignedTo: ['1'],
    dueDate: '2025-06-01T00:00:00Z',
    createdAt: '2025-05-20T08:30:00Z',
    priority: 'medium'
  }
];

export const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'Tinta acrílica branca',
    category: 'Pintura',
    unit: 'Litro',
    currentStock: 25,
    minimumStock: 20,
    consumption: [
      { allegoryId: '1', amount: 10 },
      { allegoryId: '2', amount: 8 }
    ]
  },
  {
    id: '2',
    name: 'Ferro quadrado 20mm',
    category: 'Estrutura',
    unit: 'Metro',
    currentStock: 50,
    minimumStock: 100,
    consumption: [
      { allegoryId: '1', amount: 70 },
      { allegoryId: '3', amount: 45 }
    ]
  },
  {
    id: '3',
    name: 'Fio elétrico 2.5mm',
    category: 'Elétrica',
    unit: 'Metro',
    currentStock: 200,
    minimumStock: 150,
    consumption: [
      { allegoryId: '1', amount: 50 },
      { allegoryId: '2', amount: 30 },
      { allegoryId: '3', amount: 25 },
      { allegoryId: '4', amount: 40 }
    ]
  },
  {
    id: '4',
    name: 'Placas de isopor 100x50cm',
    category: 'Acabamento',
    unit: 'Unidade',
    currentStock: 15,
    minimumStock: 30,
    consumption: [
      { allegoryId: '1', amount: 12 },
      { allegoryId: '2', amount: 10 },
      { allegoryId: '3', amount: 8 }
    ]
  },
  {
    id: '5',
    name: 'Resina acrílica',
    category: 'Acabamento',
    unit: 'Kg',
    currentStock: 45,
    minimumStock: 40,
    consumption: [
      { allegoryId: '1', amount: 15 },
      { allegoryId: '4', amount: 10 }
    ]
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'material',
    title: 'Estoque baixo: Ferro quadrado 20mm',
    description: 'O estoque atual está abaixo do mínimo recomendado',
    relatedId: '2',
    createdAt: '2025-05-25T08:10:00Z',
    read: false,
    severity: 'critical'
  },
  {
    id: '2',
    type: 'task',
    title: 'Tarefa atrasada: Finalização da estrutura do Pajé',
    description: 'A tarefa está 2 dias atrasada',
    relatedId: '3',
    createdAt: '2025-05-26T10:30:00Z',
    read: true,
    severity: 'warning'
  },
  {
    id: '3',
    type: 'bottleneck',
    title: 'Gargalo identificado: Pintura',
    description: 'Múltiplas alegorias aguardando etapa de pintura',
    relatedId: '0',
    createdAt: '2025-05-27T14:15:00Z',
    read: false,
    severity: 'warning'
  },
  {
    id: '4',
    type: 'team',
    title: 'Equipe inativa: Elétrica',
    description: 'Nenhum check-in registrado nas últimas 24h',
    relatedId: '0',
    createdAt: '2025-05-28T07:45:00Z',
    read: false,
    severity: 'info'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    role: 'admin',
    sector: 'general',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  {
    id: '2',
    name: 'Roberto Santos',
    role: 'worker',
    sector: 'structure',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    role: 'worker',
    sector: 'structure',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'
  },
  {
    id: '4',
    name: 'Juliana Costa',
    role: 'worker',
    sector: 'painting',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
  },
  {
    id: '5',
    name: 'Marcos Pereira',
    role: 'worker',
    sector: 'electrical',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
  },
  {
    id: '6',
    name: 'Fernanda Lima',
    role: 'worker',
    sector: 'electrical',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  },
  {
    id: '7',
    name: 'Lucas Souza',
    role: 'worker',
    sector: 'finishing',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg'
  },
  {
    id: '8',
    name: 'Patricia Almeida',
    role: 'manager',
    sector: 'design',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Carlos Silva',
    message: 'Precisamos acelerar a produção da alegoria do Pajé',
    timestamp: '2025-05-27T09:30:00Z'
  },
  {
    id: '2',
    senderId: '5',
    senderName: 'Marcos Pereira',
    message: 'Estamos com problema na instalação elétrica do Boto',
    timestamp: '2025-05-27T09:35:00Z',
    imageUrl: 'https://images.pexels.com/photos/5584084/pexels-photo-5584084.jpeg'
  },
  {
    id: '3',
    senderId: '8',
    senderName: 'Patricia Almeida',
    message: 'Vou enviar os novos desenhos para a Cunhã Poranga hoje',
    timestamp: '2025-05-27T09:40:00Z'
  },
  {
    id: '4',
    senderId: '4',
    senderName: 'Juliana Costa',
    message: 'Precisamos de mais tinta azul para terminar o Boto',
    timestamp: '2025-05-27T09:45:00Z'
  },
  {
    id: '5',
    senderId: '1',
    senderName: 'Carlos Silva',
    message: 'Ok, vou providenciar mais material',
    timestamp: '2025-05-27T09:50:00Z'
  }
];

export const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    userId: '2',
    allegoryId: '1',
    sectorId: 'structure',
    timestamp: '2025-05-27T08:00:00Z',
    type: 'in'
  },
  {
    id: '2',
    userId: '3',
    allegoryId: '1',
    sectorId: 'structure',
    timestamp: '2025-05-27T08:05:00Z',
    type: 'in'
  },
  {
    id: '3',
    userId: '4',
    allegoryId: '2',
    sectorId: 'painting',
    timestamp: '2025-05-27T08:10:00Z',
    type: 'in'
  },
  {
    id: '4',
    userId: '2',
    allegoryId: '1',
    sectorId: 'structure',
    timestamp: '2025-05-27T17:00:00Z',
    type: 'out'
  },
  {
    id: '5',
    userId: '3',
    allegoryId: '1',
    sectorId: 'structure',
    timestamp: '2025-05-27T17:05:00Z',
    type: 'out'
  }
];

// Mock current user
export const currentUser: User = mockUsers[0];