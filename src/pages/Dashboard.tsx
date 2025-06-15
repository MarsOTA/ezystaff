
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Users, Calendar as CalendarIcon, Briefcase, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import TodayEventsCard from "@/components/dashboard/TodayEventsCard";
import WeekEventsCard from "@/components/dashboard/WeekEventsCard";
import TodayShiftsCard from "@/components/dashboard/TodayShiftsCard";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { events, operators, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Caricamento dashboard...</div>
        </div>
      </Layout>
    );
  }

  const totalOperators = operators.length;
  const totalEvents = events.length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Panoramica generale delle attività di oggi
          </p>
        </div>

        {/* Main Stats Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventi Totali</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Eventi nel sistema
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up [animation-delay:100ms]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Personale Totale
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOperators}</div>
              <p className="text-xs text-muted-foreground">
                Operatori registrati
              </p>
            </CardContent>
          </Card>

          <WeekEventsCard events={events} />

          <Card className="animate-slide-up [animation-delay:300ms]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">
                Tasso di completamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Cards Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TodayEventsCard events={events} />
          
          <TodayShiftsCard events={events} operators={operators} />

          <Card className="animate-slide-up [animation-delay:400ms]">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Calendario</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={undefined}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
