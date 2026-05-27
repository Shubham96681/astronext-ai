export const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($id: ID!, $first: Int!) {
    collection(id: $id) {
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_ID_QUERY = `
  query ProductById($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      description
      productType
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;
