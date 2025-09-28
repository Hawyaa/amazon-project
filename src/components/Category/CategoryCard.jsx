import React from 'react'
import classes from './category.module.css'
import { Link } from 'react-router-dom'
function CategoryCard({ data }) {
  // Add safety check to prevent undefined errors
  if (!data) {
    return (
      <div className={classes.category}>
        <div>Loading category...</div>
      </div>
    )
  }

  const { title = 'Unknown Category', imgLink = '' } = data

  return (
    <div className={classes.category}>
      <Link to={`/category/${data.name}`}>
        <span>
          <h2>{title}</h2>
        </span>
        <img src={imgLink} alt={title} />
        <p>shop now</p>
      </Link>
    </div>
  )
}

export default CategoryCard