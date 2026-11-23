import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Users store
let users = [
  { id: 'usr-1', fullName: 'Alex Rivera', email: 'student@easelabs.edu', role: 'student', department: 'Computer Science and Engineering', studentOrStaffId: 'CSE-2026-889' },
  { id: 'usr-2', fullName: 'Dr. Elena Vance', email: 'faculty@easelabs.edu', role: 'faculty', department: 'Electronics and Communication', studentOrStaffId: 'FAC-9012' },
  { id: 'usr-3', fullName: 'Marcus Sterling', email: 'admin@easelabs.edu', role: 'lab_admin', department: 'Central Equipment Operations', studentOrStaffId: 'ADM-3341' },
  { id: 'usr-4', fullName: 'Director Sophia Thorne', email: 'super@easelabs.edu', role: 'super_admin', department: 'Campus Executive Directorate', studentOrStaffId: 'DIR-0001' }
];

// Departments
const departments = [
  { id: 'dept-cse', name: 'Computer Science and Engineering (CSE)', description: 'Computing, software development, networking, and algorithmic research facilities.' },
  { id: 'dept-ece', name: 'Electronics and Communication (ECE)', description: 'Embedded systems, microcontrollers, IoT, digital circuits, and signal processing.' },
  { id: 'dept-mech', name: 'Mechanical and Manufacturing Engineering', description: 'CAD/CAM design suites, material stress testing, and advanced robotics arenas.' }
];

// 13 Laboratories
let laboratories = [
  { id: 'lab-1', name: 'Computer Programming Laboratory', departmentId: 'dept-cse', departmentName: 'Computer Science and Engineering (CSE)', description: 'Foundational programming and syntax training facility.', equipmentCount: 2, status: 'operational', utilisation: 74, location: 'Block A, Floor 2' },
  { id: 'lab-2', name: 'Python & Data Structures Laboratory', departmentId: 'dept-cse', departmentName: 'Computer Science and Engineering (CSE)', description: 'Algorithm analysis, python development, and data structuring suites.', equipmentCount: 2, status: 'operational', utilisation: 85, location: 'Block A, Floor 2' },
  { id: 'lab-3', name: 'Logic Design Laboratory', departmentId: 'dept-cse', departmentName: 'Computer Science and Engineering (CSE)', description: 'Hardware logic gates, trainer kits, and breadboard circuit prototyping.', equipmentCount: 4, status: 'operational', utilisation: 68, location: 'Block A, Floor 3' },
  { id: 'lab-4', name: 'Database Systems Laboratory', departmentId: 'dept-cse', departmentName: 'Computer Science and Engineering (CSE)', description: 'High-performance database management and querying clusters.', equipmentCount: 2, status: 'operational', utilisation: 70, location: 'Block B, Floor 1' },
  { id: 'lab-5', name: 'Computer Networks Laboratory', departmentId: 'dept-cse', departmentName: 'Computer Science and Engineering (CSE)', description: 'Enterprise routers, switches, and network protocol analyzers.', equipmentCount: 4, status: 'operational', utilisation: 82, location: 'Block B, Floor 2' },
  { id: 'lab-6', name: 'Software Development Laboratory', departmentId: 'dept-cse', departmentName: 'Computer Science and Engineering (CSE)', description: 'Full-stack software engineering and collaborative coding environments.', equipmentCount: 2, status: 'operational', utilisation: 90, location: 'Block B, Floor 3' },
  { id: 'lab-7', name: 'Basic Electronics Laboratory', departmentId: 'dept-ece', departmentName: 'Electronics and Communication (ECE)', description: 'Analog circuits, passive components, and regulated power supplies.', equipmentCount: 5, status: 'operational', utilisation: 65, location: 'Block C, Floor 1' },
  { id: 'lab-8', name: 'Digital Circuits & Microcontroller Laboratory', departmentId: 'dept-ece', departmentName: 'Electronics and Communication (ECE)', description: 'Microcontroller programming and digital trainer kits.', equipmentCount: 3, status: 'operational', utilisation: 76, location: 'Block C, Floor 2' },
  { id: 'lab-9', name: 'Embedded Systems & IoT Laboratory', departmentId: 'dept-ece', departmentName: 'Electronics and Communication (ECE)', description: 'Wireless sensors, ESP32 boards, and cloud IoT connected testbeds.', equipmentCount: 4, status: 'operational', utilisation: 88, location: 'Block C, Floor 3' },
  { id: 'lab-10', name: 'Project Laboratory', departmentId: 'dept-ece', departmentName: 'Electronics and Communication (ECE)', description: 'PCB soldering stations, prototyping tools, and custom build benches.', equipmentCount: 4, status: 'operational', utilisation: 79, location: 'Block C, Floor 4' },
  { id: 'lab-11', name: 'CAD/CAM Laboratory', departmentId: 'dept-mech', departmentName: 'Mechanical and Manufacturing Engineering', description: 'Advanced computer-aided engineering and 3D solid modeling stations.', equipmentCount: 2, status: 'operational', utilisation: 92, location: 'Block D, Floor 1' },
  { id: 'lab-12', name: 'Material Testing Laboratory', departmentId: 'dept-mech', departmentName: 'Mechanical and Manufacturing Engineering', description: 'Tensile, compression, and material hardness testing rigs.', equipmentCount: 2, status: 'operational', utilisation: 60, location: 'Block D, Floor 2' },
  { id: 'lab-13', name: 'Robotics Laboratory', departmentId: 'dept-mech', departmentName: 'Mechanical and Manufacturing Engineering', description: 'Industrial robotic arms, mobile platforms, and servo kinematics kits.', equipmentCount: 4, status: 'operational', utilisation: 86, location: 'Block D, Floor 3' }
];

