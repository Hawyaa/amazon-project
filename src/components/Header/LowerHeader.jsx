import React from 'react'
import classes from './Header.module.css'

const LowerHeader = () => {
    return (
        <div className={classes.lower__container}>
            <div className={classes.lower__container__inner}>
                <div className={classes.menu}>
                    <div className={classes.hamburger}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span>All</span>
                </div>
                <div className={classes.nav__items}>
                    <a href="#">Today's Deals</a>
                    <a href="#">Customer Service</a>
                    <a href="#">Registry</a>
                    <a href="#">Gift Cards</a>
                    <a href="#">Sell</a>
                </div>
            </div>
        </div>
    )
}

export default LowerHeader