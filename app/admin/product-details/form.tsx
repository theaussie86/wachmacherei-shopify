'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { findR2OProduct } from 'lib/r2o';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
  .object({
    r2o_itemnumber: z.string().optional(),
    r2o_name: z.string().optional()
  })
  .refine(
    (data) => {
      return data.r2o_itemnumber || data.r2o_name;
    },
    {
      message: 'Entweder die Artikelnummer oder der Name muss ausgefüllt werden',
      path: ['r2o_itemnumber']
    }
  );

function ProductDetailsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const itemNumber = useWatch({ control, name: 'r2o_itemnumber' });
  const name = useWatch({ control, name: 'r2o_name' });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['product-details', itemNumber, name],
    queryFn: () => findR2OProduct({ itemNumber, name }),
    enabled: false
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    refetch();
  };

  return (
    <div className="flex flex-col gap-4">
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
        </div>
        <div className="form-control w-full max-w-xs">
          <label htmlFor="r2o_name" className="label">
            <span className="label-text">R2O Name</span>
          </label>
          <input
            id="r2o_name"
            {...register('r2o_name')}
            className="input input-bordered w-full"
            placeholder="Name eingeben"
          />
        </div>
        {errors.r2o_itemnumber && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.r2o_itemnumber.message}</span>
          </label>
        )}
        <button type="submit" className="btn btn-secondary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              Übertrage...
            </>
          ) : (
            'Übertragen'
          )}
        </button>
      </form>
      {data && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">{data.name}</h2>
            <pre>
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsForm;
