
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const ContractClauseFields = ({
  contractClause,
  setContractClause,
  workingHoursClause,
  setWorkingHoursClause,
  rebalancing,
  setRebalancing
}) => (
  <>
    <div>
      <Label htmlFor="contractClause">Dicitura Contratto</Label>
      <Textarea
        id="contractClause"
        value={contractClause}
        onChange={e => setContractClause(e.target.value)}
      />
    </div>
    <div>
      <Label htmlFor="workingHoursClause">Dicitura Orario di Lavoro</Label>
      <Textarea
        id="workingHoursClause"
        value={workingHoursClause}
        onChange={e => setWorkingHoursClause(e.target.value)}
      />
    </div>
    <div>
      <Label htmlFor="rebalancing">Riproporzionamento</Label>
      <Input
        type="text"
        id="rebalancing"
        value={rebalancing}
        onChange={e => setRebalancing(e.target.value)}
      />
    </div>
  </>
);

export default ContractClauseFields;
