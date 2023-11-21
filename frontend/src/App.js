import LoginPage from './component/page/LoginPage'
import Footer from './component/page/Footer';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Signup from './component/page/Signup_page';
import Product from './component/page/ProductList';

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <div className='contentWrapper'>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/productlist" element={<Product />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
