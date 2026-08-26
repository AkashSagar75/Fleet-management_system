const SelectedFeatureList = ({
  selectedFeatures,
  planType,
  pricing,
}) => {

  const getPrice = (feature) => {

    return planType === "Monthly"
      ? Number(feature.monthly_price || 0)
      : Number(feature.yearly_price || 0);
  };

  return (
    <div className="Rightbox">

      <h4 className="text-lg font-semibold mb-4">
        Selected Features
      </h4>

      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">

        {selectedFeatures.length > 0 ? (

          selectedFeatures.map((feature) => (

            <div
              key={feature.id}
              className="feature-item"
            >

              <div>
                <h4>
                  {feature.name}
                </h4>
              </div>

              <div className="feature-price">
                ₹{getPrice(feature).toFixed(2)}
              </div>

            </div>

          ))

        ) : (

          <div className="text-center text-gray-500 py-12">
            No Feature Selected
          </div>

        )}

      </div>

      <div className="summary-row">
        <span>
          Subtotal
        </span>

        <span>
          ₹{pricing.subtotal.toFixed(2)}
        </span>
      </div>

      <div className="summary-row">
        <span>
          GST (18%)
        </span>

        <span>
          ₹{pricing.tax.toFixed(2)}
        </span>
      </div>

      <div className="summary-row">
        <span>
          Discount (12%)
        </span>

        <span>
          -₹{pricing.discount.toFixed(2)}
        </span>
      </div>

      <div className="summary-total">
        <span>
          Total
        </span>

        <span>
          ₹{pricing.total.toFixed(2)}
        </span>
      </div>

    </div>
  );
};

export default SelectedFeatureList;