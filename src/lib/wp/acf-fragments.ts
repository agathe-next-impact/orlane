/**
 * GraphQL fragments for ACF Flowbite flexible content blocks.
 * Compatible with WPGraphQL for ACF v2 type naming convention.
 *
 * v2 differences from v1:
 * - Layout types: AcfFieldsFlexibleContent{LayoutName}Layout (no Page_/Project_ prefix)
 * - No fieldGroupName on layouts — use __typename instead
 * - Single image fields: image { node { sourceUrl altText mediaDetails { width height } } }
 * - Gallery fields: images { nodes { sourceUrl altText mediaDetails { width height } } }
 * - Link fields return { url title target } objects (ACF link type)
 */

const imageNodeFields = `
  sourceUrl
  altText
  mediaDetails {
    width
    height
  }
`;

const linkFields = `{
  url
  title
  target
}`;

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
      ctaUrl ${linkFields}
      cta2Url ${linkFields}
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
      headerImage {
        node {
          ${imageNodeFields}
        }
      }
      image {
        node {
          ${imageNodeFields}
        }
      }
      ctaUrl ${linkFields}
      items {
        image {
          node {
            ${imageNodeFields}
          }
        }
        icon
        title
        subtitle
        description
        link ${linkFields}
        ctaUrl ${linkFields}
      }
    }
    ... on AcfFieldsFlexibleContentFbCtaSectionLayout {
      heading
      description
      buttonUrl ${linkFields}
      button2Url ${linkFields}
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
        link ${linkFields}
      }
      cards {
        title
        description
        value
        buttonUrl ${linkFields}
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
        buttonUrl ${linkFields}
      }
      tabs {
        label
        description
        buttonUrl ${linkFields}
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
      ctaUrl ${linkFields}
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
        ctaUrl ${linkFields}
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
          linkedin ${linkFields}
          twitter ${linkFields}
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
      ctaUrl ${linkFields}
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
        url ${linkFields}
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
      ctaUrl ${linkFields}
      variant
      colorVariation
      posts {
        title
        excerpt
        url ${linkFields}
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
      ctaUrl ${linkFields}
      variant
      colorVariation
      projects {
        title
        description
        url ${linkFields}
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
      ctaUrl ${linkFields}
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
        ctaUrl ${linkFields}
      }
    }
    ... on AcfFieldsFlexibleContentFbHeroHomepageLayout {
      heading
      highlight
      subtitle
      ctaUrl ${linkFields}
      cta2Url ${linkFields}
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
