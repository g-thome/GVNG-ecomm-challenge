import { API_URL } from "./constants"
import { Summary } from "./types"

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

  static async get(endpoint: string) {
    return fetch(API_URL + endpoint, {
      method: "GET",
      mode: "cors"
    })
  }

  static async addToCart(productId: number) {
    return API.post(`/cart/add?product=${productId}`, {})
  }

  static async removeFromCart(productId: number) {
    return API.post(`/cart/remove?product=${productId}`, {})
  }

  static async getSummary(orderId: number) {
    const response = await API.get(`/order?id=${orderId}`)
    return response.json()
  }

  static async placeOrder(summary: Summary) {
    const response = await API.post("/order", summary)
    return response.json()
  }
}