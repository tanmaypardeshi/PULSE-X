import React from 'react'

const SourceContext = React.createContext('amazon')

function SourceProvider({ children }) {
  const [src, setSrc] = React.useState('amazon')

  return (
    <SourceContext.Provider value={{ src, setSrc }}>
      {children}
    </SourceContext.Provider>
  )
}

export { SourceProvider, SourceContext }
