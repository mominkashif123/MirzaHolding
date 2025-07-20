
import Navbar from "./Navbar";
import Header from "./Header";
import PSXLivePrices from "./PSX";
import ChairmanMessage from "./Chairman";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            {/* Wrapper with top padding equal to navbar height */}
            <div className="pt-[10vh]">
                <PSXLivePrices />
                <Header />
                <ChairmanMessage />
            </div>
        </div>
    );
};

export default Home;