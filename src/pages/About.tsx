import { Link } from 'react-router-dom'
const About = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">Discover who we are and what we stand for</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              We are committed to providing you with the best deals on a wide range of products.
              Our mission is to make quality items accessible to everyone at affordable prices.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Competitive pricing on all products</li>
              <li>• Wide selection of quality items</li>
              <li>• Fast and reliable shipping</li>
              <li>• Excellent customer service</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            Explore our collection and enjoy shopping with us. If you have any questions, feel free to contact us.
          </p>
          <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About