'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, Menu, X } from 'lucide-react'

import type { Header } from '@/payload-types'

interface DropdownItem {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  dropdown?: DropdownItem[]
}

const navItems: NavItem[] = [
  {
    label: '关于我们',
    href: '/brand-story',
    dropdown: [
      { label: '品牌故事', href: '/brand-story' },
      { label: '联系我们', href: '#' },
      { label: '公司资料', href: '#' },
    ],
  },
  {
    label: '产品和解决方案',
    href: '/products',
    dropdown: [
      { label: '产品总览', href: '/products' },
      { label: '关怀事业部', href: '/care' },
      { label: '精密事业部', href: '/precision' },
      { label: '定制事业部', href: '/custom/solutions' },
    ],
  },
  {
    label: '认识部门',
    href: '/products',
    dropdown: [
      { label: '关怀事业部', href: '/care' },
      { label: '精密事业部', href: '/precision' },
      { label: '定制事业部', href: '/custom/solutions' },
      { label: 'Lab实验室', href: '#' },
    ],
  },
]

function DesktopDropdown({
  items,
  isOpen,
  onClose,
}: {
  items: DropdownItem[]
  isOpen: boolean
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 rounded-sm shadow-lg border py-1.5 z-50 bg-white border-gray-100"
    >
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2 text-sm transition-colors text-gray-600 hover:text-primary hover:bg-gray-50"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  const toggleMobileExpanded = (label: string) => {
    setMobileExpanded(mobileExpanded === label ? null : label)
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b transition-colors bg-white/95 border-gray-100">
      <div className="container flex items-center justify-between h-16 lg:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold tracking-tight">GQ</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-9">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.dropdown ? (
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 text-gray-700 hover:text-primary ${
                    pathname === item.href || item.dropdown.some((d) => pathname === d.href)
                      ? 'text-primary'
                      : ''
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === item.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 text-gray-700 hover:text-primary ${
                    pathname === item.href ? 'text-primary' : ''
                  }`}
                >
                  {item.label}
                </Link>
              )}
              {item.dropdown && (
                <DesktopDropdown
                  items={item.dropdown}
                  isOpen={openDropdown === item.label}
                  onClose={() => setOpenDropdown(null)}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Right side utilities */}
        <div className="flex items-center gap-5">
          <button className="hidden lg:flex items-center gap-1.5 text-sm transition-colors text-gray-600 hover:text-primary">
            <span>语言</span>
          </button>
          <button className="transition-colors text-gray-500 hover:text-primary">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t py-4 bg-white border-gray-100">
          <nav className="container flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleMobileExpanded(item.label)}
                      className="flex items-center justify-between w-full text-sm py-2.5 text-gray-700"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileExpanded === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="pl-4 pb-2 space-y-1">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm py-2 text-gray-500 hover:text-primary"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm py-2.5 text-gray-700"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-100">
              <button className="text-sm py-2 text-gray-600">语言切换</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
