import { NextFunction, Request, Response } from 'express';
import analysisService from '../services/analysis.service';

class AnalysisController {
  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analysis = await analysisService.findById(req.params.id as string, req.user!.id);

      return res.status(200).json({
        success: true,
        analysis,
      });
    } catch (error) {
      next(error);
    }
  };

  findByDataset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analysis = await analysisService.findByDataset(
        req.params.datasetId as string,
        req.user!.id,
        req.params.companyId as string | undefined,
      );

      return res.status(200).json({
        success: true,
        analysis,
      });
    } catch (error) {
      next(error);
    }
  };

  findByCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analyses = await analysisService.findByCompany(
        req.params.companyId as string,
        req.user!.id,
      );

      return res.status(200).json({
        success: true,
        analyses,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AnalysisController();
