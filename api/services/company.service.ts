import { Company } from '../models';
import { UserRole } from '../types/enums';
import ApiError from '../utils/ApiError';

interface CreateCompanyDTO {
  name: string;
  industry?: string | null;
  currency?: string;
  foundedAt?: Date | null;
}

interface UpdateCompanyDTO {
  name?: string;
  industry?: string | null;
  currency?: string;
  foundedAt?: Date | null;
}

class CompanyService {
  async create(ownerId: string, data: CreateCompanyDTO) {
    return Company.create({
      ...data,
      owner: ownerId,
    });
  }

  async findAllByOwner(ownerId: string) {
    return Company.find({ owner: ownerId }).sort({ createdAt: -1 });
  }

  async findAllPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      Company.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Company.countDocuments(),
    ]);

    return {
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(companyId: string, userId: string, userRole: UserRole) {
    const company = await Company.findById(companyId);

    if (!company) {
      throw new ApiError(404, 'Empresa no encontrada.');
    }

    this.assertAccess(company.owner.toString(), userId, userRole);

    return company;
  }

  async update(companyId: string, userId: string, userRole: UserRole, data: UpdateCompanyDTO) {
    const company = await this.findById(companyId, userId, userRole);

    company.set(data);

    await company.save();

    return company;
  }

  async delete(companyId: string, userId: string, userRole: UserRole) {
    const company = await this.findById(companyId, userId, userRole);

    await company.deleteOne();

    return;
  }

  private assertAccess(ownerId: string, userId: string, userRole: UserRole) {
    if (ownerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ApiError(403, 'No autorizado para acceder a esta empresa.');
    }
  }
}

export default new CompanyService();
