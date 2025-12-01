import { SectionInterface } from '@/components/modal/AddSection/AddSection';
import { TemplateSessionIcon } from '@/icons';

// chèn vào file của bạn (bên trên component)
export const allSections: Record<string, SectionInterface[]> = {
  // ---------- HEADER (5 items) ----------
  header: [
    {
      id: 'header-announcement',
      name: 'Header: Announcement bar',
      description: 'Thin announcement bar above header for promos.',
      category: 'Header',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="header-1">
        <div class="hdr-announce">
          <div class="container">
            <p>Free shipping on orders over $75 — Use code: FREESHIP</p>
            <button class="announce-close" aria-label="Close">✕</button>
          </div>
        </div>
        <div class="hdr-main">
          <div class="container hdr-inner">
            <div class="logo">Brand</div>
            <nav class="nav"> <a>Home</a><a>Shop</a><a>Collections</a> </nav>
            <div class="hdr-actions"><button>Search</button><button>Cart</button></div>
          </div>
        </div>
      </div>
      `,
      css: `
      .header-1 {display:flex; flex-direction:column; 
        .hdr-announce { background:#111; color:#fff; font-size:14px; }
        .hdr-announce .container{ display:flex; justify-content:space-between; align-items:center; padding:8px 16px; max-width:1200px; margin:0 auto; }
        .announce-close{ background:transparent; color:#fff; border:none; cursor:pointer; font-size:14px; }

        /* main header */
        .hdr-main{ background:#fff; border-bottom:1px solid rgba(0,0,0,0.06); }
        .hdr-main .hdr-inner{ display:flex; align-items:center; justify-content:space-between; padding:18px 16px; max-width:1200px; margin:0 auto; }
        .logo{ font-weight:700; font-size:20px; }
        .nav{ display:flex; gap:18px; }
        .nav a{ cursor:pointer; font-size:15px; color:#222; }
        .hdr-actions button{ margin-left:8px; padding:8px 12px; border-radius:8px; border:1px solid rgba(0,0,0,0.06); background:#fff; cursor:pointer; }

        /* responsive */
        @media (max-width:800px){ .nav{ display:none; } .hdr-inner{ padding:14px; } }
      }`,
    },

    {
      id: 'header-logo-left-search',
      name: 'Header: Logo left + Search center',
      description: 'Logo left, search bar center, icons right',
      category: 'Header',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="header-2">
        <div class="hdr-search-inner">
          <div class="logo">Brand</div>

          <div class="search-wrap">
            <input
              type="text"
              placeholder="Search products, categories…"
              aria-label="Search"
            />
          </div>

          <div class="icons">
            <button class="icon-btn">Account</button>
            <button class="icon-btn">Cart</button>
          </div>
        </div>
      </div>
      `,
      css: `
      .header-2{background:#fff;border-bottom:1px solid rgba(0,0,0,0.06);position:sticky;top:0;z-index:20;
        .hdr-search-inner{display:flex;align-items:center;gap:24px;padding:16px 24px;max-width:1280px;margin:0 auto;}
        .search-wrap{flex:1;display:flex;align-items:center;}
        .search-wrap input{width:100%;padding:12px 16px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);background:#fafafa;transition:all .2s ease;}
        .search-wrap input:focus{outline:none;background:#fff;border-color:rgba(0,0,0,0.2);box-shadow:0 0 0 2px rgba(0,120,255,0.15);}
        .icons{display:flex;align-items:center;gap:12px;}
        .icon-btn{padding:10px 14px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);background:#fff;font-size:14px;cursor:pointer;transition:all .15s ease;}
        .icon-btn:hover{background:rgba(0,0,0,0.04);border-color:rgba(0,0,0,0.12);}
        @media (max-width:700px){.search-wrap{display:none;}}
      }`,
    },

    {
      id: 'header-stacked-logo',
      name: 'Header: Stacked (mobile-first)',
      description: 'Compact stacked header for mobile and small screens',
      category: 'Header',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="header-3">
        <div class="hdr-stacked-top">
          <button class="hamburger" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>

          <div class="logo">Brand</div>

          <div class="mini-actions">
            <button class="icon-btn">Search</button>
            <button class="icon-btn">Cart</button>
          </div>
        </div>
      </div>
      `,
      css: `
      .header-3{background:#fff;border-bottom:1px solid rgba(0,0,0,0.06);position:sticky;top:0;z-index:20;
        .hdr-stacked-top{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;max-width:1280px;margin:0 auto;gap:12px;}
        .logo{font-size:20px;font-weight:700;letter-spacing:-0.3px;}
        .hamburger{width:32px;height:32px;padding:0;display:flex;flex-direction:column;justify-content:center;gap:5px;background:none;border:none;cursor:pointer;}
        .hamburger span{display:block;width:22px;height:2px;background:#000;border-radius:2px;transition:all .2s ease;}
        .mini-actions{display:flex;align-items:center;gap:8px;}
        .icon-btn{padding:8px 12px;border-radius:8px;background:#fff;border:1px solid rgba(0,0,0,0.06);font-size:14px;cursor:pointer;transition:.15s ease;}
        .icon-btn:hover{background:rgba(0,0,0,0.04);}
        @media (min-width:700px){.hdr-stacked-top{padding:16px 24px;}.logo{font-size:22px;}.icon-btn{padding:10px 14px;}}
      }`,
    },

    {
      id: 'header-announcement-search',
      name: 'Header: Announcement + Search',
      description: 'Announcement bar + large centered search (good for marketplaces)',
      category: 'Header',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="header-4">
        <div class="ann-2">
          <div class="container">Limited time: 10% off for new customers</div>
        </div>

        <div class="hdr-large-search">
          <div class="container center">
            <div class="logo">Brand</div>

            <div class="big-search">
              <input placeholder="Search all products..." aria-label="Search" />
              <button class="search-btn">Search</button>
            </div>

            <div class="right-icons">
              <button class="icon-btn">Cart</button>
            </div>
          </div>
        </div>
      </div>
      `,
      css: `
      .header-4{
        .ann-2{background:#f7f7f8;padding:8px 16px;text-align:center;font-size:14px;font-weight:500;color:#333;}
        .hdr-large-search .center{display:flex;align-items:center;gap:20px;padding:20px 16px;max-width:1280px;margin:0 auto;}
        .logo{font-size:22px;font-weight:700;letter-spacing:-0.3px;}
        .big-search{flex:1;display:flex;gap:8px;}
        .big-search input{flex:1;padding:14px 16px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);background:#fafafa;transition:.2s ease;}
        .big-search input:focus{outline:none;background:#fff;border-color:rgba(0,0,0,0.2);box-shadow:0 0 0 2px rgba(0,120,255,0.15);}
        .search-btn{padding:14px 20px;border-radius:8px;background:#000;color:#fff;border:none;font-weight:500;cursor:pointer;transition:.15s ease;}
        .search-btn:hover{background:#222;}
        .right-icons{display:flex;align-items:center;}
        .icon-btn{padding:10px 14px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);background:#fff;cursor:pointer;transition:.15s ease;}
        .icon-btn:hover{background:rgba(0,0,0,0.04);}
        @media(max-width:900px){.big-search{display:none;}.center{justify-content:space-between;}}
      }`,
    },

    {
      id: 'header-mega-menu',
      name: 'Header: Mega menu (desktop)',
      description: 'Header with hover mega menu area',
      category: 'Header',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="header-5">
        <div class="container hdr-mega-inner">
          <div class="logo">Brand</div>

          <nav class="mega-nav">
            <div class="nav-item">Shop
              <div class="mega-panel">
                <div class="col">
                  <h4>New</h4>
                  <a href="#">Item 1</a>
                  <a href="#">Item 2</a>
                </div>

                <div class="col">
                  <h4>Collections</h4>
                  <a href="#">Collection A</a>
                  <a href="#">Collection B</a>
                </div>

                <div class="col">
                  <h4>Featured</h4>
                  <a href="#">Best Seller</a>
                </div>
              </div>
            </div>

            <div class="nav-item">About</div>
          </nav>

          <div class="right"><button class="icon-btn">Cart</button></div>
        </div>
      </div>
      `,
      css: `
      .header-5{background:#fff;border-bottom:1px solid rgba(0,0,0,0.06);position:sticky;top:0;z-index:30;
        .hdr-mega-inner{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;max-width:1280px;margin:0 auto;}
        .logo{font-size:22px;font-weight:700;letter-spacing:-.3px;}
        .mega-nav{display:flex;gap:28px;align-items:center;}
        .nav-item{position:relative;padding:10px 6px;font-weight:500;color:#222;cursor:pointer;}
        .nav-item:hover{color:#000;}
        .mega-panel{position:absolute;left:0;top:100%;background:#fff;box-shadow:0 20px 50px rgba(0,0,0,0.08);padding:24px 28px;display:flex;gap:40px;border-radius:12px;opacity:0;transform:translateY(12px);transition:all .22s ease;pointer-events:none;min-width:420px;}
        .nav-item:hover .mega-panel{opacity:1;transform:translateY(0);pointer-events:auto;}
        .mega-panel .col h4{margin-bottom:10px;font-size:15px;font-weight:600;color:#111;}
        .mega-panel .col a{display:block;margin-bottom:8px;font-size:14px;color:#444;transition:.15s ease;}
        .mega-panel .col a:hover{color:#000;}
        .icon-btn{padding:10px 14px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);background:#fff;cursor:pointer;transition:.15s ease;}
        .icon-btn:hover{background:rgba(0,0,0,0.04);}
        @media(max-width:900px){.mega-nav{display:none;}}
      }`,
    },
  ],

  // ---------- TEMPLATE (20+ items) ----------
  template: [
    // 1 Hero - large
    {
      id: 'hero-large',
      name: 'Hero: Large banner',
      description: 'Classic large hero with text left & image right',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
<div class="template-1">
  <div class="container hero-inner">
    <div class="hero-text">
      <h1>Elevate Your Everyday</h1>
      <p>Quality pieces designed to last. Free returns and fast shipping.</p>
      <div class="cta"><button>Shop Women</button><button class="ghost">Shop Men</button></div>
    </div>
    <div class="hero-media" role="img" aria-label="Hero image"></div>
  </div>
</div>`,
      css: `
.template-1 padding:64px 16px; background:#fafafa; }
.hero-inner{ display:flex; gap:32px; align-items:center; max-width:1200px; margin:0 auto; }
.hero-text{ max-width:540px; }
.hero-text h1{ font-size:40px; margin-bottom:14px; }
.hero-media{ flex:1; height:420px; background-image:url('https://source.unsplash.com/900x700?fashion'); background-size:cover; border-radius:12px; }

/* buttons */
.cta button{ padding:12px 18px; border-radius:8px; border:none; margin-right:10px; cursor:pointer; }
.cta .ghost{ background:transparent; border:1px solid rgba(0,0,0,0.08); }

/* responsive */
@media (max-width:900px){ .hero-inner{ flex-direction:column-reverse; } .hero-media{ width:100%; height:320px; } }`,
    },

    // 2 Hero - bottom aligned
    {
      id: 'hero-bottom',
      name: 'Hero: Bottom aligned',
      description: 'Hero with content anchored at bottom of image',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
<section class="hero-bottom">
  <div class="hero-img">
    <div class="hero-caption">
      <h2>Season Collection</h2>
      <p>Shop limited edition pieces</p>
      <a class="btn">Explore</a>
    </div>
  </div>
</section>`,
      css: `
.hero-bottom .hero-img{ height:460px; background-image:url('https://source.unsplash.com/1200x800?apparel'); background-size:cover; display:flex; align-items:flex-end; border-radius:12px; padding:32px; }
.hero-caption{ background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%); color:#fff; padding:20px; border-radius:8px; }
.hero-caption h2{ margin:0 0 8px; font-size:28px; }`,
    },

    // 3 Hero - marquee
    {
      id: 'hero-marquee',
      name: 'Hero: Marquee',
      description: 'Scrolling marquee headline over a banner',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
<section class="hero-marquee">
  <div class="marquee">NEW ARRIVALS · NEW ARRIVALS · NEW ARRIVALS ·</div>
  <div class="marquee-bg"></div>
</section>`,
      css: `
.hero-marquee{ position:relative; height:220px; overflow:hidden; background:#fff; display:flex; align-items:center; justify-content:center; }
.marquee{ font-size:28px; white-space:nowrap; animation:marq 12s linear infinite; }
@keyframes marq{ 0%{ transform:translateX(0%);} 100%{ transform:translateX(-50%);} }
.marquee-bg{ position:absolute; inset:0; background-image:url('https://source.unsplash.com/1400x400?store'); background-size:cover; opacity:0.06; }`,
    },

    // 4 Large logo / Brand showcase
    {
      id: 'brand-logos',
      name: 'Large logo / Brand list',
      description: 'Row of partner or brand logos',
      category: 'Logos',
      icon: <TemplateSessionIcon />,
      html: `
<section class="logo-list">
  <div class="container logos">
    <img src="https://via.placeholder.com/140x40?text=Logo1" />
    <img src="https://via.placeholder.com/140x40?text=Logo2" />
    <img src="https://via.placeholder.com/140x40?text=Logo3" />
    <img src="https://via.placeholder.com/140x40?text=Logo4" />
  </div>
</section>`,
      css: `
.logo-list{ padding:32px 16px; background:#fff; }
.logos{ display:flex; gap:24px; align-items:center; justify-content:space-between; max-width:1200px; margin:0 auto; }
.logos img{ height:40px; object-fit:contain; }`,
    },

    // 5 Slideshow (simple)
    {
      id: 'slideshow',
      name: 'Slideshow',
      description: 'Auto-rotating slideshow (static demo)',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
<section class="slideshow">
  <div class="slide" style="background-image:url('https://source.unsplash.com/1400x600?clothes')"></div>
  <div class="slide" style="background-image:url('https://source.unsplash.com/1400x600?shop')"></div>
</section>`,
      css: `
.slideshow{ position:relative; height:420px; overflow:hidden; border-radius:12px; margin:24px 16px; }
.slide{ position:absolute; inset:0; background-size:cover; background-position:center; opacity:0; animation:slideAnim 8s linear infinite; }
.slide:nth-child(1){ animation-delay:0; }
.slide:nth-child(2){ animation-delay:4s; }
@keyframes slideAnim{ 0%{opacity:0;} 10%{opacity:1;} 45%{opacity:1;} 55%{opacity:0;} 100%{opacity:0;} }`,
    },

    // 6 Collection Spotlight
    {
      id: 'collection-spotlight',
      name: 'Collection links: Spotlight',
      description: 'Two large cards highlighting collections',
      category: 'Collections',
      icon: <TemplateSessionIcon />,
      html: `
<section class="spotlight-wrapper">
  <a class="spot-card">
    <img src="https://source.unsplash.com/800x800?bag" />
    <div class="meta"><h3>New Bags</h3><p>Modern designs</p></div>
  </a>
  <a class="spot-card">
    <img src="https://source.unsplash.com/800x800?shoes" />
    <div class="meta"><h3>Sneakers</h3><p>Comfort & style</p></div>
  </a>
</section>`,
      css: `
.spotlight-wrapper{ display:grid; grid-template-columns:repeat(2,1fr); gap:24px; padding:32px 16px; max-width:1200px; margin:0 auto; }
.spot-card{ display:block; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.06); text-decoration:none; color:inherit; }
.spot-card img{ width:100%; height:420px; object-fit:cover; }
.spot-card .meta{ padding:16px; }`,
    },

    // 7 Collection carousel (static grid fallback)
    {
      id: 'collection-carousel',
      name: 'Collection list: Carousel',
      description: 'Carousel style list (static grid for demo)',
      category: 'Collections',
      icon: <TemplateSessionIcon />,
      html: `
<section class="collection-carousel">
  <div class="container grid">
    <article class="col"><img src="https://source.unsplash.com/600x600?jacket"/><h4>Outerwear</h4></article>
    <article class="col"><img src="https://source.unsplash.com/600x600?jeans"/><h4>Denim</h4></article>
    <article class="col"><img src="https://source.unsplash.com/600x600?dress"/><h4>Dresses</h4></article>
  </div>
</section>`,
      css: `
.collection-carousel .grid{ display:flex; gap:20px; padding:24px 16px; max-width:1200px; margin:0 auto; }
.collection-carousel .col{ width:33%; border-radius:10px; overflow:hidden; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,0.04); }
.collection-carousel img{ width:100%; height:260px; object-fit:cover; }`,
    },

    // 8 Bento grid (4-up)
    {
      id: 'bento-grid',
      name: 'Collection list: Bento',
      description: 'Asymmetrical bento grid layout',
      category: 'Collections',
      icon: <TemplateSessionIcon />,
      html: `
<section class="bento">
  <div class="container bento-grid">
    <div class="big"> <img src="https://source.unsplash.com/800x800?outfit"/></div>
    <div class="small"> <img src="https://source.unsplash.com/400x400?top"/></div>
    <div class="small"> <img src="https://source.unsplash.com/400x400?pants"/></div>
    <div class="small"> <img src="https://source.unsplash.com/400x400?shoes"/></div>
  </div>
</section>`,
      css: `
.bento-grid{ display:grid; grid-template-columns:2fr 1fr; grid-auto-rows:200px; gap:16px; max-width:1200px; margin:0 auto; }
.bento-grid .big{ grid-row:span 2; border-radius:12px; overflow:hidden; }
.bento-grid img{ width:100%; height:100%; object-fit:cover; display:block; }`,
    },

    // 9 Product grid - featured
    {
      id: 'product-grid',
      name: 'Product grid',
      description: '3-up product cards with price and add to cart',
      category: 'Products',
      icon: <TemplateSessionIcon />,
      html: `
<section class="products">
  <div class="container product-grid">
    <article class="card">
      <div class="img" style="background-image:url('https://source.unsplash.com/600x600?shirt')"></div>
      <h4>Classic Tee</h4>
      <p class="price">$29.00</p>
      <button>Add to cart</button>
    </article>
    <article class="card">
      <div class="img" style="background-image:url('https://source.unsplash.com/600x600?polo')"></div>
      <h4>Stripe Polo</h4>
      <p class="price">$39.00</p>
      <button>Add to cart</button>
    </article>
    <article class="card">
      <div class="img" style="background-image:url('https://source.unsplash.com/600x600?jeans')"></div>
      <h4>Denim</h4>
      <p class="price">$79.00</p>
      <button>Add to cart</button>
    </article>
  </div>
</section>`,
      css: `
.product-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding:32px 16px; max-width:1200px; margin:0 auto; }
.card{ background:#fff; border-radius:12px; padding:12px; text-align:left; box-shadow:0 8px 24px rgba(0,0,0,0.04); }
.card .img{ height:320px; background-size:cover; background-position:center; border-radius:8px; margin-bottom:12px; }
.card .price{ color:#111; font-weight:600; margin:8px 0; }
.card button{ padding:10px 14px; border-radius:8px; background:#000; color:#fff; border:none; cursor:pointer; }

/* responsive */
@media (max-width:900px){ .product-grid{ grid-template-columns:repeat(2,1fr);} }
@media (max-width:600px){ .product-grid{ grid-template-columns:1fr;} }`,
    },

    // 10 Featured product (single product highlight)
    {
      id: 'featured-product',
      name: 'Featured product',
      description: 'Single product with gallery & details',
      category: 'Products',
      icon: <TemplateSessionIcon />,
      html: `
<section class="featured-product">
  <div class="container fp-grid">
    <div class="media" style="background-image:url('https://source.unsplash.com/900x900?product')"></div>
    <div class="info">
      <h2>Signature Jacket</h2>
      <p class="price">$249</p>
      <p>Expertly crafted with premium materials. Limited sizes available.</p>
      <button>Add to cart</button>
    </div>
  </div>
</section>`,
      css: `
.fp-grid{ display:grid; grid-template-columns:1fr 1fr; gap:28px; max-width:1200px; margin:0 auto; padding:40px 16px; }
.media{ height:520px; background-size:cover; background-position:center; border-radius:12px; }
.info h2{ margin-top:0; }
.info .price{ font-size:20px; font-weight:700; margin:12px 0; } 
.info button{ padding:12px 16px; border-radius:8px; background:#000; color:#fff; } 
@media (max-width:900px){ .fp-grid{ grid-template-columns:1fr; } .media{ height:420px; } }`,
    },

    // 11 Testimonial
    {
      id: 'testimonial',
      name: 'Testimonial',
      description: 'Customer review card with avatar',
      category: 'Testimonials',
      icon: <TemplateSessionIcon />,
      html: `
<section class="testimonials">
  <div class="container">
    <blockquote>
      "Absolutely love the quality — fits perfectly and arrived fast."
      <cite>— Jane D.</cite>
    </blockquote>
  </div>
</section>`,
      css: `
.testimonials{ padding:40px 16px; background:#fff; }
.testimonials blockquote{ max-width:800px; margin:0 auto; font-size:20px; line-height:1.6; color:#222; font-style:italic; }
.testimonials cite{ display:block; margin-top:12px; font-style:normal; color:#666; }`,
    },

    // 12 Blog posts (3 col)
    {
      id: 'blog-grid',
      name: 'Blog posts',
      description: 'Three recent blog posts with excerpt',
      category: 'Blog',
      icon: <TemplateSessionIcon />,
      html: `
<section class="blog-grid">
  <div class="container posts">
    <article><img src="https://source.unsplash.com/600x400?blog"/><h4>How to style</h4><p>Quick tips for your wardrobe.</p></article>
    <article><img src="https://source.unsplash.com/600x400?lifestyle"/><h4>Behind the scenes</h4><p>Design process revealed.</p></article>
    <article><img src="https://source.unsplash.com/600x400?travel"/><h4>Travel tips</h4><p>Pack smarter for trips.</p></article>
  </div>
</section>`,
      css: `
.posts{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; max-width:1200px; margin:0 auto; padding:32px 16px; }
.posts img{ width:100%; height:200px; object-fit:cover; border-radius:8px; }
.posts h4{ margin:12px 0 6px; } 
@media (max-width:900px){ .posts{ grid-template-columns:repeat(2,1fr);} }
@media (max-width:600px){ .posts{ grid-template-columns:1fr;} }`,
    },

    // 13 Newsletter
    {
      id: 'newsletter',
      name: 'Newsletter signup',
      description: 'Centered newsletter block with input',
      category: 'Newsletter',
      icon: <TemplateSessionIcon />,
      html: `
<section class="newsletter">
  <div class="container">
    <h3>Join our newsletter</h3>
    <p>Get 10% off your first order.</p>
    <div class="form"><input placeholder="Email address"/><button>Subscribe</button></div>
  </div>
</section>`,
      css: `
.newsletter{ background:#fafafa; padding:40px 16px; text-align:center; }
.newsletter .form{ display:flex; gap:8px; justify-content:center; margin-top:12px; max-width:600px; margin-left:auto; margin-right:auto; }
.newsletter input{ padding:12px 14px; border-radius:8px; border:1px solid rgba(0,0,0,0.08); flex:1; }
.newsletter button{ padding:12px 16px; border-radius:8px; background:#000; color:#fff; border:none; }`,
    },

    // 14 Image with text (side by side)
    {
      id: 'image-text',
      name: 'Image with text',
      description: 'Image left, text right — used for features',
      category: 'Image & Text',
      icon: <TemplateSessionIcon />,
      html: `
<section class="image-text">
  <div class="container it-grid">
    <div class="it-media" style="background-image:url('https://source.unsplash.com/900x700?detail');"></div>
    <div class="it-text">
      <h3>Quality Materials</h3>
      <p>We carefully select sustainable fabrics for longevity.</p>
      <a class="link">Learn more →</a>
    </div>
  </div>
</section>`,
      css: `
.it-grid{ display:grid; grid-template-columns:1fr 1fr; gap:28px; max-width:1200px; margin:0 auto; padding:40px 16px; }
.it-media{ height:420px; background-size:cover; background-position:center; border-radius:12px; }
.it-text h3{ margin-top:0; }
@media (max-width:900px){ .it-grid{ grid-template-columns:1fr; } .it-media{ height:300px; } }`,
    },

    // 15 Image banner (full width)
    {
      id: 'image-banner',
      name: 'Image banner (full)',
      description: 'Edge-to-edge image banner with overlay',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
<section class="img-banner">
  <div class="banner" style="background-image:url('https://source.unsplash.com/1600x600?fashion');">
    <div class="overlay">
      <h2>Timeless Essentials</h2>
      <a class="btn">Shop the collection</a>
    </div>
  </div>
</section>`,
      css: `
.img-banner .banner{ height:360px; background-size:cover; background-position:center; display:flex; align-items:center; }
.img-banner .overlay{ margin-left:8%; color:#fff; text-shadow:0 6px 20px rgba(0,0,0,0.5); }
.img-banner .btn{ background:#000; color:#fff; padding:10px 14px; border-radius:8px; }`,
    },

    // 16 Video banner (poster fallback)
    {
      id: 'video-banner',
      name: 'Video banner (poster)',
      description: 'Video hero area — static poster for demo',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
<section class="video-banner">
  <div class="poster" style="background-image:url('https://source.unsplash.com/1600x900?video')">
    <button class="play">▶</button>
  </div>
</section>`,
      css: `
.video-banner .poster{ height:420px; background-size:cover; background-position:center; display:flex; align-items:center; justify-content:center; border-radius:12px; }
.play{ background:rgba(0,0,0,0.6); color:#fff; font-size:28px; padding:16px 18px; border-radius:999px; border:none; cursor:pointer; }`,
    },

    // 17 FAQ accordion (static)
    {
      id: 'faq',
      name: 'FAQ (accordion)',
      description: 'Simple FAQ list (static open state demo)',
      category: 'Text',
      icon: <TemplateSessionIcon />,
      html: `
<section class="faq">
  <div class="container">
    <details open><summary>What is your return policy?</summary><p>30-day returns on unworn items.</p></details>
    <details><summary>How long is shipping?</summary><p>2-7 business days depending on location.</p></details>
  </div>
</section>`,
      css: `
.faq details{ background:#fff; padding:16px; border-radius:8px; margin-bottom:10px; box-shadow:0 6px 18px rgba(0,0,0,0.04); }
.faq summary{ cursor:pointer; font-weight:600; }`,
    },

    // 18 Icon list / features
    {
      id: 'icons-features',
      name: 'Icons with text',
      description: 'Small icon + title + short description list',
      category: 'Features',
      icon: <TemplateSessionIcon />,
      html: `
<section class="features">
  <div class="container feats">
    <div class="feat"><div class="ico">🚚</div><h4>Free Shipping</h4><p>Over $75</p></div>
    <div class="feat"><div class="ico">🔁</div><h4>Free Returns</h4><p>30 days</p></div>
    <div class="feat"><div class="ico">⭐</div><h4>Top Quality</h4><p>Curated materials</p></div>
  </div>
</section>`,
      css: `
.feats{ display:flex; gap:24px; align-items:center; justify-content:center; padding:28px 16px; }
.feat{ text-align:center; max-width:220px; }
.feat .ico{ font-size:28px; margin-bottom:8px; }`,
    },

    // 19 Lookbook grid
    {
      id: 'lookbook',
      name: 'Lookbook grid',
      description: 'Visual editorial style grid',
      category: 'Lookbook',
      icon: <TemplateSessionIcon />,
      html: `
<section class="lookbook">
  <div class="container lb-grid">
    <figure><img src="https://source.unsplash.com/600x900?model1"/></figure>
    <figure><img src="https://source.unsplash.com/600x900?model2"/></figure>
    <figure><img src="https://source.unsplash.com/600x900?model3"/></figure>
  </div>
</section>`,
      css: `
.lb-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; max-width:1200px; margin:0 auto; padding:24px 16px; }
.lb-grid img{ width:100%; height:100%; object-fit:cover; border-radius:8px; }`,
    },

    // 20 Shoppable image (static hotspots demo)
    {
      id: 'shoppable-image',
      name: 'Shoppable image (hotspots)',
      description: 'Image with product hotspots (static markers)',
      category: 'Shoppable',
      icon: <TemplateSessionIcon />,
      html: `
<section class="shoppable">
  <div class="container shop-img" style="background-image:url('https://source.unsplash.com/1200x700?outfit')">
    <button class="hotspot" style="left:30%; top:40%;">$79</button>
    <button class="hotspot" style="left:65%; top:60%;">$49</button>
  </div>
</section>`,
      css: `
.shop-img{ height:500px; background-size:cover; background-position:center; position:relative; border-radius:12px; margin:24px 16px; }
.hotspot{ position:absolute; transform:translate(-50%,-50%); background:#fff; border-radius:999px; padding:8px 10px; border:1px solid rgba(0,0,0,0.08); cursor:pointer; }`,
    },

    // 21 Product carousel (horizontal scroller static)
    {
      id: 'product-scroller',
      name: 'Product scroller',
      description: 'Horizontal scroller row of products',
      category: 'Products',
      icon: <TemplateSessionIcon />,
      html: `
<section class="product-scroller">
  <div class="container scroller">
    <div class="item"><img src="https://source.unsplash.com/400x400?product1"/><h5>Item A</h5></div>
    <div class="item"><img src="https://source.unsplash.com/400x400?product2"/><h5>Item B</h5></div>
    <div class="item"><img src="https://source.unsplash.com/400x400?product3"/><h5>Item C</h5></div>
  </div>
</section>`,
      css: `
.scroller{ display:flex; gap:16px; overflow-x:auto; padding:20px 16px; }
.item{ min-width:220px; border-radius:12px; background:#fff; padding:12px; box-shadow:0 8px 20px rgba(0,0,0,0.04); }
.item img{ width:100%; height:200px; object-fit:cover; border-radius:8px; }`,
    },

    // 22 Rich text (long content)
    {
      id: 'rich-text',
      name: 'Rich text / HTML',
      description: 'Long copy area for custom content',
      category: 'Text',
      icon: <TemplateSessionIcon />,
      html: `
<section class="rich-text">
  <div class="container">
    <h2>About our brand</h2>
    <p>Founded on the belief that great design should be accessible to everyone...</p>
    <h3>Our mission</h3>
    <p>We focus on sustainability and quality.</p>
  </div>
</section>`,
      css: `
.rich-text{ padding:40px 16px; max-width:900px; margin:0 auto; color:#222; }
.rich-text h2{ font-size:28px; }`,
    },

    // 23 Contact form
    {
      id: 'contact-form',
      name: 'Contact form',
      description: 'Simple contact form with fields',
      category: 'Forms',
      icon: <TemplateSessionIcon />,
      html: `
<section class="contact">
  <div class="container contact-inner">
    <form><input placeholder="Name"/><input placeholder="Email"/><textarea placeholder="Message"></textarea><button>Send</button></form>
  </div>
</section>`,
      css: `
.contact-inner form{ display:flex; flex-direction:column; gap:10px; max-width:600px; margin:0 auto; padding:32px 16px; }
.contact-inner input, .contact-inner textarea{ padding:12px; border-radius:8px; border:1px solid rgba(0,0,0,0.08); }
.contact-inner button{ padding:12px; border-radius:8px; background:#000; color:#fff; border:none; cursor:pointer; }`,
    },

    // 24 Map (static placeholder)
    {
      id: 'map',
      name: 'Map placeholder',
      description: 'Static map area (embed external map in real site)',
      category: 'Map',
      icon: <TemplateSessionIcon />,
      html: `
<section class="map-block">
  <div class="container map" style="background:#e9e9e9; height:360px; display:flex; align-items:center; justify-content:center;">
    <p>Map embed placeholder</p>
  </div>
</section>`,
      css: `
.map-block .map{ border-radius:12px; }`,
    },

    // 25 Promo grid (cards)
    {
      id: 'promo-grid',
      name: 'Promo grid',
      description: 'Small promotional cards',
      category: 'Promos',
      icon: <TemplateSessionIcon />,
      html: `
<section class="promo">
  <div class="container promo-grid">
    <a class="promo-card"><h4>Sale</h4><p>Up to 50% off</p></a>
    <a class="promo-card"><h4>New</h4><p>Limited drops</p></a>
    <a class="promo-card"><h4>Gift</h4><p>Free gift wrapping</p></a>
  </div>
</section>`,
      css: `
.promo-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; max-width:1200px; margin:0 auto; padding:24px 16px; }
.promo-card{ background:#fff; padding:20px; border-radius:12px; box-shadow:0 8px 20px rgba(0,0,0,0.04); text-decoration:none; color:inherit; }`,
    },
  ],

  // ---------- FOOTER (5 items) ----------
  footer: [
    {
      id: 'footer-minimal',
      name: 'Footer: Minimal',
      description: 'Simple centered copyright footer',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
<footer class="footer-minimal">
  <div class="container">© 2025 Brand — All rights reserved</div>
</footer>`,
      css: `
.footer-minimal{ padding:20px 16px; background:#111; color:#ddd; text-align:center; }`,
    },

    {
      id: 'footer-3col',
      name: 'Footer: 3 Columns',
      description: 'Classic 3-column footer with links and newsletter',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
<footer class="footer-3col">
  <div class="container f-grid">
    <div><h4>Shop</h4><ul><li>New</li><li>Best sellers</li></ul></div>
    <div><h4>About</h4><ul><li>Our story</li><li>Careers</li></ul></div>
    <div><h4>Newsletter</h4><p>Subscribe for updates</p><input placeholder="Email"/><button>Subscribe</button></div>
  </div>
</footer>`,
      css: `
.footer-3col{ background:#0b0b0b; color:#ddd; padding:48px 16px; }
.f-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; max-width:1200px; margin:0 auto; }
.footer-3col input{ padding:10px; border-radius:8px; border:none; margin-top:8px; }
.footer-3col button{ margin-top:8px; padding:10px; border-radius:8px; background:#fff; color:#000; border:none; }`,
    },

    {
      id: 'footer-social',
      name: 'Footer: Social & payments',
      description: 'Footer with social icons and payment logos',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
<footer class="footer-social">
  <div class="container f-row">
    <div class="left">© 2025 Brand</div>
    <div class="center">[payment icons placeholder]</div>
    <div class="right">Follow: <a>IG</a> <a>FB</a></div>
  </div>
</footer>`,
      css: `
.footer-social{ background:#0f0f0f; color:#ccc; padding:20px 16px; }
.f-row{ display:flex; align-items:center; justify-content:space-between; max-width:1200px; margin:0 auto; }`,
    },

    {
      id: 'footer-full',
      name: 'Footer: Full (links + newsletter + socials)',
      description: 'Comprehensive footer with many links and newsletter',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
<footer class="footer-full">
  <div class="container">
    <div class="cols">
      <div><h4>Shop</h4><ul><li>Collections</li><li>New</li></ul></div>
      <div><h4>Help</h4><ul><li>Shipping</li><li>Returns</li></ul></div>
      <div><h4>Company</h4><ul><li>About</li><li>Careers</li></ul></div>
      <div><h4>Newsletter</h4><input placeholder="Email"/><button>Subscribe</button></div>
    </div>
  </div>
</footer>`,
      css: `
.footer-full{ background:#070707; color:#ddd; padding:48px 16px; }
.footer-full .cols{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; max-width:1200px; margin:0 auto; }
.footer-full input{ padding:10px; border-radius:6px; border:none; }`,
    },

    {
      id: 'footer-payments',
      name: 'Footer: Payments & small print',
      description: 'Payment icons with terms and small print',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
<footer class="footer-pay">
  <div class="container">
    <div class="pay-icons">[Visa][MC][PayPal]</div>
    <p class="small">Prices shown in USD. Taxes calculated at checkout.</p>
  </div>
</footer>`,
      css: `
.footer-pay{ background:#0b0b0b; color:#aaa; padding:24px 16px; text-align:center; }
.footer-pay .small{ font-size:13px; margin-top:8px; }`,
    },
  ],
};
