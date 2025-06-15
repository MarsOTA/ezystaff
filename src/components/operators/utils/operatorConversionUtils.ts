
import { Operator, ExtendedOperator } from "@/types/operator";

/**
 * Converts an Operator to an ExtendedOperator for display purposes.
 * CERCA di copiare tutti i campi cruciali per il profilo e % completamento!
 */
export const operatorToExtended = (operator: Operator): ExtendedOperator => {
  return {
    ...operator,
    name: operator.name,
    surname: operator.surname,
    email: operator.email,
    phone: operator.phone,
    gender: (operator as any).gender,
    profession: (operator as any).profession,
    occupation: (operator as any).occupation,
    nationality: (operator as any).nationality,
    fiscalCode: (operator as any).fiscalCode,
    birthDate: (operator as any).birthDate,
    address: (operator as any).address,
    // Campi aggiuntivi utili per la percentuale profilo:
    service: (operator as any).service ?? [],
    availability: (operator as any).availability ?? [],
    fluentLanguages: (operator as any).fluentLanguages ?? [],
    idCardFrontImage: (operator as any).idCardFrontImage ?? null,
    idCardBackImage: (operator as any).idCardBackImage ?? null,
    idCardFront: (operator as any).idCardFront ?? null,
    idCardBack: (operator as any).idCardBack ?? null,
    contractPdf: (operator as any).contractPdf ?? null,
    contractData: (operator as any).contractData ?? {},
    profileImage: (operator as any).profileImage ?? null,
    // Altri campi ExtendedOperator lasciati vuoti se non disponibili
  };
};
