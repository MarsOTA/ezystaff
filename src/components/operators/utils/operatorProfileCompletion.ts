
import { Operator } from "@/types/operator";
import { ExtendedOperator } from "@/types/operator";

export function getOperatorProfileCompletion(operator: ExtendedOperator | Operator): { percent: number; stage: string } {
  // Check section completion
  const hasBasicInfo =
    !!operator.name &&
    !!operator.surname &&
    !!operator.phone &&
    !!operator.email &&
    !!operator.gender &&
    !!operator.nationality &&
    !!operator.birthDate &&
    !!operator.address;

  const hasServices =
    Array.isArray((operator as ExtendedOperator).service) &&
    ((operator as ExtendedOperator).service?.length || (operator as ExtendedOperator).services?.length);

  const hasAvailability =
    Array.isArray((operator as ExtendedOperator).availability) &&
    ((operator as ExtendedOperator).availability?.length);

  const hasLanguages =
    Array.isArray((operator as ExtendedOperator).fluentLanguages) &&
    ((operator as ExtendedOperator).fluentLanguages?.length);

  const hasIdDocs =
    (!!(operator as ExtendedOperator).idCardFrontImage || !!(operator as ExtendedOperator).idCardFront) &&
    (!!(operator as ExtendedOperator).idCardBackImage || !!(operator as ExtendedOperator).idCardBack);

  // Contrattualistica
  const contractType = (operator as ExtendedOperator).contractData?.contractType;
  const contractStartDate = (operator as ExtendedOperator).contractData?.startDate;
  const contractSignDate = (operator as ExtendedOperator).contractData?.contractSignDate;
  const hasContractPdf = !!(operator as ExtendedOperator).contractPdf;

  // 20%: Solo Dati personali (basic info)
  if (hasBasicInfo && !hasServices && !hasAvailability && !hasLanguages && !hasIdDocs) 
    return { percent: 20, stage: "Dati personali" };

  // 50%: servizi offerti, disponibilità, lingue, documenti identità
  if (hasBasicInfo && hasServices && hasAvailability && hasLanguages && hasIdDocs &&
    (!contractType || !contractStartDate || !contractSignDate || !hasContractPdf))
    return { percent: 50, stage: "Servizi, disponibilità, lingue, documenti" };

  // 60%: Definito Tipo di contratto, Data inizio contratto
  if (
    hasBasicInfo && hasServices && hasAvailability && hasLanguages && hasIdDocs &&
    contractType && contractStartDate &&
    (!contractSignDate || !hasContractPdf)
  ) {
    return { percent: 60, stage: "Tipo contratto, data inizio" };
  }

  // 80%: Tutto sopra + Data firma e contratto caricato
  if (
    hasBasicInfo && hasServices && hasAvailability && hasLanguages && hasIdDocs &&
    contractType && contractStartDate &&
    contractSignDate && hasContractPdf &&
    // check se c'è almeno un campo "importante" mancante
    Object.values({
      ...operator,
      ...(operator as ExtendedOperator).contractData,
    }).some(v => v === "" || v === null || v === undefined)
  ) {
    return { percent: 80, stage: "Quasi completo" };
  }

  // 100%: Tutti i campi dei Info operatore e contrattualistica pieni
  // Consideriamo pieno se non ci sono stringhe/campi vuoti nei principali
  const requiredInfoFields = [
    "name", "surname", "phone", "email", "gender", "nationality", "birthDate", "address"
  ];
  const contractFields = [
    "contractType", "startDate", "contractSignDate"
  ];

  const allInfoFilled = requiredInfoFields.every(k => !!(operator as any)[k]);
  const allContractFilled = contractFields.every(
    k => !!(operator as ExtendedOperator).contractData && !!(operator as ExtendedOperator).contractData?.[k]
  );
  const allDocs = hasIdDocs && hasContractPdf;

  if (allInfoFilled && hasServices && hasAvailability && hasLanguages && allDocs && allContractFilled) {
    return { percent: 100, stage: "Completato!" };
  }

  return { percent: 0, stage: "Incompleto" };
}
