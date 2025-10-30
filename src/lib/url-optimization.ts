export interface SEOUrlConfig {
  baseUrl: string;
  protocol: "https" | "http";
  www: boolean;
  trailingSlash: boolean;
}

export const defaultSEOConfig: SEOUrlConfig = {
  baseUrl: "chronobond.com",
  protocol: "https",
  www: false,
  trailingSlash: false,
};

export const generateSEOUrl = (
  path: string,
  config: SEOUrlConfig = defaultSEOConfig
): string => {
  const protocol = config.protocol;
  const www = config.www ? "www." : "";
  const baseUrl = config.baseUrl;
  const trailingSlash = config.trailingSlash ? "/" : "";
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const finalPath = config.trailingSlash && !cleanPath.endsWith("/") 
    ? `${cleanPath}/` 
    : cleanPath;
  
  return `${protocol}://${www}${baseUrl}${finalPath}`;
};

export const generateCanonicalUrl = (path: string): string => {
  return generateSEOUrl(path, {
    ...defaultSEOConfig,
    www: false,
    trailingSlash: false,
  });
};

export const generateBreadcrumbUrls = (paths: string[]): string[] => {
  return paths.map((_, index) => {
    const currentPath = paths.slice(0, index + 1).join("/");
    return generateCanonicalUrl(currentPath);
  });
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const generatePageTitle = (
  pageName: string,
  siteName: string = "ChronoBond",
  separator: string = " | "
): string => {
  return `${pageName}${separator}${siteName}`;
};

export const generateMetaDescription = (
  action: string,
  context: string,
  benefits: string[] = []
): string => {
  const baseDescription = `${action} ${context} on ChronoBond DeFi platform`;
  const benefitsText = benefits.length > 0 
    ? `. ${benefits.join(", ")}` 
    : "";
  
  return `${baseDescription}${benefitsText}. Secure, decentralized, and automated yield generation on Flow blockchain.`;
};

export const generateStructuredDataUrls = () => {
  return {
    organization: generateCanonicalUrl("/"),
    website: generateCanonicalUrl("/"),
    webApplication: generateCanonicalUrl("/"),
    breadcrumbList: generateCanonicalUrl("/"),
    faqPage: generateCanonicalUrl("/faq"),
    contactPage: generateCanonicalUrl("/contact"),
  };
};
