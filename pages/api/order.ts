import { NextApiRequest, NextApiResponse } from "next"
import { createOrder, getOrderById } from "../../src/database/order"

const placeOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { products, total, subtotal, taxes } = req.body

  // allowing total = 0 just in case of discounts 
  // or gifts
  if (total < 0) {
    return res.status(400).json({ error: "cart total can't be negative"})
  }

  if (!products || !Array.isArray(products) || !products.length) {
    return res.status(400).json({ error: "body must contain an array of products" })
  }
  
  const order = await createOrder({ products, total, subtotal, taxes })

  return res.status(200).json({ id: order.id })
}

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (!id || Number(id) == NaN) {
    return res.status(400).json({ error: "Request body must contain id"})
  }

  const order = await getOrderById(Number(id))

  if (!order) {
    return res.status(404)
  }

  return res.status(200).json(order)
}

const order = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405)
  }

  switch (req.method) {
    case "POST":
      return placeOrder(req, res)
    case "GET":
      return getOrder(req, res)
  }
}

export default order