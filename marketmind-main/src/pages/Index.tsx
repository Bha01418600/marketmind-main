import { motion } from "framer-motion";
import { BookOpen, Users, Calendar, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ScheduleItem } from "@/components/ScheduleItem";
import { RecentActivity } from "@/components/RecentActivity";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const todaySchedule = [
  {
    time: "09:00",
    title: "CV Writing Workshop",
    location: "Manchester Hub",
    attendees: 12,
    status: "completed" as const,
  },
  {
    time: "11:30",
    title: "Interview Skills",
    location: "London Centre",
    attendees: 8,
    status: "ongoing" as const,
  },
  {
    time: "14:00",
    title: "Digital Skills 101",
    location: "Birmingham Office",
    attendees: 15,
    status: "upcoming" as const,
  },
  {
    time: "16:30",
    title: "Team Building",
    location: "Glasgow Hub",
    attendees: 20,
    status: "upcoming" as const,
  },
];

const Dashboard = () => {
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
            <h1 className="text-3xl font-display font-bold text-foreground">
              Good morning, Jane 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening across your programmes today.
            </p>
          </div>
          <Link to="/workshops">
            <Button className="gradient-primary text-primary-foreground gap-2 shadow-glow hover:opacity-90">
              <Plus className="w-4 h-4" />
              New Workshop
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Workshops"
            value={48}
            change="+3 this week"
            changeType="positive"
            icon={BookOpen}
            delay={0.1}
          />
          <StatCard
            title="Active Participants"
            value={324}
            change="+12% from last month"
            changeType="positive"
            icon={Users}
            delay={0.15}
          />
          <StatCard
            title="Sessions This Week"
            value={18}
            change="4 remaining"
            changeType="neutral"
            icon={Calendar}
            delay={0.2}
          />
          <StatCard
            title="Completion Rate"
            value="94%"
            change="+2% improvement"
            changeType="positive"
            icon={TrendingUp}
            delay={0.25}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-2 bg-card rounded-xl p-6 shadow-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg">Today's Schedule</h3>
              <Link to="/schedule">
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <ScheduleItem key={index} {...item} delay={0.35 + index * 0.05} />
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Link to="/workshops">
            <div className="p-6 rounded-xl border border-border bg-card hover:shadow-glow transition-all cursor-pointer group">
              <BookOpen className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-foreground">Browse Workshops</h4>
              <p className="text-sm text-muted-foreground mt-1">Explore the curriculum library</p>
            </div>
          </Link>
          <Link to="/schedule">
            <div className="p-6 rounded-xl border border-border bg-card hover:shadow-glow transition-all cursor-pointer group">
              <Calendar className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-foreground">Plan Sessions</h4>
              <p className="text-sm text-muted-foreground mt-1">Create multi-week timetables</p>
            </div>
          </Link>
          <Link to="/analytics">
            <div className="p-6 rounded-xl border border-border bg-card hover:shadow-glow transition-all cursor-pointer group">
              <TrendingUp className="w-8 h-8 text-success mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-foreground">View Impact</h4>
              <p className="text-sm text-muted-foreground mt-1">Track progress and outcomes</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
