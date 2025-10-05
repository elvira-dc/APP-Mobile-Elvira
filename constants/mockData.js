// Centralized Mock Data for Development
// This file contains all mock data used throughout the application
// In production, this data would come from your backend API

// Staff/Contact Data - Used across multiple components
export const MOCK_STAFF = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Reception Manager",
    department: "Reception",
    avatar: "👩‍💼",
    isOnline: true,
    phone: "+1234567890",
    email: "sarah.johnson@elvira.com",
    shift: "morning",
    status: "active",
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    position: "Maintenance Staff",
    department: "Housekeeping",
    avatar: "👨‍🔧",
    isOnline: true,
    phone: "+1234567891",
    email: "mike.rodriguez@elvira.com",
    shift: "afternoon",
    status: "active",
  },
  {
    id: 3,
    name: "Lisa Chen",
    position: "HR Manager",
    department: "Management",
    avatar: "👩‍💻",
    isOnline: false,
    phone: "+1234567892",
    email: "lisa.chen@elvira.com",
    shift: "morning",
    status: "active",
  },
  {
    id: 4,
    name: "Carlos Martinez",
    position: "Security Guard",
    department: "Security",
    avatar: "👨‍✈️",
    isOnline: true,
    phone: "+1234567893",
    email: "carlos.martinez@elvira.com",
    shift: "night",
    status: "active",
  },
  {
    id: 5,
    name: "Emma Davis",
    position: "Housekeeping Staff",
    department: "Housekeeping",
    avatar: "👩‍🏭",
    isOnline: false,
    phone: "+1234567894",
    email: "emma.davis@elvira.com",
    shift: "morning",
    status: "active",
  },
  {
    id: 6,
    name: "James Wilson",
    position: "Kitchen Staff",
    department: "Kitchen",
    avatar: "👨‍🍳",
    isOnline: true,
    phone: "+1234567895",
    email: "james.wilson@elvira.com",
    shift: "morning",
    status: "active",
  },
  {
    id: 7,
    name: "Anna Thompson",
    position: "Reception Staff",
    department: "Reception",
    avatar: "👩‍💼",
    isOnline: true,
    phone: "+1234567896",
    email: "anna.thompson@elvira.com",
    shift: "afternoon",
    status: "active",
  },
  {
    id: 8,
    name: "David Kim",
    position: "Manager",
    department: "Management",
    avatar: "👨‍💼",
    isOnline: false,
    phone: "+1234567897",
    email: "david.kim@elvira.com",
    shift: "morning",
    status: "active",
  },
  {
    id: 9,
    name: "Sophie Martinez",
    position: "Concierge",
    department: "Reception",
    avatar: "👩‍💼",
    isOnline: true,
    phone: "+1234567898",
    email: "sophie.martinez@elvira.com",
    shift: "afternoon",
    status: "active",
  },
  {
    id: 10,
    name: "Robert Brown",
    position: "Maintenance Supervisor",
    department: "Housekeeping",
    avatar: "👨‍🔧",
    isOnline: true,
    phone: "+1234567899",
    email: "robert.brown@elvira.com",
    shift: "morning",
    status: "active",
  },
  {
    id: 11,
    name: "Maria Garcia",
    position: "Event Coordinator",
    department: "Events",
    avatar: "👩‍💼",
    isOnline: false,
    phone: "+1234567800",
    email: "maria.garcia@elvira.com",
    shift: "afternoon",
    status: "active",
  },
  {
    id: 12,
    name: "Tom Anderson",
    position: "Bartender",
    department: "Kitchen",
    avatar: "👨‍🍳",
    isOnline: true,
    phone: "+1234567801",
    email: "tom.anderson@elvira.com",
    shift: "night",
    status: "active",
  },
];

// Department data for filtering
export const DEPARTMENTS = [
  { id: "all", name: "All Departments", icon: "business-outline" },
  { id: "reception", name: "Reception", icon: "people-outline" },
  { id: "housekeeping", name: "Housekeeping", icon: "home-outline" },
  { id: "kitchen", name: "Kitchen", icon: "restaurant-outline" },
  { id: "security", name: "Security", icon: "shield-outline" },
  { id: "management", name: "Management", icon: "briefcase-outline" },
  { id: "events", name: "Events", icon: "calendar-outline" },
];

