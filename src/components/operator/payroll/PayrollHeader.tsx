
import React from "react";
import { Button } from "@/components/ui/button";
import { DownloadCloud, RefreshCw } from "lucide-react";

interface PayrollHeaderProps {
  operatorName: string;
  onExportCSV: () => void;
  onRefresh?: () => void;
}

const PayrollHeader: React.FC<PayrollHeaderProps> = ({ 
  operatorName, 
  onExportCSV, 
  onRefresh 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Payroll - {operatorName}
        </h2>
        <p className="text-muted-foreground">
          Visualizza e gestisci le informazioni di payroll per questo operatore.
        </p>
      </div>
      <div className="flex space-x-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Aggiorna
          </Button>
        )}
        <Button variant="outline" onClick={onExportCSV} size="sm">
          <DownloadCloud className="mr-2 h-4 w-4" />
          Esporta CSV
        </Button>
      </div>
    </div>
  );
};

export default PayrollHeader;
