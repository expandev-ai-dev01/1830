/**
 * @summary
 * Internal (authenticated) API routes configuration.
 * Handles authenticated endpoints.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import purchaseRoutes from './purchaseRoutes';

const router = Router();

router.use('/purchase', purchaseRoutes);

export default router;
