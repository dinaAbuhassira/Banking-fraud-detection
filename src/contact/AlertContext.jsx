import { createContext, useContext, useState } from "react";
import { initialAlerts } from "../data/alertsData";

const AlertContext = createContext();

export function AlertProvider({ children }) {

  const [alerts, setAlerts] = useState(initialAlerts);

  return (
    <AlertContext.Provider value={{ alerts, setAlerts }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  return useContext(AlertContext);
}