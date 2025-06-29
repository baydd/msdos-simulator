import React, { useState } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface DOSCalculatorProps {
  onExit: () => void;
}

export const DOSCalculator: React.FC<DOSCalculatorProps> = ({ onExit }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string) => {
    dosSoundManager.playBeep(800, 50);
    
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // Add to history
      setHistory(prev => [...prev, `${currentValue} ${operation} ${inputValue} = ${newValue}`]);
    }
    
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);
    
    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      
      // Add to history
      setHistory(prev => [...prev, `${previousValue} ${operation} ${inputValue} = ${newValue}`]);
    }
  };

  const clear = () => {
    dosSoundManager.playBeep(400, 100);
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    }
  };

  const sqrt = () => {
    const value = parseFloat(display);
    const result = Math.sqrt(value);
    setDisplay(String(result));
    setHistory(prev => [...prev, `√${value} = ${result}`]);
  };

  const percentage = () => {
    const value = parseFloat(display);
    const result = value / 100;
    setDisplay(String(result));
  };

  const memoryStore = () => {
    setMemory(parseFloat(display));
    dosSoundManager.playBeep(600, 100);
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
    dosSoundManager.playBeep(400, 100);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    dosSoundManager.playBeep(600, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const { key } = e;
    
    if (key >= '0' && key <= '9') {
      inputNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      inputOperation(key);
    } else if (key === 'Enter' || key === '=') {
      performCalculation();
    } else if (key === '.') {
      inputDecimal();
    } else if (key === 'Escape') {
      onExit();
    } else if (key === 'c' || key === 'C') {
      clear();
    }
  };

  return (
    <div className="h-full bg-gray-300 dos-font p-4 overflow-hidden" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="max-w-md mx-auto bg-gray-200 border-2 border-gray-400 rounded-lg shadow-lg">
        {/* Title */}
        <div className="bg-blue-600 text-white text-center py-2 rounded-t-lg">
          <div className="font-bold">DOS Calculator v3.1</div>
        </div>

        {/* Display */}
        <div className="p-4 bg-black">
          <div className="bg-green-900 border-2 border-green-700 p-3 text-right">
            <div className="text-green-400 font-mono text-2xl min-h-8">
              {display}
            </div>
            <div className="text-green-600 text-xs mt-1">
              {operation && `${previousValue} ${operation}`}
              {memory !== 0 && ` | M: ${memory}`}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 grid grid-cols-5 gap-2">
          {/* Memory buttons */}
          <button onClick={memoryClear} className="bg-red-500 hover:bg-red-600 text-white p-2 text-sm border border-red-600">MC</button>
          <button onClick={memoryRecall} className="bg-blue-500 hover:bg-blue-600 text-white p-2 text-sm border border-blue-600">MR</button>
          <button onClick={memoryStore} className="bg-blue-500 hover:bg-blue-600 text-white p-2 text-sm border border-blue-600">MS</button>
          <button onClick={memoryAdd} className="bg-blue-500 hover:bg-blue-600 text-white p-2 text-sm border border-blue-600">M+</button>
          <button onClick={sqrt} className="bg-purple-500 hover:bg-purple-600 text-white p-2 text-sm border border-purple-600">√</button>

          {/* Function buttons */}
          <button onClick={clear} className="bg-red-500 hover:bg-red-600 text-white p-2 border border-red-600">C</button>
          <button onClick={clearEntry} className="bg-orange-500 hover:bg-orange-600 text-white p-2 border border-orange-600">CE</button>
          <button onClick={toggleSign} className="bg-gray-500 hover:bg-gray-600 text-white p-2 border border-gray-600">±</button>
          <button onClick={percentage} className="bg-gray-500 hover:bg-gray-600 text-white p-2 border border-gray-600">%</button>
          <button onClick={() => inputOperation('/')} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 border border-yellow-600">÷</button>

          {/* Number buttons */}
          {[7, 8, 9].map(num => (
            <button key={num} onClick={() => inputNumber(String(num))} className="bg-gray-600 hover:bg-gray-700 text-white p-2 border border-gray-700">{num}</button>
          ))}
          <button onClick={() => inputOperation('*')} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 border border-yellow-600">×</button>
          <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white p-2 text-sm border border-red-700">Exit</button>

          {[4, 5, 6].map(num => (
            <button key={num} onClick={() => inputNumber(String(num))} className="bg-gray-600 hover:bg-gray-700 text-white p-2 border border-gray-700">{num}</button>
          ))}
          <button onClick={() => inputOperation('-')} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 border border-yellow-600">−</button>
          <div></div>

          {[1, 2, 3].map(num => (
            <button key={num} onClick={() => inputNumber(String(num))} className="bg-gray-600 hover:bg-gray-700 text-white p-2 border border-gray-700">{num}</button>
          ))}
          <button onClick={() => inputOperation('+')} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 border border-yellow-600">+</button>
          <div></div>

          <button onClick={() => inputNumber('0')} className="bg-gray-600 hover:bg-gray-700 text-white p-2 border border-gray-700 col-span-2">0</button>
          <button onClick={inputDecimal} className="bg-gray-600 hover:bg-gray-700 text-white p-2 border border-gray-700">.</button>
          <button onClick={performCalculation} className="bg-green-500 hover:bg-green-600 text-white p-2 border border-green-600">=</button>
          <div></div>
        </div>

        {/* History */}
        <div className="p-4 border-t border-gray-400">
          <div className="text-sm font-bold mb-2 text-black">History:</div>
          <div className="bg-white border border-gray-400 p-2 h-20 overflow-y-auto text-xs">
            {history.slice(-5).map((entry, index) => (
              <div key={index} className="text-black">{entry}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-600 mt-4">
        Use keyboard or click buttons | ESC: Exit | C: Clear
      </div>
    </div>
  );
};