// Equipment Catalog mapped to labs
let equipmentList = [
  // Lab 1
  { id: 'eq-101', name: 'Desktop Computers', category: 'Computing', labId: 'lab-1', labName: 'Computer Programming Laboratory', totalQuantity: 30, availableQuantity: 24, status: 'available', specs: 'Intel i7, 16GB RAM, 512GB SSD', location: 'Lab 1, Bench 1-15' },
  { id: 'eq-102', name: 'Programming Workstations', category: 'Computing', labId: 'lab-1', labName: 'Computer Programming Laboratory', totalQuantity: 10, availableQuantity: 8, status: 'available', specs: 'Multi-core developer rig with dual monitors', location: 'Lab 1, Perimeter' },
  // Lab 2
  { id: 'eq-201', name: 'Desktop Computers', category: 'Computing', labId: 'lab-2', labName: 'Python & Data Structures Laboratory', totalQuantity: 30, availableQuantity: 20, status: 'available', specs: 'Intel i7, Python Anaconda & Jupyter pre-loaded', location: 'Lab 2, Row A' },
  { id: 'eq-202', name: 'Python Development Workstations', category: 'Computing', labId: 'lab-2', labName: 'Python & Data Structures Laboratory', totalQuantity: 12, availableQuantity: 10, status: 'available', specs: 'GPU accelerated nodes for data analysis', location: 'Lab 2, Row B' },
  // Lab 3
  { id: 'eq-301', name: 'Digital Trainer Kits', category: 'Hardware', labId: 'lab-3', labName: 'Logic Design Laboratory', totalQuantity: 25, availableQuantity: 18, status: 'available', specs: 'Built-in DC power, clock generator, logic switches', location: 'Cabinet 3A' },
  { id: 'eq-302', name: 'Logic Gate ICs', category: 'Components', labId: 'lab-3', labName: 'Logic Design Laboratory', totalQuantity: 150, availableQuantity: 120, status: 'available', specs: 'TTL 74 series (AND, OR, NOT, NAND, XOR)', location: 'Component Tray 3' },
  { id: 'eq-303', name: 'Breadboards', category: 'Tools', labId: 'lab-3', labName: 'Logic Design Laboratory', totalQuantity: 50, availableQuantity: 42, status: 'available', specs: '830 tie-point solderless breadboards', location: 'Shelf 3B' },
  { id: 'eq-304', name: 'Digital Multimeters', category: 'Instruments', labId: 'lab-3', labName: 'Logic Design Laboratory', totalQuantity: 20, availableQuantity: 15, status: 'available', specs: 'Auto-ranging digital multimeters with backlit LCD', location: 'Instrument Rack 1' },
  // Lab 4
  { id: 'eq-401', name: 'Desktop Computers', category: 'Computing', labId: 'lab-4', labName: 'Database Systems Laboratory', totalQuantity: 30, availableQuantity: 25, status: 'available', specs: 'PostgreSQL & MySQL enterprise client nodes', location: 'Lab 4, Station 1-30' },
  { id: 'eq-402', name: 'Database Development Workstations', category: 'Computing', labId: 'lab-4', labName: 'Database Systems Laboratory', totalQuantity: 8, availableQuantity: 6, status: 'available', specs: 'Dedicated database server testing rigs', location: 'Server Bay B' },
  // Lab 5
  { id: 'eq-501', name: 'Routers', category: 'Networking', labId: 'lab-5', labName: 'Computer Networks Laboratory', totalQuantity: 15, availableQuantity: 11, status: 'available', specs: 'Cisco ISR 4321 enterprise routers', location: 'Rack A1' },
  { id: 'eq-502', name: 'Network Switches', category: 'Networking', labId: 'lab-5', labName: 'Computer Networks Laboratory', totalQuantity: 15, availableQuantity: 12, status: 'available', specs: 'Cisco Catalyst 2960 24-Port Managed Switch', location: 'Rack A2' },
  { id: 'eq-503', name: 'Ethernet Cables', category: 'Accessories', labId: 'lab-5', labName: 'Computer Networks Laboratory', totalQuantity: 100, availableQuantity: 85, status: 'available', specs: 'Cat6 patch cables (various lengths)', location: 'Bin 5C' },
  { id: 'eq-504', name: 'Crimping Tools', category: 'Tools', labId: 'lab-5', labName: 'Computer Networks Laboratory', totalQuantity: 20, availableQuantity: 18, status: 'available', specs: 'Ratchet RJ45/RJ11 crimpers', location: 'Tool Cabinet 2' },
  // Lab 6
  { id: 'eq-601', name: 'Desktop Computers', category: 'Computing', labId: 'lab-6', labName: 'Software Development Laboratory', totalQuantity: 35, availableQuantity: 28, status: 'available', specs: 'Apple Mac & Linux dual boot developer suites', location: 'Lab 6, Stations' },
  { id: 'eq-602', name: 'Development Workstations', category: 'Computing', labId: 'lab-6', labName: 'Software Development Laboratory', totalQuantity: 12, availableQuantity: 9, status: 'available', specs: 'High memory rigs for containerized microservices', location: 'Lab 6, Pods' },
  // Lab 7
  { id: 'eq-701', name: 'Breadboards', category: 'Tools', labId: 'lab-7', labName: 'Basic Electronics Laboratory', totalQuantity: 60, availableQuantity: 50, status: 'available', specs: 'Standard solderless prototyping boards', location: 'Cabinet 7A' },
  { id: 'eq-702', name: 'Resistors and Capacitors', category: 'Components', labId: 'lab-7', labName: 'Basic Electronics Laboratory', totalQuantity: 500, availableQuantity: 420, status: 'available', specs: 'Assorted passive component kits', location: 'Drawer 7B' },
  { id: 'eq-703', name: 'LEDs', category: 'Components', labId: 'lab-7', labName: 'Basic Electronics Laboratory', totalQuantity: 300, availableQuantity: 260, status: 'available', specs: 'Assorted 5mm indicator LEDs', location: 'Drawer 7C' },
  { id: 'eq-704', name: 'Digital Multimeters', category: 'Instruments', labId: 'lab-7', labName: 'Basic Electronics Laboratory', totalQuantity: 25, availableQuantity: 20, status: 'available', specs: 'Handheld digital multimeters', location: 'Rack 7' },
  { id: 'eq-705', name: 'Power Supplies', category: 'Instruments', labId: 'lab-7', labName: 'Basic Electronics Laboratory', totalQuantity: 15, availableQuantity: 12, status: 'available', specs: 'Dual output DC regulated power supply (0-30V)', location: 'Bench 7' },
  // Lab 8
  { id: 'eq-801', name: 'Arduino Boards', category: 'Microcontrollers', labId: 'lab-8', labName: 'Digital Circuits & Microcontroller Laboratory', totalQuantity: 30, availableQuantity: 24, status: 'available', specs: 'Arduino Uno R3 with USB cables', location: 'Cabinet 8A' },
  { id: 'eq-802', name: 'Microcontroller Development Kits', category: 'Microcontrollers', labId: 'lab-8', labName: 'Digital Circuits & Microcontroller Laboratory', totalQuantity: 15, availableQuantity: 12, status: 'available', specs: 'STM32 Nucleo & AVR evaluation boards', location: 'Cabinet 8B' },
  { id: 'eq-803', name: 'Digital Trainer Kits', category: 'Hardware', labId: 'lab-8', labName: 'Digital Circuits & Microcontroller Laboratory', totalQuantity: 15, availableQuantity: 11, status: 'available', specs: 'Microprocessor 8085/8086 trainer kits', location: 'Rack 8' },
  // Lab 9
  { id: 'eq-901', name: 'ESP32 Boards', category: 'IoT', labId: 'lab-9', labName: 'Embedded Systems & IoT Laboratory', totalQuantity: 35, availableQuantity: 28, status: 'available', specs: 'ESP32 NodeMCU Wi-Fi & Bluetooth modules', location: 'IoT Bin 1' },
  { id: 'eq-902', name: 'Arduino Kits', category: 'IoT', labId: 'lab-9', labName: 'Embedded Systems & IoT Laboratory', totalQuantity: 25, availableQuantity: 20, status: 'available', specs: 'Arduino sensor starter kits', location: 'IoT Bin 2' },
  { id: 'eq-903', name: 'Sensors', category: 'Components', labId: 'lab-9', labName: 'Embedded Systems & IoT Laboratory', totalQuantity: 100, availableQuantity: 82, status: 'available', specs: 'DHT11, Ultrasonic, PIR, LDR sensors', location: 'Sensor Tray 9' },
  { id: 'eq-904', name: 'IoT Development Kits', category: 'IoT', labId: 'lab-9', labName: 'Embedded Systems & IoT Laboratory', totalQuantity: 10, availableQuantity: 7, status: 'available', specs: 'Cloud connected gateway development modules', location: 'Shelf 9' },
  // Lab 10
  { id: 'eq-1001', name: 'Soldering Stations', category: 'Tools', labId: 'lab-10', labName: 'Project Laboratory', totalQuantity: 20, availableQuantity: 16, status: 'available', specs: 'Temperature controlled ESD safe soldering stations', location: 'Station 1-20' },
  { id: 'eq-1002', name: 'Breadboards', category: 'Tools', labId: 'lab-10', labName: 'Project Laboratory', totalQuantity: 40, availableQuantity: 32, status: 'available', specs: 'Large prototyping breadboards', location: 'Shelf 10A' },
  { id: 'eq-1003', name: 'Electronic Components', category: 'Components', labId: 'lab-10', labName: 'Project Laboratory', totalQuantity: 200, availableQuantity: 170, status: 'available', specs: 'Assorted ICs, transistors, diodes', location: 'Parts Cabinet' },
  { id: 'eq-1004', name: 'Prototype Development Kits', category: 'Tools', labId: 'lab-10', labName: 'Project Laboratory', totalQuantity: 12, availableQuantity: 9, status: 'available', specs: 'Universal PCB prototyping bundles', location: 'Rack 10' },
  // Lab 11
  { id: 'eq-1101', name: 'CAD Workstations', category: 'Computing', labId: 'lab-11', labName: 'CAD/CAM Laboratory', totalQuantity: 25, availableQuantity: 19, status: 'available', specs: 'High-end CAD towers, NVIDIA RTX graphics', location: 'Lab 11, Stations' },
  { id: 'eq-1102', name: '3D Modelling Software Access', category: 'Software', labId: 'lab-11', labName: 'CAD/CAM Laboratory', totalQuantity: 30, availableQuantity: 25, status: 'available', specs: 'SolidWorks, AutoCAD & CATIA campus licenses', location: 'Network Server' },
  // Lab 12
  { id: 'eq-1201', name: 'Hardness Testing Equipment', category: 'Testing', labId: 'lab-12', labName: 'Material Testing Laboratory', totalQuantity: 3, availableQuantity: 2, status: 'available', specs: 'Rockwell and Brinell hardness testers', location: 'Bay 12A' },
  { id: 'eq-1202', name: 'Tensile Testing Equipment', category: 'Testing', labId: 'lab-12', labName: 'Material Testing Laboratory', totalQuantity: 2, availableQuantity: 1, status: 'available', specs: 'Universal testing machine (50kN capacity)', location: 'Bay 12B' },
  // Lab 13
  { id: 'eq-1301', name: 'Educational Robotics Kits', category: 'Robotics', labId: 'lab-13', labName: 'Robotics Laboratory', totalQuantity: 15, availableQuantity: 12, status: 'available', specs: 'Modular robotic chassis and controllers', location: 'Robot Bay 1' },
  { id: 'eq-1302', name: 'Robotic Arms', category: 'Robotics', labId: 'lab-13', labName: 'Robotics Laboratory', totalQuantity: 6, availableQuantity: 4, status: 'available', specs: '6-axis articulated educational robotic arms', location: 'Robot Bay 2' },
  { id: 'eq-1303', name: 'Motor Driver Modules', category: 'Components', labId: 'lab-13', labName: 'Robotics Laboratory', totalQuantity: 30, availableQuantity: 26, status: 'available', specs: 'L298N and brushless ESC motor controllers', location: 'Drawer 13' },
  { id: 'eq-1304', name: 'Sensors', category: 'Components', labId: 'lab-13', labName: 'Robotics Laboratory', totalQuantity: 50, availableQuantity: 40, status: 'available', specs: 'LiDAR, IMU, and ultrasonic obstacle sensors', location: 'Sensor Cabinet 13' }
];

