import { useState, } from "react";

import { createOnboardingOrder, } from "../../Services/onboarding/onboarding.service";

import { verifyRazorpayPayment, } from "../../Services/onboarding/payment.service";

import { buildPaymentVerificationPayload,  } from "../../utils/onboarding/payload.util";

import notificationService
  from "../../../Common/notificationService";

export const usePayment = ({
  onboarding,
}) => {

  const [loading, setLoading] =
    useState(false);

  const verifyPayment = async (
    paymentResponse
  ) => {

    try {

      setLoading(true);

      const payload =
        buildPaymentVerificationPayload({
          paymentResponse,
        });

      const response =
        await verifyRazorpayPayment(
          payload
        );

      notificationService.success(
        "Payment successful! Company activated."
      );

      return response;

    } catch (error) {

      notificationService.error(
        error?.message ||
        "Payment verification failed"
      );

      throw error;

    } finally {

      setLoading(false);

    }
  };

  const openRazorpayCheckout = (
    paymentData
  ) => {

    if (!window.Razorpay) {

      throw new Error(
        "Payment gateway is unavailable. Please refresh and try again."
      );
    }

    const options = {

      key:
        paymentData.key,

      amount:
        paymentData.order.amount,

      currency:
        "INR",

      name:
        "Fleet Management System",

      description:
        "Subscription Payment",

      order_id:
        paymentData.order.id,

      prefill: {

        name:
          `${onboarding.user.first_name} ${onboarding.user.last_name}`
            .trim(),

        email:
          onboarding.user.email,

        contact:
          onboarding.user.phone,
      },

      handler:
        async function (response) {

          await verifyPayment({
            ...response,
            ...paymentData,
          });

        },

      modal: {

        ondismiss:
          function () {

            notificationService.error(
              "Payment cancelled"
            );

          },
      },

      theme: {
        color: "#3399cc",
      },
    };

    const razorpay =
      new window.Razorpay(options);

    razorpay.open();
  };

  const createPayment = async (
    payload
  ) => {

    try {

      setLoading(true);

      const response =
        await createOnboardingOrder(
          payload
        );

      openRazorpayCheckout(
        response
      );

      return response;

    } catch (error) {

      notificationService.error(
        error?.message ||
        "Payment initialization failed"
      );

      throw error;

    } finally {

      setLoading(false);

    }
  };

  return {  loading,  createPayment,  verifyPayment,
  };
};