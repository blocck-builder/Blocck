import "./App.css";

import brick from "./assets/blocck3.png";

// color theme
// rgba(250, 221, 168, 0.14),
// rgba(242, 225, 194, 0.33)

const handleSwap = () => {
  window.open(
    "https://app.uniswap.org/#/swap?inputCurrency=0x0000000000000000000000000000000000000000&outputCurrency=0x0000000000000000000000000000000000000000",
    "_blank"
  );
};

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-black-500 mr-18">Blocck</h1>
        <h2>A brick to support BUIDL-ers.</h2>
        <img
          src={brick}
          className="w-2/3 my-10 hover:scale-105 transition-all duration-300"
        />
        <button
          className="bg-[#fadda875] hover:bg-[#fadda8] hover:scale-105 transition-all duration-300 text-black"
          onClick={handleSwap}
        >
          Swap on Uniswap
        </button>
        <div className="fixed bottom-4 text-[6px]">
          <p>
            This is a meme coin, but designed with a mission to support future
            ecosystem projects.
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
