import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, 'data');
const SERVICES_FILE = join(DATA_DIR, 'services.json');

// Make sure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const serviceData = [
  {
    id: '1',
    name: 'Home Plumbing',
    description: 'Fix taps, leaks, wash basins — basically anything water related.',
    rate: 500,
    currency: 'INR',
    icon: '🔧'
  },
  {
    id: '2',
    name: 'Electrical',
    description: 'Wiring, fans, lights, small fixes etc.',
    rate: 700,
    currency: 'INR',
    icon: '⚡'
  },
  {
    id: '3',
    name: 'AC Service',
    description: 'AC not cooling? We got it.',
    rate: 650,
    currency: 'INR',
    icon: '❄️'
  },
  {
    id: '4',
    name: 'House Cleaning',
    description: 'Full home cleaning with desi & safe products.',
    rate: 800,
    currency: 'INR',
    icon: '🧹'
  },
  {
    id: '5',
    name: 'Pest Control',
    description: 'Don’t let bugs rule your house.',
    rate: 1200,
    currency: 'INR',
    icon: '🐛'
  },
  {
    id: '6',
    name: 'Laundry Pick-up',
    rate: 300,
    currency: 'INR'
    
  }
];
// TODO: Add more services later maybe

try {
  fs.writeFileSync(SERVICES_FILE, JSON.stringify(serviceData, null, 2));
  console.log('✅ Done! Some sample services pushed 😎');
} catch (err) {
  console.error('Something broke while saving services:', err);
}