let bookings = [
  { id: 'bk-1', equipmentId: 'eq-101', equipmentName: 'Desktop Computers', userId: 'usr-1', userName: 'Alex Rivera', userRole: 'student', startDate: '2026-03-10', endDate: '2026-03-12', timeSlot: '09:00 - 13:00', quantity: 2, status: 'approved', projectTitle: 'Algorithm Complexity Benchmarking', purpose: 'Testing sorting algorithms on local compute.' },
  { id: 'bk-2', equipmentId: 'eq-301', equipmentName: 'Digital Trainer Kits', userId: 'usr-1', userName: 'Alex Rivera', userRole: 'student', startDate: '2026-03-15', endDate: '2026-03-16', timeSlot: '14:00 - 18:00', quantity: 1, status: 'pending', projectTitle: 'Combinational Logic Circuit Design', purpose: 'Logic design lab assignment verification.' }
];

let maintenanceRecords = [
  { id: 'mnt-1', equipmentId: 'eq-1202', equipmentName: 'Tensile Testing Equipment', issue: 'Hydraulic pressure calibration due', status: 'reported', loggedDate: '2026-03-01' }
];

let labShareItems = [
  {
    id: 'ls-1',
    userId: 'usr-1',
    studentName: 'Alex Rivera',
    academicYear: '3rd Year' as const,
    branch: 'Computer Science and Engineering',
    section: 'A',
    contactNumber: '+1 (555) 234-5678',
    itemName: 'Standard Laboratory Coat (White)',
    category: 'Lab Coats' as const,
    description: 'Cotton lab coat size M, pristine condition worn only twice for chemistry labs.',
    condition: 'Good' as const,
    sharingType: 'Free Giveaway' as const,
    imageUrl: '',
    status: 'available' as const,
    createdAt: '2026-03-01'
  },
  {
    id: 'ls-2',
    userId: 'usr-1',
    studentName: 'Alex Rivera',
    academicYear: '3rd Year' as const,
    branch: 'Computer Science and Engineering',
    section: 'A',
    contactNumber: '+1 (555) 234-5678',
    itemName: 'Arduino Starter Kit with Sensors',
    category: 'Electronics Components' as const,
    description: 'Complete Arduino Uno R3 kit with breadboard, jumper wires, and assorted sensors.',
    condition: 'New' as const,
    sharingType: 'Available for Lending' as const,
    imageUrl: '',
    status: 'available' as const,
    createdAt: '2026-03-05'
  }
];

