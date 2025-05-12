'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/products/cleansers" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Cleansers</Link></li>
              <li><Link href="/products/moisturizers" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Moisturizers</Link></li>
              <li><Link href="/products/serums" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Serums</Link></li>
              <li><Link href="/products/sunscreens" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Sunscreens</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ingredients</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/ingredients/retinoids" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Retinoids</Link></li>
              <li><Link href="/ingredients/aha-bha" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">AHA/BHA</Link></li>
              <li><Link href="/ingredients/vitamin-c" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Vitamin C</Link></li>
              <li><Link href="/ingredients/niacinamide" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Niacinamide</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/blog" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Blog</Link></li>
              <li><Link href="/guides" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Guides</Link></li>
              <li><Link href="/routines" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Routines</Link></li>
              <li><Link href="/skin-analysis" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Face Analysis</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">About</Link></li>
              <li><Link href="/contact" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Contact</Link></li>
              <li><Link href="/privacy" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Privacy</Link></li>
              <li><Link href="/terms" className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-500">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-base text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} Dermify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
