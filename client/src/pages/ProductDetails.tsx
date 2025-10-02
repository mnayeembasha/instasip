import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchProductBySlug, clearCurrentProduct } from '@/store/features/productSlice';
import { addToCart } from '@/store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentProduct, isFetchingProduct, error } = useAppSelector(
    (state) => state.product
  );

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [slug, dispatch]);

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0 && num <= (currentProduct?.stock || 0)) {
      setQuantity(num);
    }
  };

  const handleAddToCart = () => {
    if (!currentProduct) return;

    dispatch(addToCart({
      product: currentProduct,
      quantity: quantity
    }));
    toast.success('Added to cart successfully!');
  };

  const handleBuyNow = () => {
    if (!currentProduct) return;

    dispatch(addToCart({
      product: currentProduct,
      quantity: quantity
    }));
    navigate('/cart');
  };

  if (isFetchingProduct) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#A86934]"></div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-[#6D6154] mb-4" />
          <h2 className="text-2xl font-semibold text-[#4D301A] mb-2">Product Not Found</h2>
          <p className="text-[#6D6154] mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-[#A86934] hover:bg-[#4D301A] text-white"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const marketingPrice = currentProduct.price * 1.3;

  return (
    <div className=" md:py-12 px-4 sm:px-6 lg:px-8 md:pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 py-4 md:px-8 md:py-8">
            {/* Left: Image */}
            <div className="flex justify-center">
              <div className="w-full h-[500px] rounded-3xl overflow-hidden flex items-center justify-center bg-white">
                <img
                  src={currentProduct.image || '/placeholder-product.jpg'}
                  alt={currentProduct.name}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>

              {/* <div className="w-full h-[500px] rounded-xl overflow-hidden">
                <img
                  src={currentProduct.image || '/placeholder-product.jpg'}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              </div> */}


            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col justify-center space-y-3 md:space-y-6 pb-8 md:pb-0">
              <div>
                <h1 className="text-4xl font-bold text-[#4D301A] mb-2">
                  {currentProduct.name}
                </h1>
                <p className="text-sm text-[#6D6154] uppercase tracking-wide">
                  {currentProduct.category}
                </p>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <p className="text-[#6D6154] leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-[#A86934]">
                    ₹{currentProduct.price.toFixed(2)}
                  </span>
                  <span className="text-2xl text-[#6D6154] line-through">
                    ₹{marketingPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Save {Math.round(((marketingPrice - currentProduct.price) / marketingPrice) * 100)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[#4D301A]">
                  Stock Available: {currentProduct.stock} units
                </p>
                {currentProduct.stock < 10 && currentProduct.stock > 0 && (
                  <p className="text-sm text-orange-600">
                    Only {currentProduct.stock} left in stock!
                  </p>
                )}
                {currentProduct.stock === 0 && (
                  <p className="text-sm text-red-600 font-semibold">
                    Out of Stock
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-[#4D301A] mb-2">
                    Quantity
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={currentProduct.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    disabled={currentProduct.stock === 0}
                    className="w-32 border-[#6D6154] focus:border-[#A86934] focus:ring-[#A86934]"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={currentProduct.stock === 0}
                    className="flex-1 bg-[#A86934] hover:bg-[#4D301A] text-white py-6 text-lg font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    disabled={currentProduct.stock === 0}
                    className="flex-1 bg-[#4D301A] hover:bg-[#A86934] text-white py-6 text-lg font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* <div className="mt-6 p-4 bg-[#FAFAFA] rounded-lg">
                <h3 className="font-semibold text-[#4D301A] mb-2">Product Highlights</h3>
                <ul className="space-y-1 text-sm text-[#6D6154]">
                  <li>✓ Genuine Product</li>
                  <li>✓ Fast Delivery</li>
                  <li>✓ Easy Returns</li>
                  <li>✓ Secure Payment</li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;