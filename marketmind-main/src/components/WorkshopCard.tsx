import { motion } from "framer-motion";
import { Clock, Users, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkshopCardProps {
  title: string;
  category: string;
  duration: string;
  participants: number;
  nextSession?: string;
  status: "available" | "scheduled" | "completed";
  delay?: number;
}

export const WorkshopCard = ({
  title,
  category,
  duration,
  participants,
  nextSession,
  status,
  delay = 0,
}: WorkshopCardProps) => {
  const statusColors = {
    available: "bg-success/10 text-success border-success/20",
    scheduled: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-muted text-muted-foreground border-muted",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-glow transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <Badge variant="secondary" className="text-xs font-medium">
          {category}
        </Badge>
        <Badge className={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <h3 className="font-display font-semibold text-lg text-card-foreground mb-4 group-hover:text-primary transition-colors">
        {title}
      </h3>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{participants} max participants</span>
        </div>
        {nextSession && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{nextSession}</span>
          </div>
        )}
      </div>

      <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
        View Details
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
};
