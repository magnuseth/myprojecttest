import ChickenPredictor from './pages/ChickenPredictor';
import CrashPredictor from './pages/CrashPredictor';
import DicePredictor from './pages/DicePredictor';
import Home from './pages/Home';
import LimboPredictor from './pages/LimboPredictor';
import MinesPredictor from './pages/MinesPredictor';
import Predictor from './pages/Predictor';
import Register from './pages/Register';
import Settings from './pages/Settings';
import WheelPredictor from './pages/WheelPredictor';
import FlipPredictor from './pages/FlipPredictor';
import KenoPredictor from './pages/KenoPredictor';
import FAQ from './pages/FAQ';
import Mirrors from './pages/Mirrors';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ChickenPredictor": ChickenPredictor,
    "CrashPredictor": CrashPredictor,
    "DicePredictor": DicePredictor,
    "Home": Home,
    "LimboPredictor": LimboPredictor,
    "MinesPredictor": MinesPredictor,
    "Predictor": Predictor,
    "Register": Register,
    "Settings": Settings,
    "WheelPredictor": WheelPredictor,
    "FlipPredictor": FlipPredictor,
    "KenoPredictor": KenoPredictor,
    "FAQ": FAQ,
    "Mirrors": Mirrors,
}

export const pagesConfig = {
    mainPage: "Predictor",
    Pages: PAGES,
    Layout: __Layout,
};