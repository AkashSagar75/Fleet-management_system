import {
  USER_LIMITS,
} from "../../constants/onboarding.constants";

import FeatureList from "./FeatureList";
import SelectedFeatureList from "./SelectedFeatureList";

const SubscriptionPlan = ({
  onboarding,
  planType,
  selectedFeatures,
  pricing,
  features,
  onPlanChange,
  onFeatureToggle,
  onChange,
  onNext,
  onBack,
}) => {

  return (
    <div className="company-card">

      <div className="company-header">

        <h1 className="company-title">
          Subscription Plan
        </h1>

        <div className="billing-card">

          <button
            type="button"
            className={
              planType === "Monthly"
                ? "active"
                : ""
            }
            onClick={() =>
              onPlanChange("Monthly")
            }
          >
            Monthly
          </button>

          <button
            type="button"
            className={
              planType === "Yearly"
                ? "active"
                : ""
            }
            onClick={() =>
              onPlanChange("Yearly")
            }
          >
            Yearly
          </button>

        </div>

      </div>

      <form className="company-form">

        <div className="SubscriptionPage">

          <div className="topclass">

            <div className="form-group">

              <label>
                User Limits
              </label>

              <div className="input-wrap">

                <select
                  name="user_limit"
                  value={
                    onboarding.subscription_plan
                      .user_limit ?? ""
                  }
                  onChange={(event) =>
                    onChange(
                      "subscription_plan",
                      event
                    )
                  }
                >

                  <option value="">
                    Select User Limit
                  </option>

                  {USER_LIMITS.map((limit) => (
                    <option
                      key={limit}
                      value={limit}
                    >
                      {limit}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            <div className="form-group">

              <label>
                Start Date
              </label>

              <div className="input-wrap">

                <input
                  type="date"
                  name="start_date"
                  value={
                    onboarding.subscription_plan
                      .start_date || ""
                  }
                  onChange={(event) =>
                    onChange(
                      "subscription_plan",
                      event
                    )
                  }
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
                  value={
                    onboarding.subscription_plan
                      .end_date || ""
                  }
                  onChange={(event) =>
                    onChange(
                      "subscription_plan",
                      event
                    )
                  }
                />

              </div>

            </div>

          </div>

          <FeatureList
            features={features}
            planType={planType}
            selectedFeatures={selectedFeatures}
            onToggle={onFeatureToggle}
          />

          <SelectedFeatureList
            selectedFeatures={selectedFeatures}
            planType={planType}
            pricing={pricing}
          />

        </div>

        <div className="role-btns">

          <button
            type="button"
            className="back-btn"
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="button"
            className="next-btn"
            onClick={onNext}
          >
            Next
          </button>

        </div>

      </form>

    </div>
  );
};

export default SubscriptionPlan;