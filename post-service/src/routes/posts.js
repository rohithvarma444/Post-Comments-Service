const express = require('express');
const router = express.Router();
const database = require('../utils/database');
const { requireAuth, tryAuth } = require('../middleware/auth');
const { 
  validatePostCreation, 
  validatePostUpdate, 
  validatePostId,
  validatePagination,
  validateSearch 
} = require('../middleware/validation');
const config = require('../config/config');

router.get('/', validatePagination, validateSearch, tryAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.page_size) || config.pagination.defaultLimit, config.pagination.maxLimit);
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'created_at';
    const order = req.query.order || 'desc';
    const searchQuery = req.query.q;

    const searchOptions = {
      limit,
      offset,
      orderBy: sort === 'created_at' ? 'createdAt' : sort === 'updated_at' ? 'updatedAt' : sort,
      order
    };

    const allPosts = await database.getPrisma().findAllPosts();
    const filteredPosts = searchQuery 
      ? allPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allPosts;
    
    const posts = filteredPosts.slice(offset, offset + limit);
    const totalCount = filteredPosts.length;
    const totalPages = Math.ceil(totalCount / limit);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    
    const nextUrl = page < totalPages 
      ? `${baseUrl}?page=${page + 1}&page_size=${limit}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`
      : null;
    
    const prevUrl = page > 1 
      ? `${baseUrl}?page=${page - 1}&page_size=${limit}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`
      : null;

    res.json({
      count: totalCount,
      next: nextUrl,
      previous: prevUrl,
      result: posts
    });
  } catch (error) {
('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.get('/:id', validatePostId, tryAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await database.getPrisma().findPostById(parseInt(id));

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      count: 1,
      next: null,
      previous: null,
      result: [post]
    });
  } catch (error) {
('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/', requireAuth, validatePostCreation, async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const post = await database.getPrisma().createPost({
      title,
      content,
      authorId
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.put('/:id', requireAuth, validatePostId, validatePostUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const existingPost = await database.getPrisma().findPostById(parseInt(id));

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (existingPost.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own posts'
      });
    }

    const updateData = {};
    if (title !== undefined) {
      updateData.title = title;
    }
    if (content !== undefined) {
      updateData.content = content;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (title or content) is required for update'
      });
    }

    const post = await database.getPrisma().updatePost(parseInt(id), updateData);

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post }
    });
  } catch (error) {
('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.delete('/:id', requireAuth, validatePostId, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingPost = await database.getPrisma().findPostById(parseInt(id));

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (existingPost.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    await database.getPrisma().deletePost(parseInt(id));

    res.json({
      count: 1,
      next: null,
      previous: null,
      result: [{
        id: parseInt(id),
        title: existingPost.title
      }]
    });
  } catch (error) {
('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.get('/author/:authorId', validatePagination, async (req, res) => {
  try {
    const { authorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.page_size) || config.pagination.defaultLimit, config.pagination.maxLimit);
    const offset = (page - 1) * limit;

    if (!authorId || isNaN(parseInt(authorId))) {
      return res.status(400).json({
        success: false,
        message: 'Valid author ID is required'
      });
    }

    const [posts, totalCount] = await Promise.all([
      database.getPrisma().findPostsByUserId(parseInt(authorId)),
      database.getPrisma().findPostsByUserId(parseInt(authorId)).length
    ]);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
('Get posts by author error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
