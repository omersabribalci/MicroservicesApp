const Order = require("../models/order.model");
const ApiResponse = require("../utils/apiResponse");
const userServiceClient = require("../services/userServiceClient");

const enrichOrderWithUser = async (order) => {
  const orderObject = order.toObject();
  const user = await userServiceClient.getUserById(order.userId);

  return {
    ...orderObject,
    user: user || { message: "Kullanıcı bilgisi alınamadı" },
  };
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const enrichedOrders = await Promise.all(
      orders.map((order) => enrichOrderWithUser(order)),
    );

    const totalCount = await Order.countDocuments(filter);

    return ApiResponse.success(res, {
      orders: enrichedOrders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return ApiResponse.notFound(res, "Sipariş bulunamadı");
    }

    const enrichedOrder = await enrichOrderWithUser(order);

    return ApiResponse.success(res, enrichedOrder);
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { userId, product, quantity, totalPrice } = req.body;

    const user = await userServiceClient.getUserById(userId);
    if (!user) {
      return ApiResponse.badRequest(
        res,
        "Geçersiz kullanıcı ID veya User Service erişilemez durumda",
      );
    }

    const order = await Order.create({ userId, product, quantity, totalPrice });

    const enrichedOrder = {
      ...order.toObject(),
      user,
    };

    return ApiResponse.created(
      res,
      enrichedOrder,
      "Sipariş başarıyla oluşturuldu",
    );
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      return ApiResponse.notFound(res, "Sipariş bulunamadı");
    }

    const enrichedOrder = await enrichOrderWithUser(order);

    return ApiResponse.success(
      res,
      enrichedOrder,
      "Sipariş durumu güncellendi",
    );
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return ApiResponse.notFound(res, "Sipariş bulunamadı");
    }

    return ApiResponse.success(res, null, "Sipariş başarıyla silindi");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
