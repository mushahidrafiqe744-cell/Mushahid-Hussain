import React, { useState, useMemo } from 'react';
import { X, Search, Globe, Check, Sparkles } from 'lucide-react';
import { CountryCurrency, WORLD_COUNTRIES } from '../data/worldCountries';

interface CountryCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountryId: string;
  onSelectCountry: (country: CountryCurrency) => void;
}

export const CountryCurrencyModal: React.FC<CountryCurrencyModalProps> = ({
  isOpen,
  onClose,
  selectedCountryId,
  onSelectCountry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return WORLD_COUNTRIES;
    return WORLD_COUNTRIES.filter(
      (c) =>
        c.country.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#F8F5EE] rounded-3xl shadow-2xl border border-[#C5A059]/40 overflow-hidden z-10 flex flex-col max-h-[88vh] animate-scale-up">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#11261B] text-white flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center border border-[#C5A059]/40 text-[#DFC285]">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  Select Your Country & Currency
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/30 text-[#DFC285] text-[10px] font-bold uppercase tracking-wider">
                  Global
                </span>
              </div>
              <p className="text-xs text-[#A3B8A8] mt-0.5">
                Budget options will automatically calculate in your country's currency
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#DFC285] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close country selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#11261B]/10">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6E61]" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country name, currency code (e.g. Pakistan, Dubai, USD, PKR, EUR, AED)..."
              className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm bg-[#F8F5EE] border border-[#11261B]/15 rounded-xl text-[#11261B] placeholder-[#5C6E61]/60 focus:outline-hidden focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/25 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#5C6E61] hover:text-[#11261B] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Countries Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5C6E61] mb-2 px-1 flex items-center justify-between">
            <span>Available Countries ({filteredCountries.length})</span>
            <span>Click to switch currency</span>
          </div>

          {filteredCountries.length === 0 ? (
            <div className="py-12 text-center text-[#5C6E61]">
              <p className="text-sm font-semibold">No country matching "{searchQuery}"</p>
              <p className="text-xs text-[#8A9B8F] mt-1">Try searching by currency code like USD, PKR, AED, EUR</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCountries.map((c) => {
                const isSelected = selectedCountryId === c.id || selectedCountryId === c.code;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCountry(c);
                      onClose();
                    }}
                    className={`group p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#11261B] text-white border-[#C5A059] shadow-md scale-[1.01]'
                        : 'bg-white text-[#11261B] border-[#11261B]/10 hover:border-[#C5A059] hover:bg-[#F2EDE2]/70 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl select-none shrink-0 drop-shadow-xs">{c.flag}</span>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-xs sm:text-sm truncate">
                          {c.country}
                        </div>
                        <div className={`text-[11px] truncate flex items-center gap-1.5 mt-0.5 ${
                          isSelected ? 'text-[#DFC285]' : 'text-[#5C6E61]'
                        }`}>
                          <span className="font-mono font-semibold">{c.code}</span>
                          <span>•</span>
                          <span>{c.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-mono font-bold ${
                        isSelected
                          ? 'bg-[#C5A059] text-[#11261B]'
                          : 'bg-[#F8F5EE] text-[#11261B] group-hover:bg-white'
                      }`}>
                        {c.symbol}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#50E364] text-[#11261B] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#11261B]/10 flex items-center justify-between text-xs text-[#5C6E61]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Prices will show directly in selected currency</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#11261B] text-white font-bold hover:bg-[#1A3828] transition-colors cursor-pointer text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
