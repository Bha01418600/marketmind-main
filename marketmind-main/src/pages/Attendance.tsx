import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, X, Clock, UserCheck, UserX } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const sessions = [
  { id: 1, title: "CV Writing Skills", date: "Today, 09:00", location: "Manchester", status: "ongoing" },
  { id: 2, title: "Interview Preparation", date: "Today, 11:30", location: "London", status: "upcoming" },
  { id: 3, title: "Digital Skills 101", date: "Yesterday, 14:00", location: "Birmingham", status: "completed" },
];

const participants = [
  { id: 1, name: "Alex Johnson", status: "present", notes: "" },
  { id: 2, name: "Sarah Williams", status: "present", notes: "" },
  { id: 3, name: "James Brown", status: "absent", notes: "Called in sick" },
  { id: 4, name: "Emma Davis", status: "present", notes: "" },
  { id: 5, name: "Michael Wilson", status: "late", notes: "15 mins late" },
  { id: 6, name: "Sophie Taylor", status: "present", notes: "" },
  { id: 7, name: "Daniel Anderson", status: "pending", notes: "" },
  { id: 8, name: "Olivia Martinez", status: "present", notes: "" },
];

const Attendance = () => {
  const [selectedSession, setSelectedSession] = useState(sessions[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <Check className="w-4 h-4 text-success" />;
      case "absent":
        return <X className="w-4 h-4 text-destructive" />;
      case "late":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      present: "bg-success/10 text-success border-success/20",
      absent: "bg-destructive/10 text-destructive border-destructive/20",
      late: "bg-warning/10 text-warning border-warning/20",
      pending: "bg-muted text-muted-foreground border-muted",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const stats = {
    present: participants.filter((p) => p.status === "present").length,
    absent: participants.filter((p) => p.status === "absent").length,
    late: participants.filter((p) => p.status === "late").length,
    pending: participants.filter((p) => p.status === "pending").length,
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-muted-foreground mt-1">Record and manage participant attendance</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sessions List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-xl p-4 shadow-card border border-border">
              <h3 className="font-display font-semibold mb-4">Sessions</h3>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-all",
                      selectedSession.id === session.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted border border-transparent"
                    )}
                  >
                    <p className="font-medium text-sm text-foreground">{session.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{session.date}</p>
                    <Badge
                      className={cn(
                        "mt-2 text-xs",
                        session.status === "ongoing" && "bg-primary/10 text-primary",
                        session.status === "upcoming" && "bg-accent/10 text-accent",
                        session.status === "completed" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {session.status}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Attendance Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
              {/* Stats Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg">{selectedSession.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedSession.date} • {selectedSession.location}
                    </p>
                  </div>
                  <Button className="gradient-primary text-primary-foreground gap-2">
                    <UserCheck className="w-4 h-4" />
                    Mark All Present
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-success/10 text-center">
                    <p className="text-2xl font-bold text-success">{stats.present}</p>
                    <p className="text-xs text-success/80">Present</p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 text-center">
                    <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
                    <p className="text-xs text-destructive/80">Absent</p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 text-center">
                    <p className="text-2xl font-bold text-warning">{stats.late}</p>
                    <p className="text-xs text-warning/80">Late</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold text-muted-foreground">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search participants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.map((participant, index) => (
                    <motion.tr
                      key={participant.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.03 }}
                      className="border-b border-border last:border-0"
                    >
                      <TableCell className="font-medium">{participant.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(participant.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(participant.status)}
                            {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {participant.notes || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <X className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-warning hover:text-warning hover:bg-warning/10">
                            <Clock className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
