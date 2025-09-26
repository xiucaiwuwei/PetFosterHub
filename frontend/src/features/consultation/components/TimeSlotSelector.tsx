import React from 'react';
import { TimeSlot } from '../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onSelectTimeSlot: (slot: TimeSlot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  timeSlots, 
  selectedTimeSlot, 
  onSelectTimeSlot 
}) => {
  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">暂无可用的时间段，请选择其他日期</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => slot.available && onSelectTimeSlot(slot)}
          disabled={!slot.available}
          className={`py-2 border rounded-lg text-center text-sm transition-colors ${
            slot.available 
              ? selectedTimeSlot?.id === slot.id 
                ? "border-orange-500 bg-orange-50 text-orange-600 font-medium" 
                : "border-gray-200 hover:border-orange-300"
              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
};

export default TimeSlotSelector;