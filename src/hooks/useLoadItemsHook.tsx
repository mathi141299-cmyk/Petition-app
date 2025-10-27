import * as React from "react";

export interface Item {
  key: number;
  value: string;
}

export function useLoadItems(props?: any) {
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<Item[]>([]);
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error>();
  async function loadMore() {
    setLoading(true);
    try {
      const { data, hasNextPage: newHasNextPage } = await props.loadItems(
        items.length
      );
      setItems((current) => [...current, ...data]);
      setHasNextPage(newHasNextPage);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  return { loading, items, hasNextPage, error, loadMore };
}
