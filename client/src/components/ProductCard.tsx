import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { addToCart } from '@/store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { type ProductType } from '@/types';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
//  const location = useLocation();

  const { user:currentUser } = useAppSelector((state) => state.auth);
  const { isAddingToCart } = useAppSelector((state) => state.cart);

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate(`/login?redirect=/products`);
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      toast.error('Invalid quantity');
      return;
    }

    try {
      await dispatch(addToCart({
        productId: product._id,
        quantity
      })).unwrap();
      toast.success('Added to cart');
      setQuantity(1); // Reset quantity after successful add
    } catch (error: unknown) {
      if(error instanceof Error){
        toast.error(error.message || 'Failed to add to cart');
      }
    }
  };

  return (
    <Card className="p-0 w-full h-full rounded-3xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md flex flex-col gap-0">
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
        <p className="text-xl font-bold text-primary">&#8377; {product.price.toFixed(2)}</p>
      </CardContent>

      {/* Footer Controls */}
      <CardFooter className="flex items-center gap-2 p-4">
        <Input
          type="number"
          min={1}
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20 rounded-lg"
          disabled={product.stock === 0 || isAddingToCart}
        />
        <Button
          onClick={handleAddToCart}
          className="bg-primary text-white rounded-lg flex-1"
          disabled={product.stock === 0 || isAddingToCart}
        >
          {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
