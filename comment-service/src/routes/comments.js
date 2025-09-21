const express = require('express');
const router = express.Router();
const database = require('../utils/database');
const postService = require('../utils/postService');
const richTextProcessor = require('../utils/richText');
const { requireAuth, tryAuth } = require('../middleware/auth');
const { 
  validateCommentCreation, 
  validateCommentUpdate, 
  validateCommentId,
  validatePostId,
  validatePagination,
  validateReply
} = require('../middleware/validation');
const config = require('../config/config');

router.get('/post/:post_id', validatePostId, validatePagination, tryAuth, async (req, res) => {
  try {
    const { post_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.page_size) || config.pagination.defaultLimit, config.pagination.maxLimit);
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'created_at';
    const order = req.query.order || 'asc';


    const allComments = await database.getPrisma().findCommentsByPostId(parseInt(post_id));
    
    const comments = allComments.slice(offset, offset + limit);
    const totalCount = allComments.length;
    const totalPages = Math.ceil(totalCount / limit);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    
    const nextUrl = page < totalPages 
      ? `${baseUrl}/post/${post_id}?page=${page + 1}&page_size=${limit}`
      : null;
    
    const prevUrl = page > 1 
      ? `${baseUrl}/post/${post_id}?page=${page - 1}&page_size=${limit}`
      : null;

    res.json({
      count: totalCount,
      next: nextUrl,
      previous: prevUrl,
      result: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.post('/', requireAuth, validateCommentCreation, async (req, res) => {
  try {
    const { post_id, content, parent_id, is_rich_text } = req.body;
    const authorId = req.user.id;

    if (parent_id) {
      const parentComment = await database.getPrisma().findCommentById(parseInt(parent_id));

      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }

      if (parentComment.postId !== post_id) {
        return res.status(400).json({
          success: false,
          message: 'Parent comment does not belong to the specified post'
        });
      }
    }

    const processedContent = richTextProcessor.processContent(content, is_rich_text);

    const comment = await database.getPrisma().createComment({
      postId: post_id,
      authorId,
      content: processedContent.content,
      parentId: parent_id || null,
      isRichText: processedContent.isRichText
    });

    res.status(201).json({
      count: 1,
      next: null,
      previous: null,
      result: [comment]
    });
  } catch (error) {
('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.put('/:id', requireAuth, validateCommentId, validateCommentUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_rich_text } = req.body;
    const userId = req.user.id;

    const existingComment = await database.getPrisma().findCommentById(parseInt(id));

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (existingComment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own comments'
      });
    }

    const updateData = {};
    let needsUpdate = false;

    if (content !== undefined) {
      const processedContent = richTextProcessor.processContent(
        content, 
        is_rich_text !== undefined ? is_rich_text : existingComment.isRichText
      );
      
      updateData.content = processedContent.content;
      updateData.isRichText = processedContent.isRichText;
      needsUpdate = true;
    } else if (is_rich_text !== undefined && is_rich_text !== existingComment.isRichText) {
      const processedContent = richTextProcessor.processContent(
        existingComment.content, 
        is_rich_text
      );
      
      updateData.content = processedContent.content;
      updateData.isRichText = processedContent.isRichText;
      needsUpdate = true;
    }

    if (!needsUpdate) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (content or is_rich_text) is required for update'
      });
    }

    const comment = await database.getPrisma().updateComment(parseInt(id), updateData);

    res.json({
      count: 1,
      next: null,
      previous: null,
      result: [comment]
    });
  } catch (error) {
('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.delete('/:id', requireAuth, validateCommentId, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingComment = await database.getPrisma().findCommentById(parseInt(id));

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (existingComment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    const allComments = await database.getPrisma().findAllComments();
    const replies = allComments.filter(comment => comment.parentId === parseInt(id));
    
    if (replies.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete comment with replies. Please delete replies first.',
        hasReplies: true,
        replyCount: replies.length
      });
    }

    await database.getPrisma().deleteComment(parseInt(id));

    res.json({
      count: 1,
      next: null,
      previous: null,
      result: [{
        id: parseInt(id),
        post_id: existingComment.postId,
        repliesDeleted: 0
      }]
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/:id/reply', requireAuth, validateCommentId, validateReply, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_rich_text } = req.body;
    const authorId = req.user.id;

    const parentComment = await database.getPrisma().findCommentById(parseInt(id));

    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }

    const postId = parentComment.postId;

    const processedContent = richTextProcessor.processContent(content, is_rich_text);

    const reply = await database.getPrisma().createComment({
      postId,
      authorId,
      content: processedContent.content,
      parentId: parseInt(id),
      isRichText: processedContent.isRichText
    });

    res.status(201).json({
      success: true,
      message: 'Reply created successfully',
      data: { 
        comment: reply,
        parentId: parseInt(id)
      }
    });
  } catch (error) {
('Create reply error:', error);
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

    const [comments, totalCount] = await Promise.all([
      database.getPrisma().findCommentsByUserId(parseInt(authorId)).slice(offset, offset + limit),
      database.getPrisma().findCommentsByUserId(parseInt(authorId)).length
    ]);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        comments,
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
('Get comments by author error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
