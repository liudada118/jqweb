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
    href: '/about',
    dropdown: [
      { label: '品牌故事', href: '/brand-story' },
      { label: '联系我们', href: '/contact' },
      { label: '公司资料', href: '/about' },
    ],
  },
  {
    label: '产品和解决方案',
    href: '/products',
    dropdown: [
      { label: '产品总览', href: '/products' },
      { label: '关怀事业部', href: '/care' },
      { label: '精密事业部', href: '/precision' },
      { label: '定制事业部', href: '/customsolutions' },
    ],
  },
  {
    label: '认识部门',
    href: '/care',
    dropdown: [
      { label: '关怀事业部', href: '/care' },
      { label: '精密事业部', href: '/precision' },
      { label: '定制事业部', href: '/customsolutions' },
      { label: 'Lab实验室', href: '/about' },
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
      className="absolute top-full left-1/2 z-50 mt-2 w-44 -translate-x-1/2 rounded-sm border border-gray-100 bg-white py-1.5 shadow-lg"
    >
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
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

export const HeaderClient: React.FC<HeaderClientProps> = ({ data: _data }) => {
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-colors">
      <div className="container flex h-16 items-center justify-between lg:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold tracking-tight text-white">GQ</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.dropdown ? (
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary ${
                    pathname === item.href || item.dropdown.some((d) => pathname === d.href)
                      ? 'text-primary'
                      : ''
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      openDropdown === item.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary ${
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

        <div className="flex items-center gap-5">
          <button className="hidden items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-primary lg:flex">
            <span>语言</span>
          </button>
          <Link href="/search" className="text-gray-500 transition-colors hover:text-primary">
            <span className="sr-only">Search</span>
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <button
            className="text-gray-600 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white py-4 lg:hidden">
          <nav className="container flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleMobileExpanded(item.label)}
                      className="flex w-full items-center justify-between py-2.5 text-sm text-gray-700"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileExpanded === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="space-y-1 pb-2 pl-4">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-sm text-gray-500 hover:text-primary"
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
                    className="block py-2.5 text-sm text-gray-700"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-2 border-t border-gray-100 pt-2">
              <button className="py-2 text-sm text-gray-600">语言切换</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
