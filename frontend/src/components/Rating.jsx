import React from 'react'
import  {FaStar, FaStarHalfAlt, FaRegStar} from 'react-icons/fa'

export const Rating = ({ value, text }) => {
  return (
    <div className='raiting'>
      <span>
        {value >= 1 ? (
          <FaStar color='orange' />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt color='orange' />
        ) : (
          <FaRegStar color='orange' />
        )}
      </span>
      <span>
        {value >= 2 ? (
          <FaStar color='orange' />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt color='orange' />
        ) : (
          <FaRegStar color='orange' />
        )}
      </span>
      <span>
        {value >= 3 ? (
          <FaStar color='orange' />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt color='orange' />
        ) : (
          <FaRegStar color='orange' />
        )}
      </span>
      <span>
        {value >= 4 ? (
          <FaStar color='orange' />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt color='orange' />
        ) : (
          <FaRegStar color='orange' />
        )}
      </span>
      <span>
        {value >= 5 ? (
          <FaStar color='orange' />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt color='orange' />
        ) : (
          <FaRegStar color='orange' />
        )}
      </span>
      <span className="rating-text">{text && text}</span>
    </div>
  )
}
export default Rating