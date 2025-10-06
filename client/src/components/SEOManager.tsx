import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SEO_CONFIG } from "@/constants/seo";
import { DOMAIN } from "@/config";

const SEOManager = () => {
  const { pathname } = useLocation();
  const seo = SEO_CONFIG[pathname] || {
    title: "InstaSip - Tea & Coffee Made Instantly",
    description:
      "InstaSip brings you eco-friendly ready-to-use tea and coffee cups. Just add hot water and enjoy fresh, natural taste instantly.",
    path: `${DOMAIN}${pathname}`,
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.path} />

      {/* Optional Open Graph + Twitter meta */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.path} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
    </Helmet>
  );
};

export default SEOManager;