// LabShare endpoints
app.get('/api/labshare/items', (req, res) => {
  res.json(labShareItems);
});

app.post('/api/labshare/items', (req, res) => {
  const newItem = {
    id: 'ls-' + Date.now(),
    status: 'available' as const,
    createdAt: new Date().toISOString().split('T')[0],
    ...req.body
  };
  labShareItems.unshift(newItem);
  res.json({ success: true, item: newItem });
});

app.put('/api/labshare/items/:id', (req, res) => {
  const { id } = req.params;
  const index = labShareItems.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  labShareItems[index] = { ...labShareItems[index], ...req.body };
  res.json({ success: true, item: labShareItems[index] });
});

app.delete('/api/labshare/items/:id', (req, res) => {
  const { id } = req.params;
  labShareItems = labShareItems.filter(i => i.id !== id);
  res.json({ success: true });
});

app.patch('/api/labshare/items/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const item = labShareItems.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  item.status = status;
  res.json({ success: true, item });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid institutional email or password.' });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ error: `Access denied. Account is registered as ${user.role}, not ${role}.` });
  }

  res.json({ success: true, user: { ...user, token: 'easelabs-token-' + Date.now() } });
});

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password, department, role, studentOrStaffId } = req.body;
  
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: 'All mandatory registration fields are required.' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this institutional email already exists.' });
  }

  const assignedRole = role === 'super_admin' ? 'student' : role;

  const newUser = {
    id: 'usr-' + (users.length + 1),
    fullName,
    email,
    role: assignedRole,
    department: department || 'Computer Science and Engineering',
    studentOrStaffId: studentOrStaffId || 'ID-' + Math.floor(1000 + Math.random() * 9000),
    token: 'easelabs-token-' + Date.now()
  };

  users.push(newUser);
  res.json({ success: true, user: newUser });
});

