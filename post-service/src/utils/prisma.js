class DatabaseService {
  constructor() {
    this.posts = new Map();
    this.nextId = 1;
  }

  async connect() {
    console.log('Connected to in-memory database');
  }

  async disconnect() {
    console.log('Disconnected from database');
  }

  async createPost(postData) {
    const post = {
      id: this.nextId++,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.set(post.id, post);
    return post;
  }

  async findPostById(id) {
    return this.posts.get(id) || null;
  }

  async findPostsByUserId(userId) {
    const userPosts = [];
    for (const post of this.posts.values()) {
      if (post.userId === userId) {
        userPosts.push(post);
      }
    }
    return userPosts;
  }

  async findAllPosts() {
    return Array.from(this.posts.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async updatePost(id, data) {
    const post = this.posts.get(id);
    if (post) {
      const updatedPost = { ...post, ...data, updatedAt: new Date() };
      this.posts.set(id, updatedPost);
      return updatedPost;
    }
    return null;
  }

  async deletePost(id) {
    return this.posts.delete(id);
  }
}

module.exports = new DatabaseService();