
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckRecord, Event } from "./types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { setupAttendanceListener } from "./api/attendanceApi";

interface AttendanceTableProps {
  records: CheckRecord[];
  events: Event[];
  onRefresh: () => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, events, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Set up attendance listener for real-time updates
  useEffect(() => {
    const cleanup = setupAttendanceListener(() => {
      console.log("Attendance records updated from another window");
      onRefresh();
    });
    
    return cleanup;
  }, [onRefresh]);
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      onRefresh();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [onRefresh]);

  // Group records by event and date
  const groupedRecords: Record<string, CheckRecord[]> = {};
  
  records.forEach(record => {
    // Group by eventId and day
    const recordDate = new Date(record.timestamp).toDateString();
    const key = `${record.eventId}-${recordDate}`;
    
    if (!groupedRecords[key]) groupedRecords[key] = [];
    groupedRecords[key].push(record);
  });

  // Get event title by ID
  const getEventTitle = (eventId: number): string => {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : `Evento #${eventId}`;
  };

  // Format time from timestamp
  const formatTime = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), 'HH:mm:ss');
    } catch (error) {
      return "Orario non valido";
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), 'dd/MM/yyyy');
    } catch (error) {
      return "Data non valida";
    }
  };

  // Get accuracy badge
  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy <= 10) return <Badge className="bg-green-500">Alta ({accuracy.toFixed(0)}m)</Badge>;
    if (accuracy <= 50) return <Badge className="bg-yellow-500">Media ({accuracy.toFixed(0)}m)</Badge>;
    return <Badge className="bg-red-500">Bassa ({accuracy.toFixed(0)}m)</Badge>;
  };

  // Calculate hours between check-in and check-out
  const calculateHours = (records: CheckRecord[]): string => {
    if (records.length < 2) return "-";
    
    // Find the earliest check-in and latest check-out
    const checkIns = records.filter(r => r.type === "check-in");
    const checkOuts = records.filter(r => r.type === "check-out");
    
    if (checkIns.length === 0 || checkOuts.length === 0) return "-";
    
    const checkIn = new Date(checkIns[0].timestamp);
    const checkOut = new Date(checkOuts[checkOuts.length - 1].timestamp);
    
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours.toFixed(2);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const keys = Object.keys(groupedRecords);
  const sortedKeys = keys.sort((a, b) => {
    const dateA = new Date(groupedRecords[a][0].timestamp);
    const dateB = new Date(groupedRecords[b][0].timestamp);
    return dateB.getTime() - dateA.getTime(); // Most recent first
  });

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Registro Presenze</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Aggiorna
        </Button>
      </div>
      
      {sortedKeys.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nessuna registrazione presente</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Non ci sono registrazioni di presenze per questo operatore.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Check-In</TableHead>
                <TableHead>Check-Out</TableHead>
                <TableHead>Ore Lavorate</TableHead>
                <TableHead>Precisione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedKeys.map(key => {
                const dayRecords = groupedRecords[key];
                // Sort by timestamp
                dayRecords.sort((a, b) => 
                  new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
                
                const checkIns = dayRecords.filter(r => r.type === "check-in");
                const checkOuts = dayRecords.filter(r => r.type === "check-out");
                
                const eventId = dayRecords[0].eventId;
                const date = formatDate(dayRecords[0].timestamp);
                
                return (
                  <TableRow key={key}>
                    <TableCell>{getEventTitle(eventId)}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>
                      {checkIns.length > 0 ? formatTime(checkIns[0].timestamp) : "-"}
                    </TableCell>
                    <TableCell>
                      {checkOuts.length > 0 ? formatTime(checkOuts[checkOuts.length - 1].timestamp) : "-"}
                    </TableCell>
                    <TableCell>{calculateHours(dayRecords)}</TableCell>
                    <TableCell>
                      {checkIns.length > 0 ? getAccuracyBadge(checkIns[0].location.accuracy) : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default AttendanceTable;
