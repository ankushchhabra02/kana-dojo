import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  X,
  CircleCheck,
  Circle,
  CheckCheck,
  Trash2,
  Dices
} from 'lucide-react';
import { useClick } from '@/shared/hooks/useAudio';
import { ActionButton } from '@/shared/components/ui/ActionButton';

// Canary change: verifying Husky/Prettier pre-commit formatting.
// Canary change #2: verifying jsxSingleQuote formatting in JSX attributes.

type QuickSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sets: Array<{
    name: string;
    start: number;
    end: number;
    id: string;
    isMastered: boolean;
  }>;
  selectedSets: string[];
  onToggleSet: (setName: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSelectRandom: (count: number) => void;
  unitName: string;
};

const QuickSelectModal = ({
  isOpen,
  onClose,
  sets,
  selectedSets,
  onToggleSet,
  onSelectAll,
  onClearAll,
  onSelectRandom,
  unitName
}: QuickSelectModalProps) => {
  const { playClick } = useClick();

  const [searchLevel, setSearchLevel] = useState('');

  const filteredSets = useMemo(() => {
    if (!searchLevel) return sets;

    return sets.filter(set => {
      const levelNumber = set.name.match(/\d+/)?.[0] || '';
      return levelNumber.includes(searchLevel);
    });
  }, [sets, searchLevel]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50'
      onClick={e => {
        if (e.target === e.currentTarget) {
          playClick();
          onClose();
        }
      }}
    >
      <div className='bg-[var(--background-color)] rounded-2xl border-2 border-[var(--border-color)] max-w-4xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col'>
        <div className='flex items-center justify-between p-4 sm:p-6 border-b-2 border-[var(--border-color)] flex-shrink-0'>
          <div>
            <h2 className='text-xl sm:text-2xl font-bold text-[var(--main-color)]'>
              Quick Select - {unitName.toUpperCase()}
            </h2>
            <p className='text-xs sm:text-sm text-[var(--secondary-color)] mt-1'>
              {selectedSets.length} of {sets.length} levels selected
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className='p-2 rounded-xl hover:bg-[var(--card-color)] transition-colors flex-shrink-0 hover:cursor-pointer'
          >
            <X size={24} className='text-[var(--secondary-color)] ' />
          </button>
        </div>

        <div className='flex flex-wrap gap-2 sm:gap-3 p-3 sm:p-4 border-b-2 border-[var(--border-color)] flex-shrink-0'>
          {[
            {
              label: 'Select All',
              onClick: onSelectAll,
              disabled: false,
              icon: CheckCheck,
              iconOnly: false,
              colorScheme: 'main' as const,
              borderColorScheme: 'main' as const,
              show: true
            },
            {
              label: 'Clear All',
              onClick: onClearAll,
              disabled: false,
              icon: Trash2,
              iconOnly: true,
              colorScheme: 'main' as const,
              borderColorScheme: 'main' as const,
              show: true
            },
            {
              label: 'Random 3',
              onClick: () => onSelectRandom(3),
              disabled: false,
              icon: Dices,
              iconOnly: false,
              show: true
            },
            {
              label: 'Random 5',
              onClick: () => onSelectRandom(5),
              disabled: false,
              icon: Dices,
              iconOnly: false,
              show: true
            },
            {
              label: 'Random 10',
              onClick: () => onSelectRandom(10),
              disabled: false,
              icon: Dices,
              iconOnly: false,
              show: true
            }
          ]
            .filter(btn => btn.show)
            .map(btn => (
              <ActionButton
                key={btn.label}
                onClick={() => {
                  playClick();
                  btn.onClick();
                }}
                disabled={btn.disabled}
                colorScheme={btn.colorScheme ?? 'secondary'}
                borderColorScheme={btn.borderColorScheme ?? 'secondary'}
                borderRadius='2xl'
                borderBottomThickness={6}
                className={clsx(
                  'w-auto text-sm disabled:cursor-not-allowed disabled:opacity-50',
                  btn.iconOnly ? 'px-4 sm:px-6 py-2' : 'px-3 sm:px-4 py-2'
                )}
              >
                <span
                  className={clsx(
                    'flex items-center',
                    btn.iconOnly ? 'gap-0' : 'gap-2'
                  )}
                >
                  {btn.icon ? (
                    <btn.icon size={16} className='text-current' />
                  ) : null}
                  {btn.iconOnly ? (
                    <span className='sr-only'>{btn.label}</span>
                  ) : (
                    btn.label
                  )}
                </span>
              </ActionButton>
            ))}
          <input
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            onChange={e => {
              playClick();
              const value = e.target.value.replace(/\D/g, '');
              setSearchLevel(value);
            }}
            placeholder='search for a level...'
            className={clsx(
              'px-3 sm:px-4 py-2 text-sm rounded-xl border-2 transition-all',
              'border-[var(--border-color)] hover:bg-[var(--card-color)]',
              'text-[var(--secondary-color)]',
              'focus:outline-0 focus:ring focus:ring-offset-2-[var(--secondary-color)]/80'
            )}
          />
        </div>

        {/* Grid of Sets */}
        <div className='overflow-y-auto p-4 sm:p-6 flex-1 min-h-0'>
          {filteredSets.length === 0 ? (
            <div className='flex items-center justify-center h-full'>
              <p className='text-[var(--secondary-color)] text-sm'>
                No level found. Available levels:{' '}
                {sets[0]?.name.match(/\d+/)?.[0]} -{' '}
                {sets[sets.length - 1]?.name.match(/\d+/)?.[0]}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3'>
              {filteredSets.map(set => {
                const isSelected = selectedSets.includes(set.name);
                return (
                  <ActionButton
                    key={set.id}
                    onClick={() => {
                      playClick();
                      onToggleSet(set.name);
                    }}
                    colorScheme={isSelected ? 'main' : undefined}
                    borderColorScheme={isSelected ? 'main' : undefined}
                    borderRadius='xl'
                    borderBottomThickness={isSelected ? 6 : 0}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-3 sm:p-4',
                      isSelected
                        ? 'order-first'
                        : 'bg-[var(--card-color)] text-[var(--secondary-color)] border-2 border-[var(--border-color)]'
                    )}
                  >
                    {isSelected ? (
                      <CircleCheck
                        size={18}
                        className='text-[var(--background-color)] flex-shrink-0'
                      />
                    ) : (
                      <Circle
                        size={18}
                        className='text-[var(--main-color)] flex-shrink-0'
                      />
                    )}
                    <span className='text-xs sm:text-sm font-medium text-center'>
                      {set.name.replace('Set ', 'Level ')}
                    </span>
                    {set.isMastered && (
                      <span className='text-[10px] sm:text-xs opacity-70'>
                        Mastered
                      </span>
                    )}
                  </ActionButton>
                );
              })}
            </div>
          )}
        </div>

        <div className='p-3 sm:p-4 border-t-2 border-[var(--border-color)] flex justify-end flex-shrink-0'>
          <ActionButton
            onClick={() => {
              playClick();
              onClose();
            }}
            colorScheme='main'
            borderColorScheme='main'
            borderRadius='xl'
            borderBottomThickness={4}
            className='w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium'
          >
            Done
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default QuickSelectModal;
