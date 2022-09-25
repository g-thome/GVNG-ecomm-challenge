import { Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { API } from "../../src/API"
import NavBar from "../../src/components/NavBar"
import { Summary } from "../../src/types"
import { numberToMoney } from "../../src/utils"
import styles from "../../styles/index.module.css"


const Checkout: NextPage<Summary> = ({ subtotal, taxes, total }: Summary) => {
  const router = useRouter()
  const { orderId } = router.query

  return (
    <div id={styles.appContainer}>
      <NavBar />
      <div style={{padding: "1em"}}>
        <Typography>Thank you for shopping with us!</Typography>
        <Typography>Order id: {orderId}</Typography>
        <Typography>Subtotal: {numberToMoney(subtotal)}</Typography>
        <Typography>Taxes: {numberToMoney(taxes)}</Typography>
        <Typography>Total: {numberToMoney(total)}</Typography>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderId } = context.query
  const summary = await API.getSummary(Number(orderId))
  return { props: summary  }
}

export default Checkout