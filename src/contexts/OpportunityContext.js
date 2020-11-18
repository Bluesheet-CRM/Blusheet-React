import React,{useState} from 'react'

export const OpportunityContext = React.createContext();

export const OpportunityProvider = ({children}) => {

    const [opportunitySkeleton, setOpportunitySkeleton] = useState({});


    return <OpportunityContext.Provider value={{opportunitySkeleton, setOpportunitySkeleton}}>{children}</OpportunityContext.Provider>;


}