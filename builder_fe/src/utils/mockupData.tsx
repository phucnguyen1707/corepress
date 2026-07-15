import { FooterSessionIcon, HeaderSectionIcon, TemplateSessionIcon } from '@/icons';

// The catalogue for the "Add Section" modal: which sections exist, and how they read to the user.
//
// It used to embed a full, hand-kept COPY of every section's HTML and CSS for the hover preview.
// That copy drifted from the real templates the moment they were rethemed — so the preview showed
// one design and clicking inserted another — and it also listed ~20 body sections that had no
// backend file at all, so clicking them failed with a 400. Both are gone: this is metadata only, the
// preview and the insert now both come from the real files (GET /templates), and every entry here
// maps to a real `assets/templates/<kind>/<kind><index>` on the server.

export interface SectionMeta {
  id: string; // `${kind}-${index}` — the index keys the real template file on the backend
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

export const allSections: Record<string, SectionMeta[]> = {
  header: [
    { id: 'header-1', name: 'Header: Announcement bar', description: 'Thin announcement bar above header for promos.', category: 'Header', icon: <HeaderSectionIcon /> },
    { id: 'header-2', name: 'Header: Logo left + Search center', description: 'Logo left, search bar center, icons right', category: 'Header', icon: <HeaderSectionIcon /> },
    { id: 'header-3', name: 'Header: Stacked (mobile-first)', description: 'Compact stacked header for mobile and small screens', category: 'Header', icon: <HeaderSectionIcon /> },
    { id: 'header-4', name: 'Header: Announcement + Search', description: 'Announcement bar + large centered search (good for marketplaces)', category: 'Header', icon: <HeaderSectionIcon /> },
    { id: 'header-5', name: 'Header: Mega menu (desktop)', description: 'Header with hover mega menu area', category: 'Header', icon: <HeaderSectionIcon /> },
  ],

  template: [
    { id: 'template-1', name: 'Hero: Large banner', description: 'Classic large hero with text left & image right', category: 'Banners', icon: <TemplateSessionIcon /> },
    { id: 'template-2', name: 'Hero: Bottom aligned', description: 'Hero with content anchored at bottom of image', category: 'Banners', icon: <TemplateSessionIcon /> },
    { id: 'template-3', name: 'Hero: Marquee', description: 'Scrolling marquee headline over a banner', category: 'Banners', icon: <TemplateSessionIcon /> },
    { id: 'template-4', name: 'Large logo / Brand list', description: 'Row of partner or brand logos', category: 'Logos', icon: <TemplateSessionIcon /> },
    { id: 'template-5', name: 'Slideshow', description: 'Auto-rotating slideshow with pause & dots (no JS needed)', category: 'Banners', icon: <TemplateSessionIcon /> },
    { id: 'template-6', name: 'Features: Icon grid', description: 'A grid of feature cards with icons', category: 'Features', icon: <TemplateSessionIcon /> },
    { id: 'template-7', name: 'Pricing: Three tiers', description: 'Three pricing plans with a highlighted recommendation', category: 'Pricing', icon: <TemplateSessionIcon /> },
    { id: 'template-8', name: 'Testimonials: Quote cards', description: 'Customer quotes with names and avatars', category: 'Social proof', icon: <TemplateSessionIcon /> },
    { id: 'template-9', name: 'FAQ: Accordion', description: 'Expandable questions and answers (no JS needed)', category: 'Text', icon: <TemplateSessionIcon /> },
    { id: 'template-10', name: 'CTA: Call to action band', description: 'A bold headline with a primary action', category: 'Call to action', icon: <TemplateSessionIcon /> },
    { id: 'template-11', name: 'Contact: Form', description: 'A contact form with name, email and message', category: 'Forms', icon: <TemplateSessionIcon /> },
  ],

  footer: [
    { id: 'footer-1', name: 'Footer: Minimal', description: 'Simple centered copyright footer', category: 'Footer', icon: <FooterSessionIcon /> },
    { id: 'footer-2', name: 'Footer: 3 Columns', description: 'Classic 3-column footer with links and newsletter', category: 'Footer', icon: <FooterSessionIcon /> },
    { id: 'footer-3', name: 'Footer: Social & payments', description: 'Footer with social icons and payment logos', category: 'Footer', icon: <FooterSessionIcon /> },
    { id: 'footer-4', name: 'Footer: Full (links + newsletter + socials)', description: 'Comprehensive footer with many links and newsletter', category: 'Footer', icon: <FooterSessionIcon /> },
    { id: 'footer-5', name: 'Footer: Payments & small print', description: 'Payment icons with terms and small print', category: 'Footer', icon: <FooterSessionIcon /> },
  ],
};
