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
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  {
    name: "Blog",
    dropdown: [
      { name: "All Posts", href: "/blog" },
      { name: "Categories", href: "/blog/categories" },
      { name: "Write Blog", href: "/blog/create" },
    ],
  },
];
