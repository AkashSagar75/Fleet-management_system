import {  ONBOARDING_STEPS, } from "../../constants/onboarding.constants";

const OnboardingStepper = ({
  step,
}) => {

  const steps = [
    {
      id: ONBOARDING_STEPS.COMPANY,
      label: "Basic Info",
    },
    {
      id: ONBOARDING_STEPS.ADMIN,
      label: "Admin Account",
    },
    {
      id: ONBOARDING_STEPS.SUBSCRIPTION,
      label: "Subscription plan",
    },
    {
      id: ONBOARDING_STEPS.PAYMENT,
      label: "Payment",
    },
  ];

  return (
    <div className="top-row">

      {steps.map((item, index) => (
        <div
          key={item.id}
          className="step-wrapper"
        >

          <div className="step-item">

            <div
              className={`step-circle ${
                step >= item.id
                  ? "active-step"
                  : ""
              }`}
            >
              {item.id}
            </div>

            <span className="step-label">
              {item.label}
            </span>

          </div>

          {index < steps.length - 1 && (
            <div
              className={`step-line ${
                step > item.id
                  ? "active-line"
                  : ""
              }`}
            />
          )}

        </div>
      ))}

    </div>
  );
};

export default OnboardingStepper;