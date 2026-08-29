import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Volume2,
  Image,
  Sparkles,
  Users,
  MapPin,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { SupportedLanguage, FamilyMemoryItem, UserRole } from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface FamilyMemoryAlbumProps {
  currentLang: SupportedLanguage;
  currentRole: UserRole;
  patientName: string;
  onQuizComplete?: (score: number) => void;
}

const DEFAULT_FAMILY_MEMORIES: FamilyMemoryItem[] = [
  {
    id: 'fam_1',
    patientId: 'p_dhiren_01',
    type: 'PERSON',
    title: 'Priyanka Borah',
    subtitle: 'Your loving daughter & primary caregiver',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    voiceNoteText: 'Baba, this is Priyanka! Remember our morning walk at Dighalipukhuri park?',
    question: 'Who is this in the photo smiling with you?',
    options: ['Your Daughter Priyanka', 'Your Doctor Ananya', 'Your Niece Rumi', 'Your Neighbor Mina'],
    correctOptionIndex: 0,
    hint: 'She visits you every evening with Assam green tea.',
    approvedByCaregiver: true,
    createdAt: '2026-08-01',
  },
  {
    id: 'fam_2',
    patientId: 'p_dhiren_01',
    type: 'PERSON',
    title: 'Arunav (Grandson)',
    subtitle: 'Your grandson studying engineering in Guwahati',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    voiceNoteText: 'Koka (Grandpa), I scored 95% in math thanks to your puzzle lessons!',
    question: 'What is your grandson Arunav studying?',
    options: ['Engineering in Guwahati', 'Medical Sciences in GMCH', 'Music in Tezpur', 'Art in Kolkata'],
    correctOptionIndex: 0,
    hint: 'He loves solving math and mechanical puzzles with you.',
    approvedByCaregiver: true,
    createdAt: '2026-08-05',
  },
  {
    id: 'fam_3',
    patientId: 'p_dhiren_01',
    type: 'PLACE',
    title: 'Guwahati Ancestral Home',
    subtitle: 'Your home garden with Nahar trees and orchid orchids',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    voiceNoteText: 'Our family home in Silpukhuri where you built the tea veranda in 1984.',
    question: 'Where is this cherished family home located?',
    options: ['Silpukhuri, Guwahati', 'Shillong Peak', 'Kaziranga Forest', 'Dibrugarh Tea Estate'],
    correctOptionIndex: 0,
    hint: 'Near the historic Guwahati lake where you enjoy morning air.',
    approvedByCaregiver: true,
    createdAt: '2026-08-10',
  },
  {
    id: 'fam_4',
    patientId: 'p_dhiren_01',
    type: 'MILESTONE',
    title: 'Golden Jubilee Bihu Celebration',
    subtitle: 'Family gathering with traditional Mekhela Sador & Gamosa',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
    voiceNoteText: 'The entire family came together to present you the royal Eri Silk Gamosa.',
    question: 'What festival was the family celebrating together?',
    options: ['Rongali Bihu Festival', 'Diwali Lights', 'Durga Puja', 'New Year Dinner'],
    correctOptionIndex: 0,
    hint: 'The spring harvest festival with Bihu Dhol drums.',
    approvedByCaregiver: true,
    createdAt: '2026-08-15',
  },
];

