"use client";

import { useState, useMemo } from "react";
import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { podiumCollection, clubCollection } from "@/collections";
import { categoryZodEnum, placeZodEnum } from "@/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  clubId: z.string().min(1, "Club is required"),
  player: z.string().min(1, "Player name is required"),
  category: categoryZodEnum.refine((val) => val, {
    message: "Category is required",
  }),
  place: placeZodEnum.refine((val) => val, { message: "Place is required" }),
  points: z.number().min(1, "Points are required"),
});

type FormData = z.infer<typeof formSchema>;

interface CreatePodiumFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreatePodiumForm({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: CreatePodiumFormProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external props if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const { data: clubs } = useLiveQuery((q) =>
    q
      .from({ clubs: clubCollection })
      .select(({ clubs }) => ({ id: clubs.id, name: clubs.name }))
  );

  const clubOptions = useMemo(() => {
    return clubs?.map((club) => ({ label: club.name, value: club.id })) || [];
  }, [clubs]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clubId: "",
      player: "",
      category: undefined,
      place: undefined,
      points: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const newPodium = {
        id: uuidv4(),
        clubId: data.clubId,
        player: data.player,
        category: data.category,
        place: data.place,
        points: data.points as number,
      };

      // Insert the new podium into the collection
      // The collection will call our server action via onInsert
      await podiumCollection.insert(newPodium);

      toast.success("Podium created successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating podium:", error);
      toast.error("Failed to create podium. Please try again.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Podium
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Podium</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clubId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a club" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clubOptions.map((club) => (
                        <SelectItem key={club.value} value={club.value}>
                          {club.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="player"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter player name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryZodEnum.options.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a place" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {placeZodEnum.options.map((place) => (
                        <SelectItem key={place} value={place}>
                          {place}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter points"
                      {...field}
                      onChange={(event) => {
                        field.onChange(
                          event.target.value === ""
                            ? 0
                            : Number(event.target.value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Podium"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
