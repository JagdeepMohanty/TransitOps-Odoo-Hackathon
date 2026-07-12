import { useState, useMemo } from 'react';

export function usePagination(data = [], defaultPageSize = 10) {
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  function handlePageChange(p) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  function handlePageSizeChange(s) {
    setPageSize(s);
    setPage(1);
  }

  return {
    page, pageSize, totalItems, totalPages,
    paged,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
  };
}

export default usePagination;
