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
            <div class="announce-content">
              <svg class="announce-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <p class="announce-text">Free shipping on orders over $75 — Use code: <span class="code">FREESHIP</span></p>
            </div>
            <button class="announce-close" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="hdr-main">
          <div class="container hdr-inner">
            <div class="logo">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>Brand</span>
            </div>
            <nav class="nav">
              <a class="nav-link">Home</a>
              <a class="nav-link">Shop</a>
              <a class="nav-link">Collections</a>
              <a class="nav-link">About</a>
            </nav>
            <div class="hdr-actions">
              <button class="action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </button>
              <button class="action-btn cart-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                <span class="cart-count">2</span>
              </button>
            </div>
          </div>
        </div>
      </div>`,
      css: `.header-1{ display:flex; flex-direction:column; position:sticky; top:0; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
      .header-1 .hdr-announce{ background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; font-size:14px; position:relative; overflow:hidden; }
      .header-1 .hdr-announce::before{ content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent); animation:shimmer 3s infinite; }
      .header-1 .hdr-announce .container{ display:flex; justify-content:space-between; align-items:center; padding:12px 24px; max-width:1400px; margin:0 auto; position:relative; z-index:1; }
      .header-1 .announce-content{ display:flex; align-items:center; gap:12px; }
      .header-1 .announce-icon{ width:18px; height:18px; }
      .header-1 .announce-text{ margin:0; font-weight:500; }
      .header-1 .code{ padding:2px 8px; background:rgba(255,255,255,0.2); border-radius:4px; font-weight:700; letter-spacing:0.05em; }
      .header-1 .announce-close{ background:transparent; color:#fff; border:none; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; border-radius:4px; transition:background 0.2s ease; }
      .header-1 .announce-close svg{ width:16px; height:16px; }
      .header-1 .announce-close:hover{ background:rgba(255,255,255,0.15); }
      .header-1 .hdr-main{ background:#fff; border-bottom:1px solid rgba(0,0,0,0.08); }
      .header-1 .hdr-main .hdr-inner{ display:flex; align-items:center; justify-content:space-between; padding:20px 24px; max-width:1400px; margin:0 auto; }
      .header-1 .logo{ display:flex; align-items:center; gap:10px; font-weight:800; font-size:24px; color:#1a202c; cursor:pointer; }
      .header-1 .logo-icon{ width:28px; height:28px; color:#667eea; }
      .header-1 .nav{ display:flex; gap:32px; align-items:center; }
      .header-1 .nav-link{ cursor:pointer; font-size:15px; font-weight:600; color:#4a5568; transition:color 0.2s ease; position:relative; padding:8px 0; }
      .header-1 .nav-link::after{ content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); transition:width 0.3s ease; }
      .header-1 .nav-link:hover{ color:#667eea; }
      .header-1 .nav-link:hover::after{ width:100%; }
      .header-1 .hdr-actions{ display:flex; gap:12px; align-items:center; }
      .header-1 .action-btn{ padding:10px; border-radius:10px; border:1px solid rgba(0,0,0,0.08); background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s ease; position:relative; }
      .header-1 .action-btn svg{ width:20px; height:20px; color:#4a5568; }
      .header-1 .action-btn:hover{ background:#f7fafc; border-color:rgba(0,0,0,0.12); transform:translateY(-1px); }
      .header-1 .cart-btn{ position:relative; }
      .header-1 .cart-count{ position:absolute; top:-6px; right:-6px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; font-size:11px; font-weight:700; padding:2px 6px; border-radius:10px; min-width:18px; text-align:center; }
      @keyframes shimmer{ 0%{ left:-100%; } 100%{ left:200%; } }
      @media (max-width:900px){ .header-1 .nav{ display:none; } .header-1 .hdr-inner{ padding:16px 20px; } .header-1 .announce-text{ font-size:12px; } }`,
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
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>Brand</span>
        </div>
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="Search products, categories…" aria-label="Search" />
          <div class="search-suggestions">
            <div class="suggestion-item">
              <svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>Summer collection</span>
            </div>
            <div class="suggestion-item">
              <svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>New arrivals</span>
            </div>
          </div>
        </div>
        <div class="icons">
          <button class="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span class="btn-label">Account</span>
          </button>
          <button class="icon-btn cart-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            <span class="btn-label">Cart</span>
            <span class="cart-badge">3</span>
          </button>
        </div>
      </div>
    </div>`,
      css: `.header-2{ background:#fff; border-bottom:1px solid rgba(0,0,0,0.08); position:sticky; top:0; z-index:100; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
    .header-2 .hdr-search-inner{ display:flex; align-items:center; gap:32px; padding:20px 24px; max-width:1400px; margin:0 auto; }
    .header-2 .logo{ display:flex; align-items:center; gap:10px; font-weight:800; font-size:24px; color:#1a202c; cursor:pointer; white-space:nowrap; }
    .header-2 .logo-icon{ width:28px; height:28px; color:#667eea; }
    .header-2 .search-wrap{ flex:1; display:flex; align-items:center; position:relative;}
    .header-2 .search-icon{ position:absolute; left:16px; width:20px; height:20px; color:#a0aec0; pointer-events:none; }
    .header-2 .search-wrap input{ width:100%; padding:14px 16px 14px 48px; border-radius:12px; border:2px solid rgba(0,0,0,0.08); background:#f7fafc; transition:all 0.3s ease; font-size:15px; }
    .header-2 .search-wrap input:focus{ outline:none; background:#fff; border-color:#667eea; box-shadow:0 0 0 4px rgba(102,126,234,0.1); }
    .header-2 .search-wrap input:focus ~ .search-suggestions{ opacity:1; visibility:visible; transform:translateY(0); }
    .header-2 .search-suggestions{ position:absolute; top:calc(100% + 8px); left:0; right:0; background:#fff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.12); padding:12px; opacity:0; visibility:hidden; transform:translateY(-8px); transition:all 0.3s ease; z-index:10; }
    .header-2 .suggestion-item{ display:flex; align-items:center; gap:12px; padding:12px; border-radius:8px; cursor:pointer; transition:background 0.2s ease; }
    .header-2 .suggestion-item:hover{ background:#f7fafc; }
    .header-2 .suggestion-icon{ width:16px; height:16px; color:#a0aec0; }
    .header-2 .icons{ display:flex; align-items:center; gap:12px; }
    .header-2 .icon-btn{ padding:12px 20px; border-radius:10px; border:1px solid rgba(0,0,0,0.08); background:#fff; cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; gap:8px; position:relative; font-size:15px; font-weight:600; color:#4a5568; }
    .header-2 .icon-btn svg{ width:20px; height:20px; }
    .header-2 .icon-btn:hover{ background:#f7fafc; border-color:rgba(0,0,0,0.12); transform:translateY(-1px); }
    .header-2 .cart-badge{ position:absolute; top:-6px; right:-6px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; font-size:11px; font-weight:700; padding:2px 6px; border-radius:10px; min-width:18px; text-align:center; }
    @media (max-width:900px){ .header-2 .hdr-search-inner{ gap:16px; padding:16px 20px; } .header-2 .search-wrap{ display:none; } .header-2 .btn-label{ display:none; } .header-2 .icon-btn{ padding:10px; } }`,
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
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          <div class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span>Brand</span>
          </div>
          <div class="mini-actions">
            <button class="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
            <button class="icon-btn cart-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              <span class="cart-badge">2</span>
            </button>
          </div>
        </div>
        <div class="mobile-menu">
          <nav class="mobile-nav">
            <a class="mobile-nav-link">Home</a>
            <a class="mobile-nav-link">Shop</a>
            <a class="mobile-nav-link">Collections</a>
            <a class="mobile-nav-link">About</a>
          </nav>
        </div>
      </div>`,
      css: `.header-3{ background:#fff; border-bottom:1px solid rgba(0,0,0,0.08); position:sticky; top:0; z-index:100; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
    .header-3 .hdr-stacked-top{ display:flex; align-items:center; justify-content:space-between; padding:16px 20px; max-width:1400px; margin:0 auto; gap:16px; }
    .header-3 .logo{ display:flex; align-items:center; gap:10px; font-size:22px; font-weight:800; letter-spacing:-0.3px; color:#1a202c; }
    .header-3 .logo-icon{ width:26px; height:26px; color:#667eea; }
    .header-3 .hamburger{ width:40px; height:40px; padding:0; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:5px; background:none; border:1px solid rgba(0,0,0,0.08); border-radius:8px; cursor:pointer; transition:all 0.2s ease; }
    .header-3 .hamburger:hover{ background:#f7fafc; border-color:rgba(0,0,0,0.12); }
    .header-3 .hamburger-line{ display:block; width:20px; height:2px; background:#1a202c; border-radius:2px; transition:all 0.3s ease; }
    .header-3 .hamburger:hover .hamburger-line:nth-child(1){ transform:translateY(-1px); }
    .header-3 .hamburger:hover .hamburger-line:nth-child(3){ transform:translateY(1px); }
    .header-3 .mini-actions{ display:flex; align-items:center; gap:10px; }
    .header-3 .icon-btn{ padding:10px; border-radius:8px; background:#fff; border:1px solid rgba(0,0,0,0.08); cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; justify-content:center; position:relative; }
    .header-3 .icon-btn svg{ width:20px; height:20px; color:#4a5568; }
    .header-3 .icon-btn:hover{ background:#f7fafc; border-color:rgba(0,0,0,0.12); transform:translateY(-1px); }
    .header-3 .cart-badge{ position:absolute; top:-6px; right:-6px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; font-size:11px; font-weight:700; padding:2px 6px; border-radius:10px; min-width:18px; text-align:center; }
    .header-3 .mobile-menu{ max-height:0; overflow:hidden; transition:max-height 0.3s ease; background:#f7fafc; }
    .header-3 .hamburger:focus ~ .mobile-menu{ max-height:300px; }
    .header-3 .mobile-nav{ padding:20px; display:flex; flex-direction:column; gap:4px; }
    .header-3 .mobile-nav-link{ padding:12px 16px; font-size:16px; font-weight:600; color:#4a5568; cursor:pointer; border-radius:8px; transition:all 0.2s ease; }
    .header-3 .mobile-nav-link:hover{ background:#fff; color:#667eea; }
    @media (min-width:900px){ .header-3 .hdr-stacked-top{ padding:20px 24px; } .header-3 .logo{ font-size:24px; } .header-3 .logo-icon{ width:28px; height:28px; } .header-3 .icon-btn{ padding:12px; } }`,
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
          <div class="container">
            <svg class="ann-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span>Limited time: <strong>10% off</strong> for new customers</span>
          </div>
        </div>
        <div class="hdr-large-search">
          <div class="container center">
            <div class="logo">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>Brand</span>
            </div>
            <div class="big-search">
              <svg class="big-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input placeholder="Search all products..." aria-label="Search" />
              <button class="search-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <span>Search</span>
              </button>
            </div>
            <div class="right-icons">
              <button class="icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
              <button class="icon-btn cart-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                <span class="cart-badge">4</span>
              </button>
            </div>
          </div>
        </div>
      </div>`,
      css: `.header-4{ position:sticky; top:0; z-index:100; background:#fff; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
      .header-4 .ann-2{ background:linear-gradient(135deg,#ffeaa7 0%,#fdcb6e 100%); padding:12px 20px; text-align:center; font-size:14px; font-weight:500; color:#2d3436; display:flex; align-items:center; justify-content:center; gap:10px; }
      .header-4 .ann-icon{ width:20px; height:20px; color:#2d3436; }
      .header-4 .hdr-large-search .center{ display:flex; align-items:center; gap:32px; padding:24px 24px; max-width:1400px; margin:0 auto; }
      .header-4 .logo{ display:flex; align-items:center; gap:10px; font-size:24px; font-weight:800; letter-spacing:-0.3px; color:#1a202c; white-space:nowrap; }
      .header-4 .logo-icon{ width:28px; height:28px; color:#667eea; }
      .header-4 .big-search{ flex:1; display:flex; gap:12px; align-items:center; position:relative;}
      .header-4 .big-search-icon{ position:absolute; left:20px; width:22px; height:22px; color:#a0aec0; pointer-events:none; }
      .header-4 .big-search input{ flex:1; padding:16px 20px 16px 56px; border-radius:12px; border:2px solid rgba(0,0,0,0.08); background:#f7fafc; transition:all 0.3s ease; font-size:15px; }
      .header-4 .big-search input:focus{ outline:none; background:#fff; border-color:#667eea; box-shadow:0 0 0 4px rgba(102,126,234,0.1); }
      .header-4 .search-btn{ padding:16px 28px; border-radius:12px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; border:none; font-weight:600; cursor:pointer; transition:all 0.3s ease; display:flex; align-items:center; gap:8px; font-size:15px; box-shadow:0 4px 12px rgba(102,126,234,0.3); }
      .header-4 .search-btn svg{ width:18px; height:18px; }
      .header-4 .search-btn:hover{ transform:translateY(-2px); box-shadow:0 6px 16px rgba(102,126,234,0.4); }
      .header-4 .right-icons{ display:flex; align-items:center; gap:12px; }
      .header-4 .icon-btn{ padding:12px; border-radius:10px; border:1px solid rgba(0,0,0,0.08); background:#fff; cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; justify-content:center; position:relative; }
      .header-4 .icon-btn svg{ width:20px; height:20px; color:#4a5568; }
      .header-4 .icon-btn:hover{ background:#f7fafc; border-color:rgba(0,0,0,0.12); transform:translateY(-1px); }
      .header-4 .cart-badge{ position:absolute; top:-6px; right:-6px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; font-size:11px; font-weight:700; padding:2px 6px; border-radius:10px; min-width:18px; text-align:center; }
      @media(max-width:1024px){ .header-4 .center{ gap:20px; padding:20px; } .header-4 .big-search{ max-width:500px; } }
      @media(max-width:900px){ .header-4 .big-search{ display:none; } .header-4 .center{ justify-content:space-between; } }`,
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
                  <h4>New Arrivals</h4>
                  <a href="#">Spring Collection</a>
                  <a href="#">Limited Edition</a>
                  <a href="#">Trending Now</a>
                </div>

                <div class="col">
                  <h4>Collections</h4>
                  <a href="#">Summer Essentials</a>
                  <a href="#">Urban Style</a>
                  <a href="#">Classic Line</a>
                </div>

                <div class="col">
                  <h4>Featured</h4>
                  <a href="#">Best Sellers</a>
                  <a href="#">Sale Items</a>
                  <a href="#">Gift Ideas</a>
                </div>
              </div>
            </div>

            <div class="nav-item">About</div>
            <div class="nav-item">Contact</div>
          </nav>

          <div class="right"><button class="icon-btn">🛒 Cart</button></div>
        </div>
      </div>`,
      css: `
      .header-5{background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.08);position:sticky;top:0;z-index:1000;box-shadow:0 4px 30px rgba(0,0,0,0.06);
        .hdr-mega-inner{display:flex;align-items:center;justify-content:space-between;padding:20px 32px;max-width:1400px;margin:0 auto;}
        .logo{font-size:26px;font-weight:800;letter-spacing:-1px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;cursor:pointer;transition:transform .3s ease;}
        .logo:hover{transform:scale(1.05);}
        .mega-nav{display:flex;gap:16px;align-items:center;}
        .nav-item{position:relative;padding:12px 18px;font-weight:600;font-size:15px;color:#2d3748;cursor:pointer;border-radius:10px;transition:all .3s cubic-bezier(0.4,0,0.2,1);}
        .nav-item::after{content:'';position:absolute;bottom:8px;left:50%;width:0;height:2px;background:linear-gradient(90deg,#667eea 0%,#764ba2 100%);transform:translateX(-50%);transition:width .3s ease;}
        .nav-item:hover{color:#1a202c;background:rgba(102,126,234,0.08);}
        .nav-item:hover::after{width:60%;}
        .mega-panel{position:absolute;left:50%;top:calc(100% + 8px);transform:translateX(-50%) translateY(12px);background:#fff;box-shadow:0 30px 80px rgba(0,0,0,0.12),0 10px 30px rgba(0,0,0,0.08);padding:32px 36px;display:flex;gap:56px;border-radius:20px;opacity:0;transition:all .35s cubic-bezier(0.4,0,0.2,1);pointer-events:none;min-width:520px;border:1px solid rgba(102,126,234,0.1);}
        .mega-panel::before{content:'';position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:8px solid #fff;opacity:0;transition:opacity .3s ease;}
        .nav-item:hover .mega-panel{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto;}
        .nav-item:hover .mega-panel::before{opacity:1;}
        .mega-panel .col{flex:1;min-width:140px;}
        .mega-panel .col h4{margin-bottom:16px;font-size:13px;font-weight:700;color:#1a202c;text-transform:uppercase;letter-spacing:.5px;padding-bottom:12px;border-bottom:2px solid #667eea;}
        .mega-panel .col a{display:block;margin-bottom:12px;font-size:15px;color:#4a5568;transition:all .2s ease;padding:6px 0;position:relative;padding-left:0;}
        .mega-panel .col a::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:0;height:2px;background:linear-gradient(90deg,#667eea 0%,#764ba2 100%);transition:width .3s ease;}
        .mega-panel .col a:hover{color:#667eea;padding-left:16px;font-weight:600;}
        .mega-panel .col a:hover::before{width:10px;}
        .right{display:flex;gap:12px;align-items:center;}
        .icon-btn{padding:12px 24px;border-radius:12px;border:none;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;cursor:pointer;transition:all .3s cubic-bezier(0.4,0,0.2,1);font-weight:600;font-size:14px;letter-spacing:.3px;box-shadow:0 4px 15px rgba(102,126,234,0.3);position:relative;overflow:hidden;}
        .icon-btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transition:left .5s ease;}
        .icon-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(102,126,234,0.4);}
        .icon-btn:hover::before{left:100%;}
        .icon-btn:active{transform:translateY(0);}
        @media(max-width:900px){.mega-nav{display:none;}.hdr-mega-inner{padding:16px 20px;}}
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
        <div class="hero-background"></div>
        <div class="container hero-inner">
          <div class="hero-text">
            <span class="hero-badge">New Season Collection</span>
            <h1 class="hero-title">Elevate Your <span class="gradient-text">Everyday</span></h1>
            <p class="hero-description">Discover timeless pieces crafted with precision and care. Experience premium quality with complimentary returns and express shipping worldwide.</p>
            <div class="hero-features">
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                <span>Free Shipping</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <span>Easy Returns</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span>Fast Delivery</span>
              </div>
            </div>
            <div class="cta">
              <button class="btn-primary">Shop Women</button>
              <button class="btn-secondary">Shop Men</button>
            </div>
            <p class="hero-caption">Join over 50,000+ happy customers worldwide</p>
          </div>
          <div class="hero-media-wrapper">
            <div class="hero-media" role="img" aria-label="Hero image"></div>
            <div class="hero-accent"></div>
          </div>
        </div>
      </div>`,
      css: `.template-1{ position:relative; padding:24px; background:linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%); height:100%; display:flex; align-items:center; overflow:hidden; }
      .template-1 .hero-background{ position:absolute; top:-50%; right:-10%; width:800px; height:100%; background:radial-gradient(circle,rgba(102,126,234,0.1) 0%,transparent 70%); border-radius:50%; pointer-events:none; }
      .template-1 .hero-inner{ display:flex; gap:80px; align-items:center; max-width:1400px; margin:0 auto; position:relative; z-index:1; }
      .template-1 .hero-text{ max-width:600px; }
      .template-1 .hero-badge{ display:inline-block; padding:8px 20px; background:rgba(102,126,234,0.1); color:#667eea; border-radius:30px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:24px; border:1px solid rgba(102,126,234,0.2); }
      .template-1 .hero-title{ font-size:clamp(40px,5vw,64px); font-weight:900; line-height:1.1; margin:0 0 24px 0; color:#1a202c; }
      .template-1 .gradient-text{ background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); background-clip:text; -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
      .template-1 .hero-description{ font-size:18px; line-height:1.7; color:#4a5568; margin-bottom:32px; max-width:540px; }
      .template-1 .hero-features{ display:flex; gap:32px; margin-bottom:40px; flex-wrap:wrap; }
      .template-1 .feature-item{ display:flex; align-items:center; gap:8px; font-size:14px; font-weight:500; color:#2d3748; }
      .template-1 .feature-icon{ width:20px; height:20px; color:#667eea; }
      .template-1 .cta{ display:flex; gap:16px; margin-bottom:24px; }
      .template-1 .btn-primary{ padding:16px 40px; border-radius:50px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; border:none; font-size:16px; font-weight:600; cursor:pointer; transition:all 0.3s ease; box-shadow:0 8px 24px rgba(102,126,234,0.3); text-transform:uppercase; letter-spacing:0.05em; }
      .template-1 .btn-primary:hover{ transform:translateY(-2px); box-shadow:0 12px 32px rgba(102,126,234,0.4); }
      .template-1 .btn-secondary{ padding:16px 40px; border-radius:50px; border:2px solid #667eea; background:#fff; color:#667eea; font-size:16px; font-weight:600; cursor:pointer; transition:all 0.3s ease; text-transform:uppercase; letter-spacing:0.05em; }
      .template-1 .btn-secondary:hover{ background:#667eea; color:#fff; transform:translateY(-2px); box-shadow:0 8px 24px rgba(102,126,234,0.2); }
      .template-1 .hero-caption{ font-size:14px; color:#718096; font-style:italic; }
      .template-1 .hero-media-wrapper{ position:relative; flex:1; }
      .template-1 .hero-media{ height:600px; border-radius:24px; background-image:url('https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size:cover; background-position:center; background-repeat:no-repeat; box-shadow:0 20px 60px rgba(0,0,0,0.15); position:relative; z-index:2; transition:transform 0.3s ease; }
      .template-1 .hero-media:hover{ transform:scale(1.02); }
      .template-1 .hero-accent{ position:absolute; top:40px; right:-40px; width:100%; height:100%; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); border-radius:24px; z-index:1; opacity:0.2; }
      @media(max-width:1024px){ .template-1{ padding:60px 24px; } .template-1 .hero-inner{ flex-direction:column-reverse; text-align:center; gap:60px; } .template-1 .hero-text{ max-width:100%; } .template-1 .cta{ justify-content:center; flex-wrap:wrap; } .template-1 .hero-features{ justify-content:center; } .template-1 .hero-media{ width:100%; height:500px; } .template-1 .hero-accent{ top:20px; right:-20px; } }
      @media(max-width:640px){ .template-1{ padding:40px 20px; } .template-1 .hero-media{ height:400px; } .template-1 .btn-primary,.template-1 .btn-secondary{ padding:14px 32px; font-size:14px; width:100%; } .template-1 .cta{ flex-direction:column; gap:12px; } .template-1 .hero-features{ flex-direction:column; gap:16px; align-items:center; } }`,
    },

    // 2 Hero - bottom aligned
    {
      id: 'hero-bottom',
      name: 'Hero: Bottom aligned',
      description: 'Hero with content anchored at bottom of image',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="template-2">
        <div class="hero-img">
          <div class="hero-overlay"></div>
          <div class="hero-effects">
            <div class="floating-badge">Limited Edition</div>
          </div>
          <div class="hero-caption">
            <div class="caption-tag">
              <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>Spring 2025</span>
            </div>
            <h2 class="caption-title">Season Collection</h2>
            <p class="caption-text">Discover limited edition pieces crafted for everyday luxury. Timeless designs that elevate your wardrobe.</p>
            <div class="caption-features">
              <div class="feature-badge">
                <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Premium Quality
              </div>
              <div class="feature-badge">
                <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
                Sustainable
              </div>
            </div>
            <div class="caption-actions">
              <a class="btn-primary" href="#">
                <span>Explore Collection</span>
                <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a class="btn-ghost" href="#">View Lookbook</a>
            </div>
          </div>
        </div>
      </div>`,
      css: `.template-2{ height:100%; height:100%; border-radius:24px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.2); position:relative; }
      .template-2 .hero-img{ position:relative; height:100%; background-image:url('https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size:cover; background-position:center; display:flex; align-items:flex-end; transition:transform 0.3s ease; }
      .template-2 .hero-img:hover{ transform:scale(1.02); }
      .template-2 .hero-overlay{ position:absolute; inset:0; background:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0.85) 100%); }
      .template-2 .hero-effects{ position:absolute; top:40px; right:40px; z-index:2; }
      .template-2 .floating-badge{ padding:10px 24px; background:rgba(255,255,255,0.15); backdrop-filter:blur(20px); border-radius:30px; color:#fff; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; border:1px solid rgba(255,255,255,0.3); box-shadow:0 8px 24px rgba(0,0,0,0.2); animation:float 3s ease-in-out infinite; }
      .template-2 .hero-caption{ position:relative; z-index:2; color:#fff; padding:60px; max-width:700px; }
      .template-2 .caption-tag{ display:inline-flex; align-items:center; gap:8px; padding:8px 18px; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border-radius:20px; font-size:13px; font-weight:600; margin-bottom:20px; border:1px solid rgba(255,255,255,0.2); }
      .template-2 .tag-icon{ width:16px; height:16px; }
      .template-2 .caption-title{ font-size:clamp(36px,5vw,56px); font-weight:900; margin:0 0 20px 0; line-height:1.1; text-shadow:0 4px 20px rgba(0,0,0,0.4); }
      .template-2 .caption-text{ font-size:18px; line-height:1.7; margin:0 0 32px 0; opacity:0.95; max-width:560px; text-shadow:0 2px 10px rgba(0,0,0,0.3); }
      .template-2 .caption-features{ display:flex; gap:16px; margin-bottom:32px; flex-wrap:wrap; }
      .template-2 .feature-badge{ display:flex; align-items:center; gap:8px; padding:8px 16px; background:rgba(255,255,255,0.1); backdrop-filter:blur(10px); border-radius:20px; font-size:13px; font-weight:600; border:1px solid rgba(255,255,255,0.2); }
      .template-2 .badge-icon{ width:16px; height:16px; }
      .template-2 .caption-actions{ display:flex; gap:16px; flex-wrap:wrap; }
      .template-2 .btn-primary{ display:inline-flex; align-items:center; gap:12px; padding:18px 36px; border-radius:50px; background:#fff; color:#000; border:none; font-size:16px; font-weight:700; cursor:pointer; transition:all 0.3s ease; box-shadow:0 8px 24px rgba(0,0,0,0.3); text-decoration:none; text-transform:uppercase; letter-spacing:0.05em; }
      .template-2 .btn-primary:hover{ transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,0.4); background:#f5f5f5; }
      .template-2 .btn-arrow{ width:20px; height:20px; transition:transform 0.3s ease; }
      .template-2 .btn-primary:hover .btn-arrow{ transform:translateX(4px); }
      .template-2 .btn-ghost{ display:inline-flex; align-items:center; padding:18px 36px; border-radius:50px; border:2px solid rgba(255,255,255,0.4); background:rgba(255,255,255,0.1); backdrop-filter:blur(10px); color:#fff; font-size:16px; font-weight:600; cursor:pointer; transition:all 0.3s ease; text-decoration:none; }
      .template-2 .btn-ghost:hover{ background:rgba(255,255,255,0.2); border-color:rgba(255,255,255,0.6); transform:translateY(-2px); }
      @keyframes float{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-10px); } }
      @media(max-width:1024px){ .template-2{ min-height:600px; border-radius:16px; } .template-2 .hero-caption{ padding:40px; } .template-2 .caption-title{ font-size:36px; } .template-2 .caption-text{ font-size:16px; } .template-2 .hero-effects{ top:24px; right:24px; } }
      @media(max-width:640px){ .template-2{ min-height:500px; border-radius:12px; } .template-2 .hero-caption{ padding:24px; } .template-2 .caption-features{ flex-direction:column; gap:12px; } .template-2 .caption-actions{ flex-direction:column; width:100%; } .template-2 .btn-primary,.template-2 .btn-ghost{ width:100%; justify-content:center; padding:16px 28px; font-size:14px; } .template-2 .floating-badge{ font-size:10px; padding:8px 16px; } }`,
    },

    // 3 Hero - marquee
    {
      id: 'hero-marquee',
      name: 'Hero: Marquee',
      description: 'Scrolling marquee headline over a banner',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="template-3">
        <div class="marquee-bg"></div>
        <div class="marquee-container">
          <div class="marquee-wrapper">
            <div class="marquee-content">
              <span class="marquee-item">New Arrivals</span>
              <span class="marquee-separator">★</span>
              <span class="marquee-item">New Arrivals</span>
              <span class="marquee-separator">★</span>
              <span class="marquee-item">New Arrivals</span>
              <span class="marquee-separator">★</span>
              <span class="marquee-item">New Arrivals</span>
              <span class="marquee-separator">★</span>
            </div>
            <div class="marquee-content">
              <span class="marquee-item">New Arrivals</span>
              <span class="marquee-separator">★</span>
              <span class="marquee-item">New Arrivals</span>
              <span class="marquee-separator">★</span>
              <span class="marquee-item">New Arrivals</span>
              <span class="marquee-separator">★</span>
              <span class="marquee-item">New Arrivals</span>
              <span class="marquee-separator">★</span>
            </div>
          </div>
        </div>
      </div>`,
      css: `.template-3{ position:relative; height:100%; overflow:hidden; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); }
      .template-3 .marquee-bg{ position:absolute; inset:0; background-image:url('https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size:cover; background-position:center; opacity:0.15; filter:blur(2px); }
      .template-3 .marquee-container{ position:relative; width:100%; overflow:hidden; background:rgba(0,0,0,0.2); backdrop-filter:blur(10px); padding:40px 0; box-shadow:0 8px 32px rgba(0,0,0,0.1); }
      .template-3 .marquee-wrapper{ display:flex; width:fit-content; animation:scroll 25s linear infinite; }
      .template-3 .marquee-content{ display:flex; white-space:nowrap; padding-right:80px; }
      .template-3 .marquee-item{ font-size:32px; font-weight:900; letter-spacing:0.05em; text-transform:uppercase; background:linear-gradient(90deg,#ffffff 0%,#f0f0f0 50%,#ffffff 100%); background-clip:text; -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-shadow:0 4px 20px rgba(255,255,255,0.3); display:inline-block; }
      .template-3 .marquee-separator{ margin:0 30px; font-size:24px; color:rgba(255,255,255,0.6); }
      .template-3 .marquee-wrapper:hover{ animation-play-state:paused; }
      @keyframes scroll{ 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }`,
    },

    // 4 Large logo / Brand showcase
    {
      id: 'brand-logos',
      name: 'Large logo / Brand list',
      description: 'Row of partner or brand logos',
      category: 'Logos',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="template-4">
        <div class="logos-section">
          <div class="section-header">
            <p class="section-subtitle">Trusted by industry leaders</p>
            <h2 class="section-title">Our Partners</h2>
          </div>
          <div class="logos-container">
            <div class="logo-item">
              <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M129.2 618c-22.1 0-41.8-13.2-50.1-33.8-8.3-20.7-3.3-44 12.8-59.3 0.5-0.5 1-0.9 1.5-1.3l404.7-295.4c5.2-3.8 12.2-3.9 17.5-0.2l413 290.4c0.5 0.4 1.1 0.8 1.5 1.2 16.4 15.1 21.8 38.4 13.8 59.2-8.1 20.8-27.7 34.4-50.1 34.5L129.5 618h-0.3z m764.4-34.5l0.1 15-0.1-15c10.2-0.1 18.6-5.8 22.3-15.3 3.6-9.3 1.5-18.8-5.5-25.7L507.1 258.8 112 547.2c-6.9 7-8.8 16.6-5.1 25.8 3.8 9.4 12.1 15 22.3 15h0.2l764.2-4.5zM517.4 197.4c-8.3 0-15-6.7-15-15s6.7-15 15-15c32.4 0 58.7-26.3 58.7-58.7S549.8 50 517.4 50c-18.2 0-35.1 8.3-46.3 22.6-5.1 6.5-14.5 7.7-21.1 2.6-6.5-5.1-7.7-14.5-2.6-21.1 16.9-21.7 42.5-34.2 70-34.2 48.9 0 88.7 39.8 88.7 88.7 0 49-39.7 88.8-88.7 88.8z" fill="#0F53A8"></path><path d="M511.3 255.4c-8.3 0-15-6.7-15-15v-57.9c0-8.3 6.7-15 15-15s15 6.7 15 15v57.9c0 8.2-6.7 15-15 15z" fill="#0F53A8"></path><path d="M379.1 603h314.1v391.6H379.1z" fill="#89B7F5"></path><path d="M693.2 1009.6H379.1c-8.3 0-15-6.7-15-15V603c0-8.3 6.7-15 15-15h314.1c8.3 0 15 6.7 15 15v391.6c0 8.3-6.7 15-15 15z m-299.1-30h284.1V618H394.1v361.6z" fill="#0F53A8"></path><path d="M693.2 603H405.7v-41.1h226.5z" fill="#89B7F5"></path><path d="M693.2 618H405.7c-8.3 0-15-6.7-15-15v-41.2c0-8.3 6.7-15 15-15h226.4c3 0 5.9 0.9 8.4 2.6l61.1 41.2c5.5 3.7 7.9 10.5 6 16.8-2 6.3-7.8 10.6-14.4 10.6z m-272.5-30h223.4l-16.6-11.2H420.7V588z" fill="#0F53A8"></path><path d="M632.2 918.7H329.4V592.5c0-16.9 13.7-30.6 30.6-30.6h272.1v356.8z" fill="#B6CDEF"></path><path d="M632.2 933.7H329.4c-8.3 0-15-6.7-15-15V592.5c0-25.1 20.5-45.6 45.6-45.6h272.1c8.3 0 15 6.7 15 15v356.8c0.1 8.3-6.7 15-14.9 15z m-287.8-30h272.7V576.9H360c-8.6 0-15.6 7-15.6 15.6v311.2z" fill="#0F53A8"></path></g></svg>
            </div>
            <div class="logo-item">
              <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M129.2 618c-22.1 0-41.8-13.2-50.1-33.8-8.3-20.7-3.3-44 12.8-59.3 0.5-0.5 1-0.9 1.5-1.3l404.7-295.4c5.2-3.8 12.2-3.9 17.5-0.2l413 290.4c0.5 0.4 1.1 0.8 1.5 1.2 16.4 15.1 21.8 38.4 13.8 59.2-8.1 20.8-27.7 34.4-50.1 34.5L129.5 618h-0.3z m764.4-34.5l0.1 15-0.1-15c10.2-0.1 18.6-5.8 22.3-15.3 3.6-9.3 1.5-18.8-5.5-25.7L507.1 258.8 112 547.2c-6.9 7-8.8 16.6-5.1 25.8 3.8 9.4 12.1 15 22.3 15h0.2l764.2-4.5zM517.4 197.4c-8.3 0-15-6.7-15-15s6.7-15 15-15c32.4 0 58.7-26.3 58.7-58.7S549.8 50 517.4 50c-18.2 0-35.1 8.3-46.3 22.6-5.1 6.5-14.5 7.7-21.1 2.6-6.5-5.1-7.7-14.5-2.6-21.1 16.9-21.7 42.5-34.2 70-34.2 48.9 0 88.7 39.8 88.7 88.7 0 49-39.7 88.8-88.7 88.8z" fill="#0F53A8"></path><path d="M511.3 255.4c-8.3 0-15-6.7-15-15v-57.9c0-8.3 6.7-15 15-15s15 6.7 15 15v57.9c0 8.2-6.7 15-15 15z" fill="#0F53A8"></path><path d="M379.1 603h314.1v391.6H379.1z" fill="#89B7F5"></path><path d="M693.2 1009.6H379.1c-8.3 0-15-6.7-15-15V603c0-8.3 6.7-15 15-15h314.1c8.3 0 15 6.7 15 15v391.6c0 8.3-6.7 15-15 15z m-299.1-30h284.1V618H394.1v361.6z" fill="#0F53A8"></path><path d="M693.2 603H405.7v-41.1h226.5z" fill="#89B7F5"></path><path d="M693.2 618H405.7c-8.3 0-15-6.7-15-15v-41.2c0-8.3 6.7-15 15-15h226.4c3 0 5.9 0.9 8.4 2.6l61.1 41.2c5.5 3.7 7.9 10.5 6 16.8-2 6.3-7.8 10.6-14.4 10.6z m-272.5-30h223.4l-16.6-11.2H420.7V588z" fill="#0F53A8"></path><path d="M632.2 918.7H329.4V592.5c0-16.9 13.7-30.6 30.6-30.6h272.1v356.8z" fill="#B6CDEF"></path><path d="M632.2 933.7H329.4c-8.3 0-15-6.7-15-15V592.5c0-25.1 20.5-45.6 45.6-45.6h272.1c8.3 0 15 6.7 15 15v356.8c0.1 8.3-6.7 15-14.9 15z m-287.8-30h272.7V576.9H360c-8.6 0-15.6 7-15.6 15.6v311.2z" fill="#0F53A8"></path></g></svg>
            </div>
            <div class="logo-item">
              <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M129.2 618c-22.1 0-41.8-13.2-50.1-33.8-8.3-20.7-3.3-44 12.8-59.3 0.5-0.5 1-0.9 1.5-1.3l404.7-295.4c5.2-3.8 12.2-3.9 17.5-0.2l413 290.4c0.5 0.4 1.1 0.8 1.5 1.2 16.4 15.1 21.8 38.4 13.8 59.2-8.1 20.8-27.7 34.4-50.1 34.5L129.5 618h-0.3z m764.4-34.5l0.1 15-0.1-15c10.2-0.1 18.6-5.8 22.3-15.3 3.6-9.3 1.5-18.8-5.5-25.7L507.1 258.8 112 547.2c-6.9 7-8.8 16.6-5.1 25.8 3.8 9.4 12.1 15 22.3 15h0.2l764.2-4.5zM517.4 197.4c-8.3 0-15-6.7-15-15s6.7-15 15-15c32.4 0 58.7-26.3 58.7-58.7S549.8 50 517.4 50c-18.2 0-35.1 8.3-46.3 22.6-5.1 6.5-14.5 7.7-21.1 2.6-6.5-5.1-7.7-14.5-2.6-21.1 16.9-21.7 42.5-34.2 70-34.2 48.9 0 88.7 39.8 88.7 88.7 0 49-39.7 88.8-88.7 88.8z" fill="#0F53A8"></path><path d="M511.3 255.4c-8.3 0-15-6.7-15-15v-57.9c0-8.3 6.7-15 15-15s15 6.7 15 15v57.9c0 8.2-6.7 15-15 15z" fill="#0F53A8"></path><path d="M379.1 603h314.1v391.6H379.1z" fill="#89B7F5"></path><path d="M693.2 1009.6H379.1c-8.3 0-15-6.7-15-15V603c0-8.3 6.7-15 15-15h314.1c8.3 0 15 6.7 15 15v391.6c0 8.3-6.7 15-15 15z m-299.1-30h284.1V618H394.1v361.6z" fill="#0F53A8"></path><path d="M693.2 603H405.7v-41.1h226.5z" fill="#89B7F5"></path><path d="M693.2 618H405.7c-8.3 0-15-6.7-15-15v-41.2c0-8.3 6.7-15 15-15h226.4c3 0 5.9 0.9 8.4 2.6l61.1 41.2c5.5 3.7 7.9 10.5 6 16.8-2 6.3-7.8 10.6-14.4 10.6z m-272.5-30h223.4l-16.6-11.2H420.7V588z" fill="#0F53A8"></path><path d="M632.2 918.7H329.4V592.5c0-16.9 13.7-30.6 30.6-30.6h272.1v356.8z" fill="#B6CDEF"></path><path d="M632.2 933.7H329.4c-8.3 0-15-6.7-15-15V592.5c0-25.1 20.5-45.6 45.6-45.6h272.1c8.3 0 15 6.7 15 15v356.8c0.1 8.3-6.7 15-14.9 15z m-287.8-30h272.7V576.9H360c-8.6 0-15.6 7-15.6 15.6v311.2z" fill="#0F53A8"></path></g></svg>
            </div>
            <div class="logo-item">
              <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M129.2 618c-22.1 0-41.8-13.2-50.1-33.8-8.3-20.7-3.3-44 12.8-59.3 0.5-0.5 1-0.9 1.5-1.3l404.7-295.4c5.2-3.8 12.2-3.9 17.5-0.2l413 290.4c0.5 0.4 1.1 0.8 1.5 1.2 16.4 15.1 21.8 38.4 13.8 59.2-8.1 20.8-27.7 34.4-50.1 34.5L129.5 618h-0.3z m764.4-34.5l0.1 15-0.1-15c10.2-0.1 18.6-5.8 22.3-15.3 3.6-9.3 1.5-18.8-5.5-25.7L507.1 258.8 112 547.2c-6.9 7-8.8 16.6-5.1 25.8 3.8 9.4 12.1 15 22.3 15h0.2l764.2-4.5zM517.4 197.4c-8.3 0-15-6.7-15-15s6.7-15 15-15c32.4 0 58.7-26.3 58.7-58.7S549.8 50 517.4 50c-18.2 0-35.1 8.3-46.3 22.6-5.1 6.5-14.5 7.7-21.1 2.6-6.5-5.1-7.7-14.5-2.6-21.1 16.9-21.7 42.5-34.2 70-34.2 48.9 0 88.7 39.8 88.7 88.7 0 49-39.7 88.8-88.7 88.8z" fill="#0F53A8"></path><path d="M511.3 255.4c-8.3 0-15-6.7-15-15v-57.9c0-8.3 6.7-15 15-15s15 6.7 15 15v57.9c0 8.2-6.7 15-15 15z" fill="#0F53A8"></path><path d="M379.1 603h314.1v391.6H379.1z" fill="#89B7F5"></path><path d="M693.2 1009.6H379.1c-8.3 0-15-6.7-15-15V603c0-8.3 6.7-15 15-15h314.1c8.3 0 15 6.7 15 15v391.6c0 8.3-6.7 15-15 15z m-299.1-30h284.1V618H394.1v361.6z" fill="#0F53A8"></path><path d="M693.2 603H405.7v-41.1h226.5z" fill="#89B7F5"></path><path d="M693.2 618H405.7c-8.3 0-15-6.7-15-15v-41.2c0-8.3 6.7-15 15-15h226.4c3 0 5.9 0.9 8.4 2.6l61.1 41.2c5.5 3.7 7.9 10.5 6 16.8-2 6.3-7.8 10.6-14.4 10.6z m-272.5-30h223.4l-16.6-11.2H420.7V588z" fill="#0F53A8"></path><path d="M632.2 918.7H329.4V592.5c0-16.9 13.7-30.6 30.6-30.6h272.1v356.8z" fill="#B6CDEF"></path><path d="M632.2 933.7H329.4c-8.3 0-15-6.7-15-15V592.5c0-25.1 20.5-45.6 45.6-45.6h272.1c8.3 0 15 6.7 15 15v356.8c0.1 8.3-6.7 15-14.9 15z m-287.8-30h272.7V576.9H360c-8.6 0-15.6 7-15.6 15.6v311.2z" fill="#0F53A8"></path></g></svg>
            </div>
           
          </div>
        </div>
      </div>`,
      css: `
      .template-4{ padding:80px 24px; background:linear-gradient(180deg,#f8f9fa 0%,#ffffff 100%); min-height:100%; display:flex; align-items:center; justify-content:center; }
      .template-4 .logos-section{ max-width:1400px; width:100%; margin:0 auto; }
      .template-4 .section-header{ text-align:center; margin-bottom:60px; }
      .template-4 .section-subtitle{ font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#667eea; margin-bottom:12px; }
      .template-4 .section-title{ font-size:clamp(32px,4vw,48px); font-weight:800; color:#1a202c; margin:0; }
      .template-4 .logos-container{ display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:40px; align-items:center; justify-items:center; }
      .template-4 .logo-item{ padding:24px 32px; background:#ffffff; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.06); transition:all 0.3s ease; display:flex; align-items:center; justify-content:center; width:100%; max-width:240px; aspect-ratio:16/9; }
      .template-4 .logo-item:hover{ transform:translateY(-8px); box-shadow:0 12px 40px rgba(102,126,234,0.15); }
      .template-4 .logo-item img{ max-width:100%; max-height:60px; object-fit:contain; filter:grayscale(100%) opacity(0.6); transition:filter 0.3s ease; }
      .template-4 .logo-item:hover img{ filter:grayscale(0%) opacity(1); }
      @media (max-width:768px){ .template-4{ padding:60px 20px; } .template-4 .logos-container{ grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:24px; } .template-4 .logo-item{ padding:20px 24px; max-width:180px; } }`,
    },

    // 5 Slideshow (simple)
    {
      id: 'slideshow',
      name: 'Slideshow',
      description: 'Auto-rotating slideshow (static demo)',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="template-5">
        <div class="slideshow-container">
          <div class="slide active" style="background-image:url('https://images.unsplash.com/photo-1718985342149-7178154e0aee?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')">
            <div class="slide-overlay"></div>
            <div class="slide-content">
              <span class="slide-badge">New Collection</span>
              <h2 class="slide-title">Summer Essentials</h2>
              <p class="slide-description">Discover the latest trends for the season</p>
              <button class="slide-button">Shop Now</button>
            </div>
          </div>
          <div class="slide" style="background-image:url('https://plus.unsplash.com/premium_photo-1664202525979-80d1da46b34b?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')">
            <div class="slide-overlay"></div>
            <div class="slide-content">
              <span class="slide-badge">Limited Time</span>
              <h2 class="slide-title">Up to 50% Off</h2>
              <p class="slide-description">Exclusive deals on selected items</p>
              <button class="slide-button">View Deals</button>
            </div>
          </div>
          <div class="slide" style="background-image:url('https://images.unsplash.com/photo-1462392246754-28dfa2df8e6b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')">
            <div class="slide-overlay"></div>
            <div class="slide-content">
              <span class="slide-badge">Just Launched</span>
              <h2 class="slide-title">Premium Collection</h2>
              <p class="slide-description">Elevate your style with luxury pieces</p>
              <button class="slide-button">Explore</button>
            </div>
          </div>
          <div class="slide-indicators">
            <span class="indicator active"></span>
            <span class="indicator"></span>
            <span class="indicator"></span>
          </div>
        </div>
      </div>`,
      css: `.template-5{ position:relative; height:100%; overflow:hidden; background:#000; display:flex; align-items:center; justify-content:center;border-radius:20px; }
      .template-5 .slideshow-container{ position:relative; width:100%; height:100%; }
      .template-5 .slide{ position:absolute; inset:0; background-size:cover; background-position:center; opacity:0; transform:scale(1.1); animation:slideAnim 15s ease-in-out infinite; }
      .template-5 .slide:nth-child(1){ animation-delay:0s; }
      .template-5 .slide:nth-child(2){ animation-delay:5s; }
      .template-5 .slide:nth-child(3){ animation-delay:10s; }
      .template-5 .slide.active{ opacity:1; transform:scale(1); }
      .template-5 .slide-overlay{ position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.3) 100%); }
      .template-5 .slide-content{ position:relative; z-index:2; max-width:800px; padding:80px 60px; color:#fff; animation:slideContentAnim 15s ease-in-out infinite; opacity:0; }
      .template-5 .slide:nth-child(1) .slide-content{ animation-delay:0s; }
      .template-5 .slide:nth-child(2) .slide-content{ animation-delay:5s; }
      .template-5 .slide:nth-child(3) .slide-content{ animation-delay:10s; }
      .template-5 .slide-badge{ display:inline-block; padding:8px 20px; background:rgba(255,255,255,0.2); backdrop-filter:blur(10px); border-radius:30px; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:20px; border:1px solid rgba(255,255,255,0.3); }
      .template-5 .slide-title{ font-size:clamp(40px,6vw,80px); font-weight:900; line-height:1.1; margin:0 0 20px 0; text-shadow:0 4px 20px rgba(0,0,0,0.3); }
      .template-5 .slide-description{ font-size:clamp(16px,2vw,24px); line-height:1.6; margin:0 0 32px 0; opacity:0.95; max-width:600px; }
      .template-5 .slide-button{ padding:16px 48px; background:#fff; color:#000; border:none; border-radius:50px; font-size:16px; font-weight:700; cursor:pointer; transition:all 0.3s ease; box-shadow:0 8px 24px rgba(0,0,0,0.2); text-transform:uppercase; letter-spacing:0.05em; }
      .template-5 .slide-button:hover{ transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,0.3); background:#f0f0f0; }
      .template-5 .slide-indicators{ position:absolute; bottom:40px; left:50%; transform:translateX(-50%); z-index:10; display:flex; gap:12px; }
      .template-5 .indicator{ width:12px; height:12px; border-radius:50%; background:rgba(255,255,255,0.4); cursor:pointer; transition:all 0.3s ease; border:2px solid transparent; }
      .template-5 .indicator.active{ background:#fff; width:40px; border-radius:6px; }
      .template-5 .indicator:nth-child(1){ animation:indicatorAnim 15s ease-in-out infinite; animation-delay:0s; }
      .template-5 .indicator:nth-child(2){ animation:indicatorAnim 15s ease-in-out infinite; animation-delay:5s; }
      .template-5 .indicator:nth-child(3){ animation:indicatorAnim 15s ease-in-out infinite; animation-delay:10s; }
      @keyframes slideAnim{ 0%{ opacity:0; transform:scale(1.1); } 2%{ opacity:1; transform:scale(1); } 31%{ opacity:1; transform:scale(1); } 33%{ opacity:0; transform:scale(1.1); } 100%{ opacity:0; transform:scale(1.1); } }
      @keyframes slideContentAnim{ 0%{ opacity:0; transform:translateY(40px); } 2%{ opacity:1; transform:translateY(0); } 31%{ opacity:1; transform:translateY(0); } 33%{ opacity:0; transform:translateY(-40px); } 100%{ opacity:0; transform:translateY(-40px); } }
      @keyframes indicatorAnim{ 0%{ background:rgba(255,255,255,0.4); width:12px; border-radius:50%; } 2%{ background:#fff; width:40px; border-radius:6px; } 31%{ background:#fff; width:40px; border-radius:6px; } 33%{ background:rgba(255,255,255,0.4); width:12px; border-radius:50%; } 100%{ background:rgba(255,255,255,0.4); width:12px; border-radius:50%; } }
      @media (max-width:768px){ .template-5{ min-height:500px; } .template-5 .slide-content{ padding:40px 30px; } .template-5 .slide-description{ font-size:16px; } .template-5 .slide-button{ padding:14px 36px; font-size:14px; } }`,
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
      <div class="footer-1">
        <div class="container">
          <div class='text'>© 2025 Brand — All rights reserved</div>
        </div>
      </div>`,
      css: `
    .footer-1{padding:32px 24px;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e4e4e7;text-align:center;border-top:1px solid rgba(255,255,255,0.1);}
    .footer-1 .container{max-width:1400px;margin:0 auto;}
    .footer-1 .text{font-size:14px;font-weight:500;letter-spacing:0.3px;opacity:0.9;}`,
    },

    {
      id: 'footer-3col',
      name: 'Footer: 3 Columns',
      description: 'Classic 3-column footer with links and newsletter',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="footer-2">
        <div class="container f-grid">
          <div class="f-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Best Sellers</a></li>
              <li><a href="#">Sale</a></li>
              <li><a href="#">Collections</a></li>
            </ul>
          </div>
          <div class="f-col">
            <h4>About</h4>
            <ul>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div class="f-col newsletter">
            <h4>Newsletter</h4>
            <p>Subscribe for exclusive updates and offers</p>
            <div class="input-group">
              <input type="email" placeholder="Enter your email"/>
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div class="container f-bottom">
          <p>© 2025 Brand. All rights reserved.</p>
        </div>
      </div>`,
      css: `
      .footer-2{background:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);color:#e2e8f0;padding:64px 24px 32px;border-top:1px solid rgba(255,255,255,0.08);}
      .footer-2 .container{max-width:1400px;margin:0 auto;}
      .f-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:48px;margin-bottom:48px;}
      .f-col h4{font-size:16px;font-weight:700;margin-bottom:20px;color:#fff;letter-spacing:0.5px;text-transform:uppercase;font-size:14px;}
      .f-col ul{list-style:none;}
      .f-col ul li{margin-bottom:12px;}
      .f-col ul li a{color:#cbd5e1;font-size:15px;transition:all .2s ease;display:inline-block;position:relative;}
      .f-col ul li a::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#667eea,#764ba2);transition:width .3s ease;}
      .f-col ul li a:hover{color:#fff;padding-left:8px;}
      .f-col ul li a:hover::after{width:100%;}
      .newsletter p{color:#94a3b8;font-size:14px;margin-bottom:16px;line-height:1.6;}
      .input-group{display:flex;gap:8px;margin-top:16px;}
      .footer-2 input{flex:1;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px;transition:all .3s ease;}
      .footer-2 input::placeholder{color:#64748b;}
      .footer-2 input:focus{outline:none;border-color:rgba(102,126,234,0.5);background:rgba(255,255,255,0.08);box-shadow:0 0 0 3px rgba(102,126,234,0.1);}
      .footer-2 button{padding:14px 28px;border-radius:12px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border:none;font-weight:600;font-size:14px;cursor:pointer;transition:all .3s ease;white-space:nowrap;box-shadow:0 4px 15px rgba(102,126,234,0.3);}
      .footer-2 button:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(102,126,234,0.4);}
      .f-bottom{padding-top:32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;}
      .f-bottom p{color:#94a3b8;font-size:14px;font-weight:500;}
      @media(max-width:768px){.f-grid{grid-template-columns:1fr;gap:32px;}}`,
    },

    {
      id: 'footer-social',
      name: 'Footer: Social & payments',
      description: 'Footer with social icons and payment logos',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="footer-3">
        <div class="container f-row">
          <div class="left">© 2025 Brand</div>
          <div class="center payment-icons">
            <span class="pay-icon">💳</span>
            <span class="pay-icon">💵</span>
            <span class="pay-icon">🔒</span>
          </div>
          <div class="right social-links">
            <span class="follow-text">Follow us:</span>
            <a href="#" class="social-icon">📷</a>
            <a href="#" class="social-icon">📘</a>
            <a href="#" class="social-icon">🐦</a>
          </div>
        </div>
      </div>`,
      css: `
      .footer-3{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#e2e8f0;padding:28px 24px;border-top:1px solid rgba(255,255,255,0.1);}
      .footer-3 .container{max-width:1400px;margin:0 auto;}
      .f-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;}
      .left{font-size:14px;font-weight:600;color:#cbd5e1;}
      .payment-icons{display:flex;gap:12px;align-items:center;}
      .pay-icon{font-size:24px;opacity:0.8;transition:all .3s ease;cursor:pointer;}
      .pay-icon:hover{opacity:1;transform:scale(1.1);}
      .social-links{display:flex;align-items:center;gap:12px;}
      .follow-text{font-size:14px;color:#94a3b8;margin-right:8px;font-weight:500;}
      .social-icon{font-size:22px;text-decoration:none;transition:all .3s ease;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);}
      .social-icon:hover{background:rgba(102,126,234,0.2);border-color:rgba(102,126,234,0.3);transform:translateY(-3px);box-shadow:0 4px 12px rgba(102,126,234,0.2);}
      @media(max-width:768px){.f-row{flex-direction:column;text-align:center;}}`,
    },

    {
      id: 'footer-full',
      name: 'Footer: Full (links + newsletter + socials)',
      description: 'Comprehensive footer with many links and newsletter',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="footer-4">
        <div class="container">
          <div class="cols">
            <div class="f-col">
              <h4>Shop</h4>
              <ul>
                <li><a href="#">Collections</a></li>
                <li><a href="#">New Arrivals</a></li>
                <li><a href="#">Best Sellers</a></li>
                <li><a href="#">Sale</a></li>
              </ul>
            </div>
            <div class="f-col">
              <h4>Help</h4>
              <ul>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div class="f-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div class="f-col newsletter-col">
              <h4>Stay Updated</h4>
              <p class="newsletter-text">Get the latest updates and exclusive offers</p>
              <div class="input-wrapper">
                <input type="email" placeholder="Your email address"/>
                <button>→</button>
              </div>
              <div class="social-row">
                <a href="#" class="social-link">📷</a>
                <a href="#" class="social-link">📘</a>
                <a href="#" class="social-link">🐦</a>
                <a href="#" class="social-link">▶️</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© 2025 Brand. All rights reserved.</p>
            <div class="bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </div>`,
      css: `
      .footer-4{background:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);color:#e2e8f0;padding:72px 24px 32px;border-top:1px solid rgba(255,255,255,0.08);}
      .footer-4 .container{max-width:1400px;margin:0 auto;}
      .cols{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;margin-bottom:56px;}
      .f-col h4{font-size:14px;font-weight:700;margin-bottom:20px;color:#fff;letter-spacing:0.5px;text-transform:uppercase;}
      .f-col ul{list-style:none;}
      .f-col ul li{margin-bottom:12px;}
      .f-col ul li a{color:#cbd5e1;font-size:15px;transition:all .2s ease;display:inline-block;position:relative;}
      .f-col ul li a::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#667eea,#764ba2);transition:width .3s ease;}
      .f-col ul li a:hover{color:#fff;padding-left:8px;}
      .f-col ul li a:hover::after{width:100%;}
      .newsletter-col{grid-column:span 1;}
      .newsletter-text{color:#94a3b8;font-size:14px;margin-bottom:16px;line-height:1.6;}
      .input-wrapper{display:flex;gap:8px;margin-bottom:20px;}
      .footer-4 input{flex:1;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px;transition:all .3s ease;}
      .footer-4 input::placeholder{color:#64748b;}
      .footer-4 input:focus{outline:none;border-color:rgba(102,126,234,0.5);background:rgba(255,255,255,0.08);box-shadow:0 0 0 3px rgba(102,126,234,0.1);}
      .footer-4 button{padding:14px 20px;border-radius:12px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border:none;font-weight:600;font-size:18px;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 15px rgba(102,126,234,0.3);}
      .footer-4 button:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(102,126,234,0.4);}
      .social-row{display:flex;gap:10px;}
      .social-link{font-size:20px;width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);transition:all .3s ease;text-decoration:none;}
      .social-link:hover{background:rgba(102,126,234,0.2);border-color:rgba(102,126,234,0.3);transform:translateY(-3px);box-shadow:0 4px 12px rgba(102,126,234,0.2);}
      .footer-bottom{padding-top:32px;border-top:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
      .footer-bottom p{color:#94a3b8;font-size:14px;font-weight:500;}
      .bottom-links{display:flex;gap:24px;}
      .bottom-links a{color:#94a3b8;font-size:14px;text-decoration:none;transition:color .2s ease;}
      .bottom-links a:hover{color:#fff;}
      @media(max-width:968px){.cols{grid-template-columns:repeat(2,1fr);}.newsletter-col{grid-column:span 2;}}
      @media(max-width:640px){.cols{grid-template-columns:1fr;}.newsletter-col{grid-column:span 1;}.footer-bottom{flex-direction:column;text-align:center;}}`,
    },

    {
      id: 'footer-payments',
      name: 'Footer: Payments & small print',
      description: 'Payment icons with terms and small print',
      category: 'Footer',
      icon: <TemplateSessionIcon />,
      html: `
      <div class="footer-5">
        <div class="container">
          <div class="pay-methods">
            <span class="method-label">We accept:</span>
            <div class="pay-icons">
              <span class="payment-badge">💳 VISA</span>
              <span class="payment-badge">💳 MC</span>
              <span class="payment-badge">💰 PayPal</span>
              <span class="payment-badge">🍎 Pay</span>
            </div>
          </div>
          <div class="security-badge">
            <span class="secure-icon">🔒</span>
            <span class="secure-text">Secure Checkout</span>
          </div>
          <p class="small-print">Prices shown in USD. Taxes and shipping calculated at checkout. <br>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>`,
      css: `
      .footer-5{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#cbd5e1;padding:40px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);}
      .footer-5 .container{max-width:1000px;margin:0 auto;}
      .pay-methods{margin-bottom:24px;}
      .method-label{display:block;font-size:13px;color:#94a3b8;margin-bottom:16px;font-weight:600;text-transform:uppercase;letter-spacing:1px;}
      .pay-icons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;}
      .payment-badge{padding:10px 18px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:10px;font-size:14px;font-weight:600;color:#e2e8f0;transition:all .3s ease;display:inline-flex;align-items:center;gap:6px;}
      .payment-badge:hover{background:rgba(255,255,255,0.12);border-color:rgba(102,126,234,0.3);transform:translateY(-2px);box-shadow:0 4px 12px rgba(102,126,234,0.15);}
      .security-badge{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:12px;margin-bottom:24px;}
      .secure-icon{font-size:18px;}
      .secure-text{font-size:14px;font-weight:600;color:#86efac;}
      .small-print{font-size:13px;color:#64748b;line-height:1.7;max-width:700px;margin:0 auto;}
      @media(max-width:640px){.pay-icons{gap:8px;}.payment-badge{padding:8px 14px;font-size:13px;}}`,
    },
  ],
};

//     // 6 Collection Spotlight
//     {
//       id: 'collection-spotlight',
//       name: 'Collection links: Spotlight',
//       description: 'Two large cards highlighting collections',
//       category: 'Collections',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="spotlight-wrapper">
//   <a class="spot-card">
//     <img src="https://source.unsplash.com/800x800?bag" />
//     <div class="meta"><h3>New Bags</h3><p>Modern designs</p></div>
//   </a>
//   <a class="spot-card">
//     <img src="https://source.unsplash.com/800x800?shoes" />
//     <div class="meta"><h3>Sneakers</h3><p>Comfort & style</p></div>
//   </a>
// </section>`,
//       css: `
// .spotlight-wrapper{ display:grid; grid-template-columns:repeat(2,1fr); gap:24px; padding:32px 16px; max-width:1200px; margin:0 auto; }
// .spot-card{ display:block; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.06); text-decoration:none; color:inherit; }
// .spot-card img{ width:100%; height:420px; object-fit:cover; }
// .spot-card .meta{ padding:16px; }`,
//     },

//     // 7 Collection carousel (static grid fallback)
//     {
//       id: 'collection-carousel',
//       name: 'Collection list: Carousel',
//       description: 'Carousel style list (static grid for demo)',
//       category: 'Collections',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="collection-carousel">
//   <div class="container grid">
//     <article class="col"><img src="https://source.unsplash.com/600x600?jacket"/><h4>Outerwear</h4></article>
//     <article class="col"><img src="https://source.unsplash.com/600x600?jeans"/><h4>Denim</h4></article>
//     <article class="col"><img src="https://source.unsplash.com/600x600?dress"/><h4>Dresses</h4></article>
//   </div>
// </section>`,
//       css: `
// .collection-carousel .grid{ display:flex; gap:20px; padding:24px 16px; max-width:1200px; margin:0 auto; }
// .collection-carousel .col{ width:33%; border-radius:10px; overflow:hidden; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,0.04); }
// .collection-carousel img{ width:100%; height:260px; object-fit:cover; }`,
//     },

//     // 8 Bento grid (4-up)
//     {
//       id: 'bento-grid',
//       name: 'Collection list: Bento',
//       description: 'Asymmetrical bento grid layout',
//       category: 'Collections',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="bento">
//   <div class="container bento-grid">
//     <div class="big"> <img src="https://source.unsplash.com/800x800?outfit"/></div>
//     <div class="small"> <img src="https://source.unsplash.com/400x400?top"/></div>
//     <div class="small"> <img src="https://source.unsplash.com/400x400?pants"/></div>
//     <div class="small"> <img src="https://source.unsplash.com/400x400?shoes"/></div>
//   </div>
// </section>`,
//       css: `
// .bento-grid{ display:grid; grid-template-columns:2fr 1fr; grid-auto-rows:200px; gap:16px; max-width:1200px; margin:0 auto; }
// .bento-grid .big{ grid-row:span 2; border-radius:12px; overflow:hidden; }
// .bento-grid img{ width:100%; height:100%; object-fit:cover; display:block; }`,
//     },

//     // 9 Product grid - featured
//     {
//       id: 'product-grid',
//       name: 'Product grid',
//       description: '3-up product cards with price and add to cart',
//       category: 'Products',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="products">
//   <div class="container product-grid">
//     <article class="card">
//       <div class="img" style="background-image:url('https://source.unsplash.com/600x600?shirt')"></div>
//       <h4>Classic Tee</h4>
//       <p class="price">$29.00</p>
//       <button>Add to cart</button>
//     </article>
//     <article class="card">
//       <div class="img" style="background-image:url('https://source.unsplash.com/600x600?polo')"></div>
//       <h4>Stripe Polo</h4>
//       <p class="price">$39.00</p>
//       <button>Add to cart</button>
//     </article>
//     <article class="card">
//       <div class="img" style="background-image:url('https://source.unsplash.com/600x600?jeans')"></div>
//       <h4>Denim</h4>
//       <p class="price">$79.00</p>
//       <button>Add to cart</button>
//     </article>
//   </div>
// </section>`,
//       css: `
// .product-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding:32px 16px; max-width:1200px; margin:0 auto; }
// .card{ background:#fff; border-radius:12px; padding:12px; text-align:left; box-shadow:0 8px 24px rgba(0,0,0,0.04); }
// .card .img{ height:320px; background-size:cover; background-position:center; border-radius:8px; margin-bottom:12px; }
// .card .price{ color:#111; font-weight:600; margin:8px 0; }
// .card button{ padding:10px 14px; border-radius:8px; background:#000; color:#fff; border:none; cursor:pointer; }

// /* responsive */
// @media (max-width:900px){ .product-grid{ grid-template-columns:repeat(2,1fr);} }
// @media (max-width:600px){ .product-grid{ grid-template-columns:1fr;} }`,
//     },

//     // 10 Featured product (single product highlight)
//     {
//       id: 'featured-product',
//       name: 'Featured product',
//       description: 'Single product with gallery & details',
//       category: 'Products',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="featured-product">
//   <div class="container fp-grid">
//     <div class="media" style="background-image:url('https://source.unsplash.com/900x900?product')"></div>
//     <div class="info">
//       <h2>Signature Jacket</h2>
//       <p class="price">$249</p>
//       <p>Expertly crafted with premium materials. Limited sizes available.</p>
//       <button>Add to cart</button>
//     </div>
//   </div>
// </section>`,
//       css: `
// .fp-grid{ display:grid; grid-template-columns:1fr 1fr; gap:28px; max-width:1200px; margin:0 auto; padding:40px 16px; }
// .media{ height:520px; background-size:cover; background-position:center; border-radius:12px; }
// .info h2{ margin-top:0; }
// .info .price{ font-size:20px; font-weight:700; margin:12px 0; }
// .info button{ padding:12px 16px; border-radius:8px; background:#000; color:#fff; }
// @media (max-width:900px){ .fp-grid{ grid-template-columns:1fr; } .media{ height:420px; } }`,
//     },

//     // 11 Testimonial
//     {
//       id: 'testimonial',
//       name: 'Testimonial',
//       description: 'Customer review card with avatar',
//       category: 'Testimonials',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="testimonials">
//   <div class="container">
//     <blockquote>
//       "Absolutely love the quality — fits perfectly and arrived fast."
//       <cite>— Jane D.</cite>
//     </blockquote>
//   </div>
// </section>`,
//       css: `
// .testimonials{ padding:40px 16px; background:#fff; }
// .testimonials blockquote{ max-width:800px; margin:0 auto; font-size:20px; line-height:1.6; color:#222; font-style:italic; }
// .testimonials cite{ display:block; margin-top:12px; font-style:normal; color:#666; }`,
//     },

//     // 12 Blog posts (3 col)
//     {
//       id: 'blog-grid',
//       name: 'Blog posts',
//       description: 'Three recent blog posts with excerpt',
//       category: 'Blog',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="blog-grid">
//   <div class="container posts">
//     <article><img src="https://source.unsplash.com/600x400?blog"/><h4>How to style</h4><p>Quick tips for your wardrobe.</p></article>
//     <article><img src="https://source.unsplash.com/600x400?lifestyle"/><h4>Behind the scenes</h4><p>Design process revealed.</p></article>
//     <article><img src="https://source.unsplash.com/600x400?travel"/><h4>Travel tips</h4><p>Pack smarter for trips.</p></article>
//   </div>
// </section>`,
//       css: `
// .posts{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; max-width:1200px; margin:0 auto; padding:32px 16px; }
// .posts img{ width:100%; height:200px; object-fit:cover; border-radius:8px; }
// .posts h4{ margin:12px 0 6px; }
// @media (max-width:900px){ .posts{ grid-template-columns:repeat(2,1fr);} }
// @media (max-width:600px){ .posts{ grid-template-columns:1fr;} }`,
//     },

//     // 13 Newsletter
//     {
//       id: 'newsletter',
//       name: 'Newsletter signup',
//       description: 'Centered newsletter block with input',
//       category: 'Newsletter',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="newsletter">
//   <div class="container">
//     <h3>Join our newsletter</h3>
//     <p>Get 10% off your first order.</p>
//     <div class="form"><input placeholder="Email address"/><button>Subscribe</button></div>
//   </div>
// </section>`,
//       css: `
// .newsletter{ background:#fafafa; padding:40px 16px; text-align:center; }
// .newsletter .form{ display:flex; gap:8px; justify-content:center; margin-top:12px; max-width:600px; margin-left:auto; margin-right:auto; }
// .newsletter input{ padding:12px 14px; border-radius:8px; border:1px solid rgba(0,0,0,0.08); flex:1; }
// .newsletter button{ padding:12px 16px; border-radius:8px; background:#000; color:#fff; border:none; }`,
//     },

//     // 14 Image with text (side by side)
//     {
//       id: 'image-text',
//       name: 'Image with text',
//       description: 'Image left, text right — used for features',
//       category: 'Image & Text',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="image-text">
//   <div class="container it-grid">
//     <div class="it-media" style="background-image:url('https://source.unsplash.com/900x700?detail');"></div>
//     <div class="it-text">
//       <h3>Quality Materials</h3>
//       <p>We carefully select sustainable fabrics for longevity.</p>
//       <a class="link">Learn more →</a>
//     </div>
//   </div>
// </section>`,
//       css: `
// .it-grid{ display:grid; grid-template-columns:1fr 1fr; gap:28px; max-width:1200px; margin:0 auto; padding:40px 16px; }
// .it-media{ height:420px; background-size:cover; background-position:center; border-radius:12px; }
// .it-text h3{ margin-top:0; }
// @media (max-width:900px){ .it-grid{ grid-template-columns:1fr; } .it-media{ height:300px; } }`,
//     },

//     // 15 Image banner (full width)
//     {
//       id: 'image-banner',
//       name: 'Image banner (full)',
//       description: 'Edge-to-edge image banner with overlay',
//       category: 'Banners',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="img-banner">
//   <div class="banner" style="background-image:url('https://source.unsplash.com/1600x600?fashion');">
//     <div class="overlay">
//       <h2>Timeless Essentials</h2>
//       <a class="btn">Shop the collection</a>
//     </div>
//   </div>
// </section>`,
//       css: `
// .img-banner .banner{ height:360px; background-size:cover; background-position:center; display:flex; align-items:center; }
// .img-banner .overlay{ margin-left:8%; color:#fff; text-shadow:0 6px 20px rgba(0,0,0,0.5); }
// .img-banner .btn{ background:#000; color:#fff; padding:10px 14px; border-radius:8px; }`,
//     },

//     // 16 Video banner (poster fallback)
//     {
//       id: 'video-banner',
//       name: 'Video banner (poster)',
//       description: 'Video hero area — static poster for demo',
//       category: 'Banners',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="video-banner">
//   <div class="poster" style="background-image:url('https://source.unsplash.com/1600x900?video')">
//     <button class="play">▶</button>
//   </div>
// </section>`,
//       css: `
// .video-banner .poster{ height:420px; background-size:cover; background-position:center; display:flex; align-items:center; justify-content:center; border-radius:12px; }
// .play{ background:rgba(0,0,0,0.6); color:#fff; font-size:28px; padding:16px 18px; border-radius:999px; border:none; cursor:pointer; }`,
//     },

//     // 17 FAQ accordion (static)
//     {
//       id: 'faq',
//       name: 'FAQ (accordion)',
//       description: 'Simple FAQ list (static open state demo)',
//       category: 'Text',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="faq">
//   <div class="container">
//     <details open><summary>What is your return policy?</summary><p>30-day returns on unworn items.</p></details>
//     <details><summary>How long is shipping?</summary><p>2-7 business days depending on location.</p></details>
//   </div>
// </section>`,
//       css: `
// .faq details{ background:#fff; padding:16px; border-radius:8px; margin-bottom:10px; box-shadow:0 6px 18px rgba(0,0,0,0.04); }
// .faq summary{ cursor:pointer; font-weight:600; }`,
//     },

//     // 18 Icon list / features
//     {
//       id: 'icons-features',
//       name: 'Icons with text',
//       description: 'Small icon + title + short description list',
//       category: 'Features',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="features">
//   <div class="container feats">
//     <div class="feat"><div class="ico">🚚</div><h4>Free Shipping</h4><p>Over $75</p></div>
//     <div class="feat"><div class="ico">🔁</div><h4>Free Returns</h4><p>30 days</p></div>
//     <div class="feat"><div class="ico">⭐</div><h4>Top Quality</h4><p>Curated materials</p></div>
//   </div>
// </section>`,
//       css: `
// .feats{ display:flex; gap:24px; align-items:center; justify-content:center; padding:28px 16px; }
// .feat{ text-align:center; max-width:220px; }
// .feat .ico{ font-size:28px; margin-bottom:8px; }`,
//     },

//     // 19 Lookbook grid
//     {
//       id: 'lookbook',
//       name: 'Lookbook grid',
//       description: 'Visual editorial style grid',
//       category: 'Lookbook',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="lookbook">
//   <div class="container lb-grid">
//     <figure><img src="https://source.unsplash.com/600x900?model1"/></figure>
//     <figure><img src="https://source.unsplash.com/600x900?model2"/></figure>
//     <figure><img src="https://source.unsplash.com/600x900?model3"/></figure>
//   </div>
// </section>`,
//       css: `
// .lb-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; max-width:1200px; margin:0 auto; padding:24px 16px; }
// .lb-grid img{ width:100%; height:100%; object-fit:cover; border-radius:8px; }`,
//     },

//     // 20 Shoppable image (static hotspots demo)
//     {
//       id: 'shoppable-image',
//       name: 'Shoppable image (hotspots)',
//       description: 'Image with product hotspots (static markers)',
//       category: 'Shoppable',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="shoppable">
//   <div class="container shop-img" style="background-image:url('https://source.unsplash.com/1200x700?outfit')">
//     <button class="hotspot" style="left:30%; top:40%;">$79</button>
//     <button class="hotspot" style="left:65%; top:60%;">$49</button>
//   </div>
// </section>`,
//       css: `
// .shop-img{ height:500px; background-size:cover; background-position:center; position:relative; border-radius:12px; margin:24px 16px; }
// .hotspot{ position:absolute; transform:translate(-50%,-50%); background:#fff; border-radius:999px; padding:8px 10px; border:1px solid rgba(0,0,0,0.08); cursor:pointer; }`,
//     },

//     // 21 Product carousel (horizontal scroller static)
//     {
//       id: 'product-scroller',
//       name: 'Product scroller',
//       description: 'Horizontal scroller row of products',
//       category: 'Products',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="product-scroller">
//   <div class="container scroller">
//     <div class="item"><img src="https://source.unsplash.com/400x400?product1"/><h5>Item A</h5></div>
//     <div class="item"><img src="https://source.unsplash.com/400x400?product2"/><h5>Item B</h5></div>
//     <div class="item"><img src="https://source.unsplash.com/400x400?product3"/><h5>Item C</h5></div>
//   </div>
// </section>`,
//       css: `
// .scroller{ display:flex; gap:16px; overflow-x:auto; padding:20px 16px; }
// .item{ min-width:220px; border-radius:12px; background:#fff; padding:12px; box-shadow:0 8px 20px rgba(0,0,0,0.04); }
// .item img{ width:100%; height:200px; object-fit:cover; border-radius:8px; }`,
//     },

//     // 22 Rich text (long content)
//     {
//       id: 'rich-text',
//       name: 'Rich text / HTML',
//       description: 'Long copy area for custom content',
//       category: 'Text',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="rich-text">
//   <div class="container">
//     <h2>About our brand</h2>
//     <p>Founded on the belief that great design should be accessible to everyone...</p>
//     <h3>Our mission</h3>
//     <p>We focus on sustainability and quality.</p>
//   </div>
// </section>`,
//       css: `
// .rich-text{ padding:40px 16px; max-width:900px; margin:0 auto; color:#222; }
// .rich-text h2{ font-size:28px; }`,
//     },

//     // 23 Contact form
//     {
//       id: 'contact-form',
//       name: 'Contact form',
//       description: 'Simple contact form with fields',
//       category: 'Forms',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="contact">
//   <div class="container contact-inner">
//     <form><input placeholder="Name"/><input placeholder="Email"/><textarea placeholder="Message"></textarea><button>Send</button></form>
//   </div>
// </section>`,
//       css: `
// .contact-inner form{ display:flex; flex-direction:column; gap:10px; max-width:600px; margin:0 auto; padding:32px 16px; }
// .contact-inner input, .contact-inner textarea{ padding:12px; border-radius:8px; border:1px solid rgba(0,0,0,0.08); }
// .contact-inner button{ padding:12px; border-radius:8px; background:#000; color:#fff; border:none; cursor:pointer; }`,
//     },

//     // 24 Map (static placeholder)
//     {
//       id: 'map',
//       name: 'Map placeholder',
//       description: 'Static map area (embed external map in real site)',
//       category: 'Map',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="map-block">
//   <div class="container map" style="background:#e9e9e9; height:360px; display:flex; align-items:center; justify-content:center;">
//     <p>Map embed placeholder</p>
//   </div>
// </section>`,
//       css: `
// .map-block .map{ border-radius:12px; }`,
//     },

//     // 25 Promo grid (cards)
//     {
//       id: 'promo-grid',
//       name: 'Promo grid',
//       description: 'Small promotional cards',
//       category: 'Promos',
//       icon: <TemplateSessionIcon />,
//       html: `
// <section class="promo">
//   <div class="container promo-grid">
//     <a class="promo-card"><h4>Sale</h4><p>Up to 50% off</p></a>
//     <a class="promo-card"><h4>New</h4><p>Limited drops</p></a>
//     <a class="promo-card"><h4>Gift</h4><p>Free gift wrapping</p></a>
//   </div>
// </section>`,
//       css: `
// .promo-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; max-width:1200px; margin:0 auto; padding:24px 16px; }
// .promo-card{ background:#fff; padding:20px; border-radius:12px; box-shadow:0 8px 20px rgba(0,0,0,0.04); text-decoration:none; color:inherit; }`,
//     },
