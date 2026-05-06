import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className='rating'>
      {stars.map((star) => (
        <span key={star}>
          {value >= star ? (
            <FaStar color='orange' />
          ) : value >= star - 0.5 ? (
            <FaStarHalfAlt color='orange' />
          ) : (
            <FaRegStar color='orange' />
          )}
        </span>
      ))}
      {text && <span className='rating-text'>{text}</span>}
    </div>
  );
};

export default Rating;
