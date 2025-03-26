'use client'

import { useState } from "react";

// A customizable product card component to demonstrate Tambo's prop-filling capabilities
export const ExampleComponent = ({ 
  productName,
  price,
  description,
  discountPercentage,
  accentColor,
  inStock
}: { 
  productName: string;
  price: number;
  description: string;
  discountPercentage: number;
  accentColor: 'indigo' | 'emerald' | 'rose' | 'amber';
  inStock: boolean;
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const colorClasses = {
    indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    emerald: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    rose: 'bg-rose-500 hover:bg-rose-600 text-white',
    amber: 'bg-amber-500 hover:bg-amber-600 text-white'
  };

  const discountedPrice = price - (price * (discountPercentage / 100));

  return (
    <div className="w-full max-w-sm rounded-xl shadow-lg overflow-hidden bg-white p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-900">{productName}</h2>
        {discountPercentage > 0 && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            {discountPercentage}% OFF
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          {discountPercentage > 0 && (
            <span className="text-sm line-through text-gray-500">
              ${price.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-gray-900">
            ${discountedPrice.toFixed(2)}
          </span>
        </div>
        <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
          {inStock ? '✓ In Stock' : '× Out of Stock'}
        </span>
      </div>

      <p className="text-gray-600 text-sm">{description}</p>

      <button
        onClick={() => setIsAdded(!isAdded)}
        disabled={!inStock}
        className={`w-full px-4 py-2 rounded-lg transition-all duration-200 ${
          isAdded 
            ? 'bg-gray-100 text-gray-800' 
            : colorClasses[accentColor]
        } ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isAdded ? 'Added to Cart ✓' : 'Add to Cart'}
      </button>
    </div>
  );
};
