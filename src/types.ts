export interface ICartProduct {
  id: number
  name: string
  quantity: number
  price: number
}

export interface CartProductFromAPI {
  product: {
    id: number,
    name: string,
    description: string,
    price: string,
    imgSrc: string
  },
  quantity: number
}

export interface Summary {
  products: number[]
  subtotal: number
  taxes: number
  total: number
}