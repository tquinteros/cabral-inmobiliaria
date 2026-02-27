import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <Card className="flex h-full w-full min-w-0 flex-col overflow-hidden pt-0">
      <CardHeader className="shrink-0 p-0">
        <Skeleton className="aspect-[4/3] w-full rounded-none" />
      </CardHeader>
      <CardContent className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-[75%]" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="mt-auto h-5 w-24" />
      </CardContent>
      <CardFooter className="mt-auto shrink-0 p-4 pt-0">
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
