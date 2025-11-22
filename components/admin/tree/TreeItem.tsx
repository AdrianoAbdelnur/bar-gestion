"use client";

import { memo } from "react";
import { TreeNodeBase } from "@/types/TreeNode";
import { ArrowUp, ArrowDown, Trash2, Pencil } from "lucide-react";
import Tree from "./Tree";

interface Props<T extends TreeNodeBase> {
  node: T;
  onEdit: (node: T) => void;
  onDelete: (id: string) => void;
  onMoveUp: (node: T) => void;
  onMoveDown: (node: T) => void;
  level: number;
}

function TreeItem<T extends TreeNodeBase>({
  node,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  level,
}: Props<T>) {
  const hasIngredientData =
    node.price !== undefined &&
    node.price !== null &&
    node.unit !== undefined &&
    node.unit !== null;

  return (
    <li>
      <div className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded 
                      px-2 py-1.5 sm:px-3 sm:py-2">

        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
          <span className="text-sm sm:text-base font-normal sm:font-medium">
            {node.name}
          </span>

          {hasIngredientData && (
            <span className="text-[10px] sm:text-xs text-neutral-300 bg-neutral-900 px-1.5 py-0.5 rounded opacity-80">
              precio: ${node.price} / unidad: {node.unit}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {node.parent !== null && (
            <>
              <button className="btn-edit" onClick={() => onEdit(node)}>
                <Pencil className="w-4 h-4" />
              </button>

              <button className="btn-delete" onClick={() => onDelete(node._id)}>
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="arrow-group">
            <button className="arrow-btn" onClick={() => onMoveUp(node)}>
              <ArrowUp className="w-3 h-3 text-blue-400" />
            </button>

            <button className="arrow-btn" onClick={() => onMoveDown(node)}>
              <ArrowDown className="w-3 h-3 text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      {!!node.children?.length && (
        <Tree<T>
          nodes={node.children}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          level={level + 1}
        />
      )}
    </li>
  );
}

export default memo(TreeItem) as typeof TreeItem;