import React from "react";
import { useEffect, useState } from "react";
import { useUser } from '../../Context/role'
import { getVehicleTypes, curdvehicle } from "../../Api/Transport/vehicle";
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


const vehicleTypeColumns = [
  {
    key: "id",
    label: "No.",
    width: "80px",
  },

  {
    key: "name",
    label: "Vehicle Type",
    width: "180px",
  },

  {
    key: "description",
    label: "Description",
  },

  {
    key: "created_at",
    label: "Generate Date",

    render: (row) =>
      row.created_at
        ? new Date(row.created_at)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-")
        : "-",
  },

  {
    key: "updated_at",
    label: "Updated Date",

    render: (row) =>
      row.updated_at
        ? new Date(row.updated_at)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-")
        : "-",
  },

  {
    key: "status",
    label: "Status",

    render: (row) => (
      <span
        className={`vehicle-status ${
          row.status === "Active"
            ? "active"
            : row.status === "Inactive"
            ? "inactive"
            : "pending"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];
import CommonTable from "../../commonComponents/CommonTable";
import { FiSearch, FiPlus } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import '../../assets/CSS/common.css'


export default function VehicleType() {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState("add");
    const [search, setSearch] = useState({
        id: "",
        name: "",
        description: "",
        created_at: "",
        updated_at: "",
        status: "",
    });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

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
    const handleDelete = async (data) => {
        try {
            let payload = {}
            payload = { action: "delete", id: data.id, };
            await curdvehicle(payload);
            notificationService.success(" Vehicle Type Delete Successfully");
            fetchVehicleTypes();
        } catch (error) {
            notificationService.error(error.message);

        }


    }

    const handleEdit = (row) => {
        setMode("edit");
        setFormData({
            id: row.id,
            name: row.name,
            description: row.description,
            status: row.status,
        });
        setOpenModal(true);

    }
    const user = useUser();
    const companyId = user?.User?.user?.company_id;
    const createdBy = user?.User?.user?.id;


    const fetchVehicleTypes = async () => {
        try {

            if (!companyId || !createdBy) return;

            const response = await getVehicleTypes({
                company_id: companyId,
                created_by: createdBy,
                page,
                limit,
                id: search.id,
                name: search.name,
                description: search.description,
                created_at: search.created_at,
                updated_at: search.updated_at,
                status: search.status,
            });
            console.log(search);
            console.log(response)

            setVehicleTypes(response.data);
            setTotalPages(response.pagination.totalPages);

        } catch (error) {
            console.log(error);
            notificationService.error(error?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchVehicleTypes();
    }, [companyId,
        createdBy,
        page,
        limit,
        search.id,
        search.name,
        search.description,
        search.status,
        search.created_at,
        search.updated_at]);

    const okbutton = async (e) => {
        e.preventDefault();

        try {

            let payload = {};

            if (mode === "add") {

                payload = {
                    action: "create",
                    name: formData.name,
                    description: formData.description,
                    status: formData.status,
                    company_id: user?.User?.user?.company_id,
                    created_by: user?.User?.user?.id,
                };

            } else {

                payload = {
                    action: "update",
                    id: formData.id, // update ke liye id zaruri hai
                    name: formData.name,
                    description: formData.description,
                    status: formData.status,
                    company_id: user?.User?.user?.company_id,
                    created_by: user?.User?.user?.id,
                };

            }

            const res = await curdvehicle(payload);

            if (mode === "add") {
                notificationService.success("Vehicle Type Added Successfully");
            } else {
                notificationService.success("Vehicle Type Updated Successfully");
            }

            setOpenModal(false);
            fetchVehicleTypes();

        } catch (error) {
            notificationService.error("Something went wrong");
        }
    };
    return (
        <>
     <CommonTable

        columns={vehicleTypeColumns}

        data={vehicleTypes}

        loading={false}

        emptyMessage="No vehicle types found"

        actions={[
          {
            key: "view",
            label: "View",
            icon: <FaRegEye />,
            onClick: handleView,
          },

          {
            key: "edit",
            label: "Edit",
            icon: <BiEdit />,
            onClick: handleEdit,
          },

          {
            key: "delete",
            label: "Delete",
            icon: <MdDeleteForever />,
            type: "delete",
            onClick: handleDelete,
          },
        ]}

        addButton={{
          label: "Add New",
          onClick: handleAdd,
        }}

        pagination={{
          page: page,
          total: vehicleTypes.length,
          totalPages: totalPages,
        }}

        onPageChange={(newPage) => {
          setPage(newPage);
        }}

      />



            {openModal && (
                <div className="modal_overlay">
                    <div className="modal_box">

                        {/* Header */}
                        <div className="Header">

                            <h2>
                                {mode === "add" ? "Add Vehicle Type" : mode === "edit" ? "Edit Vehicle Type" : "View Vehicle Type"}
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
                                            disabled={mode === "view"}
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
                                            disabled={mode === "view"}

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
                                            disabled={mode === "view"}
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
                                        disabled={mode == 'view'}
                                        onClick={okbutton}

                                    >
                                        {
                                            mode === "add"
                                                ? "OK"
                                                : mode === "edit"
                                                    ? "Save"
                                                    : "Close"
                                        }
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