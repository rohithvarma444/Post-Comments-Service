class DatabaseService {
  constructor() {
    this.comments = new Map();
    this.nextId = 1;
  }

  async connect() {
    console.log('Connected to in-memory database');
  }

  async disconnect() {
    console.log('Disconnected from database');
  }

  async createComment(commentData) {
    const comment = {
      id: this.nextId++,
      ...commentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.comments.set(comment.id, comment);
    return comment;
  }

  async findCommentById(id) {
    return this.comments.get(id) || null;
  }

  async findCommentsByPostId(postId) {
    const postComments = [];
    for (const comment of this.comments.values()) {
      if (comment.postId === postId) {
        postComments.push(comment);
      }
    }
    return postComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async findCommentsByUserId(userId) {
    const userComments = [];
    for (const comment of this.comments.values()) {
      if (comment.userId === userId) {
        userComments.push(comment);
      }
    }
    return userComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async updateComment(id, data) {
    const comment = this.comments.get(id);
    if (comment) {
      const updatedComment = { ...comment, ...data, updatedAt: new Date() };
      this.comments.set(id, updatedComment);
      return updatedComment;
    }
    return null;
  }

  async deleteComment(id) {
    return this.comments.delete(id);
  }
}

module.exports = new DatabaseService();