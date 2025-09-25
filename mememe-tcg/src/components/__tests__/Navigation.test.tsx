import { render, screen } from '@testing-library/react'
import Navigation from '../Navigation'

// Next.jsのusePathnameをモック
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Navigation', () => {
  it('renders the logo text', () => {
    render(<Navigation />)
    const logo = screen.getByText('めめめのくらげ TCG')
    expect(logo).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navigation />)

    expect(screen.getByText('カードコレクション')).toBeInTheDocument()
    expect(screen.getByText('デッキビルダー')).toBeInTheDocument()
    expect(screen.getByText('対戦')).toBeInTheDocument()
  })

  it('has correct href attributes for links', () => {
    render(<Navigation />)

    const collectionLink = screen.getByText('カードコレクション').closest('a')
    const deckBuilderLink = screen.getByText('デッキビルダー').closest('a')
    const gameLink = screen.getByText('対戦').closest('a')

    expect(collectionLink).toHaveAttribute('href', '/collection')
    expect(deckBuilderLink).toHaveAttribute('href', '/deck-builder')
    expect(gameLink).toHaveAttribute('href', '/game')
  })

  it('applies correct link for logo', () => {
    render(<Navigation />)
    const homeLink = screen.getByText('めめめのくらげ TCG').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})