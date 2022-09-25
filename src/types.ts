export interface ICartProduct {
  id: number
  name: string
  quantity: number
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