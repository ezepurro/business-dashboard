import { useRef, useState } from 'react';
import { useUploadDataset } from '../../hooks/useDatasets';
import { parseApiError } from '../../utils/getErrorMessage';
import { Button } from '../ui/Button';
import { AlertBanner } from '../ui/AlertBanner';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = '.csv,.xlsx';

interface UploadDatasetButtonProps {
  companyId: string;
}

export function UploadDatasetButton({ companyId }: UploadDatasetButtonProps) {
  const uploadDataset = useUploadDataset(companyId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('The file exceeds the 15MB limit.');
      return;
    }

    uploadDataset.mutate(file, {
      onError: (uploadError) => setError(parseApiError(uploadError).message),
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        onChange={handleSelect}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        isLoading={uploadDataset.isPending}
        className="cursor-pointer"
      >
        Upload dataset
      </Button>
      {error && <AlertBanner message={error} />}
    </div>
  );
}
