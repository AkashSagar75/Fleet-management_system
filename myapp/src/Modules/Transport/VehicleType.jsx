import React from "react";
import { useEffect, useState } from "react";
import { useUser } from '../../Context/role'
import { getVehicleTypes } from "../../Api/Transport/vehicle";
import notificationService from "../../Common/notificationService";
import {
    FaTruck,
    FaCheckCircle,
    FaTimesCircle,
    FaTools,
    FaPlus,
    FaFileImport,
    FaFileExport, FaRegEye
} from "react-icons/fa";
import { FiSearch, FiPlus } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import '../../assets/CSS/common.css'

export default function VehicleType() {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState("add");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Active",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAdd = () => {

        setMode("add");

        setFormData({
            id: "",
            name: "",
            description: "",
            status: "Active"
        });

        setOpenModal(true);

    }
    const handleView = (row) => {

        setMode("view");

        setFormData({
            id: row.id,
            name: row.name,
            description: row.description,
            status: row.status
        });

        setOpenModal(true);

    }

    const handleEdit = (row) => {

        setMode("edit");

        setFormData({
            id: row.id,
            name: row.name,
            description: row.description,
            status: row.status
        });

        setOpenModal(true);

    }
    const user = useUser();
    const companyId = user?.User?.user?.company_id;
    const createdBy = user?.User?.user?.id;

    useEffect(() => {
        console.log("API CALLED");
        const fetchVehicleTypes = async () => {
            try {

                if (!companyId || !createdBy) return;
                const response = await getVehicleTypes({
                    company_id: companyId,
                    created_by: createdBy,
                });


                setVehicleTypes(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchVehicleTypes();
    }, [companyId, createdBy]);


    return (
        <>
            <div className="flex justify-between gap-5">
                <h2 className=" text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight m-8">
                    Vehicle Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                    <div

                        className="bg-white w-[250px] h-[130px] rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 p-5 flex items-center gap-4"
                    >
                        <div
                            className={`w-14 h-14 rounded-xl mr-4   flex items-center justify-center text-white`}
                        >
                            item.icon
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Total Vehicle Type</p>

                            <h2 className="text-3xl font-bold text-gray-800">
                                22
                            </h2>

                            <p className="text-xs text-gray-400">
                                All Type
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 mb-6">

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                    {/* Add Button */}
                    <button
                        onClick={handleAdd}
                        className="flex w-34 h-11 left-11 items-center gap-2 bg-[#14d8c4] hover:bg-[#10c3b1] text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
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

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md">

                <table className="min-w-full border-collapse">

                    {/* Header */}
                    <thead className="bg-[#14d8c4] text-white">

                        <tr>

                            <th className="border border-gray-200 px-4 py-3 w-21  ">
                                Action
                            </th>

                            <th className="border border-gray-200 px-4 py-3  w-18">
                                No.
                            </th>

                            <th className="border border-gray-200 px-4 py-3 w-25 ">
                                Vehicle Type
                            </th>

                            <th className="border border-gray-200 px-4 py-3  ">
                                Description
                            </th>

                            <th className="border border-gray-200 px-4 py-3 w-15 ">
                                Status
                            </th>

                        </tr>

                    </thead>

                    {/* Body */}
                    <tbody>

                        {vehicleTypes.map((data, index) => (

                            <tr
                                key={data.id}
                                className="hover:bg-cyan-50 transition duration-200"
                            >

                                <td className="border border-gray-200 px-4 py-3">

                                    <div className="flex  gap-2">

                                        <button
                                            onClick={() => handleView(data)}
                                            className="w-9 h-9 rounded-lg  bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white  flex items-center justify-center">
                                            <FaRegEye />
                                        </button>

                                        <button
                                            onClick={() => handleEdit(data)}
                                            className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white flex items-center justify-center">
                                            <BiEdit />
                                        </button>

                                        <button className="w-9 h-9 rounded-lg bg-rose-100 hover:bg-rose-600  hover:text-white text-rose-600 flex items-center justify-center">
                                            <MdDeleteForever />
                                        </button>

                                    </div>

                                </td>

                                <td className="border border-gray-200 px-4 py-3  ">
                                    {data.id}
                                </td>

                                <td className="border border-gray-200 px-4 py-3">
                                    {data.name}
                                </td>

                                <td className="border border-gray-200 px-4 py-3">
                                    {data.description}
                                </td>

                                <td className="border border-gray-200 px-4 py-3  ">

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold
                                                 ${data.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : data.status === "Inactive"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {data.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {openModal && (
                <div className="modal_overlay">
                    <div className="modal_box">

                        {/* Header */}
                        <div className="Header">

                            <h2>

                                {
                                    mode === "add"

                                        ?

                                        "Add Vehicle Type"

                                        :

                                        mode === "edit"

                                            ?

                                            "Edit Vehicle Type"

                                            :

                                            "View Vehicle Type"

                                }

                            </h2>

                            <button
                                onClick={() => setOpenModal(false)}
                                className=""
                            >
                                &times;
                            </button>

                        </div>

                        {/* Body */}

                        <div className=" ">
                            <form action="">
                                <div className="group_from">

                                    <label className="block text-sm font-medium mb-2">
                                        Vehicle Type
                                    </label>
                                    <div className="input_wrap">
                                        <input
                                            type="text"

                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter Vehicle Type"
                                            className=""
                                        />

                                    </div>


                                </div>

                                <div className="group_from ">

                                    <label className="block text-sm font-medium mb-2">
                                        Description
                                    </label>

                                    <div className="input_wrap">
                                        <textarea
                                            rows="4"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Enter Description"
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
                                        />

                                    </div>


                                </div>

                                <div className="group_from">

                                    <label className="block text-sm font-medium mb-2">
                                        Status
                                    </label>
                                    <div className="input_wrap">

                                        <select className="w-full border rounded-xl px-4 py-3"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >

                                            <option>Active</option>
                                            <option>Inactive</option>

                                        </select>

                                    </div>


                                </div>

                                <div className="btn_part">

                                    <button
                                        onClick={() => setOpenModal(false)}
                                        className=""
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className=""
                                    >
                                        Save
                                    </button>

                                </div>


                            </form>

                        </div>
                    </div>

                </div>
            )}
        </>
    );
}