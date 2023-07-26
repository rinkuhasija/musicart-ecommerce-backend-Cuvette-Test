const Product = require("../models/productModel")

const searchProductController = async (req, res) => {
    try {
        const { name } = req.params
        const results = await Product.find({
            $or: [
                { name: { $regex: name, $options: 'i' } },
                { description: { $regex: name, $options: 'i' } },
            ]
        })
        res.status(200).json(results)
    } catch (error) {
        console.error("Error getting product Detail" + error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = searchProductController

