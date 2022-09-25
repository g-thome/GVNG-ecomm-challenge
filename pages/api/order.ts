import { NextApiRequest, NextApiResponse } from "next"
import prismaClient from "../../src/database"

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

  console.log("products: ", products)

  const order = await prismaClient.order.create({
    data: {
      summary: JSON.stringify({
        products, 
        total,
        subtotal,
        taxes
      })
    }
  })

  return res.status(200).json({ id: order.id })
}

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (!id || Number(id) == NaN) {
    return res.status(400).json({ error: "Request body must contain id"})
  }

  const result = await prismaClient.order.findFirst({
    where: {
      id: Number(id)
    }
  })

  if (!result) {
    return res.status(404)
  }

  const summary = JSON.parse(result.summary)

  return res.status(200).json({
    id: result.id,
    ...summary
  })
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