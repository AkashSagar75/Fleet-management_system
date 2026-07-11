 const razorpay = require("../config/razorpay");
const pool = require("../config/db");

exports.createOrder = async (data, connection) => {

    const {
        company_id,
        subscription_id,
        amount
    } = data;

    const order = await razorpay.orders.create({
        amount: Number(amount) * 100,
        currency: "INR",
        receipt: `COMPANY_${company_id}`
    });

    await connection.query(
        `INSERT INTO company_payments
        (
            company_id,
            subscription_id,
            amount,
            currency,
            payment_gateway,
            order_id,
            payment_status
        )
        VALUES (?,?,?,?,?,?,?)`,
        [
            company_id,
            subscription_id,
            amount,
            "INR",
            "razorpay",
            order.id,
            "pending"
        ]
    );

    return {
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order
    };
};