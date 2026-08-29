import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Volume2,
  Sparkles,
  MapPin,
  X,
  Search,
} from 'lucide-react';
import { CulturalItem, SupportedLanguage } from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

const DEFAULT_CULTURAL_ITEMS: CulturalItem[] = [
  {
    id: 'cult_1',
    name: 'ফুলাম গামোচা',
    englishName: 'Phulam Gamosa',
    state: 'Assam',
    category: 'CLOTHING',
    description: 'Traditional white and red cotton towel symbolizing utmost respect, love, and hospitality.',
    icon: '🧣',
    soundDescription: 'Weaving loom shuttle sound in Sualkuchi',
  },
  {
    id: 'cult_2',
    name: 'জাপি',
    englishName: 'Jaapi (Bamboo Conical Hat)',
    state: 'Assam',
    category: 'CRAFT',
    description: 'Conical woven bamboo hat decorated with red/black felt cloth used for sun shade and cultural honor.',
    icon: '👒',
    soundDescription: 'Bamboo splitting and weaving rhythm',
  },
  {
    id: 'cult_3',
    name: 'মেখেলা চাদৰ',
    englishName: 'Muga Silk Mekhela Sador',
    state: 'Assam',
    category: 'CLOTHING',
    description: 'Golden shimmering traditional Assamese two-piece attire woven from endemic Muga silkworms.',
    icon: '👘',
    soundDescription: 'Silk rustle and spinning wheel rhythm',
  },
  {
    id: 'cult_4',
    name: 'Puanchei',
    englishName: 'Mizo Puan (Traditional Wrap)',
    state: 'Mizoram',
    category: 'CLOTHING',
    description: 'Vibrant woven cotton wrap-around skirt featuring intricate geometric patterns worn at Chapchar Kut.',
    icon: '🧵',
    soundDescription: 'Cheraw bamboo dance rhythm',
  },
  {
    id: 'cult_5',
    name: 'মাজুলীৰ মুখা',
    englishName: 'Majuli Vaishnavite Mask',
    state: 'Assam',
    category: 'CRAFT',
    description: 'Handcrafted clay, bamboo, and cow-dung theatrical masks depicting characters from the Srimanta Sankardev Bhaona.',
    icon: '🎭',
    soundDescription: 'Khol drum and Bhaona dialogue',
  },
  {
    id: 'cult_6',
    name: 'লকতাক ফুমদি',
    englishName: 'Loktak Floating Phumdis',
    state: 'Manipur',
    category: 'NATURE',
    description: 'Unique floating circular biomass islands on Loktak Lake, home of the endangered Sangai dancing deer.',
    icon: '🛶',
    soundDescription: 'Gentle ripple of oars on freshwater lake',
  },
  {
    id: 'cult_7',
    name: 'বিহু পেঁপা',
    englishName: 'Bihu Buffalo Horn Pepa',
    state: 'Assam',
    category: 'MUSIC',
    description: 'Traditional wind horn instrument fashioned from buffalo horn producing soulful high-pitched melodic calls.',
    icon: '🎺',
    soundDescription: 'Soulful high-pitched melodic wind call',
  },
];

