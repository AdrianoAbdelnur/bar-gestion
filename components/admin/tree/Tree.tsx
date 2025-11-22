"use client";

import React from "react";
import TreeItem from "./TreeItem";
import { TreeNodeBase } from "@/types/TreeNode";

interface TreeProps<T extends TreeNodeBase> {
  nodes: T[];
  onEdit: (node: T) => void;
  onDelete: (id: string) => void;
  onMoveUp: (node: T) => void;
  onMoveDown: (node: T) => void;
  level?: number;
}

export default function Tree<T extends TreeNodeBase>({
  nodes,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  level = 0,
}: TreeProps<T>) {

  if (!nodes) return null;

  return (
    <ul className={`${level === 0 ? "mt-4" : "ml-4 sm:ml-6 mt-2"} space-y-2`}>
      {nodes.map((node) => (
        <TreeItem<T>
          key={node._id}
          node={node}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          level={level}
        />
      ))}
    </ul>
  );
}