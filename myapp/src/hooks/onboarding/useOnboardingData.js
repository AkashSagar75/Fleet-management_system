import { useEffect, useState, } from "react";
import {  getFeaturesApi, } from "../../api/onboarding/feature.api";
import { getRolesApi, } from "../../api/onboarding/role.api";
import { getCompanyTypesApi, } from "../../api/onboarding/companyType.api";
import notificationService from "../../../Common/notificationService";

export const useOnboardingData = () => {

  const [features, setFeatures] =  useState([]);

  const [roles, setRoles] = useState([]);

  const [companyTypes, setCompanyTypes] =  useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
 const loadData = async () => {
  try {
 setLoading(true);
 const [ featureResponse, roleResponse, companyTypeResponse, ] = await Promise.all([
          getFeaturesApi(),
          getRolesApi(),
          getCompanyTypesApi(),
        ]);

        setFeatures( featureResponse?.data || [] );

        setRoles(  roleResponse?.data || [] );

        setCompanyTypes( companyTypeResponse?.data || [] );

      } catch (error) {

        notificationService.error(
          error?.message ||
          "Unable to load onboarding data"
        );

      } finally {

        setLoading(false);

      }
    };

    loadData();

  }, []);

  return {  features, roles, companyTypes, loading, };
};