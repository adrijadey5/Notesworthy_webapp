import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function NoteLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="flex-1">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <Skeleton className="h-14 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
