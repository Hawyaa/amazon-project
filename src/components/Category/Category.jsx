import React from 'react'
import { categoryFullInfo } from './categoryFullInfos' // Make sure this path is correct
import CategoryCard from './CategoryCard'
import styles from './category.module.css'

function Category() {
    // Check if categoryFullInfo exists and is an array
    if (!categoryFullInfo || !Array.isArray(categoryFullInfo)) {
        return <div>No categories available</div>;
    }

    return (
        <section className={styles.category__container}>
            {categoryFullInfo.map((infos) => ( 
                <CategoryCard data={infos} key={infos.title} /> 
            ))}
        </section>
    )
}

export default Category