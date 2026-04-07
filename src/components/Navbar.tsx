import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-amber-200 text-amber-800 p-4 ">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Discount Grocery
        </Link>
        <div >
          <Link to="/" className="hover:text-red-400">
            Home
          </Link>
          <Link to="/about" className="ml-4 hover:text-red-400">
          About
          </Link>
          <Link to="/contact" className="ml-4 hover:text-red-400">
          Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar