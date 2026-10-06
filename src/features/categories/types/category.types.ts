export interface CategoryParent {
  _id: string;
  name: string;
  slug: string;
}

/** Matches kb-newspaper-server's Category model (models/category.model.js). */
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: CategoryParent | string | null; // Populated object or ObjectId or null
  isFeatured: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  children?: Category[];
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  parent?: string | null;
  isFeatured?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryInput {
  name: string;
  slug?: string;
  parent?: string | null;
  isFeatured?: boolean;
  sortOrder?: number;
}

