import { classNames } from '@/future/utils/helpers'
import './PortfolioFilter.css'

export function PortfolioFilter({ categories, active, onChange }) {
  return (
    <div className="portfolio-filter" role="tablist" aria-label="Portfolio categories">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={active === category}
          className={classNames(
            'portfolio-filter__item',
            active === category && 'is-active',
          )}
          onClick={() => onChange?.(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
