import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/features/productSlice';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { IconSearch, IconCategory, IconSortAscending, IconPackage} from '@tabler/icons-react';

// import { IconArrowUp, IconArrowDown, IconClock, IconClockHour4 } from '@tabler/icons-react';

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, isFetchingProducts, error } = useAppSelector((state) => state.product);
  const [category, setCategory] = useState<string|undefined>(undefined);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    // Extract price and sortBy from the selected value
    let priceFilter = '';
    let sortByFilter = '';

    if (sortBy === 'lowtohigh' || sortBy === 'hightolow') {
      priceFilter = sortBy;
    } else {
      sortByFilter = sortBy;
    }

    dispatch(fetchProducts({ category, search, sortBy: sortByFilter, price: priceFilter }));
  }, [category, search, sortBy, dispatch]);

  const categories = [...new Set(products.map(p => p.category))];

  return (


    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <div className="text-center mb-8 md:mt-5">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-3 tracking-tighter text-primary">
            Our Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of products
          </p>
        </div>

        {/* Filters Section */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary transition-all"
              />
            </div>

            {/* Category Select */}
            <div className="relative flex-1 flex justify-center items-center ">
              <IconCategory className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400  pointer-events-none" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className=" h-12 pl-12 py-[1.45rem] rounded-xl border-gray-200 focus:border-primary focus:ring-primary w-full">
                  <SelectValue placeholder="Category"/>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories.map(cat => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="capitalize rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Select */}
            <div className="relative flex-1 flex justify-center items-center">
              <IconSortAscending className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400  pointer-events-none" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 pl-12 py-[1.45rem] rounded-xl border-gray-200 focus:border-primary focus:ring-primary w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem
                    value="latest"
                    className="rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {/* <IconClock className="w-4 h-4" /> */}
                      <span>Latest</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="oldest"
                    className="rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {/* <IconClockHour4 className="w-4 h-4" /> */}
                      <span>Oldest</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="lowtohigh"
                    className="rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {/* <IconArrowUp className="w-4 h-4" /> */}
                      <span>Price: Low to High</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="hightolow"
                    className="rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {/* <IconArrowDown className="w-4 h-4" /> */}
                      <span>Price: High to Low</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isFetchingProducts ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <ErrorMessage message={error} />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <IconPackage className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl font-medium text-gray-900 mb-2">No products found</p>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;