export const FamilyMemoryAlbum: React.FC<FamilyMemoryAlbumProps> = ({
  currentLang,
  currentRole,
  patientName,
  onQuizComplete,
}) => {
  const [memories, setMemories] = useState<FamilyMemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('mindcare_family_memories');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_FAMILY_MEMORIES;
  });

  const [activeTab, setActiveTab] = useState<'ALBUM' | 'QUIZ'>('ALBUM');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Memory Form State (Caregiver Only)
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newType, setNewType] = useState<'PERSON' | 'PLACE' | 'MILESTONE' | 'OBJECT'>('PERSON');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVoiceNote, setNewVoiceNote] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '']);
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);

  const currentQuizItem = memories[quizIndex % memories.length];

  const handlePlayVoiceNote = (text?: string) => {
    if (!text) return;
    sound.playClick();
    voice.speak(text, currentLang);
  };

  const handleAnswerQuiz = (index: number) => {
    sound.playClick();
    setSelectedOption(index);
    if (index === currentQuizItem.correctOptionIndex) {
      setIsAnswerCorrect(true);
      sound.playSuccess();
      voice.speak(
        currentLang === 'as'
          ? 'অতি সুন্দৰ! আপুনি শুদ্ধকৈ মনত পেলালে।'
          : currentLang === 'bn'
          ? 'অপূর্ব! আপনি সঠিকভাবে মনে রেখেছেন।'
          : 'Wonderful! You remembered correctly.',
        currentLang,
      );

      setTimeout(() => {
        if (quizIndex < memories.length - 1) {
          setQuizIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsAnswerCorrect(null);
        } else {
          if (onQuizComplete) onQuizComplete(100);
          sound.playLevelUp();
        }
      }, 1800);
    } else {
      setIsAnswerCorrect(false);
      sound.playError();
      voice.speak(
        currentLang === 'as'
          ? 'চিন্তা নকৰিব, আৰু এবাৰ মনত পেলাই চাওক।'
          : currentLang === 'bn'
          ? 'চিন্তা করবেন না, আরেকবার ভেবে দেখুন।'
          : 'Take your time, let us look at the photo again.',
        currentLang,
      );
    }
  };

  const handleSkipQuestion = () => {
    sound.playClick();
    if (quizIndex < memories.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
    } else {
      setActiveTab('ALBUM');
    }
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: FamilyMemoryItem = {
      id: `fam_${Date.now()}`,
      patientId: 'p_dhiren_01',
      type: newType,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Cherished family recollection',
      imageUrl:
        newImageUrl.trim() ||
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
      voiceNoteText: newVoiceNote.trim() || `${patientName}, remember this special family moment?`,
      question: newQuestion.trim() || `Who or what is shown in this photo?`,
      options: newOptions.filter((o) => o.trim().length > 0),
      correctOptionIndex: newCorrectIndex,
      hint: 'A special moment with family.',
      approvedByCaregiver: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newItem, ...memories];
    setMemories(updated);
    try {
      localStorage.setItem('mindcare_family_memories', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setShowAddModal(false);
    sound.playSuccess();
  };

  return (
    <div
      id="family-memory-album-root"
      className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dae1ff] shadow-md space-y-6 text-left"
    >
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#dae1ff] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-rose-700 uppercase tracking-wider">
              Private Family Album & Reminiscence
            </span>
            <span className="bg-rose-50 text-rose-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-200">
              Caregiver Verified
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#001849]">
            Family Memory Album & Faces
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-[#455f88] max-w-2xl">
            Cherished photographs of your children, grandchildren, home, and milestones to strengthen familiar bond recognition.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="tab-view-album"
            onClick={() => {
              sound.playClick();
              setActiveTab('ALBUM');
            }}
            className={`min-h-[44px] px-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all ${
              activeTab === 'ALBUM'
                ? 'bg-[#006767] text-white shadow-xs'
                : 'bg-[#f2f4fc] text-[#455f88] hover:bg-[#eaedff]'
            }`}
          >
            📸 Browse Album ({memories.length})
          </button>

          <button
            id="tab-start-memory-quiz"
            onClick={() => {
              sound.playClick();
              setActiveTab('QUIZ');
              setQuizIndex(0);
              setSelectedOption(null);
              setIsAnswerCorrect(null);
            }}
            className={`min-h-[44px] px-5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'QUIZ'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Memory Quiz</span>
          </button>

          {/* Caregiver Add Photo Button */}
          {currentRole === 'CAREGIVER' && (
            <button
              id="add-memory-photo-btn"
              onClick={() => {
                sound.playClick();
                setShowAddModal(true);
              }}
              className="min-h-[44px] px-4 bg-[#001849] hover:bg-[#002b74] text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Memory Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: ALBUM GALLERY */}
      {activeTab === 'ALBUM' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {memories.map((item) => (
            <div
              key={item.id}
              className="bg-[#fafbff] rounded-2xl border-2 border-[#dae1ff] overflow-hidden hover:border-[#006767] transition-all flex flex-col group shadow-2xs"
            >
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.type}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-base font-black text-[#001849] line-clamp-1">{item.title}</h4>
                  <p className="text-xs font-semibold text-[#455f88] line-clamp-2 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                {item.voiceNoteText && (
                  <button
                    onClick={() => handlePlayVoiceNote(item.voiceNoteText)}
                    className="min-h-[40px] w-full px-3 py-2 bg-white hover:bg-[#eaedff] text-[#006767] border border-[#dae1ff] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Hear Loved One's Note</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: INTERACTIVE MEMORY QUIZ */}
      {activeTab === 'QUIZ' && currentQuizItem && (
        <div
          id="family-quiz-stage"
          className="max-w-2xl mx-auto bg-[#fafbff] rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-md space-y-6 text-center"
        >
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <span className="text-xs font-black text-rose-700 uppercase tracking-wider">
              Family Memory Question {quizIndex + 1} of {memories.length}
            </span>
            <button
              onClick={handleSkipQuestion}
              className="text-xs font-bold text-[#455f88] hover:text-[#001849] underline"
            >
              Skip for now
            </button>
          </div>

          {/* Large Photo Display */}
          <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-rose-200 shadow-sm relative group bg-slate-200">
            <img
              src={currentQuizItem.imageUrl}
              alt="Memory Prompt"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Spoken Question Banner */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-[#001849]">
              "{currentQuizItem.question}"
            </h3>

            {/* Voice Audio Listen Button */}
            {currentQuizItem.voiceNoteText && (
              <button
                id="listen-voice-hint-btn"
                onClick={() => handlePlayVoiceNote(currentQuizItem.voiceNoteText)}
                className="min-h-[44px] px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-2xl text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-all cursor-pointer mx-auto"
              >
                <Volume2 className="w-4 h-4 text-rose-600" />
                <span>🔊 Hear Loved One's Voice Hint</span>
              </button>
            )}
          </div>

          {/* Large Touch Target Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuizItem.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle =
                'bg-white border-2 border-[#dae1ff] text-[#001849] hover:border-rose-500 hover:bg-rose-50/50';

              if (isSelected) {
                if (isAnswerCorrect) {
                  btnStyle = 'bg-emerald-100 border-2 border-emerald-600 text-emerald-950 font-black';
                } else if (isAnswerCorrect === false) {
                  btnStyle = 'bg-rose-100 border-2 border-rose-600 text-rose-950 font-black';
                }
              }

              return (
                <button
                  key={idx}
                  id={`family-quiz-opt-${idx}`}
                  onClick={() => handleAnswerQuiz(idx)}
                  className={`min-h-[56px] p-4 rounded-2xl font-extrabold text-sm sm:text-base text-left flex items-center justify-between gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSelected && isAnswerCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#455f88] font-semibold border-t border-rose-100">
            <span>💡 {currentQuizItem.hint}</span>
            <button
              onClick={() => handlePlayVoiceNote(currentQuizItem.hint)}
              className="text-[#006767] font-bold hover:underline"
            >
              Listen to Hint
            </button>
          </div>
        </div>
      )}

      {/* Caregiver Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border-2 border-[#dae1ff] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-[#dae1ff] pb-3">
              <h3 className="text-lg font-black text-[#001849]">Add Family Photo & Quiz Prompt</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-[#455f88] hover:text-rose-600"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#455f88] block mb-1">Subject / Person Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arunav (Grandson)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#dae1ff] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#455f88] block mb-1">Relationship / Details</label>
                <input
                  type="text"
                  placeholder="e.g. Your grandson visiting during Bihu"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#dae1ff] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#455f88] block mb-1">Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#dae1ff] text-sm font-semibold bg-white"
                >
                  <option value="PERSON">Loved One / Family Member</option>
                  <option value="PLACE">Cherished Place / Home</option>
                  <option value="MILESTONE">Family Celebration / Milestone</option>
                  <option value="OBJECT">Sentimental Family Object</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#455f88] block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#dae1ff] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#455f88] block mb-1">Spoken Voice Hint</label>
                <textarea
                  rows={2}
                  placeholder="Baba, this is Priyanka! Remember when we went to Kaziranga?"
                  value={newVoiceNote}
                  onChange={(e) => setNewVoiceNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#dae1ff] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#455f88] block mb-1">Memory Question</label>
                <input
                  type="text"
                  placeholder="Who is this in the photo?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#dae1ff] text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 bg-[#006767] hover:bg-[#004d4d] text-white font-black text-sm rounded-2xl transition-all shadow-xs"
              >
                Save to Family Memory Album
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
