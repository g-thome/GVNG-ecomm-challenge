import { ShoppingCart as ShoppingCartIcon, RemoveCircle } from "@mui/icons-material";
import { Popover, Typography, Box, List, ListItem, Button } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import { ShoppingCartActionType, useShoppingCartContext } from "../context/ShoppingCart";
import { API } from "../API"
import { TAX_PERCENTAGE } from "../constants"
import { numberToMoney } from "../utils";
import { Summary } from "../types";
import { useRouter } from "next/router";

const ShoppingCartButton: React.FC = (): ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null)
  const [cartCost, setCartCost] = useState<Omit<Summary, "products">>({ total: 0, taxes: 0, subtotal: 0 })
  const [cartSize, setCartSize] = useState<number>(0)  
  const { cart, dispatch } = useShoppingCartContext()

  const router = useRouter()

  useEffect(() => {
    const beforeTaxes = Math.round(cart.reduce((acc, cur) => {
      return acc + (cur.price * cur.quantity)
    }, 0) * 100) / 100

    const taxes = Math.round((beforeTaxes * TAX_PERCENTAGE) * 100) / 100

    const afterTaxes = Math.round((beforeTaxes + taxes) * 100) / 100

    setCartCost({
      subtotal: beforeTaxes,
      taxes,
      total: afterTaxes
    })

    setCartSize(cart.reduce((acc, cur) => acc + (1 * cur.quantity), 0))
  }, [cart])

  const show = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const close = () => {
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

  const handleCheckoutClick = async () => {
    try {
      const { id: orderId } = await API.placeOrder({
        products: cart.map(p => p.id),
        ...cartCost
      })

      if (!orderId) {
        alert("error placing your order")
      }

      router.push(`/checkout/${orderId}`)
    } catch (e) {
      alert("Error placing your order")
    }
  }

  return (
    <>
      <div style={{position: "relative"}}>
        <ShoppingCartIcon style={{ cursor: "pointer" }} onClick={show} />
        <div style={{ backgroundColor: "red", position: "absolute", top: "-25%", right: "-25%", borderRadius: "50%", textAlign: "center", width: "20px", height: "20px" }}>
          {cartSize}
        </div>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <Box sx={{ p: 2 }}>
          {cart.length ?
            <>
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
              <Typography fontWeight={800}>Subtotal: {numberToMoney(cartCost.subtotal)}</Typography>
              <Typography fontWeight={800}>Taxes: {numberToMoney(cartCost.taxes)}</Typography>
              <Typography fontWeight={800}>Total: {numberToMoney(cartCost.total)}</Typography>
              <Button variant="contained" onClick={handleCheckoutClick}>CHECKOUT</Button>
            </>:
            <Typography>Your cart is empty! Go shop!</Typography>
          }
        </Box>
      </Popover>
    </>
  )
}

export default ShoppingCartButton