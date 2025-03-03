import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { Offer } from "../models/offer.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const addProduct = asyncHandler(async (req, res) => {
    const {
        email,
        category,
        title,
        desc,
        images,
        price,
        quantity,
        qtyUnit,
        offers
    } = req.body;

    if (!email || !category || !title || !desc || !qtyUnit || !price || !quantity) {
        throw new ApiError(409, "All fields are required!");
    }

    const user = await User.findOne({ email })
    if(!user) {
        throw new ApiError(404, "User not found for given email!")
    }
    const userId = user._id;

    const product = await Product.create({
        user: userId,
        category,
        title,
        desc,
        images,
        price: Number(price),
        quantity: Number(quantity),
        qtyUnit,
        offers
    });

    return res.status(200).json(new ApiResponse(201, {
        product,
    }, "Product and Offers created successfully!"));
});

const getAll = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    if(!userId) {
        throw new ApiError(404, "User id not found")
    }

    const products = await Product.find({ user: userId });
    if(!products) {
        throw new ApiError(404, "User id not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, products, "All products fetched successfully!")
    )
});

const getById = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const productId = new mongoose.Types.ObjectId(id);
    if(!productId) {
        throw new ApiError(404, "Product id not found")
    }

    const product = await Product.findById(productId);
    if(!product) {
        throw new ApiError(404, "Product not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "Product fetched successfully!")
    )
});

const deleteProduct = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const productId = new mongoose.Types.ObjectId(id);
    if(!productId) {
        throw new ApiError(404, "Product id not found")
    }

    const product = await Product.findByIdAndDelete(productId);
    if(!product) {
        throw new ApiError(404, "Error while deleting product!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Product deleted successfully!")
    ) 
})

const updateById =  asyncHandler(async(req, res) => {
    const { id } = req.params;
    const product = req.body;

    if(!id) {
        throw new ApiError(409, "Product id not given!")
    }

    if (!product || Object.keys(product).length === 0) {
        throw new ApiError(
            400,
            "Product details not found that need be updated!",
        );
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
        new: true,
    });
    if (!updatedProduct) {
        throw new ApiError(500, "Error while updating product details!");
    }

    return res.json(
        new ApiResponse(
            200,
            updatedProduct,
            "Product details updated successfully!",
        ),
    );
});

const getAllProductsByCategory = asyncHandler(async(req, res) => {
    const { category } = req.params;
    if(!category) {
        throw new ApiError(409, "Category required!")
    }
    const products = await Product.find({category});
    if (!products) {
        throw new ApiError(404, `Products not found for ${category}!`)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, products, `All products fetched successfully for ${category}`)
    )
})

export { 
    addProduct,
    getAll, 
    getById,
    deleteProduct,
    updateById,
    getAllProductsByCategory
};

// let createdOffers = [];

// if (offers && Array.isArray(offers) && offers.length > 0) {
    //     createdOffers = await Promise.all(
//         offers.map(async (offer) => {
//             return await Offer.create({
//                 productId: newProduct._id,
//                 type: offer.type,
//                 details: offer.details,
//                 expiryDate: offer.expiryDate,
//             });
//         })
//     );

//     newProduct.offers = createdOffers.map((offer) => offer._id);
//     await newProduct.save();
// }

// offers: createdOffers