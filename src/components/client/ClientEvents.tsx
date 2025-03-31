
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Event } from "@/pages/Events";
import { CardFooter } from "@/components/ui/card";

interface ClientEventsProps {
  clientEvents: Event[];
  clientCompanyName: string;
}

const ClientEvents: React.FC<ClientEventsProps> = ({ clientEvents, clientCompanyName }) => {
  const navigate = useNavigate();
  
  // Funzione per formattare data e ora
  const formatDateRange = (start: Date, end: Date) => {
    const sameDay = start.getDate() === end.getDate() && 
                  start.getMonth() === end.getMonth() && 
                  start.getFullYear() === end.getFullYear();
    
    const startDateStr = format(start, "d MMMM yyyy", { locale: it });
    const endDateStr = format(end, "d MMMM yyyy", { locale: it });
    const startTimeStr = format(start, "HH:mm");
    const endTimeStr = format(end, "HH:mm");
    
    if (sameDay) {
      return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
    } else {
      return `Dal ${startDateStr}, ${startTimeStr} al ${endDateStr}, ${endTimeStr}`;
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        Eventi del cliente
      </h3>
      
      {clientEvents.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo Evento</TableHead>
                <TableHead>Data e Ora</TableHead>
                <TableHead>Personale Richiesto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientEvents.map((event) => (
                <TableRow 
                  key={event.id} 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => navigate(`/events/create?id=${event.id}`)}
                >
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{formatDateRange(event.startDate, event.endDate)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {event.personnelTypes.map((type) => (
                        <span 
                          key={type}
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <CardFooter className="flex justify-end">
            <Button 
              variant="outline"
              onClick={() => navigate("/events/create", { 
                state: { preselectedClient: clientCompanyName } 
              })}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Crea nuovo evento
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <div className="text-center py-6 bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Nessun evento registrato per questo cliente</p>
          </div>
          <CardFooter className="flex justify-end">
            <Button 
              variant="outline"
              onClick={() => navigate("/events/create", { 
                state: { preselectedClient: clientCompanyName } 
              })}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Crea nuovo evento
            </Button>
          </CardFooter>
        </>
      )}
    </div>
  );
};

export default ClientEvents;
