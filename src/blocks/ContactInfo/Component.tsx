import React from 'react'
import type { ContactInfoBlock as ContactInfoBlockType } from '@/payload-types'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export const ContactInfoBlock: React.FC<ContactInfoBlockType> = ({
  sectionTitle,
  companyName,
  address,
  phone,
  email,
}) => {
  if (!address && !phone && !email) return null

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container">
        <ScrollReveal>
          <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8 lg:mb-12">
            {sectionTitle || '联系信息'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {companyName && (
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-800 mb-1">公司名称</h3>
                <p className="text-xs text-gray-500">{companyName}</p>
              </div>
            )}
            {address && (
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-800 mb-1">地址</h3>
                <p className="text-xs text-gray-500">{address}</p>
              </div>
            )}
            {phone && (
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-800 mb-1">电话</h3>
                <p className="text-xs text-gray-500">{phone}</p>
              </div>
            )}
            {email && (
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-800 mb-1">邮箱</h3>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
