
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface EventPlannerNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const EventPlannerNotes: React.FC<EventPlannerNotesProps> = ({
  notes,
  setNotes
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Note</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Scrivi eventuali note per questo operatore..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
    </Card>
  );
};

export default EventPlannerNotes;
