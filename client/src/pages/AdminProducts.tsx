import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminProducts, addProduct, editProduct, deleteProduct, toggleProductStatus } from '@/store/features/productSlice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconEdit, IconTrash, IconEye, IconEyeOff, IconSearch, IconCategory, IconCircleCheck, IconPlus, IconPackage } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '@/components/ProductForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { type ProductType } from '@/types';

interface Filter{
  status?: string;
  category?: string;
  search?: string;
}

const AdminProducts = () => {
  const { adminProducts, isFetchingAdminProducts, isAddingProduct, isEditingProduct, error } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = useState<string|undefined>(undefined);
  const [category, setCategory] = useState<string|undefined>(undefined);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

  // Alert dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productId: string | null }>({
    open: false,
    productId: null
  });
  const [toggleDialog, setToggleDialog] = useState<{ open: boolean; productId: string | null; isActive: boolean }>({
    open: false,
    productId: null,
    isActive: false
  });

  const categories = [...new Set(adminProducts.map(p => p.category))];

  useEffect(() => {
    if (!user?.isAdmin) navigate('/');
    else {
      const filters: Filter = {};
      if (status !== 'all') filters.status = status;
      if (category !== 'all') filters.category = category;
      if (search) filters.search = search;
      dispatch(fetchAdminProducts(filters));
    }
  }, [status, category, search, user, dispatch, navigate]);

  const handleSubmit = (data: unknown) => {
    if (editingProduct) {
      dispatch(editProduct({ id: editingProduct._id, data: data as ProductType })).then(() => {
        setOpen(false);
        setEditingProduct(null);
      });
    } else {
      dispatch(addProduct(data as ProductType)).then(() => setOpen(false));
    }
  };

  const handleEdit = (product: ProductType) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.productId) {
       dispatch(deleteProduct(deleteDialog.productId)).then(() => {
      // Refetch products after deletion
      const filters: Filter = {};
      if (status !== 'all') filters.status = status;
      if (category !== 'all') filters.category = category;
      if (search) filters.search = search;
      dispatch(fetchAdminProducts(filters));
    });
    setDeleteDialog({ open: false, productId: null });
    }
  };

  const handleToggleConfirm = () => {
    if (toggleDialog.productId) {
      dispatch(toggleProductStatus({
        id: toggleDialog.productId,
        isActive: !toggleDialog.isActive
      }));
      setToggleDialog({ open: false, productId: null, isActive: false });
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header Section */}
        <div className="">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3 tracking">
                <IconPackage className="w-8 h-8 text-primary" />
                Product Management
              </h1>
              <p className="text-gray-600">Manage your product inventory and availability</p> */}
            </div>
{/* <Button
  className="bg-gradient-to-r bg-accent text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6"
  onClick={() => {
    setEditingProduct(null);
    setOpen(true);
  }}
>
  <IconPlus className="w-5 h-5 mr-2" />
  Add New Product
</Button> */}
<Dialog open={open} onOpenChange={handleDialogClose}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                {open && (
                  <ProductForm
                    key={editingProduct?._id || 'new'}
                    onSubmit={handleSubmit}
                    defaultValues={editingProduct || undefined}
                    isLoading={isAddingProduct || isEditingProduct}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 p-6 border-0 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
                {/* Input Search */}

           <div className="relative flex-1">
      <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-12 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary transition-all"
      />
    </div>

    {/* Status Select */}
    <div className="relative flex-1 flex justify-center items-center">
      <IconCircleCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="h-12 pl-12 py-[1.45rem] rounded-xl border-gray-200 focus:border-primary focus:ring-primary w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem
            value="all"
            className="rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
          >
            All
          </SelectItem>
          <SelectItem
            value="active"
            className="rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
          >
            Active
          </SelectItem>
          <SelectItem
            value="inactive"
            className="rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
          >
            Inactive
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Category Select */}
    <div className="relative flex-1 flex justify-center items-center">
      <IconCategory className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="h-12 pl-12 py-[1.45rem] rounded-xl border-gray-200 focus:border-primary focus:ring-primary w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem
            value="all"
            className="rounded-lg focus:bg-transparent hover:bg-transparent data-[highlighted]:bg-gray-50"
          >
            All
          </SelectItem>
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

      {/* Add Product */}
      <Button
  className="rounded-xl bg-gradient-to-r bg-accent text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6"
  onClick={() => {
    setEditingProduct(null);
    setOpen(true);
  }}
>
  <IconPlus className="w-5 h-5 mr-2" />
  Add New Product
</Button>

          </div>
        </Card>

        {/* Products Table */}
        <Card className="shadow-md border-0 overflow-hidden bg-white">
          {isFetchingAdminProducts ? (
            <div className="p-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorMessage message={error} />
            </div>
          ) : adminProducts.length === 0 ? (
            <div className="p-12 text-center">
              <IconPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or add a new product
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className='px-8'>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2">
                    <TableHead className="font-bold text-gray-700 py-4">
                      Product Name
                    </TableHead>
                    <TableHead className="font-bold text-gray-700">Category</TableHead>
                    <TableHead className="font-bold text-gray-700">Price</TableHead>
                    <TableHead className="font-bold text-gray-700">Stock</TableHead>
                    <TableHead className="font-bold text-gray-700">Status</TableHead>
                    <TableHead className="font-bold text-gray-700 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminProducts.map(product => (
                    <TableRow
                      key={product._id}
                      className="hover:bg-blue-50/50 transition-colors border-b"
                    >
                      <TableCell className="font-medium text-gray-900 py-4">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize font-normal">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        &#8377;{product.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            product.stock < 10 ? 'text-red-600' : 'text-gray-700'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.isActive ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <IconEdit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setToggleDialog({
                              open: true,
                              productId: product._id,
                              isActive: product.isActive
                            })}
                            className="hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            {product.isActive ? (
                              <IconEyeOff className="w-4 h-4" />
                            ) : (
                              <IconEye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialog({
                              open: true,
                              productId: product._id
                            })}
                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <IconTrash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, productId: null })}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                <IconTrash className="w-6 h-6 text-red-600" />
                Delete Product
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to delete this product? This action cannot be undone
                and will permanently remove the product from your inventory.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-2">
              <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Product
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Toggle Status Confirmation Dialog */}
        <AlertDialog
          open={toggleDialog.open}
          onOpenChange={(open) => setToggleDialog({ open, productId: null, isActive: false })}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                {toggleDialog.isActive ? (
                  <IconEyeOff className="w-6 h-6 text-amber-600" />
                ) : (
                  <IconEye className="w-6 h-6 text-green-600" />
                )}
                {toggleDialog.isActive ? 'Deactivate' : 'Activate'} Product
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to {toggleDialog.isActive ? 'deactivate' : 'activate'} this product?
                {toggleDialog.isActive
                  ? ' The product will be hidden from customers.'
                  : ' The product will be visible to customers.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-2">
              <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleConfirm}
                className={toggleDialog.isActive
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"}
              >
                {toggleDialog.isActive ? 'Deactivate' : 'Activate'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminProducts;