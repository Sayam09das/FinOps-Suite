export type NavDropdownItem = {
  name: string;
  href: string;
};

export type NavItem = {
  name: string;
  href?: string;
  dropdown?: NavDropdownItem[];
};

export const navLinks: NavItem[] = [
  { name: "Home", href: "/" },

  {
    name: "Product",
    href: "/product",
    dropdown: [
      { name: "Overview", href: "/product" },
      { name: "Reconciliation", href: "/product/reconciliation" },
      { name: "Forecasting", href: "/product/forecasting" },
      { name: "Close Management", href: "/product/close" },
      { name: "Reporting", href: "/product/reporting" },
      { name: "Integrations", href: "/integrations" },
    ],
  },

  { name: "Pricing", href: "/pricing" },

  {
    name: "Blog",
    href: "/blog",
    dropdown: [
      { name: "All Posts", href: "/blog" },
      { name: "Categories", href: "/blog/categories" },
    ],
  },

  { name: "About", href: "/about" },
];