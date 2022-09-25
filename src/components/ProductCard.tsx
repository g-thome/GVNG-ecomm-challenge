import { Typography, Card, CardMedia, Button } from "@mui/material";
import React, { ReactElement } from "react";
import { numberToMoney } from "../utils"
import { useShoppingCartContext, ShoppingCartActionType } from "../context/ShoppingCart"
import { API } from "../API"
interface ProductCardProps {
  productId: number
    productName: string
    imgSrc: string
    productDescription: string
    productPrice: number
}

const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps): ReactElement => {
  const { dispatch } = useShoppingCartContext()

  const handleAddToCartClick = () => {
    dispatch({
      type: ShoppingCartActionType.ADD,
      product: {
        id: props.productId,
        name: props.productName,
        price: props.productPrice
      }
    })
    
    API.addToCart(props.productId)
      .then(res => {
        if (res.status !== 200) {
          dispatch({ type: ShoppingCartActionType.REMOVE, productId: props.productId })
          alert("Something went wrong while trying to add your product to the cart.")
        }
      })
      .catch(() => {
        dispatch({ type: ShoppingCartActionType.REMOVE, productId: props.productId })
        alert("Something went wrong while trying to add your product to the cart. Check your internet connection and try again later")
      })
  }

  return (
        <Card sx={{ maxWidth: 650, padding: "1em" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{props.productName}</Typography>
        <CardMedia
          component="img"
          image={props.imgSrc}
          alt={props.productName}
          height="140"
          sx={{ marginTop: 2, marginBottom: 2 }}
        />            
        <Typography sx={{ marginBottom: 1.5 }}>{props.productDescription}</Typography>
        <Typography>{numberToMoney(props.productPrice)}</Typography>
        <Button variant="contained" onClick={handleAddToCartClick}>ADD TO CART</Button>
    </Card>
  )
}

export default ProductCard