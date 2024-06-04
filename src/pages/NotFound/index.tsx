import { observer } from "mobx-react-lite";
import EmptyBlock from "../../components/EmptyBlock";

const NotFound = () => {
  return (
    <div>
      <EmptyBlock title="К сожалению такой страницы не существует" />
    </div>
  );
};

export default observer(NotFound);
