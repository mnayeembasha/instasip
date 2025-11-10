import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { type ProductType } from '@/types';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().min(0),
  description: z.string().min(10).max(1000),
  stock: z.number().min(0),
  category: z.string(),
});

type Props = {
  onSubmit: (data: Partial<ProductType>) => void;
  defaultValues?: Partial<ProductType>;
  isLoading: boolean;
};

const ProductForm = ({ onSubmit, defaultValues, isLoading }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      price: defaultValues?.price || 0,
      description: defaultValues?.description || '',
      stock: defaultValues?.stock || 0,
      category: defaultValues?.category || '',
    },
  });

  const [imageFiles, setImageFiles] = useState<(File | string)[]>(
    defaultValues?.images?.length ? defaultValues.images : (defaultValues?.image ? [defaultValues.image] : [])
  );
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const genPreviews = async () => {
      const prevs = await Promise.all(
        imageFiles.map(async (f) => {
          if (typeof f === 'string') return f;
          const reader = new FileReader();
          return new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(f);
          });
        })
      );
      setPreviews(prevs);
    };
    genPreviews();
  }, [imageFiles]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const currentNewSize = imageFiles.reduce((acc, f) => (typeof f === 'string' ? acc : acc + f.size), 0);
      const addedSize = newFiles.reduce((acc, file) => acc + file.size, 0);
      if (currentNewSize + addedSize > 20 * 1024 * 1024) {
        toast.error('Total new images size exceeds 20MB');
        return;
      }
      setImageFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImageFiles((prev) => {
      const newArr = [...prev];
      if (direction === 'up' && index > 0) {
        [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      } else if (direction === 'down' && index < prev.length - 1) {
        [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      }
      return newArr;
    });
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    const imagesData = await Promise.all(
      imageFiles.map(async (f) => {
        if (typeof f === 'string') return f;
        const reader = new FileReader();
        return new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(f);
        });
      })
    );
    onSubmit({ ...values, images: imagesData });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Images (Order matters, first image is primary)</FormLabel>
          <Input type="file" multiple accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleImageChange} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {previews.map((prev, index) => (
              <div key={index} className="relative border rounded-md p-2">
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm">{index + 1}</div>
                <img src={prev} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded" />
                <div className="flex justify-between mt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => moveImage(index, 'up')} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => moveImage(index, 'down')} disabled={index === previews.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeImage(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;