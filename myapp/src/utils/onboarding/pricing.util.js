export const calculatePricing = ({
  selectedFeatures = [],
  planType,
  discountPercentage = 12,
  taxPercentage = 18,
}) => {

  const subtotal = selectedFeatures.reduce((total, feature) => {

    const price =
      planType === "Monthly"
        ? Number(feature.monthly_price || 0)
        : Number(feature.yearly_price || 0);

    return total + price;

  }, 0);

  const discount =
    subtotal * (discountPercentage / 100);

  const taxableAmount =
    subtotal - discount;

  const tax =
    taxableAmount * (taxPercentage / 100);

  const total =
    taxableAmount + tax;

  return {
    subtotal,
    discount,
    taxableAmount,
    tax,
    total,
  };
};

export const round2 = (value) => {
  return Number(Number(value || 0).toFixed(2));
};