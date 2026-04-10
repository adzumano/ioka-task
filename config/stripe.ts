import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2026-03-25.dahlia",
  appInfo: {
    name: "expo-router-stripe",
  },
});
