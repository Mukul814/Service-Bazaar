import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Simple file-based database (replace with MongoDB in production)
const DATA_DIR = join(__dirname, 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const SERVICES_FILE = join(DATA_DIR, 'services.json');
const BOOKINGS_FILE = join(DATA_DIR, 'bookings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
const initFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initFile(USERS_FILE, []);
initFile(SERVICES_FILE, []);
initFile(BOOKINGS_FILE, []);

// Database helpers
const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readData(USERS_FILE);
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser);
    writeData(USERS_FILE, users);

    const token = jwt.sign({ id: newUser.id, email, role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: newUser.id, email, role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const users = readData(USERS_FILE);
    const user = users.find(u => u.email === email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Service Routes
app.get('/api/services', (req, res) => {
  const services = readData(SERVICES_FILE);
  res.json(services);
});

app.post('/api/services', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const { name, description, rate, iconUrl } = req.body;
    
    if (!name || !description || !rate) {
      return res.status(400).json({ message: 'Name, description, and rate are required' });
    }

    const services = readData(SERVICES_FILE);
    const newService = {
      id: Date.now().toString(),
      name,
      description,
      rate: Number(rate),
      currency: 'INR',
      iconUrl: iconUrl || '🔧'
    };

    services.push(newService);
    writeData(SERVICES_FILE, services);

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/services/:id', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rate, iconUrl } = req.body;
    
    const services = readData(SERVICES_FILE);
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({ message: 'Service not found' });
    }

    services[serviceIndex] = {
      ...services[serviceIndex],
      name: name || services[serviceIndex].name,
      description: description || services[serviceIndex].description,
      rate: rate ? Number(rate) : services[serviceIndex].rate,
      iconUrl: iconUrl || services[serviceIndex].iconUrl
    };

    writeData(SERVICES_FILE, services);
    res.json(services[serviceIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/services/:id', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const { id } = req.params;
    
    const services = readData(SERVICES_FILE);
    const filteredServices = services.filter(s => s.id !== id);
    
    if (services.length === filteredServices.length) {
      return res.status(404).json({ message: 'Service not found' });
    }

    writeData(SERVICES_FILE, filteredServices);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Booking Routes
app.post('/api/bookings', authenticateToken, requireRole('user'), (req, res) => {
  try {
    const { serviceId, notes } = req.body;
    
    const services = readData(SERVICES_FILE);
    const service = services.find(s => s.id === serviceId);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const bookings = readData(BOOKINGS_FILE);
    const newBooking = {
      id: Date.now().toString(),
      userId: req.user.id,
      serviceId,
      serviceName: service.name,
      rate: service.rate,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    writeData(BOOKINGS_FILE, bookings);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});