const db = require('../../config/db');
const express = require('express');
const bcrypt = require("bcryptjs");
const paymentService = require('../../services/payment.service');

exports.createCompany = async (req, res) => {
  try {
    const { name, type, address, contact_person, phone, status } = req.body;
    const sql = `INSERT INTO companies (name, type, address, contact_person, phone,status) values(?,?,?,?,?,?) `
    await db.query(sql, [name, type, address, contact_person, phone, status]);
    return res.status(201).json({
      message: 'Basic',
      success: true
    })
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      error: err.message
    });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const {
      company_id, plan_id,
      amount,
      start_date,
      end_date,
      status
    } = req.body;

    const sql = `INSERT INTO company_subscriptions (company_id, plan_id,amount, start_date,end_date,status) values (?,?,?,?,?,?)`;

    await db.query(sql, [company_id, plan_id, amount, start_date, end_date, status])
    return res.status(201).json({ success: true, subscriptionId: result.insertId })

  } catch (error) {
    return res.status(500).json({

      success: false,

      message: err.message

    });

  }
}

exports.onboarding = async (req, res) => {
  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();
    const { company, subscription, subscription_plan
,user, payment } = req.body;
    const com_sql = `INSERT INTO companies (name, company_type_id, address, contact_person, phone,status) values(?,?,?,?,?,?) `
    const [companyResult] = await connection.query(
      com_sql,
      [company.name, company.company_type_id, company.address, company.contact_person, company.phone, company.status]

    )

    const companyId = companyResult.insertId;

     const hashPassword = await bcrypt.hash(user.password,10);
    const user_sql = `INSERT INTO users (company_id,role_id,name,email,password ,status) values(?,?,?,?,?,?)`;
    await connection.query(
      user_sql,
      [companyId, user.role_id, user.name, user.email, hashPassword, user.status
      ]
    )


    const plan_sql = `INSERT INTO subscription_plans (name,price,user_limit,features) values(?,?,?,?)`
    const [subscriptionPlanResults] = await connection.query(
      plan_sql,[subscription_plan.name,subscription_plan.price,subscription_plan.user_limit,
        
        JSON.stringify(subscription_plan.features)]
    )
      const subscriptionPlaiId = subscriptionPlanResults.insertId;
      
    const sub_sql = `INSERT INTO company_subscriptions (company_id, plan_id, start_date, end_date) values (?,?,?,?)`;
    const [subscriptionResult] = await connection.query(
      sub_sql,
      [companyId, subscriptionPlaiId, subscription.start_date, subscription.end_date]
    );
    const subscriptionId = subscriptionResult.insertId;

    const paymentResponse = await paymentService.createOrder({
    company_id: companyId,
    subscription_id: subscriptionId,
    amount: subscription_plan.price,
}
, connection);
    await connection.commit();

    return res.status(201).json({
      success: true,
      companyId,
      subscriptionId,
      order: paymentResponse.order,
      key: paymentResponse.key,
      message: "Company Onboarding Completed",
    });

  } catch (error) {

    await connection.rollback();
    return res.status(500).json({

      success: false,

      message: error.message

    });

  }
  finally {

    connection.release();

  }
}

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

exports.getrole = async (req, res) => {
try {
  const slq = `Select * from roles 
  WHERE name != 'super_admin' and name = 'company_admin'`;

   const [roles] = await db.query(slq);
   return res.status(200).json({
    success: true,
    message: "Role fetched successfully",
    data: roles
  })  
    
      
    

} catch (error) {
   return res.status(500).json({

      success: false,

      message: error.message

    });
  
}

 }
  