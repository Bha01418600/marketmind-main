import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, Target, ArrowUp, ArrowDown } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const attendanceData = [
  { month: "Sep", attendance: 85 },
  { month: "Oct", attendance: 88 },
  { month: "Nov", attendance: 92 },
  { month: "Dec", attendance: 78 },
  { month: "Jan", attendance: 94 },
];

const workshopData = [
  { name: "CV Writing", sessions: 24, participants: 312 },
  { name: "Interview Prep", sessions: 18, participants: 198 },
  { name: "Digital Skills", sessions: 15, participants: 245 },
  { name: "Team Building", sessions: 12, participants: 180 },
  { name: "Financial Lit", sessions: 10, participants: 120 },
];

const outcomeData = [
  { name: "Employed", value: 45, color: "hsl(142, 76%, 36%)" },
  { name: "In Training", value: 25, color: "hsl(217, 91%, 50%)" },
  { name: "Education", value: 20, color: "hsl(180, 70%, 45%)" },
  { name: "Other", value: 10, color: "hsl(215, 20%, 65%)" },
];

const cityData = [
  { city: "Manchester", participants: 89, trend: "+12%" },
  { city: "London", participants: 124, trend: "+8%" },
  { city: "Birmingham", participants: 67, trend: "+15%" },
  { city: "Glasgow", participants: 44, trend: "+5%" },
];

const Analytics = () => {
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
            <h1 className="text-3xl font-display font-bold text-foreground">Impact Analytics</h1>
            <p className="text-muted-foreground mt-1">Track progress, outcomes, and programme effectiveness</p>
          </div>
          <Select defaultValue="q1">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1">Q1 2026</SelectItem>
              <SelectItem value="q4">Q4 2025</SelectItem>
              <SelectItem value="q3">Q3 2025</SelectItem>
              <SelectItem value="year">Full Year 2025</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Participants"
            value={1247}
            change="+18% from last quarter"
            changeType="positive"
            icon={Users}
            delay={0.1}
          />
          <StatCard
            title="Sessions Delivered"
            value={156}
            change="+23 this month"
            changeType="positive"
            icon={Clock}
            delay={0.15}
          />
          <StatCard
            title="Avg. Attendance"
            value="91%"
            change="+3% improvement"
            changeType="positive"
            icon={Target}
            delay={0.2}
          />
          <StatCard
            title="Positive Outcomes"
            value="72%"
            change="+5% from target"
            changeType="positive"
            icon={TrendingUp}
            delay={0.25}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-6 shadow-card border border-border"
          >
            <h3 className="font-display font-semibold text-lg mb-6">Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[70, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="hsl(217, 91%, 50%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(217, 91%, 50%)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Outcomes Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card rounded-xl p-6 shadow-card border border-border"
          >
            <h3 className="font-display font-semibold text-lg mb-6">Participant Outcomes</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {outcomeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground flex-1">{item.name}</span>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workshop Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card rounded-xl p-6 shadow-card border border-border"
          >
            <h3 className="font-display font-semibold text-lg mb-6">Workshop Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workshopData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sessions" fill="hsl(217, 91%, 50%)" radius={[4, 4, 0, 0]} name="Sessions" />
                <Bar dataKey="participants" fill="hsl(180, 70%, 45%)" radius={[4, 4, 0, 0]} name="Participants" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* City Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-card rounded-xl p-6 shadow-card border border-border"
          >
            <h3 className="font-display font-semibold text-lg mb-6">By Location</h3>
            <div className="space-y-4">
              {cityData.map((city, index) => (
                <motion.div
                  key={city.city}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{city.city}</span>
                      <span className="text-sm text-muted-foreground">{city.participants}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(city.participants / 124) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
                        className="h-full gradient-primary rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-success flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    {city.trend}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
