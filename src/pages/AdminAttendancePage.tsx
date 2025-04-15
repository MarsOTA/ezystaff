
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format, differenceInMinutes } from "date-fns";
import { safeLocalStorage } from "@/utils/fileUtils";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface AttendanceRecord {
  operatorId: string;
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

const AdminAttendancePage: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<string>("all");
  
  useEffect(() => {
    const records: CheckRecord[] = JSON.parse(safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY) || '[]');
    
    // Group records by operatorId and date
    const groupedRecords: Record<string, Record<string, CheckRecord[]>> = {};
    records.forEach(record => {
      const operatorId = record.operatorId;
      const date = new Date(record.timestamp).toDateString();
      
      if (!groupedRecords[operatorId]) groupedRecords[operatorId] = {};
      if (!groupedRecords[operatorId][date]) groupedRecords[operatorId][date] = [];
      
      groupedRecords[operatorId][date].push(record);
    });
    
    // Process each operator's attendance
    const processedRecords: AttendanceRecord[] = [];
    Object.entries(groupedRecords).forEach(([operatorId, operatorDates]) => {
      Object.entries(operatorDates).forEach(([date, dayRecords]) => {
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
        
        processedRecords.push({
          operatorId,
          date,
          checkIn,
          checkOut,
          hoursWorked,
          locationCheckIn,
          locationCheckOut
        });
      });
    });
    
    // Sort records by date (most recent first)
    processedRecords.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setAttendanceRecords(processedRecords);
    setFilteredRecords(processedRecords);
  }, []);
  
  useEffect(() => {
    let filtered = [...attendanceRecords];
    
    // Filter by search term (operator ID)
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.operatorId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by date
    if (filterDate !== "all") {
      filtered = filtered.filter(record => 
        record.date === filterDate
      );
    }
    
    setFilteredRecords(filtered);
  }, [searchTerm, filterDate, attendanceRecords]);
  
  const getUniqueDates = () => {
    const dates = new Set(attendanceRecords.map(record => record.date));
    return Array.from(dates).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  };
  
  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };
  
  const getOperatorName = (email: string) => {
    // Extract the name part from the email
    const name = email.split("@")[0];
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Registro Presenze Operatori</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Cerca per operatore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger>
                <SelectValue placeholder="Filtra per data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le date</SelectItem>
                {getUniqueDates().map(date => (
                  <SelectItem key={date} value={date}>
                    {format(new Date(date), "dd/MM/yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Presenze</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operatore</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Ore lavorate</TableHead>
                    <TableHead>Posizione check-in</TableHead>
                    <TableHead>Posizione check-out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{getOperatorName(record.operatorId)}</TableCell>
                      <TableCell>{format(new Date(record.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        {record.checkIn ? format(new Date(record.checkIn), "HH:mm:ss") : "-"}
                      </TableCell>
                      <TableCell>
                        {record.checkOut ? format(new Date(record.checkOut), "HH:mm:ss") : "-"}
                      </TableCell>
                      <TableCell>{record.hoursWorked || "-"}</TableCell>
                      <TableCell>
                        {record.locationCheckIn ? (
                          <button 
                            className="flex items-center text-blue-500 hover:underline"
                            onClick={() => openGoogleMaps(
                              record.locationCheckIn!.latitude, 
                              record.locationCheckIn!.longitude
                            )}
                          >
                            Vedi mappa <ExternalLink className="h-3 w-3 ml-1" />
                          </button>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        {record.locationCheckOut ? (
                          <button 
                            className="flex items-center text-blue-500 hover:underline"
                            onClick={() => openGoogleMaps(
                              record.locationCheckOut!.latitude, 
                              record.locationCheckOut!.longitude
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
                Nessuna presenza registrata con i filtri selezionati.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminAttendancePage;
