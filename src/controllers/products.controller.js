import Product from "../models/Product";


export const createProduct = async (req, res) => {
    
    // Crear modelo de producto
    const { name, category, price, imgURL } = req.body;
    const newProduct = new Product({ name, category, price, imgURL });

    // Guardar en DB
    const productSave = await newProduct.save();
    res.status(201).json(productSave);
};


export const getProduct = async (req, res) => {

    // Obteniendo datos de DB
    const products = await Product.find();
    res.json(products);
};


export const getProductById = async (req, res) => {
    
    // Obteniendo datos de DB
    const product = await Product.findById(req.params.productId);
    res.status(200).json(product);
};


export const updateProductById = async(req, res) => {

    // Actualizando datos de DB
    const updateProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, {
        new: true
    });
    res.status(200).json(updateProduct);
};


export const deleteProductById = async(req, res) => {
    
    // Eliminando datos de DB
    const { productId } = req.params;
    await Product.findByIdAndDelete(productId);
    res.status(204).json({message: "Producto eliminado"});
};

