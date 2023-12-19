import clsx from 'clsx';
import { formatPrice } from 'lib/utils';

const Price = ({
  amount,
  className,
  currencyCode = 'USD',
  currencyCodeClassName
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => (
  <p suppressHydrationWarning={true} className={className}>
    <span className={clsx('mr-1 inline font-gin', currencyCodeClassName)}>ab</span>
    {`${formatPrice(amount, currencyCode)}`}
  </p>
);

export default Price;
