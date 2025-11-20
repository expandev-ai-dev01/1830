/**
 * @summary
 * Main API router configuration.
 * Manages API versioning and route delegation.
 *
 * @module routes
 */

import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

router.use('/v1', v1Routes);

export default router;
