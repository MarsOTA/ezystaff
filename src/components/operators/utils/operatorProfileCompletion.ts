
import { Operator } from "@/types/operator";
import { ExtendedOperator } from "@/types/operator";

// Aggiorna la logica secondo la richiesta cliente
export function getOperatorProfileCompletion(operator: ExtendedOperator | Operator): { percent: number; stage: string } {
  // Sezione Dati personali
  const hasBasicInfo =
    !!operator.name &&
    !!operator.surname &&
    !!operator.phone &&
    !!operator.email &&
    !!operator.gender &&
    !!operator.nationality &&
    ("birthDate" in operator ? !!operator.birthDate : false) &&
    ("address" in operator ? !!operator.address : false);

  // Mansione/servizi offerti
  const hasServices =
    Array.isArray((operator as ExtendedOperator).service) &&
    ((operator as ExtendedOperator).service?.length);

  // Disponibilità
  const hasAvailability =
    Array.isArray((operator as ExtendedOperator).availability) &&
    ((operator as ExtendedOperator).availability?.length);

  // Lingue
  const hasLanguages =
    Array.isArray((operator as ExtendedOperator).fluentLanguages) &&
    ((operator as ExtendedOperator).fluentLanguages?.length);

  // Documenti identità
  const hasIdDocs =
    (!!(operator as ExtendedOperator).idCardFrontImage || !!(operator as ExtendedOperator).idCardFront) &&
    (!!(operator as ExtendedOperator).idCardBackImage || !!(operator as ExtendedOperator).idCardBack);

  // Dati contratto
  const contractData = (operator as ExtendedOperator).contractData || {};
  const contractType = contractData.contractType;
  const contractStartDate = contractData.startDate;
  const contractSignDate = contractData.contractSignDate;
  const hasContractPdf = !!(operator as ExtendedOperator).contractPdf;

  // 20% solo dati personali
  if (hasBasicInfo && !(hasServices || hasAvailability || hasLanguages || hasIdDocs)) {
    return { percent: 20, stage: "Dati personali" };
  }

  // 50% servizi offerti, disponibilità, lingue, documenti identità
  if (
    hasBasicInfo &&
    hasServices && hasAvailability && hasLanguages && hasIdDocs &&
    !(contractType && contractStartDate && contractSignDate && hasContractPdf)
  ) {
    return { percent: 50, stage: "Compilazione avanzata" };
  }

  // 60% tipo di contratto, data inizio contratto definiti
  if (
    hasBasicInfo &&
    hasServices && hasAvailability && hasLanguages && hasIdDocs &&
    (contractType && contractStartDate) && !(contractSignDate && hasContractPdf)
  ) {
    return { percent: 60, stage: "Contratto: tipo e data inizio" };
  }

  // 80% tutto sopra + data firma e contratto caricato
  if (
    hasBasicInfo &&
    hasServices && hasAvailability && hasLanguages && hasIdDocs &&
    contractType && contractStartDate &&
    contractSignDate && hasContractPdf
  ) {
    // ma se NON è ancora 100%, allora manca qualcosa nei restanti campi richiesti
    // Check se manca almeno un campo dei principali (Info personale + contratto)
    const requiredInfoFields = [
      "name", "surname", "phone", "email", "gender", "nationality", "birthDate", "address"
    ];
    const contractFields = [
      "contractType", "startDate", "contractSignDate"
    ];
    const allInfoFilled = requiredInfoFields.every(k => !!(operator as any)[k]);
    const allContractFieldsFilled = contractFields.every(
      k => !!contractData?.[k]
    );
    if (!(allInfoFilled && allContractFieldsFilled)) {
      return { percent: 80, stage: "Quasi completo" };
    }
  }

  // 100% tutti i campi info operatore e contrattualistica pieni
  const requiredInfoFields = [
    "name", "surname", "phone", "email", "gender", "nationality", "birthDate", "address"
  ];
  const contractFields = [
    "contractType", "startDate", "contractSignDate"
  ];
  const allInfoFilled = requiredInfoFields.every(k => !!(operator as any)[k]);
  const allContractFieldsFilled = contractFields.every(
    k => !!contractData?.[k]
  );
  const allDocs = hasIdDocs && hasContractPdf;
  if (
    allInfoFilled &&
    hasServices && hasAvailability && hasLanguages && allDocs && allContractFieldsFilled
  ) {
    return { percent: 100, stage: "Completato!" };
  }

  return { percent: 0, stage: "Incompleto" };
}
