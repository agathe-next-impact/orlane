/**
 * GraphQL fragments for ACF Flowbite flexible content blocks.
 * Compatible with WPGraphQL for ACF v2 type naming convention.
 *
 * v2 differences from v1:
 * - Layout types: AcfFieldsFlexibleContent{LayoutName}Layout (no Page_/Project_ prefix)
 * - No fieldGroupName on layouts — use __typename instead
 * - Single image fields: image { node { sourceUrl altText mediaDetails { width height } } }
 * - Gallery fields: images { nodes { sourceUrl altText mediaDetails { width height } } }
 */

const imageNodeFields = `
  sourceUrl
  altText
  mediaDetails {
    width
    height
  }
`;

export const flexibleContentFragment = `
  flexibleContent {
    __typename
    ... on AcfFieldsFlexibleContentFbHeroSectionLayout {
      heading
      highlight
      description
      image {
        node {
          ${imageNodeFields}
        }
      }
      ctaText
      ctaUrl
      cta2Text
      cta2Url
      variant
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbFeaturesSectionLayout {
      heading
      description
      columns
      colorVariation
      items {
        icon
        title
        description
      }
    }
    ... on AcfFieldsFlexibleContentFbCtaSectionLayout {
      heading
      description
      buttonText
      buttonUrl
      variant
      colorVariation
      image {
        node {
          ${imageNodeFields}
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbContentSectionLayout {
      heading
      body
      layout
      colorVariation
      image {
        node {
          ${imageNodeFields}
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbTestimonialsSectionLayout {
      heading
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbPricingSectionLayout {
      heading
      description
      colorVariation
      plans {
        name
        price
        period
        description
        highlighted
        ctaText
        ctaUrl
        features {
          text
          included
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbFaqSectionLayout {
      heading
      description
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbTeamSectionLayout {
      heading
      description
      colorVariation
      members {
        name
        role
        bio
        photo {
          node {
            ${imageNodeFields}
          }
        }
        social {
          linkedin
          twitter
          email
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbContactSectionLayout {
      heading
      description
      email
      phone
      address
      formAction
      showMap
      mapEmbed
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbNewsletterSectionLayout {
      heading
      description
      formAction
      placeholder
      buttonText
      privacyText
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbStatsSectionLayout {
      heading
      description
      variant
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbGallerySectionLayout {
      heading
      columns
      style
      colorVariation
      images {
        nodes {
          ${imageNodeFields}
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbSocialProofSectionLayout {
      heading
      description
      variant
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbCustomerLogosSectionLayout {
      heading
      description
      variant
      colorVariation
      logos {
        name
        url
        image {
          node {
            ${imageNodeFields}
          }
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbBlogSectionLayout {
      heading
      description
      ctaText
      ctaUrl
      variant
      colorVariation
      posts {
        title
        excerpt
        url
        category
        author
        date
        image {
          node {
            ${imageNodeFields}
          }
        }
        authorAvatar {
          node {
            ${imageNodeFields}
          }
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbPortfolioSectionLayout {
      heading
      description
      ctaText
      ctaUrl
      variant
      colorVariation
      projects {
        title
        description
        url
        category
        image {
          node {
            ${imageNodeFields}
          }
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbBannerSectionLayout {
      text
      icon
      ctaText
      ctaUrl
      dismissible
      variant
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbEventScheduleSectionLayout {
      heading
      description
      variant
      colorVariation
      events {
        title
        date
        time
        description
        location
        ctaText
        ctaUrl
      }
    }
    ... on AcfFieldsFlexibleContentFbHeroHomepageLayout {
      heading
      highlight
      subtitle
      ctaText
      ctaUrl
      cta2Text
      cta2Url
      images {
        nodes {
          ${imageNodeFields}
        }
      }
      showHeartAnimation
      colorVariation
    }
  }
`;

/**
 * In WPGraphQL for ACF v2, the layout types are shared across all post types
 * (no Page_/Project_ prefix), so we use the same fragment for all.
 */
export const flexibleContentFragmentProject = flexibleContentFragment;
