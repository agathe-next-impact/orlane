export interface WPThemeSettings {
  logo: WPImage | null;
  logoFooter: WPImage | null;
  colorBeige: string | null;
  colorCreme: string | null;
  colorTaupe: string | null;
  colorSauge: string | null;
  colorMousse: string | null;
  variation1Bg: string | null;
  variation1Title: string | null;
  variation1Text: string | null;
  variation2Bg: string | null;
  variation2Title: string | null;
  variation2Text: string | null;
  variation3Bg: string | null;
  variation3Title: string | null;
  variation3Text: string | null;
  contentWidth: string;
  fontBody: string | null;
  fontHeading: string | null;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialLinkedin: string | null;
  socialTiktok: string | null;
  socialYoutube: string | null;
  footerText: string | null;
}

export interface WPImage {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
}

export interface WPFeaturedImage {
  node: WPImage;
}

export interface WPAuthor {
  node: {
    name: string;
    avatar?: {
      url: string;
    };
  };
}

export interface WPCategory {
  name: string;
  slug: string;
}

export interface WPTag {
  name: string;
  slug: string;
}

export interface WPSEO {
  title?: string;
  metaDesc?: string;
  opengraphImage?: {
    sourceUrl: string;
  };
}

export interface WPACFBase {
  __typename?: string;
  fieldGroupName?: string;
}

