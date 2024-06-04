import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { AuthStore } from "../../store/authStore";

type AuthWrapperProps = {
  element: ReactElement;
  authStore: AuthStore;
};

const PublicRoute = ({ element, authStore }: AuthWrapperProps) => {
  return authStore.uid ? <Navigate to={`/profile/${authStore.uid}`} replace /> : element;
};

export default observer(PublicRoute);
