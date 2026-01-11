import Home from './pages/Home';
import Predictor from './pages/Predictor';
import Register from './pages/Register';
import Settings from './pages/Settings';
import MinesPredictor from './pages/MinesPredictor';
import CrashPredictor from './pages/CrashPredictor';
import ChickenPredictor from './pages/ChickenPredictor';
import DicePredictor from './pages/DicePredictor';
import LimboPredictor from './pages/LimboPredictor';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Predictor": Predictor,
    "Register": Register,
    "Settings": Settings,
    "MinesPredictor": MinesPredictor,
    "CrashPredictor": CrashPredictor,
    "ChickenPredictor": ChickenPredictor,
    "DicePredictor": DicePredictor,
    "LimboPredictor": LimboPredictor,
}

export const pagesConfig = {
    mainPage: "Predictor",
    Pages: PAGES,
    Layout: __Layout,
};