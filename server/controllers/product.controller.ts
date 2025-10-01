import { type Request, type Response } from "express";
import { Product, type ProductDocument } from "../models/Product";
import { validateObjectId } from "../utils/validateObjectId";
import cloudinary from "../lib/cloudinary";

const ID_ERROR_MESSAGE = 'Invalid Product ID';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, sortBy } = req.query;

        const filter: any = { isActive: true };

        if (category && category !== "all") {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        let sortOption: any = { createdAt: -1 };
        if (sortBy === "oldest") {
            sortOption = { createdAt: 1 };
        }

        const products = await Product.find(filter).sort(sortOption);
        if(!products){
            return res.status(200).json({message:"No Products found with applied filters"});
        }else{
            return res.status(200).json({
                message: "Products fetched successfully",
                products
            });
        }

    } catch (error) {
        console.error("Error in getProducts controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getProductById = async (req: Request, res: Response) => {
    const productId = req.params.id;
    if (!validateObjectId(productId as string,ID_ERROR_MESSAGE, res)) return;

    try {
        const product = await Product.findOne({ _id: productId, isActive: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }else{
            return res.status(200).json({
                message: "Product fetched successfully",
                product
            });
        }
    } catch (error) {
        console.error("Error in getProductById controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, description, image, stock, category } = req.body;
        let imageUrl = "";
        let imagePublicId = "";

        if (image && image.startsWith('data:image/')) {
            const base64Data = image.split(';base64,').pop() || '';
            const buffer = Buffer.from(base64Data, 'base64');

            if (buffer.length > 5 * 1024 * 1024) {
                return res.status(400).json({ message: 'Image size exceeds 5MB' });
            }
            const uploadResult = await cloudinary.uploader.upload(image, {
                resource_type: 'image',
                folder: 'instasip',
            });
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        const newProduct = await Product.create({
            name,
            price,
            description,
            image: imageUrl,
            stock,
            category
        });

        return res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error in createProduct controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    if (!validateObjectId(productId as string, ID_ERROR_MESSAGE, res)) return;

    try {
        const { name, price, description, image, stock, category } = req.body;
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updateData: Partial<ProductDocument> = {
            name,
            price,
            description,
            stock,
            category
        };

        if (image && image.startsWith('data:image/')) {
            const base64Data = image.split(';base64,').pop() || '';
            const buffer = Buffer.from(base64Data, 'base64');

            if (buffer.length > 5 * 1024 * 1024) {
                return res.status(400).json({ message: 'Image size exceeds 5MB' });
            }

            // Delete old image from cloudinary
            if (existingProduct.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(existingProduct.imagePublicId);
                    console.log('Old image deleted from Cloudinary:', existingProduct.imagePublicId);
                } catch (deleteError) {
                    console.error('Error deleting old image from Cloudinary:', deleteError);
                }
            }

            // Upload new image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(image, {
                resource_type: 'image',
                folder: 'instasip',
            });
            updateData.image = uploadResult.secure_url;
            updateData.imagePublicId = uploadResult.public_id;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error in updateProduct controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    if (!validateObjectId(productId as string, ID_ERROR_MESSAGE, res)) return;

    try {
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (existingProduct.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(existingProduct.imagePublicId);
                console.log('Image deleted from Cloudinary:', existingProduct.imagePublicId);
            } catch (deleteError) {
                console.error('Error deleting image from Cloudinary:', deleteError);
            }
        }

        const deletedProduct = await Product.findByIdAndDelete(productId, { new: true });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });

    } catch (error) {
        console.error("Error in deleteProduct controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllProductsForAdmin = async (req: Request, res: Response) => {
    try {
        const { status, category, search } = req.query;

        const filter: any = {};

        if (status === "active") {
            filter.isActive = true;
        } else if (status === "inactive") {
            filter.isActive = false;
        }

        if (category && category !== "all") {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All products fetched successfully",
            products
        });
    } catch (error) {
        console.error("Error in getAllProductsForAdmin controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const changeProductStatus = async (req: Request, res: Response) => {
    try {
        const  productId  = req.params.id;
        const { isActive } = req.body;

        if (!validateObjectId(productId as string, ID_ERROR_MESSAGE, res)) return;

        const product = await Product.findByIdAndUpdate(
            productId,
            { isActive: !!isActive },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: `Product status updated to ${product.isActive ? "active" : "inactive"}`,
            product
        });
    } catch (error) {
        console.error("Error in changeProductStatus controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


