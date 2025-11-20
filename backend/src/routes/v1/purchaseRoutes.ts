/**
 * @summary
 * Purchase API routes configuration.
 * Handles purchase management endpoints.
 *
 * @module routes/v1/purchaseRoutes
 */

import { Router } from 'express';
import * as controller from '@/api/v1/internal/purchase/controller';

const router = Router();

router.get('/', controller.listHandler);
router.post('/', controller.createHandler);
router.get('/:id', controller.getHandler);
router.put('/:id', controller.updateHandler);
router.delete('/:id', controller.deleteHandler);

export default router;
