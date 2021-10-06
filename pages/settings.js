import { Heading, Page, Card, Layout, FormLayout, TextField } from "@shopify/polaris";
import {Provider, TitleBar} from '@shopify/app-bridge-react';

const SettingsPage = (props) => {
  console.log(props);
  return (
    <Page
      title="Orders"
      primaryAction={{ content: "Create order" }}
      secondaryActions={[{ content: "Export" }]}
      pagination={{
        hasNext: true,
      }}
    >
      <TitleBar title="Settings"/>
      <Layout>
      <Heading>THIS IS THE SETTINGS PAGE</Heading>
        </Layout>
      
     
    </Page>
  );
};

export default SettingsPage;
