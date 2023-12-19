import { SortFilterItem } from 'lib/constants';
import { FilterItem } from './item';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = {
  title: string;
  path: string;
  image?: { url: string; altText: string };
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
      <nav className="mx-auto max-w-5xl py-6">
        {title ? (
          <h3 className="mb-3 text-4xl text-neutral-500 dark:text-neutral-400">{title}</h3>
        ) : null}
        <ul className="mx-auto flex flex-wrap justify-center gap-8">
          <FilterItemList list={list} />
        </ul>
      </nav>
    </>
  );
}
