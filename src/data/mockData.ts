// Mock data for all SriSoulTech portal pages

export const mockMembers = [
  { id: 1, code: 'SST-0001', name: 'Ravi Kumar', email: 'ravi@example.com', exams: 12, lastActive: '2 hours ago', status: 'active', rank: 3, avgScore: 78.4 },
  { id: 2, code: 'SST-0002', name: 'Priya Sharma', email: 'priya@example.com', exams: 8, lastActive: '1 day ago', status: 'active', rank: 7, avgScore: 71.2 },
  { id: 3, code: 'SST-0003', name: 'Arun Reddy', email: 'arun@example.com', exams: 15, lastActive: '3 hours ago', status: 'pending', rank: 1, avgScore: 91.5 },
  { id: 4, code: 'SST-0004', name: 'Kavitha Rao', email: 'kavitha@example.com', exams: 5, lastActive: '5 days ago', status: 'inactive', rank: 45, avgScore: 52.0 },
  { id: 5, code: 'SST-0005', name: 'Suresh Babu', email: 'suresh@example.com', exams: 20, lastActive: '30 min ago', status: 'active', rank: 2, avgScore: 88.3 },
  { id: 6, code: 'SST-0006', name: 'Lakshmi Devi', email: 'lakshmi@example.com', exams: 3, lastActive: '2 weeks ago', status: 'inactive', rank: 108, avgScore: 39.7 },
  { id: 7, code: 'SST-0007', name: 'Venkat Rao', email: 'venkat@example.com', exams: 9, lastActive: '4 hours ago', status: 'pending', rank: 12, avgScore: 68.1 },
  { id: 8, code: 'SST-0008', name: 'Anitha Kumari', email: 'anitha@example.com', exams: 11, lastActive: '1 hour ago', status: 'active', rank: 5, avgScore: 82.6 },
];

export const mockExams = [
  { id: 1, title: 'CS Fundamentals', subject: 'Computer Science', duration: 60, questions: 50, status: 'open', difficulty: 'Medium', assigned: false, scheduledAt: null },
  { id: 2, title: 'Advanced Calculus', subject: 'Mathematics', duration: 90, questions: 30, status: 'assigned', difficulty: 'Hard', assigned: true, scheduledAt: '2026-04-05T10:00:00' },
  { id: 3, title: 'Data Structures', subject: 'Computer Science', duration: 60, questions: 50, status: 'open', difficulty: 'Hard', assigned: false, scheduledAt: null },
  { id: 4, title: 'Thermodynamics', subject: 'Physics', duration: 45, questions: 40, status: 'open', difficulty: 'Medium', assigned: false, scheduledAt: null },
  { id: 5, title: 'Organic Chemistry', subject: 'Chemistry', duration: 75, questions: 35, status: 'open', difficulty: 'Easy', assigned: false, scheduledAt: null },
];

export const mockResults = [
  { id: 1, exam: 'Intro to Python', score: 92, rank: 1, totalMembers: 142, date: 'Dec 15', status: 'pass' },
  { id: 2, exam: 'Logic Gates', score: 75, rank: 12, totalMembers: 142, date: 'Dec 10', status: 'pass' },
  { id: 3, exam: 'Database Mgmt', score: 45, rank: 88, totalMembers: 142, date: 'Dec 05', status: 'fail' },
  { id: 4, exam: 'Networking Basics', score: 82, rank: 4, totalMembers: 142, date: 'Dec 01', status: 'pass' },
  { id: 5, exam: 'OS Principles', score: 68, rank: 22, totalMembers: 142, date: 'Nov 28', status: 'pass' },
];

export const mockScoreHistory = [
  { exam: 'Python', score: 92 }, { exam: 'Algorithms', score: 78 }, { exam: 'Networks', score: 82 },
  { exam: 'Logic', score: 75 }, { exam: 'OS', score: 68 }, { exam: 'DB Mgmt', score: 45 },
  { exam: 'Math', score: 88 }, { exam: 'Physics', score: 71 }, { exam: 'Chemistry', score: 60 }, { exam: 'Biology', score: 55 },
];

export const mockRadarData = [
  { subject: 'Mathematics', score: 85 }, { subject: 'Physics', score: 72 }, { subject: 'Chemistry', score: 68 },
  { subject: 'Comp. Sci', score: 91 }, { subject: 'Biology', score: 55 },
];

