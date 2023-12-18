import axios from "axios";
import React, { useContext } from "react";
import Location from "../../../../icons/location.svg";
import ProductCardButton from "./ProductCardButton";
import toast, { Toaster } from "react-hot-toast";
import { GlobalState } from "../../../../globalState";
import "./ProductItem.css"; // Import your CSS file for styling

export default function ProductItem({
  product,
  token,
  callback,
  setCallback,
}) {
  const state = useContext(GlobalState);
  const [adCallback, setAdCallback] = state.adAPI.adCallback;

 const deleteProduct = async () => {
    try {
      const delImage = await axios.post(
        "/api/delete",
        { public_id: product.image.public_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("image deleted");
      const delProduct = await axios.delete("/api/products/" + product._id, {
        headers: {
          Authorization: token,
        },
      });
      console.log("product deleted");
      setCallback(!callback);
      setAdCallback(!adCallback);
      toast.success("ad deleted successfully", {
        style: {
          borderRadius: "0px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleClick = (event) => {
    // If the click originated from the Edit button, stop propagation
    if (event.target.id === "btn_buy" || event.target.id === "btn_delete" || event.target.closest(".modal")) {
      event.stopPropagation();
      return;
    }
    

    // Navigate to the product details page
    window.location.href = `/details/${product._id}`;
  };

  return (
    <div
      className={`product_card ${product.featured ? "featured" : ""}`}
      onClick={handleClick}
    >
      <div>
        <Toaster />
      </div>
      {product.featured && <div className="featured-tag">Featured</div>}
      <div className="product_card_head">
        {window.innerWidth <= 768 ? (
          // Display title, image, price, and condition for mobile view
          <div className="product_box_mobile">
            <img src={product.image.url} alt="" className="product-img" />
            <h3>{product.title}</h3>
            <span>&#x20a6;{product.price}</span>
            {/* <span className="condition">{product.condition}</span> */}
          </div>
        ) : (
          // Display full content for desktop view
          <>
            <img src={product.image.url} alt="" className="product-img" />
            <div className="product_box">
              <h3>{product.title}</h3>
              <span>&#x20a6;{product.price}</span>
              <div className="seller">
                <p>{product.seller_name}</p>
                <p>
                  <img
                    src={Location}
                    alt="menu-icon"
                    width="9"
                    height="9"
                    className="location-icon"
                  />{" "}
                  {product.location}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <ProductCardButton product={product} deleteProduct={deleteProduct} />
    </div>
  );
}
