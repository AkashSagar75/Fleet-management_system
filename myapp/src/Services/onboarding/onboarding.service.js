import {
  createOnboardingApi,
} from "../../api/onboarding/onboarding.api";

export const createOnboardingOrder = async (
  payload
) => {

  const response =
    await createOnboardingApi(payload);

  if (!response?.success) {
    throw new Error(
      response?.message ||
      "Unable to create payment order"
    );
  }

  return response;
};