// Departments & Labs endpoints
app.get('/api/departments', (req, res) => {
  res.json(departments);
});

app.get('/api/labs', (req, res) => {
  res.json(laboratories);
});

app.post('/api/labs', (req, res) => {
  const newLab = { id: 'lab-' + (laboratories.length + 1), equipmentCount: 0, utilisation: 50, ...req.body };
  laboratories.push(newLab);
  res.json({ success: true, lab: newLab });
});

app.put('/api/labs/:id', (req, res) => {
  const { id } = req.params;
  const index = laboratories.findIndex(l => l.id === id);
  if (index === -1) return res.status(404).json({ error: 'Laboratory not found' });
  laboratories[index] = { ...laboratories[index], ...req.body };
  res.json({ success: true, lab: laboratories[index] });
});

// Equipment endpoints
app.get('/api/equipment', (req, res) => {
  res.json(equipmentList);
});

app.post('/api/equipment', (req, res) => {
  const newEq = { id: 'eq-' + Date.now(), ...req.body };
  equipmentList.push(newEq);
  res.json({ success: true, equipment: newEq });
});

app.put('/api/equipment/:id', (req, res) => {
  const { id } = req.params;
  const index = equipmentList.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: 'Equipment not found' });
  equipmentList[index] = { ...equipmentList[index], ...req.body };
  res.json({ success: true, equipment: equipmentList[index] });
});

