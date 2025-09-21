class DatabaseService {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async connect() {
  }

  async disconnect() {
  }

  async createUser(userData) {
    const user = {
      id: this.nextId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.users.get(id) || null;
  }

  async updateUser(id, data) {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...data, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return null;
  }

  async deleteUser(id) {
    return this.users.delete(id);
  }
}

module.exports = new DatabaseService();