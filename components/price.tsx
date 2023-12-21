import clsx from 'clsx';
import { formatPrice } from 'lib/utils';

const Price = ({
  amount,
  className,
  currencyCode = 'USD',
  currencyCodeClassName,
  isRange = false
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
  isRange?: boolean;
} & React.ComponentProps<'p'>) => (
  <p suppressHydrationWarning={true} className={className}>
    {isRange ? (
      <span className={clsx('mr-1 inline font-gin', currencyCodeClassName)}>ab</span>
    ) : null}
    {`${formatPrice(amount, currencyCode)}`}
  </p>
);

export default Price;
