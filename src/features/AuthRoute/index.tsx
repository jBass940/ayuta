import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

type AuthWrapperProps = {
  element: JSX.Element;
  isAuthorized: boolean;
};

const AuthRoute = ({ element, isAuthorized }: AuthWrapperProps) => {
  return isAuthorized ? <Navigate to="/" /> : element;
};

export default observer(AuthRoute);
