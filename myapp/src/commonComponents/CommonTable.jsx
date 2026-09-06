 import { useEffect, useState } from "react";
import "../assets/CSS/CommonTable.css";
import { getData } from "../Api/common";

const CommonTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found",
  actions = [],
  addButton = null,
  pagination = null,
  onPageChange,
  tableName,
  companyId,
  searchColumns = [],
  pageSize = 10,
}) => {
  const isApiTable = Boolean(tableName && companyId);
  const [apiData, setApiData] = useState([]);
  const [apiPagination, setApiPagination] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!isApiTable) return;

    let cancelled = false;
    getData({ tableName,  companyId, page: apiPagination.page, limit: apiPagination.limit,
      search,
      searchColumns,
    })
      .then((response) => {
        if (cancelled) return;
        setApiData(Array.isArray(response) ? response : response?.data || []);
        if (response?.pagination) setApiPagination(response.pagination);
      })
      .catch(() => {
        if (!cancelled) setApiError("Unable to load records");
      })
      .finally(() => {
        if (!cancelled) setApiLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, isApiTable, search, searchColumns, tableName, apiPagination.page, apiPagination.limit]);

  const safeData = isApiTable ? apiData : Array.isArray(data) ? data : [];
  const tablePagination = isApiTable ? apiPagination : pagination;
  const tableLoading = isApiTable ? apiLoading : loading;

  const totalColumns =  columns.length + (actions.length > 0 ? 1 : 0);
 
  return (
    <div className="common-table-wrapper">

      {/* ================= TOOLBAR ================= */}
      <div className="table-toolbar">

        {/* LEFT SIDE */}
        <div className="table-toolbar-left">

          {addButton && (
            <button
              type="button"
              className="add-new-btn"
              onClick={addButton.onClick}
            >
              <span className="add-icon">+</span>
              {addButton.label || "Add New"}
            </button>
          )}

          <div className="table-record-info">
            {tablePagination?.total !== undefined
              ? `Showing ${safeData.length} of ${tablePagination.total} records`
              : `${safeData.length} records`}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="table-toolbar-actions">

          <input
            type="search"
            placeholder="Search..."
            className="table-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              if (isApiTable) {
                setApiLoading(true);
                setApiPagination((current) => ({ ...current, page: 1 }));
              }
            }}
          />

          <button
            type="button"
            className="filter-btn"
          >
            Filter
          </button>

        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="table-scroll">

        <table className="common-table">

          <thead>
            <tr>

              {/* ACTION COLUMN */}
              {actions.length > 0 && (
                <th className="action-column">
                  Actions
                </th>
              )}

              {/* DYNAMIC COLUMNS */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    width: column.width || "auto",
                  }}
                >
                  {column.label}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>

            {/* LOADING */}
            {tableLoading && (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="table-message"
                >
                  Loading...
                </td>
              </tr>
            )}

            {/* EMPTY */}
            {!tableLoading && safeData.length === 0 && (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="table-message"
                >
                  {apiError || emptyMessage}
                </td>
              </tr>
            )}

            {/* DATA */}
            {!tableLoading &&
              safeData.length > 0 &&
              safeData.map((row, rowIndex) => (

                <tr key={row.id ?? rowIndex}>

                  {/* ACTIONS */}
                  {actions.length > 0 && (
                    <td className="action-column">

                      <div className="action-wrapper">

                        {actions.map((action) => (
                          <button
                            key={action.key}
                            type="button"
                            className={`action-btn ${
                              action.type || ""
                            }`}
                            title={action.label}
                            onClick={() =>
                              action.onClick?.(row)
                            }
                          >
                            {action.icon || action.label}
                          </button>
                        ))}

                      </div>

                    </td>
                  )}

                  {/* COLUMNS */}
                  {columns.map((column) => (
                    <td key={column.key}>

                      {column.render
                        ? column.render(row, rowIndex)
                        : row[column.key] ?? "-"}

                    </td>
                  ))}

                </tr>
              ))}

          </tbody>

        </table>

      </div>

      {/* ================= PAGINATION ================= */}
      {tablePagination && (
        <div className="table-pagination">

          <span>
            Page {tablePagination.page} of{" "}
              {tablePagination.totalPages}
          </span>

          <div className="pagination-buttons">

            <button
              type="button"
              disabled={tablePagination.page <= 1}
              onClick={() => {
                const nextPage = tablePagination.page - 1;
                if (isApiTable) {
                  setApiLoading(true);
                  setApiPagination((current) => ({ ...current, page: nextPage }));
                }
                onPageChange?.(nextPage);
              }}
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                tablePagination.page >=
                tablePagination.totalPages
              }
              onClick={() => {
                const nextPage = tablePagination.page + 1;
                if (isApiTable) {
                  setApiLoading(true);
                  setApiPagination((current) => ({ ...current, page: nextPage }));
                }
                onPageChange?.(nextPage);
              }}
            >
              Next
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default CommonTable;