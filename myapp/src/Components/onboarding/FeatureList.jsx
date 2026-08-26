const FeatureList = ({
  features,
  planType,
  selectedFeatures,
  onToggle,
}) => {

  const isSelected = (id) => {
    return selectedFeatures.some(
      (feature) =>
        feature.id === id
    );
  };

  const getPrice = (feature) => {

    return planType === "Monthly"
      ? Number(feature.monthly_price || 0)
      : Number(feature.yearly_price || 0);
  };

  return (
    <div className="Leftbox">

      <h4 className="text-lg font-semibold m-7">
        Available Features
      </h4>

      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">

        {features.map((feature) => {

          const price =
            getPrice(feature);

          return (
            <div
              key={feature.id}
              className="feature-item flex gap-5 p-5"
            >

              <input
                type="checkbox"
                id={`feature-${feature.id}`}
                checked={isSelected(feature.id)}
                onChange={() =>
                  onToggle(feature)
                }
                className="h-5 w-5 text-blue-600"
              />

              <label
                htmlFor={`feature-${feature.id}`}
                className="flex items-center gap-3 p-3 w-full cursor-pointer hover:bg-gray-50 transition"
              >
                {feature.name}
              </label>

              <p className="font-semibold whitespace-nowrap">
                ₹{price.toFixed(2)}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default FeatureList;