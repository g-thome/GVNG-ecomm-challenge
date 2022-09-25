import { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "../../../src/database";

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

  const productInCart = await prismaClient.shoppingCart.findFirst({
    where: {
      productId: Number(productId)
    }
  })

  try {
    if (!productInCart) {
      await prismaClient.shoppingCart.create({
        data: {
          productId: Number(productId),
          quantity: 1
        }
      })
      res.status(200).json({})
      return
    }
  
    await prismaClient.shoppingCart.update({
      where: {
        productId: Number(productId)
      },
      data: {
        quantity: productInCart.quantity+1
      }
    })
  
    res.status(200).json({})
  } catch (e: unknown) {
    const { message } = e as Error
    res.status(500).json({error: message})
  }
}

export default add