// Bookings endpoints with validation against double-booking / availability
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const { equipmentId, userId, userName, userRole, startDate, endDate, timeSlot, quantity, projectTitle, purpose } = req.body;
  const eq = equipmentList.find(e => e.id === equipmentId);
  
  if (!eq) {
    return res.status(404).json({ error: 'Equipment item not found.' });
  }

  const requestedQty = parseInt(quantity || 1, 10);
  if (requestedQty > eq.availableQuantity) {
    return res.status(400).json({ error: `Requested quantity (${requestedQty}) exceeds available inventory (${eq.availableQuantity}).` });
  }

  // Prevent double booking conflict check for same equipment in overlapping dates & timeslot
  const conflict = bookings.find(b => 
    b.equipmentId === equipmentId && 
    b.status !== 'rejected' && 
    b.status !== 'completed' &&
    b.timeSlot === timeSlot &&
    ((startDate >= b.startDate && startDate <= b.endDate) || (endDate >= b.startDate && endDate <= b.endDate))
  );

  if (conflict) {
    return res.status(400).json({ error: 'This equipment is already booked for the selected date and time slot.' });
  }

  const newBooking = {
    id: 'bk-' + Date.now(),
    equipmentId,
    equipmentName: eq.name,
    userId,
    userName,
    userRole,
    startDate,
    endDate,
    timeSlot: timeSlot || '09:00 - 13:00',
    quantity: requestedQty,
    status: userRole === 'faculty' || userRole === 'lab_admin' ? 'approved' : 'pending',
    projectTitle,
    purpose
  };

  // Temporarily deduct available quantity if approved
  if (newBooking.status === 'approved') {
    eq.availableQuantity = Math.max(0, eq.availableQuantity - requestedQty);
    if (eq.availableQuantity === 0) eq.status = 'booked';
  }

  bookings.push(newBooking);
  res.json({ success: true, booking: newBooking });
});

