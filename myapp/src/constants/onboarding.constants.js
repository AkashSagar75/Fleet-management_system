export const ONBOARDING_STEPS = {
  COMPANY: 1,
  ADMIN: 2,
  SUBSCRIPTION: 3,
  PAYMENT: 4,
};

export const PLAN_TYPES = {
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export const DISCOUNT_PERCENTAGE = 12;

export const TAX_PERCENTAGE = 18;

export const USER_LIMITS = [
  50,
  100,
  200,
  500,
  1000,
];

export const DEFAULT_ONBOARDING = {
  company: {
    company_name: "",
    company_type_id: "",
    address: "",
    email: "",
    phone: "",
    gst_nummber: "",
    pan_number: "",
    city: "",
    state: "",
    pincode: "",
    status: 1,
  },

  user: {
    first_name: "",
    last_name: "",
    role_id: null,
    phone: "",
    email: "",
    password: "",
    status: 1,
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
    status: "",
  },
};