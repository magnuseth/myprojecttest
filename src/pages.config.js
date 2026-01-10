import Predictor from './pages/Predictor';
import Home from './pages/Home';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Predictor": Predictor,
    "Home": Home,
}

export const pagesConfig = {
    mainPage: "Predictor",
    Pages: PAGES,
    Layout: __Layout,
};