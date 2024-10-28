import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function SkeletonCard() {
  return (
    <Card className="border-none pt-4 w-56">
      <CardContent className="px-4 ">
        <div className="flex flex-col space-y-3 mt-4 ">
          <div className="flex justify-between gap-2">
            <Skeleton className="h-[40px] w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-4 w-[160px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
