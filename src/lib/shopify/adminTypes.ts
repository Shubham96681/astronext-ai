export type AdminVariantNode = {
  price: string;
  compareAtPrice: string | null;
  availableForSale: boolean;
};

export type AdminProductNode = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  productType: string;
  status: string;
  featuredImage: { url: string; altText: string | null } | null;
  variants: {
    edges: Array<{ node: AdminVariantNode }>;
  };
};

export type AdminCollectionResponse = {
  data?: {
    collection?: {
      title: string;
      products: {
        edges: Array<{ node: AdminProductNode }>;
      };
    };
  };
  errors?: Array<{ message: string }>;
};

export type AdminProductResponse = {
  data?: {
    product?: AdminProductNode | null;
  };
  errors?: Array<{ message: string }>;
};
