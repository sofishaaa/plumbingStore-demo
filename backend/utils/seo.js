import fs from 'fs';
import { isObjectIdOrHexString } from 'mongoose';
import Product from '../models/productModel.js';
import escapeHtml from './escapeHtml.js';

const SHOP_NAME = 'Сантех Студія';
const DEFAULT_TITLE = 'Сантех Студія — магазин сантехніки у Львові';
const DEFAULT_DESCRIPTION =
  'Рушникосушки, унітази, змішувачі, тумби, ванни та інша сантехніка з доставкою Новою Поштою по всій Україні';

// Публічні сторінки для sitemap.xml
const STATIC_PAGES = ['/', '/delivery-payment', '/returns', '/terms', '/privacy'];

const DISALLOWED_PATHS = [
  '/admin/',
  '/cart',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password/',
  '/profile',
  '/shipping',
  '/payment',
  '/placeorder',
  '/order/',
  '/api/',
];

const siteUrl = () => (process.env.CLIENT_URL || '').replace(/\/$/, '');

const absoluteUrl = (path) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl()}${path.startsWith('/') ? '' : '/'}${path}`;

const truncate = (text, maxLength) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}…` : clean;
};

// JSON усередині <script>: екрануємо "<", щоб рядок не закрив тег
const safeJson = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

const robotsTxt = (req, res) => {
  const lines = [
    'User-agent: *',
    ...DISALLOWED_PATHS.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${siteUrl()}/sitemap.xml`,
  ];
  res.type('text/plain').send(lines.join('\n'));
};

const sitemapXml = async (req, res, next) => {
  try {
    const products = await Product.find({}, '_id updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    const urls = [
      ...STATIC_PAGES.map((path) => ({ loc: `${siteUrl()}${path}` })),
      ...products.map((product) => ({
        loc: `${siteUrl()}/product/${product._id}`,
        lastmod: product.updatedAt?.toISOString(),
      })),
    ];

    const body = urls
      .map(
        ({ loc, lastmod }) =>
          `  <url><loc>${escapeHtml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
      )
      .join('\n');

    res
      .type('application/xml')
      .send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`
      );
  } catch (error) {
    next(error);
  }
};

const productMeta = (product, url) => {
  const title = `${product.name} — купити за ${product.price.toLocaleString('uk-UA')} грн | ${SHOP_NAME}`;
  const description = truncate(product.description, 160);
  const image = absoluteUrl(product.image);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [image],
    description,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'UAH',
      price: product.price,
      availability:
        product.countInStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    ...(product.numReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(product.rating.toFixed(1)),
        reviewCount: product.numReviews,
      },
    }),
  };

  return { title, description, image, type: 'product', url, jsonLd };
};

const metaTags = ({ title, description, image, type, url, jsonLd }) => {
  // data-rh — щоб react-helmet на клієнті замінював ці теги, а не дублював
  const tags = [
    `<meta name="description" content="${escapeHtml(description)}" data-rh="true">`,
    `<link rel="canonical" href="${escapeHtml(url)}" data-rh="true">`,
    `<meta property="og:site_name" content="${SHOP_NAME}" data-rh="true">`,
    `<meta property="og:locale" content="uk_UA" data-rh="true">`,
    `<meta property="og:type" content="${type}" data-rh="true">`,
    `<meta property="og:title" content="${escapeHtml(title)}" data-rh="true">`,
    `<meta property="og:description" content="${escapeHtml(description)}" data-rh="true">`,
    `<meta property="og:url" content="${escapeHtml(url)}" data-rh="true">`,
    `<meta property="og:image" content="${escapeHtml(image)}" data-rh="true">`,
  ];
  if (jsonLd) {
    tags.push(`<script type="application/ld+json">${safeJson(jsonLd)}</script>`);
  }
  return tags.join('');
};

// Рендер index.html з title, description і Open Graph під конкретну сторінку.
// Соцмережі та месенджери (Viber, Telegram, Facebook) не виконують JavaScript,
// тому без цього превʼю посилання на товар було б однаковим для всіх сторінок.
const createIndexRenderer = (indexPath) => {
  let template;

  return async (req) => {
    template ??= fs.readFileSync(indexPath, 'utf8');

    const url = `${siteUrl()}${req.path}`;
    let meta = {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      image: absoluteUrl('/web-app-manifest-512x512.png'),
      type: 'website',
      url,
    };

    const match = req.path.match(/^\/product\/([^/]+)\/?$/);
    if (match && isObjectIdOrHexString(match[1])) {
      const product = await Product.findById(
        match[1],
        'name description image brand category price countInStock rating numReviews'
      ).lean();
      if (product) meta = productMeta(product, url);
    }

    // Функції замість рядків: у replace рядок трактує "$&", "$1" як шаблони
    return template
      .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(meta.title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, () => '')
      .replace('</head>', () => `${metaTags(meta)}</head>`);
  };
};

export { robotsTxt, sitemapXml, createIndexRenderer };
