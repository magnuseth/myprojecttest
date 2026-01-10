import Predictor from './pages/Predictor';
import Home from './pages/Home';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Predictor": Predictor,
    "Home": Home,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Predictor",
    Pages: PAGES,
    Layout: __Layout,
};