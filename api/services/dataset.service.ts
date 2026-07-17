import { Company, Dataset } from '../models';
import { DatasetStatus } from '../models/Dataset';
import { UploadDatasetContract } from '../contracts/dataset/upload-dataset.contract';
import { StorageFactory } from '../storage';
import { buildDatasetObjectKey } from '../utils/object-key';
import { ListDatasetsContract } from '../contracts/dataset/list-datasets.contract';
import ApiError from '../utils/ApiError';

export class DatasetService {
  private readonly storage = StorageFactory.create();

  private async validateCompanyAccess(companyId: string, userId: string) {
    const company = await Company.findById(companyId);

    if (!company) {
      throw new ApiError(404, 'Company not found.');
    }

    if (company.owner.toString() !== userId) {
      throw new ApiError(403, 'You do not have access to this company.');
    }

    return company;
  }

  async upload(contract: UploadDatasetContract) {
    await this.validateCompanyAccess(contract.companyId, contract.uploadedBy);

    const dataset = new Dataset({
      company: contract.companyId,
      uploadedBy: contract.uploadedBy,
      originalFilename: contract.originalFilename,
      extension: contract.extension,
      mimeType: contract.mimeType,
      size: contract.size,
      bucket: this.storage.getBucketName(),
      objectKey: '',
      status: DatasetStatus.UPLOADING,
    });

    dataset.objectKey = buildDatasetObjectKey(contract.companyId, dataset.id, contract.extension);

    await this.storage.upload({
      objectKey: dataset.objectKey,
      buffer: contract.buffer,
      mimeType: contract.mimeType,
    });

    dataset.status = DatasetStatus.UPLOADED;

    await dataset.save();

    return dataset;
  }

  async findAll(contract: ListDatasetsContract) {
    await this.validateCompanyAccess(contract.companyId, contract.userId);

    const filter: any = {
      company: contract.companyId,
      status: {
        $ne: DatasetStatus.DELETED,
      },
    };

    if (contract.status) {
      filter.status = contract.status;
    }

    if (contract.search) {
      filter.originalFilename = {
        $regex: contract.search,
        $options: 'i',
      };
    }

    const sort = {
      [contract.sortBy ?? 'createdAt']: contract.order === 'asc' ? 1 : -1,
    };

    const page = Math.max(contract.page, 1);
    const limit = Math.min(Math.max(contract.limit, 1), 100);

    const skip = (page - 1) * limit;

    const [datasets, total] = await Promise.all([
      Dataset.find(filter).sort(sort).skip(skip).limit(limit),

      Dataset.countDocuments(filter),
    ]);

    return {
      data: datasets,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(companyId: string, datasetId: string, userId: string) {
    await this.validateCompanyAccess(companyId, userId);

    const dataset = await Dataset.findOne({
      _id: datasetId,
      company: companyId,
      status: {
        $ne: DatasetStatus.DELETED,
      },
    });

    if (!dataset) {
      throw new ApiError(404, 'Dataset not found.');
    }

    return dataset;
  }

  async delete(companyId: string, datasetId: string, userId: string) {
    const dataset = await this.findById(companyId, datasetId, userId);

    await this.storage.delete(dataset.objectKey);

    dataset.status = DatasetStatus.DELETED;

    await dataset.save();
  }
}
