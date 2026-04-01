export const serverCache = new Map<string, { data: any; timestamp: number }>();

export async function fetchWithCache<T>(
  cacheKey: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = serverCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < ttlSeconds * 1000) {
    return cached.data as T;
  }

  const data = await fetcher();
  serverCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
