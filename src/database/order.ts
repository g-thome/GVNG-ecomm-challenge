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