export interface WPACFHeroSection extends WPACFBase {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface WPACFContentBlock extends WPACFBase {
  content?: string;
  layout?: 'left' | 'right' | 'center';
}

export interface WPACFImageGallery extends WPACFBase {
  images?: WPImage[];
}

// --- Flowbite Block Types ---

export interface WPACFFbHeroSection extends WPACFBase {
  heading?: string;
  highlight?: string;
  description?: string;
  image?: WPImage;
  ctaText?: string;
  ctaUrl?: string;
  cta2Text?: string;
  cta2Url?: string;
  variant?: 'centered' | 'image_right' | 'image_left' | 'fullscreen' | 'video' | 'cover_split';
  badge?: string;
  videoUrl?: string;
}

export interface WPACFFbFeatureItem {
  icon?: string;
  title?: string;
  description?: string;
  link?: string;
}

export interface WPACFFbFeaturesSection extends WPACFBase {
  heading?: string;
  description?: string;
  items?: WPACFFbFeatureItem[];
  columns?: '2' | '3' | '4';
  variant?: 'default' | 'image_right' | 'image_left' | 'with_ctas' | 'checklist' | 'icons_cta' | 'split_description' | 'cards' | 'alternating' | 'rounded_icons' | 'centered' | 'numbered' | 'two_col_large' | 'dark' | 'horizontal' | 'icon_cards';
  image?: WPImage;
  ctaText?: string;
  ctaUrl?: string;
}

export interface WPACFFbCtaCardItem {
  image?: WPImage;
  title?: string;
  description?: string;
  value?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface WPACFFbCtaIconItem {
  icon?: string;
  title?: string;
  description?: string;
  link?: string;
}

export interface WPACFFbCtaTabItem {
  label?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  features?: string[];
}

export interface WPACFFbCtaTableRow {
  label?: string;
  value?: string;
  change?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface WPACFFbCtaSection extends WPACFBase {
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  button2Text?: string;
  button2Url?: string;
  variant?: 'default' | 'with_image' | 'centered' | 'qr_code' | 'icon_cards' | 'table_cta' | 'newsletter' | 'app_download' | 'image_cards' | 'tabs_mobile' | 'dark';
  image?: WPImage;
  iconItems?: WPACFFbCtaIconItem[];
  cards?: WPACFFbCtaCardItem[];
  tableRows?: WPACFFbCtaTableRow[];
  tabs?: WPACFFbCtaTabItem[];
  formAction?: string;
  placeholder?: string;
  privacyText?: string;
}

export interface WPACFFbContentCardItem {
  image?: WPImage;
  title?: string;
  description?: string;
}

export interface WPACFFbContentStatItem {
  value?: string;
  label?: string;
}

export interface WPACFFbContentFeatureItem {
  text?: string;
}

export interface WPACFFbContentSection extends WPACFBase {
  heading?: string;
  body?: string;
  image?: WPImage;
  layout?: 'text_only' | 'image_right' | 'image_left' | 'video' | 'gallery' | 'two_columns' | 'social_proof' | 'cards' | 'features_list';
  videoUrl?: string;
  images?: WPImage[];
  bodyRight?: string;
  contentStats?: WPACFFbContentStatItem[];
  contentCards?: WPACFFbContentCardItem[];
  contentFeatures?: WPACFFbContentFeatureItem[];
  ctaText?: string;
  ctaUrl?: string;
}

export interface WPACFFbTestimonialItem {
  quote?: string;
  author?: string;
  role?: string;
  avatar?: WPImage;
  rating?: number;
}

export interface WPACFFbTestimonialsSection extends WPACFBase {
  heading?: string;
  description?: string;
  items?: WPACFFbTestimonialItem[];
  variant?: 'blockquote' | 'cards' | 'tabs' | 'carousel' | 'grid';
}

export interface WPACFFbPlanFeature {
  text?: string;
  included?: boolean;
}

export interface WPACFFbPlan {
  name?: string;
  price?: string;
  period?: string;
  description?: string;
  features?: WPACFFbPlanFeature[];
  ctaText?: string;
  ctaUrl?: string;
  highlighted?: boolean;
}

export interface WPACFFbPricingSection extends WPACFBase {
  heading?: string;
  description?: string;
  plans?: WPACFFbPlan[];
}

export interface WPACFFbFaqItem {
  question?: string;
  answer?: string;
}

export interface WPACFFbFaqSection extends WPACFBase {
  heading?: string;
  description?: string;
  variant?: 'default' | 'search_links' | 'side_description' | 'accordion' | 'three_columns' | 'help_center' | 'cards';
  items?: WPACFFbFaqItem[];
}

export interface WPACFFbTeamMember {
  name?: string;
  role?: string;
  bio?: string;
  photo?: WPImage;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface WPACFFbTeamSection extends WPACFBase {
  heading?: string;
  description?: string;
  members?: WPACFFbTeamMember[];
  variant?: 'default' | 'grid';
}

export interface WPACFFbContactSection extends WPACFBase {
  heading?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  formAction?: string;
  showMap?: boolean;
  mapEmbed?: string;
}

export interface WPACFFbNewsletterSection extends WPACFBase {
  heading?: string;
  description?: string;
  formAction?: string;
  placeholder?: string;
  buttonText?: string;
  privacyText?: string;
  variant?: 'default' | 'card' | 'banner' | 'popup' | 'modal';
  image?: WPImage;
}

export interface WPACFFbStatItem {
  value?: string;
  label?: string;
  description?: string;
}

export interface WPACFFbStatsSection extends WPACFBase {
  heading?: string;
  description?: string;
  items?: WPACFFbStatItem[];
  variant?: 'light' | 'dark' | 'accent';
}

export interface WPACFFbGallerySection extends WPACFBase {
  heading?: string;
  images?: WPImage[];
  columns?: '2' | '3' | '4';
  style?: 'grid' | 'masonry';
}

export interface WPACFFbSocialProofItem {
  value?: string;
  label?: string;
  description?: string;
}

export interface WPACFFbSocialProofSection extends WPACFBase {
  heading?: string;
  description?: string;
  items?: WPACFFbSocialProofItem[];
  variant?: 'cards' | 'inline' | 'with_background' | 'illustration' | 'carousel' | 'icons_cta';
  image?: WPImage;
  images?: WPImage[];
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface WPACFFbCustomerLogo {
  name?: string;
  image?: WPImage;
  url?: string;
  since?: string;
}

export interface WPACFFbCustomerLogosSection extends WPACFBase {
  heading?: string;
  description?: string;
  logos?: WPACFFbCustomerLogo[];
  variant?: 'grid' | 'banner' | 'with_cta' | 'cards';
}

export interface WPACFFbBlogPost {
  title?: string;
  excerpt?: string;
  image?: WPImage;
  url?: string;
  category?: string;
  author?: string;
  authorAvatar?: WPImage;
  date?: string;
}

export interface WPACFFbBlogSection extends WPACFBase {
  heading?: string;
  description?: string;
  posts?: WPACFFbBlogPost[];
  ctaText?: string;
  ctaUrl?: string;
  variant?: 'cards' | 'list' | 'featured' | 'centered' | 'cards_image';
}

export interface WPACFFbPortfolioProject {
  title?: string;
  description?: string;
  image?: WPImage;
  url?: string;
  category?: string;
}

export interface WPACFFbPortfolioSection extends WPACFBase {
  heading?: string;
  description?: string;
  projects?: WPACFFbPortfolioProject[];
  ctaText?: string;
  ctaUrl?: string;
  variant?: 'cards' | 'minimal' | 'masonry';
}

export interface WPACFFbBannerSection extends WPACFBase {
  text?: string;
  icon?: string;
  ctaText?: string;
  ctaUrl?: string;
  dismissible?: boolean;
  variant?: 'top' | 'bottom' | 'info';
}

export interface WPACFFbEvent {
  title?: string;
  date?: string;
  time?: string;
  description?: string;
  location?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface WPACFFbEventScheduleSection extends WPACFBase {
  heading?: string;
  description?: string;
  events?: WPACFFbEvent[];
  variant?: 'timeline' | 'cards' | 'table';
}

// --- Standalone component types (not flexible content) ---

export interface WPACFFbFooterLink {
  label?: string;
  url?: string;
}

export interface WPACFFbFooterColumn {
  title?: string;
  links?: WPACFFbFooterLink[];
}

export interface WPACFFbFooterSocialLink {
  platform?: string;
  url?: string;
  icon?: string;
}

export interface WPACFFbFooterAddress {
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface WPACFFbFooterSection extends WPACFBase {
  logo?: WPImage;
  logoAlt?: string;
  description?: string;
  columns?: WPACFFbFooterColumn[];
  copyright?: string;
  socialLinks?: WPACFFbFooterSocialLink[];
  navLinks?: WPACFFbFooterLink[];
  addresses?: WPACFFbFooterAddress[];
  newsletterHeading?: string;
  newsletterDescription?: string;
  ctaText?: string;
  ctaUrl?: string;
  cta2Text?: string;
  cta2Url?: string;
  variant?: 'columns' | 'simple' | 'with_newsletter' | 'default' | 'addresses' | 'pre_footer_cta' | 'sitemap_centered';
}

export interface WPACFFbCookieConsent extends WPACFBase {
  message?: string;
  acceptText?: string;
  declineText?: string;
  privacyUrl?: string;
  variant?: 'bottom_bar' | 'modal' | 'floating';
}

export interface WPACFFbPopup extends WPACFBase {
  heading?: string;
  description?: string;
  image?: WPImage;
  ctaText?: string;
  ctaUrl?: string;
  cta2Text?: string;
  cta2Url?: string;
  variant?: 'centered' | 'with_image';
}

export interface WPACFFbErrorPage extends WPACFBase {
  code?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  variant?: 'centered' | 'illustration' | 'maintenance';
}

export interface WPACFFbAuthForm extends WPACFBase {
  heading?: string;
  description?: string;
  formAction?: string;
  logo?: WPImage;
  forgotPasswordUrl?: string;
  registerUrl?: string;
  loginUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
  variant?: 'login' | 'register' | 'reset_password';
}

export interface WPACFFbOnboardingStep {
  icon?: string;
  title?: string;
  description?: string;
}

export interface WPACFFbOnboarding extends WPACFBase {
  heading?: string;
  description?: string;
  steps?: WPACFFbOnboardingStep[];
  variant?: 'horizontal' | 'vertical' | 'cards';
}

export interface WPACFFbHeroHomepage extends WPACFBase {
  heading?: string;
  highlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  cta2Text?: string;
  cta2Url?: string;
  images?: WPImage[];
  showHeartAnimation?: boolean;
}

export type WPFlexibleContent =
  | WPACFHeroSection
  | WPACFContentBlock
  | WPACFImageGallery
  | WPACFFbHeroSection
  | WPACFFbHeroHomepage
  | WPACFFbFeaturesSection
  | WPACFFbCtaSection
  | WPACFFbContentSection
  | WPACFFbTestimonialsSection
  | WPACFFbPricingSection
  | WPACFFbFaqSection
  | WPACFFbTeamSection
  | WPACFFbContactSection
  | WPACFFbNewsletterSection
  | WPACFFbStatsSection
  | WPACFFbGallerySection
  | WPACFFbSocialProofSection
  | WPACFFbCustomerLogosSection
  | WPACFFbBlogSection
  | WPACFFbPortfolioSection
  | WPACFFbBannerSection
  | WPACFFbEventScheduleSection;

export interface WPPost {
  id: string;
  title: string;
  content?: string;
  slug: string;
  excerpt?: string;
  date: string;
  modified: string;
  featuredImage?: WPFeaturedImage;
  author?: WPAuthor;
  categories?: {
    nodes: WPCategory[];
  };
  tags?: {
    nodes: WPTag[];
  };
  seo?: WPSEO;
  acfFields?: WPACFBase & {
    [key: string]: any;
  };
}

export interface WPPage {
  id: string;
  title: string;
  content?: string;
  slug: string;
  modified: string;
  featuredImage?: WPFeaturedImage;
  seo?: WPSEO;
  acfFields?: WPACFBase & {
    [key: string]: any;
  };
}

export interface WPProject {
  id: string;
  title: string;
  content?: string;
  slug: string;
  excerpt?: string;
  date: string;
  modified: string;
  featuredImage?: WPFeaturedImage;
  seo?: WPSEO;
  acfFields?: {
    fieldGroupName: string;
    clientName?: string;
    projectUrl?: string;
    flexibleContent?: WPFlexibleContent[];
    [key: string]: any;
  };
}

export interface WPPostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  modified: string;
  featuredImage?: WPFeaturedImage;
  author?: WPAuthor;
  categories?: {
    nodes: WPCategory[];
  };
}

export interface WPPagePreview {
  id: string;
  title: string;
  slug: string;
  modified: string;
}

export interface WPProjectPreview {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  modified: string;
  featuredImage?: WPFeaturedImage;
}

export interface WPMenu {
  id: string;
  name: string;
  slug: string;
  locations: string[];
}

export interface WPMenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId: string | null;
  order: number;
  childItems?: {
    nodes: WPMenuItem[];
  };
}
