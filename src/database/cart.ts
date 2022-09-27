import prismaClient from "."

export const addToCart = async (productId: number) => {
  const productInCart = await prismaClient.shoppingCart.findFirst({
    where: {
      productId: Number(productId)
    }
  })

  if (!productInCart) {
    return prismaClient.shoppingCart.create({
      data: {
        productId: Number(productId),
        quantity: 1
      }
    })
  }

  return prismaClient.shoppingCart.update({
    where: {
      productId: Number(productId)
    },
    data: {
      quantity: productInCart.quantity+1
    }
  })
}