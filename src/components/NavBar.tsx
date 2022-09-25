import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import { ReactElement } from "react";
import ShoppingCart from "./ShoppingCartButton";

const NavBar: React.FC = (): ReactElement => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bobalicious
          </Typography>
          <p color="inherit" style={{ marginRight: "10px" }}>Welcome back, Tom!</p>
          <ShoppingCart />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar