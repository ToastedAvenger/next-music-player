// /components/Queue.tsx
'use client';
import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePlayer } from '../contexts/PlayerContext';
import '../styles/Queue.css';

function SortableItem({
  item,
  index,
  onPlay,
  onRemove,
}: {
  item: any;
  index: number;
  onPlay: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="queue-item" ref={setNodeRef} style={style}>
      <div className="drag-handle" {...attributes} {...listeners} aria-label="drag">≡</div>
      <img src={item.cover || '/placeholder.png'} className="q-cover" />
      <div className="q-meta" onDoubleClick={onPlay}>
        <div className="q-title">{item.title}</div>
        <div className="q-sub">{item.artist}</div>
      </div>
      <div className="q-actions">
        <button onClick={onPlay}>▶</button>
        <button className="remove-btn" onClick={onRemove}>✖</button>
      </div>
    </div>
  );
}

export default function Queue() {
  const { queue, reorderQueue, playIndexFromQueue, removeFromQueue } = usePlayer();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = queue.findIndex((t) => t.id === active.id);
    const newIndex = queue.findIndex((t) => t.id === over.id);
    const newQueue = arrayMove(queue, oldIndex, newIndex);
    reorderQueue(newQueue);
  };

  return (
    <div className="queue">
      <h4>Up Next</h4>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={queue.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          {queue.map((t, idx) => (
            <SortableItem
              key={t.id}
              item={t}
              index={idx}
              onPlay={() => playIndexFromQueue(idx)}
              onRemove={() => removeFromQueue(t.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

