import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDB } from '../config/database';

import User from '../models/User';
import Company from '../models/Company';
import Dataset from '../models/Dataset';
import Analysis from '../models/Analysis';

import { AnalysisStatus, DatasetStatus, UserRole, UserStatus } from '../types/enums';

async function seed() {
  try {
    await connectDB();

    console.log('Limpiando colecciones...');

    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Dataset.deleteMany({}),
      Analysis.deleteMany({}),
    ]);

    console.log('Creando usuario...');

    const user = await User.create({
      username: 'ezequiel',
      name: 'Ezequiel Purro',
      email: 'eze@gmail.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefgh',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    console.log('Creando empresa...');

    const company = await Company.create({
      name: 'Tech Solutions',
      industry: 'Software',
      currency: 'USD',
      foundedAt: new Date('2024-01-15'),
      owner: user._id,
    });

    console.log('Creando dataset...');

    const dataset = await Dataset.create({
      company: company._id,
      uploadedBy: user._id,
      originalFilename: 'ventas_2025.csv',
      extension: 'csv',
      mimeType: 'text/csv',
      size: 1024,
      bucket: 'datasets',
      objectKey: 'companies/demo/demo.csv',
      status: DatasetStatus.READY,
    });

    console.log('Creando análisis...');

    await Analysis.create({
      datasetId: dataset._id,
      companyId: company._id,

      status: AnalysisStatus.SUCCESS,
      profile: {
        metadata: {
          datasetName: 'ventas_2025.csv',
        },
      },
      processingTime: 1520,
      pythonVersion: '3.11.9',
      engineVersion: '1.0.0',
      errorMessage: null,
    });

    console.log('');
    console.log('✅ Base de datos poblada correctamente.');

    await mongoose.disconnect();

    process.exit(0);
  } catch (err) {
    console.error(err);

    await mongoose.disconnect();

    process.exit(1);
  }
}

seed();
