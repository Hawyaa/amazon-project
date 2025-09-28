import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SlLocationPin } from "react-icons/sl";
import { BsSearch } from "react-icons/bs";
import { BiCart } from "react-icons/bi";
import LowerHeader from "./LowerHeader";
import classes from "./Header.module.css";
import { DataContext } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";

const Header = () => {
  const [{ user, basket }] = useContext(DataContext);
  const navigate = useNavigate();
  const totalItem = basket?.length || 0;

  // Handle orders click - redirect to auth if not logged in
  const handleOrdersClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent default link behavior
      navigate("/auth", { 
        state: { 
          msg: "You must log in to see your orders", 
          redirect: "/orders" 
        } 
      });
    }
    // If user is logged in, the normal Link behavior will work
  };

  return (
    <>
      <section>
        <div className={classes.header__container}>
          {/* logo section */}
          <div className={classes.logo__container}>
            <Link to="/">
              <img
                src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                alt="amazon logo"
              />
            </Link>
            <div className={classes.delivery}>
              <span>
                <SlLocationPin />
              </span>
              <div>
                <p>Deliver to</p>
                <span>Ethiopia</span>
              </div>
            </div>
          </div>

          {/* search section */}
          <div className={classes.search__container}>
            <select>
              <option value="">All</option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
            <input
              type="text"
              placeholder="Search Amazon"
              className={classes.search_input}
            />
            <button className={classes.search_button}>
              <BsSearch size={18} />
            </button>
          </div>

          {/* other section */}
          <div className={classes.order__container}>
            <Link to="" className={classes.language}>
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/800px-Flag_of_the_United_States.svg.png"
                alt="USA Flag"
                width={20}
                height={15}
              />
              <select>
                <option value="">EN</option>
              </select>
            </Link>

            {/* User authentication section */}
            <Link to={user ? "" : "/auth"}>
              <div>
                {user ? (
                  <>
                    <p>Hello {user?.email?.split("@")[0]}</p>
                    <span onClick={() => auth.signOut()}>Sign Out</span>
                  </>
                ) : (
                  <>
                    <p>Hello, Sign In</p>
                    <span>Account & Lists</span>
                  </>
                )}
              </div>
            </Link>

            {/* Fixed Orders Link */}
            <Link 
              to={user ? "/orders" : "/auth"} 
              onClick={handleOrdersClick}
            >
              <p>Returns</p>
              <span>& Orders</span>
            </Link>

            <Link to="/cart" className={classes.cart}>
              <BiCart size={35} />
              <span>{totalItem}</span>
            </Link>
          </div>
        </div>
      </section>
      <LowerHeader />
    </>
  );
};

export default Header;