import { motion } from "framer-motion";
import { CheckCircle, Calendar, Users, BookOpen } from "lucide-react";

const activities = [
  {
    icon: CheckCircle,
    title: "Workshop completed",
    description: "CV Writing Skills in Manchester",
    time: "2 hours ago",
    iconBg: "bg-success/10 text-success",
  },
  {
    icon: Users,
    title: "New attendance recorded",
    description: "12 participants in Interview Prep",
    time: "3 hours ago",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    icon: Calendar,
    title: "Session scheduled",
    description: "Team Building for London branch",
    time: "5 hours ago",
    iconBg: "bg-accent/10 text-accent",
  },
  {
    icon: BookOpen,
    title: "New workshop added",
    description: "Digital Skills Fundamentals",
    time: "Yesterday",
    iconBg: "bg-warning/10 text-warning",
  },
];

export const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl p-6 shadow-card border border-border"
    >
      <h3 className="font-display font-semibold text-lg mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className="flex gap-4 items-start"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.iconBg}`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
