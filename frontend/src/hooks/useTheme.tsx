import { useState } from "react";

export function useTheme() {
  const [theme, setIsDark] = useState(false);

  /*   useEffect(() => {
    if (theme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]); */

  return { theme, toggleMode: () => setIsDark(false) };
}
