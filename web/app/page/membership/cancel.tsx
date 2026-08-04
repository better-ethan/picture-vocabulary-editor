import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { XCircleIcon } from "lucide-react";
import { Link } from "react-router";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md text-center shadow-sm">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <XCircleIcon className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your payment was cancelled and you have not been charged.
          </p>
          <p className="text-muted-foreground">
            If you have any questions or need help, feel free to contact our
            support team.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 bg-inherit border-none">
          <Button
            variant="secondary"
            className="w-full shadow-sm"
            render={<Link to="/pricing">Back to Pricing</Link>}
          ></Button>
          <Button
            variant="outline"
            className="w-full shadow-sm"
            render={<Link to="/">Go to Home</Link>}
          ></Button>
        </CardFooter>
      </Card>
    </div>
  );
}
