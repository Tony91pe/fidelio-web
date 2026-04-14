export interface PaymentIntent {
  shopId: string
  plan: 'STARTER' | 'GROWTH' | 'PRO'
  amount: number
  currency: string
  period: 'monthly' | 'yearly'
}

export async function createPaymentIntent(intent: PaymentIntent) {
  // TODO: Implement Stripe payment intent
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: intent.amount,
  //   currency: intent.currency,
  //   metadata: { shopId: intent.shopId, plan: intent.plan }
  // })
  // return paymentIntent
  return { id: 'pi_' + Math.random().toString(36).substr(2, 9) }
}

export async function handlePaymentSuccess(paymentId: string, shopId: string, plan: string) {
  // TODO: Update shop plan in database
  console.log(`Payment success: ${paymentId} for shop ${shopId}, plan ${plan}`)
}

export async function handlePaymentFailure(paymentId: string, shopId: string, reason: string) {
  // TODO: Log payment failure
  console.log(`Payment failed: ${paymentId} for shop ${shopId}, reason: ${reason}`)
}

export async function handleSubscriptionChange(shopId: string, oldPlan: string, newPlan: string) {
  // TODO: Handle upgrade/downgrade logic
  console.log(`Subscription changed: shop ${shopId}, ${oldPlan} -> ${newPlan}`)
}
