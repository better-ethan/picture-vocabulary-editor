import type { Route } from "./+types/list";
import { buildPageTitle, createTrpcClient, type MatchItem } from "@/util";
import { Link, useLoaderData } from "react-router";
import { Text } from "@/components/ui/text";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const result = await trpc.blog.list.query();

  return result;
};

export const meta: Route.MetaFunction = ({ matches }: Route.MetaArgs) => {
  const pageTitle = buildPageTitle("Blog", matches as MatchItem[]);
  return [{ title: pageTitle }];
};

export default function Page() {
  const blogs = useLoaderData<typeof loader>();

  return (
    <div className="p-4 container mx-auto max-w-4xl">
      <Text as="h3">Blog</Text>
      <p className="text-muted-foreground mt-4 mb-6">
        Read the latest articles and updates
      </p>

      {blogs.length === 0 ? (
        <div className="flex justify-center mt-16">
          <Text as="p">No blog posts found.</Text>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.slug}
              slug={blog.slug}
              title={blog.meta.title}
              description={blog.meta.description}
              cover={blog.meta.cover}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BlogCard({
  slug,
  title,
  description,
  cover,
}: {
  slug: string;
  title: string;
  description: string;
  cover: string;
}) {
  return (
    <Link to={`/blog/${slug}`}>
      <Card className="shadow-sm">
        <CardContent>
          <img src={cover} alt={title} />
        </CardContent>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button type="button" size="sm" className="shadow-sm">
            Continue
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
