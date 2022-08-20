import Client from "shopify-buy";

export const client = Client.buildClient({
  domain: "nexjs-example-shund.myshopify.com/",
  storefrontAccessToken: "25ea1764ab2fd06d24472b283c288d81",
});
