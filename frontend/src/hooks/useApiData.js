import { useState, useEffect } from 'react';

/**
 * 通用数据获取 Hook
 *
 * @param {Function} fetcher - 数据获取函数（返回 Promise）
 * @returns {{ data: any, loading: boolean, error: Error|null }}
 *
 * 用法：
 *   const { data: routes, loading } = useApiData(fetchRoutes);
 */
export function useApiData(fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  return { data, loading, error };
}

export default useApiData;
