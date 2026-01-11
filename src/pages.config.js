import Blowjow from './pages/Blowjow';
import ChickenPredictor from './pages/ChickenPredictor';
import CrashPredictor from './pages/CrashPredictor';
import DicePredictor from './pages/DicePredictor';
import FAQ from './pages/FAQ';
import FlipPredictor from './pages/FlipPredictor';
import Home from './pages/Home';
import KenoPredictor from './pages/KenoPredictor';
import LimboPredictor from './pages/LimboPredictor';
import MinesPredictor from './pages/MinesPredictor';
import Mirrors from './pages/Mirrors';
import Predictor from './pages/Predictor';
import Register from './pages/Register';
import Settings from './pages/Settings';
import WheelPredictor from './pages/WheelPredictor';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Blowjow": Blowjow,
    "ChickenPredictor": ChickenPredictor,
    "CrashPredictor": CrashPredictor,
    "DicePredictor": DicePredictor,
    "FAQ": FAQ,
    "FlipPredictor": FlipPredictor,
    "Home": Home,
    "KenoPredictor": KenoPredictor,
    "LimboPredictor": LimboPredictor,
    "MinesPredictor": MinesPredictor,
    "Mirrors": Mirrors,
    "Predictor": Predictor,
    "Register": Register,
    "Settings": Settings,
    "WheelPredictor": WheelPredictor,
}

export const pagesConfig = {
    mainPage: "Predictor",
    Pages: PAGES,
    Layout: __Layout,
};