import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { EmailValidation } from "./pages/EmailValidation";
import { CompleteRegistration } from "./pages/CompleteRegistration";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Dashboard } from "./pages/Dashboard";
import { Auctions } from "./pages/Auctions";
import { AuctionDetail } from "./pages/AuctionDetail";
import { LiveAuction } from "./pages/LiveAuction";
import { MyBids } from "./pages/MyBids";
import { SellItem } from "./pages/SellItem";
import { PaymentMethods } from "./pages/PaymentMethods";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import { MySales } from "./pages/MySales";
import { MyPurchases } from "./pages/MyPurchases";
import { MyDocuments } from "./pages/MyDocuments";
import Notifications from "./pages/Notifications";
import { ModalDemo } from "./pages/ModalDemo";
import { AuctionSummary } from "./pages/AuctionSummary";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "email-validation", Component: EmailValidation },
      { path: "complete-registration", Component: CompleteRegistration },
      { path: "forgot-password", Component: ForgotPassword },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      { path: "auctions", Component: Auctions },
      { path: "auctions/:id", Component: AuctionDetail },
      {
        path: "auctions/:id/live",
        element: (
          <ProtectedRoute>
            <LiveAuction />
          </ProtectedRoute>
        )
      },
      {
        path: "auctions/:id/summary",
        element: (
          <ProtectedRoute>
            <AuctionSummary />
          </ProtectedRoute>
        )
      },
      {
        path: "my-bids",
        element: (
          <ProtectedRoute>
            <MyBids />
          </ProtectedRoute>
        )
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        )
      },
      {
        path: "sell-item",
        element: (
          <ProtectedRoute>
            <SellItem />
          </ProtectedRoute>
        )
      },
      {
        path: "payment-methods",
        element: (
          <ProtectedRoute>
            <PaymentMethods />
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        )
      },
      {
        path: "my-sales",
        element: (
          <ProtectedRoute>
            <MySales />
          </ProtectedRoute>
        )
      },
      {
        path: "my-purchases",
        element: (
          <ProtectedRoute>
            <MyPurchases />
          </ProtectedRoute>
        )
      },
      {
        path: "my-documents",
        element: (
          <ProtectedRoute>
            <MyDocuments />
          </ProtectedRoute>
        )
      },
      {
        path: "modal-demo",
        element: (
          <ProtectedRoute>
            <ModalDemo />
          </ProtectedRoute>
        )
      },
      { path: "*", Component: NotFound },
    ],
  },
]);