export const CulturalContentAdmin: React.FC = () => {
  const [items, setItems] = useState<CulturalItem[]>(() => {
    try {
      const saved = localStorage.getItem('mindcare_cultural_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CULTURAL_ITEMS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEngName, setFormEngName] = useState('');
  const [formState, setFormState] = useState<CulturalItem['state']>('Assam');
  const [formCategory, setFormCategory] = useState<CulturalItem['category']>('CRAFT');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState('🎁');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'ALL' || item.state === selectedState;
    return matchesSearch && matchesState;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEngName) return;

    const newItem: CulturalItem = {
      id: `cult_${Date.now()}`,
      name: formName,
      englishName: formEngName,
      state: formState,
      category: formCategory,
      description: formDescription,
      icon: formIcon || '🎋',
    };

    const updated = [newItem, ...items];
    setItems(updated);
    try {
      localStorage.setItem('mindcare_cultural_items', JSON.stringify(updated));
    } catch {
      // ignore
    }

    sound.playSuccess();
    setShowAddModal(false);
    setFormName('');
    setFormEngName('');
    setFormDescription('');
  };

  const handleDeleteItem = (id: string) => {
    sound.playAlert();
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    try {
      localStorage.setItem('mindcare_cultural_items', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div
      id="cultural-admin-root"
      className="bg-[#101F31] rounded-3xl p-6 sm:p-8 border border-[#243A50] shadow-2xl space-y-6 text-left text-[#F4F8FC]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#243A50] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#14283D] text-[#38D9C5] border border-[#243A50] flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-[#38D9C5] uppercase tracking-wider">
              Regional Customization Engine
            </span>
            <span className="bg-[#14283D] text-[#38D9C5] text-[11px] font-black px-2.5 py-0.5 rounded-full border border-[#243A50]">
              North East 8 States
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC]">
            North East Cultural Content & Heritage Assets
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-[#B7C5D6] max-w-2xl">
            Configure indigenous artifacts, traditional clothing, local cuisine, and auditory sounds for games and memory reminiscence.
          </p>
        </div>

        <button
          id="add-cultural-item-btn"
          onClick={() => {
            sound.playClick();
            setShowAddModal(true);
          }}
          className="min-h-[44px] px-5 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Regional Artifact</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#7F91A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cultural artifacts, sounds, or crafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#243A50] bg-[#14283D] text-[#F4F8FC] placeholder-[#7F91A6] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#19C3B1]"
          />
        </div>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-[#243A50] text-xs sm:text-sm font-black bg-[#14283D] text-[#F4F8FC] focus:outline-none focus:border-[#19C3B1]"
        >
          <option value="ALL">All 8 North East States</option>
          <option value="Assam">Assam</option>
          <option value="Meghalaya">Meghalaya</option>
          <option value="Manipur">Manipur</option>
          <option value="Mizoram">Mizoram</option>
          <option value="Nagaland">Nagaland</option>
          <option value="Tripura">Tripura</option>
          <option value="Arunachal">Arunachal Pradesh</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#14283D] rounded-2xl p-5 border border-[#243A50] hover:border-[#19C3B1] transition-all flex flex-col justify-between space-y-3 shadow-md group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#101F31] border border-[#243A50] text-[#38D9C5]">
                  {item.state} • {item.category}
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-[#F4F8FC]">
                  {item.englishName}{' '}
                  <span className="text-xs font-bold text-[#38D9C5] block">({item.name})</span>
                </h4>
                <p className="text-xs text-[#B7C5D6] font-medium line-clamp-3 mt-1">
                  {item.description}
                </p>
              </div>

              {item.soundDescription && (
                <div className="text-[11px] font-semibold text-[#38D9C5] bg-[#101F31] border border-[#243A50] p-2 rounded-xl flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 shrink-0 text-[#19C3B1]" />
                  <span className="truncate">{item.soundDescription}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#243A50]">
              <button
                onClick={() => voice.speak(`${item.englishName}. ${item.description}`, 'en')}
                className="text-xs font-black text-[#19C3B1] hover:text-[#38D9C5] flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Audio</span>
              </button>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-xs font-black text-[#FF5C6C] hover:text-red-400 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#07111F]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#101F31] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-[#243A50] shadow-2xl space-y-4 text-[#F4F8FC]">
            <div className="flex items-center justify-between border-b border-[#243A50] pb-3">
              <h3 className="text-lg font-black text-[#F4F8FC]">Add Regional Artifact</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-black text-[#B7C5D6] hover:text-[#FF5C6C] cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#B7C5D6] block mb-1">
                  Local / Regional Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ফুলাম গামোচা"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#243A50] bg-[#14283D] text-[#F4F8FC] placeholder-[#7F91A6] text-sm font-semibold focus:outline-none focus:border-[#19C3B1]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#B7C5D6] block mb-1">
                  English Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phulam Gamosa"
                  value={formEngName}
                  onChange={(e) => setFormEngName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#243A50] bg-[#14283D] text-[#F4F8FC] placeholder-[#7F91A6] text-sm font-semibold focus:outline-none focus:border-[#19C3B1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#B7C5D6] block mb-1">State</label>
                  <select
                    value={formState}
                    onChange={(e) => setFormState(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#243A50] text-sm font-black bg-[#14283D] text-[#F4F8FC] focus:outline-none focus:border-[#19C3B1]"
                  >
                    <option value="Assam">Assam</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Arunachal">Arunachal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#B7C5D6] block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#243A50] text-sm font-black bg-[#14283D] text-[#F4F8FC] focus:outline-none focus:border-[#19C3B1]"
                  >
                    <option value="CLOTHING">Clothing & Silk</option>
                    <option value="CRAFT">Handicraft & Bamboo</option>
                    <option value="FOOD">Cuisine & Tea</option>
                    <option value="FESTIVAL">Festival & Dance</option>
                    <option value="NATURE">Flora & Fauna</option>
                    <option value="MUSIC">Folk Music & Instrument</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#B7C5D6] block mb-1">
                  Emoji / Icon (e.g. 🧣, 🥁, 🛶)
                </label>
                <input
                  type="text"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#243A50] bg-[#14283D] text-[#F4F8FC] placeholder-[#7F91A6] text-sm font-semibold focus:outline-none focus:border-[#19C3B1]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#B7C5D6] block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Traditional significance..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#243A50] bg-[#14283D] text-[#F4F8FC] placeholder-[#7F91A6] text-sm font-semibold focus:outline-none focus:border-[#19C3B1]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-sm rounded-2xl transition-all shadow-xs cursor-pointer"
              >
                Save Cultural Artifact
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
