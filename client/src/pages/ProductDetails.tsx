import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { fetchProductBySlug, clearCurrentProduct } from '@/store/features/productSlice';
import { addToCart } from '@/store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import '@/styles/ProductDetails.css';
import ImageZoomLens from '@/components/ImageZoomLens';
import { productSEO } from '@/constants/seo';
import { Helmet } from 'react-helmet-async';

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentProduct, isFetchingProduct, error } = useAppSelector(
    (state) => state.product
  );
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { isAddingToCart } = useAppSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  const images = [
    currentProduct?.image || '/placeholder-product.jpg',
    'https://theteaplanet.com/cdn/shop/files/TeaontheGoImage1_7e27c475-8a80-4ef4-b2a7-ac106433abbc.jpg?v=1696229372&width=700',
    '/instructions.jpeg',
  ];

  const isComboPack = slug === 'premix-combo-pack' || slug === 'green-tea-combo-pack';
  const packSize = isComboPack ? 30 : 10;
  const price = isComboPack ? 630 : 220;
  const originalPrice = isComboPack ? 750 : 250;
  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [slug, dispatch]);

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(images[0]);
  }, [currentProduct?._id, currentProduct?.image]);

  const validateQuantity = (): boolean => {
    if (!currentProduct) return false;
    if (quantity < 1) {
      toast.error('Please select at least 1 pack');
      return false;
    }
    if (quantity * packSize > currentProduct.stock) {
      toast.error(`Only ${Math.floor(currentProduct.stock / packSize)} packs available in stock`);
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!currentProduct) return;

    if (!validateQuantity()) return;

    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: currentProduct._id,
          quantity: quantity * packSize, // Convert packs to cups
        })
      ).unwrap();
      toast.success('Added to cart successfully!');
      setQuantity(1);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to add to cart');
      }
    }
  };

  const handleBuyNow = async () => {
    if (!currentProduct) return;

    if (!validateQuantity()) return;

    if (!currentUser) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: currentProduct._id,
          quantity: quantity * packSize, // Convert packs to cups
        })
      ).unwrap();
      navigate('/cart');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to add to cart');
      }
    }
  };

  if (isFetchingProduct) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#A86934]"></div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-16">
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

  const seo = productSEO[slug as keyof typeof productSEO];

  if (!seo) return null;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.canonical} />
      </Helmet>
      <div className="md:py-12 px-4 sm:px-6 lg:px-8 pt-20 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 py-4 md:px-8 md:py-8">
              {/* Left: Image */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center w-full">
                  <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] overflow-hidden flex items-center justify-center">
                    <ImageZoomLens
                      src={selectedImage}
                      alt={currentProduct.name}
                      className={`w-full h-full flex items-center justify-center object-cover`}
                      isFirstImage={selectedImage === images[0]}
                    />
                  </div>
                  <div className="flex justify-center gap-2 md:gap-4 mt-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === img ? 'border-[#A86934]' : 'border-transparent'}`}
                        onClick={() => setSelectedImage(img)}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="flex flex-col justify-center space-y-3 md:space-y-6 pb-8 md:pb-0">
                <div>
                  <h1 className="text-4xl font-bold text-[#4D301A] mb-2">{currentProduct.name}</h1>
                  <p className="text-sm text-[#6D6154] uppercase tracking-wide">{currentProduct.category}</p>
                  <p className="text-sm text-[#4D301A] mt-1">
                    Pack of {packSize} cups {isComboPack ? '(10 each flavor)' : ''}
                  </p>
                </div>

                <div className="border-t border-b border-gray-200 py-4">
                  <p className="text-[#6D6154] leading-relaxed">{currentProduct.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-[#A86934]">
                      ₹{price.toFixed(2)}
                    </span>
                    <span className="text-2xl text-[#6D6154] line-through">
                      ₹{originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Save {discountPercentage}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentProduct.stock > 40 * packSize ? (
                    <p className="text-sm text-green-600 font-medium">In Stock</p>
                  ) : currentProduct.stock > 0 ? (
                    <p className="text-sm text-orange-600 font-medium">Selling Fast!</p>
                  ) : (
                    <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-[#4D301A] mb-2">
                      No of Packs
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        disabled={currentProduct.stock === 0 || isAddingToCart || quantity <= 1}
                        className="w-10 h-10 rounded-lg border-[#6D6154]"
                      >
                        <Minus className="h-5 w-5 text-[#4D301A]" />
                      </Button>
                      <span className="w-20 text-center text-lg font-medium text-[#4D301A]">
                        {quantity} pack{quantity > 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        disabled={currentProduct.stock === 0 || isAddingToCart || quantity * packSize >= currentProduct.stock}
                        className="w-10 h-10 rounded-lg border-[#6D6154]"
                      >
                        <Plus className="h-5 w-5 text-[#4D301A]" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-10 md:mb-0">
                    <Button
                      onClick={handleAddToCart}
                      disabled={currentProduct.stock === 0 || isAddingToCart}
                      className="flex-1 bg-[#A86934] hover:bg-[#4D301A] text-white py-6 text-lg font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </Button>

                    <Button
                      onClick={handleBuyNow}
                      disabled={currentProduct.stock === 0 || isAddingToCart}
                      className="flex-1 bg-[#4D301A] hover:bg-[#A86934] text-white py-6 text-lg font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingToCart ? 'Adding...' : 'Buy Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;