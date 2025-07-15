import { Router } from 'express';
import { z } from 'zod';
import UserModel from '../models/User.js';
import { type CreateUserInput, createUserSchema, userIdSchema } from '../validations/user.js';

const router = Router();

// Helper function to handle Zod validation errors
const handleValidationError = (error: z.ZodError) => {
  const formattedErrors = error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  return {
    error: 'Validation failed',
    message: 'Please check your input and try again',
    details: formattedErrors,
  };
};

// GET /user/:id - Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`GET /user/${req.params.id} endpoint called`);

    // Validate user ID parameter
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json(handleValidationError(validationResult.error));
    }

    const { id } = validationResult.data;

    // Find user by ID in database
    const user = await UserModel.findOne({ id });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} does not exist`,
        requestedId: id,
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('Error in GET /user/:id:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /user - Create a new user
router.post('/', async (req, res) => {
  try {
    console.log('POST /user endpoint called with body:', req.body);

    // Validate request body with Zod
    const validationResult = createUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json(handleValidationError(validationResult.error));
    }

    const { name, character }: CreateUserInput = validationResult.data;

    // Generate ID from name
    const userId = name.toLowerCase().replace(/\s+/g, '-');

    // Check if user already exists
    const existingUser = await UserModel.findOne({ id: userId });
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: `User with ID ${userId} already exists`,
        existingUser,
      });
    }

    // Create new user
    const user = new UserModel({
      id: userId,
      name,
      character,
    });

    // Save to database
    const savedUser = await user.save();

    console.log('User created:', savedUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: savedUser,
    });
  } catch (error) {
    console.error('Error in POST /user:', error);

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: (error as any).errors,
      });
    }

    // Handle duplicate key error
    if (error instanceof Error && (error as any).code === 11000) {
      return res.status(409).json({
        error: 'Duplicate user',
        message: 'User with this ID already exists',
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
