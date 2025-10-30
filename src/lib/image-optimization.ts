export interface ImageSEOProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export const generateAltText = (
  imageType: string,
  context: string,
  additionalInfo?: string
): string => {
  const baseAlt = `ChronoBond ${imageType}`;
  
  switch (imageType) {
    case "logo":
      return `${baseAlt} - DeFi Time-Locked Bonds Platform Logo`;
    case "bond-card":
      return `${baseAlt} - ${context} bond with ${additionalInfo || "yield information"}`;
    case "dashboard":
      return `${baseAlt} - ${context} dashboard showing bond portfolio and analytics`;
    case "marketplace":
      return `${baseAlt} - ${context} marketplace with available bonds for trading`;
    case "yield-chart":
      return `${baseAlt} - ${context} yield performance chart and analytics`;
    case "bond-maturity":
      return `${baseAlt} - ${context} bond maturity timeline and redemption information`;
    default:
      return `${baseAlt} - ${context} ${additionalInfo || ""}`.trim();
  }
};

export const generateImageTitle = (
  imageType: string,
  context: string
): string => {
  return `ChronoBond ${imageType} - ${context}`;
};

export const imageConfigs = {
  logo: {
    width: 200,
    height: 200,
    loading: "eager" as const,
    priority: true,
  },
  hero: {
    width: 1200,
    height: 630,
    loading: "eager" as const,
    priority: true,
  },
  card: {
    width: 400,
    height: 300,
    loading: "lazy" as const,
    priority: false,
  },
  thumbnail: {
    width: 150,
    height: 150,
    loading: "lazy" as const,
    priority: false,
  },
  chart: {
    width: 800,
    height: 400,
    loading: "lazy" as const,
    priority: false,
  },
};

export const generateImageSizes = (breakpoints: number[] = [640, 768, 1024, 1280]) => {
  return breakpoints.map((bp, index) => {
    const nextBp = breakpoints[index + 1];
    if (nextBp) {
      return `(max-width: ${bp}px) ${bp}px, (max-width: ${nextBp}px) ${nextBp}px`;
    }
    return `(max-width: ${bp}px) ${bp}px`;
  }).join(", ");
};

export const createSEOImageProps = (
  src: string,
  imageType: string,
  context: string,
  additionalInfo?: string,
  config = imageConfigs.card
): ImageSEOProps => {
  return {
    src,
    alt: generateAltText(imageType, context, additionalInfo),
    title: generateImageTitle(imageType, context),
    width: config.width,
    height: config.height,
    loading: config.loading,
    priority: config.priority,
  };
};
