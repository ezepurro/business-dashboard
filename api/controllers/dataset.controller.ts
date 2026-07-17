import { NextFunction, Request, Response } from 'express';
import { DatasetService } from '../services/dataset.service';
import { UploadDatasetContract } from '../contracts/dataset/upload-dataset.contract';
import { validateDatasetFile } from '../validators/dataset.validator';
import ApiError from '../utils/ApiError';

class DatasetController {
  private readonly datasetService = new DatasetService();

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ApiError(400, 'Dataset file is required.');
      }

      const extension = validateDatasetFile(req.file);

      const contract: UploadDatasetContract = {
        companyId: req.params.companyId,
        uploadedBy: req.user.id,
        originalFilename: req.file.originalname,
        extension,
        mimeType: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer,
      };

      const dataset = await this.datasetService.upload(contract);

      return res.status(201).json(dataset);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const datasets = await this.datasetService.findAll({
        companyId: req.params.companyId,
        userId: req.user.id,
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 20),
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        order: req.query.order as any,
        status: req.query.status as any,
      });

      return res.status(200).json(datasets);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataset = await this.datasetService.findById(
        req.params.companyId,
        req.params.datasetId,
        req.user.id,
      );

      return res.status(200).json(dataset);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.datasetService.delete(req.params.companyId, req.params.datasetId, req.user.id);

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };
}

export default new DatasetController();
