 

import React from "react";
import "../assets/CSS/super_admin/homedashboard.css";

export default function HomeDashboard() {

  const cards = [
    {
      title: "Total Companies",
      value: "120"
    },
    {
      title: "Total Vehicles",
      value: "540"
    },
    {
      title: "Total Drivers",
      value: "720"
    },
    {
      title: "Total Revenue",
      value: "₹12,50,000"
    },
    {
      title: "Active Trips",
      value: "85"
    },
    {
      title: "Fuel Usage",
      value: "4,200 L"
    }
  ];


  const companies = [
    {
      name: "ABC Logistics",
      type: "Logistics",
      status: "Active"
    },
    {
      name: "Fuel World",
      type: "Fuel Station",
      status: "Inactive"
    },
    {
      name: "Future College",
      type: "College",
      status: "Active"
    }
  ];


  return (
    <>

      <div className="dashboard-page">

        {/* TOPBAR */}
        <div className="dashboard-topbar">

          <div>
            <h1 className="dashboard-title">
              Fleet Management Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Welcome back Super Admin 👋
            </p>
          </div>

          <div className="topbar-right">

            <input
              type="text"
              placeholder="Search..."
            />

            <div className="admin-profile">
              A
            </div>

          </div>

        </div>


        {/* STATS */}
        <div className="stats-grid">

          {cards.map((card, index) => (

            <div className="stats-card" key={index}>

              <h3>{card.title}</h3>

              <h1>{card.value}</h1>

            </div>

          ))}

        </div>


        {/* MAIN GRID */}
        <div className="dashboard-grid">

          {/* LEFT */}
          <div className="dashboard-left">

            {/* COMPANY TABLE */}
            <div className="dashboard-card">

              <div className="card-header">

                <h2>Recent Companies</h2>

                <button>
                  View All
                </button>

              </div>

              <table>

                <thead>

                  <tr>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {companies.map((company, index) => (

                    <tr key={index}>

                      <td>{company.name}</td>

                      <td>{company.type}</td>

                      <td>

                        <span
                          className={
                            company.status === "Active"
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {company.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* LIVE TRIPS */}
            <div className="dashboard-card trip-card">

              <div className="card-header">

                <h2>Live Trips</h2>

                <button>
                  Track
                </button>

              </div>

              <div className="trip-boxes">

                <div className="trip-box">
                  <h3>85</h3>
                  <p>Running Trips</p>
                </div>

                <div className="trip-box">
                  <h3>20</h3>
                  <p>Delayed Trips</p>
                </div>

                <div className="trip-box">
                  <h3>300</h3>
                  <p>Completed Trips</p>
                </div>

              </div>

            </div>

          </div>


          {/* RIGHT */}
          <div className="dashboard-right">

            {/* NOTIFICATIONS */}
            <div className="dashboard-card">

              <div className="card-header">
                <h2>Notifications</h2>
              </div>

              <div className="notification-list">

                <div className="notification-item">
                  New company registered
                </div>

                <div className="notification-item">
                  Subscription expiring soon
                </div>

                <div className="notification-item">
                  Vehicle maintenance due
                </div>

                <div className="notification-item">
                  Driver document expired
                </div>

              </div>

            </div>


            {/* ANALYTICS */}
            <div className="dashboard-card analytics-card">

              <div className="card-header">
                <h2>Revenue Analytics</h2>
              </div>

              <div className="analytics-box">

                <div className="bar bar1"></div>
                <div className="bar bar2"></div>
                <div className="bar bar3"></div>
                <div className="bar bar4"></div>
                <div className="bar bar5"></div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}