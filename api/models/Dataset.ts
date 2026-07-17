import { InferSchemaType, Schema, Types, model } from 'mongoose';

export enum DatasetStatus {
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

const datasetSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    originalFilename: {
      type: String,
      required: true,
    },

    extension: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    bucket: {
      type: String,
      required: true,
    },

    objectKey: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: Object.values(DatasetStatus),
      default: DatasetStatus.UPLOADING,
    },
  },
  {
    timestamps: true,
  },
);

export type DatasetDocument = InferSchemaType<typeof datasetSchema> & {
  _id: Types.ObjectId;
};

export default model<DatasetDocument>('Dataset', datasetSchema);
