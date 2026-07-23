import BillingSetting from '../models/BillingSetting.js';

// @desc    Get Billing Data, Active Subscription Plan & Invoices
// @route   GET /api/billing
// @access  Private (Admin)
export const getBillingData = async (req, res, next) => {
  try {
    let billing = await BillingSetting.findOne();
    if (!billing) {
      billing = await BillingSetting.create({});
    }

    res.status(200).json({
      success: true,
      billing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upgrade / Change Subscription Plan
// @route   PUT /api/billing/plan
// @access  Private (Admin)
export const updateSubscriptionPlan = async (req, res, next) => {
  try {
    const { planName, price, billingCycle } = req.body;

    if (!planName) {
      res.status(400);
      throw new Error('Please select a plan to upgrade');
    }

    let billing = await BillingSetting.findOne();
    if (!billing) {
      billing = new BillingSetting();
    }

    billing.currentPlan = {
      name: planName,
      price: `${price} / month`,
      billingCycle: billingCycle || 'Billed Annually',
      nextRenewal: '31 May 2026',
      status: 'Active',
    };

    await billing.save();

    res.status(200).json({
      success: true,
      message: `Subscription successfully updated to "${planName}"!`,
      billing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Payment Method Card Details
// @route   PUT /api/billing/payment-method
// @access  Private (Admin)
export const updatePaymentMethod = async (req, res, next) => {
  try {
    const { cardBrand, last4, expiry, holderName } = req.body;

    let billing = await BillingSetting.findOne();
    if (!billing) {
      billing = new BillingSetting();
    }

    if (cardBrand) billing.paymentMethod.cardBrand = cardBrand;
    if (last4) billing.paymentMethod.last4 = last4;
    if (expiry) billing.paymentMethod.expiry = expiry;
    if (holderName) billing.paymentMethod.holderName = holderName;

    await billing.save();

    res.status(200).json({
      success: true,
      message: 'Payment method updated successfully!',
      billing,
    });
  } catch (error) {
    next(error);
  }
};
