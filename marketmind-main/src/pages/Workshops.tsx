import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, Grid, List } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { WorkshopCard } from "@/components/WorkshopCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const workshops = [
  {
    title: "CV Writing Skills",
    category: "Employability",
    duration: "2 hours",
    participants: 15,
    nextSession: "Tomorrow, 10:00 AM",
    status: "scheduled" as const,
  },
  {
    title: "Interview Preparation",
    category: "Employability",
    duration: "1.5 hours",
    participants: 12,
    status: "available" as const,
  },
  {
    title: "Digital Skills 101",
    category: "Digital",
    duration: "3 hours",
    participants: 20,
    nextSession: "Wed, 14:00",
    status: "scheduled" as const,
  },
  {
    title: "Team Building Essentials",
    category: "Soft Skills",
    duration: "2.5 hours",
    participants: 25,
    status: "available" as const,
  },
  {
    title: "Financial Literacy",
    category: "Life Skills",
    duration: "2 hours",
    participants: 15,
    status: "available" as const,
  },
  {
    title: "Communication Skills",
    category: "Soft Skills",
    duration: "1.5 hours",
    participants: 18,
    nextSession: "Fri, 09:00",
    status: "scheduled" as const,
  },
  {
    title: "Goal Setting Workshop",
    category: "Personal Development",
    duration: "2 hours",
    participants: 12,
    status: "completed" as const,
  },
  {
    title: "Customer Service Excellence",
    category: "Employability",
    duration: "2 hours",
    participants: 15,
    status: "available" as const,
  },
];

const categories = ["All", "Employability", "Digital", "Soft Skills", "Life Skills", "Personal Development"];

const Workshops = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || workshop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-3xl font-display font-bold text-foreground">Workshop Library</h1>
            <p className="text-muted-foreground mt-1">
              Browse and select from our curriculum of {workshops.length} workshops
            </p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2 shadow-glow hover:opacity-90">
            <Plus className="w-4 h-4" />
            Add Workshop
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Workshops Grid */}
        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
          {filteredWorkshops.map((workshop, index) => (
            <WorkshopCard key={workshop.title} {...workshop} delay={0.15 + index * 0.05} />
          ))}
        </div>

        {filteredWorkshops.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No workshops found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Workshops;
