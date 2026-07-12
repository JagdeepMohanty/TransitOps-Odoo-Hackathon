import { useState, useCallback } from 'react';

/**
 * useApi — thin wrapper around any async API function.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(vehiclesApi.getAll);
 *   useEffect(() => { execute({ page: 1 }); }, [execute]);
 */
export function useApi(apiFn) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data.data);
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message ?? err.message ?? 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { data, loading, error, execute };
}

export default useApi;
