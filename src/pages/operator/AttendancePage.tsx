
import React, { useState, useEffect } from "react";
import OperatorLayout from "@/components/OperatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format, differenceInMinutes } from "date-fns";
import { safeLocalStorage } from "@/utils/fileUtils";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink } from "lucide-react";

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
  };
  locationCheckOut?: {
    latitude: number;
    longitude: number;
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
          longitude: firstCheckIn.location.longitude
        };
      }
      
      if (lastCheckOut) {
        checkOut = lastCheckOut.timestamp;
        locationCheckOut = {
          latitude: lastCheckOut.location.latitude,
          longitude: lastCheckOut.location.longitude
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
                          <button 
                            className="flex items-center text-blue-500 hover:underline"
                            onClick={() => openGoogleMaps(
                              day.locationCheckIn!.latitude, 
                              day.locationCheckIn!.longitude
                            )}
                          >
                            Vedi mappa <ExternalLink className="h-3 w-3 ml-1" />
                          </button>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        {day.locationCheckOut ? (
                          <button 
                            className="flex items-center text-blue-500 hover:underline"
                            onClick={() => openGoogleMaps(
                              day.locationCheckOut!.latitude, 
                              day.locationCheckOut!.longitude
                            )}
                          >
                            Vedi mappa <ExternalLink className="h-3 w-3 ml-1" />
                          </button>
                        ) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nessuna presenza registrata.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OperatorLayout>
  );
};

export default AttendancePage;
