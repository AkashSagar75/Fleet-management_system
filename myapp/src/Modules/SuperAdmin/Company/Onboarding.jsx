import { useEffect, useState } from "react";
import '../../../assets/CSS/super_admin/company/onboarding.css'

import { createCompany, getrole, verifyPayment ,getCompanyTypes} from '../../../Api/company'
import notificationService from "../../../Common/notificationService";
export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);
  const [roles, setRoles] = useState([]);
  const [companyTypes, setCompanyTypes] = useState([]);

  const [onboarding, setOnboarding] = useState({
    company: { name: "", company_type_id: "", address: "", contact_person: "", phone: "", status: "active" },
    subscription_plan: {
      name: "", price: "", user_limit: "", features: {
        employee_management: false,
        attendance: false,
        payroll: false,
        reports: false,
        driver_management: false,
        vehicle_management: false,
        live_tracking: false,
        gps_tracking: false
      }
    },

    subscription: {
      start_date: "",
      end_date: "",

    },
    user: { name: "", email: "", password: "", role_id: null },
    payment: { amount: null, payment_gateway: "", transaction_id: "", payment_status: "" }
  })

  useEffect(() => {
    const fatchRoles = async () => {
      try {
        const res = await getrole();
        if (res.success) {
          setRoles(res.data)
        }
      } catch (error) {
        notificationService.error(error.message)
      }
    }
    fatchRoles();
  }, [])

  const handleCompany = (e) => {
    const { name, value } = e.target;
    setOnboarding(prev => ({
      ...prev,
      company: {
        ...prev.company,
        [name]: value
      }
    }))
  }

  const handleUser = (e) => {

    const { name, value } = e.target;

    setOnboarding(prev => ({

      ...prev,

      user: {

        ...prev.user,

        [name]: name === "role_id" ? Number(value) : value,

      }

    }));

  }

  const handlePlan = (e) => {

    const { name, value } = e.target;

    setOnboarding(prev => ({

      ...prev,

      subscription_plan: {
        ...prev.subscription_plan,
        [name]: value
      }

    }));

  }
  const featureList = [
    { key: "employee_management", label: "Employee Management" },
    { key: "attendance", label: "Attendance" },
    { key: "payroll", label: "Payroll" },
    { key: "reports", label: "Reports" },
    { key: "driver_management", label: "Driver Management" },
    { key: "vehicle_management", label: "Vehicle Management" },
    { key: "live_tracking", label: "Live Tracking" },
    { key: "gps_tracking", label: "GPS Tracking" },
  ];
  const handleFeature = (e) => {

    const { name, checked } = e.target;

    setOnboarding(prev => ({

      ...prev,

      subscription_plan: {

        ...prev.subscription_plan,

        features: {

          ...prev.subscription_plan.features,

          [name]: checked

        }

      }

    }));

  }
  const handleSubscription = (e) => {

    const { name, value } = e.target;

    setOnboarding(prev => ({

      ...prev,

      subscription: {

        ...prev.subscription,

        [name]: value

      }

    }));

  }
  const handlePayment = (e) => {

    const { name, value } = e.target;

    setOnboarding(prev => ({

      ...prev,

      payment: {

        ...prev.payment,

        [name]: value

      }

    }));

  }

   useEffect(()=>{
     const fetchcompanytpe= async()=>{
      try {
        const res = await getCompanyTypes();
        if(res.success){
          setCompanyTypes(res.data)
        }
      } catch (error) {
        notificationService.error()
        
      }
     }
     fetchcompanytpe();
   },[])
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        ...onboarding,
        payment: {
          ...onboarding.payment,
          amount: onboarding.subscription_plan.price,
        },
      };

      setLoading(true);
      const response = await createCompany(submissionData);

      if (response.success) {
        if (!response.order || !response.key) {
          alert("Company created but payment information is unavailable.");
          setStep(1);
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          notificationService.error("Unable to load Razorpay checkout. Please try again.");
          return;
        }

        const options = {
          key: response.key,
          amount: response.order.amount,
          currency: response.order.currency,
          name: onboarding.company.name || "Company",
          description: `Payment for ${onboarding.subscription_plan.name || 'Subscription'} plan`,
          order_id: response.order.id,
          handler: async (paymentResult) => {
            setLoading(true);
            const verifyResponse = await verifyPayment({
              company_id: response.companyId,
              subscription_id: response.subscriptionId,
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_signature: paymentResult.razorpay_signature,
            });

            setLoading(false);

            if (verifyResponse.success) {
              notificationService.success("Payment Successful! ✅");
              navigation('/dashboard');
            } else {
              notificationService.error(verifyResponse.message || "Payment verification failed.");
            }
          },
          prefill: {
            name: onboarding.user.name,
            email: onboarding.user.email,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.log(error);
      notificationService.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className=" ">


        {/* TOP STEP ROW */}
        <div className="top-row">

          {/* STEP 1 */}
          <div className="step-item">

            <div
              className={`step-circle ${step >= 1 ? "active-step" : ""
                }`}
            >
              1
            </div>

            <span className="step-label">
              Basic Info
            </span>

          </div>

          {/* LINE */}
          <div
            className={`step-line ${step >= 2 ? "active-line" : ""
              }`}
          ></div>

          {/* STEP 2 */}

          <div className="step-item">

            <div
              className={`step-circle ${step >= 2 ? "active-step" : ""
                }`}
            >
              2
            </div>

            <span className="step-label">
              User & Role

            </span>

          </div>
          <div
            className={`step-line ${step >= 2 ? "active-line" : ""
              }`}
          ></div>

          <div className="step-item">

            <div
              className={`step-circle ${step >= 3 ? "active-step" : ""
                }`}
            >
              3
            </div>

            <span className="step-label">
              Subscription plan
            </span>

          </div>

          {/* LINE */}
          <div
            className={`step-line ${step >= 4 ? "active-line" : ""
              }`}
          ></div>
          {/* STEP 2 */}
          <div className="step-item">

            <div
              className={`step-circle ${step >= 4 ? "active-step" : ""
                }`}
            >
              4
            </div>

            <span className="step-label">
              Subscription
            </span>

          </div>
          {/* LINE */}
          <div
            className={`step-line ${step >= 5 ? "active-line" : ""
              }`}
          ></div>

          {/* STEP 4 */}
          <div className="step-item">

            <div
              className={`step-circle ${step >= 5 ? "active-step" : ""
                }`}
            >
              5
            </div>

            <span className="step-label">
              Payment
            </span>

          </div>

        </div>

        {step === 1 && (


          <div className="company-card">

            {/* HEADER */}
            <div className="company-header">

              <h1 className="company-title">
                Basic Information
              </h1>

              <p className="company-subtitle">
                Enter your basic details to continue onboarding
              </p>

            </div>


            {/* FORM */}
            <form className="company-form"  >

              {/* COMPANY NAME */}
              <div className="form-group">

                <label>
                  Company Name
                </label>

                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter name"
                    name="name" value={onboarding.company.name} onChange={handleCompany}

                  />
                </div>

              </div>


              {/* COMPANY TYPE */}
              <div className="form-group">  <label> Company Type </label>
                <div className="input-wrap">
                  <select name="company_type_id"
                    value={onboarding.company.company_type_id}
                    onChange={handleCompany}
                  >
                    <option value="">Select Company Type</option>
                    {companyTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                   
                  </select>
                </div>
              </div>  {/* CONTACT PERSON */}
              <div className="form-group">
                <label> Contact Person </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter contact person"
                    name="contact_person"
                    value={onboarding.company.contact_person}
                    onChange={handleCompany}
                  />
                </div>
              </div>
              {/* PHONE */}
              <div className="form-group">
                <label>   Phone Number  </label>
                <div className="input-wrap">
                  <input
                    type="number"
                    placeholder="Enter phone number"
                    name="phone"
                    value={onboarding.company.phone}
                    onChange={handleCompany}
                  />
                </div>

              </div>


              {/* ADDRESS */}
              <div className="form-group full-width"> <label>  Address  </label>
                <div className="input-wrap">
                  <textarea
                    placeholder="Enter address"
                    name="address" value={onboarding.company.address} onChange={handleCompany}
                  ></textarea>
                </div>
              </div>


              <div className="role-btns">



                <button
                  type="button"
                  className="next-btn"
                  onClick={next}
                >
                  Next
                </button>

              </div>
            </form>
          </div>


        )}
        {step === 2 && (
          <div className="company-card">

            {/* HEADER */}
            <div className="company-header">

              <h1 className="company-title">
                Create Admin User & Role
              </h1>

              <p className="company-subtitle">
                Setup your company admin account and assign role
              </p>

            </div>

            {/* CARD */}


            <form className="user-role-form">

              {/* FULL NAME */}
              <div className="form-group">

                <label>
                  Full Name
                </label>

                <div className="input-wrap">

                  <input
                    type="text"
                    name="name" value={onboarding.user.name} onChange={handleUser}
                    placeholder="Enter name"
                  />

                </div>

              </div>

              {/* EMAIL */}
              <div className="form-group">

                <label>
                  Email Address
                </label>

                <div className="input-wrap">

                  <input
                    type="email"
                    placeholder="Enter email address"
                    name="email" value={onboarding.user.email} onChange={handleUser}
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="form-group">

                <label>
                  Password
                </label>

                <div className="input-wrap">

                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password" value={onboarding.user.password} onChange={handleUser}
                  />

                </div>

              </div>

              {/* ROLE */}
              <div className="form-group">

                <label>
                  Select Role
                </label>

                <div className="input-wrap">

                  <select name="role_id" value={onboarding.user.role_id} onChange={handleUser}>

                    <option value="">
                      Select Role
                    </option>
                    {roles.map((role) => {
                      return (

                        <option value={role.id}>
                          {role.name}
                        </option>
                      )
                    })}



                  </select>


                </div>

              </div>
   <div className="role-btns">

                <button
                  type="button"
                  className="back-btn"
                  onClick={prev}
                >
                  Back
                </button>

                <button
                  type="button"
                  className="next-btn"
                  onClick={next}
                >
                  Next
                </button>

              </div>

            </form>



          </div>



        )}

        {step === 4 && (

          <div className="company-card">
            {/* HEADER */}
            <div className="company-header">

              <h1 className="company-title">
                Subscription Period
              </h1>

              <p className="company-subtitle">
                Set subscription start and end dates
              </p>

            </div>

            <form className="company-form">

              <div className="form-group">
                <label>
                  Start Date
                </label>
                <div className="input-wrap">
                  <input
                    type="date"
                    name="start_date"
                    value={onboarding.subscription.start_date}
                    onChange={handleSubscription}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  End Date
                </label>
                <div className="input-wrap">
                  <input
                    type="date"
                    name="end_date"
                    value={onboarding.subscription.end_date}
                    onChange={handleSubscription}
                  />
                </div>
              </div>


              {/* BUTTONS */}
              <div className="role-btns">

                <button
                  type="button"
                  className="back-btn"
                  onClick={prev}
                >
                  Back
                </button>

                <button
                  type="button"
                  className="next-btn"
                  onClick={next}
                >
                  Next
                </button>

              </div>
            </form>

          </div>)
        }


        {step === 3 && (

          <div className="company-card">
            <div className="company-header">
              <h1 className="company-title">
                Subscription Plan
              </h1>
              <p className="company-subtitle">
                Configure your subscription plan and features
              </p>
            </div>
            <form className="company-form"  >
              <div className="form-group">
                <label>
                  Plan Name
                </label>
                <div className="input-wrap">
                  <select
                    name="name"
                    value={onboarding.subscription_plan.name}
                    onChange={handlePlan}
                  >
                    <option value="">Select Plan</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              {/* Price */}
              <div className="form-group">
                <label>
                  Price per Month
                </label>
                <div className="input-wrap">
                  <input
                    type="number"
                    name="price"
                    value={onboarding.subscription_plan.price}
                    onChange={handlePlan}
                    placeholder="Enter Price"
                  />
                </div>
              </div>
              {/* User Limit */}
              <div className="form-group">
                <label>
                  User Limit
                </label>
                <div className="input-wrap">
                  <input
                    type="number"
                    name="user_limit"
                    value={onboarding.subscription_plan.user_limit}
                    onChange={handlePlan}
                    placeholder="Enter User Limit"
                  />
                </div>

              </div>
              {/* Features */}
              <div className="form-group">

                <label className="permission-title">  Features</label>
                {featureList.map((feature) => (
                  <div className="permission-item" key={feature.key}>
                    <input className="form-check-input" type="checkbox"
                      name={feature.key}
                      id={feature.key}
                      checked={onboarding.subscription_plan.features[feature.key] || false}
                      onChange={handleFeature}
                    />
                    <label className="form-check-label" htmlFor={feature.key}>
                      {feature.label}
                    </label>
                  </div>
                ))}
              </div>
              {/* BUTTONS */}
              <div className="role-btns">
                <button type="button" className="back-btn" onClick={prev}  >
                  Back
                </button>
                <button type="button" className="next-btn" onClick={next} >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}
        {step === 5 && (
          <div className="company-card">
            {/* HEADER */}
            <div className="company-header">

              <h1 className="company-title">
                Complete Your Payment
              </h1>

              <p className="company-subtitle">
                Secure your subscription and activate your company account
              </p>

            </div>

            {/* PAYMENT CARD */}
            <div className="company-form">  {/* LEFT */}
              <div className="payment-left">
                 <h2 className="summary-title"> Order Summary  </h2>
                <div className="summary-box">
                  <div className="summary-item">
                    <span>Company</span>
                    <strong>{onboarding.company.name || "N/A"}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Plan</span>
                    <strong>{onboarding.subscription_plan.name?.toUpperCase() || "N/A"}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Users Limit</span>
                    <strong>{onboarding.subscription_plan.user_limit || "0"} Users</strong>
                  </div>
                  <div className="summary-item">
                    <span>Duration</span>
                    <strong>Monthly</strong>
                  </div>
                  <div className="summary-item total-item">
                    <span>Total Amount</span>
                    <strong>₹ {onboarding.subscription_plan.price || "0"}</strong>
                  </div>
                </div>
                <div className="role-btns"> 
                <button type="button" disabled={loading}  >
                    Back
                  </button>
                    <button type="button" className="pay-btn" onClick={handleSubmit} disabled={loading}  >
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
              </div>
              
              
            </div>
          </div>
        )}
      </div>
    </>

  );
}