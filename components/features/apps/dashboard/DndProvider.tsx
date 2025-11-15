'use client';

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export default function DndProvider({ children }: { children: React.ReactNode }) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
  );

  return <DndContext sensors={sensors}>{children}</DndContext>;
}
