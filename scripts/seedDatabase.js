// Script to seed the database with mock data
const { initDatabase, clearDatabase, seedDatabase } = require('../services/database');

console.log('Seeding database...');
initDatabase();
clearDatabase();
seedDatabase();
console.log('Database seeded successfully!');
