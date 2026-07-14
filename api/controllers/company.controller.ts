import { NextFunction, Request, Response } from 'express';

import companyService from '../services/company.service';

interface PaginationQuery {
  page?: number;
  limit?: number;
}

class CompanyController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await companyService.create(req.user!.id, req.body);

      return res.status(201).json({
        success: true,
        company,
      });
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await companyService.findAllByOwner(req.user!.id);

      return res.json({
        success: true,
        companies,
      });
    } catch (err) {
      next(err);
    }
  }

  async findAllAdmin(
    req: Request<unknown, unknown, unknown, PaginationQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const { companies, pagination } = await companyService.findAllPaginated(page, limit);

      return res.json({
        success: true,
        companies,
        pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const company = await companyService.findById(req.params.id, req.user!.id, req.user!.role);

      return res.json({
        success: true,
        company,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const company = await companyService.update(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.body,
      );

      return res.json({
        success: true,
        company,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await companyService.delete(req.params.id, req.user!.id, req.user!.role);

      return res.json({
        success: true,
        message: 'Empresa eliminada correctamente.',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new CompanyController();
