
import React from 'react';
import { PayrollCalculation } from "./types";

interface PayrollChartsProps {
  calculations: PayrollCalculation[];
  totalCompensation: number;
}

const PayrollCharts: React.FC<PayrollChartsProps> = () => {
  // Empty component as requested - charts have been removed
  return null;
};

export default PayrollCharts;
