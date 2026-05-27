/** Admin API GraphQL — uses read_products / read_inventory scopes */

export const ADMIN_COLLECTION_PRODUCTS_QUERY = `
  query AdminCollectionProducts($id: ID!, $first: Int!) {
    collection(id: $id) {
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            productType
            status
            featuredImage {
              url
              altText
            }
            variants(first: 1) {
              edges {
                node {
                  price
                  compareAtPrice
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const ADMIN_PRODUCT_BY_ID_QUERY = `
  query AdminProductById($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      descriptionHtml
      productType
      status
      featuredImage {
        url
        altText
      }
      variants(first: 5) {
        edges {
          node {
            price
            compareAtPrice
            availableForSale
          }
        }
      }
    }
  }
`;
