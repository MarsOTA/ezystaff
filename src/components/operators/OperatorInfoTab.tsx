
import React from "react";
import { ExtendedOperator } from "@/types/operator";

// Utility per età
function calculateAge(birthDateStr?: string): number | null {
  if (!birthDateStr) return null;
  const date = new Date(birthDateStr);
  if (isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
  return age;
}

const OperatorInfoTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const eta = calculateAge(operator.birthDate);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Email</div>
          <div className="font-medium break-words">{operator.email || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Telefono</div>
          <div className="font-medium">{operator.phone || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Genere</div>
          <div className="font-medium">{operator.gender || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Codice Fiscale</div>
          <div className="font-medium">{operator.fiscalCode || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Data di nascita</div>
          <div className="font-medium">{operator.birthDate || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Età</div>
          <div className="font-medium">{eta !== null ? eta : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Nazionalità</div>
          <div className="font-medium">{operator.nationality || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Indirizzo</div>
          <div className="font-medium">{operator.address || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Altezza (cm)</div>
          <div className="font-medium">{operator.height ? operator.height : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Peso (kg)</div>
          <div className="font-medium">{operator.weight ? operator.weight : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">N° Scarpe</div>
          <div className="font-medium">{operator.shoeSize ? operator.shoeSize : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Tatuaggi visibili</div>
          <div className="font-medium">
            {typeof operator.visibleTattoos === "boolean" ? operator.visibleTattoos ? "Sì" : "No" : "-"}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">N° Carta d'Identità</div>
          <div className="font-medium">{operator.idCardNumber || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Cittadinanza</div>
          <div className="font-medium">{operator.citizenship || "-"}</div>
        </div>
        {operator.citizenship === "Straniera" && <>
          <div>
            <div className="text-xs text-muted-foreground">N° Permesso di Soggiorno</div>
            <div className="font-medium">{operator.residencePermitNumber || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Tipo Permesso di Soggiorno</div>
            <div className="font-medium">{operator.residencePermitType || "-"}</div>
          </div>
        </>}
        <div>
          <div className="text-xs text-muted-foreground">Patente valida</div>
          <div className="font-medium">
            {operator.driversLicense ? "Sì" : "No"}
          </div>
        </div>
        {operator.driversLicense && <>
          <div>
            <div className="text-xs text-muted-foreground">N° Patente</div>
            <div className="font-medium">{operator.driversLicenseNumber || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Automunito</div>
            <div className="font-medium">
              {typeof operator.hasVehicle === "boolean" ? operator.hasVehicle ? "Sì" : "No" : "-"}
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}

export default OperatorInfoTab;
