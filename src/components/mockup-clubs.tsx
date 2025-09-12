"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  User,
  Plus,
  School,
} from "lucide-react";
import { useState, useMemo } from "react";
import { UpdateClubForm } from "./update-club-form";
import { CreateClubForm } from "./create-club-form";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

// Mock data type
type Club = {
  id: string;
  name: string;
};

// Mock clubs data
const mockClubs: Club[] = [
  { id: "1", name: "Flamengo de Aracaju" },
  { id: "2", name: "Sergipe FC" },
  { id: "3", name: "Confiança" },
  { id: "4", name: "América de Propriá" },
  { id: "5", name: "Itabaiana FC" },
  { id: "6", name: "Lagarto FC" },
  { id: "7", name: "Boca Júnior" },
  { id: "8", name: "Estanciano" },
  { id: "9", name: "Freeipiranga" },
  { id: "10", name: "Olímpico" },
  { id: "11", name: "River Plate SE" },
  { id: "12", name: "Vasco da Gama SE" },
];

export function MockupClubs() {
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  // Filter clubs based on search term
  const filteredClubs = useMemo(() => {
    if (!searchTerm.trim()) return clubs;

    return clubs.filter((club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clubs, searchTerm]);

  const handleDeleteClub = async (clubId: string) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setClubs((prevClubs) => prevClubs.filter((club) => club.id !== clubId));
      toast.success("Club deleted successfully!");
    } catch (error) {
      console.error("Error deleting club:", error);
      toast.error("Failed to delete club. Please try again.");
    }
  };

  const handleCreateClub = (newClub: { name: string }) => {
    const club: Club = {
      id: (clubs.length + 1).toString(),
      name: newClub.name,
    };
    setClubs((prevClubs) => [...prevClubs, club]);
  };

  const handleUpdateClub = (updatedClub: Club) => {
    setClubs((prevClubs) =>
      prevClubs.map((club) => (club.id === updatedClub.id ? updatedClub : club))
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Clubs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600 text-center">
            Error loading clubs. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          🏫 Clubs{" "}
          <Badge className="rounded-sm">{filteredClubs.length}</Badge>
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-0"
            />
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Club
          </Button>
        </div>
      </div>
      <div className="w-full mt-4">
        {filteredClubs.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <div>
                <Search className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">
                  No clubs found matching "{searchTerm}"
                </p>
                <p className="text-sm mt-2">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div>
                <User className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">No clubs found</p>
                <p className="text-sm mt-2">
                  Create your first club to get started!
                </p>
              </div>
            )}
          </div>
        ) : (
            <Table>
              <TableHeader className="bg-card rounded-t-2xl sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[20px] text-center">#</TableHead>
                  <TableHead >Name</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClubs.map((club: Club, index) => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="font-semibold">{club.name}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingClub(club)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center gap-2 text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Club</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>{club.name}</strong>? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteClub(club.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        )}

        {editingClub && (
          <UpdateClubForm
            club={editingClub}
            open={true}
            onOpenChange={(open: boolean) => {
              if (!open) setEditingClub(null);
            }}
          />
        )}

        <CreateClubForm
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
        />
      </div>
    </>
  );
}
