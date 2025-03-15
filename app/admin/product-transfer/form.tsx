'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { triggerProductCreation } from 'actions/admin';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const formSchema = z.object({
  r2o_itemnumber: z.string().min(1, { message: 'Dieses Feld wird benötigt' })
});

function ProductTransferForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => triggerProductCreation(data.r2o_itemnumber),
    onSuccess: () => {
      toast.success('Produkt wurde erfolgreich übertragen', {
        position: 'top-right',
        autoClose: 5000
      });
      reset();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Fehler beim Übertragen des Produkts', {
        position: 'top-right',
        autoClose: 5000
      });
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control w-full max-w-xs">
        <label htmlFor="r2o_itemnumber" className="label">
          <span className="label-text">R2O Artikelnummer</span>
        </label>
        <input
          id="r2o_itemnumber"
          {...register('r2o_itemnumber')}
          className="input input-bordered w-full"
          placeholder="Artikelnummer eingeben"
        />
        {errors.r2o_itemnumber && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.r2o_itemnumber.message || 'Dieses Feld wird benötigt'}
            </span>
          </label>
        )}
      </div>
      <button type="submit" className="btn btn-secondary" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <span className="loading loading-spinner"></span>
            Übertrage...
          </>
        ) : (
          'Übertragen'
        )}
      </button>
    </form>
  );
}

export default ProductTransferForm;
