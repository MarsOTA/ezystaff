
import { useState, useEffect } from 'react';
import { ExtendedOperator, OPERATORS_STORAGE_KEY } from '@/types/operator';
import { safeLocalStorage } from "@/utils/fileUtils";

export const useOperatorProfile = (id: string | undefined) => {
  const [operator, setOperator] = useState<ExtendedOperator | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<Record<string, string>>({});
  
  // Contract data state
  const [contractType, setContractType] = useState("");
  const [ccnl, setCcnl] = useState("");
  const [level, setLevel] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [jobType, setJobType] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [grossSalary, setGrossSalary] = useState("");
  const [netSalary, setNetSalary] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("");
  const [normalHoursPercentage, setNormalHoursPercentage] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [workSite, setWorkSite] = useState("");
  const [basePayAndContingency, setBasePayAndContingency] = useState("");
  const [edr, setEdr] = useState("");
  const [totalMonthlyCompensation, setTotalMonthlyCompensation] = useState("");
  const [totalAnnualCompensation, setTotalAnnualCompensation] = useState("");
  const [contractSignDate, setContractSignDate] = useState<Date | undefined>();
  const [contractClause, setContractClause] = useState("");
  const [workingHoursClause, setWorkingHoursClause] = useState("");
  const [rebalancing, setRebalancing] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [trainingStartDate, setTrainingStartDate] = useState<Date | undefined>();
  const [trainingEndDate, setTrainingEndDate] = useState<Date | undefined>();

  useEffect(() => {
    const loadOperator = () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
        if (storedOperators) {
          const operators = JSON.parse(storedOperators);
          const foundOperator = operators.find((op: any) => op.id === parseInt(id));
          
          if (foundOperator) {
            setOperator(foundOperator);
            
            // Load contract data if available
            const contractData = foundOperator.contractData || {};
            setContractType(contractData.contractType || "");
            setCcnl(contractData.ccnl || "");
            setLevel(contractData.level || "");
            setEmploymentType(contractData.employmentType || "");
            setJobType(contractData.jobType || "");
            setStartDate(contractData.startDate ? new Date(contractData.startDate) : undefined);
            setEndDate(contractData.endDate ? new Date(contractData.endDate) : undefined);
            setGrossSalary(contractData.grossSalary || "");
            setNetSalary(contractData.netSalary || "");
            setWeeklyHours(contractData.weeklyHours || "");
            setNormalHoursPercentage(contractData.normalHoursPercentage || "");
            setWorkLocation(contractData.workLocation || "");
            setWorkSite(contractData.workSite || "");
            setBasePayAndContingency(contractData.basePayAndContingency || "");
            setEdr(contractData.edr || "");
            setTotalMonthlyCompensation(contractData.totalMonthlyCompensation || "");
            setTotalAnnualCompensation(contractData.totalAnnualCompensation || "");
            setContractSignDate(contractData.contractSignDate ? new Date(contractData.contractSignDate) : undefined);
            setContractClause(contractData.contractClause || "");
            setWorkingHoursClause(contractData.workingHoursClause || "");
            setRebalancing(contractData.rebalancing || "");
            setTrainerName(contractData.trainerName || "");
            setTrainingStartDate(contractData.trainingStartDate ? new Date(contractData.trainingStartDate) : undefined);
            setTrainingEndDate(contractData.trainingEndDate ? new Date(contractData.trainingEndDate) : undefined);
            
            // Create image preview URLs for existing images
            const previews: Record<string, string> = {};
            if (foundOperator.profileImage) {
              previews.profileImage = foundOperator.profileImage;
            }
            if (foundOperator.idCardFrontImage) {
              previews.idCardFrontImage = foundOperator.idCardFrontImage;
            }
            if (foundOperator.idCardBackImage) {
              previews.idCardBackImage = foundOperator.idCardBackImage;
            }
            setImagePreviewUrls(previews);
          }
        }
      } catch (error) {
        console.error("Error loading operator:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOperator();
  }, [id]);

  return {
    operator,
    setOperator,
    loading,
    imagePreviewUrls,
    setImagePreviewUrls,
    contractType,
    setContractType,
    ccnl,
    setCcnl,
    level,
    setLevel,
    employmentType,
    setEmploymentType,
    jobType,
    setJobType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    grossSalary,
    setGrossSalary,
    netSalary,
    setNetSalary,
    weeklyHours,
    setWeeklyHours,
    normalHoursPercentage,
    setNormalHoursPercentage,
    workLocation,
    setWorkLocation,
    workSite,
    setWorkSite,
    basePayAndContingency,
    setBasePayAndContingency,
    edr,
    setEdr,
    totalMonthlyCompensation,
    setTotalMonthlyCompensation,
    totalAnnualCompensation,
    setTotalAnnualCompensation,
    contractSignDate,
    setContractSignDate,
    contractClause,
    setContractClause,
    workingHoursClause,
    setWorkingHoursClause,
    rebalancing,
    setRebalancing,
    trainerName,
    setTrainerName,
    trainingStartDate,
    setTrainingStartDate,
    trainingEndDate,
    setTrainingEndDate,
  };
};
