'use client';

import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  className?: string;
}

export default function DateRangePicker({
  onDateRangeChange,
  defaultStartDate,
  defaultEndDate,
  className = ''
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isValid, setIsValid] = useState(true);

  // Verwende übergebene Standardwerte oder setze eigene
  useEffect(() => {
    if (defaultStartDate && defaultEndDate) {
      setStartDate(format(defaultStartDate, 'yyyy-MM-dd'));
      setEndDate(format(defaultEndDate, 'yyyy-MM-dd'));
    } else {
      // Fallback: eigene Standardwerte setzen
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Anfang dieses Monats (1. Tag)
      const fallbackStartDate = new Date(currentYear, currentMonth, 1);

      // Ende nächsten Monats (letzter Tag)
      const fallbackEndDate = new Date(currentYear, currentMonth + 2, 0);

      setStartDate(format(fallbackStartDate, 'yyyy-MM-dd'));
      setEndDate(format(fallbackEndDate, 'yyyy-MM-dd'));
    }
  }, [defaultStartDate, defaultEndDate]);

  // Validiere Datumswerte
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      setIsValid(start < end);
    } else {
      setIsValid(true);
    }
  }, [startDate, endDate]);

  // Entferne den problematischen useEffect, der onDateRangeChange bei jeder Änderung aufruft

  const handleApply = () => {
    if (startDate && endDate && isValid) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      onDateRangeChange(start, end);
    }
  };

  const handleReset = () => {
    if (defaultStartDate && defaultEndDate) {
      setStartDate(format(defaultStartDate, 'yyyy-MM-dd'));
      setEndDate(format(defaultEndDate, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className={`flex flex-col gap-3 rounded-lg bg-base-200 p-4 ${className}`}>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-base-content/70">Terminbereich:</h3>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label
            htmlFor="startDate"
            className="mb-1 block text-xs font-medium text-base-content/70"
          >
            Von
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-sm input-bordered w-full"
            max={endDate || undefined}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="endDate" className="mb-1 block text-xs font-medium text-base-content/70">
            Bis
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-sm input-bordered w-full"
            min={startDate || undefined}
          />
        </div>
      </div>

      {!isValid && (
        <div className="text-xs text-error">Das Enddatum muss nach dem Startdatum liegen.</div>
      )}

      {startDate && endDate && (
        <div className="text-center text-xs text-base-content/70">
          {format(new Date(startDate), 'dd.MM.yyyy', { locale: de })} -{' '}
          {format(new Date(endDate), 'dd.MM.yyyy', { locale: de })}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={handleReset}
          className="btn btn-ghost btn-xs"
          disabled={!defaultStartDate || !defaultEndDate}
        >
          Zurücksetzen
        </button>
        <button
          onClick={handleApply}
          className="btn btn-primary btn-xs"
          disabled={!startDate || !endDate || !isValid}
        >
          Anwenden
        </button>
      </div>
    </div>
  );
}
