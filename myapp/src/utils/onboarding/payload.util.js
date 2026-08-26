import { round2 } from "./pricing.util";

export const buildOnboardingPayload = ({
  onboarding,
  selectedFeatures,
  planType,
  pricing,
}) => {

  return {
    company: onboarding.company,

    user: onboarding.user,

    subscription_plan: {
      name: "Custom Plan",

      billing_cycle:
        planType.toLowerCase(),

      price:
        round2(pricing.subtotal),

      discount:
        round2(pricing.discount),

      tax:
        round2(pricing.tax),

      total_amount:
        round2(pricing.total),

      user_limit:
        Number(
          onboarding.subscription_plan.user_limit
        ),

      features:
        selectedFeatures.map(
          (feature) => feature.id
        ),

      start_date:
        onboarding.subscription_plan.start_date || null,

      end_date:
        onboarding.subscription_plan.end_date || null,

      status: "pending",
    },
  };
};

export const buildPaymentVerificationPayload = ({
  paymentResponse,
}) => {

  return {
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
};