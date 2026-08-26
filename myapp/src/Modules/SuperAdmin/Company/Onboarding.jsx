import { useEffect, useState, useMemo ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import '../../../assets/CSS/super_admin/company/onboarding.css'
import { getFeatrues } from '../../../Api/superadmin/onboading'
import { onboarding1, verifyPayment, getCompanyTypes } from '../../../Api/company'
import notificationService from "../../../Common/notificationService";
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [planType, setPlanType] = useState("Monthly");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const paymentLock = useRef(false);
const razorpayInstance = useRef(null);
  const [onboarding, setOnboarding] = useState({
    company: {
      company_name: "",
      company_type_id: "",
      address: "",
      email: "",
      phone: "",
      gst_nummber: "",
      pan_number: "",
      city: "",
      company_code: "",
      state: "",
      pincode: "",
      status: 1
    },
  role:{
    role_name: "",
  },
    user: {
      first_name: "",
      last_name: "",
      role_id: null,
      phone: "",
      email: "",
      password: "",
      status: 1
    },

    subscription_plan: {
      name: "Custom Plan",
      billing_cycle: "monthly",
      price: 0,
      discount: 0,
      tax: 0,
      total_amount: 0,
      user_limit: null,
      features: [],
      start_date: null,
      end_date: null,
      status: ""
    }
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);
 
  const [companyTypes, setCompanyTypes] = useState([]);
  const [features, Setfeatures] = useState([]);

  const fetchFeatures = async () => {

    try {
      const res = await getFeatrues();
      Setfeatures(res.data); // ya res.data.data, API response ke hisaab se

    } catch (error) {
      notificationService.error(
        error.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [])

  const subtotal = useMemo(() => {
    return selectedFeatures.reduce((total, item) => {
      const price =
        planType === "Monthly"
          ? Number(item.monthly_price || 0)
          : Number(item.yearly_price || 0);

      return total + price;
    }, 0);
  }, [selectedFeatures, planType]);

  const discountPercentage = 12;

  const discount = useMemo(() => {
    return subtotal * (discountPercentage / 100);
  }, [subtotal]);

  const taxableAmount = useMemo(() => {
    return subtotal - discount;
  }, [subtotal, discount]);

  const gst = useMemo(() => {
    return taxableAmount * 0.18;
  }, [taxableAmount]);

  const total = useMemo(() => {
    return taxableAmount + gst;
  }, [taxableAmount, gst]);

  const fetchCompanyTypes = async () => {
    try {
      const res = await getCompanyTypes();
      setCompanyTypes(res.data);
    }
    catch (error) {
      notificationService.error(
        error.message || "Something went wrong"
      );
    }
  }
  useEffect(() => {
    fetchCompanyTypes();
  }, [])
  const handleFeatureChange = (feature) => {
    const exists = selectedFeatures.find(
      (item) => item.id === feature.id
    );

    if (exists) {
      setSelectedFeatures(
        selectedFeatures.filter(
          (item) => item.id !== feature.id
        )
      );
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const updateOnboarding = (section, event) => {
    const { name, value } = event.target;
    setOnboarding((current) => ({
      ...current,
      [section]: {
        ...current[section], [name]:
           name === "company_type_id" || name === "user_limit"
            ? Number(value)
            : name === "price" || name === "discount" || name === "tax" || name === "total_amount"
              ? Number(value)
              : value,

      },
    }));
  };
  const round2 = (value) => {
    return Number(Number(value || 0).toFixed(2));
  };
   const handlePayment = async () => {
 
  if (paymentLock.current) {
    console.log("Payment already processing...");
    return;
  }

  paymentLock.current = true;
  setLoading(true);

  try {

    const companyCode = generateCompanyCode(
      onboarding.company
    );

    const payload = {
      company: {
        ...onboarding.company,
        company_code: companyCode,
      },

      role: onboarding.role,

      user: onboarding.user,

      subscription_plan: {
        name: "Custom Plan",
        billing_cycle: planType.toLowerCase(),

        price: round2(subtotal),
        discount: round2(discount),
        tax: round2(gst),
        total_amount: round2(total),

        user_limit: Number(
          onboarding.subscription_plan.user_limit
        ),

        features: selectedFeatures.map(
          (feature) => feature.id
        ),

        start_date:
          onboarding.subscription_plan.start_date || null,

        end_date:
          onboarding.subscription_plan.end_date || null,

        status: "pending",
      },
    };
    await loadRazorpay();
     const response = await onboarding1(payload);

    if (!response?.success) {
      throw new Error(
        response?.message ||
        "Unable to create payment order"
      );
    }

 openRazorpayCheckout(response);
//  navigate("/dashboard/" + response.roleId + "/" + response.companyTypeId);

  } catch (error) {
    notificationService.error(
      error?.message ||
      "Payment initialization failed"
    );

    
    paymentLock.current = false;

  } finally {

    setLoading(false);
  }
};

  const generateCompanyCode = (company) => {
    if (!company.company_name?.trim()) {
      return "";
    }

    const name = company.company_name
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    return `CMP-${company.company_type_id}-${name}`;

  };
  const openRazorpayCheckout = (data) => {

  if (!window.Razorpay) {

    paymentLock.current = false;

    throw new Error(
      "Razorpay SDK not loaded"
    );
  }

  // ❌ Don't create another checkout
  if (razorpayInstance.current) {

    console.log(
      "Razorpay checkout already exists"
    );

    return;
  }

  const options = {

    key: data.key,

    amount: data.order.amount,

    currency: "INR",

    name: "Fleet Management System",

    description: "Subscription Payment",

    order_id: data.order.id,

    prefill: {
      name:
        `${onboarding.user.first_name} ${onboarding.user.last_name}`
          .trim(),

      email: onboarding.user.email,

      contact: onboarding.user.phone,
    },

    handler: async (response) => {

      console.log(
        "Razorpay payment response:",
        response
      );

      await handlePaymentVerification({
        ...response,
        ...data,
      });
    },

    modal: {

      ondismiss: () => {

        console.log(
          "Razorpay checkout closed"
        );

        razorpayInstance.current = null;

        paymentLock.current = false;

        setLoading(false);
      },

    },

    theme: {
      color: "#3399cc",
    },
  };

  const razorpay =
    new window.Razorpay(options);

  razorpayInstance.current = razorpay;

  razorpay.open();
};
 const handlePaymentVerification = async (
  paymentResponse
) => {

  try {

    setLoading(true);

    const payload = {
      razorpay_order_id:
        paymentResponse.razorpay_order_id,

      razorpay_payment_id:
        paymentResponse.razorpay_payment_id,

      razorpay_signature:
        paymentResponse.razorpay_signature,

      company_id:
        paymentResponse.companyId,

      subscription_id:
        paymentResponse.subscriptionId,
    };

    const response =
      await verifyPayment(payload);

    if (!response?.success) {
      throw new Error(
        response?.message ||
        "Payment verification failed"
      );
    }

    notificationService.success(
      "Payment successful! Company activated."
    );

    razorpayInstance.current = null;

    paymentLock.current = false;

  } catch (error) {

    notificationService.error(
      error?.message ||
      "Payment verification failed"
    );

    paymentLock.current = false;

  } finally {

    setLoading(false);
  }
};
const loadRazorpay = () => {
  return new Promise((resolve, reject) => {

    // Already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Script is already being loaded
    const existingScript = document.getElementById(
      "razorpay-checkout-script"
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        resolve(true);
      });

      existingScript.addEventListener("error", () => {
        reject(
          new Error("Razorpay SDK failed to load")
        );
      });

      return;
    }

    const script = document.createElement("script");

    script.id = "razorpay-checkout-script";
    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      console.log("Razorpay SDK loaded");
      resolve(true);
    };

    script.onerror = () => {
      reject(
        new Error("Failed to load Razorpay SDK")
      );
    };

    document.body.appendChild(script);
  });
};
  return (
    <>
      <div className=" ">
        <div className="top-row">
          <div className="step-item">
            <div className={`step-circle ${step >= 1 ? "active-step" : ""}`}  >
              1
            </div>
            <span className="step-label">
              Basic Info
            </span>
          </div>
          <div className={`step-line ${step >= 2 ? "active-line" : ""}`} >

          </div>
          <div className="step-item">
            <div
              className={`step-circle ${step >= 2 ? "active-step" : ""}`} >
              2
            </div>  <span className="step-label">
              Admin Account

            </span>

          </div>
          <div className={`step-line ${step >= 3 ? "active-line" : ""}`} >

          </div>
          <div className="step-item">
            <div className={`step-circle ${step >= 3 ? "active-step" : ""}`}  >
              3
            </div>

            <span className="step-label">
              Subscription plan
            </span>
          </div>
          <div className={`step-line ${step >= 4 ? "active-line" : ""}`}  ></div>

          <div className="step-item">
            <div className={`step-circle ${step >= 4 ? "active-step" : ""}`} >
              4
            </div>

            <span className="step-label">
              Payment
            </span>

          </div>
        </div>

        {step === 1 && (
          <div className="company-card">
            <div className="company-header">
              <h1 className="company-title">
                Your Business Basic Information
              </h1>

              <p className="company-subtitle">
                Enter your basic details to continue onboarding
              </p>
            </div>
            {/* FORM */}
            <form className="company-form"  >


              <div className="form-group">
                <label>Company Name  </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter name"
                    name="company_name" value={onboarding.company.company_name}
                    onChange={(event) => updateOnboarding("company", event)}

                  />
                </div>

              </div>


              {/* COMPANY TYPE */}
              <div className="form-group">
                <label> Company Type </label>
                <div className="input-wrap">
                  <select name="company_type_id"
                    value={onboarding.company.company_type_id}
                    onChange={(event) => updateOnboarding("company", event)}

                  >
                    <option value="">Select Company Type</option>
                    {companyTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}

                  </select>
                </div>
              </div>
              {/* CONTACT PERSON */}
              <div className="form-group">
                <label>Company Email </label>
                <div className="input-wrap">
                  <input
                    type="email"
                    placeholder="Enter company email"
                    name="email"
                    value={onboarding.company.email}
                    onChange={(event) => updateOnboarding("company", event)}

                  />
                </div>
              </div>
              {/* PHONE */}
              <div className="form-group">
                <label>Company Number  </label>
                <div className="input-wrap">
                  <input
                    type="number"
                    placeholder="Enter phone number"
                    name="phone"
                    value={onboarding.company.phone}
                    onChange={(event) => updateOnboarding("company", event)}

                  />
                </div>

              </div>
              <div className="form-group">
                <label>GST Number  </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter GST number"
                    name="gst_number"
                    value={onboarding.company.gst_number}
                    onChange={(event) => updateOnboarding("company", event)}

                  />
                </div>

              </div>
              <div className="form-group">
                <label>Pan Number  </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter pan number"
                    name="pan_number"
                    value={onboarding.company.pan_number}
                    onChange={(event) => updateOnboarding("company", event)}

                  />
                </div>

              </div>


              {/* ADDRESS */}
              <div className="form-group "> <label>  Address  </label>
                <div className="input-wrap">
                  <textarea
                    placeholder="Enter address"
                    name="address" value={onboarding.company.address}
                    onChange={(event) => updateOnboarding("company", event)}
                  ></textarea>
                </div>

              </div>

              <div className="form-group">
                <label>City </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter city"
                    name="city"
                    value={onboarding.company.city}
                    onChange={(event) => updateOnboarding("company", event)}

                  />
                </div>

              </div>
              <div className="form-group "  >
                <label>State </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter state"
                    name="state"
                    value={onboarding.company.state}
                    onChange={(event) => updateOnboarding("company", event)}

                  />
                </div>

              </div>
              <div className="form-group">
                <label>Pin code </label>
                <div className="input-wrap">
                  <input
                    type="number"
                    placeholder="Enter phone number"
                    name="pincode"
                    value={onboarding.company.pincode}
                    onChange={(event) => updateOnboarding("company", event)}

                  />
                </div>

              </div>

              <div className="role-btns">
                <button type="button" className="next-btn" onClick={next}  >
                  Next
                </button>

              </div>
            </form>
          </div>


        )}
        {step === 2 && (
          <div className="company-card">
            <div className="company-header">

              <h1 className="company-title">
                Create Admin User & Role
              </h1>

              <p className="company-subtitle">
                Setup your company admin account and assign role
              </p>

            </div>

            <form className="user-role-form">
              <div className="form-group">
                <label> First Name  </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="first_name" value={onboarding.user.first_name}
                    onChange={(event) => updateOnboarding("user", event)}
                    placeholder="Enter name"
                  />

                </div>

              </div>
              <div className="form-group">
                <label> Last Name  </label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="last_name" value={onboarding.user.last_name}
                    onChange={(event) => updateOnboarding("user", event)}
                    placeholder="Enter name"
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Company Role
                </label>

                <div className="input-wrap">
                  <input
                    type="text"
                    name="role_name" value={onboarding.role.role_name}
                    onChange={(event) => updateOnboarding("role", event)}

                    placeholder="Enter company role"
                  />
                </div>
                <span className="text-red-500 cursor-pointer">  Verify </span>
              </div>
              <div className="form-group">

                <label>
                  Phone
                </label>

                <div className="input-wrap">
                  <input
                    type="text"
                    name="phone" value={onboarding.user.phone}
                    onChange={(event) => updateOnboarding("user", event)}

                    placeholder="Enter name"
                  />
                </div>

              </div>

              {/* EMAIL */}
              <div className="form-group">

                <label>
                  Admin Email
                </label>

                <div className="input-wrap">

                  <input
                    type="email"
                    placeholder="Enter email address"
                    name="email" value={onboarding.user.email}
                    onChange={(event) => updateOnboarding("user", event)}

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
                    name="password" value={onboarding.user.password}
                    onChange={(event) => updateOnboarding("user", event)}

                  />

                </div>

              </div>

              {/* ROLE */}

              <div className="role-btns">
                <button type="button" className="back-btn" onClick={prev} >
                  Back
                </button>
                <button type="button" className="next-btn" onClick={next} >
                  Next
                </button>

              </div>
            </form>
          </div>
        )}
        {step === 3 && (

          <div className="company-card">
            <div className="company-header">
              <h1 className="company-title">
                Subscription Plan
              </h1>
              <div className="billing-card">

                <button
                  className={planType === "Monthly" ? "active" : ""}
                  onClick={() => setPlanType("Monthly")}
                >
                  Monthly
                </button>

                <button
                  className={planType === "Yearly" ? "active" : ""}
                  onClick={() => setPlanType("Yearly")}
                >
                  Yearly
                </button>

              </div>
            </div>
            <form className="company-form">

              <div className="SubscriptionPage ">
                {/* Left */}
                <div className="topclass">
                  <div className="form-group">
                    <label> User Limits </label>
                    <div className="input-wrap">
                      <select name="user_limit"
                        value={onboarding.subscription_plan.user_limit}
                        onChange={(event) => updateOnboarding("subscription_plan", event)} > <option value="">Select User Limit</option>
                        <option value="50">50  </option>
                        <option value="100">100  </option>
                        <option value="200">200  </option>
                        <option value="500">500  </option>
                        <option value="1000">1000  </option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label> Start Date </label>
                    <div className="input-wrap">
                      <input type="date" name="start_date"
                        value={onboarding.subscription_plan.start_date}
                        onChange={(event) => updateOnboarding("subscription_plan", event)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label> End Date </label>
                    <div className="input-wrap">
                      <input type="date" name="end_date"
                        value={onboarding.subscription_plan.end_date}
                        onChange={(event) => updateOnboarding("subscription_plan", event)} />
                    </div>
                  </div>
                </div>
                <div className="Leftbox">
                  <h4 className="text-lg font-semibold m-7">
                    Available Features
                  </h4>

                  <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">
                    {features.map((data) => {

                      const price =
                        planType === "Monthly"
                          ? Number(data.monthly_price || 0)
                          : Number(data.yearly_price || 0);

                      const isSelected = selectedFeatures.some(
                        (item) => item.id === data.id
                      );

                      return (
                        <div
                          key={data.id}
                          className="feature-item flex gap-5 p-5"
                        >
                          <input
                            type="checkbox"
                            id={`feature-${data.id}`}
                            checked={isSelected}
                            onChange={() => handleFeatureChange(data)}
                            className="h-5 w-5 text-blue-600"
                          />

                          <label
                            htmlFor={`feature-${data.id}`}
                            className="flex items-center gap-3 p-3 w-full cursor-pointer hover:bg-gray-50 transition"
                          >
                            {data.name}
                          </label>

                          <p className="font-semibold whitespace-nowrap">
                            ₹{price.toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right */}
                <div className="  Rightbox ">
                  <h4 className="text-lg font-semibold mb-4">
                    Selected Features
                  </h4>

                  <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">
                    {selectedFeatures.length > 0 ? (
                      selectedFeatures.map((item) => {
                        const price =
                          planType === "Monthly"
                            ? Number(item.monthly_price || 0)
                            : Number(item.yearly_price || 0);
                        return (
                          <div
                            key={item.id}
                            className="feature-item"
                          >
                            <div>
                              <h4>{item.name}</h4>
                            </div>

                            <div className="feature-price">
                              ₹{price.toFixed(2)}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        No Feature Selected
                      </div>
                    )}
                  </div>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>

                  <div className="summary-total">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
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
        {step === 4 && (
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
                    <strong>{onboarding.company.company_name || "N/A"}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Plan</span>
                    <strong>{planType.toUpperCase()}</strong>
                  </div>
                  {/* <div className="summary-item">
                    <span>Users Limit</span>
                    <strong>{onboarding.subscription_plan.user_limit || "0"} Users</strong>
                  </div> */}
                  {/* <div className="summary-item">
                    <span>Duration</span>
                    <strong>Monthly</strong>
                  </div> */}
                  <div className="summary-item total-item">
                    <span>Total Amount</span>
                    <strong>₹ {total.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="role-btns">
                  <button type="button" disabled={loading} onClick={prev} >
                    Back
                  </button>
                  <button type="button" className="pay-btn" disabled={loading}
                    onClick={handlePayment}>
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
