import {
  useState,
} from "react";

import {
  DEFAULT_ONBOARDING,
  ONBOARDING_STEPS,
} from "../../constants/onboarding.constants";

export const useOnboarding = () => {

  const [step, setStep] =  useState(ONBOARDING_STEPS.COMPANY);

  const [onboarding, setOnboarding] =  useState(DEFAULT_ONBOARDING);

  const nextStep = () => {

    setStep((currentStep) =>
      Math.min(
        currentStep + 1,
        ONBOARDING_STEPS.PAYMENT
      )
    );
  };

  const previousStep = () => {

    setStep((currentStep) =>
      Math.max(
        currentStep - 1,
        ONBOARDING_STEPS.COMPANY
      )
    );
  };

  const updateOnboarding = (
    section,
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    const numericFields = [
      "role_id",
      "company_type_id",
      "user_limit",
      "price",
      "discount",
      "tax",
      "total_amount",
    ];

    const newValue =
      numericFields.includes(name)
        ? Number(value)
        : value;

    setOnboarding((current) => ({
      ...current,

      [section]: {
        ...current[section],

        [name]: newValue,
      },
    }));
  };

  return {
    step,
    onboarding,

    nextStep,
    previousStep,

    updateOnboarding,

    setOnboarding,
  };
};