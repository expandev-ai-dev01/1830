import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  purchaseCreate,
  purchaseUpdate,
  purchaseDelete,
  purchaseGet,
  purchaseList,
} from '@/services/purchase';

const securable = 'PURCHASE';

// Validation Schemas
const purchaseSchema = z.object({
  name: z.string().min(3).max(100),
  category: z.enum([
    'Frutas',
    'Verduras',
    'Carnes',
    'Laticínios',
    'Grãos',
    'Bebidas',
    'Congelados',
    'Outros',
  ]),
  purchaseDate: z.coerce.date().max(new Date(), { message: 'Date cannot be in the future' }),
  unitPrice: z.number().positive(),
  quantity: z.number().positive(),
  unitMeasure: z.enum(['kg', 'g', 'l', 'ml', 'unidade', 'pacote', 'caixa', 'dúzia']),
  currency: z.string().default('BRL'),
  location: z.string().max(100).optional().nullable(),
  observations: z.string().max(500).optional().nullable(),
});

const updateSchema = purchaseSchema.extend({
  version: z.number().int().positive(),
});

const deleteSchema = z.object({
  id: z.coerce.number(),
  version: z.coerce.number().int().positive(),
  confirm: z.coerce
    .boolean()
    .refine((val) => val === true, { message: 'Deletion must be confirmed' }),
});

const listSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    category: z.string().optional(),
    name: z.string().optional(),
    status: z.enum(['ativo', 'excluido', 'todos']).optional().default('ativo'),
    page: z.coerce.number().int().positive().optional().default(1),
    pageSize: z.coerce.number().int().positive().optional().default(10),
    orderBy: z
      .enum(['date_desc', 'date_asc', 'name_asc', 'name_desc', 'value_desc', 'value_asc'])
      .optional()
      .default('date_desc'),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: 'Start date cannot be after end date', path: ['startDate'] }
  );

export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);
  const [validated, error] = await operation.create(req, purchaseSchema);

  if (!validated) return next(error);

  try {
    const result = await purchaseCreate({
      ...validated.credential,
      ...validated.params,
    });
    res.json(successResponse(result));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse(error.message));
  }
}

export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);
  const paramsSchema = z.object({ id: z.coerce.number() });
  const [validated, error] = await operation.update(req, paramsSchema, updateSchema);

  if (!validated) return next(error);

  try {
    const result = await purchaseUpdate({
      ...validated.credential,
      ...validated.params,
    });
    res.json(successResponse(result));
  } catch (error: any) {
    if (error.message === 'recordNotFound') {
      res.status(404).json(errorResponse('Record not found'));
    } else if (error.message === 'concurrencyConflict') {
      res.status(409).json(errorResponse('Record modified by another user'));
    } else {
      res.status(StatusGeneralError).json(errorResponse(error.message));
    }
  }
}

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);
  // Combine params and query for delete validation (id in params, version/confirm in query or body)
  // Assuming version and confirm come in query or body. Let's assume query for simplicity in DELETE.
  const combinedSchema = deleteSchema;

  // Custom validation for DELETE to handle merged params
  try {
    const params = await combinedSchema.parseAsync({ ...req.params, ...req.query, ...req.body });
    const credential = { idAccount: 1, idUser: 1 }; // Mock credential

    await purchaseDelete({
      idAccount: credential.idAccount,
      id: params.id,
      version: params.version,
    });

    res.json(successResponse({ success: true }));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      next(error);
    } else if (error.message === 'recordNotFound') {
      res.status(404).json(errorResponse('Record not found'));
    } else if (error.message === 'concurrencyConflict') {
      res.status(409).json(errorResponse('Record modified by another user'));
    } else {
      res.status(StatusGeneralError).json(errorResponse(error.message));
    }
  }
}

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);
  const paramsSchema = z.object({ id: z.coerce.number() });
  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) return next(error);

  try {
    const result = await purchaseGet({
      ...validated.credential,
      id: validated.params.id,
    });

    if (!result) {
      res.status(404).json(errorResponse('Record not found'));
      return;
    }

    res.json(successResponse(result));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse(error.message));
  }
}

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);
  const [validated, error] = await operation.list(req, listSchema);

  if (!validated) return next(error);

  try {
    // Default to current month if no dates provided
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const filters = {
      ...validated.params,
      startDate: validated.params.startDate || firstDay,
      endDate: validated.params.endDate || lastDay,
    };

    const result = await purchaseList({
      ...validated.credential,
      ...filters,
    });
    res.json(successResponse(result));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse(error.message));
  }
}
