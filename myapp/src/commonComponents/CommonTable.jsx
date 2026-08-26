 import React from "react";
import "../assets/CSS/CommonTable.css";

const CommonTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found",
  actions = [],
  addButton = null,
  pagination = null,
  onPageChange,
}) => {
  const safeData = Array.isArray(data) ? data : [];

  const totalColumns =
    columns.length + (actions.length > 0 ? 1 : 0);

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
            {pagination?.total !== undefined
              ? `Showing ${safeData.length} of ${pagination.total} records`
              : `${safeData.length} records`}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="table-toolbar-actions">

          <input
            type="text"
            placeholder="Search..."
            className="table-search"
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
            {loading && (
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
            {!loading && safeData.length === 0 && (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="table-message"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {/* DATA */}
            {!loading &&
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
      {pagination && (
        <div className="table-pagination">

          <span>
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

          <div className="pagination-buttons">

            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() =>
                onPageChange?.(
                  pagination.page - 1
                )
              }
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                pagination.page >=
                pagination.totalPages
              }
              onClick={() =>
                onPageChange?.(
                  pagination.page + 1
                )
              }
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