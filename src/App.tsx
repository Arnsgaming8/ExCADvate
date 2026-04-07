import { useEffect } from 'react';
import { useCADStore } from './store/cadStore';
import Viewport3D from './components/Viewport3D';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import PropertyPanel from './components/PropertyPanel';
import FeatureTree from './components/FeatureTree';
import StatusBar from './components/StatusBar';
import MenuBar from './components/MenuBar';

function App() {
  const { project, createProject } = useCADStore();

  useEffect(() => {
    if (!project) {
      createProject('Untitled');
    }
  }, [project, createProject]);

  return (
    <div className="flex flex-col h-screen w-screen bg-cad-bg overflow-hidden">
      <MenuBar />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <Viewport3D />
              <StatusBar />
            </div>
            <div className="w-72 flex flex-col border-l border-cad-border bg-cad-panel overflow-y-auto">
              <FeatureTree />
              <PropertyPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
