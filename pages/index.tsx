import { Product } from "@prisma/client"
import { GetServerSideProps, NextPage } from "next"
import NavBar from "../src/components/NavBar"
import ProductCard from "../src/components/ProductCard"
import { API_URL } from "../src/constants"
import { ShoppingCartProvider } from "../src/context/ShoppingCart"
import styles from "../styles/index.module.css"

interface HomeProps {
  products: Product[]
}

const Home: NextPage<HomeProps> = ({ products }: HomeProps) => {
  return (
    <ShoppingCartProvider>
      <div id={styles.appContainer}>
        <NavBar />
        <ul style={{ display: "flex", listStyleType: "none", gap: "2em", flexWrap: "wrap" }}>
          {products.map(p =>
            <li key={p.id}>
              <ProductCard
                productId={p.id}
                productName={p.name}
                productDescription={p.description}
                imgSrc={p.imgSrc}
                productPrice={p.price as unknown as number}
              />
            </li>)}
        </ul>
      </div>
    </ShoppingCartProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const result = await fetch(API_URL + '/products')
  const products = await result.json()
  return { props: { products }  }
}

export default Home
