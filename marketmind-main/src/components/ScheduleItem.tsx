import { motion } from "framer-motion";
import { MapPin, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleItemProps {
  time: string;
  title: string;
  location: string;
  attendees: number;
  status: "upcoming" | "ongoing" | "completed";
  delay?: number;
}

export const ScheduleItem = ({
  time,
  title,
  location,
  attendees,
  status,
  delay = 0,
}: ScheduleItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "flex gap-4 p-4 rounded-xl border transition-all hover:shadow-card",
        status === "ongoing"
          ? "bg-primary/5 border-primary/20"
          : status === "completed"
          ? "bg-muted/50 border-border opacity-60"
          : "bg-card border-border"
      )}
    >
      <div className="flex flex-col items-center min-w-[60px]">
        <span className="text-sm font-semibold text-foreground">{time}</span>
        {status === "ongoing" && (
          <span className="mt-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {location}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-3 h-3" />
            {attendees}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium self-start",
          status === "ongoing"
            ? "bg-primary text-primary-foreground"
            : status === "completed"
            ? "bg-muted text-muted-foreground"
            : "bg-accent/10 text-accent"
        )}
      >
        {status === "ongoing" ? "Live" : status === "upcoming" ? "Upcoming" : "Done"}
      </div>
    </motion.div>
  );
};
