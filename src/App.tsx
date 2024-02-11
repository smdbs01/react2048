import Board from "./components/Game";

function App() {
  return (
    <div className="size-screen flex flex-col items-center gap-2 p-2">
      <h1 className="text-3xl font-bold">2048 Demo</h1>
      <Board />
    </div>
  );
}

export default App;
