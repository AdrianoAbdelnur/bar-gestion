import { useEffect, useState } from "react";

export default function useCategories() {
  const [parents, setParents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tree, setTree] = useState([]);

  const fetchAll = () => {
    fetch("/api/categories/list")
      .then(r => r.json())
      .then(data => {
        const main = data.filter((c: any) => c.parent === null);
        setParents(main);
        setCategories(data);
      });

    fetch("/api/categories/tree")
      .then(r => r.json())
      .then(setTree);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    parents,
    categories,
    tree,
    refresh: fetchAll,
  };
}