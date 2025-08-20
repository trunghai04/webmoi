const db = require('../config/database');
const { validationResult } = require('express-validator');

// Create new order
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      subtotal,
      shippingFee,
      tax,
      total,
      note
    } = req.body;

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Validate products existence and stock before creating order
      for (const item of items) {
        const [rows] = await connection.execute(
          'SELECT id, stock, name FROM products WHERE id = ? LIMIT 1',
          [item.id]
        );
        if (rows.length === 0) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({
            success: false,
            message: `Sản phẩm không tồn tại (id=${item.id})`
          });
        }
        const product = rows[0];
        if (product.stock == null) {
          // Treat null as 0
          product.stock = 0;
        }
        if (Number(product.stock) < Number(item.quantity)) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({
            success: false,
            message: `Sản phẩm '${product.name}' không đủ tồn kho (còn ${product.stock}, cần ${item.quantity})`
          });
        }
      }

      // Create order
      const orderQuery = `
        INSERT INTO orders (
          user_id, 
          order_number, 
          status, 
          subtotal, 
          shipping_fee, 
          tax, 
          total, 
          payment_method, 
          shipping_method, 
          shipping_address, 
          note, 
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
      
      const [orderResult] = await connection.execute(orderQuery, [
        userId,
        orderNumber,
        'processing',
        subtotal,
        shippingFee,
        tax,
        total,
        paymentMethod,
        shippingMethod,
        JSON.stringify(shippingAddress),
        note
      ]);

      const orderId = orderResult.insertId;

      // Create order items
      const orderItemQuery = `
        INSERT INTO order_items (
          order_id, 
          product_id, 
          product_name, 
          product_image, 
          price, 
          quantity, 
          total
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      for (const item of items) {
        await connection.execute(orderItemQuery, [
          orderId,
          item.id,
          item.name,
          item.image,
          item.price,
          item.quantity,
          item.price * item.quantity
        ]);

        // Update product stock
        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.id]
        );
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId,
          orderNumber,
          total
        }
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Create order error:', {
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      sqlState: error?.sqlState
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE o.user_id = ?';
    let params = [userId];

    if (status && status !== 'all') {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    // Get orders with items
    const ordersQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.subtotal,
        o.shipping_fee,
        o.tax,
        o.total,
        o.payment_method,
        o.shipping_method,
        o.shipping_address,
        o.note,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [orders] = await db.execute(ordersQuery, [...params, parseInt(limit), offset]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `;

    const [countResult] = await db.execute(countQuery, params);
    const totalOrders = countResult[0].total;

    // Get items for each order
    for (let order of orders) {
      const itemsQuery = `
        SELECT 
          oi.id,
          oi.product_id,
          oi.product_name,
          oi.product_image,
          oi.price,
          oi.quantity,
          oi.total
        FROM order_items oi
        WHERE oi.order_id = ?
      `;

      const [items] = await db.execute(itemsQuery, [order.id]);
      order.items = items;
      order.shipping_address = JSON.parse(order.shipping_address);
    }

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalOrders,
          pages: Math.ceil(totalOrders / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user; // From auth middleware

    // Get order
    const orderQuery = `
      SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND o.user_id = ?
    `;

    const [orders] = await db.execute(orderQuery, [orderId, userId]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get order items
    const itemsQuery = `
      SELECT 
        oi.id,
        oi.product_id,
        oi.product_name,
        oi.product_image,
        oi.price,
        oi.quantity,
        oi.total
      FROM order_items oi
      WHERE oi.order_id = ?
    `;

    const [items] = await db.execute(itemsQuery, [orderId]);
    order.items = items;
    order.shipping_address = JSON.parse(order.shipping_address);

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order'
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, note } = req.body;

    const validStatuses = ['processing', 'shipping', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateQuery = `
      UPDATE orders 
      SET status = ?, tracking_number = ?, note = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await db.execute(updateQuery, [status, trackingNumber, note, orderId]);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const { userId } = req.user;

    // Check if order exists and belongs to user
    const orderQuery = `
      SELECT status, items FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ? AND o.user_id = ?
    `;

    const [orders] = await db.execute(orderQuery, [orderId, userId]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered order'
      });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update order status
      await connection.execute(
        'UPDATE orders SET status = ?, note = ?, updated_at = NOW() WHERE id = ?',
        ['cancelled', reason, orderId]
      );

      // Restore product stock
      const itemsQuery = `
        SELECT product_id, quantity FROM order_items WHERE order_id = ?
      `;
      const [items] = await connection.execute(itemsQuery, [orderId]);

      for (const item of items) {
        await connection.execute(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get order counts by status
    const statsQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total) as total_amount
      FROM orders 
      WHERE user_id = ?
      GROUP BY status
    `;

    const [stats] = await db.execute(statsQuery, [userId]);

    // Get total orders and amount
    const totalQuery = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total) as total_amount,
        AVG(total) as avg_order_value
      FROM orders 
      WHERE user_id = ?
    `;

    const [totalStats] = await db.execute(totalQuery, [userId]);

    res.json({
      success: true,
      data: {
        byStatus: stats,
        total: totalStats[0]
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order statistics'
    });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status && status !== 'all') {
      whereClause += 'WHERE o.status = ?';
      params.push(status);
    }

    if (search) {
      const searchCondition = 'WHERE o.order_number LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?';
      whereClause = whereClause ? whereClause + ' AND ' + searchCondition.replace('WHERE', '') : searchCondition;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get orders
    const ordersQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.total,
        o.payment_method,
        o.created_at,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [orders] = await db.execute(ordersQuery, [...params, parseInt(limit), offset]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ${whereClause}
    `;

    const [countResult] = await db.execute(countQuery, params);
    const totalOrders = countResult[0].total;

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalOrders,
          pages: Math.ceil(totalOrders / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  getAllOrders
};
