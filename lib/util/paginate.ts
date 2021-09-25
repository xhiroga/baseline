import { Paginator } from '@aws-sdk/types';

export async function paginate<T, U>(
  paginator: Paginator<T>,
  query: (page: T) => U[] | undefined
): Promise<U[]> {
  const resources: U[] = [];
  for await (const page of paginator) {
    const pagedResources = query(page);
    pagedResources && resources.push(...pagedResources);
  }
  return resources;
}
