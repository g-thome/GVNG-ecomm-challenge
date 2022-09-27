import { NextApiRequest, NextApiResponse } from "next";
import { addToCart } from "../../../src/database/cart";

async function add(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405)
  }

  const { product: productId } = req.query

  if (!productId || Number(productId) === NaN) {
    res.status(400).json({
      error: "querystring must contain valid productId"
    })
    return
  }

  try {
    await addToCart(Number(productId))
    res.status(200).json({})
  } catch (e: unknown) {
    const { message } = e as Error
    res.status(500).json({error: message})
  }
}

export default add