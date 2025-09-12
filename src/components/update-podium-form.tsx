"use client";

import { useForm } from "react-hook-form";
import { useLiveQuery } from "@tanstack/react-db";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { podiumCollection, clubCollection } from "@/collections";
import { type Podium } from "@/schema";
import { categoryZodEnum, placeZodEnum } from "@/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner";
import { useMemo } from "react";

const formSchema = z.object({
  clubId: z.string().min(1, "Club is required"),
  player: z.string().min(1, "Player name is required"),
  category: categoryZodEnum,
  place: placeZodEnum,
  points: z.number().min(1, "Points are required"),
});

type FormData = {
  clubId: string;
  player: string;
  category: z.infer<typeof categoryZodEnum>;
  place: z.infer<typeof placeZodEnum>;
  points: number;
};

interface UpdatePodiumFormProps {
  podium: Podium;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdatePodiumForm({
  podium,
  open,
  onOpenChange,
}: UpdatePodiumFormProps) {
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
      clubId: podium.clubId ?? undefined,
      player: podium.player ?? undefined,
      category: podium.category,
      place: podium.place,
      points: podium.points as number,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await podiumCollection.update(podium.id, (draft) => {
        draft.clubId = data.clubId;
        draft.player = data.player;
        draft.category = data.category;
        draft.place = data.place;
        draft.points = data.points;
      });

      toast.success("Podium updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating podium:", error);
      toast.error("Failed to update podium. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Podium</DialogTitle>
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
                    <Input type="number" placeholder="Enter points" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Updating..." : "Update Podium"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}