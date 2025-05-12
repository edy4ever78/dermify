'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-8">
            About Dermify
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dermify is dedicated to helping you achieve healthy, beautiful skin through expert advice and carefully curated skincare products. Our mission is to empower everyone to feel confident in their skin by providing trustworthy information and access to the best products for every skin type.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Founded by skincare enthusiasts and professionals, Dermify combines science-backed recommendations with a passion for real results. We believe that skincare should be accessible, effective, and enjoyable for all.
            </p>
          </div>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400">
              To provide reliable skincare education and connect users with products that truly work for their unique needs. We strive to simplify the skincare journey and help you make informed decisions for your skin health.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Why Choose Dermify?</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>Expert advice from dermatologists and skincare professionals</li>
              <li>Personalized product recommendations for every skin type</li>
              <li>Comprehensive guides and resources for all your skincare questions</li>
              <li>Community-driven reviews and honest feedback</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Join Our Community</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Whether you’re a skincare beginner or a seasoned enthusiast, Dermify welcomes you. Explore our resources, discover new products, and connect with others who share your passion for healthy skin. If you have any questions or want to learn more, feel free to <Link href="/contact" className="text-teal-500 hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
