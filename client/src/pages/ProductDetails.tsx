import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { fetchProductBySlug, clearCurrentProduct } from '@/store/features/productSlice';
import { addToCart } from '@/store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import '@/styles/ProductDetails.css';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Helmet } from 'react-helmet-async';
import { productSEO } from '@/constants/seo';
import ImageZoomLens from '@/components/ImageZoomLens';

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentProduct, isFetchingProduct, error } = useAppSelector((state) => state.product);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [autoplay.current]
  );

  const images = currentProduct?.images && currentProduct.images.length > 0
    ? currentProduct.images
    : [currentProduct?.image || '/placeholder-product.jpg'];

  const isComboPack = slug === 'premix-combo-pack' || slug === 'green-tea-combo-pack';
  const packSize = 10;
  const price = currentProduct?.price || (isComboPack ? 630 : 220);
  const originalPrice = isComboPack ? 750 : 250;
  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

  // Fetch product
  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [slug, dispatch]);

  // Reset on product change
  useEffect(() => {
    if (currentProduct) {
      setQuantity(1);
      setSelectedIndex(0);
    }
  }, [currentProduct?._id]);

  // Embla select handler
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Pause autoplay on hover
  useEffect(() => {
    if (!emblaApi || !autoplay.current) return;
    const emblaRoot = emblaApi.rootNode();
    const handleMouseEnter = () => autoplay.current.stop();
    const handleMouseLeave = () => autoplay.current.play();
    emblaRoot.addEventListener('mouseenter', handleMouseEnter);
    emblaRoot.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      emblaRoot.removeEventListener('mouseenter', handleMouseEnter);
      emblaRoot.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const validateQuantity = () => {
    if (quantity < 1) {
      toast.error('Please select at least 1 pack');
      return false;
    }
    if (quantity > currentProduct!.stock) {
      toast.error(`Only ${Math.floor(currentProduct!.stock / packSize)} packs available`);
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!currentProduct || !validateQuantity()) return;
    if (!currentUser) {
      toast.error('Please login to add items');
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(
        addToCart({
          productId: currentProduct._id,
          quantity: quantity,
          // quantity: quantity * packSize,
        })
      ).unwrap();
      toast.success('Added to cart!');
      setQuantity(1);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!currentProduct || !validateQuantity()) return;
    if (!currentUser) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    setIsBuying(true);
    try {
      await dispatch(
        addToCart({
          productId: currentProduct._id,
          quantity: quantity,
          // quantity: quantity * packSize,
        })
      ).unwrap();
      navigate('/cart');
    } catch (err: any) {
      toast.error(err.message || 'Failed');
    } finally {
      setIsBuying(false);
    }
  };

  // Loading
  if (isFetchingProduct) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#A86934]"></div>
      </div>
    );
  }

  // Not found
  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-16">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-[#6D6154] mb-4" />
          <h2 className="text-2xl font-semibold text-[#4D301A] mb-2">Product Not Found</h2>
          <p className="text-[#6D6154] mb-6">{error || 'This product does not exist.'}</p>
          <Button onClick={() => navigate('/products')} className="bg-[#A86934] hover:bg-[#4D301A] text-white">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  // Fallback SEO
  const fallbackSEO = {
    title: `${currentProduct.name} - Instasip`,
    description: currentProduct.description.slice(0, 160),
    canonical: `${window.location.origin}/products/${slug}`,
    image: currentProduct.image,
  };
  const seo = productSEO[slug as keyof typeof productSEO] || fallbackSEO;

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

      <div className="md:py-12 px-4 sm:px-6 lg:px-8 pt-20 md:pt-20 min-h-screen ">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 py-4 md:px-8 md:py-8">
            
            {/* Image Carousel */}
            <div className="relative">
              <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                <div className="flex">
                  {images.map((img, i) => (
                    <div key={i} className="flex-none w-full">
                      <ImageZoomLens
                        src={img}
                        alt={`${currentProduct.name} - ${i + 1}`}
                        className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-contain bg-gray-50"
                        isFirstImage={i === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#4D301A]" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                  >
                    <ChevronRight className="w-5 h-5 text-[#4D301A]" />
                  </button>
                </>
              )}

              {/* Dots */}
              {images.length > 1 && (
                <div className="flex justify-center gap-1 mt-4">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i)}
                      className={`w-2 h-2 rounded-full transition ${
                        i === selectedIndex ? 'bg-[#A86934] w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Product Details (Your Reference Layout) */}
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
              <p className="text-sm text-green-600 font-medium">In Stock</p>
                {/*{currentProduct.stock > 40 * packSize ? (
                  <p className="text-sm text-green-600 font-medium">In Stock</p>
                ) : currentProduct.stock > 0 ? (
                  <p className="text-sm text-orange-600 font-medium">Selling Fast!</p>
                ) : (
                  <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
                )}*/}
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
                      disabled={currentProduct.stock === 0 || isAdding || isBuying || quantity <= 1}
                      className="w-10 h-10 rounded-lg border-[#6D6154] hover:bg-[same-color] cursor-pointer"
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
                      disabled={currentProduct.stock === 0 || isAdding || isBuying || quantity * packSize >= currentProduct.stock}
                      className="w-10 h-10 rounded-lg border-[#6D6154] hover:bg-[same-color] cursor-pointer"
                    >
                      <Plus className="h-5 w-5 text-[#4D301A]" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 mb-10 md:mb-0">
                  <Button
                    onClick={handleAddToCart}
                    disabled={currentProduct.stock === 0 || isAdding || isBuying}
                    className="flex-1 bg-[#A86934] hover:bg-[#4D301A] text-white py-6 text-lg font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={currentProduct.stock === 0 || isAdding || isBuying}
                    className="flex-1 bg-[#4D301A] hover:bg-[#A86934] text-white py-6 text-lg font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBuying ? 'Adding...' : 'Buy Now'}
                  </Button>
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