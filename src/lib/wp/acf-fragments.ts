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
      badge
      videoUrl
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbFeaturesSectionLayout {
      heading
      description
      columns
      variant
      colorVariation
      image {
        node {
          ${imageNodeFields}
        }
      }
      ctaText
      ctaUrl
      items {
        image {
          node {
            ${imageNodeFields}
          }
        }
        title
        description
        link
      }
    }
    ... on AcfFieldsFlexibleContentFbCtaSectionLayout {
      heading
      description
      buttonText
      buttonUrl
      button2Text
      button2Url
      variant
      colorVariation
      image {
        node {
          ${imageNodeFields}
        }
      }
      iconItems {
        icon
        title
        description
        link
      }
      cards {
        title
        description
        value
        buttonText
        buttonUrl
        image {
          node {
            ${imageNodeFields}
          }
        }
      }
      tableRows {
        label
        value
        change
        buttonText
        buttonUrl
      }
      tabs {
        label
        description
        buttonText
        buttonUrl
        features
      }
      formAction
      placeholder
      privacyText
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
      videoUrl
      images {
        nodes {
          ${imageNodeFields}
        }
      }
      bodyRight
      contentStats {
        value
        label
      }
      contentCards {
        title
        description
        image {
          node {
            ${imageNodeFields}
          }
        }
      }
      contentFeatures {
        text
      }
      ctaText
      ctaUrl
    }
    ... on AcfFieldsFlexibleContentFbTestimonialsSectionLayout {
      heading
      description
      variant
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
      variant
      colorVariation
    }
    ... on AcfFieldsFlexibleContentFbTeamSectionLayout {
      heading
      description
      variant
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
      variant
      colorVariation
      image {
        node {
          ${imageNodeFields}
        }
      }
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
      subtitle
      ctaText
      ctaUrl
      image {
        node {
          ${imageNodeFields}
        }
      }
      images {
        nodes {
          ${imageNodeFields}
        }
      }
    }
    ... on AcfFieldsFlexibleContentFbCustomerLogosSectionLayout {
      heading
      description
      variant
      colorVariation
      logos {
        name
        url
        since
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
