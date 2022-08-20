import Client, { Product } from "shopify-buy";
import { GetStaticProps } from "next";
import Link from "next/link";
type IndexProps = {
  products: any[];
};

const client = Client.buildClient({
  domain: "nexjs-example-shund.myshopify.com/", //自分のストアのURLを入力する
  storefrontAccessToken: "25ea1764ab2fd06d24472b283c288d81", //自分のStorefront APIのアクセストークンを入力する
});

const IndexPage: React.FC<IndexProps> = ({ products }) => {
  return (
    <>
      <h1>Hello Next.js 👋</h1>
      <ul>
        {products.map((product) => (
          <Link href="/[id]" as={`/${product.handle}`}>
            <a>
              {product.title}
              <img src={product.images[0].src} height={80} />+{" "}
            </a>
          </Link>
        ))}
      </ul>
    </>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const products: any = await client.product.fetchAll();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
    revalidate: 10, // In seconds
  };
};