export const mockWeakTopics = [
  { topic: 'Binary Trees', score: 38, color: 'danger' },
  { topic: 'Organic Chemistry', score: 44, color: 'danger' },
  { topic: 'Calculus', score: 61, color: 'warning' },
  { topic: 'Thermodynamics', score: 57, color: 'warning' },
  { topic: 'Algorithms', score: 79, color: 'success' },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Arun Reddy', code: 'SST-0003', score: 91.5, exams: 15 },
  { rank: 2, name: 'Suresh Babu', code: 'SST-0005', score: 88.3, exams: 20 },
  { rank: 3, name: 'Ravi Kumar', code: 'SST-0001', score: 78.4, exams: 12 },
  { rank: 4, name: 'Anitha Kumari', code: 'SST-0008', score: 82.6, exams: 11 },
  { rank: 5, name: 'Priya Sharma', code: 'SST-0002', score: 71.2, exams: 8 },
  { rank: 6, name: 'Venkat Rao', code: 'SST-0007', score: 68.1, exams: 9 },
  { rank: 7, name: 'Kavitha Rao', code: 'SST-0004', score: 52.0, exams: 5 },
  { rank: 8, name: 'Lakshmi Devi', code: 'SST-0006', score: 39.7, exams: 3 },
];

export const mockQuestions = [
  { id: 47, text: 'What is a binary tree?', teluguText: 'బైనరీ ట్రీ అంటే ఏమిటి?', options: ['A graph data structure', 'A tree where each node has at most 2 children', 'A sorted array', 'A hash table'], correct: 1, difficulty: 'Medium', subject: 'Data Structures', topic: 'Trees' },
  { id: 48, text: 'Define Big O notation', teluguText: 'బిగ్ O నొటేషన్ నిర్వచించండి', options: ['Best case complexity', 'Average case complexity', 'Upper bound of algorithm complexity', 'Space complexity only'], correct: 2, difficulty: 'Hard', subject: 'Algorithms', topic: 'Complexity' },
  { id: 49, text: 'What is RAM?', teluguText: 'RAM అంటే ఏమిటి?', options: ['Read Access Memory', 'Random Access Memory', 'Rapid Application Memory', 'Remote Access Module'], correct: 1, difficulty: 'Easy', subject: 'Computer Science', topic: 'Hardware' },
  { id: 50, text: 'What is the time complexity of binary search?', teluguText: 'బైనరీ సెర్చ్ యొక్క సమయ సంక్లిష్టత ఏమిటి?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, difficulty: 'Medium', subject: 'Algorithms', topic: 'Searching' },
];

export const mockCategories = [
  { id: 1, name: 'Computer Science', count: 342, children: [{ name: 'Algorithms', count: 87 }, { name: 'Data Structures', count: 95 }, { name: 'Networks', count: 60 }] },
  { id: 2, name: 'Mathematics', count: 218, children: [{ name: 'Calculus', count: 78 }, { name: 'Linear Algebra', count: 65 }] },
  { id: 3, name: 'Physics', count: 208, children: [{ name: 'Mechanics', count: 90 }, { name: 'Thermodynamics', count: 72 }] },
];

export const mockNotifications = [
  { id: 1, date: 'Apr 2, 2026', recipients: 'All (142)', message: 'New exam scheduled for April 5th', status: 'sent' },
  { id: 2, date: 'Apr 1, 2026', recipients: 'Selected (12)', message: 'Results for CS Fundamentals are out', status: 'sent' },
  { id: 3, date: 'Mar 30, 2026', recipients: 'All (142)', message: 'System maintenance on March 31st', status: 'sent' },
  { id: 4, date: 'Apr 6, 2026', recipients: 'All (142)', message: 'Monthly Results Review meeting', status: 'scheduled' },
];

export const mockActivityFeed = [
  { time: '14:32', event: 'Ravi Kumar logged in', type: 'login' },
  { time: '14:28', event: 'Arun Reddy completed "CS Fundamentals"', type: 'complete' },
  { time: '14:15', event: 'Priya Sharma started "Logic Gates"', type: 'start' },
  { time: '13:58', event: 'Suresh Babu logged in', type: 'login' },
  { time: '13:45', event: 'New member SST-0009 registered', type: 'register' },
];
