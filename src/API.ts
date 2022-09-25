import { API_URL } from "./constants"

export class API {
  static async post(endpoint: string, body: any) {
    return fetch(API_URL + endpoint, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
  }

  static async addToCart(productId: number) {
    return API.post(`/cart/add?productId=${productId}`, {})
  }
}