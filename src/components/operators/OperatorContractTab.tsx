
import React from "react";
import { ExtendedOperator } from "@/types/operator";

const OperatorContractTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const cd = operator.contractData || {};
  return (
    <div className="space-y-4">
      <div className="font-semibold mb-2">Dati Contrattuali</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Tipo Contratto</div>
          <div className="font-medium">{cd.contractType || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">CCNL</div>
          <div className="font-medium">{cd.ccnl || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Livello</div>
          <div className="font-medium">{cd.level || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Tipo mansione</div>
          <div className="font-medium">{cd.jobType || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Inizio contratto</div>
          <div className="font-medium">{cd.startDate ? new Date(cd.startDate).toLocaleDateString('it-IT') : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Fine contratto</div>
          <div className="font-medium">
            {cd.endDate ? new Date(cd.endDate).toLocaleDateString('it-IT') : "-"}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Retribuzione Lorda</div>
          <div className="font-medium">{cd.grossSalary || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Retribuzione Netta</div>
          <div className="font-medium">{cd.netSalary || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Ore settimanali</div>
          <div className="font-medium">{cd.weeklyHours || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Percentuale Orario</div>
          <div className="font-medium">{cd.normalHoursPercentage || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Sede Lavoro</div>
          <div className="font-medium">{cd.workLocation || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Location Lavoro</div>
          <div className="font-medium">{cd.workSite || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Paga base e contingenza</div>
          <div className="font-medium">{cd.basePayAndContingency || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">EDR</div>
          <div className="font-medium">{cd.edr || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Totale retribuzione mese</div>
          <div className="font-medium">{cd.totalMonthlyCompensation || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Totale annuo</div>
          <div className="font-medium">{cd.totalAnnualCompensation || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Data firma contratto</div>
          <div className="font-medium">{cd.contractSignDate ? new Date(cd.contractSignDate).toLocaleDateString('it-IT') : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Dicitura contratto</div>
          <div className="font-medium">{cd.contractClause || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Dicitura orario di lavoro</div>
          <div className="font-medium">{cd.workingHoursClause || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Riproporzionamento</div>
          <div className="font-medium">{cd.rebalancing || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Nominativo Formatore</div>
          <div className="font-medium">{cd.trainerName || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Inizio formazione</div>
          <div className="font-medium">{cd.trainingStartDate ? new Date(cd.trainingStartDate).toLocaleDateString('it-IT') : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Fine formazione</div>
          <div className="font-medium">{cd.trainingEndDate ? new Date(cd.trainingEndDate).toLocaleDateString('it-IT') : "-"}</div>
        </div>
      </div>
      <div className="font-semibold mt-4">Contratto firmato:</div>
      {operator.contractPdfName && operator.contractPdf && (
        <div>
          <a href={operator.contractPdf} target="_blank" rel="noopener noreferrer" className="underline text-primary mr-2" download={operator.contractPdfName}>
            {operator.contractPdfName}
          </a>
        </div>
      )}
    </div>
  );
}

export default OperatorContractTab;
