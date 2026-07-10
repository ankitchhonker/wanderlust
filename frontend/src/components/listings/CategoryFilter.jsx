import './CategoryFilter.css'

const CATEGORIES = [
  { label: 'All', value: '', icon: 'fa-globe' },
  { label: 'Trending', value: 'trending', icon: 'fa-fire' },
  { label: 'Beachfront', value: 'Beachfront', icon: 'fa-umbrella-beach' },
  { label: 'Pools', value: 'Amazing pools', icon: 'fa-person-swimming' },
  { label: 'Lakefronts', value: 'Lakefronts', icon: 'fa-water' },
  { label: 'Treehouse', value: 'Treehouse', icon: 'fa-tree' },
  { label: 'Rooms', value: 'Rooms', icon: 'fa-bed' },
  { label: 'Historical', value: 'Historicalhomes', icon: 'fa-monument' },
  { label: 'Mountains', value: 'Mountains', icon: 'fa-mountain' },
  { label: 'Cabin', value: 'Cabin', icon: 'fa-house' },
  { label: 'Desert', value: 'Desert', icon: 'fa-sun' },
]

export default function CategoryFilter({ active, onChange, showTax, onToggleTax }) {
  return (
    <div className="category-bar">
      <div className="category-scroll">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className={`category-item ${active === cat.value ? 'active' : ''}`}
            onClick={() => onChange(cat.value)}
          >
            <i className={`fa-solid ${cat.icon}`} />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
      <label className="tax-toggle">
        <div className={`toggle-track ${showTax ? 'on' : ''}`} onClick={onToggleTax}>
          <div className="toggle-thumb" />
        </div>
        <span>Show taxes</span>
      </label>
    </div>
  )
}
