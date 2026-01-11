import Home from './pages/Home';
import Predictor from './pages/Predictor';
import Settings from './pages/Settings';
import Register from './pages/Register';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Predictor": Predictor,
    "Settings": Settings,
    "Register": Register,
}

export const pagesConfig = {
    mainPage: "Predictor",
    Pages: PAGES,
    Layout: __Layout,
};