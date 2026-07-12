import { InferSchemaType, model, Schema } from 'mongoose';
import { DatasetStatus } from '../types/enums';

const datasetSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    storagePath: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(DatasetStatus),
      default: DatasetStatus.PENDING,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

datasetSchema.index({ companyId: 1, uploadedAt: -1 });

export type Dataset = InferSchemaType<typeof datasetSchema>;

export default model<Dataset>('Dataset', datasetSchema);
