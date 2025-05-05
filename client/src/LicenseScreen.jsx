// client/src/LicenseScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const licenseTexts = {
  MIT: `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,

  "BSD-2-Clause": `Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`,

  ISC: `Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.`
};

const licenses = [
  {
    name: 'LOPPO Register',
    version: '0.2.0',
    license: 'MIT',
    copyright: 'Copyright (c) 2025 LOPPO, LLC. / Seibe TAKAHASHI'
  },
  {
    name: 'React',
    version: '19.0.0',
    license: 'MIT',
    copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.'
  },
  {
    name: 'React DOM',
    version: '19.0.0',
    license: 'MIT',
    copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.'
  },
  {
    name: 'Express',
    version: '5.1.0',
    license: 'MIT',
    copyright: 'Copyright (c) 2014-present TJ Holowaychuk & others'
  },
  {
    name: 'Square Client',
    version: '42.0.1',
    license: 'MIT',
    copyright: 'Copyright (c) 2019 Square, Inc.'
  },
  {
    name: 'TailwindCSS',
    version: '4.1.5',
    license: 'MIT',
    copyright: 'Copyright (c) Tailwind Labs, Inc.'
  },
  {
    name: 'Lucide React',
    version: '0.507.0',
    license: 'ISC',
    copyright: 'Copyright (c) 2020-present Lucide Contributors'
  },
  {
    name: 'dotenv',
    version: '16.4.7',
    license: 'BSD-2-Clause',
    copyright: 'Copyright (c) 2015, Scott Motte'
  },
  {
    name: 'cors',
    version: '2.8.5',
    license: 'MIT',
    copyright: 'Copyright (c) 2013-present Troy Goode'
  }
];

const LicenseScreen = ({ onClose, translations }) => {
  const [expandedLicense, setExpandedLicense] = useState(null);
  const modalRef = useRef(null);
  
  // 言語設定（App.jsxからpropsとして取得）
  const t = translations || {
    licenseTitle: 'オープンソースライセンス',
    licenseDescription: 'このアプリケーションは以下のオープンソースライブラリを使用しています：',
    version: 'バージョン',
    license: 'ライセンス',
    showFullLicense: 'ライセンス全文を表示',
    hideLicense: '閉じる',
    close: '閉じる'
  };

  // モーダル外クリックで閉じる機能
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // キーボードのEscキーで閉じる機能
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const toggleLicense = (index) => {
    if (expandedLicense === index) {
      setExpandedLicense(null);
    } else {
      setExpandedLicense(index);
    }
  };

  return (
    // bg-black/50 を使用して透過背景を設定（Tailwind CSS v4 のスラッシュ記法）
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold">{t.licenseTitle}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-grow">
          <p className="text-gray-700 mb-6">{t.licenseDescription}</p>
          
          <div className="space-y-6">
            {licenses.map((lib, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-gray-50">
                  <h3 className="text-xl font-medium">{lib.name}</h3>
                  <div className="flex flex-wrap gap-x-6 text-sm text-gray-600 mt-1">
                    <p>{t.version}: {lib.version}</p>
                    <p>{t.license}: {lib.license}</p>
                  </div>
                  <p className="mt-2 text-gray-700">{lib.copyright}</p>
                  
                  <button
                    onClick={() => toggleLicense(index)}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center transition-colors"
                  >
                    {expandedLicense === index ? t.hideLicense : t.showFullLicense}
                  </button>
                </div>
                
                {expandedLicense === index && (
                  <div className="p-4 bg-gray-100 border-t">
                    <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700">
                      {licenseTexts[lib.license]}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseScreen;