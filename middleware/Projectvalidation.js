import { body, validationResult } from 'express-validator';
// Validation Middleware
const validateProjectCreation = [
    // Validate projectName
    body("projectName")
        .trim()
        .notEmpty().withMessage('Project Name is required')
        .isString().withMessage('Project Name must be a string')
        .isLength({ min: 5 }).withMessage('Project Name cannot exceed 5 characters'),

    // Validate description
    body("description")
        .trim()
        .notEmpty().withMessage('Project Description is required')
        .isString().withMessage('Project Description must be a string')
        .isLength({ min: 10, max: 200 }).withMessage('Project Description must be between 10 and 200 characters'),

    // Validate status
    body("status")
        .trim()
        .notEmpty().withMessage('Project status is required')
        .isString().withMessage('Project status must be a string')
        .isIn(['active', 'inactive', 'completed']).withMessage('Project status must be either "active" or "inactive" or "completed"'),

    // Validate owner
    body("owner")
        .notEmpty().withMessage("Owner is required")
        .isMongoId().withMessage("Owner must be a valid MongoDB ObjectId"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: "error from middleware", success: false });
        }
        next();
    }
];

export default validateProjectCreation;
