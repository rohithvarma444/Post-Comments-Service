const prismaService = require('./prisma');

class Database {
  constructor() {
    this.prisma = null;
  }

  async initialize() {
    await prismaService.connect();
    this.prisma = prismaService;
    console.log('Database initialized successfully');
  }

  async close() {
    await prismaService.disconnect();
    console.log('Database connections closed');
  }

  getPrisma() {
    return this.prisma;
  }
}

module.exports = new Database();