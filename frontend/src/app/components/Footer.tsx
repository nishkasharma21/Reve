import { Link } from "react-router";
import { Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wide">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:underline">
                  How It Works
                </Link>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/messages" className="hover:underline">
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wide">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wide">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2025 Campus Closet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}