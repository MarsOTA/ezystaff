import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronRight } from 'lucide-react';
import { Event } from '@/types/event';

interface ClientEventsProps {
  clientEvents: Event[];
  clientCompanyName: string;
}

const ClientEvents: React.FC<ClientEventsProps> = ({ clientEvents, clientCompanyName }) => {
  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-semibold">Eventi per {clientCompanyName}</h2>
        <Button size="sm" variant="outline" disabled={clientEvents.length === 0}>
          Esporta (.xlsx)
        </Button>
      </div>
      
      {clientEvents.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Titolo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 opacity-70" />
                    <span>{format(event.startDate, 'dd/MM/yyyy', { locale: it })}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.status || 'Pianificato'}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" asChild>
                    <Link to={`/events/create?id=${event.id}`} className="flex items-center gap-2">
                      Visualizza <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4">
          Nessun evento trovato per questo cliente.
        </div>
      )}
    </div>
  );
};

export default ClientEvents;
