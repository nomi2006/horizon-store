import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Mail, Printer } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const { data } = await orderService.adminGetOrderById(id)
      setOrder(data)
      setStatus(data?.status || '')
      setNote(data?.admin_notes || '')
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!status || status === order?.status) return
    setUpdating(true)
    try {
      await orderService.updateStatus(id, status)
      toast.success('Order status updated')
      fetchOrder()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleNoteUpdate = async () => {
    try {
      await orderService.addNote(id, note)
      toast.success('Note added')
      fetchOrder()
    } catch (error) {
      toast.error('Failed to add note')
    }
  }

  const generateInvoice = () => {
    if (!order) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229)
    doc.text('Horizon', pageWidth / 2, 20, { align: 'center' })
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Invoice', pageWidth / 2, 30, { align: 'center' })

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Order #${order.order_number}`, 14, 45)
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 14, 52)
    doc.text(`Status: ${order.status}`, 14, 59)

    doc.setFontSize(10)
    doc.text('Shipping Address:', 14, 75)
    const addr = order.shipping_address
    doc.text(`${addr.firstName} ${addr.lastName}`, 14, 82)
    doc.text(addr.address, 14, 89)
    doc.text(`${addr.city}, ${addr.state} ${addr.zipCode}`, 14, 96)
    doc.text(addr.country, 14, 103)

    const tableData = order.order_items?.map(item => [
      item.product_name,
      item.quantity,
      `$${item.product_price.toFixed(2)}`,
      `$${item.total.toFixed(2)}`
    ]) || []

    autoTable(doc, {
      startY: 115,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    })

    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(12)
    doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 14, finalY)
    doc.text(`Shipping: $${order.shipping_cost.toFixed(2)}`, 14, finalY + 7)
    if (order.discount_amount > 0) {
      doc.text(`Discount: -$${order.discount_amount.toFixed(2)}`, 14, finalY + 14)
    }
    doc.setFontSize(14)
    doc.setTextColor(79, 70, 229)
    doc.text(`Total: $${order.total.toFixed(2)}`, 14, finalY + 24)

    doc.save(`invoice-${order.order_number}.pdf`)
  }

  if (loading) return <LoadingSpinner />

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Order not found</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Order #{order.order_number}
        </h1>
        <div className="flex-1" />
        <button
          onClick={generateInvoice}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Details
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-100 dark:border-dark-700 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-dark-700 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="select-field w-auto py-1 px-3"
                  disabled={updating}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={status === order.status || updating}
                  className="btn-primary text-sm py-1.5 px-4"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Items
            </h2>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 text-sm border-b border-gray-100 dark:border-dark-700 pb-3">
                  <img
                    src={item.products?.images?.[0] || '/placeholder.jpg'}
                    alt={item.product_name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.product_name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      ${item.product_price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${item.total.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">${order.shipping_cost.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${order.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-dark-700 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="text-gray-900 dark:text-white font-medium">
                {order.shipping_address?.firstName} {order.shipping_address?.lastName}
              </p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}</p>
              <p>{order.shipping_address?.country}</p>
              <p className="mt-2">{order.shipping_address?.phone}</p>
              <p>{order.shipping_address?.email}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Admin Notes
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field"
              rows="3"
              placeholder="Add a note..."
            />
            <button
              onClick={handleNoteUpdate}
              className="mt-2 w-full btn-primary text-sm py-2"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}