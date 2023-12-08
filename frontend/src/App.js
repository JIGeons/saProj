import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './component/page/Login';
import Signup from './component/page/Signup';
import Footer from './component/page/Footer';
import Product from './component/page/ProductList';
import ProductDetail from './component/page/ProductDetail';
import AdminPage from './component/page/AdminPage'
import Header from "./component/page/Header";
function App() {

  return (
    <BrowserRouter>
      <div className="wrapper">
        <div className='contentWrapper'>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup/" element={<Signup />} />
            <Route element={<Header />}>
              <Route path="posts/productlist/" element={<Product />} />
              <Route path="posts/productlist/productdetail/:id" element={<ProductDetail />} />
              <Route path="/adminPage/user/:id" element={<AdminPage />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
