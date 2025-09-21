const prismaService = require('./prisma');

class Database {
  constructor() {
    this.prisma = null;
  }

  async initialize() {
    await prismaService.connect();
    this.prisma = prismaService;
  }

  async close() {
    await prismaService.disconnect();
  }

  getPrisma() {
    return this.prisma;
  }
}

module.exports = new Database();