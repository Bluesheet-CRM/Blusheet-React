import React, { useState } from "react";

export const OpportunityContext = React.createContext();

export const OpportunityProvider = ({ children }) => {
  const [opportunitySkeleton, setOpportunitySkeleton] = useState({});
  const [salesforceUser, setSalesforceUser] = useState(true);
  const [opportunityData, setOpportunityData] = useState([]);

  return (
    <OpportunityContext.Provider
      value={{
        opportunitySkeleton,
        setOpportunitySkeleton,
        salesforceUser,
        setSalesforceUser,
        opportunityData,
        setOpportunityData
      }}
    >
      {children}
    </OpportunityContext.Provider>
  );
};