app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const eq = equipmentList.find(e => e.id === booking.equipmentId);

  if (status === 'approved' && booking.status !== 'approved' && eq) {
    eq.availableQuantity = Math.max(0, eq.availableQuantity - booking.quantity);
    if (eq.availableQuantity === 0) eq.status = 'booked';
  } else if (status === 'rejected' && booking.status === 'approved' && eq) {
    eq.availableQuantity = Math.min(eq.totalQuantity, eq.availableQuantity + booking.quantity);
    if (eq.availableQuantity > 0 && eq.status === 'booked') eq.status = 'available';
  }

  booking.status = status;
  res.json({ success: true, booking });
});

// Maintenance Records endpoints
app.get('/api/maintenance', (req, res) => {
  res.json(maintenanceRecords);
});

app.post('/api/maintenance', (req, res) => {
  const { equipmentId, issue } = req.body;
  const eq = equipmentList.find(e => e.id === equipmentId);
  const newMnt = {
    id: 'mnt-' + Date.now(),
    equipmentId,
    equipmentName: eq ? eq.name : 'Unknown Equipment',
    issue,
    status: 'reported',
    loggedDate: new Date().toISOString().split('T')[0]
  };
  if (eq) {
    eq.status = 'maintenance';
  }
  maintenanceRecords.push(newMnt);
  res.json({ success: true, record: newMnt });
});

// AI Assistant Endpoint using Gemini API
app.post('/api/ai-assistant', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: "You are the expert AI Laboratory Assistant for easeLabs, an intelligent campus resource sharing and laboratory management system. Help researchers, students, and lab administrators with equipment specs, lab safety protocols, department catalog guidance, and scheduling recommendations in a concise, professional, futuristic tone. Never mention any college or university names."
      }
    });
    res.json({ response: response.text || "easeLabs AI Assistant: How can I help you manage your laboratory resources today?" });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: err.message || 'AI assistant error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true }
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`easeLabs server running on http://0.0.0.0:${PORT}`);
});
