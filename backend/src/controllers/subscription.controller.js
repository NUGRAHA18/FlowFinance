import * as SubscriptionService from "../service/subscription.service.js";

export const createSubscription = async (req, res) => {
  try {
    const { name, cost, billingCycle, nextPayment } = req.body;
    const subscription = await SubscriptionService.createSubscription({
      userId: req.userId,
      name,
      cost,
      billingCycle,
      nextPayment,
    });
    res.status(201).json({ message: "Subscription added", subscription });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await SubscriptionService.getUserSubscriptions(
      req.userId,
    );
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    await SubscriptionService.deleteSubscription({
      subscriptionId: req.params.id,
      userId: req.userId,
    });
    res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
