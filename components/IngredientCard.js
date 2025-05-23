import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function IngredientCard({ ingredient }) {
  const { t } = useTranslation();
  
  // Handle missing image with a fallback
  const imageUrl = ingredient.imageUrl || '/images/ingredients/placeholder.jpg';
  
  return (
    <Link href={`/ingredients/${ingredient.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        {/* Card Image - with fallback for missing images */}
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          {/* Show image if available, otherwise show a placeholder with ingredient initial */}
          {imageUrl ? (
            <div className="w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <div 
                className="absolute inset-0 bg-center bg-cover z-0"
                style={{ 
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              ></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl font-bold text-gray-400 dark:text-gray-600">
                {ingredient.name.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Category Tag */}
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2 py-1 bg-teal-500/90 text-white text-xs font-medium rounded-full">
              {ingredient.category}
            </span>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{ingredient.name}</h3>
          
          {/* Common Names / Aliases */}
          {ingredient.aliases && ingredient.aliases.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t('Also Known As')}: {ingredient.aliases.join(', ')}
            </p>
          )}
          
          {/* Short Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {ingredient.description}
          </p>
          
          {/* Suitable Skin Types */}
          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('Good For')}:
            </h4>
            <div className="flex flex-wrap gap-1">
              {ingredient.skinTypes.slice(0, 3).map((type, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                >
                  {type}
                </span>
              ))}
              {ingredient.skinTypes.length > 3 && (
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  +{ingredient.skinTypes.length - 3}
                </span>
              )}
            </div>
          </div>
          
          {/* View Details Link */}
          <div className="mt-4 text-right">
            <span className="text-teal-500 dark:text-teal-400 text-sm font-medium inline-flex items-center group">
              {t('View Details')}
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
