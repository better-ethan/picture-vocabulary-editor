import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { PictureVocab } from "@/types";
import { Link } from "react-router";

export const PictureVocabCard = ({ vocab }: { vocab: PictureVocab }) => {
  return (
    <Link to={`/picture-vocab/${vocab.id}/${vocab.slug}`}>
      <Card className="max-w-60 shadow-sm">
        <CardContent className="flex items-center justify-center pb-0">
          <img className="w-50 h-auto" src={vocab.thumbnail} />
        </CardContent>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">
            {vocab.title.charAt(0).toUpperCase() + vocab.title.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2 pt-2">
          <Text className="text-muted-foreground">{vocab.username}</Text>
        </CardContent>
      </Card>
    </Link>
  );
};
