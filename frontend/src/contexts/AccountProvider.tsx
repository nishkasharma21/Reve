import { createContext, useContext, useState } from "react";

const AccountContext = createContext<any>(null);

export const useStripeAccount = () => useContext(AccountContext);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [accountId, setAccountId] = useState<string | null>(null);

  return (
    <AccountContext.Provider value={{ accountId, setAccountId }}>
      {children}
    </AccountContext.Provider>
  );
};