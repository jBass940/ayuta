import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

type AuthWrapperProps = {
  element: JSX.Element;
  isAuthorized: boolean;
};

const ProtectedRoute = ({ element, isAuthorized }: AuthWrapperProps) => {
  return isAuthorized ? element : <Navigate to="/" />;
};

export default observer(ProtectedRoute);