// Task Data
export const MOCK_TASKS = [
  {
    id: 1,
    title: "Clean Room 205",
    description: "Deep cleaning required for checkout",
    priority: "high",
    status: "pending",
    dueTime: "2:00 PM",
    dueDate: new Date().toISOString(),
    assignee: "You",
    assignedTo: "Sarah Johnson",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    title: "Maintenance - AC Unit",
    description: "Fix air conditioning in Room 312",
    priority: "medium",
    status: "in-progress",
    dueTime: "4:30 PM",
    dueDate: new Date().toISOString(),
    assignee: "Mike Rodriguez",
    assignedTo: "Mike Rodriguez",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    title: "Restock Minibar",
    description: "Refill minibar items for Room 108",
    priority: "low",
    status: "pending",
    dueTime: "6:00 PM",
    dueDate: new Date().toISOString(),
    assignee: "Sarah Johnson",
    assignedTo: "Emma Davis",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 4,
    title: "Check Security Cameras",
    description: "Weekly security system maintenance",
    priority: "medium",
    status: "completed",
    dueTime: "10:00 AM",
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    assignee: "Carlos Martinez",
    assignedTo: "Carlos Martinez",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 5,
    title: "Update Guest Information System",
    description: "Apply latest software updates to PMS",
    priority: "high",
    status: "pending",
    dueTime: "11:00 PM",
    dueDate: new Date().toISOString(),
    assignee: "Lisa Chen",
    assignedTo: "David Kim",
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
];

// Message/Conversation Data
export const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "Sarah Johnson",
    senderId: 1,
    lastMessage: "Can you help me with room 205? The guest is requesting...",
    timestamp: "2 min ago",
    timestampDate: new Date(Date.now() - 120000).toISOString(),
    unread: true,
    avatar: "👩‍💼",
    department: "Reception",
  },
  {
    id: 2,
    sender: "Mike Rodriguez",
    senderId: 2,
    lastMessage: "Housekeeping completed for floors 3-5",
    timestamp: "15 min ago",
    timestampDate: new Date(Date.now() - 900000).toISOString(),
    unread: false,
    avatar: "👨‍🔧",
    department: "Housekeeping",
  },
  {
    id: 3,
    sender: "Front Desk",
    senderId: 7,
    lastMessage: "New check-in: Mr. Anderson - Room 312",
    timestamp: "1 hour ago",
    timestampDate: new Date(Date.now() - 3600000).toISOString(),
    unread: true,
    avatar: "🏨",
    department: "Reception",
  },
  {
    id: 4,
    sender: "Lisa Chen",
    senderId: 3,
    lastMessage: "Break time schedule updated for next week",
    timestamp: "3 hours ago",
    timestampDate: new Date(Date.now() - 10800000).toISOString(),
    unread: false,
    avatar: "👩‍💻",
    department: "Management",
  },
  {
    id: 5,
    sender: "Carlos Martinez",
    senderId: 4,
    lastMessage: "Security patrol completed - all clear",
    timestamp: "5 hours ago",
    timestampDate: new Date(Date.now() - 18000000).toISOString(),
    unread: false,
    avatar: "👨‍✈️",
    department: "Security",
  },
];

