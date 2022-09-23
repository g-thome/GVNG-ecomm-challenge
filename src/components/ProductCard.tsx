import { Typography, Card, CardMedia, Button } from "@mui/material";
import React from "react";
import { ReactElement } from "react";
import { numberToMoney } from "../utils"

interface ProductCardProps {
    productName: string
    imgSrc: string
    productDescription: string
    productPrice: number
}

const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps): ReactElement => {
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
        <Button variant="contained">ADD TO CART</Button>
    </Card>
  )
}

export default ProductCard