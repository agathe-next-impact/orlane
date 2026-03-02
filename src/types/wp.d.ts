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
  fieldGroupName: string;
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

export type WPFlexibleContent =
  | WPACFHeroSection
  | WPACFContentBlock
  | WPACFImageGallery;

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
