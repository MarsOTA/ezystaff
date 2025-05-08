
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import OperatorHeader from "@/components/operator/OperatorHeader";
import OperatorTabs from "@/components/operator/OperatorTabs";
import { useOperatorData } from "@/hooks/useOperatorData";
import { useOperatorOperations } from "@/hooks/useOperatorOperations";

const OperatorProfile = () => {
  const { id } = useParams();
  
  const {
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
    setTrainingEndDate
  } = useOperatorData(id);
  
  const {
    activeTab,
    setActiveTab,
    handleChange,
    handleServiceToggle,
    handleAvailabilityToggle,
    handleLanguageToggle,
    handleSizeToggle,
    handleFileUpload,
    handleSave,
    handleContractTemplateUpload,
    templateFile,
    generateContract
  } = useOperatorOperations(
    operator,
    setOperator,
    setImagePreviewUrls,
    contractType,
    ccnl,
    level,
    employmentType,
    jobType,
    startDate,
    endDate,
    grossSalary,
    netSalary,
    weeklyHours,
    normalHoursPercentage,
    workLocation,
    workSite,
    basePayAndContingency,
    edr,
    totalMonthlyCompensation,
    totalAnnualCompensation,
    contractSignDate,
    contractClause,
    workingHoursClause,
    rebalancing,
    trainerName,
    trainingStartDate,
    trainingEndDate
  );
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Caricamento...</div>
        </div>
      </Layout>
    );
  }
  
  if (!operator) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Operatore non trovato</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <OperatorHeader 
          operator={operator} 
          onRatingChange={(value) => handleChange("rating", value)}
          onSave={handleSave}
        />
        
        <OperatorTabs
          operator={operator}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          imagePreviewUrls={imagePreviewUrls}
          onFieldChange={handleChange}
          onServiceToggle={handleServiceToggle}
          onAvailabilityToggle={handleAvailabilityToggle}
          onLanguageToggle={handleLanguageToggle}
          onSizeToggle={handleSizeToggle}
          onFileUpload={handleFileUpload}
          onSave={handleSave}
          onGenerateContract={generateContract}
          contractType={contractType}
          setContractType={setContractType}
          ccnl={ccnl}
          setCcnl={setCcnl}
          level={level}
          setLevel={setLevel}
          employmentType={employmentType}
          setEmploymentType={setEmploymentType}
          jobType={jobType}
          setJobType={setJobType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          grossSalary={grossSalary}
          setGrossSalary={setGrossSalary}
          netSalary={netSalary}
          setNetSalary={setNetSalary}
          weeklyHours={weeklyHours}
          setWeeklyHours={setWeeklyHours}
          normalHoursPercentage={normalHoursPercentage}
          setNormalHoursPercentage={setNormalHoursPercentage}
          workLocation={workLocation}
          setWorkLocation={setWorkLocation}
          workSite={workSite}
          setWorkSite={setWorkSite}
          basePayAndContingency={basePayAndContingency}
          setBasePayAndContingency={setBasePayAndContingency}
          edr={edr}
          setEdr={setEdr}
          totalMonthlyCompensation={totalMonthlyCompensation}
          setTotalMonthlyCompensation={setTotalMonthlyCompensation}
          totalAnnualCompensation={totalAnnualCompensation}
          setTotalAnnualCompensation={setTotalAnnualCompensation}
          contractSignDate={contractSignDate}
          setContractSignDate={setContractSignDate}
          contractClause={contractClause}
          setContractClause={setContractClause}
          workingHoursClause={workingHoursClause}
          setWorkingHoursClause={setWorkingHoursClause}
          rebalancing={rebalancing}
          setRebalancing={setRebalancing}
          trainerName={trainerName}
          setTrainerName={setTrainerName}
          trainingStartDate={trainingStartDate}
          setTrainingStartDate={setTrainingStartDate}
          trainingEndDate={trainingEndDate}
          setTrainingEndDate={setTrainingEndDate}
          onTemplateUpload={handleContractTemplateUpload}
          templateFile={templateFile}
        />
      </div>
    </Layout>
  );
};

export default OperatorProfile;
