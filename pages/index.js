import {
  Heading,
  Page,
  Card,
  Layout,
  FormLayout,
  TextField,
  EmptyState,
  DataTable,
  rows
} from "@shopify/polaris";
import { Provider, TitleBar } from "@shopify/app-bridge-react";
import EmptyHome from "../components/EmptyHome";
import FAQList from "../components/FAQList";

const Index = (props) => {

  return (
    <>
      {/* <EmptyHome /> */}
      <FAQList />
    </>
  );
};

export default Index;
