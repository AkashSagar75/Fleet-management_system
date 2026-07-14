import React from "react";
import { useEffect, useState } from "react";
import {useUser} from '../../Context/role'
import { getVehicleTypes } from "../../Api/Transport/vehicle";
import notificationService from "../../Common/notificationService";
 import {
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaTools,
  FaPlus,
  FaFileImport,
  FaFileExport,
} from "react-icons/fa";
import { FiSearch, FiPlus } from "react-icons/fi";


export default function Vehicle() {
  const user =  useUser();
    const [vehicleTypes, setVehicleTypes] = useState([]);
    
     

  const stats = [
    {
      title: "Total Vehicles",
      value: 32,
      subtitle: "All Vehicles",
      icon: <FaTruck size={24} />,
      bg: "bg-blue-500",
    },
    {
      title: "Active Vehicles",
      value: 28,
      subtitle: "Currently Active",
      icon: <FaCheckCircle size={24} />,
      bg: "bg-green-500",
    },
    {
      title: "In Maintenance",
      value: 3,
      subtitle: "Under Service",
      icon: <FaTools size={24} />,
      bg: "bg-orange-500",
    },
    {
      title: "Inactive Vehicles",
      value: 1,
      subtitle: "Not In Use",
      icon: <FaTimesCircle size={24} />,
      bg: "bg-red-500",
    },
  ];

    return (
        <>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
  {stats.map((item, index) => (
    <div
      key={index}
      className="bg-white w-[250px] h-[130px] rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 p-5 flex items-center gap-4"
    >
      <div
        className={`w-14 h-14 rounded-xl mr-4 ${item.bg} flex items-center justify-center text-white`}
      >
        {item.icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">{item.title}</p>

        <h2 className="text-3xl font-bold text-gray-800">
          {item.value}
        </h2>

        <p className="text-xs text-gray-400">
          {item.subtitle}
        </p>
      </div>
    </div>
  ))}
</div>
 

          <h2 className=" text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight m-8">
            Vehicle List
          </h2>

           
 

<div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 mb-6">

  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

    {/* Add Button */}
    <button className="flex w-34 h-11 left-11 items-center gap-2 bg-[#14d8c4] hover:bg-[#10c3b1] text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
      <FiPlus size={18} />
      Add New
    </button>

    {/* Search Box */}
    <div className="relative w-full sm:w-80">
        <input
        type="text"
        placeholder="Search..."
        className="w-full h-11 rounded-xl border border-gray-300 bg-gray-50 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 transition"
      />
      
      <FiSearch
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />

    </div>

  </div>

</div>

    

        <div className="overflow-x-auto m-4">

          <table className="w-full border-collapse">

            <thead  className="rounded-lg">

              <tr className="bg-[ #14d8c4;] text-gray-700    mr-2 ">

                <th className="">#</th>
                <th className="">Vehicle No.</th>
                <th className="">Type</th>
                <th className="">Driver</th>
                <th className="">Status</th>
                <th className=" ">Action</th>

              </tr>

            </thead>

            <tbody>
            

                <tr    className="border-b hover:bg-gray-50">

                <td className="p-3">id</td>

                <td className="p-3">{}</td>

                <td className="p-3">Truck</td>

                <td className="p-3">Akash Sagar</td>

                <td className="p-3">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>

                </td>

                <td className="p-3  flex text-center gap-3">

                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                    View
                  </button>

                  <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">
                    Edit
                  </button>

                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>

                </td>

              </tr>
              

            </tbody>

          </table>

        </div>

    


        </>
    );
}