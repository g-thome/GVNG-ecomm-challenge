import React, { createContext, useContext, useReducer, ReactNode } from "react"
import useSWR from "swr"
import { API_URL } from "../constants"
import { ICartProduct, CartProductFromAPI } from "../types"
import { fetcher } from "../utils"

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
  product: ICartProduct
} | {
  type: ShoppingCartActionType.REMOVE,
  productId: number
}

const addProductToCart = (cart: ICartProduct[], product: ICartProduct) => {
  const productIndex = cart.findIndex(p => p.id === product.id)
  if (productIndex !== -1) {
    const newCart = [...cart]
    newCart[productIndex].quantity++
    return newCart
  }
  
  const cartWithNewItem = [...cart, {
    id: product.id,
    name: product.name,
    price: product.price,
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
      return addProductToCart(state, action.product)
    case ShoppingCartActionType.REMOVE:
      return removeProductFromCart(state, action.productId)
    default:
      return state
  }
}

export const useShoppingCartContext = () => useContext(ShoppingCartContext)

interface ShoppingCartProviderProps {
  children: ReactNode
}

export const ShoppingCartProvider: React.FC<ShoppingCartProviderProps> = ({ children }): React.ReactElement => {
  const { data } = useSWR<CartProductFromAPI[]>(API_URL + "/cart", fetcher)

  const initialCart = data?.map(d => ({
    name: d.product.name,
    id: d.product.id,
    quantity: d.quantity,
    price: Number(d.product.price)
  })) || []
  
  const [cart, dispatch] = useReducer<React.Reducer<ICartProduct[], CartAction>>(reducer, initialCart)
  return (
    <ShoppingCartContext.Provider value={{ cart, dispatch }}>
      {children}
    </ShoppingCartContext.Provider>
  )
} 