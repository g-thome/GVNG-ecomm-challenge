import { NextApiRequest, NextApiResponse } from "next";
import { removeFromCart } from "../../../src/database/cart"

async function remove(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return

  const { product: productId } = req.query

  if (!productId || Number(productId) === NaN) {
    return res.status(400).json({
      error: "querystring must contain valid productId"
    }) 
  }

  try {
    await removeFromCart(Number(productId))
    return res.status(200).json({})
  } catch (e: unknown) {
    const { message } = e as Error
    return res.status(500).json({error: message})
  }
}

export default remove