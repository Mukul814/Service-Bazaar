import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, 'data');
const SERVICES_FILE = join(DATA_DIR, 'services.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const seedServices = [
  {
    id: '1',
    name: 'Home Plumbing',
    description: 'Professional plumbing services for your home including repairs, installations, and maintenance.',
    rate: 500,
    currency: 'INR',
    iconUrl: '🔧'
  },
  {
    id: '2',
    name: 'Electrical Services',
    description: 'Complete electrical solutions including wiring, repairs, and installations by certified electricians.',
    rate: 750,
    currency: 'INR',
    iconUrl: '⚡'
  },
  {
    id: '3',
    name: 'House Cleaning',
    description: 'Deep cleaning services for your home with eco-friendly products and professional staff.',
    rate: 800,
    currency: 'INR',
    iconUrl: '🧹'
  },
  {
    id: '4',
    name: 'AC Repair & Service',
    description: 'Air conditioning repair, maintenance, and installation services for all brands.',
    rate: 650,
    currency: 'INR',
    iconUrl: '❄️'
  },
  {
    id: '5',
    name: 'Pest Control',
    description: 'Safe and effective pest control services for homes and offices using eco-friendly methods.',
    rate: 1200,
    currency: 'INR',
    iconUrl: '🐛'
  }
];

try {
  fs.writeFileSync(SERVICES_FILE, JSON.stringify(seedServices, null, 2));
  console.log('✅ Successfully seeded 5 services to the database!');
  console.log('Services added:');
  seedServices.forEach(service => {
    console.log(`- ${service.name} (₹${service.rate})`);
  });
} catch (error) {
  console.error('❌ Error seeding services:', error);
}