// Room Data
export const MOCK_ROOMS = [
  {
    id: 1,
    number: "101",
    type: "Standard",
    status: "clean",
    floor: 1,
    lastCleaned: new Date().toISOString(),
    nextMaintenance: new Date(Date.now() + 86400000).toISOString(),
    occupancyStatus: "vacant",
    guest: null,
    doNotDisturb: false,
    messageStatus: "unread", // Sample unread message
  },
  {
    id: 2,
    number: "102",
    type: "Deluxe",
    status: "dirty",
    floor: 1,
    lastCleaned: new Date(Date.now() - 86400000).toISOString(),
    nextMaintenance: new Date(Date.now() + 172800000).toISOString(),
    occupancyStatus: "occupied",
    guest: "Mr. Anderson",
    doNotDisturb: true,
    messageStatus: "read", // Sample read message
  },
  {
    id: 3,
    number: "205",
    type: "Suite",
    status: "in-progress",
    floor: 2,
    lastCleaned: new Date(Date.now() - 3600000).toISOString(),
    nextMaintenance: new Date().toISOString(),
    occupancyStatus: "vacant",
    guest: null,
    doNotDisturb: false,
    messageStatus: "none", // No message
  },
  {
    id: 4,
    number: "312",
    type: "Standard",
    status: "clean",
    floor: 3,
    lastCleaned: new Date(Date.now() - 1800000).toISOString(),
    nextMaintenance: new Date(Date.now() + 259200000).toISOString(),
    occupancyStatus: "reserved",
    guest: "Ms. Johnson",
    doNotDisturb: false,
    messageStatus: "unread", // Another unread message example
  },
  {
    id: 5,
    number: "203",
    type: "Deluxe",
    status: "dirty",
    floor: 2,
    lastCleaned: new Date(Date.now() - 7200000).toISOString(),
    nextMaintenance: new Date(Date.now() + 86400000).toISOString(),
    occupancyStatus: "vacant",
    guest: null,
    doNotDisturb: false,
    messageStatus: "none", // No message
  },
  {
    id: 6,
    number: "401",
    type: "Suite",
    status: "clean",
    floor: 4,
    lastCleaned: new Date(Date.now() - 900000).toISOString(),
    nextMaintenance: new Date(Date.now() + 172800000).toISOString(),
    occupancyStatus: "occupied",
    guest: "Dr. Smith",
    doNotDisturb: true,
  },
  {
    id: 7,
    number: "105",
    type: "Standard",
    status: "in-progress",
    floor: 1,
    lastCleaned: new Date(Date.now() - 1800000).toISOString(),
    nextMaintenance: new Date(Date.now() + 86400000).toISOString(),
    occupancyStatus: "vacant",
    guest: null,
    doNotDisturb: false,
  },
  {
    id: 8,
    number: "302",
    type: "Deluxe",
    status: "dirty",
    floor: 3,
    lastCleaned: new Date(Date.now() - 5400000).toISOString(),
    nextMaintenance: new Date(Date.now() + 259200000).toISOString(),
    occupancyStatus: "occupied",
    guest: "Ms. Brown",
    doNotDisturb: true,
  },
];

// Emergency and Support Contacts
export const MOCK_EMERGENCY_CONTACTS = [
  {
    id: 1,
    name: "Emergency Services",
    phone: "911",
    type: "emergency",
    available24h: true,
  },
  {
    id: 2,
    name: "Hotel Manager",
    phone: "+1234567800",
    type: "management",
    available24h: true,
  },
  {
    id: 3,
    name: "IT Support",
    phone: "+1234567801",
    type: "support",
    available24h: false,
    hours: "8 AM - 6 PM",
  },
  {
    id: 4,
    name: "Maintenance Emergency",
    phone: "+1234567802",
    type: "maintenance",
    available24h: true,
  },
];

// Helper functions for working with mock data
export const MockDataHelpers = {
  // Get staff member by ID
  getStaffById: (id) => MOCK_STAFF.find((staff) => staff.id === id),

  // Get staff by department
  getStaffByDepartment: (department) =>
    MOCK_STAFF.filter(
      (staff) => staff.department.toLowerCase() === department.toLowerCase()
    ),

  // Get online staff
  getOnlineStaff: () => MOCK_STAFF.filter((staff) => staff.isOnline),

  // Get tasks by status
  getTasksByStatus: (status) =>
    MOCK_TASKS.filter(
      (task) => task.status.toLowerCase() === status.toLowerCase()
    ),

  // Get tasks by priority
  getTasksByPriority: (priority) =>
    MOCK_TASKS.filter(
      (task) => task.priority.toLowerCase() === priority.toLowerCase()
    ),

  // Get unread messages
  getUnreadMessages: () => MOCK_MESSAGES.filter((msg) => msg.unread),

  // Get rooms by status
  getRoomsByStatus: (status) =>
    MOCK_ROOMS.filter(
      (room) => room.status.toLowerCase() === status.toLowerCase()
    ),

  // Get rooms by floor
  getRoomsByFloor: (floor) => MOCK_ROOMS.filter((room) => room.floor === floor),

  // Search staff by name, position, or department
  searchStaff: (query) => {
    const lowerQuery = query.toLowerCase();
    return MOCK_STAFF.filter(
      (staff) =>
        staff.name.toLowerCase().includes(lowerQuery) ||
        staff.position.toLowerCase().includes(lowerQuery) ||
        staff.department.toLowerCase().includes(lowerQuery)
    );
  },

  // Search tasks by title or description
  searchTasks: (query) => {
    const lowerQuery = query.toLowerCase();
    return MOCK_TASKS.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
    );
  },

  // Filter staff for contacts (excluding current user)
  getContactableStaff: (currentUserId = null) =>
    MOCK_STAFF.filter((staff) => staff.id !== currentUserId),
};

export default {
  MOCK_STAFF,
  MOCK_TASKS,
  MOCK_MESSAGES,
  MOCK_ROOMS,
  MOCK_EMERGENCY_CONTACTS,
  MockDataHelpers,
};
