import { SortFilterItem } from 'lib/constants';
import FilterItemDropdown from './dropdown';
import { FilterItem } from './item';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = {
  title: string;
  path: string;
  image?: { src: string; altText: string };
};

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

export default function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <>
      <nav className="mx-auto max-w-5xl p-6">
        {title ? (
          <h3 className="mb-3 text-xl text-neutral-500 dark:text-neutral-400">{title}</h3>
        ) : null}
        <ul className="hidden justify-between md:grid md:auto-cols-fr md:grid-flow-col md:gap-8">
          <FilterItemList list={list} />
        </ul>
        <ul className="md:hidden">
          <FilterItemDropdown list={list} />
        </ul>
      </nav>
    </>
  );
}
