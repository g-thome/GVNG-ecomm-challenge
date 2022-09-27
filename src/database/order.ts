import prismaClient from "."

export const getOrderById = async (id: number) => {
  const result = await prismaClient.order.findFirst({
    where: {
      id
    }
  })

  if (!result) return

  const summary = JSON.parse(result.summary)

  return {
    id,
    ...summary
  }
}

type CreateOrderParams = {
  products: number[]
  total: number
  subtotal: number
  taxes: number
}

export const createOrder = async (summary: CreateOrderParams) => {
  return prismaClient.order.create({
    data: {
      summary: JSON.stringify(summary)
    }
  })
}