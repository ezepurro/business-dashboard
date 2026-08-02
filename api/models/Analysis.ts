import { InferSchemaType, model, Schema, Types } from 'mongoose';
import { AnalysisStatus } from '../types/enums';

const analysisSchema = new Schema(
  {
    datasetId: {
      type: Schema.Types.ObjectId,
      ref: 'Dataset',
      required: true,
      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(AnalysisStatus),
      required: true,
      default: AnalysisStatus.PROCESSING,
    },

    profile: {
      type: Schema.Types.Mixed,
      default: null,
    },

    processingTime: {
      type: Number,
      default: null,
    },

    pythonVersion: {
      type: String,
      trim: true,
      default: null,
    },

    engineVersion: {
      type: String,
      trim: true,
      default: null,
    },

    errorMessage: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

analysisSchema.index({
  companyId: 1,
  createdAt: -1,
});

analysisSchema.index({
  status: 1,
  createdAt: -1,
});

analysisSchema.index(
  {
    datasetId: 1,
  },
  {
    unique: true,
  },
);

export type Analysis = InferSchemaType<typeof analysisSchema>;

export type AnalysisDocument = InferSchemaType<typeof analysisSchema> & {
  _id: Types.ObjectId;
};

export default model<AnalysisDocument>('Analysis', analysisSchema);
