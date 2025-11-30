import { type MoodboardImage, type GenerateMoodboardResponse } from "@shared/schema";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "demo";

function extractKeywords(prompt: string): string {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "that", "which",
    "who", "whom", "whose", "this", "these", "those", "very", "own", "just",
    "your", "my", "its", "our", "their", "his", "her"
  ]);

  const words = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  const uniqueWords = Array.from(new Set(words));
  return uniqueWords.slice(0, 3).join(" ");
}

async function fetchFromUnsplash(query: string): Promise<MoodboardImage[]> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=portrait`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Unsplash API failed, using fallback images");
      return getFallbackImages(query);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return getFallbackImages(query);
    }

    return data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      alt: photo.alt_description || query,
      width: photo.width,
      height: photo.height,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }));
  } catch (error) {
    console.error("Error fetching from Unsplash:", error);
    return getFallbackImages(query);
  }
}

function getFallbackImages(query: string): MoodboardImage[] {
  const baseImages = [
    {
      keywords: ["minimalist", "clean", "simple", "white", "modern"],
      images: [
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
        "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=80",
        "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
        "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&q=80",
      ],
    },
    {
      keywords: ["retro", "vintage", "80s", "nostalgic", "old"],
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1524673450801-b5aa9b621b76?w=800&q=80",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
        "https://images.unsplash.com/photo-1527150122806-f682d2fd8b09?w=800&q=80",
        "https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?w=800&q=80",
        "https://images.unsplash.com/photo-1611329532992-0b7ba27d85fb?w=800&q=80",
      ],
    },
    {
      keywords: ["nature", "forest", "green", "landscape", "outdoor", "tree"],
      images: [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
        "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?w=800&q=80",
      ],
    },
    {
      keywords: ["industrial", "urban", "concrete", "steel", "warehouse", "factory"],
      images: [
        "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80",
        "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?w=800&q=80",
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
        "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80",
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=800&q=80",
      ],
    },
    {
      keywords: ["cyberpunk", "neon", "futuristic", "night", "city", "technology"],
      images: [
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
        "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80",
        "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80",
      ],
    },
    {
      keywords: ["vaporwave", "pink", "purple", "palm", "aesthetic", "gradient"],
      images: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80",
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
        "https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=800&q=80",
        "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80",
        "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80",
      ],
    },
  ];

  const queryLower = query.toLowerCase();
  
  for (const category of baseImages) {
    if (category.keywords.some((keyword) => queryLower.includes(keyword))) {
      return category.images.map((url, index) => ({
        id: `fallback-${index}-${Date.now()}`,
        url,
        alt: query,
        width: 800,
        height: 1000,
        photographer: "Unsplash",
        photographerUrl: "https://unsplash.com",
      }));
    }
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80",
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
    "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80",
    "https://images.unsplash.com/photo-1557682260-96773eb01377?w=800&q=80",
    "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=800&q=80",
  ];

  return defaultImages.map((url, index) => ({
    id: `default-${index}-${Date.now()}`,
    url,
    alt: query,
    width: 800,
    height: 1000,
    photographer: "Unsplash",
    photographerUrl: "https://unsplash.com",
  }));
}

export async function generateMoodboard(prompt: string): Promise<GenerateMoodboardResponse> {
  const keywords = extractKeywords(prompt);
  const images = await fetchFromUnsplash(keywords || prompt);

  return {
    images,
    prompt,
  };
}
