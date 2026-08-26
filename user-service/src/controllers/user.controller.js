const User = require("../models/user.model");
const ApiResponse = require("../utils/apiResponse");

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalCount = await User.countDocuments(filter);

    return ApiResponse.success(res, {
      users,
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

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return ApiResponse.notFound(res, "Kullanıcı bulunamadı");
    }

    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.badRequest(res, "Bu e-posta adresi zaten kayıtlı");
    }

    const user = await User.create({ firstName, lastName, email, age });

    return ApiResponse.created(res, user, "Kullanıcı başarıyla oluşturuldu");
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, age, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, age, isActive },
      { new: true, runValidators: true },
    );

    if (!user) {
      return ApiResponse.notFound(res, "Kullanıcı bulunamadı");
    }

    return ApiResponse.success(res, user, "Kullanıcı başarıyla güncellendi");
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return ApiResponse.notFound(res, "Kullanıcı bulunamadı");
    }

    return ApiResponse.success(res, null, "Kullanıcı başarıyla silindi");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
