import { importData } from '../services/StorageService';

export const DEMO_INSTRUCTIONS = [
  {
    id: '1',
    title: 'Montaż łóżka SleepComfort',
    category: 'Meble',
    image: null,
    steps: [
      {
        id: '1-1',
        description:
          'Przygotuj wszystkie elementy łóżka i rozłóż je na podłodze w dobrze oświetlonym miejscu.',
        order: 1,
      },
      {
        id: '1-2',
        description:
          'Zmontuj boczne panele łóżka, używając śrub i nakrętek z zestawu.',
        order: 2,
      },
      {
        id: '1-3',
        description: 'Zamontuj nogi łóżka w przygotowanych otworach.',
        order: 3,
      },
      {
        id: '1-4',
        description: 'Umieść materac na podstawie łóżka.',
        order: 4,
      },
      {
        id: '1-5',
        description: 'Sprawdź stabilność łóżka – nie powinno się chwiać.',
        order: 5,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Instalacja kuchenki mikrofalowej',
    category: 'Kuchnia',
    image: null,
    steps: [
      {
        id: '2-1',
        description:
          'Rozpakuj kuchenkę mikrofalową i usuń wszystkie materiały ochronne.',
        order: 1,
      },
      {
        id: '2-2',
        description:
          'Umieść mikrofalówkę na równej powierzchni w dobrze wentylowanym miejscu.',
        order: 2,
      },
      {
        id: '2-3',
        description:
          'Zachowaj odstęp minimum 10 cm z każdej strony dla prawidłowej cyrkulacji powietrza.',
        order: 3,
      },
      {
        id: '2-4',
        description: 'Podłącz urządzenie do sieci elektrycznej (220V, 50Hz).',
        order: 4,
      },
      {
        id: '2-5',
        description: 'Ustaw godzinę i datę za pomocą panelu sterowania.',
        order: 5,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Podłączenie pralki',
    category: 'Łazienka',
    image: null,
    steps: [
      {
        id: '3-1',
        description: 'Wyjmij pralkę z opakowania i usuń śruby transportowe.',
        order: 1,
      },
      {
        id: '3-2',
        description:
          'Ustaw pralkę na równej powierzchni i wypoziomuj ją za pomocą regulowanych nóżek.',
        order: 2,
      },
      {
        id: '3-3',
        description: 'Podłącz wąż doprowadzający wodę do instalacji wodnej.',
        order: 3,
      },
      {
        id: '3-4',
        description: 'Umieść wąż odpływowy w odpływie lub w umywalce.',
        order: 4,
      },
      {
        id: '3-5',
        description:
          'Podłącz pralkę do prądu, używając zabezpieczenia różnicowoprądowego.',
        order: 5,
      },
      {
        id: '3-6',
        description:
          'Uruchom cykl testowy bez prania, aby sprawdzić szczelność.',
        order: 6,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const loadDemoData = async (userId) => {
  if (!userId) return false;
  return await importData(userId, DEMO_INSTRUCTIONS);
};