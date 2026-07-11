 import React, { useEffect, useState } from "react";
import "../../../assets/CSS/super_admin/company/Companylist.css";

export default function CompanyList() {

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {

    const data = [
      {
        id: 1,
        name: "ABC Logistics",
        type: "logistics",
        contact_person: "Akash",
        phone: "9876543210",
        status: "active",
        created_at: "2026-05-09"
      },
      {
        id: 2,
        name: "Future College",
        type: "college",
        contact_person: "Rahul",
        phone: "9999999999",
        status: "inactive",
        created_at: "2026-05-01"
      },
      {
        id: 3,
        name: "Fuel World",
        type: "fuel_station",
        contact_person: "Sagar",
        phone: "8888888888",
        status: "active",
        created_at: "2026-05-04"
      }
    ];

    setCompanies(data);
    setFilteredCompanies(data);

  }, []);

  useEffect(() => {

    let result = companies;

    // SEARCH
    if (search) {
      result = result.filter((company) =>
        company.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // STATUS
    if (statusFilter !== "all") {
      result = result.filter(
        (company) => company.status === statusFilter
      );
    }

    // TYPE
    if (typeFilter !== "all") {
      result = result.filter(
        (company) => company.type === typeFilter
      );
    }

    setFilteredCompanies(result);

  }, [search, statusFilter, typeFilter, companies]);


  // TOGGLE STATUS
  const toggleStatus = (id) => {

    const updated = companies.map((company) => {

      if (company.id === id) {

        return {
          ...company,
          status:
            company.status === "active"
              ? "inactive"
              : "active"
        };
      }

      return company;
    });

    setCompanies(updated);
  };


  return (
    <>

      <div className="company-page">

        {/* TOP */}
        <div className="company-top">

          <div>
            <h1 className="page-title">
              Company List
            </h1>

            <p className="page-subtitle">
              Manage all onboarded companies
            </p>
          </div>

          <button className="add-company-btn">
            + Add Company
          </button>

        </div>


        {/* FILTERS */}
        <div className="filter-wrapper">

          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="logistics">Logistics</option>
            <option value="college">College</option>
            <option value="fuel_station">Fuel Station</option>
          </select>

        </div>


        {/* TABLE */}
        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredCompanies.length > 0 ? (

                filteredCompanies.map((company) => (

                  <tr key={company.id}>

                    <td>{company.id}</td>

                    <td>{company.name}</td>

                    <td>
                      <span className="type-badge">
                        {company.type}
                      </span>
                    </td>

                    <td>{company.contact_person}</td>

                    <td>{company.phone}</td>

                    <td>

                      <button
                        className={
                          company.status === "active"
                            ? "status-btn active"
                            : "status-btn inactive"
                        }
                        onClick={() => toggleStatus(company.id)}
                      >
                        {company.status}
                      </button>

                    </td>

                    <td>{company.created_at}</td>

                    <td>

                      <div className="action-btns">

                        <button className="view-btn">
                          View
                        </button>

                        <button className="edit-btn">
                          Edit
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="8" className="no-data">
                    No companies found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </>
  );
}