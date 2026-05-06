import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => (
  <Helmet>
    <title>{title}</title>
    <meta name='description' content={description} />
    <meta name='keywords' content={keywords} />
  </Helmet>
);

Meta.defaultProps = {
  title: 'Сантех Студія — магазин сантехніки',
  description: 'Рушникосушки, унітази, змішувачі, тумби та інша сантехніка за найкращими цінами',
  keywords: 'сантехніка, рушникосушки, унітази, змішувачі, ванни, тумби',
};

export default Meta;
