import { GetStaticProps, GetStaticPaths } from "next";
import Layout from "../components/Layout";
import { client } from "../apis/shopifyClient";
import { Product } from "shopify-buy";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type DetailProps = {
  product?: Product;
  errors?: string;
};

const DetailPage = (props: DetailProps) => {
  const { product, errors } = props;
  const [checkoutLink, setCheckoutLink] = useState("");

  if (errors) {
    return <p>Error: {props.errors}</p>;
  }
  if (!product) {
    return <p>Error: Product not found</p>;
  }

  useEffect(() => {
    client.checkout.create().then((checkout: any) => {
      const variantsId = product.variants[0].id;
      client.checkout
        .addLineItems(checkout.id, [{ variantId: variantsId, quantity: 1 }])
        .then((checkout) => {
          console.log(checkout.lineItems);
          setCheckoutLink(checkout.webUrl);
        });
    });
  }, []);

  return (
    <Layout title={product.title}>
      <div>
        <p>{product.title}</p>
        <img src={product.images[0].src} height={200} />
      </div>
      <Link href={checkoutLink}>
        <button>購入する</button>
      </Link>
    </Layout>
  );
};

export default DetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const products: any[] = await client.product.fetchAll();
  const paths = products.map((product) => ({
    params: { id: product.handle.toString() },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<DetailProps> = async ({
  params,
}) => {
  try {
    const id = params?.id;
    if (!id) {
      return { props: { errors: "not found" } };
    }
    const productRes = await client.product.fetchByHandle(id as string);
    const product = JSON.parse(JSON.stringify(productRes));
    return {
      props: { product: product },
      revalidate: 10,
    };
  } catch (err) {
    return { props: { errors: "unexpected error" } };
  }
};
