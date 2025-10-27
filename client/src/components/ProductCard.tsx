import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { addToCart } from '@/store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { type ProductType } from '@/types';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const isComboPack = product.slug === 'premix-combo-pack' || product.slug === 'green-tea-combo-pack';
  const packSize = isComboPack ? 30 : 10;
  const price = isComboPack ? 630 : 220;
  const originalPrice = isComboPack ? 750 : 250;
  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate(`/login?redirect=/products`);
      return;
    }

    if (quantity < 1) {
      toast.error('Please select at least 1 pack');
      return;
    }
    if (quantity * packSize > product.stock) {
      toast.error(`Quantity cannot exceed available stock (${Math.floor(product.stock / packSize)} packs)`);
      return;
    }

    try {
      setIsAdding(true);
      await dispatch(addToCart({
        productId: product._id,
        quantity: quantity,
      })).unwrap();
      toast.success('Added to cart');
      setQuantity(1);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to add to cart');
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card data-aos="fade-in" className="p-0 w-full h-full rounded-3xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md flex flex-col gap-0">
      {/* Product Image */}
      <CardHeader className="relative p-4 pb-1">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-48 rounded-2xl transition-transform duration-200 hover:scale-105"
          />
        </Link>
        {product.stock === 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">Out of Stock</Badge>
        )}
      </CardHeader>

      {/* Product Content */}
      <CardContent className="flex-1 space-y-2 px-4 pb-1">
        <Link to={`/products/${product.slug}`}>
          <CardTitle className="truncate text-lg font-semibold hover:underline">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-xs text-gray-400 uppercase">{product.category}</p>
        <p className="text-sm text-[#4D301A]">
          Pack of {packSize} cups {isComboPack ? '(10 each flavor)' : ''}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-[#A86934]">&#8377;{price.toFixed(2)}</p>
          <p className="text-sm text-[#6D6154] line-through">&#8377;{originalPrice.toFixed(2)}</p>
          <p className="text-xs text-green-600">{discountPercentage}% Off</p>
        </div>
      </CardContent>

      {/* Footer Controls */}
      <CardFooter className="flex items-center gap-2 p-4">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={product.stock === 0 || isAdding || quantity <= 1}
            className="w-8 h-8 rounded-lg border-[#6D6154]"
          >
            <Minus className="h-4 w-4 text-[#4D301A]" />
          </Button>
          <span className="w-15 text-center text-sm font-medium text-[#4D301A]">{quantity} pack{quantity > 1 ? 's' : ''}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity((prev) => prev + 1)}
            disabled={product.stock === 0 || isAdding || quantity * packSize >= product.stock}
            className="w-8 h-8 rounded-lg border-[#6D6154]"
          >
            <Plus className="h-4 w-4 text-[#4D301A]" />
          </Button>
        </div>
        <Button
          onClick={handleAddToCart}
          className="bg-[#A86934] text-white rounded-lg flex-1 hover:bg-[#4D301A]"
          disabled={product.stock === 0 || isAdding}
        >
          {isAdding ? 'Adding...' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;