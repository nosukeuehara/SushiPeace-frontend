import { DummyRouter } from "./DummyRouter";

const Wrapper: React.JSXElementConstructor<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <DummyRouter
      component={() => {
        return children;
      }}
    />
  );
};

export default Wrapper;
