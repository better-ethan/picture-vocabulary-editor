import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

interface PlanItem {
  name: string;
  price: { monthly: string; annual: string };
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

const plans: PlanItem[] = [
  {
    name: "free",
    price: { monthly: "$0", annual: "$0" },
    description: "Perfect for getting started",
    features: [
      "Basic editor",
      "Create up to 3 visual vocabulary",
      "Public sharing",
    ],
    cta: "GET STARTED",
    highlight: false,
  },
  {
    name: "pro",
    price: { monthly: "$9.9", annual: "$99" },
    description: "Pro plan with more features and benefits",
    features: [
      "Everything in Free",
      "Unlimited visual vocabulary",
      "More features coming soon",
    ],
    cta: "GO PRO",
    highlight: true,
  },
];

type BillingCycle = "monthly" | "annual";

export default function Page() {
  return (
    <div className="flex flex-col items-center px-4 py-12 gap-6">
      <div className="flex flex-col items-center gap-4">
        <Text as="h2" className="text-center text-3xl font-bold">
          Visual Vocab Makes English Easier
        </Text>
        <Text className="text-muted-foreground text-center">
          Pictures and audio will help you learn more vocabulary
        </Text>
      </div>
      <Tabs defaultValue="annual" className="w-full max-w-2xl">
        <TabsList className="mb-6 mx-auto shadow-sm flex gap-2">
          <TabsTrigger
            value="annual"
            className="shadow-none data-active:shadow-sm"
          >
            Annual
          </TabsTrigger>
          <TabsTrigger value="monthly" className="shadow-none">
            Monthly
          </TabsTrigger>
        </TabsList>
        {(["annual", "monthly"] as BillingCycle[]).map((billing) => (
          <TabsContent
            key={billing}
            value={billing}
            className={"flex flex-col gap-4 md:flex-row"}
          >
            {plans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} billing={billing} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
      <div className="">
        <Text className="text-muted-foreground">
          Cancel anytime. No hidden fees. No credit card required for free plan.
        </Text>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  billing,
}: {
  plan: PlanItem;
  billing: BillingCycle;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col flex-1 shadow-sm",
        plan.highlight ? "border-primary shadow-md" : ""
      )}
    >
      <CardContent className="flex flex-col flex-1 gap-2">
        <div className="w-full flex items-center justify-between">
          <CardTitle className="uppercase">{plan.name}</CardTitle>
          <CardAction>
            {plan.highlight && (
              <Badge className="bg-primary text-accent-foreground">
                Recommended
              </Badge>
            )}
          </CardAction>
        </div>
        <div className="flex items-end gap-2 mt-4">
          <Text className="text-3xl font-bold">{plan.price[billing]}</Text>
          <span className="text-muted-foreground mb-1">
            {billing === "annual" ? "/per year" : "/per month"}
          </span>
        </div>
        {billing === "annual" && plan.highlight && (
          <span className="text-sm text-accent-foreground bg-primary px-2 py-1 w-fit rounded">
            Save ~22% with annual
          </span>
        )}
        <Text className="text-muted-foreground">{plan.description}</Text>
        <Text className="font-medium mb-2">What's included</Text>
        <ul className="space-y-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="bg-inherit border-none">
        <Button
          type="button"
          variant={plan.highlight ? "default" : "outline"}
          className="w-full shadow-sm mt-4"
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  );
}
