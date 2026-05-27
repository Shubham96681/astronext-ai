export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
};

export type ShopifyCollectionResponse = {
  data?: {
    collection?: {
      title: string;
      products: {
        edges: Array<{ node: ShopifyProductNode }>;
      };
    };
  };
  errors?: Array<{ message: string }>;
};

export type ShopifyProductResponse = {
  data?: {
    product?: ShopifyProductNode | null;
  };
  errors?: Array<{ message: string }>;
};
