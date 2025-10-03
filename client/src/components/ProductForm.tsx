import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type ProductType } from '@/types';
import { useState } from 'react';
import { IconLoader2 } from '@tabler/icons-react';

const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(0),
  description: z.string().min(10),
  category: z.string().min(2),
  stock: z.number().min(0),
  image: z.string().optional(),
});

interface ProductFormData {
    name:string;
    price:number;
    description:string;
    category:string;
    stock:number;
    image?:string;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  defaultValues?: Partial<ProductType>;
  isLoading: boolean;
}

const ProductForm = ({ onSubmit, defaultValues, isLoading }: ProductFormProps) => {
  const [imagePreview, setImagePreview] = useState(defaultValues?.image || '');

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { ...defaultValues, price: defaultValues?.price || 0, stock: defaultValues?.stock || 0 },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('image', reader.result as string);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="name" render={({ field }) => <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField name="price" render={({ field }) => <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
        <FormField name="description" render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField name="category" render={({ field }) => <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField name="stock" render={({ field }) => <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
        <FormItem>
          <FormLabel>Image</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 w-24 h-24 object-cover rounded" />}
        </FormItem>
        <Button type="submit" disabled={isLoading} className="bg-primary text-white w-full">{isLoading ? <span className='flex gap-x-2 justify-center items-center'><IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Saving....</span>: <span>Save</span>}</Button>
      </form>
    </Form>
  );
};

export default ProductForm;