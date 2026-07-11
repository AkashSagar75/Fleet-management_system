const paymentService = require("../services/payment.service");
const pool = require("../config/db");
const crypto = require("crypto");

exports.createOrder = async (req, res) => {
  try {
    const response = await paymentService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      company_id,
      subscription_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE company_payments SET transaction_id=?, razorpay_signature=?, payment_status='success' WHERE order_id=?`,
        [razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );

      await connection.query(
        `UPDATE company_subscriptions SET start_date=CURDATE(), end_date=DATE_ADD(CURDATE(), INTERVAL 1 MONTH) WHERE id=?`,
        [subscription_id]
      );

      await connection.commit();
      connection.release();

      return res.status(200).json({
        success: true,
        message: "Payment Successful",
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};