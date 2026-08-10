import { Text } from "@/components/ui/Text";

export default function Page() {
  return (
    <div className="flex flex-col items-start gap-4 max-w-3xl mx-auto py-12 px-4">
      <div className="w-full border-b pb-4">
        <Text as="h2">Contact Us</Text>
      </div>
      <div className="text-muted-foreground leading-relaxed flex flex-col gap-3">
        <p>Have a question, found a problem, or have a suggestion?</p>
        <p>We'd love to hear from you.</p>
        <p>Email: support@visualvocab.com</p>
        <p>We'll do our best to get back to you as soon as possible.</p>
      </div>
    </div>
  );
}
