'use client';

import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

type CacheClearFormProps = {
  clearCache: () => Promise<{ message: string; status: 'success' | 'error' }>;
};

export default function CacheClearForm({ clearCache }: CacheClearFormProps) {
  const [state, formAction] = useFormState(async () => {
    const result = await clearCache();
    if (result.status === 'success') {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    return result;
  }, null);

  return (
    <div>
      <form className="card-actions justify-end" action={formAction}>
        <button className="btn btn-secondary btn-sm" type="submit">
          Cache Löschen
        </button>
      </form>
    </div>
  );
}
