import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'Сантех Студія — магазин сантехніки у Львові';
const DEFAULT_DESCRIPTION =
  'Рушникосушки, унітази, змішувачі, тумби, ванни та інша сантехніка з доставкою Новою Поштою по всій Україні';

// Ті самі теги сервер підставляє в HTML для пошукових систем і месенджерів
// (backend/utils/seo.js); тут вони оновлюються під час навігації по сайту
const Meta = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image,
  type = 'website',
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name='description' content={description} />
    <meta property='og:site_name' content='Сантех Студія' />
    <meta property='og:locale' content='uk_UA' />
    <meta property='og:type' content={type} />
    <meta property='og:title' content={title} />
    <meta property='og:description' content={description} />
    {image && <meta property='og:image' content={image} />}
  </Helmet>
);

export default Meta;
