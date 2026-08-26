import {  verifyPaymentApiRequest, } from "../../api/onboarding/payment.api";

export const verifyRazorpayPayment = async (  payload ) => {

  const response = await verifyPaymentApiRequest(payload);

  if (!response?.success) {
    throw new Error(
      response?.message ||
      "Payment verification failed"
    );
  }

  return response;
};