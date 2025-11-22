export interface TreeNode {
  _id: string;
  children?: TreeNode[];
}

export default function useTreeOrdering<T extends TreeNode>() {
  const moveUp = (tree: T[], target: T): T[] =>
    move(tree, target._id, "up");

  const moveDown = (tree: T[], target: T): T[] =>
    move(tree, target._id, "down");

  return { moveUp, moveDown };
}

// ---------------------
// Implementación genérica
// ---------------------

function move<T extends TreeNode>(
  tree: T[],
  id: string,
  direction: "up" | "down"
): T[] {
  const index = tree.findIndex((node) => node._id === id);

  if (index !== -1) {
    const newTree = [...tree];

    if (direction === "up" && index > 0) {
      [newTree[index - 1], newTree[index]] = [
        newTree[index],
        newTree[index - 1],
      ];
    }

    if (direction === "down" && index < newTree.length - 1) {
      [newTree[index], newTree[index + 1]] = [
        newTree[index + 1],
        newTree[index],
      ];
    }

    return newTree;
  }

  let changed = false;

  const newTree = tree.map((node) => {
    if (!changed) {
      const res = findAndMove(node, id, direction);
      if (res.changed) {
        changed = true;
        return res.node;
      }
    }
    return node;
  });

  return newTree;
}

type MoveResult<T> = {
  changed: boolean;
  node: T;
};

function findAndMove<T extends TreeNode>(
  node: T,
  id: string,
  dir: "up" | "down"
): MoveResult<T> {
  if (!node.children || node.children.length === 0) {
    return { changed: false, node };
  }

  const idx = node.children.findIndex((c) => c._id === id);

  if (idx !== -1) {
    const newChildren = [...node.children];

    if (dir === "up" && idx > 0) {
      [newChildren[idx - 1], newChildren[idx]] = [
        newChildren[idx],
        newChildren[idx - 1],
      ];
    }

    if (dir === "down" && idx < newChildren.length - 1) {
      [newChildren[idx], newChildren[idx + 1]] = [
        newChildren[idx + 1],
        newChildren[idx],
      ];
    }

    return {
      changed: true,
      node: {
        ...node,
        children: newChildren,
      },
    };
  }

  let changed = false;

  const newChildren = node.children.map((child) => {
    if (!changed) {
      const res = findAndMove(child, id, dir);
      if (res.changed) {
        changed = true;
        return res.node;
      }
    }
    return child;
  });

  if (changed) {
    return {
      changed: true,
      node: {
        ...node,
        children: newChildren,
      },
    };
  }

  return { changed: false, node };
}