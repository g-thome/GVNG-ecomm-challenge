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

export const removeFromCart = async (productId: number) => {
  const productInCart = await prismaClient.shoppingCart.findFirst({
    where: {
      productId: Number(productId)
    }
  })

  if (!productInCart) {
    throw new Error("Trying to delete an item that is not in the cart")
  }
  
  if (productInCart.quantity === 1) {
    return prismaClient.shoppingCart.delete({
      where: {
        productId: Number(productId)
      }
    })
  }

  return prismaClient.shoppingCart.update({
    where: {
      productId: Number(productId)
    },
    data: {
      quantity: productInCart.quantity-1
    }
  })
}