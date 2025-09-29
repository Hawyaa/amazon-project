import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'
import Loader from '../Loader/Loader'
import styles from './Product.module.css' // ✅ CSS module import

function Product() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        axios.get('https://fakestoreapi.com/products')
            .then((res) => {
                setProducts(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setError('Failed to fetch products')
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return <div className={styles.error}>{error}</div>
    }

    if (products.length === 0) {
        return <div className={styles.empty}>No products found</div>
    }

    return (
        <section className={styles.products_container}>
            {products.slice(0, 20).map((singleProduct) => (
                <ProductCard product={singleProduct} key={singleProduct.id} />
            ))}
        </section>
    )
}

export default Product
