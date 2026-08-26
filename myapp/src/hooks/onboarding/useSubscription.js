import { useMemo, useState, } from "react";

import { PLAN_TYPES, DISCOUNT_PERCENTAGE, TAX_PERCENTAGE, } from "../../constants/onboarding.constants";

import { calculatePricing, } from "../../utils/onboarding/pricing.util";

export const useSubscription = () => {

    const [planType, setPlanType] =
        useState(PLAN_TYPES.MONTHLY);

    const [selectedFeatures, setSelectedFeatures,] = useState([]);

    const toggleFeature = (feature) => {

        setSelectedFeatures((current) => {

            const exists = current.some((item) => item.id === feature.id);

            if (exists) {

                return current.filter(
                    (item) => item.id !== feature.id);

            }

            return [...current, feature,];
        });
    };

    const pricing = useMemo(() => {

        return calculatePricing({
            selectedFeatures,
            planType,
            discountPercentage: DISCOUNT_PERCENTAGE,
            taxPercentage: TAX_PERCENTAGE,
        });

    }, [
        selectedFeatures,
        planType,
    ]);

    return { planType, setPlanType, selectedFeatures, toggleFeature, pricing, };
};