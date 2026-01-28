import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const scheduledSessions = [
  { day: 0, time: "09:00", duration: 2, title: "CV Writing", location: "Manchester", color: "bg-primary" },
  { day: 0, time: "14:00", duration: 1.5, title: "Interview Prep", location: "London", color: "bg-accent" },
  { day: 1, time: "10:00", duration: 3, title: "Digital Skills", location: "Birmingham", color: "bg-success" },
  { day: 2, time: "11:00", duration: 2, title: "Team Building", location: "Glasgow", color: "bg-warning" },
  { day: 2, time: "15:00", duration: 1.5, title: "Financial Literacy", location: "Manchester", color: "bg-primary" },
  { day: 3, time: "09:00", duration: 2, title: "Communication", location: "London", color: "bg-accent" },
  { day: 3, time: "14:00", duration: 2, title: "Goal Setting", location: "Leeds", color: "bg-success" },
  { day: 4, time: "10:00", duration: 2, title: "Customer Service", location: "Edinburgh", color: "bg-warning" },
];

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  
  const getSessionStyle = (session: typeof scheduledSessions[0]) => {
    const startIndex = timeSlots.indexOf(session.time);
    const height = session.duration * 60; // 60px per hour
    return {
      top: `${startIndex * 60}px`,
      height: `${height}px`,
    };
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Schedule</h1>
            <p className="text-muted-foreground mt-1">Plan and manage workshop sessions across locations</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2 shadow-glow hover:opacity-90">
            <Plus className="w-4 h-4" />
            Schedule Session
          </Button>
        </motion.div>

        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6 bg-card rounded-xl p-4 shadow-card border border-border"
        >
          <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(currentWeek - 1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h2 className="font-display font-semibold text-lg">Week of January 27, 2026</h2>
            <p className="text-sm text-muted-foreground">8 sessions scheduled</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(currentWeek + 1)}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl shadow-card border border-border overflow-hidden"
        >
          {/* Days Header */}
          <div className="grid grid-cols-6 border-b border-border">
            <div className="p-4 text-center text-sm font-medium text-muted-foreground">Time</div>
            {weekDays.map((day, index) => (
              <div key={day} className="p-4 text-center border-l border-border">
                <div className="font-semibold text-foreground">{day}</div>
                <div className="text-sm text-muted-foreground">{27 + index}</div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-6">
            {/* Time Column */}
            <div className="border-r border-border">
              {timeSlots.map((time) => (
                <div key={time} className="h-[60px] px-4 flex items-start pt-2 text-sm text-muted-foreground border-b border-border">
                  {time}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((_, dayIndex) => (
              <div key={dayIndex} className="relative border-r border-border last:border-r-0">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-[60px] border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  />
                ))}
                {/* Sessions */}
                {scheduledSessions
                  .filter((s) => s.day === dayIndex)
                  .map((session, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className={cn(
                        "absolute left-1 right-1 rounded-lg p-2 text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity overflow-hidden",
                        session.color
                      )}
                      style={getSessionStyle(session)}
                    >
                      <p className="font-medium text-xs truncate">{session.title}</p>
                      <p className="text-xs opacity-80 truncate">{session.location}</p>
                    </motion.div>
                  ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-sm text-muted-foreground">Employability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent" />
            <span className="text-sm text-muted-foreground">Soft Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success" />
            <span className="text-sm text-muted-foreground">Digital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning" />
            <span className="text-sm text-muted-foreground">Life Skills</span>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
