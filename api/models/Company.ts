import { InferSchemaType, model, Schema } from 'mongoose';

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    industry: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    currency: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      default: 'USD',
    },

    foundedAt: {
      type: Date,
      default: null,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

companySchema.index({ owner: 1, name: 1 });

export type Company = InferSchemaType<typeof companySchema>;

export default model<Company>('Company', companySchema);
