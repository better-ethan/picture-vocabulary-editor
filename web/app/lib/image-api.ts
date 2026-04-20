const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

interface PixabayImageItem {
  id: number;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
}

export async function fetchImagesFromPixabay(
  query: string
): Promise<PixabayImageItem[] | null> {
  if (!PIXABAY_API_KEY) {
    console.error("Pixabay API key is not set.");
    return null;
  }

  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&per_page=50`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      return data.hits;
    } else {
      console.warn("No images found for query:", query);
      return null;
    }
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    return null;
  }
}
