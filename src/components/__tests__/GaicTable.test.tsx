import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GaicTable } from '@/components/GaicTable'

const mockModels = [
  { name: 'Model A', family: 'GA', df: 12, gaic: 12329.6 },
  { name: 'Model B', family: 'BCT', df: 14, gaic: 12305.6 },
  { name: 'Model C', family: 'GB2', df: 14, gaic: 12348.9 },
]

describe('GaicTable', () => {
  it('renders all model rows', () => {
    render(<GaicTable models={mockModels} />)
    expect(screen.getByText('Model A')).toBeInTheDocument()
    expect(screen.getByText('Model B')).toBeInTheDocument()
    expect(screen.getByText('Model C')).toBeInTheDocument()
  })

  it('marks the best model (lowest GAIC) with a star', () => {
    render(<GaicTable models={mockModels} />)
    expect(screen.getByText('★')).toBeInTheDocument()
    expect(screen.getByText('Model B').closest('tr')).toHaveClass('bg-positive-50')
  })

  it('computes delta GAIC correctly', () => {
    render(<GaicTable models={mockModels} />)
    // Model B is best (12305.6), Model A delta = 24.0, Model C delta = 43.3
    expect(screen.getByText('+24.0')).toBeInTheDocument()
    expect(screen.getByText('+43.3')).toBeInTheDocument()
    // Best model shows dash
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('sorts by GAIC ascending by default', () => {
    const { container } = render(<GaicTable models={mockModels} />)
    const rows = container.querySelectorAll('tbody tr')
    // First row should be Model B (lowest GAIC)
    expect(rows[0].textContent).toContain('Model B')
  })

  it('toggles sort direction on column click', () => {
    const { container } = render(<GaicTable models={mockModels} />)
    // Click GAIC header to toggle to descending
    fireEvent.click(screen.getByText('GAIC'))
    const rows = container.querySelectorAll('tbody tr')
    // First row should now be Model C (highest GAIC)
    expect(rows[0].textContent).toContain('Model C')
  })

  it('sorts by df when df column clicked', () => {
    const { container } = render(<GaicTable models={mockModels} />)
    fireEvent.click(screen.getByText('gl'))
    const rows = container.querySelectorAll('tbody tr')
    // Models A (df=12) should come first
    expect(rows[0].textContent).toContain('Model A')
  })
})
