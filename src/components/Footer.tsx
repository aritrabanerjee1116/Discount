

import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-amber-200 text-amber-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Discount Grocery</h3>
            <p className="text-sm">
              Your trusted source for discounted groceries and everyday essentials.
              Quality products at unbeatable prices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>Email: info@discountgrocery.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Grocery St, Food City, FC 12345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; 2026 Discount Grocery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer