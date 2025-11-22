import { useEffect, useState } from "react";

export default function useIngredients() {
  const [parents, setParents] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [tree, setTree] = useState([]);

  const fetchAll = () => {
    fetch("/api/ingredients/list")
      .then(r => r.json())
      .then(data => {
        const main = data.filter((i: any) => i.parent === null);
        setParents(main);
        setIngredients(data);
      });

    fetch("/api/ingredients/tree")
      .then(r => r.json())
      .then(setTree);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    parents,
    ingredients,
    tree,
    refresh: fetchAll,
  };
}