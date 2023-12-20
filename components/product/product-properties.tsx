import BeanIcon from 'components/icons/bean';
import { Product } from 'lib/shopify/types';

function Strength({ strength }: { strength: number }) {
  const strengthIndexes = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-x-2">
      {strengthIndexes.map((index) => {
        const isActive = index <= strength;

        return (
          <BeanIcon
            key={index}
            isActive={isActive}
            className="h-10 w-10 text-primary dark:text-white"
          />
        );
      })}
    </div>
  );
}

function FieldValue({ field }: { field: { key: string; value: string } }) {
  if (field.value.startsWith('[') && field.value.endsWith(']')) {
    const arr = JSON.parse(field.value);
    return <span>{arr.join(', ')}</span>;
  }

  return <span>{field.value}</span>;
}

function ProductProperties({ metafields }: { metafields: Product['metafields'] }) {
  const strength = metafields.find((field) => field !== null && field.key === 'strength');
  const anbauhoehe = metafields
    .filter((field) => field !== null && field.key.startsWith('anbauhoehe'))
    .reduce<Record<string, string>>((acc, cur) => {
      const key = cur?.key.split('_')[1];
      const value = cur?.value;
      if (!key || !value) return acc;
      acc[key] = value;
      return acc;
    }, {});
  const fields = metafields.filter(
    (field) => field !== null && field.key !== 'strength' && !field.key.startsWith('anbauhoehe')
  );
  return fields && fields.length > 1 ? (
    <div className="my-6 flex flex-col gap-y-3">
      {strength ? <Strength strength={parseInt(strength.value)} /> : null}
      {fields.map((field) => {
        return field ? (
          <div className="flex gap-x-2" key={field.key}>
            <span className="font-bold capitalize">{field.key}:</span>
            <FieldValue field={field} />
          </div>
        ) : null;
      })}
      {Object.keys(anbauhoehe).length > 0 ? (
        <div className="flex gap-x-2">
          <span className="font-bold capitalize">Anbauhöhe:</span>
          <span>
            {anbauhoehe.start}
            {anbauhoehe.ende ? ` bis ${anbauhoehe.ende} ` : ' '}Meter
          </span>
        </div>
      ) : null}
    </div>
  ) : null;
}

export default ProductProperties;
