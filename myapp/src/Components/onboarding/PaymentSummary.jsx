const PaymentSummary = ({
  onboarding,
  planType,
  pricing,
  loading,
  onPay,
  onBack,
}) => {

  return (
    <div className="company-card">

      <div className="company-header">

        <h1 className="company-title">
          Complete Your Payment
        </h1>

        <p className="company-subtitle">
          Secure your subscription and activate your company account
        </p>

      </div>

      <div className="company-form">

        <div className="payment-left">

          <h2 className="summary-title">
            Order Summary
          </h2>

          <div className="summary-box">

            <div className="summary-item">

              <span>
                Company
              </span>

              <strong>
                {
                  onboarding.company.company_name ||
                  "N/A"
                }
              </strong>

            </div>

            <div className="summary-item">

              <span>
                Plan
              </span>

              <strong>
                {planType.toUpperCase()}
              </strong>

            </div>

            <div className="summary-item">

              <span>
                Users Limit
              </span>

              <strong>
                {
                  onboarding.subscription_plan
                    .user_limit || 0
                } Users
              </strong>

            </div>

            <div className="summary-item total-item">

              <span>
                Total Amount
              </span>

              <strong>
                ₹ {pricing.total.toFixed(2)}
              </strong>

            </div>

          </div>

          <div className="role-btns">

            <button
              type="button"
              disabled={loading}
              onClick={onBack}
            >
              Back
            </button>

            <button
              type="button"
              className="pay-btn"
              disabled={loading}
              onClick={onPay}
            >
              {loading
                ? "Processing..."
                : "Pay Now"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentSummary;