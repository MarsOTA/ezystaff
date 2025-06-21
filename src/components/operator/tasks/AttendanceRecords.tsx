
import React from "react";
import { format } from "date-fns";
import { Clock, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AttendanceRecord {
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

interface AttendanceRecordsProps {
  eventId: number;
  operatorEmail: string;
}

const AttendanceRecords: React.FC<AttendanceRecordsProps> = ({ eventId, operatorEmail }) => {
  const getAttendanceRecords = (): AttendanceRecord[] => {
    const records = localStorage.getItem("attendance_records");
    if (!records) return [];
    
    try {
      const parsedRecords = JSON.parse(records) as AttendanceRecord[];
      return parsedRecords.filter(
        record => record.operatorId === operatorEmail && record.eventId === eventId
      );
    } catch (error) {
      console.error("Error parsing attendance records:", error);
      return [];
    }
  };

  const calculateWorkedHours = (records: AttendanceRecord[]): number => {
    const checkIns = records.filter(r => r.type === "check-in").sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const checkOuts = records.filter(r => r.type === "check-out").sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let totalHours = 0;
    const pairs = Math.min(checkIns.length, checkOuts.length);
    
    for (let i = 0; i < pairs; i++) {
      const checkIn = new Date(checkIns[i].timestamp);
      const checkOut = new Date(checkOuts[i].timestamp);
      const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      totalHours += hours;
    }
    
    return Math.round(totalHours * 100) / 100;
  };

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy <= 10) {
      return <Badge className="bg-green-500 text-white">Alta precisione ({Math.round(accuracy)}m)</Badge>;
    } else if (accuracy <= 50) {
      return <Badge className="bg-amber-500 text-white">Media precisione ({Math.round(accuracy)}m)</Badge>;
    } else {
      return <Badge className="bg-red-500 text-white">Bassa precisione ({Math.round(accuracy)}m)</Badge>;
    }
  };

  const records = getAttendanceRecords();
  const workedHours = calculateWorkedHours(records);

  if (records.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nessuna timbratura registrata per questo evento
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Timbrature registrate</h4>
        <div className="text-sm text-green-600 font-medium">
          Ore lavorate: {workedHours}h
        </div>
      </div>
      
      <div className="space-y-3">
        {records.map((record, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {record.type === "check-in" ? "Check-in" : "Check-out"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(record.timestamp), "dd/MM/yyyy HH:mm:ss")}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Posizione GPS</span>
              </div>
              <div className="flex items-center space-x-2">
                {getAccuracyBadge(record.location.accuracy)}
                <button 
                  className="flex items-center text-blue-500 hover:underline text-sm"
                  onClick={() => openGoogleMaps(record.location.latitude, record.location.longitude)}
                >
                  Mappa <ExternalLink className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceRecords;
