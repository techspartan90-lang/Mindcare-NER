import React, { useState } from 'react';
import { BookOpen, Volume2, Sparkles, CheckCircle, RefreshCw, Heart } from 'lucide-react';
import { SupportedLanguage, PersonalStoryCard } from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface PersonalStoryModeProps {
  currentLang: SupportedLanguage;
  patientName: string;
  onComplete?: (score: number) => void;
}

const STORIES: PersonalStoryCard[] = [
  {
    id: 'story_1',
    title: 'The Morning Tea Veranda & Brahmaputra Breeze',
    culturalRegion: 'Assam / Guwahati',
    snippet:
      'Every morning at 7:00 AM, the sweet aroma of boiled Assam CTC tea leaves and crushed cardamom fills your veranda. Looking across the lush Nahar trees, a gentle cooling breeze blows from the mighty Brahmaputra river as birds sing.',
    imageUrl:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    audioNarrationText:
      'Every morning at seven, the sweet aroma of Assam tea and cardamom fills your veranda. A gentle breeze blows from the Brahmaputra as birds sing.',
    reflectionQuestion: 'What comforting warm drink begins your peaceful morning on the veranda?',
    options: ['Fresh Assam CTC Cardamom Tea', 'Cold Fruit Juice', 'Black Coffee', 'Coconut Water'],
    correctAnswer: 'Fresh Assam CTC Cardamom Tea',
    positiveReinforcement: 'Yes! The comforting tea brewed with cardamom warms the morning so gently.',
  },
  {
    id: 'story_2',
    title: 'Autumn Walk through Kaziranga Orchid Meadows',
    culturalRegion: 'Kaziranga, Assam',
    snippet:
      'During the pleasant autumn months, walking along the meadow trails surrounded by tall elephant grass and fragrant Kopou orchids. In the distance, majestic one-horned rhinos graze quietly by the wetlands.',
    imageUrl:
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&auto=format&fit=crop&q=80',
    audioNarrationText:
      'Walking along the meadow trails surrounded by tall grass and purple Kopou orchids, one-horned rhinos graze quietly in the wetlands.',
    reflectionQuestion: 'Which famous animal grazes peacefully by the Kaziranga wetlands?',
    options: ['Great One-Horned Rhinoceros', 'Polar Bear', 'Desert Camel', 'Snow Leopard'],
    correctAnswer: 'Great One-Horned Rhinoceros',
    positiveReinforcement: 'Wonderful memory! The gentle rhinos of Kaziranga are North East India’s pride.',
  },
];

export const PersonalStoryMode: React.FC<PersonalStoryModeProps> = ({
  currentLang,
  patientName,
  onComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const story = STORIES[currentIdx % STORIES.length];

  const handleReadStory = () => {
    sound.playClick();
    voice.speak(story.audioNarrationText, currentLang);
  };

  const handleSelectOption = (opt: string) => {
    sound.playClick();
    setSelectedOpt(opt);
    if (opt === story.correctAnswer) {
      setIsAnswerCorrect(true);
      sound.playSuccess();
      voice.speak(story.positiveReinforcement, currentLang);
      setTimeout(() => {
        if (currentIdx < STORIES.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setSelectedOpt(null);
          setIsAnswerCorrect(null);
        } else {
          if (onComplete) onComplete(100);
          sound.playLevelUp();
        }
      }, 2000);
    } else {
      setIsAnswerCorrect(false);
      sound.playError();
      voice.speak('Take your time, let us listen to the story once more.', currentLang);
    }
  };

  return (
    <div
      id="personal-story-mode"
      className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dae1ff] shadow-md space-y-6 text-left"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#dae1ff] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#5c3a21] text-white flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-[#5c3a21] uppercase tracking-wider">
              Reminiscence & Story Mode
            </span>
            <h3 className="text-xl font-black text-[#001849]">{story.title}</h3>
          </div>
        </div>

        <button
          id="listen-story-btn"
          onClick={handleReadStory}
          className="min-h-[44px] px-4 py-2 bg-[#5c3a21] hover:bg-[#432a18] text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen to Story</span>
        </button>
      </div>

      {/* Story Illustration & Snippet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center bg-[#faf8f5] p-5 rounded-3xl border border-[#e8ded5]">
        <div className="h-52 w-full rounded-2xl overflow-hidden shadow-sm">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-2 text-sm sm:text-base font-medium text-[#2d2218] leading-relaxed">
          <p>{story.snippet}</p>
          <span className="text-xs font-bold text-[#8a684b] block">
            📍 Region: {story.culturalRegion}
          </span>
        </div>
      </div>

      {/* Memory Checkpoint Question */}
      <div className="space-y-3 pt-2">
        <h4 className="text-lg font-black text-[#001849]">
          Question: {story.reflectionQuestion}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {story.options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            let btnClass = 'bg-white border-2 border-[#dae1ff] text-[#001849] hover:border-[#5c3a21]';
            if (isSelected) {
              if (isAnswerCorrect) {
                btnClass = 'bg-emerald-100 border-2 border-emerald-600 text-emerald-950 font-black';
              } else if (isAnswerCorrect === false) {
                btnClass = 'bg-rose-100 border-2 border-rose-600 text-rose-950';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                className={`min-h-[52px] p-4 rounded-2xl font-extrabold text-sm sm:text-base text-left flex items-center justify-between transition-all shadow-2xs cursor-pointer ${btnClass}`}
              >
                <span>{opt}</span>
                {isSelected && isAnswerCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
