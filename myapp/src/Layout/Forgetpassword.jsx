import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Layout/forgetpassword.css'
import { forgetPassword, verifyOtp, resetPassword } from '../Api/auth.api';
import notificationService from "../Common/notificationService";

export default function Forgetpassword() {
    const navigate = useNavigate();
    const [showDiv, setshowDiv] = useState('email');
    const [sendOtpData, setsendOtpData] = useState({
        email: ''

    })
    const [verifypData, setverifyData] = useState({
        email: '',
        otp: ''

    })
    const [resetPWData, setresetPWData] = useState({
        email: '',
        password: ''

    })
    const [timer, setTimer] = useState(600);
    const [otpExpired, setOtpExpired] = useState(false);

    const backfunction = () => {
        navigate('/');
    }
    const sendOtp = async (e) => {
        e.preventDefault();
        if (!sendOtpData.email) {
            notificationService.warning("Email Required");
            return;
        }

        try {
            const res = await forgetPassword(sendOtpData);
            setverifyData({
                email: sendOtpData.email,
                otp: ''
            });
            notificationService.success('Sent Otp Successfully')
            setTimer(600);
            setOtpExpired(false);
            setshowDiv('otp')
        } catch (error) {
            console.error('not send otp ')
            notificationService.error('Sent Opt Failed')
        }


    }
    const backToSentOtp = () => {
        setshowDiv('email')
    }
    const formatTime = () => {

        const minutes = Math.floor(timer / 60);

        const seconds = timer % 60;

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
    useEffect(() => {

        let interval;

        if (showDiv === "otp" && timer > 0) {

            interval = setInterval(() => {

                setTimer((prev) => prev - 1);

            }, 1000);

        } else if (timer === 0) {

            setOtpExpired(true);

        }

        return () => clearInterval(interval);

    }, [showDiv, timer]);
    const verifyOTP = async (e) => {
        e.preventDefault();
        if (!verifypData.otp) {
            notificationService.warning('OTP Required');
            return;
        }

        try {
            const res = await verifyOtp(verifypData);
            if (res.success) {
                setresetPWData({
                    email: verifypData.email,
                    password: ''
                })
                notificationService.success('OTP Verify')
                setshowDiv("reset");
            } else {
                notificationService.error("Invalid OTP");
            }
        } catch (error) {
            console.error('not verify otp')
            notificationService.error('Failed Verify Otp')
        }
    }
    const backToVerify = () => {
        setshowDiv('otp')
    }
    const resetPasswordF = async (e) => {
        e.preventDefault();
        try {
            const res = await resetPassword(resetPWData);
            navigate('/');
        } catch (error) {

        }

    }
    return (
        <>
            {showDiv === 'otp' && (
                <div className="login_container">
                    <div className="login_card">
                        <h3></h3>
                        <form onSubmit={verifyOTP}>
                            <div className="form_group">
                                <label>OTP</label>
                                <input type="number" placeholder="Enter otp"
                                    maxLength={6}

                                    value={verifypData.otp}
                                    onChange={(e) =>
                                        setverifyData({ ...verifypData, otp: e.target.value })
                                    }
                                />
                                <p className="otp_timer bg-red">
                                    OTP expires in: {formatTime()}
                                </p>
                            </div>
                            <div className="form_actions_otp">
                                <button className="btn" type="button"
                                    onClick={backToSentOtp}>Back</button>
                                <button type="submit">Verify Otp</button>
                            </div>
                        </form>
                    </div>
                </div>)
            }
            {showDiv === 'email' &&
                (
                    <div className="login_container">
                        <div className="login_card">
                            <form onSubmit={sendOtp}>
                                <div className="form_group">
                                    <label>User Email</label>
                                    <input type="email" placeholder="Enter useremail"
                                        value={sendOtpData.email}
                                        onChange={(e) =>
                                            setsendOtpData({ ...sendOtpData, email: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form_actions_otp">
                                    <button type="button"
                                        onClick={backfunction}>Back</button>
                                    <button type="submit">Sent Otp</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {showDiv === 'reset' && (
                <>
                    <div className="login_container">
                        <div className="login_card">
                            <form onSubmit={resetPasswordF}>
                                <div className="form_group">
                                    <label>New Password</label>
                                    <input type="password" placeholder="Enter new password" maxLength={8}
                                        value={resetPWData.password}
                                        onChange={(e) =>
                                            setresetPWData({ ...resetPWData, password: e.target.value })
                                        }

                                    />
                                </div>
                                <div className="form_actions_otp">
                                    <button type="button" onClick={backToVerify}>Back</button>
                                    <button type="submit">Reset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}