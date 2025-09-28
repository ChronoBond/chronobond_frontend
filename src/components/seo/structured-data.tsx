"use client";

import { generateStructuredData } from "@/lib/metadata-utils";

interface StructuredDataProps {
  page: string;
}

export const StructuredData = ({ page }: StructuredDataProps) => {
  const structuredData = generateStructuredData(page);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};

// Breadcrumb structured data
export const BreadcrumbStructuredData = ({ items }: { items: Array<{ name: string; url: string }> }) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData),
      }}
    />
  );
};

// FAQ structured data
export const FAQStructuredData = ({ faqs }: { faqs: Array<{ question: string; answer: string }> }) => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  );
};

// Organization structured data
export const OrganizationStructuredData = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ChronoBond",
    description: "DeFi platform for time-locked bonds on Flow blockchain",
    url: "https://chronobond.com",
    logo: "https://chronobond.com/logo.png",
    sameAs: [
      "https://twitter.com/ChronoBond",
      "https://github.com/ChronoBond",
      "https://discord.gg/chronobond",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData),
      }}
    />
  );
};
