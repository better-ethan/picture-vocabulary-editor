import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import type { PictureLesson } from "@/types";
import { Link } from "react-router";

export const PictureLessonCard = ({ lesson }: { lesson: PictureLesson }) => {
  return (
    <Link to={`/picture-lesson/${lesson.id}/${lesson.slug}`}>
      <Card className="max-w-60 shadow-sm">
        <CardContent className="flex items-center justify-center pb-0">
          <img className="w-50 h-auto" src={lesson.thumbnail} />
        </CardContent>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 pt-2">
          <Text className="text-muted-foreground">{lesson.username}</Text>
        </CardContent>
      </Card>
    </Link>
  );
};
