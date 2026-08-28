const Product = require("../models/product.model");
const ApiResponse = require("../utils/apiResponse");

const parseProductId = (value) => {
  const productId = Number.parseInt(value, 10);
  return Number.isNaN(productId) || productId < 1 ? null : productId;
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });

    return ApiResponse.success(res, products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const productId = parseProductId(req.params.id);

    if (!productId) {
      return ApiResponse.badRequest(res, "Gecersiz urun ID formati");
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return ApiResponse.notFound(res, "Urun bulunamadi");
    }

    return ApiResponse.success(res, product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, price, stock, isActive } = req.body;

    const product = await Product.create({
      name,
      sku,
      description,
      price,
      stock,
      isActive,
    });

    return ApiResponse.created(res, product, "Urun basariyla olusturuldu");
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = parseProductId(req.params.id);

    if (!productId) {
      return ApiResponse.badRequest(res, "Gecersiz urun ID formati");
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return ApiResponse.notFound(res, "Urun bulunamadi");
    }

    const { name, sku, description, price, stock, isActive } = req.body;

    await product.update({
      name,
      sku,
      description,
      price,
      stock,
      isActive,
    });

    return ApiResponse.success(res, product, "Urun basariyla guncellendi");
  } catch (error) {
    next(error);
  }
};

const updateProductStock = async (req, res, next) => {
  try {
    const productId = parseProductId(req.params.id);

    if (!productId) {
      return ApiResponse.badRequest(res, "Gecersiz urun ID formati");
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return ApiResponse.notFound(res, "Urun bulunamadi");
    }

    await product.update({
      stock: req.body.stock,
    });

    return ApiResponse.success(res, product, "Urun stogu guncellendi");
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = parseProductId(req.params.id);

    if (!productId) {
      return ApiResponse.badRequest(res, "Gecersiz urun ID formati");
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return ApiResponse.notFound(res, "Urun bulunamadi");
    }

    await product.destroy();

    return ApiResponse.success(res, null, "Urun basariyla silindi");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
};
