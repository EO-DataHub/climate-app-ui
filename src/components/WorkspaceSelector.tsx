import { useContext, useEffect } from 'react'
import { AuthenticationContext } from '../context/AuthenticationContext'
import { toast } from 'react-toastify'

export const WorkspaceSelector = () => {
  const {
    availableWorkspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    isAuthenticated,
  } = useContext(AuthenticationContext)

  useEffect(() => {
    if (
      isAuthenticated &&
      availableWorkspaces.length > 0 &&
      !selectedWorkspace
    ) {
      // Auto-select the first workspace if none is selected
      setSelectedWorkspace(availableWorkspaces[0])
    }
  }, [
    isAuthenticated,
    availableWorkspaces,
    selectedWorkspace,
    setSelectedWorkspace,
  ])

  if (!isAuthenticated || availableWorkspaces.length === 0) {
    return null
  }

  return (
    <div className="workspace-selector">
      <label htmlFor="workspace-select">Select Workspace:</label>
      <select
        id="workspace-select"
        value={selectedWorkspace}
        onChange={(e) => {
          setSelectedWorkspace(e.target.value)
          toast.success(`Workspace changed to ${e.target.value}`)
        }}
      >
        {availableWorkspaces.map((workspace) => (
          <option key={workspace} value={workspace}>
            {workspace}
          </option>
        ))}
      </select>
    </div>
  )
}
