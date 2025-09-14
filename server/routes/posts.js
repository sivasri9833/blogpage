const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts with pagination and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error fetching post' });
  }
});

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', auth, [
  body('title')
    .isLength({ min: 5, max: 120 })
    .withMessage('Title must be between 5 and 120 characters')
    .trim(),
  body('content')
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters')
    .trim(),
  body('imageURL')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') {
        return true; // Allow empty values
      }
      return /^https?:\/\/.+/.test(value); // Validate only if not empty
    })
    .withMessage('Please provide a valid image URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, content, imageURL } = req.body;

    const post = new Post({
      title,
      content,
      imageURL: imageURL || '',
      author: req.user._id,
      username: req.user.username
    });

    await post.save();
    await post.populate('author', 'username');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private (Owner only)
router.put('/:id', auth, [
  body('title')
    .optional()
    .isLength({ min: 5, max: 120 })
    .withMessage('Title must be between 5 and 120 characters')
    .trim(),
  body('content')
    .optional()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters')
    .trim(),
  body('imageURL')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') {
        return true; // Allow empty values
      }
      return /^https?:\/\/.+/.test(value); // Validate only if not empty
    })
    .withMessage('Please provide a valid image URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the owner
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, imageURL } = req.body;
    
    if (title) post.title = title;
    if (content) post.content = content;
    if (imageURL !== undefined) post.imageURL = imageURL;

    await post.save();
    await post.populate('author', 'username');

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error updating post' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the owner
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error deleting post' });
  }
});

module.exports = router;
