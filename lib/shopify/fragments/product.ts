import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    metafields(
      identifiers: [
        { key: "herkunft", namespace: "custom" }
        { key: "region", namespace: "custom" }
        { key: "hersteller", namespace: "custom" }
        { key: "veredelung", namespace: "custom" }
        { key: "farbe", namespace: "custom" }
        { key: "inhalt", namespace: "custom" }
        { key: "slogan", namespace: "custom" }
        { key: "zutaten_allergene", namespace: "custom" }
        { key: "kakaogehalt", namespace: "custom" }
        { key: "zubereitungsempfehlung", namespace: "custom" }
        { key: "aufbereitung", namespace: "custom" }
        { key: "anbauhoehe_start", namespace: "custom" }
        { key: "anbauhoehe_ende", namespace: "custom" }
        { key: "strength", namespace: "custom" }
        { key: "charakter", namespace: "custom" }
      ]
    ) {
      key
      value
    }
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          sku
          weight
          weightUnit
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
