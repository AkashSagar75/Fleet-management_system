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

      const [payments] = await connection.query(
        `SELECT subscription_id FROM payments WHERE order_id=? LIMIT 1`,
        [razorpay_order_id]
      );
      if (!payments.length) {
        throw new Error("Payment order was not found");
      }

      const { subscription_id } = payments[0];

       await connection.query(
  `
  UPDATE payments
  SET
    transaction_id = ?,
    razorpay_signature = ?,
    payment_status = 'success',
    paid_at = NOW()
  WHERE order_id = ?
    AND payment_status = 'pending'
  `,
  [
    razorpay_payment_id,
    razorpay_signature,
    razorpay_order_id
  ]
);
      await connection.query(
        `UPDATE subscription_planss
         SET status='active',
             start_date=COALESCE(start_date, CURDATE()),
             end_date=COALESCE(
               end_date,
               CASE
                 WHEN billing_cycle='yearly'
                   THEN DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
                 ELSE DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
               END
             )
         WHERE id=?`,
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