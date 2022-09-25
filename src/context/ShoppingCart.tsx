import React, { createContext, useContext, useReducer, ReactNode } from "react"
import { ICartProduct } from "../types"

export const ShoppingCartContext = createContext<{cart: ICartProduct[], dispatch: Function}>({
  cart: [],
  dispatch: () => { }
})

export enum ShoppingCartActionType {
  ADD,
  REMOVE
}

type CartAction = {
  type: ShoppingCartActionType.ADD,
  productId: number,
  productName: string
} | {
  type: ShoppingCartActionType.REMOVE,
  productId: number
}

const addProductToCart = (cart: ICartProduct[], productName: string, productId: number) => {
  const productIndex = cart.findIndex(p => p.id === productId)
  if (productIndex !== -1) {
    cart[productIndex].quantity++
    return cart
  }
  
  const cartWithNewItem = [...cart, {
    id: productId,
    name: productName,
    quantity: 1
  }]
  return cartWithNewItem
}

const removeProductFromCart = (cart: ICartProduct[], productId: number) => {
  const newCart = [...cart]
  const productIndex = newCart.findIndex(p => p.id === productId)
  if (newCart[productIndex].quantity === 1) {
    newCart.splice(productIndex, 1)
    return newCart
  }

  newCart[productIndex].quantity--
  return newCart
}

const reducer = (state: ICartProduct[], action: CartAction): ICartProduct[] => {
  switch (action.type) {
    case ShoppingCartActionType.ADD:
      return addProductToCart(state, action.productName, action.productId)
    case ShoppingCartActionType.REMOVE:
      return removeProductFromCart(state, action.productId)
    default:
      return state
  }
}

export const useShoppingCartContext = () => useContext(ShoppingCartContext)

export const ShoppingCartProvider: React.FC<{ children: ReactNode }> = ({ children }): React.ReactElement => {
  const [cart, dispatch] = useReducer<React.Reducer<ICartProduct[], CartAction>>(reducer, [])
  
  return (
    <ShoppingCartContext.Provider value={{ cart, dispatch }}>
      {children}
    </ShoppingCartContext.Provider>
  )
} 