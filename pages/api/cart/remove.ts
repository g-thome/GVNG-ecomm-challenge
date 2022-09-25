import { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "../../../src/database";

async function remove(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return

  const { product: productId } = req.query

  if (!productId || Number(productId) === NaN) {
    return res.status(400).json({
      error: "querystring must contain valid productId"
    }) 
  }

  const productInCart = await prismaClient.shoppingCart.findFirst({
    where: {
      productId: Number(productId)
    }
  })

  if (!productInCart) {
    return res.status(404).json({
      error: "Trying to delete an item that is not in the cart"
    })
  }

  try {
    if (productInCart.quantity === 1) {
      await prismaClient.shoppingCart.delete({
        where: {
          productId: Number(productId)
        }
      })
      return res.status(200).json({})
    }
  
    await prismaClient.shoppingCart.update({
      where: {
        productId: Number(productId)
      },
      data: {
        quantity: productInCart.quantity-1
      }
    })
  
    return res.status(200).json({})
  } catch (e: unknown) {
    const { message } = e as Error
    return res.status(500).json({error: message})
  }
}

export default remove