
const Offer = require('../models/offerModel')
const Product = require('../models/productModel');

const loadOfferPage = async (req, res) => {
    try {

        const products = await Product.find({});

        const offers = await Offer.find({});
        res.render('admin/offer',{
            currentUrl: req.url,
            offers,
            products
        })
    } catch (error) {
        
    }
}


const loadAddCategoryOfferPage = async (req,res) => {
    try {
        res.render('admin/addCategoryOffer',{
            currentUrl:req.url,
        })
    } catch (error) {
        
    }
}
const loadAddProductOfferPage = async (req,res) => {
    try {
        res.render('admin/addProductOffer',{
            currentUrl:req.url,
        })
    } catch (error) {
        
    }
}

const addProductOffer = async (req, res, next) => {
    try {
        const {offer_name, offer_description, offer_percentage, offer_type} = req.body;
        const newOffer = new Offer({
            offerName : offer_name,
            offerDescription : offer_description,
            discount : offer_percentage,
            offerType: offer_type,
            isActive: false
        });
        await newOffer.save();

        res.redirect('/admin/offers');

        }catch (error) {
        next(error)
    }
    } 


    const loadProductModal = async (req, res) => {
        try {
            const products = await Product.find({ delete: false }).select('name image price promo_price').populate('offer');
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    const applyOfferToProduct =  async (req, res) => {
        const { productId, offerId } = req.body;
    
        console.log('offerController applyOfferToProduct req.body',req.body);
        try {
            // Check if the offer exists
            const offer = await Offer.findById(offerId);
            if (!offer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
    
            // Update the product's offer field
            let product = await Product.findByIdAndUpdate(
                productId,
                { offer: offerId },
                { new: true }
            );
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Populate the offer field in the product to include offer details in the response
            product = await product.populate('offer');
    
            // Send success response
            res.status(200).json({ message: 'Offer applied successfully', product });
        } catch (error) {
            console.error("Error applying offer:", error); // Log the error for debugging
            res.status(500).json({ message: 'Failed to apply offer', error: error.message });
        }
    };

    const removeOfferFromProduct  = async (req, res) => {
        const { productId } = req.body;
        try {
            const product = await Product.findById(productId);
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            product.offer = null;
            await product.save();
    
            res.json({ message: 'Offer removed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to remove offer', error });
        }
    };
    
    const loadEditProductOfferPage = async (req,res) => {
        try {
            const offer = await Offer.findById(req.params.id);
            if(!offer) {
                return res.status(404).send('Offer not found');
            }
            res.render('admin/editProductOfferPage',{
                currentUrl:req.url,

                offer
            })
        } catch (error) {
        }
    };

    const  editProductOffer = async(req,res) => {
        try {
            const {offerName,offerDescription, discount, offerType} = req.body;
            await Offer.findByIdAndUpdate(req.params.id, {
                offerName,
                offerDescription,
                discount,
                offerType
            })
            
            res.status(200).json({message: 'Offer updated successfully'});
        } catch (error) {
            console.error('Error updating offer:', error);
            res.status (500).json({error: 'Internal Server Error'});
        }
    }

    const deleteOffer = async (req,res) => {
        try {
            const offerId = req.params.offerId;

            console.log('offeController delete offer offerId:',offerId);

            if(!offerId) {
                return res.status (400).json({message: 'Offer ID is required'})
            }

            const deleted= await Offer.findByIdAndDelete(offerId);
            if(!deleted) {
                return res.status(404).json ({message: 'Offer not deleteed'})

            }
            res.status(200).json({ message: 'Offer deleted successfully!' });
        } catch (error) {
            console.error('Error deleting offer:', error);
            res.status(500).json({ message: 'Failed to delete offer.' });
        }
    }

module.exports = {
    loadOfferPage,
    loadAddCategoryOfferPage,
    loadAddProductOfferPage,
    addProductOffer,
    loadProductModal,
    applyOfferToProduct,
    removeOfferFromProduct,
    loadEditProductOfferPage,
    editProductOffer,
    deleteOffer
}