import App from "../App";
import GuestLayout from "../layouts/GuestLayout";
import Asset from "../pages/assets/Asset";
import Reconciliation from "../pages/audit/Reconciliation";
import ViewReconciliation from "../pages/audit/ViewReconciliation";
import BusinessProfile from "../pages/business/BusinessProfile";
import Dashboard from "../pages/Dashboard";
import AddEmployee from "../pages/employees/AddEmployee";
import EditEmployee from "../pages/employees/EditEmployee";
import Employees from "../pages/employees/Employees";
import ForgotPassword from "../pages/ForgotPassword";
import Homepage from "../pages/homepage/Homepage";
import AddIntermediateGoods from "../pages/intermediateGoods/AddIntermediateGoods";
import EditIntermediateGood from "../pages/intermediateGoods/EditIntermediateGood";
import IntermediateGoods from "../pages/intermediateGoods/IntermediateGoods";
import ViewIntermediateGood from "../pages/intermediateGoods/ViewIntermediateGood";
import Login from "../pages/Login";
import AddMaterial from "../pages/materials/AddMaterial";
import EditMaterial from "../pages/materials/EditMaterial";
import Material from "../pages/materials/Material";
import ViewMaterial from "../pages/materials/ViewMaterial";
import BusinessSetup from "../pages/onboarding/BusinessSetup";
import PageNotFound from "../pages/PageNotFound";
import PasswordConfirmed from "../pages/PasswordConfirmed";
import EditProduction from "../pages/production/EditProduction";
import Production from "../pages/production/Production";
import ViewProduction from "../pages/production/ViewProduction";
import AddProduct from "../pages/products/AddProduct";
import EditProduct from "../pages/products/EditProduct";
import Product from "../pages/products/Product";
import ViewProduct from "../pages/products/ViewProduct";
import AddPurchase from "../pages/purchases/AddPurchase";
import EditPurchase from "../pages/purchases/EditPurchase";
import Purchase from "../pages/purchases/Purchase";
import Suppliers from "../pages/purchases/Suppliers";
import Register from "../pages/Register";
import Report from "../pages/reports/Report";
import ResetPassword from "../pages/ResetPassword";
import AddCustomer from "../pages/sales/AddCustomer";
import AddSale from "../pages/sales/AddSale";
import Customer from "../pages/sales/Customer";
import EditCustomer from "../pages/sales/EditCustomer";
import EditSale from "../pages/sales/EditSale";
import Sale from "../pages/sales/Sale";
import ViewCustomer from "../pages/sales/ViewCustomer";
import ViewSale from "../pages/sales/ViewSale";
import SplashScreen from "../pages/SplashScreen";
import Profile from "../pages/user/Profile";
import VerifyEmail from "../pages/VerifyEmail";
import { employeeLoader } from "../requests/_employeeRequests";
import { intermediateGoodViewLoader } from "../requests/_intermediateGoodsRequests";
import { materialLoader, viewMaterialLoader } from "../requests/_materialsRequests";
import { productionLoader, productionsLoader, productionViewLoader } from "../requests/_productionRequests";
import { productsLoader, productViewLoader } from "../requests/_productRequests";
import { purchaseLoader } from "../requests/_purchaseRequests";
import { customerLoader, customersLoader, editSalesLoader, salesLoader, viewSalesLoader } from "../requests/_saleRequests";

export const appPaths =  [
    {
      path: "/",
      element: <Homepage />,
    },
    {
      element: <App />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/materials",
          element: <Material />,
          // loader: getMaterials,
        },
        {
          path: "/materials/:id/view",
          element: <ViewMaterial />,
          loader: viewMaterialLoader,
        },
        {
          path: "/materials/add",
          element: <AddMaterial />,
        },
        {
          path: "/materials/:id/edit",
          element: <EditMaterial />,
          loader: materialLoader,
        },
        {
          path: "/intermediate-goods",
          element: <IntermediateGoods />,
          loader: productsLoader
        },
        {
          path: "/intermediate-goods/add",
          element: <AddIntermediateGoods />,
        },
        {
          path: "/intermediate-goods/:slug/edit",
          element: <EditIntermediateGood />,
          loader: intermediateGoodViewLoader
        },
        {
          path: "/intermediate-goods/:slug/view",
          element: <ViewIntermediateGood />,
          loader: intermediateGoodViewLoader
        },
        {
          path: "/products",
          element: <Product />,
          loader: productsLoader
        },
        {
          path: "/products/add",
          element: <AddProduct />,
        },
        {
          path: "/products/:slug/edit",
          element: <EditProduct />,
          loader: productViewLoader
        },
        {
          path: "/products/:slug/view",
          element: <ViewProduct />,
          loader: productViewLoader
        },
        {
          path: "/purchases",
          element: <Purchase />,
        },
        {
          path: "/purchases/add",
          element: <AddPurchase />,
        },
        {
          path: "/purchases/:id/edit",
          element: <EditPurchase />,
          loader: purchaseLoader,
        },
        {
          path: "/purchases/suppliers",
          element: <Suppliers />,
        },
        {
          path: "/productions",
          element: <Production />,
          loader: productionsLoader
        },
        {
          path: "/productions/:id/edit",
          element: <EditProduction />,
          loader: productionLoader
        },
        {
          path: "/productions/:id/view",
          element: <ViewProduction />,
          loader: productionViewLoader
        },
        {
          path: "/reports",
          element: <Report />,
        },
        {
          path: "/employees",
          element: <Employees />,
        },
        {
          path: "/employees/add",
          element: <AddEmployee />,
        },
        {
          path: "/employees/:id/edit",
          element: <EditEmployee />,
          loader: employeeLoader
        },
        {
          path: "/sales",
          element: <Sale />,
          loader: salesLoader
        },
        {
          path: "/sales/add",
          element: <AddSale />
        },
        {
          path: "/sales/:id/edit",
          element: <EditSale />,
          loader: editSalesLoader
        },
        {
          path: "/sales/:id/view",
          element: <ViewSale />,
          loader: viewSalesLoader
        },
        {
          path: "/sales/customers",
          element: <Customer />,
          loader: customersLoader
        },
        {
          path: "/sales/customers/add",
          element: <AddCustomer />
        },
        {
          path: "/sales/customers/:id/edit",
          element: <EditCustomer />,
          loader: customerLoader
        },
        {
          path: "/sales/customers/:id/view",
          element: <ViewCustomer />,
          loader: customerLoader
        },
        {
          path: "/assets",
          element: <Asset />,
        },
        {
          path: "/reconciliations",
          element: <Reconciliation />,
        },
        {
          path: "/reconciliations/:id/view",
          element: <ViewReconciliation />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/my-business",
          element: <BusinessProfile />,
        },
      ]
    },
    {
      element: <GuestLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/password-confirmed",
          element: <PasswordConfirmed />,
        },
      ]
    },
    {
      path: "/business-setup",
      element: <BusinessSetup />,
    },
    {
      path: "/verify-email",
      element: <VerifyEmail />,
    },
    {
      path: "/splash-screen",
      element: <SplashScreen />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]