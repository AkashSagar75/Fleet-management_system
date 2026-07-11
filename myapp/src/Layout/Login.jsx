import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../Layout/login.css";
import { userLogin, getrole } from "../Api/auth.api";
import notificationService from "../Common/notificationService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";


export default function Login() {
    const navigate = useNavigate();
    const [showDiv, setShowDiv] = useState(false);
    const [roleData, setroleData] = useState([]);

    const [showPassword, setShowPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [selectedRole, setSelectedRole] = useState("");
    const [companyTypeId, setCompanyTypeId] = useState("");
    const backfunction = () => {
        setShowDiv(false);
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginData.email) {
            notificationService.warning("Email is required");
            return;
        }
        if (!loginData.password) {
            notificationService.warning("Password is required");
            return;
        }

        try {
            const res = await userLogin(loginData);
            sessionStorage.setItem("accessToken", res.accessToken);
            sessionStorage.setItem("refreshToken", res.refreshToken);
            sessionStorage.setItem("user", JSON.stringify(res.user));

            setShowDiv(true);

        } catch (err) {

            // notificationService.error(
            //     err.res?.data?.message || "Login Failed"
            // );
        }
    };

    useEffect(() => {
        if (!showDiv) return;
        const fetchRole = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem("user"));
                const id = user?.id;
                if (!id) return;
                const res = await getrole(id);
                console.log(res, "role data");
                setroleData([res.data]);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRole();
    }, [showDiv]);

    const handleRoleChange = (e) => {
        const roleId = Number(e.target.value);

        setSelectedRole(roleId);

        const selected = roleData.find(
            (item) => item.role_id === roleId
        );

        if (selected) {
            setCompanyTypeId(selected.company_type_id);
        }
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!`${selectedRole}`) {
            notificationService.warning("Please select role");
            return;
        }
        notificationService.success('Login Successfully')
        navigate(`/dashboard/${selectedRole}/${companyTypeId}`);

    };
    return (
        <>
            {showDiv ? (
                <div className="login_container">
                    <div className="login_card">
                        <h3></h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form_group">
                                <select
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                >
                                    <option value="">-- Select --</option>

                                    {roleData.map((role) => (
                                        <option key={role.role_id} value={role.role_id}>
                                            {role.role_name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className="form_actions">
                                <a href="#" onClick={backfunction}>Back</a>
                                <button type="submit">Next</button>
                            </div>
                        </form>

                    </div>

                </div>) : (
                <div className="login_container">
                    <div className="login_card">
                        <h2 className="title">Login</h2>

                        <form onSubmit={handleLogin}>
                            <div className="form_group">
                                <label>User Email</label>
                                <input type="email" placeholder="Enter useremail"
                                    maxLength={80}
                                    value={loginData.email}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form_group">
                                <label>Password</label>

                                <div className="password_wrapper">

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        maxLength={8}
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData({
                                                ...loginData,
                                                password: e.target.value,
                                            })
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="eye_btn"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    > {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </button>

                                </div>
                            </div>

                            <div className="form_actions">
                                <a onClick={() => navigate('/forgetpassword')}>Forgot Password?</a>
                                <button type="submit">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
        </>

    );
}