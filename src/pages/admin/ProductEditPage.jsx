import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Plus, X, Image } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { productService } from '../../services/productService'
import { categoryService } from '../../services/categoryService'
import { uploadService } from '../../services/uploadService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  compare_at_price: z.string().optional(),
  category_id: z.string().optional(),
  stock_quantity: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  tags: z.string().optional()
})

export function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const [loading, setLoading] = useState(isEditing)
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [description, setDescription] = useState('')

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      is_active: true,
      is_featured: false,
      price: '',
      compare_at_price: '',
      stock_quantity: '0',
      tags: ''
    }
  })

  useEffect(() => {
    fetchCategories()
    if (isEditing) fetchProduct()
  }, [id])

  const fetchCategories = async () => {
    const { data } = await categoryService.adminGetAll()
    setCategories(data || [])
  }

  const fetchProduct = async () => {
    const { data } = await productService.getById(id)
    if (data) {
      reset({
        name: data.name,
        description: data.description || '',
        short_description: data.short_description || '',
        price: data.price.toString(),
        compare_at_price: data.compare_at_price?.toString() || '',
        category_id: data.category_id || '',
        stock_quantity: data.stock_quantity?.toString() || '0',
        is_active: data.is_active,
        is_featured: data.is_featured,
        tags: data.tags?.join(', ') || ''
      })
      setImages(data.images || [])
      setDescription(data.description || '')
    }
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      const { urls, errors } = await uploadService.uploadMultiple(files)
      if (errors.length > 0) {
        toast.error('Some images failed to upload')
      }
      setImages([...images, ...urls])
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    const productData = {
      ...data,
      price: parseFloat(data.price),
      compare_at_price: data.compare_at_price ? parseFloat(data.compare_at_price) : null,
      stock_quantity: parseInt(data.stock_quantity) || 0,
      images: images,
      description: description,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()) : []
    }

    try {
      if (isEditing) {
        await productService.update(id, productData)
        toast.success('Product updated successfully')
      } else {
        await productService.create(productData)
        toast.success('Product created successfully')
      }
      navigate('/admin/products')
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Product' : 'Create Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Product Name *</label>
                  <input {...register('name')} className="input-field" />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Short Description</label>
                  <input {...register('short_description')} className="input-field" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    className="bg-white dark:bg-dark-800"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Product Images
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-dark-700">
                    <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-dark-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Image className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {uploading ? 'Uploading...' : 'Add Image'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pricing & Stock
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Price *</label>
                  <input {...register('price')} className="input-field" />
                  {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="label">Compare at Price</label>
                  <input {...register('compare_at_price')} className="input-field" />
                </div>
                <div>
                  <label className="label">Stock Quantity</label>
                  <input {...register('stock_quantity')} className="input-field" />
                </div>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Organization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Category</label>
                  <select {...register('category_id')} className="select-field">
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Tags</label>
                  <input {...register('tags')} placeholder="luxury, premium, new" className="input-field" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Comma separated</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Status
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('is_active')} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('is_featured')} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                </label>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary">
              {isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}