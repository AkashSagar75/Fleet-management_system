import OnboardingStepper  from "../../Components/onboarding/OnboardingStepper";
import CompanyBasicForm from "../../Components/onboarding/CompanyBasicForm";
import AdminUserForm from "../../Components/onboarding/AdminUserForm";
import SubscriptionPlan from "../../Components/onboarding/SubscriptionPlan";
import PaymentSummary  from "../../Components/onboarding/PaymentSummary";
import { useOnboarding, } from "../../hooks/onboarding/useOnboarding";
import { useOnboardingData, } from "../../hooks/onboarding/useOnboardingData";
import { useSubscription, } from "../../hooks/onboarding/useSubscription";
import {  usePayment, } from "../../hooks/onboarding/usePayment";
import {  buildOnboardingPayload, } from "../../utils/onboarding/payload.util";
import "../../../assets/CSS/super_admin/company/onboarding.css";

const OnboardingPage = () => {
 
  const { step, boarding, nextStep, previousStep, updateOnboarding, } = useOnboarding();

  const { features, roles, companyTypes, } = useOnboardingData();

  const { planType,  setPlanType,  selectedFeatures,  toggleFeature, pricing, } = useSubscription();

  const { loading, createPayment, } = usePayment({  onboarding, });

  const handlePayment = async () => {

    const payload =  buildOnboardingPayload({  selectedFeatures,  planType, pricing,  });

    await createPayment(payload);
  };

  return (
    <div>

      <OnboardingStepper
        step={step}
      />

      {step === 1 && (

        <CompanyBasicForm
          data={onboarding.company}
          companyTypes={companyTypes}
          onChange={updateOnboarding}
          onNext={nextStep}
        />

      )}

      {step === 2 && (

        <AdminUserForm
          data={onboarding.user}
          roles={roles}
          onChange={updateOnboarding}
          onNext={nextStep}
          onBack={previousStep}
        />

      )}

      {step === 3 && (

        <SubscriptionPlan
          onboarding={onboarding}
          planType={planType}
          selectedFeatures={selectedFeatures}
          pricing={pricing}
          features={features}
          onPlanChange={setPlanType}
          onFeatureToggle={toggleFeature}
          onChange={updateOnboarding}
          onNext={nextStep}
          onBack={previousStep}
        />

      )}

      {step === 4 && (

        <PaymentSummary
          onboarding={onboarding}
          planType={planType}
          pricing={pricing}
          loading={loading}
          onPay={handlePayment}
          onBack={previousStep}
        />

      )}

    </div>
  );
};

export default OnboardingPage;