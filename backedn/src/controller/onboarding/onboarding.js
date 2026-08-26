const db = require('../../config/db');
const express = require('express');
const bcrypt = require("bcryptjs");
const paymentService = require('../../services/payment.service');



exports.onboarding = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { company,  role, subscription_plan,    user,   payment   } = req.body;

    // =========================================
    // 1. COMPANY STATUS
    // =========================================

    const companyStatus =
      company.status === "active"  ? 1 : Number(company.status ?? 1);


    // =========================================
    // 2. USER STATUS
    // =========================================

    const userStatus = user.status === "active"  ? 1 : Number(user.status ?? 1);


    // =========================================
    // 3. CREATE COMPANY
    // =========================================

    const com_sql = `
      INSERT INTO companies
      (
        company_name,
        company_type_id,
        address,
        email,
        phone,
        gst_nummber,
        pan_number,
        company_code,
        city,
        state,
        pincode,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [companyResult] = await connection.query(
      com_sql,
      [
        company.company_name,
        company.company_type_id,
        company.address,
        company.email,
        company.phone,
        company.gst_nummber,
        company.pan_number,
        company.company_code,
        company.city,
        company.state,
        company.pincode,
        companyStatus
      ]
    );

    const companyId = companyResult.insertId;
    const role_sql = `
      INSERT INTO roles
      (
        company_id,
        role_name,
        is_system_role,
        status
      )
      VALUES (?, ?, ?, ?)
    `;
    const [rolesResult] = await connection.query(
      role_sql,
      [
        companyId,
        role.role_name,
        role.is_system_role ?? 0,
        role.status ?? 1
      ]
    );

    const rolesId = rolesResult.insertId;

    const hashPassword = await bcrypt.hash(
      user.password,
      10
    );

    const user_sql = `
      INSERT INTO users
      (
        company_id,
        role_id,
        first_name,
        last_name,
        phone,
        email,
        password,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [userResult] = await connection.query(
      user_sql,
      [
        companyId,
        rolesId,
        user.first_name,
        user.last_name,
        user.phone,
        user.email,
        hashPassword,
        userStatus
      ]
    );

    const userId = userResult.insertId;


    const plan_sql = `
      INSERT INTO subscription_planss
      (
        company_id,
        name,
        billing_cycle,
        price,
        user_limit,
        features,
        start_date,
        end_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [subscriptionPlanResults] =
      await connection.query(
        plan_sql,
        [
          companyId,

          subscription_plan.name,

          subscription_plan.billing_cycle,

          subscription_plan.price,

          subscription_plan.user_limit,

          JSON.stringify(
            subscription_plan.features || []
          ),

          subscription_plan.start_date || null,

          subscription_plan.end_date || null,

          "pending"
        ]
      );

    const subscriptionId =
      subscriptionPlanResults.insertId;
    const paymentResponse =
      await paymentService.createOrder(
        {
          company_id: companyId,

          subscription_id: subscriptionId,

          amount: Number(
            subscription_plan.price
          )
        },
        connection
      );
    await connection.commit();
    return res.status(201).json({
      success: true,
      companyId,
      userId,
      rolesId,
      subscriptionId,
      order: paymentResponse.order,
      key: paymentResponse.key,
      message:
        "Company onboarding initiated successfully"
    });

  } catch (error) {

    await connection.rollback();

    console.error(
      "ONBOARDING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {

    connection.release();

  }
};

exports.companytypes = async (req, res) => {
  try {
    const sql = `SELECT * FROM company_types`;
    const [types] = await db.query(sql);
    return res.status(200).json({
      success: true,
      data: types
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFeatrues = async (req, res) => {
  try {
    // const  sql = `select  name  from features`;
    const sql = `
    SELECT
        f.id,
        f.name,
        f.code,
        fp.monthly_price,
        fp.yearly_price,
        fp.monthly_validity_days,
        fp.yearly_validity_days
    FROM features AS f
    INNER JOIN feature_pricing AS fp
        ON fp.feature_id = f.id
    WHERE f.status = 'active'
      AND fp.status = 'active'
    ORDER BY f.id ASC
`;
    const [features] = await db.query(sql);
    return res.status(200).json({
      success: true,
      message: "All features available",
      data: features
    })
  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }
}