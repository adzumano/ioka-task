import { stripe } from "@/config/stripe";
import { BASE_PRICE, CURRENCY } from "@/lib/constants/shared";

export async function POST() {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2025-04-30.basil" },
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: BASE_PRICE * 100,
    currency: CURRENCY.toLocaleLowerCase(),
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return Response.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
}
