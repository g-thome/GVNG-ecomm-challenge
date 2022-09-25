import { ShoppingCart as ShoppingCartIcon, RemoveCircle } from "@mui/icons-material";
import { Popover, Typography, Box, List, ListItem } from "@mui/material";
import React, { ReactElement } from "react";
import { ShoppingCartActionType, useShoppingCartContext } from "../context/ShoppingCart";
import { API } from "../API"

const ShoppingCartButton: React.FC = (): ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null)
  const { cart, dispatch } = useShoppingCartContext()

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const handleRemoveProductClick = async (event: React.MouseEvent<SVGSVGElement>) => {
    const productId = Number(event.currentTarget.getAttribute("data-product-id"))
    
    API.removeFromCart(productId)
      .then((res) => {
        if (res.status !== 200) {
          alert("Something went wrong when trying to remove your item from the cart")
          return
        }

        dispatch({
          type: ShoppingCartActionType.REMOVE,
          productId
        })
      })
      .catch(() => {
        alert("Something went wrong when trying to remove your item from the cart. Check your internet connection and try again")
      })
  }

  return (
    <>
      <ShoppingCartIcon style={{ cursor: "pointer" }} onClick={handleClick} />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography fontWeight={800}>Shoping Cart</Typography>
          <List>
            {cart.map(p =>
              <ListItem key={p.id} sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "5px",
                padding: 0
              }}>
                {p.name} x{p.quantity}
                <RemoveCircle
                  data-product-id={p.id}
                  onClick={handleRemoveProductClick}
                  htmlColor="red"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                />
              </ListItem>)}
          </List>
          </Box>
      </Popover>
    </>
  )
}

export default ShoppingCartButton