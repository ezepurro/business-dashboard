import { useState, type FormEvent } from 'react';
import { useCreateCompany } from '../../hooks/useCompanies';
import { parseApiError } from '../../utils/getErrorMessage';
import type { ApiFieldError } from '../../types/api.types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AlertBanner } from '../ui/AlertBanner';

interface CreateCompanyModalProps {
  onClose: () => void;
  onCreated: (companyId: string) => void;
}

function fieldError(errors: ApiFieldError[], field: string) {
  return errors.find((e) => e.field === field)?.message;
}

export function CreateCompanyModal({ onClose, onCreated }: CreateCompanyModalProps) {
  const createCompany = useCreateCompany();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [foundedAt, setFoundedAt] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldError[]>([]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors([]);

    try {
      const company = await createCompany.mutateAsync({
        name,
        industry: industry || null,
        currency,
        foundedAt: foundedAt || null,
      });
      onCreated(company._id);
    } catch (error) {
      const parsed = parseApiError(error);
      setFormError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    }
  }

  return (
    <Modal title="New company" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {formError && <AlertBanner message={formError} />}

        <Input
          label="Company name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldError(fieldErrors, 'name')}
        />

        <Input
          label="Industry"
          placeholder="e.g. Retail, Software"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          error={fieldError(fieldErrors, 'industry')}
        />

        <Input
          label="Currency (ISO 4217)"
          maxLength={3}
          value={currency}
          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          error={fieldError(fieldErrors, 'currency')}
        />

        <Input
          label="Founded on"
          type="date"
          value={foundedAt}
          onChange={(e) => setFoundedAt(e.target.value)}
          error={fieldError(fieldErrors, 'foundedAt')}
        />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createCompany.isPending}>
            Create company
          </Button>
        </div>
      </form>
    </Modal>
  );
}
