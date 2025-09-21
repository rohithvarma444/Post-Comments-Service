const express = require('express');
const router = express.Router();
const database = require('../utils/database');
const passwordUtils = require('../utils/password');
const jwtUtils = require('../utils/jwt');
const { validateRegistration, validateLogin, validateToken } = require('../middleware/validation');

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUserByEmail = await database.getPrisma().findUserByEmail(email);
    const existingUserByUsername = await database.getPrisma().findUserByEmail(username);

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    const passwordHash = await passwordUtils.hashPassword(password);

    const user = await database.getPrisma().createUser({
      username,
      email,
      passwordHash
    });

    const token = jwtUtils.generateToken({
      userId: user.id,
      username: user.username,
      email: user.email
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await database.getPrisma().findUserByUsername(username);
    if (!user) {
      user = await database.getPrisma().findUserByEmail(username);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isValidPassword = await passwordUtils.comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwtUtils.generateToken({
      userId: user.id,
      username: user.username,
      email: user.email
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.createdAt
        },
        token
      }
    });
  } catch (error) {
('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/validate', validateToken, async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwtUtils.verifyToken(token);

    const user = await database.getPrisma().findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.createdAt
        },
        decoded
      }
    });
  } catch (error) {
('Token validation error:', error);
    
    if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    const user = await database.getPrisma().findUserById(parseInt(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.createdAt
        }
      }
    });
  } catch (error) {
('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


module.exports = router;
