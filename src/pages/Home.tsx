import { useEffect, useState } from 'react'

type GroceryItem = {
  id: number
  name: string
  category: string
  price: number
  unit: string
}

type CartItem = GroceryItem & {
  quantity: number
}

const GROCERY_ITEMS: GroceryItem[] = [
  { id: 1, name: 'Apples', category: 'Fruits', price: 19, unit: '1 kg' },
  { id: 2, name: 'Bananas', category: 'Fruits', price: 12, unit: '1 dozen' },
  { id: 3, name: 'Spinach', category: 'Vegetables', price: 16, unit: '1 bunch' },
  { id: 4, name: 'Tomatoes', category: 'Vegetables', price: 22, unit: '1 kg' },
  { id: 5, name: 'Milk', category: 'Dairy', price: 28, unit: '1 liter' },
  { id: 6, name: 'Cheddar Cheese', category: 'Dairy', price: 45, unit: '200 g' },
  { id: 7, name: 'Brown Bread', category: 'Bakery', price: 30, unit: '1 loaf' },
  { id: 8, name: 'Eggs', category: 'Protein', price: 38, unit: '12 pcs' },
  { id: 9, name: 'Chicken Breast', category: 'Protein', price: 95, unit: '500 g' },
  { id: 10, name: 'Olive Oil', category: 'Pantry', price: 120, unit: '500 ml' },
  { id: 11, name: 'Orange Juice', category: 'Beverages', price: 52, unit: '1 liter' },
]

const COUPONS: Record<string, number> = {
  SAVE10: 10,
  FRESH20: 20,
  GROCERY5: 5,
}

const CART_STORAGE_KEY = 'discount-system-cart'

function readStoredCart() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function getThresholdDiscountRate(subtotal: number) {
  if (subtotal >= 250) {
    return 15
  }

  if (subtotal >= 150) {
    return 10
  }

  if (subtotal >= 80) {
    return 5
  }

  return 0
}

function Home() {
  const [cart, setCart] = useState<CartItem[]>(readStoredCart)
  const [history, setHistory] = useState<CartItem[][]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('Use SAVE10, FRESH20, or GROCERY5.')

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const categories = ['All', ...new Set(GROCERY_ITEMS.map((item) => item.category))]

  const visibleItems = GROCERY_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter

    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price
    }

    if (sortBy === 'price-high') {
      return b.price - a.price
    }

    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }

    return a.id - b.id
  })

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const thresholdRate = getThresholdDiscountRate(subtotal)
  const thresholdDiscount = (subtotal * thresholdRate) / 100
  const discountedSubtotal = subtotal - thresholdDiscount
  const couponRate = appliedCoupon ? COUPONS[appliedCoupon] ?? 0 : 0
  const couponDiscount = (discountedSubtotal * couponRate) / 100
  const finalTotal = discountedSubtotal - couponDiscount

  function updateCart(nextCart: CartItem[]) {
    setHistory((current) => [...current, cart])
    setCart(nextCart)
  }

  function addToCart(item: GroceryItem) {
    const existingItem = cart.find((entry) => entry.id === item.id)

    if (existingItem) {
      updateCart(
        cart.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        ),
      )
      return
    }

    updateCart([...cart, { ...item, quantity: 1 }])
  }

  function removeFromCart(itemId: number) {
    const currentItem = cart.find((item) => item.id === itemId)
    if (!currentItem) {
      return
    }

    if (currentItem.quantity === 1) {
      updateCart(cart.filter((item) => item.id !== itemId))
      return
    }

    updateCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    )
  }

  function undoLastAction() {
    const previousCart = history.at(-1)
    if (!previousCart) {
      return
    }

    setCart(previousCart)
    setHistory((current) => current.slice(0, -1))
  }

  function applyCoupon() {
    const normalizedCode = couponInput.trim().toUpperCase()

    if (!normalizedCode) {
      setAppliedCoupon('')
      setCouponMessage('Enter a coupon code to apply a promo discount.')
      return
    }

    const rate = COUPONS[normalizedCode]
    if (!rate) {
      setAppliedCoupon('')
      setCouponMessage('Coupon not found. Try SAVE10, FRESH20, or GROCERY5.')
      return
    }

    setAppliedCoupon(normalizedCode)
    setCouponMessage(`${normalizedCode} applied for ${rate}% off.`)
  }

  function clearCoupon() {
    setAppliedCoupon('')
    setCouponInput('')
    setCouponMessage('Promo code cleared.')
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff7ed_45%,_#f8fafc_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="grid gap-10 p-6 lg:grid-cols-[1.3fr_0.9fr] lg:p-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold tracking-[0.2em] text-amber-800 uppercase">
                  Grocery Discount System
                </span>
                <div className="space-y-3">
                  <h1 className="max-w-3xl font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Shop smart with instant cart totals, threshold discounts,
                    and promo code savings.
                  </h1>
                 
                </div>
              </div>

              <section className="grid gap-4 rounded-[1.5rem] bg-slate-950 p-5 text-white sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-300">Cart items</p>
                  <p className="mt-2 text-3xl font-semibold">{totalItems}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Threshold offer</p>
                  <p className="mt-2 text-3xl font-semibold">{thresholdRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Payable total</p>
                  <p className="mt-2 text-3xl font-semibold">
                    {formatCurrency(finalTotal)}
                  </p>
                </div>
              </section>

              <section className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      Search item
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search groceries..."
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-amber-400"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      Filter category
                    </span>
                    <select
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      Sort by
                    </span>
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low to high</option>
                      <option value="price-high">Price: High to low</option>
                      <option value="name">Name</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleItems.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">
                            {item.category}
                          </p>
                          <h2 className="mt-2 text-xl font-semibold text-slate-900">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Pack size: {item.unit}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-slate-950"
                      >
                        Add to cart
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6 rounded-[1.75rem] bg-slate-900 p-6 text-white">
              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-semibold">Your cart</h2>
                <p className="text-sm leading-6 text-slate-300">
                  Threshold discount: 5% above {formatCurrency(80)}, 10% above{' '}
                  {formatCurrency(150)}, and 15% above {formatCurrency(250)}.
                </p>
              </div>

              <div className="space-y-3">
                {cart.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-950/40 p-5 text-sm text-slate-400">
                    Your cart is empty. Add a few grocery items to see live
                    pricing updates.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.5rem] border border-slate-800 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-white">{item.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold text-amber-300">
                          {formatCurrency(item.quantity * item.price)}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                          Add one
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex-1 rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                        >
                          Remove one
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <section className="rounded-[1.5rem] bg-white/6 p-4">
                <label className="block text-sm font-medium text-slate-200">
                  Coupon code
                </label>
                <div className="mt-3 flex gap-3">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value)}
                    placeholder="Enter promo code"
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                  >
                    Apply
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-300">{couponMessage}</p>
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={clearCoupon}
                      className="text-sm font-semibold text-amber-300 transition hover:text-amber-200"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </section>

              <section className="rounded-[1.5rem] bg-white p-5 text-slate-900">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Threshold discount ({thresholdRate}%)</span>
                    <span className="font-semibold text-emerald-700">
                      -{formatCurrency(thresholdDiscount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Coupon discount ({couponRate}%)</span>
                    <span className="font-semibold text-emerald-700">
                      -{formatCurrency(couponDiscount)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between text-base">
                      <span className="font-semibold">Final total</span>
                      <span className="text-2xl font-bold text-slate-950">
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={undoLastAction}
                  disabled={history.length === 0}
                  className="mt-5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Undo last add/remove action
                </button>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home
