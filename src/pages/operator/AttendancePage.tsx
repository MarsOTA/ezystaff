
import React, { useState, useEffect } from "react";
import OperatorLayout from "@/components/OperatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format, differenceInMinutes } from "date-fns";
import { safeLocalStorage } from "@/utils/fileUtils";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CheckRecord {
  operatorId: string;
  timestamp: string;
  type: "check-in" | "check-out";
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  eventId: number;
}

interface AttendanceDay {
  date: string;
  checkIn?: string;
  checkOut?: string;
  hoursWorked: number;
  locationCheckIn?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  locationCheckOut?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

const ATTENDANCE_RECORDS_KEY = "attendance_records";

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [attendanceDays, setAttendanceDays] = useState<AttendanceDay[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const records: CheckRecord[] = JSON.parse(safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY) || '[]');
    const userRecords = records.filter(record => record.operatorId === user.email);
    
    // Group records by date
    const groupedByDate: Record<string, CheckRecord[]> = {};
    userRecords.forEach(record => {
      const date = new Date(record.timestamp).toDateString();
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push(record);
    });
    
    // Process each day's records
    const processedDays: AttendanceDay[] = [];
    Object.entries(groupedByDate).forEach(([date, dayRecords]) => {
      // Sort records by timestamp
      dayRecords.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      let checkIn: string | undefined;
      let checkOut: string | undefined;
      let locationCheckIn;
      let locationCheckOut;
      
      // Find the first check-in and last check-out of the day
      const firstCheckIn = dayRecords.find(r => r.type === "check-in");
      const lastCheckOut = [...dayRecords].reverse().find(r => r.type === "check-out");
      
      if (firstCheckIn) {
        checkIn = firstCheckIn.timestamp;
        locationCheckIn = {
          latitude: firstCheckIn.location.latitude,
          longitude: firstCheckIn.location.longitude,
          accuracy: firstCheckIn.location.accuracy
        };
      }
      
      if (lastCheckOut) {
        checkOut = lastCheckOut.timestamp;
        locationCheckOut = {
          latitude: lastCheckOut.location.latitude,
          longitude: lastCheckOut.location.longitude,
          accuracy: lastCheckOut.location.accuracy
        };
      }
      
      // Calculate hours worked
      let hoursWorked = 0;
      if (checkIn && checkOut) {
        const minutes = differenceInMinutes(
          new Date(checkOut),
          new Date(checkIn)
        );
        hoursWorked = parseFloat((minutes / 60).toFixed(2));
      }
      
      processedDays.push({
        date,
        checkIn,
        checkOut,
        hoursWorked,
        locationCheckIn,
        locationCheckOut
      });
    });
    
    // Sort days by date (most recent first)
    processedDays.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setAttendanceDays(processedDays);
  }, [user]);
  
  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };
  
  const getAccuracyBadge = (accuracy: number | undefined) => {
    if (!accuracy) return null;
    
    if (accuracy <= 10) {
      return <Badge className="bg-green-500">Alta precisione ({Math.round(accuracy)}m)</Badge>;
    } else if (accuracy <= 50) {
      return <Badge className="bg-amber-500">Media precisione ({Math.round(accuracy)}m)</Badge>;
    } else {
      return <Badge className="bg-red-500">Bassa precisione ({Math.round(accuracy)}m)</Badge>;
    }
  };

  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Le mie presenze</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Registro presenze</CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceDays.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Ore lavorate</TableHead>
                      <TableHead>Posizione check-in</TableHead>
                      <TableHead>Posizione check-out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceDays.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(new Date(day.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          {day.checkIn ? format(new Date(day.checkIn), "HH:mm:ss") : "-"}
                        </TableCell>
                        <TableCell>
                          {day.checkOut ? format(new Date(day.checkOut), "HH:mm:ss") : "-"}
                        </TableCell>
                        <TableCell>{day.hoursWorked || "-"}</TableCell>
                        <TableCell>
                          {day.locationCheckIn ? (
                            <div className="space-y-1">
                              {getAccuracyBadge(day.locationCheckIn.accuracy)}
                              <button 
                                className="flex items-center text-blue-500 hover:underline"
                                onClick={() => openGoogleMaps(
                                  day.locationCheckIn!.latitude, 
                                  day.locationCheckIn!.longitude
                                )}
                              >
                                Vedi mappa <ExternalLink className="h-3 w-3 ml-1" />
                              </button>
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          {day.locationCheckOut ? (
                            <div className="space-y-1">
                              {getAccuracyBadge(day.locationCheckOut.accuracy)}
                              <button 
                                className="flex items-center text-blue-500 hover:underline"
                                onClick={() => openGoogleMaps(
                                  day.locationCheckOut!.latitude, 
                                  day.locationCheckOut!.longitude
                                )}
                              >
                                Vedi mappa <ExternalLink className="h-3 w-3 ml-1" />
                              </button>
                            </div>
                          ) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nessuna presenza registrata.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p><strong>Informazioni sulla precisione del rilevamento:</strong></p>
                <ul className="list-disc list-inside mt-2">
                  <li><span className="text-green-600 font-semibold">Alta precisione</span>: Margine di errore inferiore a 10 metri</li>
                  <li><span className="text-amber-600 font-semibold">Media precisione</span>: Margine di errore tra 10 e 50 metri</li>
                  <li><span className="text-red-600 font-semibold">Bassa precisione</span>: Margine di errore superiore a 50 metri</li>
                </ul>
                <p className="mt-2">La precisione dipende dal dispositivo, dall'ambiente circostante e dalla qualità del segnale GPS.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OperatorLayout>
  );
};

export default AttendancePage;
