import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type HistoryItem = {
  expression: string;
  result: string;
};

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const result = calculate(parseFloat(previousValue), current, operation);
      setDisplay(result.toString());
      setPreviousValue(result.toString());
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return current !== 0 ? prev / current : 0;
      case '%':
        return (prev * current) / 100;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const prev = parseFloat(previousValue);
      const result = calculate(prev, current, operation);
      
      const expression = `${previousValue} ${operation} ${display}`;
      setHistory([{ expression, result: result.toString() }, ...history.slice(0, 9)]);
      
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handlePercent = () => {
    if (previousValue !== null) {
      handleOperation('%');
      handleEquals();
    } else {
      const result = parseFloat(display) / 100;
      setDisplay(result.toString());
    }
  };

  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const handleMemorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const handleMemoryRecall = () => {
    setDisplay(memory.toString());
    setNewNumber(true);
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setDisplay(item.result);
    setNewNumber(true);
  };

  const buttons = [
    { label: 'MC', action: handleMemoryClear, className: 'bg-[#6B5D4F] hover:bg-[#5A4D3F] text-[#E8DCC4]' },
    { label: 'MR', action: handleMemoryRecall, className: 'bg-[#6B5D4F] hover:bg-[#5A4D3F] text-[#E8DCC4]' },
    { label: 'M-', action: handleMemorySubtract, className: 'bg-[#6B5D4F] hover:bg-[#5A4D3F] text-[#E8DCC4]' },
    { label: 'M+', action: handleMemoryAdd, className: 'bg-[#6B5D4F] hover:bg-[#5A4D3F] text-[#E8DCC4]' },
    
    { label: 'C', action: handleClear, className: 'bg-[#8B3A3A] hover:bg-[#7A2929] text-[#FFE8E8]' },
    { label: '%', action: handlePercent, className: 'bg-[#5A6B4F] hover:bg-[#4A5A3F] text-[#E8DCC4]' },
    { label: '÷', action: () => handleOperation('÷'), className: 'bg-[#5A6B4F] hover:bg-[#4A5A3F] text-[#E8DCC4]' },
    { label: '×', action: () => handleOperation('×'), className: 'bg-[#5A6B4F] hover:bg-[#4A5A3F] text-[#E8DCC4]' },

    { label: '7', action: () => handleNumber('7'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '8', action: () => handleNumber('8'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '9', action: () => handleNumber('9'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '-', action: () => handleOperation('-'), className: 'bg-[#5A6B4F] hover:bg-[#4A5A3F] text-[#E8DCC4]' },

    { label: '4', action: () => handleNumber('4'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '5', action: () => handleNumber('5'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '6', action: () => handleNumber('6'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '+', action: () => handleOperation('+'), className: 'bg-[#5A6B4F] hover:bg-[#4A5A3F] text-[#E8DCC4]' },

    { label: '1', action: () => handleNumber('1'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '2', action: () => handleNumber('2'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '3', action: () => handleNumber('3'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
    { label: '=', action: handleEquals, className: 'bg-[#D4A574] hover:bg-[#C49564] text-[#2C2C2E] row-span-2' },

    { label: '0', action: () => handleNumber('0'), className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E] col-span-2' },
    { label: '.', action: handleDecimal, className: 'bg-[#E8DCC4] hover:bg-[#D8CCB4] text-[#2C2C2E]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8B5AD] to-[#8E8A7E] flex items-center justify-center p-4">
      <div className="flex gap-6 max-w-6xl w-full">
        <Card className="bg-[#2C2C2E] p-6 shadow-2xl border-4 border-[#1A1A1C] rounded-lg flex-shrink-0 w-[380px]">
          <div className="mb-6 bg-[#3A3A28] p-4 rounded-sm border-2 border-[#2A2A1A] shadow-inner">
            <div className="bg-[#FFB84D] px-4 py-6 rounded-sm font-mono text-right text-4xl text-[#4A2C0A] tracking-wider shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] min-h-[72px] flex items-center justify-end">
              {display}
            </div>
            {memory !== 0 && (
              <div className="text-[#FFB84D] text-xs mt-2 font-mono">M: {memory}</div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {buttons.map((btn, idx) => (
              <Button
                key={idx}
                onClick={btn.action}
                className={`
                  ${btn.className} 
                  ${btn.label === '=' ? 'row-span-2' : ''} 
                  ${btn.label === '0' ? 'col-span-2' : ''}
                  h-14 text-lg font-bold rounded-sm
                  shadow-[0_4px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
                  active:shadow-[0_1px_0_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]
                  active:translate-y-1
                  transition-all
                `}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="bg-[#3A3A3A] p-6 shadow-xl border-2 border-[#2A2A2A] rounded-lg flex-1 max-w-md">
          <div className="flex items-center gap-2 mb-4 text-[#FFB84D]">
            <Icon name="History" size={20} />
            <h2 className="text-lg font-semibold font-mono">История</h2>
          </div>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-[#8E8A7E] text-sm font-mono text-center py-8">Пока нет вычислений</p>
            ) : (
              history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHistoryClick(item)}
                  className="w-full bg-[#2C2C2E] hover:bg-[#3C3C3E] p-3 rounded border border-[#4A4A4A] transition-colors text-left"
                >
                  <div className="text-[#B8B5AD] text-sm font-mono">{item.expression}</div>
                  <div className="text-[#FFB84D] text-lg font-mono font-bold">= {item.result}</div>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
