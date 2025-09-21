const { body, query, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateCommentCreation = [
  body('post_id')
    .isInt({ min: 1 })
    .withMessage('Valid post ID is required'),
  
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  
  body('parent_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Parent ID must be a valid integer'),
  
  body('is_rich_text')
    .optional()
    .isBoolean()
    .withMessage('is_rich_text must be a boolean'),
  
  handleValidationErrors
];

const validateCommentUpdate = [
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  
  body('is_rich_text')
    .optional()
    .isBoolean()
    .withMessage('is_rich_text must be a boolean'),
  
  handleValidationErrors
];

const validateCommentId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid comment ID is required'),
  
  handleValidationErrors
];

const validatePostId = [
  param('post_id')
    .isInt({ min: 1 })
    .withMessage('Valid post ID is required'),
  
  handleValidationErrors
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('page_size')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Page size must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['created_at', 'updated_at'])
    .withMessage('Sort field must be one of: created_at, updated_at'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc'),
  
  handleValidationErrors
];

const validateReply = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  
  body('is_rich_text')
    .optional()
    .isBoolean()
    .withMessage('is_rich_text must be a boolean'),
  
  handleValidationErrors
];

module.exports = {
  validateCommentCreation,
  validateCommentUpdate,
  validateCommentId,
  validatePostId,
  validatePagination,
  validateReply,
  handleValidationErrors
};
