import { InferSchemaType, model, Schema } from 'mongoose';
import { AnalysisStatus } from '../types/enums';

const kpiSchema = new Schema(
  {
    totalRevenue: {
      type: Number,
      default: 0,
    },

    averageTicket: {
      type: Number,
      default: 0,
    },

    topSellingProduct: {
      type: String,
      trim: true,
      maxlength: 150,
      default: '',
    },

    totalOrders: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const monthlyTrendSchema = new Schema(
  {
    month: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    revenue: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const analysisSchema = new Schema(
  {
    datasetId: {
      type: Schema.Types.ObjectId,
      ref: 'Dataset',
      required: true,
      unique: true,
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
    },

    kpis: {
      type: kpiSchema,
      required: true,
    },

    monthlyTrends: {
      type: [monthlyTrendSchema],
      default: [],
    },

    errorMessage: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  },
);

analysisSchema.index({ companyId: 1, createdAt: -1 });

export type Analysis = InferSchemaType<typeof analysisSchema>;

export default model<Analysis>('Analysis', analysisSchema);
