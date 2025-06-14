import { useState, useEffect } from "react";
import { Operator, OPERATORS_STORAGE_KEY } from "@/types/operator";
import { safeLocalStorage } from "@/utils/fileUtils";

export const useOperators = () => {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 1,
      name: "Mario",
      surname: "Rossi",
      email: "mario.rossi@example.com",
      phone: "+39 123 456 7890",
      status: "active",
      assignedEvents: [],
    },
    {
      id: 2,
      name: "Giulia",
      surname: "Bianchi",
      email: "giulia.bianchi@example.com",
      phone: "+39 987 654 3210",
      status: "inactive",
      assignedEvents: [],
    },
  ]);

  useEffect(() => {
    const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      const parsedOperators = JSON.parse(storedOperators);
      setOperators(parsedOperators);
    }
  }, []);

  useEffect(() => {
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
  }, [operators]);

  return { operators, setOperators };
};
