import { BasicDemo } from './demos/BasicDemo';
import { KeyExtractorDemo } from './demos/KeyExtractorDemo';
import { EmptyStateDemo } from './demos/EmptyStateDemo';
import { SlotPropsDemo } from './demos/SlotPropsDemo';
import { ReactNodeDemo } from './demos/ReactNodeDemo';
import { InteractiveDemo } from './demos/InteractiveDemo';
import { HookSlotDemo } from './demos/HookSlotDemo';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">react-list</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">React List Demos</h1>
          <p className="text-gray-600">
            A highly abstract, type-safe list component with a slot-based architecture
          </p>
        </div>

        <div className="grid gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <BasicDemo />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <KeyExtractorDemo />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <EmptyStateDemo />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <SlotPropsDemo />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ReactNodeDemo />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <InteractiveDemo />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <HookSlotDemo />
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Built with <span className="text-error">❤</span> using React + TypeScript + Vite
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
