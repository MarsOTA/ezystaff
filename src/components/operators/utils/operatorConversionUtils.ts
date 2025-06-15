
import { Operator, ExtendedOperator } from "@/types/operator";

/**
 * Converts an Operator to an ExtendedOperator for display purposes.
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
    nationality: (operator as any).nationality,
    fiscalCode: (operator as any).fiscalCode,
    birthDate: (operator as any).birthDate,
    address: (operator as any).address,
    profileImage: (operator as any).profileImage,
    // Add any more fields if needed
  };
};
