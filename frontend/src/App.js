import LoginPage from './component/page/LoginPage';
import Footer from './component/page/Footer';
import ProductListPage from './component/page/ProductListPage';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <div className='contentWrapper'>
          <Routes>
            <Route index element={<ProductListPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
